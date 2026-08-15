<script setup lang="ts">
import IconMDIError from '@/components/svg/mdi/Error.vue'

defineProps<Readonly<{
    message: string,
    testId?: string
}>>()
</script>

<template>
    <div
        :data-testid="$props.testId"
        role="alert"
        class="flex flex-row gap-1.5 items-center text-red-600"
    >
        <IconMDIError :size="16" />
        
        {{ message }}
    </div>
</template>
