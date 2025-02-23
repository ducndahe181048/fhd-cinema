package com.company.project.module.bills.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.company.project.common.ApiPagination;
import com.company.project.common.Status;
import com.company.project.module.bills.common.BillStatusMessage;
import com.company.project.module.bills.dto.request.BillCreationRequest;
import com.company.project.module.bills.dto.response.BillDto;
import com.company.project.module.bills.entity.Bill;
import com.company.project.module.bills.exception.BillException;
import com.company.project.module.bills.repository.BillRepository;
import com.company.project.module.bookings.dto.response.BookingDto;
import com.company.project.module.bookings.entity.Booking;
import com.company.project.module.bookings.repository.BookingRepository;
import com.company.project.module.bookings.service.BookingService;
import com.company.project.module.seats.dto.response.SeatDto;
import com.company.project.module.seats.service.SeatService;
import com.company.project.module.tickets.entity.Ticket;
import com.company.project.module.tickets.service.TicketService;
import com.company.project.module.vouchers.entity.Voucher;
import com.company.project.module.vouchers.service.VoucherService;
import com.company.project.utils.Utils;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BillService {

  private final BillRepository billRepository;
  private final BookingService bookingService;
  private final Utils utils;
  private final ModelMapper modelMapper;
  private final VoucherService voucherService;
  private final TicketService ticketService;
  private final SeatService seatService;
  private final BookingRepository bookingRepository;

  public BillService(BillRepository billRepository, BookingService bookingService,
      Utils utils, ModelMapper modelMapper, @Lazy VoucherService voucherService,
      TicketService ticketService, SeatService seatService, BookingRepository bookingRepository) {
    this.billRepository = billRepository;
    this.bookingService = bookingService;
    this.utils = utils;
    this.modelMapper = modelMapper;
    this.voucherService = voucherService;
    this.ticketService = ticketService;
    this.seatService = seatService;
    this.bookingRepository = bookingRepository;
  }

  private BillDto convertToBillDto(Bill bill) {
    BillDto billDto = modelMapper.map(bill, BillDto.class);
    billDto.setBookingDto(modelMapper.map(bill.getBooking(), BookingDto.class));

    return billDto;
  }

  public List<BillDto> getAllBills() {
    List<Bill> bills = billRepository.findAllByIsDeletedFalse();
    bills.forEach(this::calculateTotalBillPrice);
    return bills.stream()
        .map(this::convertToBillDto)
        .collect(Collectors.toList());
  }

  public Bill getBillById(String billId) {
    Bill bill = billRepository.findByBillIdAndIsDeletedFalse(billId);
    if (bill == null) {
      throw new BillException(Status.FAIL.getValue(), BillStatusMessage.NOT_EXIST.getMessage());
    }
    this.calculateTotalBillPrice(bill);
    return bill;
  }

  public BillDto getBillDtoById(String billId) {
    Bill bill = this.getBillById(billId);
    return this.convertToBillDto(bill);
  }

  @Transactional(rollbackFor = Exception.class)
  public BillDto createBill(BillCreationRequest request) {
    Booking booking = bookingService.createBooking(request.getShowtimeId(), request.getCustomerId());

    Set<String> validSeatIds = seatService.getSeatsByScreenId(booking.getShowtime().getScreen().getScreenId())
        .stream()
        .map(SeatDto::getSeatId)
        .collect(Collectors.toSet());

    Set<String> requestedSeatIds = new HashSet<>(request.getSeatIds());
    if (requestedSeatIds.size() != request.getSeatIds().size()) {
        throw new BillException(Status.FAIL.getValue(), BillStatusMessage.DUPLICATE_SEAT.getMessage());
    }

    List<Ticket> tickets = new ArrayList<>();

    if (request.getSeatIds() != null) {
      for (String seatId : requestedSeatIds) {
        if (validSeatIds.contains(seatId)) {
          Ticket ticket = ticketService.createTicket(booking.getBookingId(), seatId);
          tickets.add(ticket);
        } else {
          throw new BillException(Status.FAIL.getValue(), BillStatusMessage.INVALID_SEAT.getMessage());
        }
      }
    }

    booking.setTickets(tickets);

    if (request.getSnackIds() != null) {
      for (String snackId : request.getSnackIds()) {
        bookingService.addSnackToBooking(booking.getBookingId(), snackId);
      }
    }

    bookingService.calculateTotalBookingPrice(booking);
    bookingRepository.save(booking);

    Bill bill = Bill.builder()
        .booking(booking)
        .billCreatedAt(LocalDateTime.now())
        .build();
    billRepository.save(bill);

    if (request.getVoucherIds() != null) {
      for (String voucherId : request.getVoucherIds()) {
        addVoucherToBill(bill.getBillId(), voucherId);
      }
    }

    this.calculateTotalBillPrice(bill);
    billRepository.save(bill);
    return convertToBillDto(bill);
  }

  public void deleteBillById(String billId) {
    Bill existedBill = this.getBillById(billId);

    bookingService.deleteBookingById(existedBill.getBooking().getBookingId());
    existedBill.setDeleted(true);
    billRepository.save(existedBill);
  }

  public void removeVoucherFromBill(String billId, String voucherId) {
    Bill bill = this.getBillById(billId);

    Voucher voucher = voucherService.getVoucherById(voucherId);

    if (bill.getVouchers().contains(voucher)) {
      bill.getVouchers().remove(voucher);
      billRepository.save(bill);
    } else {
      throw new BillException(Status.FAIL.getValue(), BillStatusMessage.INVALID_VOUCHER.getMessage());
    }
  }

  public void addVoucherToBill(String billId, String voucherId) {
    Bill bill = this.getBillById(billId);

    Voucher voucher = voucherService.getVoucherById(voucherId);

    if (!bill.getVouchers().contains(voucher)) {
      bill.getVouchers().add(voucher);
      billRepository.save(bill);
    } else {
      throw new BillException(Status.FAIL.getValue(), BillStatusMessage.EXIST_VOUCHER.getMessage());
    }
  }

  public ApiPagination<BillDto> filterBills(String billId, int page, int pageSize,
      List<Boolean> isPaids, String sortBy, String sortDirection) {
    if (page < 1 || pageSize < 1) {
      throw new BillException(Status.FAIL.getValue(), BillStatusMessage.LESS_THAN_ZERO.getMessage());
    }

    List<String> billFieldNames = utils.getEntityFields(Bill.class);
    if (!billFieldNames.contains(sortBy)) {
      throw new BillException(Status.FAIL.getValue(), BillStatusMessage.UNKNOWN_ATTRIBUTE.getMessage());
    }

    Sort.Direction direction = Sort.Direction.fromString(sortDirection);
    Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(direction, sortBy));

    Page<Bill> billPages = billRepository.searchBills(billId, isPaids, pageable);
    long count = billRepository.countBills(billId, isPaids);

    List<BillDto> billDtos = billPages.getContent().stream()
        .map(this::convertToBillDto)
        .collect(Collectors.toList());

    return ApiPagination.<BillDto>builder()
        .result(billDtos)
        .count(count)
        .build();
  }

  public void calculateTotalBillPrice(Bill bill) {
    int bookingPrice = bill.getBooking().getBookingPrice();

    int totalDiscountPercent = 0;

    if (bill.getVouchers() != null) {
      totalDiscountPercent = bill.getVouchers().stream()
          .mapToInt(Voucher::getVoucherDiscountPercent)
          .sum();

      totalDiscountPercent = Math.min(totalDiscountPercent, 100);
    }

    int totalAmount = bookingPrice * (100 - totalDiscountPercent) / 100;

    bill.setBillAmount(totalAmount);
  }

  public void setBillAsPaid(String billId) {
    Bill bill = this.getBillById(billId);

    bill.setPaid(true);

    billRepository.save(bill);
  }

}
