import http from "../../utils/http";

/**
 * 查询角色
 * @param query
 * @param page
 * @returns {*}
 */
export function listRole(query, page){
    return http.get("/role/list",Object.assign(page,query))
}

/**
 * 删除角色
 * @param roleIds
 * @returns {*}
 */
export function delRole(roleIds = []){
    return http.post("/role/delete",roleIds)
}

/**
 * 更新或新增角色
 * @param data
 * @returns {*}
 */
export function updateOrSaveRole(data){
    return http.post("/role/updateOrSave",data)
}

/**
 * 查询用户拥有的角色
 * @param userId
 * @returns {*}
 */
export function getUserRole(userId){
    return http.get("/role/getUserRole/" + userId,{})
}