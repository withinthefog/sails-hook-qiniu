'use strict';
const crypto = require('crypto'),
    _ = require('lodash');

class Qiniu {
    constructor(config) {
        const {AK, SK} = config;
        this._qiniu = require('qiniu');
        this._qiniu.conf.ACCESS_KEY = AK;
        this._qiniu.conf.SECRET_KEY = SK;
        this._config = config;
    }

    getUpToken(options) {
        sails.log.verbose('up token options:', options);
        const defaultOptions = {
            expires: this._config.UP_TOKEN_EXPIRES,
            callbackBodyType: 'application/json',
            saveKey: '$(etag)'
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        sails.log.verbose('final options:', finalOptions);
        var putPolicy = new this._qiniu.rs.PutPolicy2(finalOptions);
        return putPolicy.token();
    }

    verifySignature(req) {
        const {url, body, httpAuthorization} = req;
        var signed = httpAuthorization.split(':')
            , encodedBody
            , bodyAry = []
            , data2Sign;
        signed[0] = signed[0].substr(5, signed[0].length - 1);
        sails.log.silly('qiniu signed data:\n', signed);
        _.forOwn(body, function (val, key) {
            bodyAry.push(`${key}=${val}`)
        });
        encodedBody = bodyAry.join('&');
        data2Sign = `${url}\n${encodedBody}`;
        sails.log.silly('data before sign:\n', data2Sign);

        const {SK} = this._config;
        var hash = crypto.createHmac('sha1', SK).update(data2Sign).digest('base64');
        hash = hash.replace(/\+/g, '-').replace(/\//g, '_'); // url safe
        sails.log.silly('data signed:\n', hash);
        return hash === signed[1];
    }
}

module.exports = function QiniuHooks(sails) {
    return {
        defaults: {
            __configKey__: {
                AK: process.env.QINIU_AK,
                SK: process.env.QINIU_SK,
                BUCKET: process.env.BUCKET,
                BUCKET_DOMAIN: process.env.BUCKET_DOMAIN,
                UP_TOKEN_EXPIRES: 1000 * 60 * 10
            },
        },

        initialize: function (cb) {
            sails.log.debug('qiniu config key:',this.configKey);
            sails.log.debug('qiniu config value:',sails.config[this.configKey]);
            global['qiniu'] = new Qiniu(sails.config[this.configKey]);
            cb();
        },
    }
};
