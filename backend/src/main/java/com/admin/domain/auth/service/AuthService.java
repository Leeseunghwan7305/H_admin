package com.admin.domain.auth.service;

import com.admin.domain.auth.dto.request.LoginRequest;
import com.admin.domain.auth.dto.response.TokenResponse;
import com.admin.domain.auth.entity.AppUser;
import com.admin.domain.auth.repository.AppUserRepository;
import com.admin.global.exception.BusinessException;
import com.admin.global.exception.ErrorCode;
import com.admin.global.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public TokenResponse login(LoginRequest request) {
        AppUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        return new TokenResponse(jwtProvider.generate(user.getUsername()));
    }
}
