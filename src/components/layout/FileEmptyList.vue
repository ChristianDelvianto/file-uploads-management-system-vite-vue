<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'

defineEmits<{
    (eventName: 'refresh'): void,
}>()

defineProps<Readonly<{
    icon?: string,
}>>()
</script>

<template>
    <div class="flex flex-col gap-3 items-center justify-center">
        <div class="font-semibold">
            You have not uploaded anything yet.
        </div>

        <Button
            @click="$emit('refresh')"
        >Refresh</Button>
    </div>
</template>
