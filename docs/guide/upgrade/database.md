---
title: Database and Caching
---

# Database and Caching
## 1. Database
::: tip Note
The framework integrates the `Gorm` component. By configuring the [database settings](../baseconfig.md) in the configuration file, the database will be automatically initialized.
:::

### 1.1 Database Types
::: warning Note
Only MySQL and PostgreSQL databases are supported (more databases will be continuously integrated in the future).
```go
const (
	Mysql    = "mysql"
	Postgres = "postgres"
)
```
:::

### 1.2 Using the Database
The `DB` class is provided in `application/db.go`. You can call the `GetDB` method to get the `*gorm.DB` instance.
Example:
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

### 1.3 Model Registration
The framework does not provide model registration functionality. You can customize the implementation in the `boot` directory.
Example:
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

## 2. Redis
::: tip Note
The framework integrates the `redigo` component. By configuring the [Redis settings](../baseconfig.md) in the configuration file, Redis will be automatically initialized.
:::

### 2.1 Redis Modes
::: tip Supported
Currently, the framework supports standalone (`alone`), sentinel (`sentinel`), and cluster (`cluster`) modes.
:::

::: warning Note
No configuration for the database (`db`) is provided. By default, it uses `db0`. This is mainly because Redis cluster only supports `db0` and does not allow selecting a specific database. If you need to differentiate different business scenarios using different databases, it is recommended to manage multiple Redis instances. If you really need to select a database and cannot avoid it, you can use the `SELECT` command to control it manually (not recommended).
:::

### 2.2 Using Redis
The `Redis` class is provided in `application/redis.go`. You can call the `GetRedis` method to get the `*redigo.Client` instance.
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

### 2.3 Available Methods
::: tip Note
Specific methods are provided in `database/redigo/redigo.go`.
:::
