import { useStore } from 'vuex'
import { computed } from 'vue'

export const useWindow = () => {
    const store = useStore()

    const windowWidth = computed(() => store.getters['window/width'])

    return {
        windowWidth,
    }
}
