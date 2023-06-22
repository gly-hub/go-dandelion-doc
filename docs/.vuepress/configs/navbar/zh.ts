import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarZh: NavbarConfig = [
    {
        text: '指南',
        link: '/zh/guide/about.md',
    },
    {
        text: '项目',
        children: [{
            text: 'go-dandelion',
            link: 'https://github.com/gly-hub/go-dandelion'
        },
        {
            text: 'go-admin-example',
            link: 'https://github.com/gly-hub/go-admin-example'
        }],
    },
]
