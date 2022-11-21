const {contextBridge, ipcRenderer} = require('electron')

const validateAccount = (username) => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-validate-account', username).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const login = (username, password) => {
    return new Promise(async (resolve, reject) => {
        const res = await ipcRenderer.invoke('on-login', username, password).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const checkValidateDevice = (cookie, deviceId) => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-check-validate', cookie, deviceId).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const getValidateImageList = (cookie, deviceId, validateConfig) => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-get-validate-image', cookie, deviceId, validateConfig).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}


const confirmValidateCaptcha = (data) => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-confirm-validate-captcha', data).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const handleAutoSign = (cookie, username, deviceId, validateTicket = "") => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-auto-sign', cookie, username, deviceId, validateTicket).then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const getUuid = () => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-get-uuid').then(res => {
            if (res['status'] === 200) {
                resolve(res['data'])
            } else {
                reject(res['data'])
            }
        })
    })
}

const test = () => {
    return new Promise(async (resolve, reject) => {
        await ipcRenderer.invoke('on-test').then(res => {
            resolve(res)
        })
    })
}

contextBridge.exposeInMainWorld('loginApi', {
    validateAccount,
    login,
    checkValidateDevice,
    getValidateImageList,
    confirmValidateCaptcha,
    handleAutoSign,
    getUuid,
    test
})
