import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';
import {connect} from "react-redux";
import login from '../../assets/images/login.jpg'
import menuList from '../../config/menuConfig'
import './index.less'
import {setHeadTitle} from '../../redux/actions'
const SubMenu = Menu.SubMenu;

//左侧导航的组件
class LeftNav extends Component {
   // 判断当前登陆用户对item是否有权限
    hasAuth = (item) => {
        const {key, isPublic} = item

        const menus = this.props.user.role.menus;
        const username = this.props.user.username;

        if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
            return true
        } else if(item.children){ // 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
        }

        return false
    }

    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                // 向pre添加<Menu.Item>
                if(!item.children) {
                    if(item.key===path || path.indexOf(item.key)===0){
                        this.props.setHeadTitle(item.title);
                    }
                    pre.push((
                        <Menu.Item key={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    // 如果存在,item的子列表打开
                    if (cItem) {
                        this.openKey = item.key
                    }
                    // 向pre添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }

    componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
            path = '/product'
        }

        // 得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={login} />
                    <h5>用户:{this.props.user.username}</h5>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))