import http from "../../utils/http";

/**
 * 日志详情
 * @param operId
 * @returns {*}
 */
export function operlogDetails(operId){
    return http.get("/monitor/operlog/" + operId,{})
}

/**
 * 删除日志
 * @param operIds
 * @returns {*}
 */
export function delOperlog(operIds = []){
    return http.post("/monitor/operlog/delete",operIds)
}

/**
 * 查询日子
 * @param query
 * @param page
 * @returns {*}
 */
export function listOperlog(query, page){
    return http.get("/monitor/operlog/list",Object.assign(page, query))
}