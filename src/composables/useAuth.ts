import { useStore } from 'vuex'
import { computed } from 'vue'

export const useAuth = () => {
    const store = useStore()

    const authenticated = computed(() => store.getters['auth/authenticated'])
    const profile = computed(() => store.getters['auth/profile'])
    const role = computed(() => store.getters['auth/role'])

    return {
        authenticated,
        profile,
        role,
    }
}
