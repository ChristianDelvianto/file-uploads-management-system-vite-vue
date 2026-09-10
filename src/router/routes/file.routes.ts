import FileViewPage from '@/pages/FileView.vue'
import type { RouteRecordRaw } from 'vue-router'

// View by UUID (Get file by UUID)
const viewByUuid: RouteRecordRaw = {
    meta: {
        guestOnly: false,
        userOnly: false,
        role: null,
    },
    path: '/f/:uuid/view',
    name: 'file.index',
    component: FileViewPage
}

// View by public link (Get file by public link)
// const viewByPublic: RouteRecordRaw = {
//     meta: {
//         guestOnly: false,
//         userOnly: false,
//         role: null,
//     },
//     path: '/p/:id',
//     name: 'file.public',
//     component: FileViewPage
// }

// // View by share link (Get file by share link)
// const viewByShared: RouteRecordRaw = {
//     meta: {
//         guestOnly: false,
//         userOnly: false,
//         role: null,
//     },
//     path: '/sh/:id',
//     name: 'file.shared',
//     component: FileViewPage
// }

export default [
    viewByUuid,
    // viewByPublic,
    // viewByShared
]
