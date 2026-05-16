package com.admin.domain.protein.dto.request;

import java.time.LocalDate;

public record ProteinCreateRequest(
        String foodName,
        Double proteinAmount,
        Integer quantity,
        LocalDate date
) {}
