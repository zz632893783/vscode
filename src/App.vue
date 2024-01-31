<template>
    <el-container class="root">
        <el-aside width="200px">
            <h4 class="project-title">Vite 5.1.0</h4>
            <el-scrollbar class="menu">
                <span :class="['menu-item', route.path === n.path && 'active']" v-for="(n, i) in menuList" :key="i" @click="jump(n)">{{ n.meta.menuName }}</span>
            </el-scrollbar>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script setup>
import { computed } from 'vue'
import { routes } from '@/router/index.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuList = computed(() => routes.filter(n => n?.meta?.isMenu))

const jump = obj => router.push({ path: obj.path })
</script>
<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    .el-aside {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 56px) minmax(0, 1fr);
        background-color: rgba(238, 242, 254, 1);
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
}
</style>