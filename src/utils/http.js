import axios from "axios";
import {getToken, removeToken} from "./token";
import {ElMessage, ElNotification} from "element-plus";

const config = {
    timeout: 5000,
    baseURL: "http://localhost:8080"
    //baseURL: "http://124.221.213.135:8080"
}

class Http {
    service;

    constructor(config) {
        this.service = axios.create(config)
        /** 拦截请求**/
        this.service.interceptors.request.use(config => {
            if (getToken()){
                config.headers.Authorization = getToken();
            }
            return config;
        }, error => {
            return Promise.reject(error)
        })

        /** 响应拦截**/
        this.service.interceptors.response.use(response => {
            const data = response.data;
            if (data.code === 200){
                return data;
            }else if (data.code === 401){
                ElMessage.warning("未登录，即将前往登录...")
                removeToken()
                setTimeout(function () {
                    location.href = "/login"
                }, 1000)
                return Promise.reject(data);
            }else {
                ElNotification.error({title:data.msg,message:data.data})
                return Promise.reject(data)
            }
        }, error => {
            ElMessage.error("服务器异常，请稍后再试！")
            return Promise.reject(error)
        })
    }

    /* GET 方法 */
    get(url, params, _object = {}){
        return this.service.get(url, { params, ..._object })
    }
    /* POST 方法 */
    post(url, params, _object = {}){
        return this.service.post(url, params, _object)
    }
    /* PUT 方法 */
    put(url, params, _object = {}){
        return this.service.put(url, params, _object)
    }
    /* DELETE 方法 */
    delete(url, params, _object = {}) {
        return this.service.delete(url, { params, ..._object })
    }
    /* 获取配置 */
    getConfig() {
        return config;
    }
}

export default new Http(config)

