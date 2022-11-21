<script setup>
import {ref} from "vue"
import {message} from "ant-design-vue";

defineProps({
  msg: String
})
const signBtn = ref({disabled: false, loading: false})
const username = ref('')
const password = ref('')
const deviceId = ref('')
const headerDeviceId = ref('')
const id = ref(1)
const validateModel = ref(false)
const validateTicket = ref("")
const validateDevice = {
  'need': true,
  'imagesInfos': [],
  'name': '',
  'code': '',
  'cookie': '',
  'config': {
    "accountKey": "",
    "sceneCode": "",
    "tenantId": "",
    "userId": ""
  }
}
const validateAccount = async () => {
  signBtn.value.loading = true
  if (username.value.length > 0) {
    await loginApi.validateAccount(username.value).then(res => {
      signBtn.value.loading = false
      signBtn.value.disabled = false
    }).catch(err => {
      message.error(err['msg'])
      signBtn.value.disabled = true
      setTimeout(() => {
        signBtn.value.loading = false
      }, 2000)
    })
  }
  signBtn.value.loading = false
}
const handleClick = async () => {
  await validateAccount()
  signBtn.value.loading = true
  if (username.value.length > 0 && password.value.length > 0 && deviceId.value.length > 0) {
    await loginApi.login(username.value, password.value).then(async loginRes => {
      headerDeviceId.value = Xu()
      await loginApi.checkValidateDevice(loginRes['cookie'], deviceId.value).then(async checkRes => {
        if (checkRes['isNeed']) {
          await loginApi.getValidateImageList(checkRes['cookie'], headerDeviceId.value, checkRes['data']).then(async imageRes => {
            console.log(imageRes)
            validateDevice.need = true
            validateDevice.imagesInfos = imageRes['data']['imageInfos']
            for (const index in validateDevice.imagesInfos) {
              validateDevice.imagesInfos[index]['picked'] = false
            }
            validateDevice.name = imageRes['data']['name']
            validateDevice.code = imageRes['data']['code']
            validateDevice.cookie = imageRes['cookie']
            Object.assign(validateDevice.config, checkRes['data'])
            validateModel.value = true
          })
        } else {
          //  todo 直接发送登录请求
          message.warn("可以签到")
          await handleAutoSign(checkRes['cookie'], username.value, deviceId.value)
        }
      }).catch(err => {
        message.error(`设备验证失败：${err['msg']}`)
        setTimeout(() => {
          signBtn.value.loading = false
        }, 2000)
      })
    }).catch(err => {
      message.error(`登录失败：${err['msg']}`)
      setTimeout(() => {
        signBtn.value.loading = false
      }, 2000)
    })
  } else {
    message.error(`缺少参数：${username.value.length > 0 ? "" : "用户名；"}${password.value.length > 0 ? "" : "密码；"}${deviceId.value.length > 0 ? "" : "设备识别号码；"}`)
    setTimeout(() => {
      signBtn.value.loading = false
    }, 2000)
  }
}

const getUuid = async () => {
  await loginApi.getUuid().then(res => {
    message.success("获取成功")
    deviceId.value = res['uuid']
  }).catch(() => {
    message.error("获取失败")
  })
}

const handleOk = async () => {
  signBtn.value.loading = true
  const captchaBody = {}
  const pickedImageCodes = []
  for (const index in validateDevice.imagesInfos) {
    if (validateDevice.imagesInfos[index]['picked']) {
      pickedImageCodes.push(validateDevice.imagesInfos[index]['code'])
    }
  }
  Object.assign(captchaBody, validateDevice.config, {
    'cookie': validateDevice.cookie,
    'deviceId': headerDeviceId.value,
    'scenesImageCode': validateDevice.code,
    'scenesImageCodes': pickedImageCodes
  })
  console.log(captchaBody)
  await loginApi.confirmValidateCaptcha(captchaBody).then(async res => {
    message.success(`校验成功：${Object.prototype.hasOwnProperty.call(res['data'], 'message') ? res['data']['message'] : res['msg']}`)
    validateTicket.value = res['data']['result']
    message.warn(`即将为您进行打卡，请勿操作！`)
    console.log(res)
    // todo 发送签到请求
    await handleAutoSign(res['cookie'], username.value, deviceId.value, validateTicket.value)

    validateModel.value = !validateModel.value
  }).catch(err => {
    message.error(`验证码校验失败：${Object.prototype.hasOwnProperty.call(err['data'], 'message') ? err['data']['message'] : err['msg']}`)
    setTimeout(() => {
      validateModel.value = false
      signBtn.value.loading = false
    }, 800)
  })
  signBtn.value.loading = false
}

const handleImagePick = (code) => {
  for (const item in validateDevice.imagesInfos) {
    if (validateDevice.imagesInfos[item]['code'] === code) {
      validateDevice.imagesInfos[item]['picked'] = !validateDevice.imagesInfos[item]['picked']
    }
  }
  id.value++
}

const handleAutoSign = async (cookie, username, deviceId, validateTicket = "") => {
  signBtn.value.loading = true
  await loginApi.handleAutoSign(cookie, username, deviceId, validateTicket).then(res => {
    message.success(`签到成功：${Object.prototype.hasOwnProperty.call(res, 'data') ? res['data']['message'] : res['msg']}`)
    signBtn.value.loading = false
  }).catch(err => {
    console.log(err)
    message.error(`签到失败：${Object.prototype.hasOwnProperty.call(err, 'data') ? err['data']['message'] : err['msg']}`)
    setTimeout(() => {
      signBtn.value.loading = false
    }, 800)
  })
}

const Xu = () => {
  let t = (new Date)
      .getTime();
  return window.performance && "function" == typeof window.performance.now && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (e) {
    const n = (t + 16 * Math.random()) % 16 | 0;
    return t = Math.floor(t / 16), ("x" === e ? n : 3 & n | 8)
        .toString(16)
  }))
}

const test = () => {
  loginApi.test().then(res => {
    console.log(res)
  })
}
</script>

<template>
  <h1>{{ msg }}
    <a-tag color="#f50" style="font-size: 10px">Beta 0.2.0</a-tag>
  </h1>
  <div class="input-container">
    <a-input class="input-box" v-model:value="username" placeholder="请输入学号" @blur="validateAccount" allow-clear/>
    <a-input class="input-box" v-model:value="password" type="password" placeholder="请输入密码" allow-clear/>
    <div style="display: flex">
      <a-input class="input-box" v-model:value="deviceId" type="text" placeholder="请输入deviceId" allow-clear/>
      <a-button v-show="deviceId.length===0" @click="getUuid" style="margin: 10px">获取一个</a-button>
    </div>
    <!--    <div v-for="item in "></div>-->
  </div>
  <a-button type="primary" ghost @click="handleClick" :loading="signBtn.loading" :disabled="signBtn.disabled"
            style="width: 200px">点我签到
  </a-button>
  <a-modal v-model:visible="validateModel" title="需要设备验证" @ok="handleOk">
    <div class="validate-device-container">
      <p style="text-align: center;width: 300px;">请选择下列图片中的 <b>{{ validateDevice.name }}</b></p>
      <div :key="id" class="image-box">
        <template v-for="item in validateDevice.imagesInfos">
          <img
              :class="item['picked']?'picked':'unpicked'"
              :width="80"
              :src="item['path']"
              @click="handleImagePick(item['code'])"
              style="margin: 2px"
              alt="item['code']"/>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.input-container {
  max-width: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

.input-box {
  width: 360px;
  margin: 10px;
}

.validate-device-container {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-box {
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.picked {
  border: solid 5px red;
  box-shadow: #535bf2;
}
</style>
