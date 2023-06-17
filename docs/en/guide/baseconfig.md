---
title: Basic configuration
---
# Basic configuration

::: warning look out
The configuration file is in YAML format and must be strictly written according to the YAML syntax, otherwise an error will occur.
:::

## 1.RPC
::: tip 服务发现
目前只支持etcd
:::
```yaml
rpcServer:
  model: 1
  serverName: "服务名"
  etcd: ["127.0.0.1:2379"]
  basePath: "go-admin-example"
  addr: ""
  port: 8899
  pprof: 18899
 ```
+ `model`: 0-单点对单点（默认）、1-单点对随机、2-单点对所有、3-最大值
+ `serverName`: 服务名称，作服务发现key
+ `etcd`: etcd地址, 目前只支持etcd作服务发现
+ `basePath`: etcd服务发现的根目录（一般为项目名）
+ `addr`: rpc服务地址，一般不填。k8s集群部署时，填写service地址
+ `port`: rpc服务端口
+ `pprof`: rpc服务pprof端口

## 2.HTTP
```yaml
httpServer:
  port: 8080
  pprof: 8088

rpcServer:
  model: 1
  serverName: "服务名"
  etcd: ["127.0.0.1:2379"]
  basePath: "go-admin-example"
```
+ `port`: http服务端口
+ `pprof`: http服务pprof端口
## 3.Database
::: tip supported
Currently, only MySQL is supported.
:::
```yaml
db:
  dbType: "mysql"
  maxOpenConn: 20
  maxIdleConn: 4
  maxIdleTime: 100
  maxLifeTime: 3600
  level: 4
  slowThreshold: "100ms"
  master:
    user: "root"
    password: "password"
    host: "127.0.0.1"
    port: "3306"
    database: "database"
  slave:
    - user: "root"
      password: "password"
      host: "127.0.0.1"
      port: "3306"
      database: "database"
```
+ `dbType`: 数据库类型
+ `maxOpenConn`: 最大打开连接数
+ `maxIdleConn`: 最大空闲连接数
+ `maxIdleTime`: 最大空闲时间
+ `maxLifeTime`: 最大生命周期
+ `level`: 日志级别
+ `slowThreshold`: 慢日志阈值
+ `master`: 主库配置
+ `slave`: 从库配置
## 4.Redis
::: tip redis model
Currently, there are three deployment modes available: standalone (alone), sentinel, and cluster.
:::
```yaml
redis:
  redisType: "alone"
  network: "127.0.0.1:6379"
  startAddr: ["127.0.0.1:6379"]
  active: 100
  idle: 100
  auth: ""
  connTimeout: "100ms"
  readTimeout: "100ms"
  writeTimeout: "100ms"
  idleTimeout: "100ms"
```
+ `redisType`: redis类型
+ `network`: 单机地址
+ `startAddr`: 哨兵或集群地址
+ `active`: 最大活跃连接数
+ `idle`: 最大空闲连接数
+ `auth`: 密码
+ `connTimeout`: 连接超时时间
+ `readTimeout`: 读超时时间
+ `writeTimeout`: 写超时时间
+ `idleTimeout`: 空闲超时时间
## 5.Logger
::: tip level
0-Emergency
1-Alert
2-Critical
3-Error
4-Warning
5-Notice
6-Informational
7-Debug
:::
```yaml
logger:
  consoleShow: true
  consoleLevel:  7
  fileWrite:  false
  fileLevel:  7
  multiFileWrite: false
  multiFileLevel: 7
```
+ `consoleShow`: 是否打印到控制台
+ `consoleLevel`: 控制台日志级别
+ `fileWrite`: 是否写入文件
+ `fileLevel`: 文件日志级别
+ `multiFileWrite`: 是否写入多个文件
+ `multiFileLevel`: 多文件日志级别
## 6.Trace
::: tip look out
This configuration will only affect the reporting of traces and will not affect the normal logging tags.
:::
```yaml
tracer:
  openTrace: false
  traceName: "服务名"
  host: "127.0.0.1:6831"
```
+ `openTrace`: 是否开启链路追踪
+ `traceName`: 服务名
+ `host`: 链路追踪上报地址
