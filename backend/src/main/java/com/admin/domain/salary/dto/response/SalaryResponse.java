package com.admin.domain.salary.dto.response;

import com.admin.domain.salary.entity.SalaryRecord;

public record SalaryResponse(
        Long id,
        Integer year,
        Integer month,
        Long baseSalary,
        Long bonus,
        Long deduction,
        Long netSalary,
        String memo
) {
    public static SalaryResponse from(SalaryRecord entity) {
        return new SalaryResponse(
                entity.getId(),
                entity.getYear(),
                entity.getMonth(),
                entity.getBaseSalary(),
                entity.getBonus(),
                entity.getDeduction(),
                entity.getNetSalary(),
                entity.getMemo()
        );
    }
}
