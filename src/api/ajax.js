/*
对axios封装，发ajax请求,返回promise*/
import axios from 'axios';
import {message} from 'antd'

export default function ajax(url,data={},method="get") {
    // 请求的错误在ajax请求后处理，方便前端处理
    return new Promise((resolve,reject)=>{
        let result;
        if(method==='get'){
           result= axios.get(url,{
                params:data
            });
        }
        else{
            result= axios.post(url,data)
        }
        result.then((response)=>{
            resolve(response.data);
        }).catch(error=>{/*error信息是服务器端写好了的*/
            message.error(("请求出错："+error.message))
        })
    })
}

// ajax('/login',{username:'tom',password:'12345'},'post').then();
