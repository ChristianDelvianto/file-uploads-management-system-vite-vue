<script setup lang="ts">
import IconMDIAccount from '@/components/svg/mdi/Account.vue'

const props = defineProps<{
    iconSize: number
    photo: string | null
}>()
</script>

<template>
    <!-- Height and Width will be set from parent component -->
    <div class="bg-neutral-300 flex flex-grow-0 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
        <img
            v-if="$props.photo"
            :src="$props.photo"
            class="object-cover size-full"
        />
        <IconMDIAccount
            v-else
            color="#FFF"
            :size="$props.iconSize"
        />
    </div>
</template>
