import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CheckoutPricingSummary from './CheckoutPricingSummary';  // Thành phần hiển thị chi tiết giá

const Checkout = () => {
  const { state } = useLocation();  // Lấy dữ liệu truyền từ OrderFood qua
  const { selectedSeats, showtimeDetails, movieTitle, totalPrice, snacks, moviePosterUrl } = state || {};

  const [vouchers, setVouchers] = useState([]); // Lưu danh sách voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher đã chọn
  const [paymentMethod, setPaymentMethod] = useState(''); // Phương thức thanh toán

  // Gọi API lấy danh sách voucher
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/vouchers');
        setVouchers(response.data.data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, []);

  // Tính giảm giá từ voucher đã chọn
  const calculateDiscount = () => {
    if (selectedVoucher) {
      return totalPrice * (selectedVoucher.voucherDiscountPercent / 100);
    }
    return 0;
  };

  // Tổng tiền thanh toán sau khi trừ giảm giá
  const finalPrice = totalPrice - calculateDiscount();

  const handlePayment = () => {
    // Xử lý logic thanh toán ở đây
    alert("Thanh toán thành công!");
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="text-center mb-4" style={{ fontSize: '1.9rem', fontWeight: 'bold' }}>
        BƯỚC 4: THANH TOÁN
      </h2>
      
      <Row>
        {/* Chi tiết thông tin đặt vé */}
        <Col xs={12} md={8}>
          <CheckoutPricingSummary
            movieTitle={movieTitle}
            showtimeDetails={showtimeDetails}
            selectedSeats={selectedSeats}
            snacks={snacks}
            totalPrice={totalPrice}
            discount={calculateDiscount()} // Truyền số tiền giảm giá vào
            finalPrice={finalPrice} // Truyền tổng tiền sau giảm giá
          />
        </Col>

        {/* Chọn voucher */}
        <Col xs={12} md={4}>
          <h5>Chọn Giảm Giá</h5>
          <Form.Group>
            <Form.Label>Chọn Voucher</Form.Label>
            <Form.Control
              as="select"
              value={selectedVoucher ? selectedVoucher.voucherId : ''}
              onChange={(e) => setSelectedVoucher(vouchers.find(v => v.voucherId === e.target.value))}
            >
              <option value="">Chọn voucher</option>
              {vouchers.map(voucher => (
                <option key={voucher.voucherId} value={voucher.voucherId}>
                  {voucher.voucherName} - Giảm {voucher.voucherDiscountPercent}%
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Chọn phương thức thanh toán */}
          <h5 className="mt-4">Chọn Hình Thức Thanh Toán</h5>
          <Form>
            <Form.Check type="radio" label="ATM card (Thẻ nội địa)" name="paymentMethod" />
            <Form.Check type="radio" label="Thẻ quốc tế (Visa, Master, Amex, JCB)" name="paymentMethod" />
            <Form.Check type="radio" label="MoMo" name="paymentMethod" />
            <Form.Check type="radio" label="ZaloPay" name="paymentMethod" />
            <Form.Check type="radio" label="ShopeePay" name="paymentMethod" />
            <Button variant="primary" className="mt-3" block onClick={handlePayment}>
              Xác Nhận Thanh Toán
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
