import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
    '/en/guide/': [
        {
            text: 'guide',
            children: [
                '/en/guide/about.md',
                '/en/guide/started.md',
                '/en/guide/baseconfig.md',
                '/en/guide/dir.md',
            ],
        },
        {
            text: 'upgrade',
            children: [
                '/en/guide/plugins.md',
            ],
        },
        {
            text: 'other',
            children: [
                '/en/guide/joinus.md',
                '/en/guide/callme.md',
            ],
        },
    ],
}
