package com.admin.domain.expense.dto.response;

import com.admin.domain.expense.entity.FixedExpense;

import java.time.LocalDateTime;

public record FixedExpenseResponse(
        Long id,
        String name,
        Long amount,
        String category,
        Integer billingDay,
        Boolean active,
        LocalDateTime createdAt
) {
    public static FixedExpenseResponse from(FixedExpense e) {
        return new FixedExpenseResponse(
                e.getId(), e.getName(), e.getAmount(), e.getCategory(),
                e.getBillingDay(), e.getActive(), e.getCreatedAt()
        );
    }
}
