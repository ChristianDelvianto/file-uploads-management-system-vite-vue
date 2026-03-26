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
    >
        <path
            :fill="$props.color"
            d="m19 8l-4 4h3a6 6 0 0 1-6 6c-1 0-1.97-.25-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20a8 8 0 0 0 8-8h3M6 12a6 6 0 0 1 6-6c1 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4a8 8 0 0 0-8 8H1l4 4l4-4"
        />
    </svg>
</template>
