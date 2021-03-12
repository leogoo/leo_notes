### 冲突处理方法
1. 先全都ci，然后git pull把所有代码都拉下来修改冲突（属于自己的，其他撤回就好了，反正不提交）
1. (优先）提交前Git stash -> git pull -> git stash pop
保持本地和远端同步(pull前记得git stash),多出的文件就都是自己本地修改的

### 常用命令：
- git reflog show --date=iso 很关键，很好用
- git stash -u :缓存所有内容包括新建的
- git stash list
- git stash pop stash@{id}
- git clean -fd:删除untraked files和目录
- git checkout . 删除所有未加入缓存区的文件
- git diff <分支名>:比较当前分支与指定分支代码的差别
- git log filename: 查看单个文件的提交记录
- git show commitID filename: 查看某次提交对文件的修改
- git config core.ignorecase false 区分大小写，项目内运行

### git命令简写
- gco: git checkout
- gbr: git branch
- gst: git status
- gd: git diff
- gl: git pull
- grb: git rebase
- ga: git add
- gc: git commit
- gcmsg: git commit -m
- gp: git push
- glog: git log --oneline --decorate --graph
- glgg: git log --graph
- gm: git merge
- gsta: git stash
- gstp: git stash pop


### 创建远程分支
其实就是把本地分支，然后push到远端
```
git checkout -b newBranch
git push origin newBranch:newBranch
```

### git cherry-pick
用于将其他分支上的commit复制到当前分支来
1. 首先复制要导入的commitID
1. 在当前分支执行`git cherry-pick commitId`即可
1. 导入多个commit时。`git cherry-pick commitId0..commitId100`，需要注意的是不包含commitId0这个提交，将导入(commitId0, commitId100]中的所有commit

### git rebase
git rebase有两个用法
1. 合并远程分支，用于替代git merge
    1. 使用git mrege时，如果本地有新的commit，会多出一个Merge的commit
    1. 使用rebase时，会将本地分支新的commit缓存，然后将指针移动到远程最新的commit，然后在后面添加本地新增的commit
1. 用于合并commit
    1. 使用方法`git rebase -i commitId`
    1. 将上述commitId后面的commit合并，会进入编辑状态处理commit之间怎么合并，且编辑message


### Git reset
1. 使用--soft就仅仅将头指针恢复，已经add的缓存以及工作空间的所有东西都不变。
2. 使用--mixed，就将头恢复掉，已经add的缓存也会丢失掉，工作空间的代码什么的是不变的。
3. 如果使用--hard，那么一切就全都恢复了，头变，aad的缓存消失，代码什么的也恢复到以前状态。

### git revert
- git revert commitId是将指定的commit反转，与reset不同的是会生成一个新的commit，而内容则是反转对应的commit内容。reset需要git push -f强制回退才会改变远程分支
- 一般冲突时，保留parent版本的内容，执行git revert --continue
- 如果不想解决冲突的话可以取消撤回：git revert --abort