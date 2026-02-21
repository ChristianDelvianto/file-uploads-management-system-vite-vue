<script setup lang="ts">
import PageError from '@src/components/page/PageError.vue'
import PageLoading from '@src/components/page/PageLoading.vue'
import { usePage } from '@src/composables/usePage'
import { useStore } from 'vuex'
const store = useStore()
const { errorCode, isError, isLoading, pageIsError, pageLoading } = usePage()

</script>

<template>
    
</template>
