<script setup lang="ts">
withDefaults(defineProps<Readonly<{
    color?: string,
    size?: number,
}>>(), {
    color: '#4A5565', // text-gray-600
    size: 24,
})
</script>

<template>
    <svg
        :height="$props.size"
        :width="$props.size"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        class="animate-spin"
    >
        <path
            :fill="$props.color"
            d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
        />
    </svg>
</template>
