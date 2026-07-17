# 投研互动系统原型

这是一个纯静态网页原型，可直接部署到 GitHub Pages。

## 本地预览

在项目目录下执行：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 部署方式

仓库内已包含 GitHub Pages 工作流：

- 推送到默认分支后自动发布
- 发布内容为当前目录下的静态文件

## 主要文件

- `index.html`：页面入口
- `styles.css`：样式
- `script.js`：交互逻辑
- `*.png`：原型配图
