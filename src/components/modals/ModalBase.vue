<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const emits = defineEmits<{
    (eventName: 'close'): void
}>()

function close(): void {
    emits('close')
}

onMounted(() => {
    document.body.style['overflowY'] = 'hidden'
})
onBeforeUnmount(() => {
    document.body.style['overflowY'] = 'scroll'
})
</script>

<template>
    <div class="fixed inset-0 z-10">
        <button
            @click="close"
            tabindex="-1"
            type="button"
            class="absolute bg-black/80 backdrop-blur-[2px] inset-0 scale-100 z-0"
        ></button>

        <slot />
    </div>
</template>
