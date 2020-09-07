import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from "antd";
//接口函数
const base='';
export const reqLogin=(username,password)=>ajax(base+'/login',{username,password},'post')
//获取用户列表
export const reqUsers=()=>ajax(base+'/manage/user/list');
export const reqDeleteUser=(userId)=>ajax(base+'/manage/user/delete',{userId},'post')
export const reqAddOrUpdateUser=(user)=>ajax(base+'/manage/user/'+(user._id?'update':'add'),user,'post');
/*获取角色*/
export const reqRoles=()=>ajax(base+'/manage/role/list');
export const reqAddRole=(roleName)=>ajax(base+'/manage/role/add',{roleName},'post');
export const reqUpdateRole=(role)=>ajax(base+'/manage/role/update',role,'post')
//商品
export const reqAddOrUpdateProduct=(product)=>ajax(base+'/manage/product/'+(product._id?'update':'add'),product,'post');
export const reqDeleteImg=(name)=>ajax(base+'/manage/img/delete',{name},'post')
export const reqUpdateStatus=(product,status)=>ajax(base+'/manage/product/updatetatus',{product,status})
export const reqCategory=(categoryId)=>ajax(base+'/manage/category/info',{categoryId})
/*搜索商品分页列表*/
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(base+'/manage/product/search',{
    pageNum,pageSize,[searchType]:searchName,
})
/*获取商品分页列表*/
export const reqProducts=(pageNum,pageSize)=>ajax(base+'/manage/product/list?',{pageNum,pageSize})
/*获取分类列表*/
export const reqCategorys=(parentId)=>ajax((base+'/manage/category/list'),{parentId});
export const reqAddCategory=(categoryName,parentId)=>ajax((base+'/manage/category/add'),{categoryName,parentId},'post');
export const reqUpdateCategory=(categoryId,categoryName)=>ajax((base+'/manage/category/update'),{categoryId,categoryName},'get');
/*jsonp请求*/
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=FK9mkfdQsloEngodbFl4FeY3`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            if (!err && data.status==='success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败!')
            }

        })
    })
}
