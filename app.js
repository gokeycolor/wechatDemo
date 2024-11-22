// app.js
/* 以下参数必须修改为实际值
iotInstanceId:    阿里云物联网平台实例ID
accessKeyId:      阿里云RAM账号 accessKeyId
accessKeySecret： 阿里云RAM账号 accessKeySecret
endpoint:         产品部署的区域节点  
                  https://help.aliyun.com/zh/iot/product-overview/supported-regions
apiVersion：      API版本号
                  https://help.aliyun.com/zh/iot/developer-reference/common-parameters?spm=a2c4g.11186623.0.0.587173c1NvcOuJ
productName：     产品名称，在创建产品时输入的名称
*/
const iotInstanceId = ''        //输入实际的阿里云物联网平台实例id
const accessKeyId = ''          // 输入实际的accessKeyId
const accessKeySecret = ''      //输入实际的accessKeySecret
const endpoint = 'https://iot.cn-shanghai.aliyuncs.com' //cn-shanghai 替换为实际部署的区域节点
const apiVersion = '2018-01-20'
const productName =  ''         //修改为实际的产品名称

var Client = require('utils/rpc');
App({
    globalData: {
        client: null,
        onlineDevices: [],
        currentDevice: null,
        needUpdate: true
    },
    onLaunch() {
        // 创建Client实例
        this.client = new Client({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            iotInstanceId: iotInstanceId,
            productName: productName,
            endpoint: endpoint, 
            apiVersion: apiVersion  
        });
    }
})
