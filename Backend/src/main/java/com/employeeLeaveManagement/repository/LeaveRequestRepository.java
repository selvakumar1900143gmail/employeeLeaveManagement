package com.employeeLeaveManagement.repository;

import com.employeeLeaveManagement.entity.LeaveRequest;
import com.employeeLeaveManagement.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @Query("""
            SELECT COUNT(leaveRequest) > 0
            FROM LeaveRequest leaveRequest
            WHERE leaveRequest.employee.id = :employeeId
              AND leaveRequest.status IN :statuses
              AND leaveRequest.startDate <= :endDate
              AND leaveRequest.endDate >= :startDate
            """)
    boolean existsOverlap(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<LeaveStatus> statuses
    );

    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<LeaveRequest> findByEmployeeManagerIdAndStatusOrderByCreatedAtAsc(
            Long managerId,
            LeaveStatus status
    );

    List<LeaveRequest> findByEmployeeManagerIdOrderByStartDateDesc(Long managerId);
}