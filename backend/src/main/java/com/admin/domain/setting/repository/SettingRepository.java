package com.admin.domain.setting.repository;

import com.admin.domain.setting.entity.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<UserSetting, String> {}
