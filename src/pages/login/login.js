import React,{Component} from 'react';
import './login.less';
import {Form,Icon,Input,Button,message} from "antd";
//import logo from './images/logo.jpg'
import {Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {login} from '../../redux/actions'
class Login extends Component{
     constructor(){
         super();
     }
     handleSubmit = e => {
         e.preventDefault();
         this.props.form.validateFields((err, values) => {
             if (!err) {
                 //请求登陆
                 const {username, password} = values;
                 this.props.login(username, password);
             }
        })
     }

     validatePwd=(rule,value,callback)=>{
            if(!value){
                callback('请输入密码')
            }
            else if(value.length<4){
                callback('密码至少4位')
            }
            else if(value.length>20){
                callback('密码最长20位')
            }
            // else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~$@$!%*#?&])[A-Za-z\d~$@$!%*#?&]{8,20}$/.test(value)){
            //     callback('密码为数字、字母、下滑线组合')
            // }
            else{
                callback();
            }
     }
    render() {
         const user=this.props.user;
        const {getFieldDecorator}=this.props.form;
        const Item=Form.Item;
        if(user && user._id){
            return <Redirect to='/home'/>
        }
        const errorMsg=this.props.user.errorMsg;
        return(
            <div className='login'>
                <header className='login-header'>
                    {/*<img src={logo}/>*/}
                    <h1>商品后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div>{errorMsg}</div>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名' },
                            { min:4, message: '用户名最少4位' },
                            { max: 8, message: '用户名最多8位' }
                        ],
                        initialValue:'admin'
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                    </Item>
                    <Item>
                    {getFieldDecorator('password', {
                        rules: [{
                            validator:this.validatePwd
                        }]
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                    </Item>
                    <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    登陆
                    </Button>
                    </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const WrapLogin=Form.create()(Login);
export default connect(
    state=>({user:state.user}),
    {login}
)(WrapLogin);