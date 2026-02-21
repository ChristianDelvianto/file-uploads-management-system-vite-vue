<script setup lang="ts">
import UserNavigation from './UserNavigation.vue'
import UserSidebar from './UserSidebar.vue'
import UserUploads from './UserUploads.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useWindow } from '@src/composables/useWindow'
const route = useRoute()
const { windowWidth } = useWindow()

const showSidebar = ref(false)

watch(() => route.name, (): void => {
    showSidebar.value = false
})
</script>

<template>
    <div class="min-h-screen w-full">
        <UserNavigation @toggleSidebar="showSidebar = true" />

        <UserSidebar
            v-show="showSidebar || windowWidth >= 768"
            @toggleSidebar="showSidebar = false"
        />

        <main
            class="border-t border-stone-300 relative w-full
            md:border-0 md:pl-72
            lg:pl-80"
        >
            <!-- Background -->
            <div
                class="bg-stone-300/30 border-l border-stone-300 border-t fixed hidden min-h-[calc(100vh-4rem)] inset-0 rounded-tl-3xl top-16 z-[-1]
                md:block md:ml-72
                lg:ml-80"
            ></div>
            
            <RouterView
                class="w-full
                md:max-w-6xl md:mx-auto"
            />
        </main>

        <!-- Uploads -->
        <UserUploads />
    </div>
</template>
