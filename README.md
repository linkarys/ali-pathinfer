Alibaba CDN地址推断, 根据当前的仓库名和分支名推断出线上的cdn链接。

## 依赖
-----

请使用node4.0以上版本。

## API
-----

### isReady
检查当前环境是否满足pathInfer使用条件(为git仓库), 使用前请先执行检查, 否则将抛出异常。

### getPath
返回gitpath, 仓库: `git@gitlab.alibaba-inc.com:group/reposity.git`或`http://gitlab.alibaba-inc.com/group/reposity.git`将返回`group/reposity`

### getFullPath
返回完整的推断地址，`getFullPath() = domain + '/' + getPath() + '/' + assert`, 如: `//g.alicdn.com/mcn/lottery.js`

### getVersion
推断出当时分支的版本号，`daily/1.0.1`, 将返回`1.0.1`

### setEnv
设置当前环境，影响getFullPath中的域名, 其对应关系为: 
- `dev`: `./`
- `daily/pre`: `//g-assets.daily.taobao.net`
- `prod`: `//g.alicdn.com`

### setDomain
设置getFullPath中的域名

### setDefaultVersion
无法获取当前分支时将返回默认版本号, 初始值为1.0.0, 可以通过此方法更改。


## 事件
-----

捕获错误和警告信息，未捕获的错误信息会抛出异常。

```javavscript

const pathInfer = require('pathInfer');

pathInfer.emitter.on('error', (msg) => {
	console.log(msg);
})

pathInfer.emitter.on('warning', (msg) => {
	console.log(msg);
});

```


## 更新历史

- 1.0.7: 添加简易测试代码
