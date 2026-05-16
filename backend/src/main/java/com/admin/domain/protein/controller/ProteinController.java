package com.admin.domain.protein.controller;

import com.admin.domain.protein.dto.request.ProteinCreateRequest;
import com.admin.domain.protein.dto.response.ProteinResponse;
import com.admin.domain.protein.service.ProteinService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/protein")
@RequiredArgsConstructor
public class ProteinController {

    private final ProteinService proteinService;

    @GetMapping
    public List<ProteinResponse> getToday() {
        return proteinService.getLogsByDate(LocalDate.now());
    }

    @GetMapping("/date/{date}")
    public List<ProteinResponse> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return proteinService.getLogsByDate(date);
    }

    @GetMapping("/month")
    public List<ProteinResponse> getByMonth(@RequestParam int year, @RequestParam int month) {
        return proteinService.getMonthLogs(year, month);
    }

    @PostMapping
    public ResponseEntity<ProteinResponse> create(@RequestBody ProteinCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proteinService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        proteinService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
