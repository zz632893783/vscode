<template>
    <div class="root">
        <file-directory></file-directory>
        <router-view></router-view>
        <!-- <div>{{ route.path }}</div> -->
        <command-area></command-area>
    </div>
</template>
<script setup>
// import fileDirectory from './layout/fileDirectory.vue'
import fileDirectory from './views/layout/fileDirectory.vue'
import commandArea from './views/layout/commandArea.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

</script>
<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(0, 200px);
    .file-directory {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 3;
    }
}
</style>