
package com.employeeLeaveManagement.config;

import com.employeeLeaveManagement.entity.Employee;
import com.employeeLeaveManagement.entity.LeaveBalance;
import com.employeeLeaveManagement.entity.LeaveType;
import com.employeeLeaveManagement.entity.Role;
import com.employeeLeaveManagement.repository.*;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String @NonNull ... args) {

        if (employeeRepository.count() > 0) {
            return;
        }

        List<LeaveType> leaveTypes = leaveTypeRepository.saveAll(List.of(
                LeaveType.builder()
                        .name("Annual")
                        .annualQuota(20)
                        .build(),

                LeaveType.builder()
                        .name("Sick")
                        .annualQuota(10)
                        .build(),

                LeaveType.builder()
                        .name("Casual")
                        .annualQuota(8)
                        .build()
        ));

        Employee director = createEmployee(
                "Dana Director",
                "director@leaveease.com",
                Role.MANAGER,
                null
        );

        Employee manager = createEmployee(
                "Mark Manager",
                "manager@leaveease.com",
                Role.MANAGER,
                director
        );

        Employee employee = createEmployee(
                "Eve Employee",
                "employee@leaveease.com",
                Role.EMPLOYEE,
                manager
        );


        int currentYear = LocalDate.now().getYear();

        List<Employee> employees = List.of(director, manager, employee);

        for (Employee currentEmployee : employees) {
            for (LeaveType leaveType : leaveTypes) {

                LeaveBalance balance = LeaveBalance.builder()
                        .employee(currentEmployee)
                        .leaveType(leaveType)
                        .year(currentYear)
                        .remainingDays(leaveType.getAnnualQuota())
                        .build();

                leaveBalanceRepository.save(balance);
            }
        }
    }

    private Employee createEmployee(
            String name,
            String email,
            Role role,
            Employee manager
    ) {

        Employee employee = Employee.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode("password123"))
                .role(role)
                .manager(manager)
                .build();

        return employeeRepository.save(employee);
    }
}