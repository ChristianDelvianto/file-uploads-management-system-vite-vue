import { ref } from 'vue'

export const useLoadMore = () => {
    const isLoadMoreCompleted = ref(false)
    const isLoadMoreError = ref(false)
    const isLoadMoreLoading = ref(false)
    const loadMoreErrorCode = ref(0)
    const nextCursor = ref<string | null>(null)

    function $resetLoadMore(): void {
        isLoadMoreCompleted.value = false
        isLoadMoreError.value = false
        isLoadMoreLoading.value = false
        loadMoreErrorCode.value = 0
        nextCursor.value = null
    }
    function loadMoreCompleted(): void {
        isLoadMoreCompleted.value = true
        isLoadMoreError.value = false
        loadMoreErrorCode.value = 0
        nextCursor.value = null
    }
    function loadMoreError(code: number): void {
        loadMoreErrorCode.value = code
        isLoadMoreError.value = true
    }
    function loadMoreLoading(value: boolean): void {
        isLoadMoreLoading.value = value

        if (value) {
            isLoadMoreError.value = false
            loadMoreErrorCode.value = 0
        }
    }

    return {
        isLoadMoreCompleted,
        isLoadMoreError,
        isLoadMoreLoading,
        loadMoreErrorCode,
        nextCursor,

        $resetLoadMore,
        loadMoreCompleted,
        loadMoreError,
        loadMoreLoading
    }
}
