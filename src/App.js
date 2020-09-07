import React from 'react';
import {Button} from "antd";
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Login from './pages/login/login';
import Admin from './pages/admin/admin'
export default class App extends React.Component{
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </Router>
        );
    }
}

