package com.company.project.module.accounts.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.company.project.common.ApiPagination;
import com.company.project.common.Status;
import com.company.project.module.accounts.common.AccountStatusMessage;
import com.company.project.module.accounts.dto.request.AccountCreationRequest;
import com.company.project.module.accounts.dto.request.AccountUpdateRequest;
import com.company.project.module.accounts.dto.response.AccountDto;
import com.company.project.module.accounts.entity.Account;
import com.company.project.module.accounts.exception.AccountException;
import com.company.project.module.accounts.repository.AccountRepository;
import com.company.project.module.customers.dto.request.CustomerCreationRequest;
import com.company.project.module.customers.entity.Customer;
import com.company.project.module.customers.service.CustomerService;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {

  private final ModelMapper modelMapper;

  private final AccountRepository accountRepository;
  private final CustomerService customerService;

  public AccountService(ModelMapper modelMapper, AccountRepository accountRepository, CustomerService customerService) {
    this.modelMapper = modelMapper;
    this.accountRepository = accountRepository;
    this.customerService = customerService;
  }

  public List<AccountDto> getAllAccounts() {
    List<Account> accounts = accountRepository.findAll();

    List<AccountDto> accountDtos = new ArrayList<>();

    for (Account account : accounts) {
      AccountDto accountDto = this.convertToAccountDto(account);
      accountDtos.add(accountDto);
    }

    return accountDtos;
  }

  public AccountDto getAccountById(String accountId) {
    Account account = accountRepository.findById(accountId)
        .orElseThrow(() -> new AccountException(
            Status.FAIL.getValue(),
            AccountStatusMessage.NOT_EXIST.getMessage()));

    return this.convertToAccountDto(account);
  }

  public ApiPagination<AccountDto> searchAccountsByName(String accountName, int page, List<String> filters, 
        String sortBy, String sortDirection, int pageSize) {
    if (page < 1 || pageSize < 1) {
      throw new AccountException(Status.FAIL.getValue(), AccountStatusMessage.LESS_THAN_ZERO.getMessage());
    }

    Sort.Direction direction = Sort.Direction.fromString(sortDirection);

    Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(direction, sortBy));

    Page<Account> accountPage;
    long count;

    if (filters != null) {
      accountPage = accountRepository.findByAccountNameContainingIgnoreCaseAndAccountTypeIn(
          accountName, filters, pageable);
      count = accountRepository.countByAccountNameContainingIgnoreCaseAndAccountTypeIn(accountName, filters);
    } else {
      accountPage = accountRepository.findByAccountNameContainingIgnoreCase(accountName, pageable);
      count = accountRepository.countByAccountNameContainingIgnoreCase(accountName);
    }

    List<AccountDto> accountDtos = accountPage.getContent().stream()
        .map(this::convertToAccountDto)
        .collect(Collectors.toList());

    ApiPagination<AccountDto> accountPagination = ApiPagination.<AccountDto>builder()
        .result(accountDtos)
        .count(count)
        .build();

    return accountPagination;
  }

  private AccountDto convertToAccountDto(Account account) {
    AccountDto accountDto = modelMapper.map(account, AccountDto.class);

    return accountDto;
  }

  public AccountDto createAccount(AccountCreationRequest request) {
    if (accountRepository.existsByAccountName(request.getAccountName())) {
      throw new AccountException(Status.FAIL.getValue(), AccountStatusMessage.EXIST_NAME.getMessage());
    }

    Account account = Account.builder()
        .accountName(request.getAccountName())
        .accountPassword(this.encodePassWordByBCryptPassword(request.getAccountPassword()))
        .accountType(request.getAccountType())
        .build();
    accountRepository.save(account);

    Customer customer = null;
    if(request.getAccountType().equalsIgnoreCase("Customer")) {
      CustomerCreationRequest customerCreationRequest = new CustomerCreationRequest();
      customerCreationRequest.setCustomerName(request.getAccountName());
      customerCreationRequest.setCustomerPhone(request.getCustomerPhone());
      customerCreationRequest.setCustomerEmail(request.getCustomerEmail());
      customerCreationRequest.setAccountId(account.getAccountId());

      customer = customerService.createCustomer(customerCreationRequest);
    }

    AccountDto accountDto = this.convertToAccountDto(account);
    if(customer != null) {
      accountDto.setCustomerId(customer.getCustomerId());
      accountDto.setCustomerName(customer.getCustomerName());
      accountDto.setCustomerPhone(customer.getCustomerPhone());
      accountDto.setCustomerEmail(customer.getCustomerEmail());
    }

    return accountDto;
  }

  public AccountDto updateAccount(String accountId, AccountUpdateRequest request) {
    Account existingAccount = accountRepository.findById(accountId)
        .orElseThrow(() -> new AccountException(Status.FAIL.getValue(), AccountStatusMessage.NOT_EXIST.getMessage()));

    if (!existingAccount.getAccountName().equals(request.getAccountName())
        && accountRepository.existsByAccountName(request.getAccountName())) {
      throw new AccountException(Status.FAIL.getValue(), AccountStatusMessage.EXIST_NAME.getMessage());
    }

    existingAccount.setAccountType(request.getAccountType());
    existingAccount.setAccountPassword(this.encodePassWordByBCryptPassword(request.getAccountPassword()));

    if (!existingAccount.getAccountName().equals(request.getAccountName())) {
      existingAccount.setAccountName(request.getAccountName());
    }
    accountRepository.save(existingAccount);

    return this.convertToAccountDto(existingAccount);
  }

  public String encodePassWordByBCryptPassword(String password) {
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    return passwordEncoder.encode(password);
  }

  @Transactional
  public void deleteAccountById(String accountId) {
    if (!accountRepository.existsById(accountId)) {
      throw new AccountException(Status.FAIL.getValue(), AccountStatusMessage.NOT_EXIST.getMessage());
    }

    accountRepository.deleteById(accountId);
  }

}
