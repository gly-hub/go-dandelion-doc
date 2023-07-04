import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
    '/zh/guide/': [
        {
            text: '指南',
            children: [
                '/zh/guide/about.md',
                '/zh/guide/started.md',
                '/zh/guide/baseconfig.md',
                '/zh/guide/dir.md',
            ],
        },
        {
            text: '进阶',
            children: [
                '/zh/guide/upgrade/rpc.md',
                '/zh/guide/upgrade/http.md',
                '/zh/guide/upgrade/database.md',
                '/zh/guide/upgrade/other.md',
                '/zh/guide/upgrade/plugins.md',
            ],
        },
        {
            text: '其他',
            children: [
                '/zh/guide/joinus.md',
                '/zh/guide/callme.md',
            ],
        },
    ],
    '/zh/example/': [
        {
            text: '准备',
            children: [
                '/zh/example/about.md',
                '/zh/example/init.md',
            ],
        }
    ]
}
