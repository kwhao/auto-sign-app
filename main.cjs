const {app, BrowserWindow} = require('electron')
const path = require('path')
require('./controller/getLoginForm.cjs')
const {execFile} = require("child_process");

let serverProcess = null

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000, height: 700, webPreferences: {
            preload: path.resolve(__dirname, './preload/index.js')
        }
    })

    // 应用GUI页面 的提供方式
    // 1. Dev: 由 npm run dev 提供
    // win.loadURL("http://127.0.0.1:5173")

    // 2. 打包请阅读 README 后，将vue编译后的 ./dist 文件转至 ./public 目录，再使用下述
    win.loadFile('./public/index.html')

    // 下一行代码用于打开chrome开发者工具
    // win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
    // 在macOS需要用户手动退出，其他系统关闭所有窗口即退出程序
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('quit', () => {
    // 部分情况无法杀死进程，可以手动杀
    serverProcess.kill()
})

app.whenReady().then(() => {
    createWindow()
    const {execFile} = require('child_process')
    // 启动 server core，处理签到操作的核心程序，根据不同系统选择不同语句
    // Apple macOS
    serverProcess = execFile('./server/auto-sign-server')
    // Intel macOS
    // serverProcess = execFile('./server/auto-sign-server-intel')
    // Windows amd64
    // serverProcess = execFile('./server/auto-sign-server-win.exe')

    // 打包编译请用下面的，文件注意根据不同系统进行替换
    // serverProcess = execFile(path.resolve(__dirname, '../server/auto-sign-server'))
})
