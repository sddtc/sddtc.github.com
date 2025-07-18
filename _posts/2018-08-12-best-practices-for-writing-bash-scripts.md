---
title: "[Bash] Best Practices For Writing Bash scripts"
layout: post
categories: 命令行
guid: urn:uuid:7bb4c030-c072-4ed1-a832-2640408911fa
tags:
  - bash
---

#### 将命令参数写全 (`logger --priority vs logger -p`)
当你使用 `cli` 客户端时, 直接使用简写可以提高效率; 然而当你编写复用性较高的脚本, 补全命令参数可以帮助提高脚本可读性, 便于他人阅读.

#### 使用 `set -o errexit` (set -e)
使你的脚本在遇到错误时终止

#### 如果你不想终止错误, 可以使用 `|| true`

#### 使用 `set -o nounset` (set -u)
当你使用了没有声明的参数, 脚本会终止

#### 使用 `set -o xtrace` (set -x)
可以在 debug 时追踪执行了哪些命令

#### 使用 `set -o pipefail`
捕获 `mysqldump` 错误, 例如 `mysqldump |gzip`; 在脚本最终执行完毕退出会返回一个非0的结果

#### `#!/usr/bin/env bash` 比 `#!/bin/bash` 更加的跨平台

#### 避免使用 `#!/usr/bin/env bash -e`
当执行脚本 `bash ./script.sh` 时, 错误会被忽略, 正确做法是在脚本内部 `set -e`

#### 将变量用双引号包裹起来, 在 `if [ "$NAME" = "Sddtc" ]` 时
因为如果变量 `NAME` 并未声明, 脚本会抛出语法异常, 参照(`nounset`)

#### 如果你想测试没有被声明的变量, 可以使用 `:-`
例如: `if [ "$NAME:-" = "Sddtc" ]`, 如果没有声明 `NAME`, $NAME 将为空; 你还可以写作 `if [ "$NAME:-noname" = "Sddtc" ]`

#### 将变量, 路径声明在脚本顶部

综上所述, 有什么理由不这样定义你的脚本呢~?

~~~shell
#!/usr/bin/env bash
# Bash3 Boilerplate. Copyright (c) 2014, kvz.io

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

# Set magic variables for current file & dir
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)" # <-- change this as it depends on your app

arg1="${1:-}"
~~~

译自:
[Best Practices For Writing Bash scripts](https://kvz.io/blog/2013/11/21/bash-best-practices/)
