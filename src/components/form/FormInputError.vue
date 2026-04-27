<script setup lang="ts">
import IconMDIError from '@src/components/svg/mdi/Error.vue'

defineProps<Readonly<{
    msg: string,
    testId?: string
}>>()
</script>

<template>
    <div
        :data-testid="testId"
        role="alert"
        class="flex flex-row gap-1.5 items-center text-red-600"
    >
        <IconMDIError :size="16" />
        
        {{ msg }}
    </div>
</template>
