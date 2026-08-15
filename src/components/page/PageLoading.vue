<script setup lang="ts">
import IconMDILoading from '@/components/svg/mdi/Loading.vue'

withDefaults(defineProps<Readonly<{
    iconColor?: string,
}>>(), {
    iconColor: '#000'
})
</script>

<template>
    <slot
        v-if="$slots.default"
        data-testid="page-loading-slot"
    />
    <div
        v-else
        data-testid="page-loading-default"
        class="flex items-center justify-center p-6"
    >
        <IconMDILoading :color="$props.iconColor" :size="64" />
    </div>
</template>
