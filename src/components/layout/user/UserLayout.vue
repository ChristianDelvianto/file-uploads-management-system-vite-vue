<script setup lang="ts">
import UserNavigation from './UserNavigation.vue'
import UserSidebar from './UserSidebar.vue'
import UserUploads from './UserUploads.vue'
import { useWindow } from '@/composables/useWindow'
import { MIN_WIDTH_MD } from '@/const/window.ts'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
const store = useStore()
const route = useRoute()
const { windowWidth } = useWindow()

const showSidebar = ref(false)

const uploads = computed<string[]>(() => {
    return Object.keys(store.getters['upload/items'])
})

watch(() => route.name, (): void => {
    showSidebar.value = false
})
</script>

<template>
    <div
        class="min-h-screen relative z-[1]
        md:bg-[rgb(234,250,234)]"
    >
        <UserNavigation @toggleSidebar="showSidebar = true" />

        <UserSidebar
            v-show="showSidebar || windowWidth >= MIN_WIDTH_MD"
            @toggleSidebar="showSidebar = false"
        />

        <main
            class="relative w-full
            md:pl-72
            lg:pl-80"
        >
            <!-- Background -->
            <div
                class="fixed hidden min-h-[calc(100vh-4rem)] inset-0 rounded-tl-3xl top-16 z-[-1]
                md:bg-white md:block md:ml-72
                lg:ml-80"
            ></div>

            <RouterView
                :class="{
                    'pb-[4.75rem] sm:pb-[4rem] md:pb-[3.25rem]': uploads.length !== 0
                }"
                class="flex flex-col flex-grow min-h-[calc(100vh-4rem)] w-full"
            />
        </main>

        <UserUploads />
    </div>
</template>
