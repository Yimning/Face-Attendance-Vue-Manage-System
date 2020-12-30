<!--
 * @Author: Yimning
 * @Date: 2020-12-26 18:32:44
 * @LastEditTime: 2020-12-29 15:01:10
 * @LastEditors: Please set LastEditors 
 * @Description: In User Settings Edit
 * @FilePath: \vue-manage-system\README.md
-->

## Project setup
```
cnpm install
```

### Compiles and hot-reloads for development
``` 
cnpm run serve
```

### Compiles and minifies for production
```
cnpm run build
```


```
由于node_modules文件夹所含的依赖包太大，一般不予提供。
在终端输入命令：
	安装依赖：cnpm i 和 cnpm install安装依赖即可以。
	项目运行：cnpm run serve 
	项目打包：cnpm run build
```
- [ ] ``` 
  ├── README.md            项目介绍
  ├── index.html           入口页面
  ├── public              构建项目的公共部分
  ├── screenshots                效果截图
  ├── src                源码目录 
  │  ├── main.js          入口js文件
  │  ├── permission.js      路由权限设置
  │  ├── axios.js         路由全局配置与拦截
  │  ├── App.vue          根组件
  │  ├── api                   项目接口
  │  ├── components        公共组件目录
  │  ├── assets           资源目录，这里的资源会被wabpack构建
  │  ├── routes           前端路由
  │  │  └── index.js
  │  ├── store           应用级数据（state）状态管理
  │  │  └── index.js
  │  └── views           页面目录
  │    ├── AccountSettings        账户信息维护
  │    ├── ClassTable             课程信息管理
  │    ├── FaceManager            人脸库管理
  │    └── SignIn                 考勤信息管理
  │    ├── UsersManager           账户信息管理
  │    └── WebSocket              WebSocket连接 
  │    ├── 403.vue                无权限页面
  │    └── 404.vue                页面不存在
  │    └── Dashboard.vue          主页面
  │    └── Login.vue              登录页面
  │    └── Photograph.vue         即时拍照页面
  │    └── Tabs.vue               消息中心
  ├── vue.config.js         项目配置、开发环境变量、生产环境变量
  ├── package.json    npm包配置文件，定义了项目的npm脚本，依赖包等
  ```

