# 使用TypeScript+vue3构建博客网站

### 项目简介

- Vue3+TypeScript开发，使用新版 Vuex 和 Vue-Router 全家桶完成。
- 从0到1，不借用UI矿建，手动开发通用组件，如Modal，Loader，Upload，Form，DropDown
- 自定义指令v-click-outside封装
- 实现内容包含登录注册，专栏列表，专栏详情，文章列表，文章详情，编辑删除文章，更改User信息等

### 安装依赖
```
npm install
```

### 运行本地开发环境
```
npm run serve
```

### 打包构建
```
npm run build
```

#### 相关文档
详见博客 

[vue3实现上传组件](https://juejin.cn/post/6967951613356933133)

[Teleport实现Modal组件](https://juejin.cn/post/6967971374417575944)

[vue3+ts实现自定义指令v-click-outside](https://juejin.cn/post/6968063117859241992)

### 目录结构

|-- vuew
    |-- .browserslistrc
    |-- .editorconfig
    |-- .eslintrc.js
    |-- .gitignore
    |-- README.md
    |-- package-lock.json
    |-- package.json
    |-- tsconfig.json
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
        |-- App.vue
        |-- declaration.d.ts
        |-- main.ts
        |-- router.ts
        |-- shims-vue.d.ts
        |-- store.ts
        |-- assets
        |   |-- column.jpg
        |   |-- defaultImg.png
        |   |-- logo.png
        |   |-- work.svg
        |   |-- 坐车.svg
        |   |-- 海豚表演.svg
        |-- components
        |   |-- ColumnList.vue
        |   |-- Dropdown.vue
        |   |-- DropdownItem.vue
        |   |-- GlobalHeader.vue
        |   |-- Loader.vue
        |   |-- Message.vue
        |   |-- Modal.vue
        |   |-- PostList.vue
        |   |-- Upload.vue
        |   |-- UserProfile.vue
        |   |-- ValidateForm.vue
        |   |-- ValidateInput.vue
        |   |-- createMessage.ts
        |-- directives
        |   |-- clickoutside.ts
        |-- hooks
        |   |-- globalProperties.ts
        |   |-- help.ts
        |   |-- useClickOutside.ts
        |   |-- useDOMCreate.ts
        |   |-- useLoadMore.ts
        |-- styles
        |   |-- global.css
        |-- views
            |-- ColumnDetail.vue
            |-- CreatePost.vue
            |-- EditUser.vue
            |-- Home.vue
            |-- Login.vue
            |-- PostDetail.vue
            |-- Signup.vue
