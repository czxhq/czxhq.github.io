---
title: "竹林书斋：构建静态博客的进阶实践"
slug: "build-bamboo-grove-blog"
date: "2026-03-26"
updated: "2026-03-26"
category: "基础架构"
tags:
  - "Vue 3"
  - "Vite"
  - "Markdown"
summary: "探索如何使用 Vue + Vite 打造如竹林般清净阅读体验的个人知识库系统，并复用笔记工具的 Markdown 渲染引擎。"
cover: ""
draft: false
featured: true
source: "/posts/2026-03-26-bamboo-grove-practice.md"
format: "md"
---

# 竹林书斋的构建之路

欢迎来到竹林书斋！这是一个追求极简、东方留白与安静阅读体验的知识花园。

## 1. 为什么是竹林

我们习惯了现代化的、充满玻璃拟态与霓虹色彩的界面。但在记录长文、沉淀知识时，我们需要的是**清净**。

> [!NOTE]
> 竹林隐士风格的核心要素是：宣纸色背景、竹青色点缀、细边框与低对比度阴影。

## 2. 技术选型与实现

在本次重构中，我们采用了 `Vue 3` + `Vite` 构建底层应用，抛弃了笨重的框架路由设计，采用轻量的定制化组件。

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### 接入自有 Markdown 渲染器

为了复用桌面端笔记软件的渲染能力，我们将 `markdown-it` 系列生态直接嵌入了博客端：

- 支持了 `markdown-it-task-lists`
- 支持了 LaTeX 数学公式 $\sqrt{a^2 + b^2} = c$ 
- 支持了多种自定义 Block

%%tip {title="自定义语法还原"}
我们在前端原封不动地还原了 %% 书写语法，以确保在浏览器中查阅笔记时，获得 100% 书斋原貌。
%%

## 3. 自动化流程

静态博客最痛的点在于维护路由和列表。我们引入了基于 Node.js 的轻量扫描脚本，它会在这篇文章被 Push 到 GitHub 前，自动抽提及汇总它的 Frontmatter 成为 `posts.json` 索引库。

[toc]
