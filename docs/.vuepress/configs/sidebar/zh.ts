import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
    '/guide/': [
        {
            text: '指南',
            children: [
                '/guide/about.md',
                '/guide/started.md',
                '/guide/baseconfig.md',
                '/guide/dir.md',
            ],
        },
        {
            text: '进阶',
            children: [
                '/guide/plugins.md',
            ],
        },
        {
            text: '其他',
            children: [
                '/guide/joinus.md',
                '/guide/callme.md',
            ],
        },
    ],
}
