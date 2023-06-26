---
title: RPCx组件
---

# RPC组件

## 1.什么是RPC
::: theorem 远程过程调用
分布式计算中，远程过程调用（英语：Remote Procedure Call，RPC）是一个计算机通信协议。
该协议允许运行于一台计算机的程序调用另一个地址空间（通常为一个开放网络的一台计算机）的子程序，
而程序员就像调用本地程序一样，无需额外地为这个交互作用编程（无需关注细节）。
RPC是一种服务器-客户端（Client/Server）模式，经典实现是一个通过发送请求-接受回应进行信息交互的系统。
如果涉及的软件采用面向对象编程，那么远程过程调用亦可称作远程调用或远程方法调用，例：Java RMI。

RPC是一种进程间通信的模式，程序分布在不同的地址空间里。如果在同一主机里，RPC可以通过不同的虚拟地址空间
（即便使用相同的物理地址）进行通讯，而在不同的主机间，则通过不同的物理地址进行交互。许多技术（通常是不兼容）
都是基于这种概念而实现的。
::: right
来自 [维基百科](https://zh.wikipedia.org/wiki/%E9%81%A0%E7%A8%8B%E9%81%8E%E7%A8%8B%E8%AA%BF%E7%94%A8)
:::

## 2.什么是RPCx
::: theorem RPCx
rpcx 是一个分布式的Go语言的 RPC 框架，支持Zookepper、etcd、consul多种服务发现方式，多种服务路由方式， 是目前性能最好的 RPC 框架之一。
::: right
来自 [rpcx](https://doc.rpcx.io/)
:::
+ `简单易用`：易于入门, 易于开发, 易于集成, 易于发布， 易于监控
+ `高性能`：性能远远高于 Dubbo、Motan、Thrift等框架，是gRPC性能的两倍
+ `交叉平台`，交叉语言：可以容易部署在Windows/Linux/MacOS等平台，支持各种编程语言的调用
+ `服务发现`：除了直连外，还支持 Zookeeper、Etcd、 Consul、mDNS等注册中心
+ `服务治理`：支持 Failover、 Failfast、 Failtry、Backup等失败模式，支持 随机、 轮询、
  权重、网络质量, 一致性哈希,地理位置等路由算法

## 3.如何使用RPCx
::: tip 提示
框架集成了RPCx组件，只需要配置文件中配置 [rpc服务端、客户端配置](../baseconfig.md)。
:::
### 3.1 服务发现
参照实际项目开发，框架中只集成了Zookeeper、Etcd、 Consul三种常用的服务发现方式。
```go
const (
	ETCD RegisterPluginType = "etcd"
	ZK   RegisterPluginType = "zookeeper"
	Con  RegisterPluginType = "consul"
)
```

### 3.2 服务与治理
服务治理是一个非常宽泛的概念，一般指独立于业务逻辑之外，给系统提供一些可靠运行的系统保障措施。
针对微服务场景下的常用故障模式，提供的保障措施包括流控、负载均衡、重试、隔离仓等。
#### 3.2.1 基础配置
::: tip 提示
服务的基础配置可参照`server/rpcx/client.go:101`，可自定义。(无则走默认配置)
:::

默认：
```go
func option() client.Option {
	opt := client.Option{
		Retries:            10,               // 重试次数
		TimeToDisallow:     time.Minute,      // 30秒内不会对失败的服务器进行重试
		ConnectTimeout:     3 * time.Second,  // 连接超时
		IdleTimeout:        10 * time.Second, // 最大空闲时间
		BackupLatency:      10 * time.Millisecond, // 备份模式时间间隔
		GenBreaker:         breaker, // 熔断器
		SerializeType:      protocol.MsgPack, // 序列化方式
		CompressType:       protocol.None, // 压缩方式
		TCPKeepAlivePeriod: time.Minute, // TCP保活时间
	}
	return opt
}
```

**自定义**
```go
package opt
// 100毫秒后内失败次数达到5次，熔断器打开 
func customBreak() client.Breaker {
	return client.NewConsecCircuitBreaker(5, 100*time.Millisecond)
}

func CustomOption() client.Option {
    opt := client.Option{
        Retries:            5,               // 重试次数
        TimeToDisallow:     time.Minute,      // 30秒内不会对失败的服务器进行重试
        ConnectTimeout:     1 * time.Second,  // 连接超时
        IdleTimeout:        30 * time.Second, // 最大空闲时间
        BackupLatency:      10 * time.Millisecond, // 备份模式时间间隔
        GenBreaker:         customBreak, // 熔断器
        SerializeType:      protocol.MsgPack, // 序列化方式
        CompressType:       protocol.None, // 压缩方式
        TCPKeepAlivePeriod: time.Minute, // TCP保活时间
    }
    return opt
}

```
在`cmd/api/server.go`中进行注册。
```go
func setup() {
	...
	
	// 注册
	rpcx.CustomOptions(opt.CustomOption)
	
	// 应用初始化
	application.Init()
	...
}
```

#### 3.2.2 失败模式
```go
const (
	// FailFast 如果调用失败，立即返回错误
	FailFast FailRetryModel = iota + 1
	// FailOver 如果调用失败，重试其他服务器
	FailOver
	// FailTry 如果调用失败，重试当前服务器
	FailTry
)
```
#### 3.2.3 负载均衡
框架中选择了较为常用的几种进行集成。
```go
const (
	// Random 随机
	Random BalanceModel = iota + 1
	// RoundRobin 轮询
	RoundRobin
	// ConsistentHash 一致性哈希
	ConsistentHash
	// NetworkQuality 网络质量
	NetworkQuality
)
```

### 3.3 服务端
#### 3.3.1 服务启动与注册
在`application/rpcserver.go`中提供`RpcServer`方法，用于启动RPC服务。
```go
func RpcServer(handler interface{}, auth ...rpcx.AuthFunc) {
	...
	var err error
	rpcServer, err = rpcx.NewRPCServer(rpcx.ServerConfig{
		ServerName:      config.Conf.RpcServer.ServerName,
		Addr:            fmt.Sprintf("%s:%d", addr, config.Conf.RpcServer.Port),
		BasePath:        config.Conf.RpcServer.BasePath,
		RegisterPlugin:  rpcx.RegisterPluginType(config.Conf.RpcServer.RegisterPlugin),
		RegisterServers: config.Conf.RpcServer.RegisterServers,
		Handle:          handler,
	})
	if err != nil {
		panic(err)
	}
	if len(auth) > 0 {
		rpcServer.RegisterAuthFunc(auth[0])
	}
    ...
	rpcServer.Start()
}

````

#### 3.3.2 认证组件
在`rpcx/server.go`提供了`RegisterAuthFunc`接口，用于自定义认证组件。
```go
type AuthFunc func(ctx context.Context, token string) error
```
::: tip 示例
```go
func TokenAuth(ctx context.Context, token string) error {
	if token == "admin" {
		return errors.New("token error")
    }
	return nil
}
```
:::

#### 3.3.3 日志中间件
在`rpcx/middleware.go`提供了`ServerLoggerPlugin`类，用于链路追踪以及请求链路打印。
```go
type ServerLoggerPlugin struct {
}

func (p *ServerLoggerPlugin) PreHandleRequest(ctx context.Context, r *protocol.Message) error {
	logger.SetRequestId(r.Metadata["request_id"])
	traceId := r.Metadata["span_trace_id"]
	if traceId != "" {
		span, spanTraceId, err := telemetry.StartSpan("RpcCall", traceId, true, opentracing.StartTime(time.Now()))
		if err == nil {
			telemetry.SpanSetTag(span, "request_id", r.Metadata["request_id"])
			telemetry.SpanSetTag(span, "call_method", r.ServiceMethod)
			telemetry.SetSpanTraceId(spanTraceId)
			spanMap.Store(goid.Get(), span)
		}
	}

	logger.Info("client: %s, server: %v, func: %s, params: %s", r.Metadata["client_name"], r.ServicePath, r.ServiceMethod, r.Metadata["content"])
	return nil
}

func (p *ServerLoggerPlugin) PostWriteResponse(ctx context.Context, req *protocol.Message, res *protocol.Message, err error) error {
	logger.DeleteRequestId()
	if span, ok := spanMap.Load(goid.Get()); ok {
		telemetry.FinishSpan(span.(opentracing.Span))
		spanMap.Delete(goid.Get())
	}
	return nil
}

```

### 3.4 客户端
#### 3.4.1 客户端池初始化
在`application/rpcserver.go`中提供`initRpcClient`方法，用于初始化RPC客户端连接池。该方法会自动触发，
如果存在`rpcClient`配置，将自动初始化。
```go
func initRpcClient() {
  if config.Conf.RpcClient == nil {
      return
  }
  client, err := rpcx.NewRPCClient(rpcx.ClientConfig{
    ClientName:      config.Conf.RpcClient.ClientName,
    BasePath:        config.Conf.RpcClient.BasePath,
    RegisterPlugin:  rpcx.RegisterPluginType(config.Conf.RpcClient.RegisterPlugin),
    RegisterServers: config.Conf.RpcClient.RegisterServers,
    FailRetryModel:  rpcx.FailRetryModel(config.Conf.RpcClient.FailRetryModel),
    BalanceModel:    rpcx.BalanceModel(config.Conf.RpcClient.BalanceModel),
    PoolSize:        config.Conf.RpcClient.PoolSize,
  })
  if err != nil {
      panic(err)
  }
  rpcClient = &RpcClient{
        ClientName: config.Conf.RpcClient.ClientName,
        clientPool: client,
    }
  }
```

#### 3.4.2 自定义header处理方法
在`application/rpcserver.go`提供了`RegisterHeaderFunc`接口，用于自定义header处理方法。
该方法用于将需要通过context传递的参数添加到rpc请求元数据中。

::: tip 示例
在应用`cmd/api/server.go`中进行对应方法注册
```go
func setup() {
    ...
    // 注册头部context链路
    application.RegisterHeaderFunc(HeaderFunc)
}

func HeaderFunc(ctx *routing.Context, data map[string]string) map[string]string {
	// 获取用户名
	data["userId"] = ctx.Header.Value("userId")
	...
	return data
}
```
:::

#### 3.4.3 客户端进行远程调用
`application/rpcserver.go`提供了`RpcCall`方法以及`SRpcCall`方法，用于进行远程调用。
在`RpcCall`以及`SRpcCall`中集成了`参数解析`、`链路追踪`、`header处理`等方法，对rpc
响应参数进行了处理。

::: tip RpcCall示例
`RpcCall`方法接口rpc响应结果后，需要手动处理http响应。（该http响应结构以及方法可自定义）
```go
func (a *AuthController) GetSystemInfo(c *routing.Context) error {
    var (
        req  = new(auth2.SystemInfoSearch)
        resp = new(auth2.SystemInfoResp)
    )
    err := application.RpcCall(c, rpcserver.AuthServer, rpcserver.AuthFuncSystemInfo, req, resp)
    if err != nil {
        return a.Fail(c, err)
    }
    return a.Success(c, resp, "")
}
```
:::

::: tip SRpcCall示例
`SRpcCall`方法接口rpc响应结果后，会自动调用http响应方法。（http响应方法为系统提供，不支持自定义响应）
```go
func (a *AuthController) Login(c *routing.Context) error {
    return application.SRpcCall(c, rpcserver.AuthServer, rpcserver.AuthFuncLogin, new(auth2.LoginParams), new(auth2.LoginResp))
}
```
:::
