package com.admin.domain.expense.dto.request;

import java.time.LocalDate;

public record ExpenseCreateRequest(
        String itemName,
        Long price,
        Integer quantity,
        String category,
        LocalDate date
) {}
