---
title: Directory Structure
---

# Directory Structure

## RPC Service
``` shell 
.
├── boot
│   └── boot.go              // Register initialization methods here
├── cmd
│   ├── api
│   │   └── server.go        // Service startup entry point
│   └── cobra.go             // Cobra command registration
├── config                    // Service configuration folder
│   └── configs_local.yaml    // Local configuration file
├── global
│   └── global.go            // Global variables
├── internal
│   ├── dao                  // Database operations
│   ├── enum                 // Enums and constants
│   ├── logic                // Business logic
│   ├── model                // Data models
│   └── service              // Services
│       └── api.go           // Service interface
├── static
│   └── rpc-server.txt       // Service name
├── tools                    // Utility classes
│
└── main.go                  // Entry file
```
+ `boot`: Register the corresponding initialization methods in the `boot` directory. Implement the registration method in `boot/boot.go`.
+ `cmd`: Register `cobra` commands. Currently, provides the `api` service startup entry point.
+ `config`: Configuration folder. Configuration files are in YAML format and must be strictly written in YAML format, otherwise errors may occur. The initial creation includes a local environment configuration file `config/configs_local.yaml`.
+ `global`: Global variables for custom global variables.
+ `internal`: Directory for implementing business code. `internal/dao` is for database operations, `internal/logic` is for business logic, `internal/model` is for data models, and `internal/service` is for service interfaces.
+ `static`: Stores static files.
+ `tools`: Utility classes. Custom utility classes should be placed in this directory.

## HTTP Service
``` shell
.
├── cmd
│   ├── api
│   │   └── server.go        // Service startup entry point
│   └── cobra.go             // Cobra command registration
├── config                    // Service configuration folder
│   └── configs_local.yaml    // Local configuration file
├── internal
│   ├── middleware           // Custom middleware
│   ├── route                // Route management
│   │   └── route.go         // Provides basic routes
│   └── service              // Services
├── static
│   └── http-server.txt       // Service name
│ 
└── main.go                  // Entry file
```
+ `cmd`: Register `cobra` commands. Currently, provides the `api` service startup entry point.
+ `config`: Configuration folder. Configuration files are in YAML format and must be strictly written in YAML format, otherwise errors may occur. The initial creation includes a local environment configuration file `config/configs_local.yaml`.
+ `internal`: Directory for implementing business code. `internal/middleware` is used to store custom middleware, `internal/route` is for route management, `internal/service` is for service implementation and RPC invocation.
+ `static`: Stores static files.
