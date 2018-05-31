# Sorten Link Project

## 一、启动

### 1. 安装依赖包
```
npm install
```

### 2. 启动服务
> 系统运行于 `12345` 端口

```
node index.js
```

### 3. 新建appId
```
# 打开mongo命令行
use shortlink;
db.users.insert({
  _id: '123',
  name: 'Base'
});
```


<br />


# 二. 网页访问
```
User Name: 
Password: 
```

<br />


# 三. OpenAPI

### 1. 获取短链接接口

* 请求方式：*GET*
```
http://..../api/short?appId=xxxxxxxxx&url=encodedUrl
```

* 请求参数：
```
appId    必需，已分配的appId
url      必需，经过urlEncode的url
```

* 正常返回：*JSON*
```
{
    "code": 0,
    "msg": "Success",
    "data": {
        "url": "http://..../rkwCN5DVb"
    }
}
```

* 异常返回：*JSON*
```
{
  "code": 4040101,
  "msg": 'appId not found'
}
```

<br />