# 博客内容管理系统

> 技术分析，详见我的[博客](https://www.wty90.com/2018/02/16/cms-blog/)

## 一、工程目录分析
* public是最后打包生成文件的目录
* server是服务端和数据库的代码
* src是整个前端工程目录。components是组件代码，样式css单独抽离出来放在style文件夹下。js放置的一些工具库。vuex文件夹存放了action、getters和store。项目分为两个入口文件。main.js是主页、文章和设置等一些页面。common.js是首页、登录和注册页。fonts文件夹存放字体文件的，采用[阿里字体库](iconfont.cn)。
* html采用pug语法

## 二、项目运行
配置mongoDB，[window系统](http://www.runoob.com/mongodb/mongodb-window-install.html) | [mac系统](http://www.runoob.com/mongodb/mongodb-osx-install.html)  

启动mongodb
```bash
~/Applications/mongodb/bin/mongod
```
克隆远程库
```
git clone https://github.com/tywei90/CMS-of-Blog_Production.git
```
进入项目目录
```bash
cd CMS-of-Blog_Production
```
安装依赖
```bash
npm install
```
如果需要启动node热刷新功能，需要全局安装nodemon
```bash
npm install -g nodemon
```
运行以下命令
```bash
npm run server your_email your_code //启动服务器，实时监测后台代码并更新(需要手动刷新页面)

npm run dev //动态监测jsx和.scss文件, 并更新内存里(8080端口)的打包文件，自动刷新页面

npm run build //编译文件到build目录下，打包到磁盘里，对应3000端口
```
打开浏览器输入http://localhost:3000

### 注意
1、线上项目的server端采用pm2管理，在开发环境推荐[nodemon](https://github.com/remy/nodemon/)，需要全局安装。不推荐supervisor，代码错误会一直报错，而且不能选择监控目录。本地调试后台，需要修改package.json里的scripts.server属性为`nodemon --watch server server/cms your_email your_code`。  

2、我们的html模板采用[pug](https://pugjs.org/api/getting-started.html)。如果是本地调试pc页面，改成`http://127.0.0.1:8080/public/main.js`，css文件一样。如果是调试手机页面或者其他电脑上，改成`http://your_ip_address:4000/public/main.js`。当然，需要先打包修改的代码。  

3、注册后会初始化一篇文章和三个链接  

4、如果需要改动，则在第一次启动前打开server目录下的init.js，初始化数据放在该文件中。  

5、推荐[RoboMongo](https://robomongo.org)作为mongoDB可视化管理工具



