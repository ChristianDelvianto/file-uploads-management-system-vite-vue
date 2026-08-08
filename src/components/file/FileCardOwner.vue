<script setup lang="ts">
import UserAvatar from '@/components/user/Avatar.vue'
import { useAuth } from '@/composables/useAuth'
import { User } from '@/types/user'
const { profile } = useAuth()

defineProps<Readonly<{
    owner: User | null
}>>()
</script>

<template>
    <div
        class="flex-grow flex-row flex-shrink gap-1.5 items-center hidden
        lg:flex lg:w-1/3"
    >
        <UserAvatar
            :icon-size="16"
            :photo="owner?.photo || null"
            class="size-8"
        />

        {{
            owner?.id === profile?.id
                ? 'me'
                : owner?.name
        }}
    </div>
</template>
