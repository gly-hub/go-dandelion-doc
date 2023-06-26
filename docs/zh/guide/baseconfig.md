---
title: 基础配置
---
# 基础配置

::: warning 注意
配置文件为yaml格式，需要严格按照yaml格式书写，否则会报错。
:::

## 1.rpc服务端配置
::: tip 服务发现
目前只支持etcd、zookeeper、consul。
:::
```yaml
rpcServer:
  serverName: "authorize"
  registerPlugin: "etcd"
  registerServers:
    - "127.0.0.1:2379"
  basePath: "go-admin"
  addr: ""
  port: 7655
  pprof: 7654
 ```
+ `serverName`: 服务名称，作服务发现key
+ `registerPlugin`: 服务注册类型。目前支持etcd、zookeeper、consul
+ `registerServers`: 服务注册地址
+ `basePath`: etcd服务发现的根目录（一般为项目名）
+ `addr`: rpc服务地址，一般不填。k8s集群部署时，填写service地址
+ `port`: rpc服务端口
+ `pprof`: rpc服务pprof端口

## 2.rpc客户端配置
```yaml
rpcClient:
  clientName: "internal-gateway"
  basePath: "go-admin"
  registerPlugin: "etcd"
  registerServers:
    - "127.0.0.1:2379"
  failRetryModel: 3
  balanceModel: 2
  poolSize: 1
 ```
+ `clientName`: 客户端名称
+ `registerPlugin`: 服务注册类型。目前支持etcd、zookeeper、consul
+ `registerServers`: 服务注册地址
+ `basePath`: etcd服务发现的根目录（一般为项目名）
+ `failRetryModel`: 失败重试模式。
+ `balanceModel`: 负载均衡模式。
+ `poolSize`: 连接池大小。

::: tip 关于
支持的负载均衡模式以及失败重试模式可在rpc进阶中了解。[前往](/zh/guide/upgrade/rpc.md)

默认：
+ `failRetryModel`：选择相同节点并重试，直到达到最大重试次数
+ `balanceModel`：使用 [roundrobin](https://zh.wikipedia.org/wiki/%E5%BE%AA%E7%92%B0%E5%88%B6) 算法选择节点
:::

## 3.http配置
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
## 4.数据库配置
::: tip 数据库类型
目前只支持mysql
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
## 5.redis配置
::: tip redis模式
目前支持单机（alone）, 哨兵（sentinel）, 集群（cluster）
:::
```yaml
redis:
  redisType: "alone"
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
## 6.日志配置
::: tip 日志等级
0紧急的 1警报 2重要的 3错误 4警告 5提示 6信息 7调试
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
## 7.链路追踪配置
::: tip 注意
该配置只会影响链路上报，不会影响正常的日志标记
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
