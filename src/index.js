import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './redux/store'
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css'
import App from './App';

/*用户登录从本地数据中取user*/
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
 , document.getElementById('root'));

serviceWorker.unregister();
