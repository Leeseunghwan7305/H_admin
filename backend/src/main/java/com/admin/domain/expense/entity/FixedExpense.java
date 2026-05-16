package com.admin.domain.expense.entity;

import com.admin.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "fixed_expense")
public class FixedExpense extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer billingDay;

    @Column(nullable = false)
    private Boolean active;

    @Builder
    public FixedExpense(String name, Long amount, String category, Integer billingDay) {
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.billingDay = billingDay;
        this.active = true;
    }

    public void update(String name, Long amount, String category, Integer billingDay, Boolean active) {
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.billingDay = billingDay;
        this.active = active;
    }
}
