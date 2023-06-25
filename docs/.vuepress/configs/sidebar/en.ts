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
                '/guide/upgrade/rpc.md',
                '/guide/upgrade/http.md',
                '/guide/upgrade/database.md',
                '/guide/upgrade/other.md',
                '/guide/upgrade/plugins.md',
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
