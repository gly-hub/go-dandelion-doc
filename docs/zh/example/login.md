---
title: 登录模块
---

## 1.需求
需要有一个登录界面，用户输入用户名和密码，点击登录按钮，后台进行校验，校验通过后，跳转到首页。
增加验证码校验，防止恶意登录。

## 2.登录接口

### 2.1 登录rpc开发
#### 2.1.1 参数模型
在`common/model`目录下创建`authorize`文件夹（用于存放authorize服务相关的模型），创建`common/model/authorize/auth.go`文件，
存放定义登录模块口的参数模型。

```go
package authorize

type (
	LoginParams struct {
		UserId      string `json:"user_id"`      // 用户id
		Password    string `json:"password"`     // 登录密码
		CaptchaCode string `json:"captcha_code"` // 验证码
		CaptchaId   string `json:"captcha_id"`   // 验证码id
	}

	LoginResp struct {
		Token string `json:"token"`
		lib.Response
	}
)

```

#### 2.1.2 开发

### 2.2 网关接口开发
#### 2.2.1 接口文档

## 3.验证码接口
### 3.1 获取验证码Rpc开发
#### 3.1.1 参数模型

#### 3.1.2 开发

### 3.2 网关接口开发
#### 3.2.1 接口文档

## 4.登录逻辑完善

