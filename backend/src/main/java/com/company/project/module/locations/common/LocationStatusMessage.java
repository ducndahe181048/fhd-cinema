package com.company.project.module.locations.common;

import lombok.Getter;

@Getter
public enum LocationStatusMessage {

    DELETE_SUCCESS("The location was deleted successfully"),
    UPDATE_SUCCESS("The location was updated successfully"),
    NOT_EXIST("The location is not exist"),
    UNKNOWN_ATTRIBUTE("The attribute does not exist"),
    LESS_THAN_ZERO("The index must not be less than 0"),
    LOCATION_EXIST("The location is existed"),
    CREATE_SUCCESS("The location was created successfully"),
    GET_SUCCESS("Get all locations successfully"),
    EMPTY_NAME("The location name must not be empty");

    private final String message;

    LocationStatusMessage(String message) {
        this.message = message;
    }

}
