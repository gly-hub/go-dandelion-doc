---
title: 初步实现登录接口
---

# 初步实现登录接口

## 1. 定义参数模型
在`common/model`目录下创建`authorize`文件夹（用于存放authorize服务相关的模型），创建`common/model/authorize/auth.go`文件，
存放定义登录模块口的参数模型。

```go
package authorize

type (
	LoginParams struct {
		UserName    string `json:"user_name"`    // 用户名
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

## 2. 创建模型

::: warning 提示
业务相关开发创建文件均在`authorize`服务中，并且在`internal`业务开发目录下
:::

在`model`层定义用户基础信息模型，创建`auth.go`文件用于存储用户基础信息。
```go
package model

type SysUser struct {
	UserId    int64  `gorm:"type:int(10) auto_increment;primary_key;用户id"`              // 用户ID
	Username  string `gorm:"type:varchar(64);NOT NULL;DEFAULT '';COMMENT:用户名"`         // 用户名
	Password  string `gorm:"type:varchar(255);NOT NULL;DEFAULT '';COMMENT:密码"`          // 密码
	NickName  string `gorm:"type:varchar(64);NOT NULL;DEFAULT '';COMMENT:昵称"`           // 昵称
	Avatar    string `gorm:"type:varchar(255);NOT NULL;DEFAULT '';COMMENT:头像"`          // 头像
	Phone     string `gorm:"type:varchar(11);NOT NULL;DEFAULT '';COMMENT:手机号"`         // 手机号
	Email     string `gorm:"type:varchar(128);NOT NULL;DEFAULT '';COMMENT:邮箱"`          // 邮箱
	Sex       string `gorm:"type:varchar(8);NOT NULL;DEFAULT '';COMMENT:性别"`            // 性别
	RoleId    int64  `gorm:"type:int(10);NOT NULL;DEFAULT 0;COMMENT:角色id"`              // 角色id
	DeptId    int64  `gorm:"type:int(10);NOT NULL;DEFAULT 0;COMMENT:部门id"`              // 部门id
	PostId    int64  `gorm:"type:int(10);NOT NULL;DEFAULT 0;COMMENT:岗位id"`              // 岗位id
	Remark    string `gorm:"type:varchar(255);NOT NULL;DEFAULT '';COMMENT:备注"`          // 备注
	Status    int8   `gorm:"type:tinyint(1);NOT NULL;DEFAULT 2;COMMENT:状态 1启用 2停用"` // 状态 1启用 2停用
	CreatedAt int64  `gorm:"type:bigint;NOT NULL;DEFAULT 0;COMMENT:创建时间"`             // 创建时间
	CreatedBy string `gorm:"type:varchar(128);NOT NULL;DEFAULT '';COMMENT:创建人"`        // 创建人
	UpdatedAt int64  `gorm:"type:bigint;NOT NULL;DEFAULT 0;COMMENT:更新时间"`             // 更新时间
	DeletedAt int64  `gorm:"type:bigint;NOT NULL;DEFAULT 0;COMMENT:删除时间"`             // 删除时间
}

func (SysUser) TableName() string {
	return "sys_user"
}

```


## 3. 实现数据库交互

在`dao`层实现数据查询，创建`auth.go`文件用于编写数据交互方法。
定义一个`authDao`结构体，用于存放数据交互方法。
```go
package dao

import (
	"go-admin-example/authorize/internal/model"
	"gorm.io/gorm"
)

var Auth authDao

type authDao struct {
}
```

创建`GetUserInfoByUserName`方法，通过用户名获取用户信息
```go
func (d *authDao) GetUserInfoByUserName(tx *gorm.DB, userName string) (user model.SysUser, err error) {
	err = tx.Model(model.SysUser{}).Where("username = ?", userName).First(&user).Error
	return
}
```

---

## 4. 实现登录逻辑

在`logic`层实现业务逻辑，创建`auth.go`文件用于编写认证相关方法。
定义一个`authLogic`结构体，用于存放数据交互方法。
```go
package logic

import (
	"github.com/gly-hub/go-dandelion/application"
	"go-admin-example/common/model/authorize"
)

var Auth authLogic

type authLogic struct {
	application.DB
	application.Redis
}
```
::: tip 关于
这里分别继承了DB类以及Redis类方便进行数据库操作以及redis操作
:::

创建`Login`方法，实现登录逻辑
```go
func (l *authLogic) Login(params authorize.LoginParams) (string, error) {
	userInfo, uErr := dao.Auth.GetUserInfoByUserName(l.GetDB(), params.UserName)
	if uErr != nil && uErr != gorm.ErrRecordNotFound {
		return "", uErr
	}

	// 0判断信息
	if uErr == gorm.ErrRecordNotFound || userInfo.Password != params.Password {
		return "", errors.New("用户名或密码错误")
	}

	// 生成token TODO
	var token string

	return token, nil
}
```

如上，我们进行了一个简单的数据比对，接下来就是生成token了。

## 5. 生成token
这里我们使用`github.com/gly-hub/dandelion-plugs`插件库中提供的`jwt`来生成token。
该插件对缓存进行了封装，减少代码开发。
```shell
go get github.com/gly-hub/dandelion-plugs@latest
```

在`boot/boot.go`文件中进行初始化插件
```go
package boot

import (
	"github.com/gly-hub/dandelion-plugs/jwt"
	"github.com/gly-hub/go-dandelion/application"
)

func Init() {
	// 将需要初始化的方法在该处注册
	_ = application.Plugs(jwt.Plug())
}
```

在`config/configs_local.yaml`对插件进行配置。（不配置则会使用默认配置）
```yaml
jwt:
  model: "unique"
  key: "go-admin-example-123456"
  expireTime: 86400
```
::: tip 提示
使用全局唯一模式（unique）,不会对token时间进行刷新
:::

在`model`中`auth.go`定义jwt元数据方法
```go
type UserMeta struct {
	UserId   int64
	UserName string
	NickName string
	RoleId   int64
}

func (u *UserMeta) Unique() string {
	return cast.ToString(u.UserId)
}
```

## 6. 完善登录方法

接下来完善`logic/auth.go`文件中的`Login`方法
```go
package logic

func (l *authLogic) Login(params authorize.LoginParams) (string, error) {
	userInfo, uErr := dao.Auth.GetUserInfoByUserName(l.GetDB(), params.UserName)
	if uErr != nil && uErr != gorm.ErrRecordNotFound {
		logger.Error(uErr)
		return "", enum.DataBaseError
	}

	// 0判断信息
	if uErr == gorm.ErrRecordNotFound || userInfo.Password != params.Password {
		return "", errors.New("用户名或密码错误")
	}

	// 生成token TODO
	token, tErr := jwt.Token(&model.UserMeta{
		UserId:   userInfo.UserId,
		UserName: userInfo.Username,
		NickName: userInfo.NickName,
		RoleId:   userInfo.RoleId,
	})

	if tErr != nil {
		return "", errors.New("用户名或密码错误")
	}

	return token, nil
}
```

到这里我们的登录逻辑就完成了。我们把代码结构在优化一下，
把错误信息提取成公用变量。

## 7. 状态码完善

在`common/enum`中创建`response.go`文件
```go
package enum

import error_support "github.com/gly-hub/go-dandelion/error-support"

// 基础错误码
var (
	// SystemUnknownError 系统未知错误
	SystemUnknownError = &error_support.Error{Code: 51001, Msg: "系统未知错误"}
	// DataBaseError 数据库错误
	DataBaseError = &error_support.Error{Code: 51002, Msg: "数据库错误"}
	// RedisError Redis错误
	RedisError = &error_support.Error{Code: 51003, Msg: "Redis错误"}
)

// 业务错误码
var (
	// UserNameOrPasswordError 用户名或密码错误
	UserNameOrPasswordError = &error_support.Error{Code: 52001, Msg: "用户名或密码错误"}
	// CaptchaError 验证码错误
	CaptchaError = &error_support.Error{Code: 52002, Msg: "验证码错误"}
)

```

替换掉对应的错误返回
```go
package logic

func (l *authLogic) Login(params authorize.LoginParams) (string, error) {
	userInfo, uErr := dao.Auth.GetUserInfoByUserName(l.GetDB(), params.UserName)
	if uErr != nil && uErr != gorm.ErrRecordNotFound {
		logger.Error(uErr)
		return "", enum.DataBaseError
	}

	// 0判断信息
	if uErr == gorm.ErrRecordNotFound || userInfo.Password != params.Password {
		return "", enum.UserNameOrPasswordError
	}

	// 生成token TODO
	token, tErr := jwt.Token(&model.UserMeta{
		UserId:   userInfo.UserId,
		UserName: userInfo.Username,
		NickName: userInfo.NickName,
		RoleId:   userInfo.RoleId,
	})

	if tErr != nil {
		logger.Error(tErr)
		return "", enum.UserNameOrPasswordError
	}

	return token, nil
}
```

## 8. 定义service层方法
在`authorize/internal/service`中创建`auth.go`文件
```go
package service

import (
	"context"
	errorx "github.com/gly-hub/go-dandelion/error-support"
	"go-admin-example/authorize/internal/logic"
	"go-admin-example/common/model/authorize"
)

func (s *RpcApi) Login(ctx context.Context, req authorize.LoginParams, resp *authorize.LoginResp) error {
	_, err := logic.Auth.Login(req)
	if err != nil {
		errorx.Format(err, resp)
		return nil
	}
	return nil
}
```

## 9. 实现网关对外接口

在`gateway/internal/server`中创建`authorize/auth_controller.go`文件。
编写调用rpc代码。
```go
package authorize

import (
	routing "github.com/gly-hub/fasthttp-routing"
	"github.com/gly-hub/go-dandelion/application"
	"github.com/gly-hub/go-dandelion/server/http"
	authModel "go-admin-example/common/model/authorize"
	rpcService "go-admin-example/common/service"
)

type AuthController struct {
	http.HttpController
}

// Login
// @Summary 登录
// @Description 用户登录
// @Tags 基础模块|用户登录登出
// @Param deptName body auth.LoginParams true "登录参数"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/login [post]
func (a *AuthController) Login(c *routing.Context) error {
	return application.SRpcCall(c, rpcService.AuthorizeService, rpcService.AuthorizeFuncLogin, new(authModel.LoginParams), new(authModel.LoginResp))
}
```

在`gateway/internal/route`中创建`authorize_router.go`文件。
编写初始化`authorize`服务相关路由。
```go
package route

import (
	routing "github.com/gly-hub/fasthttp-routing"
	"go-admin-example/gateway/internal/service/authorize"
)

func initAuthRoute(baseRouter *routing.RouteGroup) {
	authHandler := authorize.AuthController{}
	// 登录登出
	baseRouter.Post("/login", authHandler.Login)
}
```

在`internal/route/toure.go`中注册`authRoute`方法。
```go
package route

import (
	"github.com/gly-hub/go-dandelion/application"
	"github.com/gly-hub/go-dandelion/config"
	"github.com/gly-hub/go-dandelion/server/http/middleware"
	routingSwagger "github.com/gly-hub/go-dandelion/swagger"
)

func InitRoute() {
	baseRouter := application.HttpServer().Router()
	if config.GetEnv() != "production" {
		// 注册swagger
		baseRouter.Get("/swagger/*", routingSwagger.WrapHandler)
		middleware.LogIgnoreResult(".*?/swagger/.*?") // 忽略swagger响应值
	}

	// 可在该处注册相关子集路由 TODO
	// auth服务相关路由
	initAuthRoute(baseRouter)
	return
}
```


