import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
    '/guide/': [
        {
            text: 'guide',
            children: [
                '/guide/about.md',
                '/guide/started.md',
                '/guide/baseconfig.md',
                '/guide/dir.md',
            ],
        },
        {
            text: 'upgrade',
            children: [
                '/guide/plugins.md',
            ],
        },
        {
            text: 'other',
            children: [
                '/guide/joinus.md',
                '/guide/callme.md',
            ],
        },
    ],
}
