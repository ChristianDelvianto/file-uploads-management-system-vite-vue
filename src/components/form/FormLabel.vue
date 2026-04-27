<script setup lang="ts">
defineProps<Readonly<{
    testId?: string,
    text: string
}>>()
</script>

<template>
    <label
        :data-testid="testId"
        class="block font-semibold text-gray-600"
    >
        {{ text }}
    </label>
</template>
