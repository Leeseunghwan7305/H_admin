package com.admin.domain.auth.controller;

import com.admin.domain.auth.dto.request.LoginRequest;
import com.admin.domain.auth.dto.response.TokenResponse;
import com.admin.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
