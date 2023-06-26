import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from '@vuepress/cli'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { containerPlugin } from '@vuepress/plugin-container'
import {
    head,
    navbarEn,
    navbarZh,
    sidebarZh,
    sidebarEn
} from './configs/index.js'

export default defineUserConfig({

    // set site base to default value
    base: '/',
    head,

    // site-level locales config
    locales: {
        '/': {
            lang: 'english', // 将会被设置为 <html> 的 lang 属性
            title: 'go-dandelion',
            description: '一个golang脚手架工具'
        },
        '/zh/': {
            lang: 'chinese',
            title: 'go-dandelion',
            description: '一个golang脚手架工具'
        },
    },
    theme: defaultTheme({
        logo: '/images/logo.png',
        repo: 'gly-hub/go-dandelion-doc',
        docsDir: 'docs',

        locales: {
            '/': {
                navbar: navbarEn,
                editLinkText: 'Edit this page on GitHub',
                sidebar: sidebarEn,
            },
            '/zh/': {
                navbar: navbarZh,
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',
                sidebar: sidebarZh,
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdatedText: '上次更新',
                contributorsText: '贡献者',
                // custom containers
                tip: '提示',
                warning: '注意',
                danger: '警告',
                // 404 page
                notFound: [
                    '这里什么都没有',
                    '我们怎么到这来了？',
                    '这是一个 404 页面',
                    '看起来我们进入了错误的链接',
                ],
                backToHome: '返回首页',
                // a11y
                openInNewWindow: '在新窗口打开',
                toggleColorMode: '切换颜色模式',
                toggleSidebar: '切换侧边栏',
            },
        },
    }),
    plugins: [
        docsearchPlugin({
            appId: '7M47ME7WW2',
            apiKey: '1e1d77f2fed85aa64e81c54677348621',
            indexName: 'gly-hubio',
            // searchParameters: {
            //     facetFilters: ['tags:v1'],
            // },
            locales: {
                '/': {
                    placeholder: 'Search Documentation',
                    translations: {
                        button: {
                            buttonText: 'Search Documentation',
                            buttonAriaLabel: 'Search Documentation',
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: 'Clear query',
                                resetButtonAriaLabel: 'Clear query',
                                cancelButtonText: 'Cancel',
                                cancelButtonAriaLabel: 'Cancel',
                            },
                            startScreen: {
                                recentSearchesTitle: 'Recent Searches',
                                noRecentSearchesText: 'No recent searches',
                                saveRecentSearchButtonTitle: 'Save to recent searches',
                                removeRecentSearchButtonTitle: 'Remove from recent searches',
                                favoriteSearchesTitle: 'Favorites',
                                removeFavoriteSearchButtonTitle: 'Remove from favorites',
                            },
                            errorScreen: {
                                titleText: 'Unable to fetch results',
                                helpText: 'You may need to check your network connection',
                            },
                            footer: {
                                selectText: 'Select a language',
                                navigateText: 'Navigate to result',
                                closeText: 'Close search',
                                searchByText: 'Search by text',
                            },
                            noResultsScreen: {
                                noResultsText: 'No results found',
                                suggestedQueryText: 'Did you mean {suggestedQuery}?',
                                reportMissingResultsText: 'the query should yield results？',
                                reportMissingResultsLinkText: 'Report missing results',
                            },
                        },
                    },
                },
                '/zh/': {
                    placeholder: '搜索文档',
                    translations: {
                        button: {
                            buttonText: '搜索文档',
                            buttonAriaLabel: '搜索文档',
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: '清除查询条件',
                                resetButtonAriaLabel: '清除查询条件',
                                cancelButtonText: '取消',
                                cancelButtonAriaLabel: '取消',
                            },
                            startScreen: {
                                recentSearchesTitle: '搜索历史',
                                noRecentSearchesText: '没有搜索历史',
                                saveRecentSearchButtonTitle: '保存至搜索历史',
                                removeRecentSearchButtonTitle: '从搜索历史中移除',
                                favoriteSearchesTitle: '收藏',
                                removeFavoriteSearchButtonTitle: '从收藏中移除',
                            },
                            errorScreen: {
                                titleText: '无法获取结果',
                                helpText: '你可能需要检查你的网络连接',
                            },
                            footer: {
                                selectText: '选择',
                                navigateText: '切换',
                                closeText: '关闭',
                                searchByText: '搜索提供者',
                            },
                            noResultsScreen: {
                                noResultsText: '无法找到相关结果',
                                suggestedQueryText: '你可以尝试查询',
                                reportMissingResultsText: '你认为该查询应该有结果？',
                                reportMissingResultsLinkText: '点击反馈',
                            },
                        },
                    },
                },
            },
        }),
        googleAnalyticsPlugin({id: 'G-6CFNFNRG2X'}),
        containerPlugin({
            type: 'theorem',
            after: info => `</div>`,
            before: info => `<div class="theorem"><p class="title">${info}</p>`,
        }),
        containerPlugin({
            type: 'right',
        }),
    ]
})
