package com.employeeLeaveManagement;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hash = encoder.encode("1selva002");

        System.out.println(hash);

        System.out.println(
                encoder.matches("1selva002", hash)
        );
    }
}