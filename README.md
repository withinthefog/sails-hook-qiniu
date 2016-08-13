# 七牛服务端sails hook

封装了七牛nodejs sdk. 在`global`上暴露`qiniu`对象.

## 配置

```js
// sails/config/qiniu.js
module.export = {
    AK: '',  // 七牛access key
    SK: '',  // 七牛secret key
    UP_TOKEN_EXPIRE: 3600000,  // 上传token过期时间, 默认10分钟
    CALLBACK_URL: '',  // 七牛上传事件推送的url地址
    CALLBACK_BODY: ''  // 七牛上传事件推送的body
}
```

## hooks方法

### getUpToken(bucket)

生成上传token


### verifySignature(url, body, httpAuthorization)

检查七牛服务器回调签名.
