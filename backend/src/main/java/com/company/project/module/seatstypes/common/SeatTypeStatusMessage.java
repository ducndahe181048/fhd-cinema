package com.company.project.module.seatstypes.common;

import lombok.Getter;

@Getter
public enum SeatTypeStatusMessage {

  DELETE_SUCCESS("The seat type deleted successfully"),
  UPDATE_SUCCESS("The seat type updated successfully"),
  EMPTY_TYPE_NAME("The name of seat's type must not be empty"),
  NOT_EXIST("The seat type's Id does not exist"),
  UNKNOWN_ATTRIBUTE("The attribute does not exist"),
  LESS_THAN_ZERO("The index must not be less than 0"),
  EXIST_TYPE("The seat type have been existed"),
  STRING_VALUE("The ticket's price must be a valid number"),
  NEGATIVE_VALUE("The variable must be greater than 0"),
  CREATE_SUCCESS("The seat type has been created successfully"),
  GET_SUCCESS("Get seat type successfully");

  private final String message;

  SeatTypeStatusMessage(String message) {
    this.message = message;
  }

}
