package com.admin.domain.setting.controller;

import com.admin.domain.setting.dto.request.SettingRequest;
import com.admin.domain.setting.dto.response.SettingResponse;
import com.admin.domain.setting.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    @GetMapping("/{key}")
    public SettingResponse get(@PathVariable String key) {
        return settingService.get(key);
    }

    @PostMapping
    public SettingResponse set(@RequestBody SettingRequest request) {
        return settingService.set(request);
    }
}
