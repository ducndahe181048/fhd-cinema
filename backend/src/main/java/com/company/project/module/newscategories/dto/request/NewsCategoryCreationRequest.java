package com.company.project.module.newscategories.dto.request;

import jakarta.validation.constraints.NotEmpty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsCategoryCreationRequest {
  @NotEmpty(message = "EMPTY_NAME")
  String newsCategoryName;
}
