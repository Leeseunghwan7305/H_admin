package com.admin.domain.setting.service;

import com.admin.domain.setting.dto.request.SettingRequest;
import com.admin.domain.setting.dto.response.SettingResponse;
import com.admin.domain.setting.entity.UserSetting;
import com.admin.domain.setting.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SettingService {

    private final SettingRepository settingRepository;

    public SettingResponse get(String key) {
        return settingRepository.findById(key)
                .map(SettingResponse::from)
                .orElse(SettingResponse.empty(key));
    }

    @Transactional
    public SettingResponse set(SettingRequest request) {
        UserSetting setting = settingRepository.findById(request.key())
                .orElse(new UserSetting(request.key(), request.value()));
        setting.updateValue(request.value());
        return SettingResponse.from(settingRepository.save(setting));
    }
}
