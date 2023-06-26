---
title: RPCx Component
---


# RPC Component
## 1. What is RPC?
::: theorem Remote Procedure Call
In distributed computing, a remote procedure call (RPC) is when a computer program causes a procedure (subroutine)
to execute in a different address space (commonly on another computer on a shared network), which is written
as if it were a normal (local) procedure call, without the programmer explicitly writing the details for the
remote interaction. That is, the programmer writes essentially the same code whether the subroutine is local
to the executing program, or remote. This is a form of client–server interaction (caller is client, executor is server),
typically implemented via a request–response message-passing system. In the object-oriented programming paradigm,
RPCs are represented by remote method invocation (RMI). The RPC model implies a level of location transparency,
namely that calling procedures are largely the same whether they are local or remote, but usually,
they are not identical, so local calls can be distinguished from remote calls.
Remote calls are usually orders of magnitude slower and less reliable than local calls,
so distinguishing them is important.

RPCs are a form of inter-process communication (IPC), in that different processes have different address spaces:
if on the same host machine, they have distinct virtual address spaces, even though the physical address space is the same;
while if they are on different hosts, the physical address space is different. 
Many different (often incompatible) technologies have been used to implement the concept.
::: right
Source [wiki](https://en.wikipedia.org/wiki/Remote_procedure_call)
:::

## 2.What is RPCx?
::: theorem RPCx
RPCx is a distributed Go language RPC framework that supports multiple service discovery methods, 
such as ZooKeeper, etcd, and Consul. It is one of the fastest RPC frameworks available.
::: right
Source [rpcx](https://doc.rpcx.io/)
:::

+ Easy to use: Easy to learn, develop, integrate, deploy, and monitor.
+ High performance: Significantly outperforms frameworks like `Dubbo`, `Motan`, and `Thrift`, and offers twice the performance of `gRPC`.
+ Cross-platform and cross-language: Can be easily deployed on Windows/Linux/MacOS and supports various programming languages.
+ Service discovery: In addition to direct connections, it supports service discovery with `ZooKeeper`, `etcd`, `Consul`, `mDNS`, and more.
+ Service governance: Supports `failover`, `failfast`, `failtry`, backup, and other failure modes, as well as `random`, `round-robin`,
`weighted`, `network quality`, `consistent hashing`, and `geographic routing algorithms`.

## 3. How to use RPCx
::: tip Note
The framework integrates the RPCx component, and you only need to configure the RPC server and client settings in the
configuration file.
:::

### 3.1 Service Discovery
Refer to the actual project development. The framework only integrates three commonly used service discovery methods:
`ZooKeeper`, `etcd`, and `Consul`.
```go
const (
	ETCD RegisterPluginType = "etcd"
	ZK   RegisterPluginType = "zookeeper"
	Con  RegisterPluginType = "consul"
)
```

### 3.2 Service Governance
Service governance is a broad concept that generally refers to providing reliable measures to ensure the proper
functioning of a system, independent of business logic. For common failure scenarios in microservice environments,
it provides safeguards such as flow control, load balancing, retrying, and isolation.

#### 3.2.1 Basic Configuration
::: tip Note
The basic configuration of the service can be customized and referred to in `server/rpcx/client.go:101`.
If not customized, the default configuration is used.
:::

Default configuration:
```go
func option() client.Option {
	opt := client.Option{
		Retries:            10,               // Retry times
		TimeToDisallow:     time.Minute,      // The failed server will not be retried for 30 seconds
		ConnectTimeout:     3 * time.Second,  // Connection timeout
		IdleTimeout:        10 * time.Second, // Maximum idle time
		BackupLatency:      10 * time.Millisecond, // ackup mode interval
		GenBreaker:         breaker, // fuse
		SerializeType:      protocol.MsgPack, // serialize type
		CompressType:       protocol.None, // compress type
		TCPKeepAlivePeriod: time.Minute, 
	}
	return opt
}
```
**Custom**
```go
package opt

// Circuit breaker opens when the number of failures reaches 5 within 100 milliseconds
func customBreak() client.Breaker {
	return client.NewConsecCircuitBreaker(5, 100*time.Millisecond)
}

func CustomOption() client.Option {
	opt := client.Option{
		Retries:            5,               // Retry times
		TimeToDisallow:     time.Minute,      // Retry is not allowed within 30 seconds
		ConnectTimeout:     1 * time.Second,  // Connection timeout
		IdleTimeout:        30 * time.Second, // Maximum idle time
		BackupLatency:      10 * time.Millisecond, // Backup mode interval
		GenBreaker:         customBreak, // Circuit breaker
		SerializeType:      protocol.MsgPack, // Serialization type
		CompressType:       protocol.None, // Compression type
		TCPKeepAlivePeriod: time.Minute, // TCP keep-alive time
	}
	return opt
}
```

Register in `cmd/api/server.go`.
```go
func setup() {
	...

	// Register
	rpcx.CustomOptions(opt.CustomOption)

	// Application initialization
	application.Init()
	...
}
```
#### 3.2.2 Failure Mode
```go
const (
    // FailFast returns an error immediately if the call fails.
    FailFast FailRetryModel = iota + 1
    // FailOver retries other servers if the call fails.
    FailOver
    // FailTry retries the current server if the call fails.
    FailTry
)
```
#### 3.2.3 Load Balancing
The framework integrates several commonly used load balancing methods.
```go
const (
    // Random selects a random server.
    Random BalanceModel = iota + 1
    // RoundRobin uses round-robin algorithm to select servers.
    RoundRobin
    // ConsistentHash uses consistent hashing algorithm.
    ConsistentHash
    // NetworkQuality selects servers based on network quality.
    NetworkQuality
)
```

### 3.3 Server
#### 3.3.1 Server Startup and Registration
In `application/rpcserver.go`, provide the `RpcServer` method to start the RPC server.
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
```

#### 3.3.2 Authentication Component
In `rpcx/server.go`, `RegisterAuthFunc` interface is provided to customize the authentication component.
```go
type AuthFunc func(ctx context.Context, token string) error
```
::: tip Example
```go
func TokenAuth(ctx context.Context, token string) error {
	if token == "admin" {
		return errors.New("token error")
	}
	return nil
}
```
:::

#### 3.3.3 Logging Middleware
In `rpcx/middleware.go`, `ServerLoggerPlugin` class is provided for request tracing and logging.
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
### 3.4 Client
#### 3.4.1 Client Pool Initialization
In `application/rpcserver.go`, provide the `initRpcClient` method to initialize the RPC client connection pool. This method is automatically triggered and will initialize if there is a `rpcClient` configuration.
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

#### 3.4.2 Custom Header Handling Function
In `application/rpcserver.go`, the `RegisterHeaderFunc` interface is provided to customize the header handling function. This method is used to add parameters that need to be passed through the context to the RPC request metadata.

::: tip Example
Register the corresponding function in the application `cmd/api/server.go`.
```go
func setup() {
    ...
    // Register header context chain
    application.RegisterHeaderFunc(HeaderFunc)
}

func HeaderFunc(ctx *routing.Context, data map[string]string) map[string]string {
    // Get the username
    data["userId"] = ctx.Header.Value("userId")
    ...
    return data
}
```
:::

#### 3.4.3 Remote Invocation by Client
In `application/rpcserver.go`, the `RpcCall` and `SRpcCall` methods are provided for remote invocation. These methods integrate parameter parsing, request tracing, header processing, and other functions to handle the RPC response parameters.

::: tip Example of RpcCall
After receiving the response from the `RpcCall` method, you need to handle the HTTP response manually. (The HTTP response structure and methods can be customized.)
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

::: tip Example of SRpcCall
After receiving the response from the `SRpcCall` method, the HTTP response method is automatically invoked. (The HTTP response method is provided by the system and does not support customization.)
```go
func (a *AuthController) Login(c *routing.Context) error {
    return application.SRpcCall(c, rpcserver.AuthServer, rpcserver.AuthFuncLogin, new(auth2.LoginParams), new(auth2.LoginResp))
}
```
:::
