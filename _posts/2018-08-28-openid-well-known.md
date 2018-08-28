---
title: "[OpenID] 关于 .well-known 规范的那些事 (1)"
layout: post
categories: sddtc
guid: urn:uuid:40e4ac4b-9912-4f84-89b2-224bad265fe7
tags:
  - well-known
  - openid
---

### Abstract

> OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. It enables Clients to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner.

OpenID Connect 1.0 是 OAuth 2.0 协议最上层的简单身份验证层. 它使客户端能够根据授权服务器执行的身份验证来验证最终用户的身份, 以及以可操作性和类似 Restful 的方式获取有关最终用户的基本配置文件信息.  

### Intro

为了使 OpenID Connect 依赖方能够为最终用户使用 OpenID Connect 服务, 依赖方需要知道 OpenID Provider 的位置. OpenID Connect 使用 `WebFinger` 为最终用户定位 OpenID 提供程序.  
一旦 `OpenID Provider` 被确定, 该 `OpenID Provider` 的配置信息作为 JSON 文档从 `well-known` 的位置检索, 还包括有 OAuth2.0 的接口地址.  

### OpenID Provider Issuer Discovery
> OpenID Provider Issuer Discovery 是一个确定 OpenID Provider 位置的过程  

关于 `GET /.well-known/webfinger?xxxxxx` 的一些标准  

### OpenID Provider Metadata

**issuer**: 必选项  
* HTTPS
* URL 不包含参数片段
* **If Issuer discovery is supported**, his value MUST be identical to the issuer value returned by WebFinger.
* 该值必须与 OpenID Provider 颁发的 Tokens 的 iss 值一致  

**authorization\_endpoint**: 必选项  
* 值是 OpenID Provider 的 OAuth 2.0 Authorization Endpoint   

**token\_endpoint**:  
* 值是 OpenID Provider 的 OAuth 2.0 Token Endpoint
* 当 OpenID Provider **仅仅**实现了 `Implicit Flow` 时是非必须, 其余情况都是必选项  

**userinfo\_endpoint**: 推荐
* 值是 OpenID Provider 的 UserInfo Endpoint
* HTTPS
* **可以**包含端口号, 参数等  

**jwks\_uri**: 必选项
* OpenID Provider 的 JSON Web Key Set document
* 用于验证 OpenID Provider 签名的签名密钥
* **可以**包含服务器的加密密钥, 用来加密对服务器的请求. 当签名和加密密钥都可用时, **必须**要添加一个use(Key Use)参数来说明预期用途

**registration\_endpoint**: 推荐
* 值是 OpenID Provider 的 Dynamic Client Registration Endpoint
* 据说谷歌[google's well-known config](https://accounts.google.com/.well-known/openid-configuration)是不暴露这个端口因为不想让客户端通过此方式注册~

**scopes\_supported**: 推荐
* 服务器支持的 scope values
* **必须**包含 `openid`, 服务端也可以选择不公开某些 scope values 哪怕已经支持

**response\_types\_supported**: 必选项
* OpenID Provider 支持的 response\_type 列表
* Dynamic OpenID Provider **必须** 支持 `code, id_token` 和 `token, id_token`

**response\_modes\_supported**: 可选项
* OpenID Provider 支持的 response\_mode 列表
* 缺省值 对于 Dynamic OpenID Providers 来说是 `["query", "fragment"]`

**grant\_types\_supported** : 可选项
* OpenID Provider 的 OAuth 2.0 Grant Type values. 
* Dynamic OpenID Providers **必须** 支持 `authorization_code` and `implicit Grant`
* 缺省值: `["authorization_code", "implicit"]`

**acr\_values\_supported**: 可选项
* OpenID Provider 的 the Authentication Context Class References

**subject\_types\_supported**: 必选项
* OpenID Provider 的 the Subject Identifier types
* 有效类型包括: `pairwise and public`  

**id\_token\_signing\_alg\_values\_supported**: 必选项
* OpenID Provider 的 the JWS signing algorithms (alg values) for the ID Token to encode the Claims in a JWT. 
* **必须**包含算法 `RS256`
* 值可以为 `none`, 但是必须是建立在 `Authorization Endpoint` 返回值不返回任何 Token 的前提下, 例如 `code flow`

**id\_token\_encryption\_alg\_values\_supported**: 可选项
* OpenID Provider 的 JWE encryption algorithms (alg values) for the ID Token to encode the Claims in a JWT

**id\_token\_encryption\_enc\_values\_supported**: 可选项
* OpenID Provider 的 JWE encryption algorithms (enc values) for the ID Token to encode the Claims in a JWT

**userinfo\_signing\_alg\_values\_supported**: 可选项
* UserInfo Endpoint 的 JWS signing algorithms (alg values) to encode the Claims in a JWT
* 值可以为 `none`

**userinfo\_encryption\_alg\_values\_supported**: 可选项
* UserInfo Endpoint 的 JWE encryption algorithms (alg values) to encode the Claims in a JWT

**userinfo\_encryption\_enc\_values\_supported**: 可选项
* UserInfo Endpoint 的 JWE encryption algorithms (enc values) to encode the Claims in a JWT

**request\_object\_signing\_alg\_values\_supported**: 可选项
* OpenID Provider 的 JWS signing algorithms (alg values) for Request Objects
* 服务端支持 `none and RS256`

**request\_object\_encryption\_alg\_values\_supported**: 可选项
* OpenID Provider 的 JWE encryption algorithms (alg values) for Request Objects
* These algorithms are used both when the Request Object is passed by value and when it is passed by reference

**request\_object\_encryption\_enc\_values\_supported**: 可选项
* OpenID Provider 的 JWE encryption algorithms (enc values) for Request Objects
* These algorithms are used both when the Request Object is passed by value and when it is passed by reference

**token\_endpoint\_auth\_methods\_supported**: 可选项
* Token Endpoint 支持的 Client Authentication methods
* 方法有 `client_secret_post`, `client_secret_basic`, `client_secret_jwt` 和 `private_key_jwt`
* 其它 authentication methods **可能** 在扩展中定义
* 缺省值是 `clien_secret_basic` -- the HTTP Basic Authentication Scheme specified

**token\_endpoint\_auth\_signing\_alg\_values\_supported**: 可选项
* Token Endpoint 的 JWS signing algorithms (alg values) for the signature on the JWT used to authenticate the Client at the Token Endpoint for the `private_key_jwt` and `client_secret_jwt` authentication methods. 
* 服务端应该要支持 `RS256`. **不可**为 `none`

**display\_values\_supported**: 可选项
* OpenID Provider 的 display parameter values

**claim\_types\_supported**: 可选项
* OpenID Provider 的 Claim Types
* 该协议定义了 `normal`, `aggregated` 和 `distributed`
* 缺省为 `normal`

**claims\_supported**: 推荐
* OpenID Provider 可提供的 Claim Names of the Claims
* 由于隐私或者其他原因, 这项的值可能不全

**service\_documentation**: 可选项
* 使用 OpenID Provider 的开发文档链接
* 特别是当 OpenID Provider 不支持 Dynamic Client Registration, 那么需要提供一份文档来说明如何注册客户端

**claims\_locales\_supported**: 可选项
* Languages and scripts supported for values in Claims being returned

**ui\_locales\_supported**: 可选项
* Languages and scripts supported for the user interface

**claims\_parameter\_supported**: 可选项
* Boolean value specifying whether the OP supports use of the claims parameter, with true indicating support. 
* 缺省值为 `false`

**request\_parameter\_supported**: 可选项
* Boolean value specifying whether the OP supports use of the request parameter, with true indicating support
* 缺省值为 `false`

**request\_uri\_parameter\_supported**: 可选项
* Boolean value specifying whether the OP supports use of the request\_uri parameter, with true indicating support
* 缺省值为 `true`

**require\_request\_uri\_registration**: 可选项
* Boolean value specifying whether the OP requires any request\_uri values used to be pre-registered using the request\_uris registration parameter. Pre-registration is REQUIRED when the value is true. 
* 缺省值为 `false`

**op\_policy\_uri**: 可选项
* URL that the OpenID Provider provides to the person registering the Client to read about the OP's requirements on how the Relying Party can use the data provided by the OP. 
* The registration process SHOULD display this URL to the person registering the Client if it is given.

**op\_tos\_uri**: 可选项
* URL that the OpenID Provider provides to the person registering the Client to read about OpenID Provider's terms of service. 
* The registration process SHOULD display this URL to the person registering the Client if it is given.


 
