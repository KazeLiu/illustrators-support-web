import axios from "axios";

const baseUrl = 'http://39.104.71.38:80'

axios.defaults.withCredentials = true

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'


const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: baseUrl,
    // 超时
    timeout: 10000
})
// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        return res.data
    },
    error => {
        console.log('err' + error)
        return Promise.reject(error)
    }
)

function GetUrl(url) {
    return request(url, null, "get")
}

function PostUrl(url, data) {
    return request(url, data, "post")
}

function request(url, data, type = "get") {
    return new Promise((resolve, reject) => {
        service({
            method: type,
            url: url,
            data: data,
            timeout: 10000
        }).then(data => {
            resolve(data.data)
        }).catch(data => {
            reject(false)
        })
    })

}


export {GetUrl, PostUrl}
