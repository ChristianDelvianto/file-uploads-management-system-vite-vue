<script setup lang="ts">
withDefaults(defineProps<Readonly<{
    color?: string,
    size?: number,
}>>(), {
    color: '#E7000B', // text-red-600
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
            d="M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
        />
    </svg>
</template>
