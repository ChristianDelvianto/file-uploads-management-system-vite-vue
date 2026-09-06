<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void
}>()

const props = withDefaults(defineProps<Readonly<{
    enableBackgroundBlur?: boolean,
    enableBackgroundClickToClose?: boolean
}>>(), {
    enableBackgroundBlur: true,
    enableBackgroundClickToClose: false
})

function close(): void {
    if (props.enableBackgroundClickToClose) {
        emit('close')
    }
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
        <div
            @click="close"
            :class="{
                'backdrop-blur-xs': $props.enableBackgroundBlur,
                'cursor-default': !$props.enableBackgroundClickToClose
            }"
            tabindex="-1"
            type="button"
            class="absolute bg-black/80 inset-0 scale-100 z-0"
        ></div>

        <slot />
    </div>
</template>
