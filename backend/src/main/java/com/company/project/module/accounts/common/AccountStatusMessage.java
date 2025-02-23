package com.company.project.module.accounts.common;

import lombok.Getter;

@Getter
public enum AccountStatusMessage {

  DELETE_SUCCESS("The account was deleted successfully"),
  UPDATE_SUCCESS("The account was updated successfully"),
  NOT_EXIST("The account is not exist"),
  UNKNOWN_ATTRIBUTE("The attribute does not exist"),
  EXIST_NAME("The account's name have been existed"),
  STRING_VALUE("The account's price must be a valid number"),
  NEGATIVE_VALUE("The variable must be greater than 0"),
  LESS_THAN_ZERO("The index must not be less than 0"),
  CREATE_SUCCESS("The account was created successfully"),
  GET_SUCCESS("Get all accounts successfully"),
  EMPTY_NAME("The account name must not be empty"),
  EMPTY_PASSWORD("The account password must not be empty"),
  EMPTY_EMAIL("The email of customer must not be empty"),
  EMPTY_PHONE("The phone of customer must not be empty"),
  EMPTY_CUSTOMER_NAME("The name of customer must not be empty"),
  UNAUTHORIZED("Unauthorized"),
  TOKEN_SUCCESS("The token has been successfully"),
  TOKEN_VERIFY_SUCCESS("The token has been verified successfully");

  private final String message;

  AccountStatusMessage(String message) {
    this.message = message;
  }
}
