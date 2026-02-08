<script setup lang="ts">
import IconMDIError from '@src/components/svg/mdi/Error.vue'

defineProps<Readonly<{
    msg: string,
}>>()
</script>

<template>
    <div
        role="alert"
        class="flex flex-row gap-1.5 items-center text-red-600"
    >
        <IconMDIError :size="16" />
        
        {{ $props.msg }}
    </div>
</template>
