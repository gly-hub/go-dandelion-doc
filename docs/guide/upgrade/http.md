---
title: HTTP Component
---

# HTTP Component

## 1. What is HTTP

:::theorem Remote Procedure Call
Hypertext Transfer Protocol (HTTP) is an application-layer protocol used for distributed,
collaborative, and hypermedia information systems. It serves as the foundation for
data communication on the World Wide Web.

The initial purpose of designing HTTP was to provide a method for publishing and retrieving HTML pages.
Resources requested through HTTP or HTTPS are identified by Uniform Resource Identifiers (URIs).

HTTP is a standard for request and response between a client (user) and a server (website),
typically using the TCP protocol. The client, often a web browser, network crawler, or other tools,
initiates an HTTP request to a specified port on the server (default port 80). 
The client is referred to as the user agent. The server stores resources, such as HTML files and images,
and is referred to as the origin server. There may be multiple "intermediary" layers between the
user agent and the origin server, such as proxy servers, gateways, or tunnels.
::: right
Source: [Wikipedia](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)
:::

## 2.Why fasthttp
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
resource [fasthttp](https://github.com/valyala/fasthttp)
:::

## 3. How to Use

::: tip Note
The framework integrates the HTTP component, which requires configuration 
in the configuration file [HTTP Configuration](../baseconfig.md).
:::

### 3.1 Startup

The `initHttpServer` function in `application/httpserver.go` provides service initialization.
Call the `Server` method to start the server.
```go
// Refer to the HTTP server in cmd/api/server.go:95
application.HttpServer().Server()
```

### 3.2 Controllers

Implement a controller.
```go
package auth

type AuthController struct {
    http.HttpController
}

// Login
// @Summary Login
// @Description user login
// @Tags base
// @Param deptName body auth.LoginParams true "params"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/login [post]
func (a *AuthController) Login(c *routing.Context) error {
	return application.SRpcCall(c, rpcserver.AuthServer, rpcserver.AuthFuncLogin, new(auth2.LoginParams), new(auth2.LoginResp))
}
```
### 3.3 Route
```go
package auth

func InitAuthRoute(baseRouter *routing.RouteGroup) {
	authHandler := auth.AuthController{}
	// 登录登出
	baseRouter.Post("/login", authHandler.Login)
}
```

### 3.4 swagger Doc
示例：
```go
// Login
// @Summary Login
// @Description user login
// @Tags base
// @Param deptName body auth.LoginParams true "params"
// @Success 200 {object} auth.LoginResp "{"code": 200, "data": [...]}"
// @Router /api/login [post]
```

### 3.5 Middleware

#### 3.5.1 Default Middleware

::: tip Note
The system middleware is enabled by default and cannot be modified.
:::

+ `middlewareRequestLink`: Request link middleware, used to generate `request_id` and pass `traceid` to form a request chain.
  Code reference: `server/http/middleware.go:36`

+ `middlewareCustomError`: Panic middleware, used to capture panics.
  Code reference: `server/http/middleware.go:91`

+ `middlewareSentinel`: Rate limiting middleware, used to limit the frequency of API requests.
  Code reference: `server/http/middleware.go:108`

#### 3.5.2 Custom middleware
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
Registration middleware：
```go
package auth

func InitAuthRoute(baseRouter *routing.RouteGroup) {
	baseRouter.Use(middleware.CorsMiddleware())
	authHandler := auth.AuthController{}
	// 登录登出
	baseRouter.Post("/login", authHandler.Login)
}
```
