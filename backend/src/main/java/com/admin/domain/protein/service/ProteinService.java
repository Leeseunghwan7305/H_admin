package com.admin.domain.protein.service;

import com.admin.domain.protein.dto.request.ProteinCreateRequest;
import com.admin.domain.protein.dto.response.ProteinResponse;
import com.admin.domain.protein.entity.ProteinLog;
import com.admin.domain.protein.repository.ProteinRepository;
import com.admin.global.exception.BusinessException;
import com.admin.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProteinService {

    private final ProteinRepository proteinRepository;

    public List<ProteinResponse> getLogsByDate(LocalDate date) {
        return proteinRepository.findByDateOrderByCreatedAtDesc(date)
                .stream().map(ProteinResponse::from).toList();
    }

    public List<ProteinResponse> getMonthLogs(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return proteinRepository.findByDateBetweenOrderByDateAscCreatedAtDesc(start, end)
                .stream().map(ProteinResponse::from).toList();
    }

    public List<ProteinResponse> getRecentFoods() {
        return proteinRepository.findTop50ByOrderByCreatedAtDesc()
                .stream()
                .collect(Collectors.toMap(
                        ProteinLog::getFoodName,
                        p -> p,
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ))
                .values()
                .stream()
                .limit(8)
                .map(ProteinResponse::from)
                .toList();
    }

    @Transactional
    public ProteinResponse create(ProteinCreateRequest request) {
        ProteinLog log = ProteinLog.builder()
                .foodName(request.foodName())
                .proteinAmount(request.proteinAmount())
                .quantity(request.quantity())
                .date(request.date() != null ? request.date() : LocalDate.now())
                .build();
        return ProteinResponse.from(proteinRepository.save(log));
    }

    @Transactional
    public void delete(Long id) {
        if (!proteinRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.NOT_FOUND);
        }
        proteinRepository.deleteById(id);
    }
}
