# 使用 Node.js 的官方镜像
FROM node:14

# 创建工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用程序代码
COPY . .

# 暴露应用程序运行的端口
EXPOSE 3000

# 启动应用程序
CMD ["node", "myservice.js"]
