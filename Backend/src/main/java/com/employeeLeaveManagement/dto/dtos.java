
package com.employeeLeaveManagement.dto;

import com.employeeLeaveManagement.entity.*;
import jakarta.validation.constraints.*;

import java.time.Instant;
import java.time.LocalDate;

public final class dtos {

    private dtos() {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record LoginResponse(
            String token,
            String name,
            String role
    ) {
    }

    public record ApplyLeaveRequest(
            @NotNull Long leaveTypeId,
            @NotNull LocalDate startDate,
            @NotNull LocalDate endDate,
            @NotBlank @Size(max = 500) String reason
    ) {
    }

    public record DecisionRequest(
            @Size(max = 500) String comment
    ) {
    }

    public record CreateEmployeeRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password,
            @NotNull Role role,
            Long managerId
    ) {
    }

    public record EmployeeResponse(
            Long id,
            String name,
            String email,
            Role role,
            Long managerId
    ) {
        public static EmployeeResponse from(Employee employee) {

            Long managerId = null;

            if (employee.getManager() != null) {
                managerId = employee.getManager().getId();
            }

            return new EmployeeResponse(
                    employee.getId(),
                    employee.getName(),
                    employee.getEmail(),
                    employee.getRole(),
                    managerId
            );
        }
    }

    public record LeaveTypeResponse(
            Long id,
            String name,
            int annualQuota
    ) {
        public static LeaveTypeResponse from(LeaveType leaveType) {
            return new LeaveTypeResponse(
                    leaveType.getId(),
                    leaveType.getName(),
                    leaveType.getAnnualQuota()
            );
        }
    }

    public record BalanceResponse(
            String leaveType,
            int year,
            int quota,
            int remainingDays
    ) {
        public static BalanceResponse from(LeaveBalance balance) {
            return new BalanceResponse(
                    balance.getLeaveType().getName(),
                    balance.getYear(),
                    balance.getLeaveType().getAnnualQuota(),
                    balance.getRemainingDays()
            );
        }
    }

    public record LeaveResponse(
            Long id,
            String employeeName,
            String leaveType,
            LocalDate startDate,
            LocalDate endDate,
            int days,
            String reason,
            LeaveStatus status,
            String managerComment,
            Instant createdAt
    ) {
        public static LeaveResponse from(LeaveRequest request) {
            return new LeaveResponse(
                    request.getId(),
                    request.getEmployee().getName(),
                    request.getLeaveType().getName(),
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getDays(),
                    request.getReason(),
                    request.getStatus(),
                    request.getManagerComment(),
                    request.getCreatedAt()
            );
        }
    }
}
