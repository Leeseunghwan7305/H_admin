package com.admin.domain.protein.repository;

import com.admin.domain.protein.entity.ProteinLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProteinRepository extends JpaRepository<ProteinLog, Long> {
    List<ProteinLog> findByDateOrderByCreatedAtDesc(LocalDate date);
    List<ProteinLog> findByDateBetweenOrderByDateAscCreatedAtDesc(LocalDate start, LocalDate end);
}
