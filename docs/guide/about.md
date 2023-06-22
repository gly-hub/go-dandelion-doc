---
title: Introduction
---

# Introduction

go-dandelion is a framework scaffolding tool that integrates multiple popular components
and technologies, including rpcx, fasthttp, gorm, redigo, swagger, and opentracing, among
others. Its goal is to provide developers with a solution for quickly building microservice
projects, offering rich functionality and scalability.

## 1.Origin

When I was demonstrating a microservice using rpcx, I encountered a problem: while building
the project directory structure, I found myself having to import many components and manually
initialize them. This resulted in a cluttered project structure and lengthy initialization code.
To address this issue, I began contemplating if there was a tool that could quickly scaffold the
project directory structure and automatically initialize the components, facilitating faster business
development. This led me to start developing the go-dandelion tool.

The goal of go-dandelion is to provide a solution for rapidly building microservice projects.
It automatically creates the basic project directory structure and integrates automated initialization
for commonly used components. This allows us to dive into business development more quickly
without spending excessive time and effort on tedious initialization processes.

By using go-dandelion, I can swiftly create projects, and all the required components are correctly
initialized. This results in a clearer project structure and reduces repetitive initialization code.
Additionally, go-dandelion offers flexible configuration options and a plugin mechanism, allowing
customization and extension based on specific requirements.

In summary, go-dandelion is a tool that has helped me quickly set up project directory structures
and initialize components, enabling faster business development while maintaining a clean and
scalable project structure.

## 2.Component

Currently, go-dandelion integrates the following components:

+ [rpcx](https://github.com/smallnest/rpcx)：Provides RPC services.
+ [fasthttp](https://github.com/valyala/fasthttp)：Provides an external gateway interface.
+ [fasthttp-routing](https://github.com/qiangxue/fasthttp-routing)：Constructs routing functionality.
+ [gorm](https://github.com/go-gorm/gorm)：Handles database interactions.
+ [redigo](https://github.com/gomodule/redigo)：Facilitates cache interactions.
+ [go-swagger](https://github.com/go-swagger/go-swagger)：Generates API documentation.
+ [cobra](https://github.com/spf13/cobra)：Offers a command-line tool.
+ [viper](https://github.com/spf13/viper)：Reads configuration files.
+ [opentracing-go](https://github.com/opentracing/opentracing-go)：Enables distributed tracing.

These components are integrated into go-dandelion to provide a comprehensive set of features
and functionalities for developing microservice projects.


## 3.Advantage

+ Rapidly create RPC and HTTP services: We offer a convenient way to swiftly build RPC and HTTP
 services. With just a few simple steps, you can effortlessly construct high-performance services.

+ Configuration-driven initialization: With flexible configuration options, you can quickly initialize
 commonly used components such as MySQL, Redis, logging systems, and traceability links. Our system
 automatically handles the initialization based on your configuration, allowing you to focus more
 on business logic development.

+ Integrated rich features: Our service framework incorporates multiple core functionalities, including
 logging, traceability, rate limiting, circuit breaking, service registration, and service discovery.
 These features can be directly utilized within the framework, eliminating the need for writing
 additional code and greatly simplifying the development process.

+ Customizable middleware and plugins: We provide a middleware and plugin mechanism that allows you
 to customize and extend the functionality of the framework. You can write your own middleware
 to handle requests, responses, or other business logic, as well as develop plugins to enhance the
 capabilities of the framework. This enables you to flexibly tailor the behavior of the framework
 according to specific requirements.

## 4.Future


In the future, we plan to continue iterating on this project and introduce the following functionalities:

+ Refactor and enhance support for rpcx: We will address the current limitations and improve the
extensibility and readability of rpcx integration. (TODO)

+ Optimize the HTTP engine and enable multiple engine applications: We are currently working on 
optimizing the HTTP engine and enabling the use of multiple engines for enhanced flexibility and
performance. (DOING [http-dandelion](https://github.com/gly-hub/http-dandelion))

+ Improve code generation automation: We aim to further automate code generation to reduce
unnecessary manual coding efforts. (TODO)

+ Expand the plugin library: We plan to expand the plugin library by introducing plugins for
functionalities such as JWT authentication, timers, and more. (TODO)

+ Enhance deployment and operations processes: We will focus on adding comprehensive deployment
and operations processes to streamline the deployment and management of the project. (TODO)

By implementing these planned features, we aim to improve the project's functionality, performance,
and ease of use for developers during the continuous development and iteration phases.
If you are interested, you are welcome to join us.

