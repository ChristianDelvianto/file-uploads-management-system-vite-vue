import { ref } from 'vue'

export const usePage = () => {
    const isPageError = ref(false)
    const isPageLoading = ref(false)
    const pageErrorCode = ref(0)

    function pageIsError(code: number = 0): void {
        isPageError.value = true
        pageErrorCode.value = code
    }
    function pageLoading(value: boolean = true): void {
        isPageLoading.value = value

        if (value) {
            isPageError.value = false
            pageErrorCode.value = 0
        }
    }

    return {
        isPageError,
        isPageLoading,
        pageErrorCode,

        pageIsError,
        pageLoading
    }
}
