<script setup lang="ts">
import ImageEmptyStorage from '@/assets/images/empty-storage.png'
import Button from '@/components/ui/Button.vue'
import type { Component } from 'vue'

defineEmits<{
    (eventName: 'refresh'): void
}>()

defineProps<Readonly<{
    icon?: Component,
    image?: string,
}>>()
</script>

<template>
    <div class="flex flex-col flex-grow gap-3 items-center justify-center pb-6">
        <img
            :src="$props.image || ImageEmptyStorage"
            draggable="false"
            class="flex-grow-0 max-w-md select-none w-full"
        />

        <div class="font-semibold">
            Nothing to see here...
        </div>

        <Button
            @click="$emit('refresh')"
            class="border-stone-300/60! rounded-full!
            md:border-stone-600/60!"
        >Try again</Button>
    </div>
</template>
