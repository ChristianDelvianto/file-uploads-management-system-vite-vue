<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<Readonly<{
    backgroundColor?: string,
    color?: string,
    cxy?: number,
    radius?: number,
    size?: number,
    stroke?: number,
    strokeWidth?: number,
    value: number,
}>>(), {
    backgroundColor: '#FFFFFF',
    color: '#155DFC', // text-blue-600
    cxy: 24,
    radius: 24,
    size: 24,
    stroke: 4,
    strokeWidth: 4,
    value: 0,
})

const ceiledValue = computed<number>(() => {
    return Math.ceil(props.value)
})
const circumference = computed<number>(() => {
    return (props.radius - props.stroke * 2)
        * 2
        * Math.PI
})
const normalisedRadius = computed<number>(() => {
    return props.radius - props.stroke
        * 2
})
const strokeDashOffset = computed<number>(() => {
    return circumference.value - ceiledValue.value
        / 100
        * circumference.value
})
</script>

<template>
    <svg
        :height="$props.size"
        :width="$props.size"
        xmlns="http://www.w3.org/2000/svg"
        class="flex items-center justify-center relative"
    >
        <!--
            Background (#D1D5DC = text-gray-300)
        -->
        <circle
            :cx="$props.cxy"
            :cy="$props.cxy"
            fill="#FFF"
            :r="normalisedRadius"
            stroke="#D1D5DC"
            :stroke-dasharray="circumference + ' ' + circumference"
            :stroke-dashoffset="100"
            :stroke-width="$props.strokeWidth"
            :style="{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
            }"
            class="absolute duration-300 ease-in-out transition-all z-[0]"
        ></circle>

        <!-- The progressive circle -->
        <circle
            :cx="$props.cxy"
            :cy="$props.cxy"
            fill="#FFF"
            :r="normalisedRadius"
            :stroke="$props.color"
            :stroke-dasharray="circumference + ' ' + circumference"
            :stroke-dashoffset="strokeDashOffset"
            :stroke-width="$props.strokeWidth"
            :style="{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
            }"
            class="duration-300 ease-in-out relative transition-all z-1"
        ></circle>
    </svg>
</template>
