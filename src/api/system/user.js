import http from "../../utils/http";

/**
 * 查询
 * @param query 查询条件
 * @param page 分页条件
 * @returns {*}
 */
export function listUser(query, page){
    return http.get("/user/list",Object.assign(page,query))
}

/**
 * 更新密码
 * @param data
 * @returns {*}
 */
export function updateOrSaveUserAuthByPassword(data){
    return http.post("/userauth/updateOrSaveUserAuthByPassword", data)
}

/**
 * 获取密码认证方式的数据
 * @param userId
 * @returns {*}
 */
export function getPasswordType(userId){
    return http.get("/userauth/getPasswordType/" + userId,{})
}

/**
 * 更新用户的角色
 * @param userId
 * @param roles
 * @returns {*}
 */
export function updateRole(userId, roles){
    return http.post("/user/updateRole/" + userId,roles)
}

/**
 * 更新或保存用户
 * @param data
 * @returns {*}
 */
export function updateOrSaveUser(data){
    return http.post("/user/updateOrSave",data)
}

/**
 * 删除用户
 * @param userIds
 * @returns {*}
 */
export function delUser(userIds= []){
    return http.post("/user/delete",userIds)
}