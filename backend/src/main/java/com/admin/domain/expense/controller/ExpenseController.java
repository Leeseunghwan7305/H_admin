package com.admin.domain.expense.controller;

import com.admin.domain.expense.dto.request.ExpenseCreateRequest;
import com.admin.domain.expense.dto.request.FixedExpenseRequest;
import com.admin.domain.expense.dto.response.ExpenseResponse;
import com.admin.domain.expense.dto.response.FixedExpenseResponse;
import com.admin.domain.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/date/{date}")
    public List<ExpenseResponse> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return expenseService.getByDate(date);
    }

    @GetMapping("/month")
    public List<ExpenseResponse> getByMonth(@RequestParam int year, @RequestParam int month) {
        return expenseService.getByMonth(year, month);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@RequestBody ExpenseCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fixed")
    public List<FixedExpenseResponse> getFixedAll() {
        return expenseService.getFixedAll();
    }

    @PostMapping("/fixed")
    public ResponseEntity<FixedExpenseResponse> createFixed(@RequestBody FixedExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.createFixed(request));
    }

    @PutMapping("/fixed/{id}")
    public FixedExpenseResponse updateFixed(@PathVariable Long id, @RequestBody FixedExpenseRequest request) {
        return expenseService.updateFixed(id, request);
    }

    @DeleteMapping("/fixed/{id}")
    public ResponseEntity<Void> deleteFixed(@PathVariable Long id) {
        expenseService.deleteFixed(id);
        return ResponseEntity.noContent().build();
    }
}
