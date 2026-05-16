package com.admin.domain.expense.entity;

import com.admin.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "expense_record")
public class ExpenseRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @Builder
    public ExpenseRecord(String itemName, Long price, Integer quantity, String category, LocalDate date) {
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity != null ? quantity : 1;
        this.category = category;
        this.date = date;
    }

    public long getTotalAmount() {
        return price * quantity;
    }
}
