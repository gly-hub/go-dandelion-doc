import type { NavbarConfig } from '@vuepress/theme-default'

export const navbarEn: NavbarConfig = [
    {
        text: 'Guide',
        link: '/guide/about.md',
    },
    {
        text: 'project',
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
