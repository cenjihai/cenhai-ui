import http from "../../utils/http";

/**
 * 查询
 * @param query 传递对应表的字段
 * @returns {*}
 */
export function listMenu(query) {
    return http.get("/menu/list",query);
}

/**
 * 删除
 * @param menuId
 * @returns {*}
 */
export function delMenu(menuId){
    return http.post("/menu/delete/" + menuId,{})
}

/**
 * 更新或新增。有menuId则更新反之新增
 * @param data
 * @returns {*}
 */
export function updateOrSaveMenu(data){
    return http.post("/menu/updateOrSave",data)
}