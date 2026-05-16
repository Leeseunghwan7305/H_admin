package com.admin.domain.expense.dto.request;

public record FixedExpenseRequest(
        String name,
        Long amount,
        String category,
        Integer billingDay,
        Boolean active
) {}
