import axios from "axios";
import {baseUrl} from "./ConstList"

const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: baseUrl,
    // 超时
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    withCredentials: true,
})
// 响应拦截器
service.interceptors.response.use(res => {
        if (res.headers.authenticated) {
            localStorage.authenticated = res.headers.authenticated
        }
        return res
    },
    error => {
        return error.response
    }
)

service.interceptors.request.use(config => {
    if (localStorage.authenticated && localStorage.authenticated != "") {
        config.headers['Authenticated'] = localStorage.authenticated
    }
    return config
})

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
            url,
            data
        }).then(data => {
            if (data.status != 200) {
                resolve({code: false, text: `错误码：${data.status},错误信息：${data.data?.emsg}`})
            } else {
                resolve({code: true, data: data.data})
            }
        })
    })

}


export {GetUrl, PostUrl}
