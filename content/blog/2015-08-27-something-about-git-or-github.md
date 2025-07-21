---
title: Git版本管理相关命令合集
date: 2015-08-27
tags: shell
---

### .gitignore 在查看 `git status` 时不能过滤文件和文件夹

在 .gitignore 添加 .idea 文件夹以过滤该文件夹, 但通过 `git status` 查看仍显示 .idea 文件夹的状态.
原因: 在 git 库中已存在了这个文件, 之前 push 提交过该文件.
.gitignore 文件只对还没有加入版本管理的文件起作用, 如果之前已经用 git 把这些文件纳入了版本库, 就不起作用.
解决: 需要在 git 库中删除该文件, 更新 .gitignore 文件.
```vim
git rm --cached .idea/
```
然后再次 `git status` 查看状态, .idea 文件夹不再显示状态.

### 本地修改，但更新强制覆盖本地

```vim
git fetch --all
git reset --hard origin/${branch_name}
```

### 远程新建分支，拉取到本地

1. 查看所有分支, 包括远程: `git branch -va`
2. 切换到分支: `git checkout -b ${branch_name} origin/${branch_name}`
3. 如果切到新分支, push 代码失败,执行:`git push -f origin ${branch_name}`

### 比较分支

```vim
git diff master..test
```
如果不是查看每个文件的详细差别而是统计一下有哪些文件被改动, 有多少行被改动, 可使用`--stat` 参数. 例如:`git diff --stat`

### 合并分支 A 文件到分支 B

```vim
git checkout -p dev user.java //不切换branch，把dev上的user.java更新到当前分支
git checkout dev feed.java //去掉-p参数，新增该feed.java文件
```

### 从 master 分支更新代码到 fork 分支

```
git remote -v
git remote add upstream ${master_repo_address}
git fetch upstream
git checkout master
git merge upstream/master
```

### git pull vs git fetch then git rebase

* Fetch vs Pull
> ### Git fetch just updates your repo data, but a git pull will basically perform a fetch and then merge the branch pulled.

* Rebase vs Merge
> ### In contrast, rebasing unifies the lines of development by re-writing changes from the source branch so that they appear as children of the destination branch – effectively pretending that those commits were written on top of the destination branch all along.

综上所述, 使用 `git fetch` then `git rebase`, 替换 `git fetch` then `git merge` 的操作, 保证在查看 `git log --graph` 时只有一条主线, 一目了然.

### 查看 `git log`
`--oneline`: 查看历史记录的简洁版本.
`--graph`: 查看历史中什么时候出现了分支、合并.
`--no-merges`: 隐藏合并提交.
例如:
```
git log --oneline --graph
```

### Terminal skills

create branch: `git co -b sddtc-new-tmp`
push branch to remote: `git push --set-upstream origin sddtc-new-tmp`
remote branch has deleted, update it on local: `git fetch -p`

### Merge commits

1. You should select a commit record as a end tag: `git log`
2. `git reset --soft ${commit-hash-value}`
3. Then `git st`, you will see the change have cached on local.
4. `git commit -m ${your comment}`
5. run `git push --force`, it will merge your past commit.

If you push a commite, then you change files again, you can use below:

1. `git add .`
2. `git commit --amend`
3. `git push --force`

If you have account A, commit use account B, then you want change author, you can use below:
`git commit --amend --author="Author Name <email@address.com>"`

**Another case**:
For example, if your commit history is A-B-C-D-E-F with F as HEAD, and you want to change the author of C and D, then you would..

1. Specify `git rebase -i B`
2. change the lines for both C and D to `edit`
3. Once the rebase started, it would first pause at C
4. You would `git commit --amend --author="Author Name <email@address.com>"`
5. Then `git rebase --continue`
6. It would pause again at D
7. Then you would `git commit --amend --author="Author Name <email@address.com>" again`
8. `git rebase --continue`
9. The rebase would complete.
