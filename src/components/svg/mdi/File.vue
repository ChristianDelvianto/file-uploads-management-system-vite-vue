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
            d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        />
    </svg>
</template>
