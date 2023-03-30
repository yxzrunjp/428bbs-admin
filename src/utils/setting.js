// 路由配置
export const MenuList = [
    {
        meta: {
            icon: 'icon-article',
            label: '内容管理',
        },
        path: 'forum',
        name: 'Forum',
        children: [
            {
                path: 'article',
                name: 'Article',
                component: '/src/views/Forum/Article/Index.vue',
                meta: {
                    label: '帖子管理',
                    icon: '',
                },
            },
            {
                path: 'comment',
                name: 'Comment',
                component: '/src/views/Forum/Comment/Index.vue',
                meta: {
                    label: '评论管理',
                    icon: '',
                },
            },
            {
                path: 'board',
                name: 'Board',
                component: '/src/views/Forum/Board/Index.vue',
                meta: {
                    label: '板块管理',
                    icon: '',
                },
            },
        ]
    },
    {
        meta: {
            icon: 'icon-user',
            label: '用户管理',
        },
        path: 'user',
        name: 'User',
        children: [
            {
                path: 'list',
                name: 'List',
                component: '/src/views/User/List/Index.vue',
                meta: {
                    label: '用户列表',
                    icon: '',
                },
            },
        ]
    },
    {
        meta: {
            icon: 'icon-settings',
            label: '设置',
        },
        path: 'setting',
        name: 'Setting',
        children: [
            {
                path: 'sys',
                name: 'Sys',
                component: '/src/views/Setting/Sys/Index.vue',
                meta: {
                    label: '系统设置',
                    icon: '',
                },
            },
        ]
    }
]