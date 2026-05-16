package com.admin.domain.salary.controller;

import com.admin.domain.salary.dto.request.SalaryCreateRequest;
import com.admin.domain.salary.dto.request.SalaryUpdateRequest;
import com.admin.domain.salary.dto.response.SalaryResponse;
import com.admin.domain.salary.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    public List<SalaryResponse> getAll() {
        return salaryService.getAll();
    }

    @PostMapping
    public ResponseEntity<SalaryResponse> create(@RequestBody SalaryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salaryService.create(request));
    }

    @PutMapping("/{id}")
    public SalaryResponse update(@PathVariable Long id, @RequestBody SalaryUpdateRequest request) {
        return salaryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salaryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
