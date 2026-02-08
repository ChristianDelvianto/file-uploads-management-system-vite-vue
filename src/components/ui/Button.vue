<script setup lang="ts">
defineEmits<{
    (eventName: 'click'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    disabled?: boolean,
    level?: 'danger' | 'neutral' | 'primary',
    type?: 'button' | 'submit',
}>>(), {
    disabled: false,
    level: 'neutral',
    type: 'button',
})

const backgroundColor = {
    'danger': 'bg-red-600',
    'neutral': '',
    'primary': 'bg-blue-600',
}[props.level]
const borderColor = {
    'danger': 'border-red-600',
    'neutral': 'border-stone-300',
    'primary': 'border-blue-600',
}[props.level]
const focusEffect = {
    'danger': `
        focus:bg-red-900
        focus:outline-red-300
    `,
    'neutral': `
        focus:border-blue-600
        focus:text-blue-600
        focus:outline-blue-300
    `,
    'primary': `
        focus:bg-blue-900
        focus:outline-blue-300
    `,
}[props.level]
const hoverEffect = {
    'danger': `
        hover:bg-red-900
    `,
    'neutral': `
        hover:bg-blue-100
        hover:border-blue-600
        hover:text-blue-600
    `,
    'primary': `
         hover:bg-blue-900
    `,
}[props.level]
const textColor = {
    'danger': 'text-white',
    'neutral': '',
    'primary': 'text-white',
}[props.level]
</script>

<template>
    <button
        @click="$emit('click')"
        :type="$props.type"
        :disabled="$props.disabled"
        :class="[
            backgroundColor,
            borderColor,
            focusEffect,
            hoverEffect,
            textColor,
            $props.disabled ? 'opacity-60' : '',
        ]"
        class="border duration-300 ease-in-out px-3 py-1.5 rounded-lg transition-all
        focus:outline-4"
    >
        <slot />
    </button>
</template>