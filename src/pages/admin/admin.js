import React,{Component} from 'react';
import {Redirect,Switch,Route} from "react-router-dom";
import memoryUtils from '../../utils/memoryUtils'
import {connect} from "react-redux";
import LeftNav from '../../components/left-nav/index'
import Header from '../../components/header/index'
import { Layout } from 'antd';
import Home from '../home/home';
import Product from '../product/product';
import Category from '../category/category';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Role from '../role/role';
import User from '../user/user';

const {  Footer, Sider, Content } = Layout;


 class Admin extends Component{
    render() {
        const user=this.props.user;
        if(!user || !user._id){
            return <Redirect to='/login'/>
        }
        return(
            <Layout style={{height:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor:'white',margin:'15px'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',backgroundColor:'#eee',height:'20px',verticalAlign:'top'}}>XXX公司商品销售管理</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {}
)(Admin)