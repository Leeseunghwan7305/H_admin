package com.admin.domain.expense.service;

import com.admin.domain.expense.dto.request.ExpenseCreateRequest;
import com.admin.domain.expense.dto.request.FixedExpenseRequest;
import com.admin.domain.expense.dto.response.ExpenseResponse;
import com.admin.domain.expense.dto.response.FixedExpenseResponse;
import com.admin.domain.expense.entity.ExpenseRecord;
import com.admin.domain.expense.entity.FixedExpense;
import com.admin.domain.expense.repository.ExpenseRepository;
import com.admin.domain.expense.repository.FixedExpenseRepository;
import com.admin.global.exception.BusinessException;
import com.admin.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final FixedExpenseRepository fixedExpenseRepository;

    public List<ExpenseResponse> getByDate(LocalDate date) {
        return expenseRepository.findByDateOrderByCreatedAtDesc(date)
                .stream().map(ExpenseResponse::from).toList();
    }

    public List<ExpenseResponse> getByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return expenseRepository.findByDateBetweenOrderByDateAscCreatedAtDesc(start, end)
                .stream().map(ExpenseResponse::from).toList();
    }

    public List<FixedExpenseResponse> getFixedAll() {
        return fixedExpenseRepository.findAllByOrderByBillingDayAsc()
                .stream().map(FixedExpenseResponse::from).toList();
    }

    @Transactional
    public ExpenseResponse create(ExpenseCreateRequest req) {
        ExpenseRecord record = ExpenseRecord.builder()
                .itemName(req.itemName())
                .price(req.price())
                .quantity(req.quantity())
                .category(req.category())
                .date(req.date() != null ? req.date() : LocalDate.now())
                .build();
        return ExpenseResponse.from(expenseRepository.save(record));
    }

    @Transactional
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) throw new BusinessException(ErrorCode.NOT_FOUND);
        expenseRepository.deleteById(id);
    }

    @Transactional
    public FixedExpenseResponse createFixed(FixedExpenseRequest req) {
        FixedExpense fixed = FixedExpense.builder()
                .name(req.name())
                .amount(req.amount())
                .category(req.category())
                .billingDay(req.billingDay())
                .build();
        return FixedExpenseResponse.from(fixedExpenseRepository.save(fixed));
    }

    @Transactional
    public FixedExpenseResponse updateFixed(Long id, FixedExpenseRequest req) {
        FixedExpense fixed = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        fixed.update(req.name(), req.amount(), req.category(), req.billingDay(),
                req.active() != null ? req.active() : fixed.getActive());
        return FixedExpenseResponse.from(fixed);
    }

    @Transactional
    public void deleteFixed(Long id) {
        if (!fixedExpenseRepository.existsById(id)) throw new BusinessException(ErrorCode.NOT_FOUND);
        fixedExpenseRepository.deleteById(id);
    }
}
