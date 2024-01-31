import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'highlight.js/styles/vs2015.css';
import './style.css'
import App from './App.vue'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { router } from '@/router/index.js'

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

createApp(App).use(router).use(ElementPlus).use(hljsVuePlugin).mount('#app')
