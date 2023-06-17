---
title: Directory Structure
---

# Directory Structure
## RPC service
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

## HTTP service
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
