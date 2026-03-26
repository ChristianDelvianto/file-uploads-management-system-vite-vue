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
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"
        />
    </svg>
</template>
