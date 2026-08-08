import UserLayout from '@/components/layout/user/UserLayout.vue'
import UserHomePage from '@/pages/UserHome.vue'
import UserSharedPage from '@/pages/UserShared.vue'
import UserSettingsPage from '@/pages/UserSettings.vue'
import UserTrashPage from '@/pages/UserTrash.vue'
import type { RouteRecordRaw } from 'vue-router'

const home: RouteRecordRaw = {
    meta: {},
    path: 'home',
    name: 'user.home',
    component: UserHomePage
}

const shared: RouteRecordRaw = {
    meta: {},
    path: 'shared',
    name: 'user.shared',
    component: UserSharedPage
}

const trash: RouteRecordRaw = {
    meta: {},
    path: 'trash',
    name: 'user.trash',
    component: UserTrashPage
}

const settings: RouteRecordRaw = {
    meta: {},
    path: 'settings',
    name: 'user.settings',
    component: UserSettingsPage
}

export default [
    {
        meta: {
            guestOnly: false,
            userOnly: true,
            role: 'user'
        },
        path: '/user',
        name: 'user.dashboard',
        component: UserLayout,
        redirect: {
            name: 'user.home'
        },
        children: [
            home,
            shared,
            trash,

            // account
            settings
        ]
    }
]
