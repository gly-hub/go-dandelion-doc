---
title: http组件
---

# http组件

## 1.什么是HTTP
::: theorem 远程过程调用
超文本传输协议（英语：HyperText Transfer Protocol，缩写：HTTP）是一种用于分布式、
协作式和超媒体信息系统的应用层协议。HTTP是万维网的数据通信的基础。

设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。通过HTTP或者HTTPS协议请求的资源由统一资源标识符
（Uniform Resource Identifiers，URI）来标识。

HTTP是一个客户端（用户）和服务端（网站）之间请求和应答的标准，通常使用TCP协议。通过使用网页浏览器、网络爬虫或者其它的工具，
客户端发起一个HTTP请求到服务器上指定端口（默认端口为80）。我们称这个客户端为用户代理程序（user agent）。
应答的服务器上存储着一些资源，比如HTML文件和图像。我们称这个应答服务器为源服务器（origin server）。
在用户代理和源服务器中间可能存在多个“中间层”，比如代理服务器、网关或者隧道（tunnel）。
::: right
来自 [维基百科](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)
:::

## 2.为什么选择fasthttp
::: theorem 
## HTTP server performance comparison with [net/http](https://pkg.go.dev/net/http)

In short, fasthttp server is up to 10 times faster than net/http.
Below are benchmark results.

*GOMAXPROCS=1*

net/http server:
```
$ GOMAXPROCS=1 go test -bench=NetHTTPServerGet -benchmem -benchtime=10s
BenchmarkNetHTTPServerGet1ReqPerConn                	 1000000	     12052 ns/op	    2297 B/op	      29 allocs/op
BenchmarkNetHTTPServerGet2ReqPerConn                	 1000000	     12278 ns/op	    2327 B/op	      24 allocs/op
BenchmarkNetHTTPServerGet10ReqPerConn               	 2000000	      8903 ns/op	    2112 B/op	      19 allocs/op
BenchmarkNetHTTPServerGet10KReqPerConn              	 2000000	      8451 ns/op	    2058 B/op	      18 allocs/op
BenchmarkNetHTTPServerGet1ReqPerConn10KClients      	  500000	     26733 ns/op	    3229 B/op	      29 allocs/op
BenchmarkNetHTTPServerGet2ReqPerConn10KClients      	 1000000	     23351 ns/op	    3211 B/op	      24 allocs/op
BenchmarkNetHTTPServerGet10ReqPerConn10KClients     	 1000000	     13390 ns/op	    2483 B/op	      19 allocs/op
BenchmarkNetHTTPServerGet100ReqPerConn10KClients    	 1000000	     13484 ns/op	    2171 B/op	      18 allocs/op
```

fasthttp server:
```
$ GOMAXPROCS=1 go test -bench=kServerGet -benchmem -benchtime=10s
BenchmarkServerGet1ReqPerConn                       	10000000	      1559 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet2ReqPerConn                       	10000000	      1248 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10ReqPerConn                      	20000000	       797 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10KReqPerConn                     	20000000	       716 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet1ReqPerConn10KClients             	10000000	      1974 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet2ReqPerConn10KClients             	10000000	      1352 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10ReqPerConn10KClients            	20000000	       789 ns/op	       2 B/op	       0 allocs/op
BenchmarkServerGet100ReqPerConn10KClients           	20000000	       604 ns/op	       0 B/op	       0 allocs/op
```

*GOMAXPROCS=4*

net/http server:
```
$ GOMAXPROCS=4 go test -bench=NetHTTPServerGet -benchmem -benchtime=10s
BenchmarkNetHTTPServerGet1ReqPerConn-4                  	 3000000	      4529 ns/op	    2389 B/op	      29 allocs/op
BenchmarkNetHTTPServerGet2ReqPerConn-4                  	 5000000	      3896 ns/op	    2418 B/op	      24 allocs/op
BenchmarkNetHTTPServerGet10ReqPerConn-4                 	 5000000	      3145 ns/op	    2160 B/op	      19 allocs/op
BenchmarkNetHTTPServerGet10KReqPerConn-4                	 5000000	      3054 ns/op	    2065 B/op	      18 allocs/op
BenchmarkNetHTTPServerGet1ReqPerConn10KClients-4        	 1000000	     10321 ns/op	    3710 B/op	      30 allocs/op
BenchmarkNetHTTPServerGet2ReqPerConn10KClients-4        	 2000000	      7556 ns/op	    3296 B/op	      24 allocs/op
BenchmarkNetHTTPServerGet10ReqPerConn10KClients-4       	 5000000	      3905 ns/op	    2349 B/op	      19 allocs/op
BenchmarkNetHTTPServerGet100ReqPerConn10KClients-4      	 5000000	      3435 ns/op	    2130 B/op	      18 allocs/op
```

fasthttp server:
```
$ GOMAXPROCS=4 go test -bench=kServerGet -benchmem -benchtime=10s
BenchmarkServerGet1ReqPerConn-4                         	10000000	      1141 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet2ReqPerConn-4                         	20000000	       707 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10ReqPerConn-4                        	30000000	       341 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10KReqPerConn-4                       	50000000	       310 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet1ReqPerConn10KClients-4               	10000000	      1119 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet2ReqPerConn10KClients-4               	20000000	       644 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet10ReqPerConn10KClients-4              	30000000	       346 ns/op	       0 B/op	       0 allocs/op
BenchmarkServerGet100ReqPerConn10KClients-4             	50000000	       282 ns/op	       0 B/op	       0 allocs/op
```

## HTTP client comparison with net/http

In short, fasthttp client is up to 10 times faster than net/http.
Below are benchmark results.

*GOMAXPROCS=1*

net/http client:
```
$ GOMAXPROCS=1 go test -bench='HTTPClient(Do|GetEndToEnd)' -benchmem -benchtime=10s
BenchmarkNetHTTPClientDoFastServer                  	 1000000	     12567 ns/op	    2616 B/op	      35 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1TCP               	  200000	     67030 ns/op	    5028 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd10TCP              	  300000	     51098 ns/op	    5031 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd100TCP             	  300000	     45096 ns/op	    5026 B/op	      55 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1Inmemory          	  500000	     24779 ns/op	    5035 B/op	      57 allocs/op
BenchmarkNetHTTPClientGetEndToEnd10Inmemory         	 1000000	     26425 ns/op	    5035 B/op	      57 allocs/op
BenchmarkNetHTTPClientGetEndToEnd100Inmemory        	  500000	     28515 ns/op	    5045 B/op	      57 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1000Inmemory       	  500000	     39511 ns/op	    5096 B/op	      56 allocs/op
```

fasthttp client:
```
$ GOMAXPROCS=1 go test -bench='kClient(Do|GetEndToEnd)' -benchmem -benchtime=10s
BenchmarkClientDoFastServer                         	20000000	       865 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1TCP                      	 1000000	     18711 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd10TCP                     	 1000000	     14664 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd100TCP                    	 1000000	     14043 ns/op	       1 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1Inmemory                 	 5000000	      3965 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd10Inmemory                	 3000000	      4060 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd100Inmemory               	 5000000	      3396 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1000Inmemory              	 5000000	      3306 ns/op	       2 B/op	       0 allocs/op
```

*GOMAXPROCS=4*

net/http client:
```
$ GOMAXPROCS=4 go test -bench='HTTPClient(Do|GetEndToEnd)' -benchmem -benchtime=10s
BenchmarkNetHTTPClientDoFastServer-4                    	 2000000	      8774 ns/op	    2619 B/op	      35 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1TCP-4                 	  500000	     22951 ns/op	    5047 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd10TCP-4                	 1000000	     19182 ns/op	    5037 B/op	      55 allocs/op
BenchmarkNetHTTPClientGetEndToEnd100TCP-4               	 1000000	     16535 ns/op	    5031 B/op	      55 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1Inmemory-4            	 1000000	     14495 ns/op	    5038 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd10Inmemory-4           	 1000000	     10237 ns/op	    5034 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd100Inmemory-4          	 1000000	     10125 ns/op	    5045 B/op	      56 allocs/op
BenchmarkNetHTTPClientGetEndToEnd1000Inmemory-4         	 1000000	     11132 ns/op	    5136 B/op	      56 allocs/op
```

fasthttp client:
```
$ GOMAXPROCS=4 go test -bench='kClient(Do|GetEndToEnd)' -benchmem -benchtime=10s
BenchmarkClientDoFastServer-4                           	50000000	       397 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1TCP-4                        	 2000000	      7388 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd10TCP-4                       	 2000000	      6689 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd100TCP-4                      	 3000000	      4927 ns/op	       1 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1Inmemory-4                   	10000000	      1604 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd10Inmemory-4                  	10000000	      1458 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd100Inmemory-4                 	10000000	      1329 ns/op	       0 B/op	       0 allocs/op
BenchmarkClientGetEndToEnd1000Inmemory-4                	10000000	      1316 ns/op	       5 B/op	       0 allocs/op
```
::: right
来自 [fasthttp](https://github.com/valyala/fasthttp)
:::

## 3.如何使用
::: tip 提示
框架集成了http组件，只需要配置文件中配置 [http配置](../baseconfig.md)。
:::

### 3.1 启动
在`application/httpserver.go`中提供了`initHttpServer`方法进行服务初始化。
调用`Server`方法即可启动服务。
```go
// 可参考 http服务 cmd/api/server.go:95
application.HttpServer().Server()
```

### 3.2 控制器
实现一个控制器
```go
package auth

type AuthController struct {
    http.HttpController
}

// Login
// @Summary 登录
// @Description 用户登录
// @Tags 基础模块|用户登录登出
// @Param deptName body auth.LoginParams true "登录参数"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/login [post]
func (a *AuthController) Login(c *routing.Context) error {
	return application.SRpcCall(c, rpcserver.AuthServer, rpcserver.AuthFuncLogin, new(auth2.LoginParams), new(auth2.LoginResp))
}
```
### 3.3 路由
```go
package auth

func InitAuthRoute(baseRouter *routing.RouteGroup) {
	authHandler := auth.AuthController{}
	// 登录登出
	baseRouter.Post("/login", authHandler.Login)
}
```

### 3.4 swagger文档
示例：
```go
// Login
// @Summary 登录
// @Description 用户登录
// @Tags 基础模块|用户登录登出
// @Param deptName body auth.LoginParams true "登录参数"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/login [post]
```

### 3.5 中间件
#### 3.5.1 系统默认中间件
::: tip 提示
系统中间件默认启动，不能修改
:::
+ `middlewareRequestLink`: 请求链路中间件，用于生成request_id，传递traceid，形成链路追踪。
代码参考：`server/http/middleware.go:36`

+ `middlewareCustomError`: panic中间件，用于捕获panic。
代码参考：`server/http/middleware.go:91`

+ `middlewareSentinel`: 限流中间件，用于限制接口访问频率。
代码参考：`server/http/middleware.go:108`

#### 3.5.2 自定义中间件
示例：
```go
package middleware
import (
	routing "github.com/gly-hub/fasthttp-routing"
)

func CorsMiddleware() routing.Handler {
	return func(c *routing.Context) error {
		c.Response.Header.Set("Access-Control-Allow-Origin", "*")
		c.Response.Header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Response.Header.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Response.Header.Set("Access-Control-Max-Age", "86400")
		c.Response.Header.Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Header.IsOptions() {
			c.Abort()
			return nil
		}

		return c.Next()
	}
}
```
注册中间件：
```go
package auth

func InitAuthRoute(baseRouter *routing.RouteGroup) {
	baseRouter.Use(middleware.CorsMiddleware())
	authHandler := auth.AuthController{}
	// 登录登出
	baseRouter.Post("/login", authHandler.Login)
}
```
