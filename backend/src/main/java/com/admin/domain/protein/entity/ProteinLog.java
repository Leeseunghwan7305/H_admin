package com.admin.domain.protein.entity;

import com.admin.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "protein_log")
public class ProteinLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String foodName;

    @Column(nullable = false)
    private Double proteinAmount;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDate date;

    @Builder
    public ProteinLog(String foodName, Double proteinAmount, Integer quantity, LocalDate date) {
        this.foodName = foodName;
        this.proteinAmount = proteinAmount;
        this.quantity = quantity != null ? quantity : 1;
        this.date = date;
    }

    public double getTotalProtein() {
        return proteinAmount * quantity;
    }
}
