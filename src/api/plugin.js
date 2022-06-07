import http from "../utils/http";

/**
 * 修改插件状态
 * @param data
 * @returns {*}
 */
export function changePluginStatus(data){
    return http.post("/plugin/changeStatus",data)
}

/**
 * 卸载插件
 * @param pluginId
 * @returns {*}
 */
export function uninstallPlugin(pluginId){
    return http.post("/plugin/uninstall/" + pluginId, {})
}

/**
 * 查询插件
 * @param query
 * @returns {*}
 */
export function listPlugin(query){
    return http.get("/plugin/list",query)
}