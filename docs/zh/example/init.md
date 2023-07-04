---
title: 项目初始化
---

## 1.环境及依赖项准备

::: tip golang版本
 version >= 1.20
:::

::: tip go-dandelion
version = v1.2.0
:::
```shell
go get github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
go install github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
```

## 2.项目基础目录初始化
```shell
# 创建应用并进入应用目录
go-dandelion-cli app -n go-admin-example && cd go-admin-example
```
### 2.1 创建RPC服务
创建一个`authorize`服务作为我们的认证服务，用于用户认证、权限管理等操作。
通常作为业务服务，除了logger、trace外，需要初始化db以及redis。
```shell
# 构建服务
go-dandelion-cli build -n go-admin-example
需要创建的服务类型，输入数字（1-rpc 2-http）:1
rpc服务名称:authorize
是否初始化mysql（y/n）:y
是否初始化redis（y/n）:y
是否初始化logger（y/n）:y
是否初始化trace链路（y/n）:y
```

### 2.2 创建HTTP服务
创建一个`gateway`服务作为我们的对外网关，用于对外的数据交互。前端请求都通过
该服务转发到对应的业务服务中。只需要初始化logger、trace组件。
```shell
# 构建服务
go-dandelion-cli build -n go-admin-example
需要创建的服务类型，输入数字（1-rpc 2-http）:2
rpc服务名称:gateway
是否初始化mysql（y/n）:n
是否初始化redis（y/n）:n
是否初始化logger（y/n）:y
是否初始化trace链路（y/n）:y
```

### 2.3 创建公共目录
创建一个`common`目录作为我们的服务间公共目录，用于存放公共的通信协议文件。
```shell
mkdir common
mkdir common/model
mkdir common/service
```
+ `common/model`:用于存放rpc通信协议
+ `common/service`:用于存放服务名以及方法名等常量

在`common/model`目录下创建`lib`文件夹（用于存放基础模型），创建`common/model/lib/common.go`文件,并
定义基础模型。
```go
package lib

// Response rpc同行使用，http响应不会使用
type Response struct {
	Code int32  `json:"-"`
	Msg  string `json:"-"`
}
```
### 2.4 整体目录结构
``` shell 
go-admin-example
├── authorize
│   ├── boot
│   │   └── boot.go   
│   ├── cmd
│   │   ├── api
│   │   │   └── server.go   
│   │   └── cobra.go     
│   ├── config        
│   │   └── configs_local.yaml 
│   ├── global
│   │   └── global.go  
│   ├── internal
│   │   ├── dao  
│   │   ├── enum 
│   │   ├── logic 
│   │   ├── model 
│   │   └── service 
│   │       └── api.go  
│   ├── static
│   │   └── rpc-server.txt  
│   ├── tools   
│   │
│   └── main.go 
│ 
├── common
│   ├── model
│   └── service 
│
├── gateway
│   ├── cmd
│   │   ├── api
│   │   │   └── server.go 
│   │   └── cobra.go 
│   ├── config   
│   │   └── configs_local.yaml 
│   ├── internal
│   │   ├── middleware 
│   │   ├── route 
│   │   │   └── route.go 
│   │   └── service 
│   ├── static
│   │   └── http-server.txt 
│   │ 
│   └── main.go  
│
│
└── go.mod  
```
