---
title: 登录模块完善
---

# 登录模块完善

## 1.登录增加验证码校验
在实现登录接口时，我们预留了`CaptchaCode`、`CaptchaId`两个参数，现在我们将实现
验证码校验。

在`authorize/internal/logic/auth.go`的`Login`中，增加验证码校验。

```go
func (l *authLogic) Login(params authorize.LoginParams) (string, error) {
	...
	// 0判断信息
	if uErr == gorm.ErrRecordNotFound || userInfo.Password != params.Password {
        return "", enum.UserNameOrPasswordError
    }

    if !captcha.Verify(params.CaptchaId, params.CaptchaCode) {
        return "", enum.CaptchaError
    }

    // 生成token TODO
    token, tErr := jwt.Token(&model.UserMeta{
	...
}
```

在`enum/response.go`中增加错误码。
```go
// CaptchaError 验证码错误
CaptchaError = &error_support.Error{Code: 52002, Msg: "验证码错误"}
```

## 2.实现登出rpc方法

用户点击退出或注销后，应该将用户`token`从缓存中移除。（如果jwt的模式为`normal`，则不需要进行）

实现`logic`层方法，同样在`authorize/internal/logic/auth.go`中增加`Logout`方法。

```go
func (l *authLogic) Logout(userId int64) error {
	_ = jwt.Del(&model.UserMeta{
		UserId: userId,
	})
	return nil
}
```

实现service方法。

```go
func (s *RpcApi) Logout(ctx context.Context, req authorize.LoginParams, resp *authorize.LoginResp) error {
	err := logic.Auth.Logout(rpcx.Header().Int64Default(ctx, "user_id", 0))
	if err != nil {
		errorx.Format(err, resp)
		return nil
	}
	return nil
}
```
::: tip 提示
这里直接从`ctx`中获取用户id。
具体会在`权限校验模块实现`讲解实现。
:::

## 4.实现对应的对外接口

在`gateway/internal/server/authorize/auth_controller.go`文件中增加路由方法。
```go
...

// Logout
// @Summary 登录
// @Description 注销登录
// @Tags 基础模块|注销登录
// @Param deptName body authModel.LoginParams true "参数"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/logout [delete]
func (a *AuthController) Logout(c *routing.Context) error {
    var (
        req  = new(authModel.LoginParams)
        resp = new(authModel.LoginResp)
    )
    err := application.RpcCall(c, rpcService.AuthorizeService, rpcService.AuthorizeFuncGenerateCaptcha, req, resp)
    if err != nil {
        return a.Fail(c, err)
    }
    return a.Success(c, resp, "")
}

...
```

最后，在`gateway/internal/route/authorize_router.go`注册路由地址。
```go
package route

import (
	routing "github.com/gly-hub/fasthttp-routing"
	"go-admin-example/gateway/internal/service/authorize"
)

func initAuthRoute(baseRouter *routing.RouteGroup) {
	authHandler := authorize.AuthController{}
	// 登录登出
	//baseRouter.Use(analysis.HttpPrometheus())
	baseRouter.Post("/login", authHandler.Login)
	baseRouter.Get("/captcha", authHandler.Captcha)
	baseRouter.Post("/logout", authHandler.Logout)
}
```
