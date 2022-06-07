import http from "../../utils/http";


/**
 * 批量更新一组配置
 * @param configs
 * @returns {*}
 */
export function batchUpdate(configs){
    return http.post("/config/batchUpdate",configs)
}

/**
 * 查询分组下的配置
 * @param groupId
 * @returns {*}
 */
export function listConfig(groupId){
    return http.get("/config/listConfig/" + groupId,{})
}

/**
 * 返回全部的配置分组
 * @returns {*}
 */
export function listGroup(){
    return http.get("/config/listGroup",{})
}