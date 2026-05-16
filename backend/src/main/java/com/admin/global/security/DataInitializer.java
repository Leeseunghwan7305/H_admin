package com.admin.global.security;

import com.admin.domain.auth.entity.AppUser;
import com.admin.domain.auth.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("seunghwan").isEmpty()) {
            userRepository.save(AppUser.builder()
                    .username("seunghwan")
                    .password(passwordEncoder.encode("1234"))
                    .build());
        }
    }
}
