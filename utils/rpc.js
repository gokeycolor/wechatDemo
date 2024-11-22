'use strict';
const crypto = require('crypto-js')

// base64
function stringify(wordArray) {
    // Shortcuts
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    // Clamp excess bits
    wordArray.clamp();

    // Convert
    var base64Chars = [];
    for (var i = 0; i < sigBytes; i += 3) {
        var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
        var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

        var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

        for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
            base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
        }
    }
    // Add padding
    var paddingChar = map.charAt(64);
    if (paddingChar) {
        while (base64Chars.length % 4) {
            base64Chars.push(paddingChar);
        }
    }
    return base64Chars.join('');
}
function generateUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function firstLetterUpper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function formatParams(params) {
    var keys = Object.keys(params);
    var newParams = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        newParams[firstLetterUpper(key)] = params[key];
    }
    return newParams;
}
// 格式化数字为'00'
const pad2 = function (num) {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
};

function timestamp() {
    var date = new Date();
    var YYYY = date.getUTCFullYear();
    var MM = pad2(date.getUTCMonth() + 1);
    var DD = pad2(date.getUTCDate());
    var HH = pad2(date.getUTCHours());
    var mm = pad2(date.getUTCMinutes());
    var ss = pad2(date.getUTCSeconds());
    // 删除掉毫秒部分
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}

function encode(str) {
    var result = encodeURIComponent(str);

    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

function replaceRepeatList(target, key, repeat) {
    for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];

        if (Array.isArray(item)) {
            replaceRepeatList(target, `${key}.${i + 1}`, item);
        } else if (item && typeof item === 'object') {
            const keys = Object.keys(item);
            for (var j = 0; j < keys.length; j++) {
                if (Array.isArray(item[keys[j]])) {
                    replaceRepeatList(target, `${key}.${i + 1}.${keys[j]}`, item[keys[j]]);
                } else {
                    target[`${key}.${i + 1}.${keys[j]}`] = item[keys[j]];
                }
            }
        } else {
            target[`${key}.${i + 1}`] = item;
        }
    }
}

function flatParams(params) {
    var target = {};
    var keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = params[key];
        if (Array.isArray(value)) {
            replaceRepeatList(target, key, value);
        } else {
            target[key] = value;
        }
    }
    return target;
}

function normalize(params) {
    var list = [];
    var flated = flatParams(params);
    var keys = Object.keys(flated).sort();
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = flated[key];
        list.push([encode(key), encode(value)]); //push []
    }
    return list;
}

function canonicalize(normalized) {
    var fields = [];
    for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}

class RPCClient {
    constructor(config, verbose) {
        if (!config.endpoint.startsWith('https://') &&
            !config.endpoint.startsWith('http://')) {
            throw new Error(`"config.endpoint" must starts with 'https://' or 'http://'.`);
        }
        var accessKeySecret = config.secretAccessKey || config.accessKeySecret;

        if (config.endpoint.endsWith('/')) {
            config.endpoint = config.endpoint.slice(0, -1);
        }

        this.endpoint = config.endpoint;
        this.apiVersion = config.apiVersion;
        this.accessKeyId = config.accessKeyId;
        this.accessKeySecret = accessKeySecret;
        this.securityToken = config.securityToken;
        this.verbose = verbose === true;
        // 非 codes 里的值，将抛出异常
        this.codes = new Set([200, '200', 'OK', 'Success', 'success']);
        if (config.codes) {
            // 合并 codes
            for (var elem of config.codes) {
                this.codes.add(elem);
            }
        }
        this.opts = config.opts || {};
    }
    // 发送请求
    request(action, params = {}, opts = {}) {
        // 1. compose params and opts
        opts = Object.assign({
            headers: {
                // 'x-sdk-client': helper.DEFAULT_CLIENT,
                // 'user-agent': helper.DEFAULT_UA,
                'x-acs-action': action,
                'x-acs-version': this.apiVersion
            }
        }, this.opts, opts);

        // format action until formatAction is false
        if (opts.formatAction !== false) {
            action = firstLetterUpper(action);
        }

        // format params until formatParams is false
        if (opts.formatParams !== false) {
            params = formatParams(params);
        }
        const defaults = this._buildParams();
        params = Object.assign({ Action: action }, defaults, params);

        // 2. caculate signature
        const method = (opts.method || 'GET').toUpperCase();
        const normalized = normalize(params);
        const canonicalized = canonicalize(normalized);
        // 2.1 get string to sign
        const stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
        // 2.2 get signature
        const key = this.accessKeySecret + '&';
        const signature = stringify(crypto.HmacSHA1(stringToSign, key))
    
        // add signature
        normalized.push(['Signature', encode(signature)]);
        // 3. generate final url
        const url = opts.method === 'POST' ? `${this.endpoint}/` : `${this.endpoint}/?${canonicalize(normalized)}`;
        // 4. send request
        if (opts && !opts.agent) {
            opts.agent = this.keepAliveAgent;
        }
        if (opts.method === 'POST') {
            opts.headers = opts.headers || {};
            opts.headers['content-type'] = 'application/x-www-form-urlencoded';
            opts.data = canonicalize(normalized);
        }
        // console.log('url', url)
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: opts.data ? opts.data : {},
                header: opts.headers,
                method: opts.method,
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    console.log(`${action} request success`)
                    if (res.statusCode === 200) {
                        return resolve(res.data)
                    } else {
                        reject(res.data)
                    }
                },
                fail: (err) => {
                    console.log(err)
                    reject(err.data)
                },
                complete: () => {
                    // wx.hideLoading();
                }
            })
        })
    }

    _buildParams() {
        const defaultParams = {
            Format: 'JSON',
            SignatureMethod: 'HMAC-SHA1',
            SignatureNonce: generateUUID(),
            SignatureVersion: '1.0',
            Timestamp: timestamp(),
            AccessKeyId: this.accessKeyId,
            Version: this.apiVersion,
        };
        if (this.securityToken) {
            defaultParams.SecurityToken = this.securityToken;
        }
        return defaultParams;
    }
}
// 以上代码参考 https://github.com/aliyun/openapi-core-nodejs-sdk
// openapi-core-nodejs-sdk/lib/rpc.js
//*****************************************************************
// 在下面增加自己的代码
/* 实例化Client类必须提供以下参数
iotInstanceId:    阿里云物联网平台实例ID
accessKeyId:      阿里云RAM账号 accessKeyId
accessKeySecret： 阿里云RAM账号 accessKeySecret
endpoint:         产品部署的区域节点  
                  https://help.aliyun.com/zh/iot/product-overview/supported-regions
apiVersion：      API版本号
                  https://help.aliyun.com/zh/iot/developer-reference/common-parameters?spm=a2c4g.11186623.0.0.587173c1NvcOuJ
productName：     产品名称，在创建产品时输入的名称
productKey：      产品密钥，在创建产品时自动生成
productName 和 productKey 二选一，优先选择productKey

例如
new Client({
            accessKeyId: 实际的accessKeySecret,
            accessKeySecret: 实际的accessKeyId,
            iotInstanceId: 实际的阿里云物联网平台实例id,            
            productKey: 实际的productKey,
            endpoint: 'https://iot.cn-shanghai.aliyuncs.com', 
            apiVersion: '2018-01-20'  
        })
*/

class Client extends RPCClient {
    constructor(config, verbose) {
        super(config, verbose); 
        this.iotInstanceId = config.iotInstanceId;                        
        this.params = {
            CurrentPage : 1,
            PageSize : 3,
            IotInstanceId: this.iotInstanceId
        };
        if (config.hasOwnProperty('productKey') && config.ProductKey !== '') {
          this.params.ProductKey = config.productKey
        }
        else {
          this.params.ProductName = config.productName
        }
        this.requestOption = {
            method: 'POST',
            timeout: 3000
        }
        this.initialize(this.params)      
    }

    initialize(){
      if (this.params.hasOwnProperty('ProductKey') && this.params.ProductKey !== '') {
        return;
      }
      return this.request('QueryProductList', this.params, this.requestOption)
          .then(res => {
            if (res.Success) {
                let ProductInfos = res.Data.List.ProductInfo
                for (let index=0; index < ProductInfos.length; index++ )
                {
                  let productInfo = ProductInfos[index]
                  
                  if( productInfo.ProductName == this.params.ProductName) {                    
                    this.params = {}
                    this.params.IotInstanceId = this.iotInstanceId
                    this.params.ProductKey = productInfo.ProductKey                        
                    return
                  }
                }
                if (res.Data.CurrentPage >= res.Data.PageCount){
                    console.log("not found product")
                    return 
                  }
                  this.params.CurrentPage = res.Data.CurrentPage + 1
                return this.initialize()
            } else {
                console.error(res.Code)
            }
          }).catch(err => {
              console.error(err)
          })
    }

   // 获取产品下所有设备状态消息, 页面限制默认一次10个设备
   _queryDevice(params, devices = []) {
    return this.request('QueryDevice', params, this.requestOption)
        .then(res => {
            if (res.Success) {
                devices.push(...res.Data.DeviceInfo)
                if ((res.Page >= res.PageCount))
                    return (this._deviceStatus(devices))
                params.CurrentPage = res.Page + 1
                return this._queryDevice(params, devices)
            } else {
                console.error(res.Code)
            }
        }).catch(err => {
            console.error(err)
        })
}
    
    /* 需要修改的变量格式：{temperature: 25, humidity: 60}
    // 构造更新消息格式：{ "method": "update", "state": { "desired": { 变量名: {"value": [变量值]}} }, "version": -1 }
    */
    _constructUpdateString(variables) {
        const desiredObj = {};
        for (const variableName in variables) {
            desiredObj[variableName] = {
                value: [variables[variableName]]
            };
        }
        const updateObj = {
            method: "update",
            state: {
                desired: desiredObj
            },
            version: -1
        };
        return JSON.stringify(updateObj);
    }
    // 解析Shadow消息
    _parsingShadow(infos) {
        if (!infos) {
            return infos;
        }
        const msg = JSON.parse(infos);
        const { reported } = msg.state;
        const { reported: timestamp } = msg.metadata;
        const data = {};
        for (const key in reported) {
            if (typeof reported[key] === 'object' && timestamp[key]) {
                data[key] = { value: reported[key].value[0], timestamp: timestamp[key].timestamp };
            }
        }
        // console.log(data);
        return data;
    }
    // 格式化device状态信息为
    // { name:DeviceName, status:DeviceStatus, tiemstamp:UtcModified } 
    _deviceStatus(infos) {
        if (!infos) {
            return 'QueryDevice error Or no device in this product';
        }
        const deviceInfo = infos.map(({ DeviceName, DeviceStatus, UtcModified }) => ({
            name: DeviceName,
            status: DeviceStatus,
            timestamp: UtcModified
        }));
        return deviceInfo;
    }
    /*  获取产品下所有设备状态消息
        返回消息格式：[{name: "3S7jBuiTe62aGRQ2V3sL", status: "OFFLINE", timestamp: "2023-05-29T07:41:54.000Z"},{...},{...}]
    */
    queryDevices() {
        let devices = []
        this.params.CurrentPage = 1
        console.log("queryDevices",this.params)
        return this._queryDevice(this.params, devices)
                .then(res => {
                    console.log("queryDevices",res)
                    return res
                }).catch(err => {
                    console.error(err)
                })
    }
    /*  获取Shadow 消息
        返回消息格式：{HAlarm: {value: 1, timestamp: 1692607405},key:{value: uploadValue,timestamp: uploadTimestamp},...}
    */
    getDeviceShadow(DeviceName) {
        var params = this.params;
        params.DeviceName = DeviceName
        return new Promise((resolve, reject) => {
            this.request('GetDeviceShadow', params, this.requestOption)
                .then(res => {
                    if (res.Success) {
                        try {
                            // console.log(res.ShadowMessage);
                            return resolve(this._parsingShadow(res.ShadowMessage))
                        } catch (error) {
                            console.log("no shadowMessage", error)
                        }
                    } else {
                        console.error(res.Code, res.ErrorMessage)
                    }
                }).catch(err => {
                    console.error(err)
                    reject(err)
                })
        })
    }
    /* 往设备更新 Shadow 消息
       msg 格式：{"temperature": 25, "humidity": 60, key: value}
    */
    updateDeviceShadow(msg, DeviceName) {
        const params = this.params
        params.DeviceName = DeviceName;
        params.ShadowMessage = this._constructUpdateString(msg);
        return this.request('UpdateDeviceShadow', params, this.requestOption)
            .then(res => {
                if (res.Success) {
                    console.log(`Update ${JSON.stringify(msg)} Success`);
                } else {
                    console.log(res);
                    console.error(res.Code);
                }
                return res;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
    }
}

module.exports = Client;
