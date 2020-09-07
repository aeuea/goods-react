/*
将用户会话信息长期保存在localstorage,localstorage有浏览器兼容问题，可使用store.js
*/
const USER_KEY='user_key';

export default {
    /*保存*/
    saveUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user));
    },
    /*删除*/
    removeUser(){
        localStorage.removeItem(USER_KEY);
    },
    /*读取*/
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY)|| '{}')
    }
}