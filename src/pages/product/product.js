import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import ProductHome from './home';
import ProductAddUpdate from './add-update'
import Detail from './details';
export default class Product extends Component{
    render() {
        return(
            <Switch>
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={Detail}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}