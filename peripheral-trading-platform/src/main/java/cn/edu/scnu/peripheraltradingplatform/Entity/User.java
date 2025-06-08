package cn.edu.scnu.peripheraltradingplatform.Entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class User implements Serializable {
    private Long id;           // 主键，用户ID
    private String username;   // 用户名
    private String password;   // 密码，存加密后的
    private String phone;      // 手机号
    private String email;      // 邮箱
    private String address;    // 地址
    private String avatar;     // 头像URL（可选）
}