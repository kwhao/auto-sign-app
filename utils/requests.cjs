const axios = require('axios')

const request = axios.create({
    // API 请求的默认前缀
    baseURL: "http://127.0.0.1:8188",
    timeout: 60000 // 请求超时时间
})

const errorHandler = (error) => {
    return Promise.resolve({"data": error.response.data, "status": error.response.status})
}

request.interceptors.response.use(response => {
    return {"data": response.data, "status": response.status}
}, errorHandler)

module.exports = request
