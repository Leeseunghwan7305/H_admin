package com.admin.domain.salary.dto.request;

public record SalaryUpdateRequest(
        Integer year,
        Integer month,
        Long baseSalary,
        Long bonus,
        Long deduction,
        String memo
) {}
