package com.admin.domain.setting.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "user_setting")
public class UserSetting {

    @Id
    private String key;

    private String value;

    public UserSetting(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public void updateValue(String value) {
        this.value = value;
    }
}
