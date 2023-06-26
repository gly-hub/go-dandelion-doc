---
title: 目录结构
---

# 目录结构
## rpc服务
``` shell 
.
├── boot
│   └── boot.go              //需要初始化的方法在该处注册
├── cmd
│   ├── api
│   │   └── server.go        //服务启动入口
│   └── cobra.go             //cobra命令注册
├── config                    //服务配置文件夹
│   └── configs_local.yaml    //本地配置文件
├── global
│   └── global.go            //全局变量
├── internal
│   ├── dao                  //数据库操作
│   ├── enum                 //枚举、常量
│   ├── logic                //业务逻辑
│   ├── model                //数据模型
│   └── service              //服务
│       └── api.go           //服务接口
├── static
│   └── rpc-server.txt       //服务名
├── tools                    //工具类
│
└── main.go                  //入口文件
```
+ `boot`: 对应的初始化方法在`boot`目录下实现。在`boot/boot.go`中提供注册方法。
+ `cmd`: `cobra`命令注册，目前提供`api`服务启动入口。
+ `config`: 配置文件夹，配置文件为`yaml`格式，需要严格按照`yaml`格式书写，否则会报错。初始化创建时提供本地环境配置文件`config/configs_local.yaml`。
+ `global`: 全局变量，用于自定义全局变量。
+ `internal`: 业务代码实现目录。`internal/dao`为数据库操作，`internal/logic`为业务逻辑，`internal/model`为数据模型，`internal/service`为服务接口。
+ `static`: 存放静态文件。
+ `tools`: 工具类。自定义的工具类需要在该目录下。

::: tip 根据项目合理使用DDD分层架构
`internal`层下的目录结构可以自定义，但是需要保证每个目录下的文件都是同一类型的文件，例如`internal/dao`下的文件都是数据库操作文件，
`internal/logic`下的文件都是业务逻辑文件。
:::

## http服务
``` shell
.
├── cmd
│   ├── api
│   │   └── server.go        //服务启动入口
│   └── cobra.go             //cobra命令注册
├── config                    //服务配置文件夹
│   └── configs_local.yaml    //本地配置文件
├── internal
│   ├── middleware           //自定义中间件
│   ├── route                //路由管理
│   │   └── route.go         //提供基础路由
│   └── service              //服务
├── static
│   └── http-server.txt       //服务名
│ 
└── main.go                  //入口文件
```
+ `cmd`: `cobra`命令注册，目前提供`api`服务启动入口。
+ `config`: 配置文件夹，配置文件为`yaml`格式，需要严格按照`yaml`格式书写，否则会报错。初始化创建时提供本地环境配置文件`config/configs_local.yaml`。
+ `internal`: 业务代码实现目录。`internal/middleware`用于存放自定义中间件，`internal/route`用于路由管理，`internal/service`用于服务接口实现，rpc调用。
+ `static`: 存放静态文件。
