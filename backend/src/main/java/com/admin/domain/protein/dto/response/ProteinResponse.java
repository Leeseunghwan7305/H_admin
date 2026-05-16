package com.admin.domain.protein.dto.response;

import com.admin.domain.protein.entity.ProteinLog;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProteinResponse(
        Long id,
        String foodName,
        Double proteinAmount,
        Integer quantity,
        Double totalProtein,
        LocalDate date,
        LocalDateTime createdAt
) {
    public static ProteinResponse from(ProteinLog entity) {
        return new ProteinResponse(
                entity.getId(),
                entity.getFoodName(),
                entity.getProteinAmount(),
                entity.getQuantity(),
                entity.getTotalProtein(),
                entity.getDate(),
                entity.getCreatedAt()
        );
    }
}
