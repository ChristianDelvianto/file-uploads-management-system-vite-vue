<script setup lang="ts">
import { computed, watch } from 'vue'

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

const ceiledValue = computed<number>(function () {
    return Math.ceil(props.value)
})
const circumference = computed<number>(function () {
    return (props.radius - props.stroke * 2) * 2 * Math.PI
})
const normalisedRadius = computed<number>(function () {
    return props.radius - props.stroke * 2
})
const strokeDashOffset = computed<number>(function () {
    return (circumference.value - ceiledValue.value / 100 * circumference.value)
});

watch(ceiledValue, function (newValue): void {
    console.log('ceiledValue newValue :', newValue)
})
</script>

<template>
    <svg
        :height="$props.size"
        :width="$props.size"
    >
        <circle
            :cx="$props.cxy"
            :cy="$props.cxy"
            :fill="$props.backgroundColor"
            :r="normalisedRadius"
            :stroke="$props.color"
            :stroke-dasharray="circumference + ' ' + circumference"
            :stroke-dashoffset="strokeDashOffset"
            :stroke-width="$props.strokeWidth"
            :style="{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
            }"
            class="duration-300 ease-in-out transition-all"
        ></circle>
    </svg>
</template>
