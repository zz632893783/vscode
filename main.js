// main.js
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, fs } = require('electron');
const nodefs = require('fs');
const path = require('path');
const readDirectoryTree = async dirPath => {
    // 存储树形结构数据的数组
    const tree = [];

    try {
        // 读取目录内容
        const entries = await nodefs.promises.readdir(dirPath);
        
        for (const entry of entries) {
            const entryPath = path.join(dirPath, entry);
            // 获取文件或文件夹的状态
            const stats = await nodefs.promises.stat(entryPath);

            if (stats.isDirectory()) {
                // 如果是文件夹，递归调用函数
                const subTree = await readDirectoryTree(entryPath);
                tree.push({
                    name: entry,
                    type: 'directory',
                    children: subTree,
                    fullPath: entryPath
                });
            } else {
                // 如果是文件，添加到树形结构
                tree.push({
                    name: entry,
                    type: 'file',
                    fullPath: entryPath
                });
            }
        }
    } catch (error) {
        console.error(`Error reading directory tree: ${error}`);
    }

    return tree;
};
// 遍历文件目录递归函数
// try {
//   require('electron-reloader')(module, {});
// } catch (_) {}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            asar: false,
        	nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            // 确保开发者工具在窗口创建时打开
            devTools: true
        }
    })
    // 加载 index.html
    // mainWindow.loadFile('./dist/index.html');
    mainWindow.loadURL('http://127.0.0.1:5173/');
    // 打开开发工具
    // mainWindow.webContents.openDevTools()

    // 设置 IPC 监听器
    ipcMain.on('execute-command', (event, command) => {
        const { exec } = require('child_process');
        console.log(typeof exec, command)
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时出错: ${error}`);
                return;
            }
            console.log(`命令输出: ${stdout}`);
            if (stderr) {
                console.error(`命令错误输出: ${stderr}`);
            }
            // 将结果发送回渲染进程
            event.reply('execute-command-reply', { stdout, stderr });
        });
        // setTimeout(() => console.log(e), 2000)
    });
    ipcMain.on('open-folder', async (event) => {
        const { filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (filePaths.length > 0) {
            const folderPath = filePaths[0];
            try {
                const fileDirectory = await readDirectoryTree(filePaths[0]);
                console.log(fileDirectory);
                event.reply('folder-content', fileDirectory);
            } catch (error) {
                console.error('读取文件夹内容失败:', error);
                event.reply('folder-content', []);
            }
        }
    });

    ipcMain.on('read-file-content', async (event, filePath) => {
        nodefs.readFile(filePath, 'utf-8', (err, content) => {
            !err && event.reply('read-file-content', content);
        });
    });
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。