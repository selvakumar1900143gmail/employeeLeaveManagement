
package com.employeeLeaveManagement.service;

import com.employeeLeaveManagement.dto.dtos.ApplyLeaveRequest;
import com.employeeLeaveManagement.exception.LeaveValidationException;
import com.employeeLeaveManagement.exception.ResourceNotFoundException;
import com.employeeLeaveManagement.entity.*;
import com.employeeLeaveManagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private static final List<LeaveStatus> ACTIVE_STATUSES =
            List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED);

    private final LeaveRequestRepository leaveRepository;
    private final LeaveBalanceRepository balanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    @Transactional
    public LeaveRequest apply(Employee employee, ApplyLeaveRequest request) {

        LocalDate startDate = request.startDate();
        LocalDate endDate = request.endDate();

        if (startDate.isAfter(endDate)) {
            throw new LeaveValidationException(
                    "Start date must not be after end date"
            );
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new LeaveValidationException(
                    "Start date cannot be in the past"
            );
        }

        int requestedDays = countWorkingDays(startDate, endDate);

        if (requestedDays == 0) {
            throw new LeaveValidationException(
                    "Selected dates contain no working days"
            );
        }

        LeaveType leaveType = leaveTypeRepository.findById(request.leaveTypeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave type not found")
                );

        boolean hasOverlappingLeave = leaveRepository.existsOverlap(
                employee.getId(),
                startDate,
                endDate,
                ACTIVE_STATUSES
        );

        if (hasOverlappingLeave) {
            throw new LeaveValidationException(
                    "These dates overlap with an existing leave request"
            );
        }

        LeaveBalance balance = balanceRepository.findForUpdate(
                employee.getId(),
                leaveType.getId(),
                startDate.getYear()
        ).orElseThrow(() ->
                new LeaveValidationException(
                        "No " + leaveType.getName() +
                                " balance for " + startDate.getYear()
                )
        );

        if (balance.getRemainingDays() < requestedDays) {
            throw new LeaveValidationException(
                    "Insufficient balance: requested " + requestedDays +
                            " day(s), only " + balance.getRemainingDays() +
                            " remaining"
            );
        }

        balance.setRemainingDays(
                balance.getRemainingDays() - requestedDays
        );

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(startDate)
                .endDate(endDate)
                .days(requestedDays)
                .reason(request.reason())
                .status(LeaveStatus.PENDING)
                .build();

        return leaveRepository.save(leaveRequest);
    }

    @Transactional
    public LeaveRequest approve(Employee approver, Long id, String comment) {

        LeaveRequest leaveRequest = findPending(id);

        assertInApprovalChain(approver, leaveRequest);

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprover(approver);
        leaveRequest.setManagerComment(comment);

        return leaveRequest;
    }

    @Transactional
    public LeaveRequest reject(Employee approver, Long id, String comment) {

        LeaveRequest leaveRequest = findPending(id);

        assertInApprovalChain(approver, leaveRequest);

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprover(approver);
        leaveRequest.setManagerComment(comment);

        restoreBalance(leaveRequest);

        return leaveRequest;
    }

    @Transactional
    public LeaveRequest cancel(Employee employee, Long id) {

        LeaveRequest leaveRequest = find(id);

        if (!leaveRequest.getEmployee().getId().equals(employee.getId())) {
            throw new AccessDeniedException("Not your leave request");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING &&
                leaveRequest.getStatus() != LeaveStatus.APPROVED) {

            throw new LeaveValidationException(
                    "Only pending or approved leave can be cancelled"
            );
        }

        if (leaveRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new LeaveValidationException(
                    "Leave that has already started cannot be cancelled"
            );
        }

        leaveRequest.setStatus(LeaveStatus.CANCELLED);

        restoreBalance(leaveRequest);

        return leaveRequest;
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> myLeaves(Employee employee) {
        return leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(
                employee.getId()
        );
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> pendingForManager(Employee manager) {
        return leaveRepository.findByEmployeeManagerIdAndStatusOrderByCreatedAtAsc(
                manager.getId(),
                LeaveStatus.PENDING
        );
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> teamLeaves(Employee manager) {
        return leaveRepository.findByEmployeeManagerIdOrderByStartDateDesc(
                manager.getId()
        );
    }

    @Transactional(readOnly = true)
    public List<LeaveBalance> myBalances(Employee employee) {
        return balanceRepository.findByEmployeeIdAndYear(
                employee.getId(),
                LocalDate.now().getYear()
        );
    }

    static int countWorkingDays(LocalDate startDate, LocalDate endDate) {

        int workingDays = 0;

        for (LocalDate date = startDate;
             !date.isAfter(endDate);
             date = date.plusDays(1)) {

            DayOfWeek dayOfWeek = date.getDayOfWeek();

            if (dayOfWeek != DayOfWeek.SATURDAY &&
                    dayOfWeek != DayOfWeek.SUNDAY) {

                workingDays++;
            }
        }

        return workingDays;
    }

    private LeaveRequest find(Long id) {

        return leaveRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave request not found")
                );
    }

    private LeaveRequest findPending(Long id) {

        LeaveRequest leaveRequest = find(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new LeaveValidationException(
                    "Request is already " +
                            leaveRequest.getStatus().name().toLowerCase()
            );
        }

        return leaveRequest;
    }

    private void assertInApprovalChain(
            Employee approver,
            LeaveRequest leaveRequest
    ) {

        Employee manager = leaveRequest.getEmployee().getManager();

        while (manager != null) {

            if (manager.getId().equals(approver.getId())) {
                return;
            }

            manager = manager.getManager();
        }

        throw new AccessDeniedException(
                "Not in this employee's approval chain"
        );
    }

    private void restoreBalance(LeaveRequest leaveRequest) {

        balanceRepository.findForUpdate(
                leaveRequest.getEmployee().getId(),
                leaveRequest.getLeaveType().getId(),
                leaveRequest.getStartDate().getYear()
        ).ifPresent(balance ->
                balance.setRemainingDays(
                        balance.getRemainingDays() + leaveRequest.getDays()
                )
        );
    }
}
