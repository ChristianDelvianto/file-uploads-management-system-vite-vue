<script setup lang="ts">
import UserNavigationDropdown from './UserNavigationDropdown.vue'
import IconMDIAccount from '@src/components/svg/mdi/Account.vue'
import IconMDIDotsVertical from '@src/components/svg/mdi/DotsVertical.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const store = useStore()
const route = useRoute()
const router = useRouter()

const showDropdown = ref(false)

defineEmits<{
    (eventName: 'toggleSidebar'): void,
}>()

async function logout(): Promise<void> {
    store.dispatch('auth/logout')
    
    await router.push('/login')
        .then(() => {
            store.dispatch('auth/loggedOut')
        })
}

watch(() => route.name, (): void => {
    showDropdown.value = false
})
</script>

<template>
    <header
        class="bg-white min-h-16 w-full
        md:h-16 md:sticky md:top-0 md:z-10"
    >
        <nav class="min-h-[inherit] relative size-full">
            <div
                class="flex flex-grow-0 flex-row flex-shrink-0 h-full items-center min-h-[inherit] pl-2 pr-3 w-full
                md:px-3"
            >
                <!-- Left -->
                <div
                    class="flex flex-grow flex-row flex-shrink-0 h-full items-center justify-between
                    md:justify-start"
                >
                    <button
                        @click="$emit('toggleSidebar')"
                        type="button"
                        class="flex items-center justify-center rounded-full size-12
                        md:hidden"
                    >
                        <IconMDIDotsVertical />
                    </button>

                    <RouterLink
                        :to="{ name: 'user.recent' }"
                        class="leading-0 text-3xl"
                    >LeDrive</RouterLink>
                </div>

                <!-- Right -->
                <div class="flex flex-grow flex-row flex-shrink-0 items-center justify-end">
                    <button
                        @click="showDropdown = !showDropdown"
                        :class="{
                            'bg-blue-600/60': showDropdown,
                            'bg-stone-100': !showDropdown,
                        }"
                        type="button"
                        class="duration-300 ease-in-out flex items-center justify-center rounded-full size-12 transition-all"
                    >
                        <IconMDIAccount
                            :color="showDropdown ? '#FFF' : undefined"
                        />
                    </button>
                </div>
            </div>

            <UserNavigationDropdown
                v-show="showDropdown"
                @logout="logout"
            />
        </nav>
    </header>
</template>
