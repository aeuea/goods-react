import React,{Component} from 'react';
import {Modal} from "antd";
import './index.less';
import storageUtils from '../../utils/storageUtils';
import {connect} from 'react-redux'
import {formatDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api';
import {withRouter} from "react-router-dom";
import menuList from '../../config/menuConfig';
import {logout} from '../../redux/actions'
import LinkButon from '../../components/link-button/link-button'
class Header extends Component{
    state={
        currentTime:formatDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    getTime=()=>{
        this.interval=setInterval(()=>{
            const currentTime=formatDate(Date.now());
            this.setState({currentTime})
        },1000)
    }
    getWeather=async ()=>{
        const {dayPictureUrl,weather}=await reqWeather('背景')
        this.setState({dayPictureUrl,weather})
    }
    // getTitle=()=>{
    //     const path=this.props.location.pathname;
    //     let title="";
    //     menuList.forEach(item=>{
    //         if(item.key===path){
    //             title=item.title;
    //         }
    //         else if(item.children)
    //         {
    //             const item1=item.children.find(item1=>item1.key===path);
    //             if(item1){
    //                 title=item1.title;
    //             }
    //         }
    //     })
    //     return title;
    // }
    logOut=()=>{
        //显示确认框
        Modal.confirm({
            title:'确认退出？',
            onOk:()=>{
                console.log('确认');
                this.props.logout();
            },
            onCancel(){
                console.log('取消')
            }
        })
    }
    componentDidMount()
    {
         this.getTime();
         this.getWeather();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render(){
        const title=this.props.headTitle;
        const {currentTime,dayPictureUrl,weather}=this.state;
        console.log(dayPictureUrl,weather)
        const user=this.props.user.name
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{user}</span>
                    <LinkButon onClick={this.logOut}>退出</LinkButon>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt='天气' />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header));