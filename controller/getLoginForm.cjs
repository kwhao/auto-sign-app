const {ipcMain} = require('electron')
const path = require('path')
const {request} = require('../utils/requests.cjs')

const validateAccount = (username) => {
    return request({
        url: '/validate', method: 'get', params: {'username': username}
    })

}

const login = (username, password) => {
    return request({
        url: '/login', method: 'get', params: {'username': username, 'password': password}
    })
}

const checkValidateDevice = (cookie, deviceId) => {
    return request({
        url: '/checkValidate', method: 'get', params: {
            'cookie': cookie, 'deviceId': deviceId
        }
    })
}

const getValidateImageList = (cookie, deviceId, validateConfig) => {
    return request({
        url: '/getValidateImages', method: 'get', params: {
            'cookie': cookie,
            'deviceId': deviceId,
            'accountKey': validateConfig['accountKey'],
            'sceneCode': validateConfig['sceneCode'],
            'tenantId': validateConfig['tenantId'],
            'userId': validateConfig['userId']
        }
    })
}

const confirmValidateCaptcha = (data) => {
    return request({
        url: '/confirmCaptcha', method: 'post', data: data
    })
}

const handleAutoSign = (cookie, username, deviceId, validateTicket = "") => {
    return request({
        url: '/autoSign', method: 'get', params: {
            'cookie': cookie, 'username': username, 'deviceId': deviceId, 'ticket': validateTicket
        }
    })
}

const getUuid = () => {
    return request({
        url: '/uuid', method: 'get'
    })
}

const test = () => {
    return Promise.resolve({
        "cwd": path.resolve(__dirname),
        "server": path.resolve(__dirname, 'Resources/server/auto-sign-server')
    })
}

ipcMain.handle('on-validate-account', async (e, username) => {
    return await validateAccount(username)
})

ipcMain.handle('on-login', async (e, username, password) => {
    return await login(username, password)
})

ipcMain.handle('on-check-validate', async (e, cookie, deviceId) => {
    return await checkValidateDevice(cookie, deviceId)
})

ipcMain.handle('on-get-validate-image', async (e, cookie, deviceId, validateConfig) => {
    return await getValidateImageList(cookie, deviceId, validateConfig)
})

ipcMain.handle('on-confirm-validate-captcha', async (e, data) => {
    return await confirmValidateCaptcha(data)
})

ipcMain.handle('on-auto-sign', async (e, cookie, username, deviceId, validateTicket = "") => {
    return await handleAutoSign(cookie, username, deviceId, validateTicket)
})

ipcMain.handle('on-get-uuid', async (e) => {
    return await getUuid()
})


ipcMain.handle('on-test', async (e) => {
    return await test()
})

// module.exports = getLoginForm
