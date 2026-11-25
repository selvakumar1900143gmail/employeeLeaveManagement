
package com.employeeLeaveManagement.controller;

import com.employeeLeaveManagement.dto.dtos.*;
import com.employeeLeaveManagement.entity.Employee;
import com.employeeLeaveManagement.repository.EmployeeRepository;
import com.employeeLeaveManagement.security.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        Employee employee = employeeRepository.findByEmail(email)
                .filter(existingEmployee ->
                        passwordEncoder.matches(
                                request.password(),
                                existingEmployee.getPasswordHash()
                        )
                )
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        )
                );

        String token = jwtUtil.generate(
                employee.getEmail(),
                employee.getRole().name()
        );

        return new LoginResponse(
                token,
                employee.getName(),
                employee.getRole().name()
        );
    }
}
