<script setup lang="ts">
import IconMDICog from '@src/components/svg/mdi/Cog.vue'
import IconMDISignOut from '@src/components/svg/mdi/SignOut.vue'
import { useAuth } from '@src/composables/useAuth'
const { profile } = useAuth()

defineEmits<{
    (eventName: 'logout'): void,
}>()
</script>

<template>
    <div
        class="bg-white border-t border-stone-300 divide-y divide-stone-300 flex flex-col gap-3 p-3 z-20
        md:absolute md:border-t-0 md:min-w-60 md:right-3 md:rounded-b-lg md:shadow-lg md:shadow-stone-600/30 md:top-full"
    >
        <div
            class="flex-grow flex-row flex-shrink gap-3 hidden items-center pb-3
            md:flex"
        >
            <div class="bg-stone-300 flex items-center justify-center rounded-full size-10"></div>

            <div>
                <span class="font-semibold text-gray-900">{{ profile.name }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <span
                class="duration-300 ease-in-out flex flex-grow flex-row items-center gap-3 p-1.5 rounded-lg text-left transition-colors w-full
                focus:bg-stone-300/60
                hover:bg-stone-300/60"
            >
                <IconMDICog />

                Settings
            </span>
            <button
                @click="$emit('logout')"
                type="button"
                class="duration-300 ease-in-out flex flex-grow flex-row items-center gap-3 p-1.5 rounded-lg text-left transition-colors w-full
                focus:bg-stone-300/60
                hover:bg-stone-300/60"
            >
                <IconMDISignOut />

                Log out
            </button>
        </div>
    </div>
</template>
