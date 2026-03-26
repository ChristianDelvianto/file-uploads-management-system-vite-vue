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
            d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
        />
    </svg>
</template>
