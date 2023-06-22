---
title: Basic Configuration
---
# Basic Configuration

::: warning Note
The configuration file is in YAML format and must be strictly written in YAML format, otherwise errors may occur.
:::

## 1. RPC Configuration
::: tip Service Discovery
Currently, only etcd is supported.
:::
```yaml
rpcServer:
  model: 1
  serverName: "Service Name"
  etcd: ["127.0.0.1:2379"]
  basePath: "go-admin-example"
  addr: ""
  port: 8899
  pprof: 18899
```
+ `model`: 0 - Point-to-Point (default), 1 - Point-to-Random, 2 - Point-to-All, 3 - Max
+ `serverName`: Service name used for service discovery key
+ `etcd`: etcd address, currently only etcd is supported for service discovery
+ `basePath`: Root directory for etcd service discovery (usually the project name)
+ `addr`: RPC service address, usually left blank. When deploying on a Kubernetes cluster, fill in the service address
+ `port`: RPC service port
+ `pprof`: RPC service pprof port

## 2. HTTP Configuration
```yaml
httpServer:
  port: 8080
  pprof: 8088

rpcServer:
  model: 1
  serverName: "Service Name"
  etcd: ["127.0.0.1:2379"]
  basePath: "go-admin-example"
```
+ `port`: HTTP service port
+ `pprof`: HTTP service pprof port

## 3. Database Configuration
::: tip Database Type
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
+ `dbType`: Database type
+ `maxOpenConn`: Maximum open connections
+ `maxIdleConn`: Maximum idle connections
+ `maxIdleTime`: Maximum idle time
+ `maxLifeTime`: Maximum connection lifetime
+ `level`: Log level
+ `slowThreshold`: Slow log threshold
+ `master`: Master database configuration
+ `slave`: Slave database configuration

## 4. Redis Configuration
::: tip Redis Mode
Currently supports standalone (alone), sentinel, and cluster modes.
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
+ `redisType`: Redis type
+ `network`: Standalone address
+ `startAddr`: Sentinel or cluster addresses
+ `active`: Maximum active connections
+ `idle`: Maximum idle connections
+ `auth`: Password
+ `connTimeout`: Connection timeout
