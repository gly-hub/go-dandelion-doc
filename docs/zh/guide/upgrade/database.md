---
title: 数据库及缓存
---

# 数据库及缓存
## 1.数据库
::: tip 提示
框架集成了`Gorm`组件，只需要配置文件中配置 [数据库配置](../baseconfig.md)，即可自动初始化。
:::
### 1.1 数据库类型
::: warning 提示
只支持mysql、postgres两个数据库。（后期将持续集成）
```go
const (
	Mysql    = "mysql"
	Postgres = "postgres"
)
```
:::

### 1.2 数据库使用
在`application/db.go`中提供`DB`类，可调用`GetDB`方法获取`*gorm.DB`。
示例：
```go  
package logic

var Test testLogic

type testLogic struct {
	application.DB
}

func (a testLogic) Test(){
	db := a.GetDB()
    // do something
}

```

### 1.3 模型注册
框架不提供模型注册功能，可在`boot`目录下自定义实现。
示例：
```go
package boot

import (
	"github.com/gly-hub/go-dandelion/application"
	"github.com/gly-hub/go-dandelion/logger"
)

var (
	models []interface{}
)

func Register(model ...interface{}) {
	if len(model) == 0 {
		return
	}
	models = append(models, model...)
}

func MigrateModels() {
	db := &application.DB{}
	dbIns := db.GetDB().Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci")

	for _, model := range models {
		if dbIns.Migrator().HasTable(model) {
			continue
		}
		err := dbIns.Migrator().AutoMigrate(model)
		if err != nil {
			logger.Error("Migrate Model Error", err)
		}
	}
	return
}
```

## 2.Redis
::: tip 提示
框架集成了`redigo`组件，只需要配置文件中配置 [redis配置](../baseconfig.md)，即可自动初始化。
:::
### 2.1 Redis模式
::: tip 支持
目前支持单机（alone）, 哨兵（sentinel）, 集群（cluster）。
:::
::: warning 注意
没有提供 db 相关的配置，默认使用 db0。主要因为 redis cluster 的默认也仅支持 db0, 不支持 db 的选择。
如果存在通过 db 区分不同的业务场景，建议使用多个 redis 实例进行管理。如果真存在选择 db 场景，且无法避
开，使用`select`命令自行控制（不建议）。
:::

### 2.2 Redis使用
在`application/redis.go`中提供`Redis`类，可调用`GetRedis`方法获取`*redigo.Client`。
```go
package logic

var Test testLogic

type testLogic struct {
	application.DB
	application.Redis
}

func (a testLogic) Test(){
	db := al.GetRedis()
	db.Execute(func(c redis.Conn) (res interface{}, err error) {
		// do something
	})
    // do something
}
```

### 2.3 提供方法
::: tip 提示
具体提供方法`database/redigo/redigo.go`。
:::
