import type { RouteRecordRaw } from 'vue-router'
import UserLayout from '@src/components/layout/UserLayout.vue'
import UserRecentPage from '@src/pages/UserRecent.vue'
import UserImagesPage from '@src/pages/UserImages.vue'
import UserAudiosPage from '@src/pages/UserAudios.vue'
import UserVideosPage from '@src/pages/UserVideos.vue'
import UserDocumentsPage from '@src/pages/UserDocuments.vue'
import UserOthersPage from '@src/pages/UserOthers.vue'
import UserDeletedPage from '@src/pages/UserDeleted.vue'

const recent: RouteRecordRaw = {
    meta: {},
    path: 'recent',
    name: 'user.recent',
    component: UserRecentPage,
}

const image: RouteRecordRaw = {
    meta: {},
    path: 'images',
    name: 'user.images',
    component: UserImagesPage,
}

const audio: RouteRecordRaw = {
    meta: {},
    path: 'audios',
    name: 'user.audios',
    component: UserAudiosPage,
}

const video: RouteRecordRaw = {
    meta: {},
    path: 'videos',
    name: 'user.videos',
    component: UserVideosPage,
}

const document: RouteRecordRaw = {
    meta: {},
    path: 'documents',
    name: 'user.documents',
    component: UserDocumentsPage,
}

const other: RouteRecordRaw = {
    meta: {},
    path: 'others',
    name: 'user.others',
    component: UserOthersPage,
}

const deleted: RouteRecordRaw = {
    meta: {},
    path: 'deleted',
    name: 'user.deleted',
    component: UserDeletedPage,
}

const root: RouteRecordRaw = {
    meta: {
        guestOnly: false,
        userOnly: true,
        role: 'user',
    },
    path: '/user',
    name: 'user.dashboard',
    component: UserLayout,
    redirect: {
        name: 'user.recent',
    },
    children: [
        recent,
        image,
        audio,
        video,
        document,
        other,
        deleted,
    ]
}

const userRoutes: RouteRecordRaw[] = [
    root,
]

export default userRoutes
