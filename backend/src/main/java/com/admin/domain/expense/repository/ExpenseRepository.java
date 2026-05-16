package com.admin.domain.expense.repository;

import com.admin.domain.expense.entity.ExpenseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseRecord, Long> {
    List<ExpenseRecord> findByDateOrderByCreatedAtDesc(LocalDate date);
    List<ExpenseRecord> findByDateBetweenOrderByDateAscCreatedAtDesc(LocalDate start, LocalDate end);
}
