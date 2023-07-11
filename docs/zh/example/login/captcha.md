---
title: 增加验证码校验
---

# 增加验证码校验
## 1.定义参数模型
在`common/model/authorize/auth.go`中定义获取验证码的参数模型。
```go
package authorize

type (
	CaptchaParams struct {
	}

	CaptchaResp struct {
		lib.Response
		Img string `json:"img"`
		Id  string `json:"id"`
	}
)
```
## 2.初始化验证码插件

这里我们使用`github.com/gly-hub/dandelion-plugs`插件库中提供的`captcha`插件来生成验证码图片。

在`boot/boot.go`文件中进行初始化插件
```go
package boot

import (
	"github.com/gly-hub/dandelion-plugs/captcha"
	"github.com/gly-hub/dandelion-plugs/jwt"
	"github.com/gly-hub/go-dandelion/application"
)

func Init() {
	// 将需要初始化的方法在该处注册
	_ = application.Plugs(jwt.Plug(), captcha.Plug())
}
```

在`config/configs_local.yaml`对插件进行配置。（不配置则会使用默认配置）

::: tip 提示
这里我们只做简单配置，该插件使用请参照插件文档。
:::

```yaml
captcha:
  length: 6
  strType: 3
  bkgColors:
    - B: 255
      A: 255
```

## 3.实现获取验证码方法
在`logic/auth.go`文件中创建`GenerateCaptcha`方法
```go
package logic

import (
	"github.com/gly-hub/dandelion-plugs/captcha"
	"github.com/rs/xid"
	...
)

func (l *authLogic) GenerateCaptcha() (content, id string, err error) {
	id = xid.New().String()
	img, cErr := captcha.Create(id)
	if cErr != nil {
		return "", id, cErr
	}
	content = img.Base64()
	return content, id, nil
}
```

## 5.定义service层方法
```go
package service

// GenerateCaptcha 生成验证码
func (s *RpcApi) GenerateCaptcha(ctx context.Context, req authorize.CaptchaParams, resp *authorize.CaptchaResp) error {
	content, id, err := logic.Auth.GenerateCaptcha()
	if err != nil {
		errorx.Format(err, resp)
		return nil
	}
	resp.Id = id
	resp.Img = content
	return nil
}
```

## 4. 实现网关对外接口

在`gateway/internal/server/authorize/auth_controller.go`文件中增加路由方法。
```go
...

// Captcha
// @Summary 登录
// @Description 验证码获取
// @Tags 基础模块|验证码获取
// @Param deptName body authModel.CaptchaParams true "登录参数"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/captcha [get]
func (a *AuthController) Captcha(c *routing.Context) error {
    var (
        req  = new(authModel.CaptchaParams)
        resp = new(authModel.CaptchaResp)
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
}
```
