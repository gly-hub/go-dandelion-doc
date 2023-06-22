---
title: 介绍
---
# 介绍

go-dandelion是一个框架脚手架工具，集成了多个流行的组件和技术，包括rpcx、fasthttp、gorm、redigo、
swagger和opentracing等。它的目标是为开发者提供一个快速搭建微服务项目的解决方案，并提供丰富的功能和
可扩展性。

## 1.由来

当我使用rpcx来完成一个微服务的演示时，我遇到了一个问题：在构建项目的目录结构时，我发现需要引入许多组件，
并且还需要手动初始化这些组件。这导致了项目结构变得杂乱，并且初始化组件的代码也变得冗长。为了解决这个问题，
我开始思考是否有一种工具可以快速搭建项目目录结构并自动初始化各个组件，以便更快地进行业务开发。于是，我开
始开发了go-dandelion工具。

go-dandelion的目标是提供一种快速搭建微服务项目的解决方案。它能够自动创建项目的基本目录结构，并且集成了
常用组件的自动初始化功能。这样，我们就可以更快地开始业务开发，而无需花费过多时间和精力在繁琐的初始化过程上。

通过使用go-dandelion，我能够快速创建项目，并且所有需要的组件都会被正确地初始化。这使得项目结构更加清晰，
并且减少了重复的初始化代码。同时，go-dandelion还提供了灵活的配置选项和插件机制，可以根据具体需求进行自定义和扩展。

总之，go-dandelion是一个帮助我快速搭建项目目录结构和初始化组件的工具，让我能够更快地进行业务开发，同时保持项目结构的整洁和可扩展性。

## 2.组成

目前，蒲公英集成了以下组件：
+ [rpcx](https://github.com/smallnest/rpcx)：提供rpc服务
+ [fasthttp](https://github.com/valyala/fasthttp)：提供对外网关接口
+ [fasthttp-routing](https://github.com/qiangxue/fasthttp-routing)：构建路由
+ [gorm](https://github.com/go-gorm/gorm)：数据库交互
+ [redigo](https://github.com/gomodule/redigo)：缓存交互
+ [go-swagger](https://github.com/go-swagger/go-swagger)：接口文档生成
+ [cobra](https://github.com/spf13/cobra)：命令行工具
+ [viper](https://github.com/spf13/viper)：配置文件读取
+ [opentracing-go](https://github.com/opentracing/opentracing-go)：链路追踪

## 3.优点

+ 快速创建RPC服务和HTTP服务：我们提供了一种便捷的方式来快速搭建RPC服务和HTTP服务。
  只需几步操作，您就能轻松构建出高性能的服务。

+ 配置驱动初始化：通过灵活的配置选项，您可以快速初始化常用的组件，如MySQL、Redis、日志系统和追踪链路等。
  我们的系统会根据您的配置进行自动化初始化，让您更专注于业务逻辑的开发。

+ 集成丰富功能：我们的服务框架集成了多项核心功能，包括日志记录、链路追踪、限流、熔断、服务注册和服务发现等。
  这些功能可以直接在框架中使用，无需额外编写代码，大大简化了开发过程。

+ 可自定义中间件和插件：我们提供了中间件和插件机制，使您能够自定义和扩展框架的功能。您可以编写自己的中间件来处理请求、
  响应或其他业务逻辑，也可以开发插件来增强框架的能力。这样，您能够根据具体需求灵活地定制框架的行为。

## 4.未来

后期将对该项目持续迭代，计划增加以下功能：
+ 对rpcx的支持进行重构，解决目前扩展以及可读性问题。 TODO
+ 对http引擎进行优化，实现多引擎应用 。 DOING ([http-dandelion](https://github.com/gly-hub/http-dandelion)) 
+ 自动化生成代码完善，减少不必要的代码编写。 TODO
+ 拓展插件库，增加jwt、定时器等插件。 TODO
+ 增加运维部署相关流程。 TODO
