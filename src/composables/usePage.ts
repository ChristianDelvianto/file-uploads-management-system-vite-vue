import { ErrorCode } from '@src/types/page'
import { ref, Ref } from 'vue'

export const usePage = () => {
    const errorCode: Ref<ErrorCode> = ref(0)
    const isError = ref(false)
    const isLoading = ref(false)

    function pageIsError(code: ErrorCode): void {
        isError.value = true
        errorCode.value = code
    }
    function pageLoading(): void {
        isLoading.value = true
        isError.value = false
        errorCode.value = 0
    }

    return {
        errorCode,
        isError,
        isLoading,

        pageIsError,
        pageLoading,
    }
}
