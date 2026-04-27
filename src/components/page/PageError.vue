<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import IconMDIErrorOutline from '@src/components/svg/mdi/ErrorOutline.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

defineEmits<{
    (eventName: 'retry'): void
}>()

const props = withDefaults(defineProps<Readonly<{
    errorCode: number
}>>(), {
    errorCode: 0
})

const message = {
    0: 'Sorry, something went wrong, please try again', // Default
    400: 'Bad request',
    401: 'It seems that you are not logged in, please log in to access to continue',
    403: 'Sorry, you are not allowed to access this',
    404: 'Opps, sorry but page not found',
    500: 'Internal server error, please try again'
}[props.errorCode]

async function toLoginPage(): Promise<void> {
    store.dispatch('auth/loggedOut')

    await router.push('/login')
        .then(() => {
            store.dispatch('auth/logout')
        })
}
</script>

<template>
    <div class="flex flex-col gap-y-3 items-center justify-center p-6">
        <IconMDIErrorOutline :size="64" />

        <div
            role="alert"
            class="text-center"
        >{{ message }}</div>

        <Button
            v-if="errorCode === 401"
            @click="toLoginPage"
            level="neutral"
            class="border-stone-600/80! rounded-full!"
        >Log in</Button>
        <Button
            v-else-if="errorCode !== 403 && errorCode !== 404"
            @click="$emit('retry')"
            class="border-stone-600/80! rounded-full!"
        >Try again</Button>
    </div>
</template>
