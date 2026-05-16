package com.admin.domain.salary.entity;

import com.admin.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "salary_record")
public class SalaryRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Long baseSalary;

    private Long bonus;
    private Long deduction;
    private String memo;

    @Builder
    public SalaryRecord(Integer year, Integer month, Long baseSalary, Long bonus, Long deduction, String memo) {
        this.year = year;
        this.month = month;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deduction = deduction;
        this.memo = memo;
    }

    public void update(Integer year, Integer month, Long baseSalary, Long bonus, Long deduction, String memo) {
        this.year = year;
        this.month = month;
        this.baseSalary = baseSalary;
        this.bonus = bonus;
        this.deduction = deduction;
        this.memo = memo;
    }

    public long getNetSalary() {
        return baseSalary + (bonus != null ? bonus : 0) - (deduction != null ? deduction : 0);
    }
}
