package com.admin.domain.salary.repository;

import com.admin.domain.salary.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryRepository extends JpaRepository<SalaryRecord, Long> {
    List<SalaryRecord> findAllByOrderByYearDescMonthDesc();
}
