package com.admin.domain.salary.service;

import com.admin.domain.salary.dto.request.SalaryCreateRequest;
import com.admin.domain.salary.dto.request.SalaryUpdateRequest;
import com.admin.domain.salary.dto.response.SalaryResponse;
import com.admin.domain.salary.entity.SalaryRecord;
import com.admin.domain.salary.repository.SalaryRepository;
import com.admin.global.exception.BusinessException;
import com.admin.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryService {

    private final SalaryRepository salaryRepository;

    public List<SalaryResponse> getAll() {
        return salaryRepository.findAllByOrderByYearDescMonthDesc()
                .stream()
                .map(SalaryResponse::from)
                .toList();
    }

    @Transactional
    public SalaryResponse create(SalaryCreateRequest request) {
        SalaryRecord record = SalaryRecord.builder()
                .year(request.year())
                .month(request.month())
                .baseSalary(request.baseSalary())
                .bonus(request.bonus())
                .deduction(request.deduction())
                .memo(request.memo())
                .build();
        return SalaryResponse.from(salaryRepository.save(record));
    }

    @Transactional
    public SalaryResponse update(Long id, SalaryUpdateRequest request) {
        SalaryRecord record = salaryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        record.update(request.year(), request.month(), request.baseSalary(),
                request.bonus(), request.deduction(), request.memo());
        return SalaryResponse.from(record);
    }

    @Transactional
    public void delete(Long id) {
        if (!salaryRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.NOT_FOUND);
        }
        salaryRepository.deleteById(id);
    }
}
