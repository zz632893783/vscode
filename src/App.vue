<template>
    <el-container class="root">
        <el-aside width="300px">
            <h4 class="project-title">文件目录</h4>
            <el-scrollbar class="menu">
                <!-- <span :class="['menu-item', route.path === n.path && 'active']" v-for="(n, i) in menuList" :key="i" @click="jump(n)">{{ n.meta.menuName }}</span> -->
                <div class="import"><el-button type="primary" @click="importFile">导入</el-button></div>
                <el-tree v-if="fileDirectory.length" :data="fileDirectory" :props="{ label: 'name' }" @node-click="clickNode" default-expand-all></el-tree>
            </el-scrollbar>
        </el-aside>
        <el-container class="root">
            <el-main>
                <!-- <router-view></router-view> -->
                <codemirror v-model="code" :autofocus="true" :tabSize="4" :extensions="extensions"/>
            </el-main>
            <el-footer>
                <!-- <codemirror v-model="cmd" :autofocus="true" :tabSize="0" :extensions="extensions" @input="cmdInput" @keydown.enter="cmdEnter"/> -->
                <div class="history-cmd">
                    <div class="history-cmd-item" v-for="(n, i) in cmdHistory" :key="i" v-html="n"></div>
                </div>
                <textarea class="input-cmd" v-model="cmd" @keydown.enter="cmdEnter"></textarea>
            </el-footer>
        </el-container>
    </el-container>
</template>
<script setup>
const { ipcRenderer } = require('electron');
import { computed, onMounted, ref } from 'vue'
import { routes } from '@/router/index.js'
import { Codemirror } from 'vue-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
// import { sql } from '@codemirror/lang-sql';
// import { defineEmits, ref, defineProps, computed, watch } from 'vue';
// import { NSwitch, NSpace } from 'naive-ui';
// import * as sqlFormatter from 'sql-formatter';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
const currentFile = ref(null);
const codeTheme = EditorView.theme({
    // 输入的字体颜色
    '&': {
        color: '#0052D9',
        backgroundColor: '#FFFFFF'
    },
    '.cm-content': {
        caretColor: '#0052D9',
    },
    // 激活背景色
    '.cm-activeLine': {
        backgroundColor: '#FAFAFA'
    },
    // 激活序列的背景色
    '.cm-activeLineGutter': {
        backgroundColor: '#FAFAFA'
    },
    //光标的颜色
    '&.cm-focused .cm-cursor': {
        borderLeftColor: '#0052D9'
    },
    // 选中的状态
    '&.cm-focused .cm-selectionBackground, ::selection': {
        backgroundColor: '#0052D9',
        color:'#FFFFFF'
    },
    // 左侧侧边栏的颜色
    '.cm-gutters': {
        backgroundColor: '#FFFFFF',
        color: '#ddd', //侧边栏文字颜色
        border: 'none'
    }
}, { dark: true });
const extensions = [xml(), codeTheme];
// 文件目录
const fileDirectory = ref([]);
// 文件代码内容
const code = ref('');
// cmd 控制台
const cmd = ref('');
const cmdHistory = ref([]);
// 导入文件
const importFile = () => ipcRenderer.send('open-folder');
// 服务端读取文件目录后，由 folder-content 接受
ipcRenderer.on('folder-content', (event, directory) => {
    fileDirectory.value.push(directory);
});
// 单击选择左侧某个文件
const clickNode = (file, node) => {
    if (file.type === 'file') {
        ipcRenderer.send('read-file-content', file.fullPath);
        currentFile.value = node;
    }
};
// 服务端读取文件内容后，由 read-file-content 接受
ipcRenderer.on('read-file-content', (event, fileContent) => (code.value = fileContent));

const cmdInput = v => {
    // console.log('cmdInput', v)
};
const cmdEnter = v => {
    ipcRenderer.send('execute-command', cmd.value, currentFile.value.data.fullPath);
    cmdHistory.value.push(cmd.value);
    cmd.value = '';
};

// const loadFolder = (node, resolve) => {
//     if (node.level === 0) {
//         return resolve([])
//     }
// };

ipcRenderer.on('execute-command-reply', (...args) => {
    console.log(args);
});

ipcRenderer.on('execute-command-stdout', (event, stdoutList) => {
    stdoutList.forEach(stdout => {
        stdout = stdout.replace(/\x1B\[\d{1,2}[a-z]{1}/g, '');
        cmdHistory.value.push(...stdout.split('\n').filter(n => !!n));
    });
});


onMounted(() => {
    // ipcRenderer.send('execute-command', 'npm run dev');
    // const editor = CodeMirror.fromTextArea(editorRef.value, {
    //     lineNumbers: true,
    //     mode: 'javascript', // 或者 'vue' 如果你想要编辑 Vue 代码
    //     theme: 'monokai'
    // });
});

</script>
<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    .el-aside {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 56px) minmax(0, 1fr);
        // background-color: rgba(238, 242, 254, 1);
        border-right: 1px solid red;
        .import {
            text-align: center;
        }
        .project-title {
            align-self: center;
            justify-self: center;
            font-size: 20px;
            font-weight: 600;
        }
        .menu {
            :deep(.el-scrollbar__view) {
                padding: 0 12px;
                .menu-item {
                    line-height: 40px;
                    padding: 0 12px;
                    display: block;
                    font-size: 14px;
                    cursor: pointer;
                    &.active {
                        background-color: rgba(66, 99, 254, 0.1);
                    }
                }
            }
        }
    }
    .el-footer {
        height: 140px;
        border-top: 1px solid red;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(40px, 1fr);
        padding: 0;
        .history-cmd {
            overflow-x: hidden;
            overflow-y: auto;
            .history-cmd-item {
                line-height: 24px;
            }
        }
        textarea {
            padding: 12px;
        }
    }
}
</style>