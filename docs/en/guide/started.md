---
title: Getting Started
---
# Getting Started

::: warning preconditions
golang version >= 1.18
:::

This article will help you build a simple go-dandelion application from scratch.

## 1.Install go-dandelion-cli

Install go-dandelion-cli for quick project structure generation.

```shell
go get github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
go install github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
```

## 2.Create the go-admin-example application
执行命令将会创建一个go-admin-example的文件夹作为应用主目录。
::: warning 应用名称
该应用下的所有服务共用一个mod，需要报错所有服务应用名称一致**go-admin-example**
:::
```shell
# 创建应用并进入
go-dandelion-cli app -n go-admin-example && cd go-admin-example
```
## 3.Building RPC services
初始化一个rpc-server的服务作为该示例的rpc服务，用于业务层逻辑编写。
```shell
# 构建rpc服务
go-dandelion-cli build -n go-admin-example
```
这里需要选择所需有的组件，如mysql、redis、logger、trace链路等。 示例中将全部初始化。
```cmd
需要创建的服务类型，输入数字（1-rpc 2-http）:1
rpc服务名称:rpc-server
是否初始化mysql（y/n）:y
是否初始化redis（y/n）:y
是否初始化logger（y/n）:y
是否初始化trace链路（y/n）:y
```
## 4.Building HTTP services
初始化一个http-server的服务作为该示例的网关服务，用于对外的数据交互。
```shell
# 构建http服务
go-dandelion-cli build -n go-admin-example
```
这里需要选择所需有的组件，如mysql、redis、logger、trace链路等。 由于网关层不会进行dao层的操作，所以不需要初始化mysql和redis。
```cmd
需要创建的服务类型，输入数字（1-rpc 2-http）:2
rpc服务名称:http-server
是否初始化mysql（y/n）:n
是否初始化redis（y/n）:n
是否初始化logger（y/n）:y
是否初始化trace链路（y/n）:y
```
## 5.Edit configuration file
需要将对应的mysql、redis、trace链路以及etcd等配置修改为自己开发环境的配置。关于配置字段解释可浏览[基础配置](/guide/baseconfig)。

## 6.Start service
```shell
## 启动rpc服务
cd rpc-server
#进入服务目录
go build -o rpc-server
#运行
./rpc-server server
```
```shell
## 启动http服务
cd http-server
#进入服务目录
go build -o http-server
#运行
./http-server server
```



