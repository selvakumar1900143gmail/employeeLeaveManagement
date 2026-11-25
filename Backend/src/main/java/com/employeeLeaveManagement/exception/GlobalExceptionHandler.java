
package com.employeeLeaveManagement.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(LeaveValidationException.class)
    public ResponseEntity<ApiError> handleLeaveValidation(
            LeaveValidationException e) {

        return build(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ResourceNotFoundException e) {

        return build(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(
            BadCredentialsException e) {

        return build(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            AccessDeniedException e) {

        return build(
                HttpStatus.FORBIDDEN,
                "You are not allowed to do this"
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleInvalidBody(
            MethodArgumentNotValidException e) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        error.getField() + " " + error.getDefaultMessage()
                )
                .collect(Collectors.joining("; "));

        return build(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpectedError(
            Exception e) {

        log.error("Unhandled error", e);

        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected server error"
        );
    }

    private ResponseEntity<ApiError> build(
            HttpStatus status,
            String message) {

        ApiError error = new ApiError(
                status.value(),
                message,
                Instant.now()
        );

        return ResponseEntity.status(status).body(error);
    }
}
