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
        },
        {
            text: '开始',
            children: [
                {
                    text: '登录模块',
                    collapsible: true,
                    children: [
                        '/zh/example/login/demand.md',
                        '/zh/example/login/login.md',
                        '/zh/example/login/captcha.md',
                        '/zh/example/login/perfect.md',
                    ]
                },
                {
                    text: '权限校验',
                    collapsible: true,
                    children: [
                        '/zh/example/auth.md',
                    ]
                },
            ],
        }
    ]
}
