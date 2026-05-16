package com.admin.domain.expense.repository;

import com.admin.domain.expense.entity.FixedExpense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {
    List<FixedExpense> findAllByOrderByBillingDayAsc();
}
