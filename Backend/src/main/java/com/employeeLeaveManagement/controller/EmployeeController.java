
package com.employeeLeaveManagement.controller;

import com.employeeLeaveManagement.dto.dtos.CreateEmployeeRequest;
import com.employeeLeaveManagement.dto.dtos.EmployeeResponse;
import com.employeeLeaveManagement.dto.dtos.LeaveTypeResponse;
import com.employeeLeaveManagement.exception.*;
import com.employeeLeaveManagement.entity.*;
import com.employeeLeaveManagement.repository.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/api/employees")
    @PreAuthorize("hasRole('MANAGER')")
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(EmployeeResponse::from)
                .toList();
    }

    @PostMapping("/api/employees")
    @PreAuthorize("hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public EmployeeResponse createEmployee(
            Authentication authentication,
            @Valid @RequestBody CreateEmployeeRequest request) {

        String email = request.email().trim().toLowerCase();

        if (employeeRepository.existsByEmail(email)) {
            throw new LeaveValidationException(
                    "Email is already registered"
            );
        }

        Employee manager;

        if (request.managerId() != null) {
            manager = employeeRepository.findById(request.managerId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Manager not found")
                    );
        } else {
            manager = employeeRepository.findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Manager not found")
                    );
        }

        Employee newEmployee = Employee.builder()
                .name(request.name())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .manager(manager)
                .build();

        Employee savedEmployee =
                employeeRepository.save(newEmployee);

        int currentYear = LocalDate.now().getYear();

        List<LeaveType> leaveTypes = leaveTypeRepository.findAll();

        for (LeaveType leaveType : leaveTypes) {

            LeaveBalance balance = LeaveBalance.builder()
                    .employee(savedEmployee)
                    .leaveType(leaveType)
                    .year(currentYear)
                    .remainingDays(leaveType.getAnnualQuota())
                    .build();

            leaveBalanceRepository.save(balance);
        }

        return EmployeeResponse.from(savedEmployee);
    }

    @GetMapping("/api/leave-types")
    public List<LeaveTypeResponse> getAllLeaveTypes() {

        return leaveTypeRepository.findAll()
                .stream()
                .map(LeaveTypeResponse::from)
                .toList();
    }
}
