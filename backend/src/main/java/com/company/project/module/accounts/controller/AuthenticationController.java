package com.company.project.module.accounts.controller;

import com.company.project.common.ApiResponse;
import com.company.project.common.Status;
import com.company.project.module.accounts.common.AccountStatusMessage;
import com.company.project.module.accounts.dto.request.AuthenticationRequest;
import com.company.project.module.accounts.dto.request.IntrospectRequest;
import com.company.project.module.accounts.dto.request.SignInRequest;
import com.company.project.module.accounts.dto.response.AuthenticationResponse;
import com.company.project.module.accounts.dto.response.IntrospectResponse;
import com.company.project.module.accounts.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/token")
    ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ResponseEntity.status(HttpStatus.OK.value())
                .body(ApiResponse.<AuthenticationResponse>builder()
                        .data(result)
                        .status(Status.SUCCESS.getValue())
                        .message(AccountStatusMessage.TOKEN_SUCCESS.getMessage())
                        .build());
    }

    @PostMapping("/introspect")
    ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ResponseEntity.status(HttpStatus.OK.value())
                .body(ApiResponse.<IntrospectResponse>builder()
                        .data(result)
                        .status(Status.SUCCESS.getValue())
                        .message(AccountStatusMessage.TOKEN_VERIFY_SUCCESS.getMessage())
                        .build());
    }

    @PostMapping("/sign-in") // New endpoint for signing in
    ResponseEntity<ApiResponse<String>> signIn(@RequestBody @Valid SignInRequest request) {
        String token = authenticationService.signIn(request); // Implement signIn in your service

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value())
                    .body(ApiResponse.<String>builder()
                            .status(Status.FAIL.getValue())
                            .message("The account's name has been existed")
                            .build());
        }

        return ResponseEntity.ok()
                .body(ApiResponse.<String>builder()
                        .status(Status.SUCCESS.getValue())
                        .message("Sign-in successful")
                        .data(token) // Assuming you return a token on successful sign-in
                        .build());
    }
}