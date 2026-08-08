<script setup lang="ts">
import IconMDILockOutline from '@/components/svg/mdi/LockOutline.vue'
import IconMDIPublic from '@/components/svg/mdi/Public.vue'
import IconMDIUserMultiple from '@/components/svg/mdi/UserMultiple.vue'
import UserAvatar from '@/components/user/Avatar.vue'
import { FileDB, Shared } from '@/types/file'
import { inject, ref, type ToRef } from 'vue'

defineProps<Readonly<{
    shared: Shared[]
}>>()

const file = inject<Readonly<ToRef<FileDB | null>>>('file', ref(null))
</script>

<template>
    <div
        v-if="file?.visibility === 'private'"
        class="flex flex-grow-0 flex-row flex-shrink gap-1.5 items-center text-gray-600
        lg:flex-grow lg:text-black"
    >
        <IconMDILockOutline color="#000" :size="18" />

        Private
    </div>
    <div
        v-else-if="file?.visibility === 'public'"
        class="flex flex-grow-0 flex-row flex-shrink gap-1.5 items-center text-gray-600
        lg:flex-grow lg:text-black"
    >
        <IconMDIPublic color="#000" :size="18" />

        Public
    </div>
    <div
        v-else-if="file?.visibility === 'shared'"
        class="flex flex-grow-0 flex-row flex-shrink gap-1.5 items-center relative text-gray-600
        lg:flex-grow lg:text-black"
    >
        <IconMDIUserMultiple color="#000" :size="18" />

        <!-- Scenario for empty shared array, the users might got deleted by the admin or deleted their own account -->
        <template v-if="$props.shared.length === 0">
            Shared
        </template>
        <div
            v-else
            class="flex flex-grow-0 flex-row flex-shrink-0 items-center
            lg:flex-grow"
        >
            <template v-if="$props.shared.length <= 3">
                <UserAvatar
                    v-for="(user, index) in $props.shared.slice(0, 3)"
                    :key="user.id"
                    :style="{
                        marginLeft: `-${index * 4}px`,
                        zIndex: 3 - (index + 1)
                    }"
                    :icon-size="12"
                    :photo="user.photo"
                    class="border border-white size-6"
                />
            </template>
            <span v-else>{{ $props.shared.length }} people</span>
        </div>
    </div>
</template>
