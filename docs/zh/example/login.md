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

#### 2.1.2 开发

::: warning 提示
以下创建文件均在`authorize`服务中，并且在`internal`业务开发目录下
:::

**创建模型**

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

---

**实现数据库交互**

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

**实现登录逻辑**

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

---

**生成token**
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

```


### 2.2 网关接口开发
#### 2.2.1 接口文档

## 3.验证码接口
### 3.1 获取验证码Rpc开发
#### 3.1.1 参数模型

#### 3.1.2 开发

### 3.2 网关接口开发
#### 3.2.1 接口文档

## 4.登录逻辑完善

