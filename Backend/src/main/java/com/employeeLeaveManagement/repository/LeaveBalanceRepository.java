package com.employeeLeaveManagement.repository;

import com.employeeLeaveManagement.entity.LeaveBalance;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    List<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, int year);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT balance
            FROM LeaveBalance balance
            WHERE balance.employee.id = :employeeId
              AND balance.leaveType.id = :leaveTypeId
              AND balance.year = :year
            """)
    Optional<LeaveBalance> findForUpdate(
            @Param("employeeId") Long employeeId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("year") int year
    );
}