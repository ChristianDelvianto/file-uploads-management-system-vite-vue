<script setup lang="ts">
import IconMDIError from '@src/components/svg/mdi/Error.vue'

defineProps<Readonly<{
    msg: string,
}>>()
</script>

<template>
    <div
        role="alert"
        class="bg-red-100 border border-red-600 flex flex-row gap-3 items-center p-3 rounded-lg text-red-600"
    >
        <IconMDIError :size="16" />

        {{ $props.msg }}
    </div>
</template>
