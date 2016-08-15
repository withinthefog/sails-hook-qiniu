# 七牛服务端sails hook

封装了七牛nodejs sdk. 在`global`上暴露`qiniu`对象.

## 配置

```js
// sails/config/qiniu.js
module.export = {
    AK: '',  // 七牛access key
    SK: '',  // 七牛secret key
    UP_TOKEN_EXPIRE: 3600000,  // 上传token过期时间, 默认10分钟
}
```

## hooks方法

### getUpToken(options)

生成上传token

### verifySignature(req)

检查七牛服务器回调签名.
