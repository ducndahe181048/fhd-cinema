package com.company.project.module.vouchers.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VoucherDto {
    String voucherId;
    String voucherCode;
    String voucherName;
    String voucherDescription;
    int voucherDiscountPercent;
    LocalDateTime voucherStartedAt;
    LocalDateTime voucherEndedAt;
}
