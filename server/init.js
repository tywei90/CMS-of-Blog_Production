module.exports = {
    articles: [{
        title: '欢迎使用博客系统',
        date: new Date(),
        content: "*** 此博客系统前端是用vue全家桶搭建的，负责路由跳转，是个单页面应用。后台用的nodejs的express框架，用mongoose驱动mongodb数据库来实现数据库管理。***\n  \n此博客系统支持以下功能：\n\n1. 一个基本的博客内容管理器功能，如后台登陆，发布并管理文章等\n2. 支持[markdown语法编辑](http://www.appinn.com/markdown/basic.html)\n3. 支持代码高亮\n4. 可以管理博客页面的链接\n5. 博客页面对移动端适配优化\n6. 页面足够大气、酷炫黑\n\n快去使用吧~"
    }],
    links: [{
        name: '首页',
        href: '/#!/', 
        newPage: false
    },{
        name: '设置',
        href: '#!/console', // 待修正，加上username
        newPage: false
    },{
        name: '博客',
        href: 'https://www.wty90.com/',
        newPage: true
    } ]
}
