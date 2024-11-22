#### 扫描二维码
![image](https://github.com/gokeycolor/wechatDemo/blob/main/images/code.jpg)
账号：admin
密码：logo
```
实例化Client类必须提供以下参数
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
```
