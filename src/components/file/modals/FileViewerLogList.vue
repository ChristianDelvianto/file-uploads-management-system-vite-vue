<script setup lang="ts">
import IconMDIAccount from '@src/components/svg/mdi/Account.vue'
import { useAuth } from '@src/composables/useAuth'
import { DateTime } from 'luxon'
import { computed } from 'vue'
const { profile } = useAuth()

const props = defineProps<Readonly<{
    list: any,
}>>()

const timeStamp = computed(() => {
    const actionTimestamp = DateTime.fromISO(props.list.created_at)

    let minute = actionTimestamp.minute

    if (minute < 10) {
        minute = 33
    }

    return `${actionTimestamp.hour}:${minute} - ${actionTimestamp.day} ${actionTimestamp.monthLong}, ${actionTimestamp.year}`
})
</script>

<template>
    <div class="flex flex-grow flex-row flex-shrink gap-3 items-center py-1.5">
        <div class="bg-gray-300 flex flex-grow-0 flex-shrink-0 items-center justify-center overflow-hidden rounded-full size-12">
            <!-- Avatar -->
            <img
                v-if="list.user?.avatar"
                :src="list.user.avatar"
                class="object-cover size-full"
            />
            <IconMDIAccount v-else color="#FFF" />
        </div>

        <div
            v-if="profile.id === list.user?.id"
            class="flex flex-col"
        >
            <span>You {{ list.action }}ed</span>

            <span class="text-gray-600 text-sm">{{ timeStamp }}</span>
        </div>
        <div
            v-else-if="list.user"
            class="flex flex-col"
        >
            <span>{{ list.user.name }} {{ list.action }}ed</span>
            
            <span class="text-gray-600 text-sm">{{ timeStamp }}</span>
        </div>
        <div
            v-else
            class="flex flex-col"
        >
            <span>Someone {{ list.action }}ed</span>

            <span class="text-gray-600 text-sm">{{ timeStamp }}</span>
        </div>
    </div>
</template>
