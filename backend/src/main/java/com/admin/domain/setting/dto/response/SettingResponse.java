package com.admin.domain.setting.dto.response;

import com.admin.domain.setting.entity.UserSetting;

public record SettingResponse(String key, String value) {

    public static SettingResponse from(UserSetting entity) {
        return new SettingResponse(entity.getKey(), entity.getValue());
    }

    public static SettingResponse empty(String key) {
        return new SettingResponse(key, "");
    }
}
