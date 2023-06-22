---
title: Quick Build
---
# Quick Build

::: warning Prerequisites
Go version >= 1.18
:::

This guide will help you build a simple go-dandelion application from scratch.

## 1. Install go-dandelion scaffolding tool

Install go-dandelion-cli to quickly generate project structure.

```shell
go get github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
go install github.com/gly-hub/go-dandelion/go-dandelion-cli@latest
```

## 2. Create go-admin-example application

Executing the command will create a folder named go-admin-example as the application's main directory.

::: warning Application Name
All services under this application share the same mod and need to have consistent application names: **go-admin-example**
:::

```shell
# Create application and navigate into it
go-dandelion-cli app -n go-admin-example && cd go-admin-example
```

## 3. Build RPC service

Initialize an RPC server service as an example RPC service for business logic implementation.

```shell
# Build RPC service
go-dandelion-cli build -n go-admin-example
```

Here, you need to select the required components such as MySQL, Redis, logger, and tracing. In this example, all components are initialized.

```cmd
Enter the service type to create (1-rpc 2-http): 1
RPC service name: rpc-server
Initialize MySQL (y/n): y
Initialize Redis (y/n): y
Initialize logger (y/n): y
Initialize tracing (y/n): y
```

## 4. Build HTTP service

Initialize an HTTP server service as an example gateway service for external data interaction.

```shell
# Build HTTP service
go-dandelion-cli build -n go-admin-example
```

Here, you need to select the required components such as MySQL, Redis, logger, and tracing. Since the gateway layer does not perform DAO operations, MySQL and Redis initialization is not required.

```cmd
Enter the service type to create (1-rpc 2-http): 2
RPC service name: http-server
Initialize MySQL (y/n): n
Initialize Redis (y/n): n
Initialize logger (y/n): y
Initialize tracing (y/n): y
```

## 5. Modify configuration files

You need to modify the corresponding MySQL, Redis, tracing, and etcd configurations according to your own development environment. For an explanation of the configuration fields, please refer to [Base Configuration](/guide/baseconfig).

## 6. Start the services

```shell
## Start the RPC service
cd rpc-server
# Navigate to the service directory
go build -o rpc-server
# Run
./rpc-server server
```

```shell
## Start the HTTP service
cd http-server
# Navigate to the service directory
go build -o http-server
# Run
./http-server server
```
