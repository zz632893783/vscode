<template>
	<div class="home">
		<el-button type="primary" @click="clickFn">home</el-button>
	</div>
</template>
<script setup>
// const { ipcRenderer } = require('electron');
// import electron from 'electron';
// import sudoPrompt from 'sudo-prompt'
import { ipcRenderer } from 'electron'
const clickFn = () => {
	alert('点击了按钮');
	// ipcRenderer.send('execute-command', 'node -v');
};
</script>