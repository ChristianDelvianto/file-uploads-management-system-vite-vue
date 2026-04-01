<script setup lang="ts">
import IconMDIAsterisk from '@src/components/svg/mdi/Asterisk.vue'
import IconMDIBin from '@src/components/svg/mdi/Bin.vue'
import IconMDICog from '@src/components/svg/mdi/Cog.vue'
import IconMDIDocument from '@src/components/svg/mdi/Document.vue'
import IconMDIHistory from '@src/components/svg/mdi/History.vue'
import IconMDIHomeVariant from '@src/components/svg/mdi/HomeVariant.vue'
import IconMDIImage from '@src/components/svg/mdi/Image.vue'
import IconMDIMusic from '@src/components/svg/mdi/Music.vue'
import IconMDIVideo from '@src/components/svg/mdi/Video.vue'
import { useRoute } from 'vue-router'
import { markRaw } from 'vue'
const route = useRoute()

const mainLinks = [
    {
        icon: markRaw(IconMDIHomeVariant),
        text: 'Home',
        to: '/user/home',
    },
    {
        icon: markRaw(IconMDIImage),
        text: 'Image',
        to: '/user/images',
    },
    {
        icon: markRaw(IconMDIVideo),
        text: 'Video',
        to: '/user/videos',
    },
    {
        icon: markRaw(IconMDIMusic),
        text: 'Audio',
        to: '/user/audios',
    },
    {
        icon: markRaw(IconMDIDocument),
        text: 'Document',
        to: '/user/documents',
    },
    {
        icon: markRaw(IconMDIAsterisk),
        text: 'Other',
        to: '/user/others',
    },
    {
        icon: markRaw(IconMDIBin),
        text: 'Deleted',
        to: '/user/deleted',
    },
]

const accountLinks = [
    {
        icon: markRaw(IconMDIHistory),
        text: 'Logs',
        to: '/user/logs',
    },
    {
        icon: markRaw(IconMDICog),
        text: 'Settings',
        to: '/user/settings',
    },
]
</script>

<template>
    <div
        class="flex flex-col flex-grow flex-shrink gap-1.5
        md:flex-grow md:pt-3"
    >
        <div>
            <span class="block font-semibold pl-6 text-gray-600">My drive</span>

            <div
                class="flex flex-col flex-grow-0 flex-shrink-0 relative
                md:pr-3"
            >
                <RouterLink
                    v-for="link in mainLinks"
                    :key="link.text"
                    :to="link.to"
                    :class="{
                        'bg-blue-100 text-blue-600': route.path === link.to,
                        'text-gray-600 focus:bg-stone-300 hover:bg-stone-300': route.path !== link.to,
                    }"
                    class="duration-300 ease-in-out flex flex-grow-0 flex-row font-semibold gap-3 items-center left-3 -ml-3 pl-6 py-3 relative rounded-r-full text-xl transition-colors w-full"
                >
                    <component
                        :color="route.path === link.to ? '#155DFC' : undefined"
                        :is="link.icon"
                    />

                    {{ link.text }}
                </RouterLink>
            </div>
        </div>

        <div>
            <span class="block font-semibold pl-6 text-gray-600">Account</span>

            <div
                class="flex flex-col flex-grow-0 flex-shrink-0 pr-3 relative"
            >
                <RouterLink
                    v-for="link in accountLinks"
                    :key="link.text"
                    :to="link.to"
                    :class="{
                        'bg-blue-100 text-blue-600': route.path === link.to,
                        'text-gray-600 focus:bg-stone-300 hover:bg-stone-300': route.path !== link.to,
                    }"
                    class="duration-300 ease-in-out flex flex-grow-0 flex-row font-semibold gap-3 items-center left-3 -ml-3 pl-6 py-3 relative rounded-r-full text-xl transition-colors w-full"
                >
                    <component
                        :color="route.path === link.to ? '#155DFC' : undefined"
                        :is="link.icon"
                    />

                    {{ link.text }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>
