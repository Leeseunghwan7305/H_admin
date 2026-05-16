package com.admin.domain.expense.dto.response;

import com.admin.domain.expense.entity.ExpenseRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        String itemName,
        Long price,
        Integer quantity,
        Long totalAmount,
        String category,
        LocalDate date,
        LocalDateTime createdAt
) {
    public static ExpenseResponse from(ExpenseRecord e) {
        return new ExpenseResponse(
                e.getId(), e.getItemName(), e.getPrice(), e.getQuantity(),
                e.getTotalAmount(), e.getCategory(), e.getDate(), e.getCreatedAt()
        );
    }
}
