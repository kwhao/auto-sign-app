# NBU Auto Sign App

**注意：本仓库未提供`<project root>/server/`目录下的server文件，请前往release下载`source.code.with.server-bin.zip`文件，该文件内的源码包含了`server`目录已经对应的处理打卡事件的server文件**

**server文件仅适配了宁波大学，server源码暂未建立仓库，如有需要请联系作者。**

**server开发语言为Golang**

### 快速体验

仅需执行以下两行命令

```shell
npm install
npm start
```

### 开发请按如下步骤

## Install Dependency

```shell
npm install
```

## Start Vue Service

```shell
npm run dev
```

The Web GUI service will listen on http://127.0.0.1:5173

修改 `./main.cjs`中部分代码（15-23行）如下
```js
// ./main.cjs
...
// 应用GUI页面 的提供方式
// 1. Dev: 由 npm run dev 提供
win.loadURL("http://127.0.0.1:5173")

// 2. 打包编译请用下面的，文件注意根据不同系统进行替换
// serverProcess = execFile(path.resolve(__dirname, '../server/auto-sign-server'))
...
```

## Start Electron in Dev

```shell
npm start
```

### 以下为打包编译步骤

## How To Build Application

### Build Vue Source

```shell
npm run build
```

编译生成文件在 `./dist` 目录下
请修改编译后的 `./dist/index.html`，将文件中的资源引用路径修改为`./assets/...`

e.g.

```html
...
<title>宁波大学异地健康打卡APP</title>
<script type="module" crossorigin src="/assets/index.xxxxxx.js"></script>
<link rel="stylesheet" href="/assets/index.xxxxxx.css">
...
```

将上述代码中的`src`、`href`属性修改，如下

```html
...
<title>宁波大学异地健康打卡APP</title>
<script type="module" crossorigin src="./assets/index.xxxxxx.js"></script>
<link rel="stylesheet" href="./assets/index.xxxxxx.css">
...
```

然后将 `./dist/index.html` 和 `./dist/assets/`下所有文件复制到 `./public`路径

此时，可以回到 `./main.cjs` 文件，将应用GUI页面修改为由静态资源提供

```js
// 应用GUI页面 的提供方式
...
// win.loadURL("http://127.0.0.1:5173")
...
win.loadFile('./public/index.html')
```

### Choose Proper `auto-sign-server` Binary File

> Only supply binary file for Apple Mac(`./server/auto-sign-server`), Intel Mac(`./server/auto-sign-server-intel`),
> Windows amd64(`./server/auto-sign-server-win.exe`).
> You should choose proper one in `./package.json` at line 10, or in `./main.cjs` at line 41 - line 50.

**目前仅编译了适配大部分本科生的bin文件，其他有需要的可以联系定制**

e.g.
> Apple M1 macOS could be as below

```js
// ./main.cjs
...
// 打包编译请用下面的，文件注意根据不同系统进行替换
serverProcess = execFile(path.resolve(__dirname, '../server/auto-sign-server'))
```

```json
// ./package.json
...
"extraResources": [
  "./server/auto-sign-server"
],
...
```

### Build Electron Application

```shell
npm run app:dist
```

The Application Package will be generated in `./dist/`
