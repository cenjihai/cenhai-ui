import http from "../utils/http";


export function updateUserInfo(userInfo){
    return http.post("/profile/update",userInfo)
}