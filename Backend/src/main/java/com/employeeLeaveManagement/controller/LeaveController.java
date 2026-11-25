
package com.employeeLeaveManagement.controller;

import com.employeeLeaveManagement.dto.dtos.*;
import com.employeeLeaveManagement.exception.ResourceNotFoundException;
import com.employeeLeaveManagement.entity.Employee;
import com.employeeLeaveManagement.repository.EmployeeRepository;
import com.employeeLeaveManagement.service.LeaveService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveResponse applyForLeave(
            Authentication authentication,
            @Valid @RequestBody ApplyLeaveRequest request) {

        Employee employee = getLoggedInEmployee(authentication);

        return LeaveResponse.from(
                leaveService.apply(employee, request)
        );
    }

    @GetMapping("/my")
    public List<LeaveResponse> getMyLeaves(
            Authentication authentication) {

        Employee employee = getLoggedInEmployee(authentication);

        return leaveService.myLeaves(employee)
                .stream()
                .map(LeaveResponse::from)
                .toList();
    }

    @GetMapping("/balance")
    public List<BalanceResponse> getMyLeaveBalance(
            Authentication authentication) {

        Employee employee = getLoggedInEmployee(authentication);

        return leaveService.myBalances(employee)
                .stream()
                .map(BalanceResponse::from)
                .toList();
    }

    @PutMapping("/{id}/cancel")
    public LeaveResponse cancelLeave(
            Authentication authentication,
            @PathVariable Long id) {

        Employee employee = getLoggedInEmployee(authentication);

        return LeaveResponse.from(
                leaveService.cancel(employee, id)
        );
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MANAGER')")
    public List<LeaveResponse> getPendingLeaves(
            Authentication authentication) {

        Employee manager = getLoggedInEmployee(authentication);

        return leaveService.pendingForManager(manager)
                .stream()
                .map(LeaveResponse::from)
                .toList();
    }

    @GetMapping("/team")
    @PreAuthorize("hasRole('MANAGER')")
    public List<LeaveResponse> getTeamLeaves(
            Authentication authentication) {

        Employee manager = getLoggedInEmployee(authentication);

        return leaveService.teamLeaves(manager)
                .stream()
                .map(LeaveResponse::from)
                .toList();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER')")
    public LeaveResponse approveLeave(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) DecisionRequest request) {

        Employee manager = getLoggedInEmployee(authentication);

        String comment = request == null ? null : request.comment();

        return LeaveResponse.from(
                leaveService.approve(manager, id, comment)
        );
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public LeaveResponse rejectLeave(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) DecisionRequest request) {

        Employee manager = getLoggedInEmployee(authentication);

        String comment = request == null ? null : request.comment();

        return LeaveResponse.from(
                leaveService.reject(manager, id, comment)
        );
    }

    private Employee getLoggedInEmployee(Authentication authentication) {

        return employeeRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );
    }
}
