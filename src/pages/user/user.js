import React,{Component} from 'react';
import {Card,Button,Modal,Table,message} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import UserForm from "./user-form";
import {reqAddOrUpdateUser, reqDeleteUser, reqUsers} from "../../api";
import {formatDate} from "../../utils/dateUtils";
export default class User extends Component{
    state={
        users:[],
        roles:[],
        isShow:false
    }
    //生成role对象,键值对保存roleName
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }
    //添加
    showAdd=()=>{
        this.user=null;
        this.setState({
            isShow:true
        })
    }
    //修改
    showUpdate=(user)=>{
        this.user=user;
        this.setState({
            isShow:true
        })
    }

    deleteUser=(user)=>{
        Modal.confirm({
            title:`确认删除${user.username}用户？`,
            onOk:async ()=>{
                const result=await  reqDeleteUser(user._id);
               if(result.status===0){
                   message.success('删除成功');
                   this.getUsers()

               }
            },
            onCancel(){
                console.log('取消')
            }
        })
    }
    addOrUpdateUser=async () => {
        this.setState({isShow: false})
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        if (this.user) {
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if(result.status===0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }


    getUsers=async()=>{
        const result=await reqUsers();
        if(result.status===0){
            const {users,roles}=result.data;
            this.initRoleNames(roles)
            this.setState({
                users,roles
            })
        }
    }
    initColumns=()=>{
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },

            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
                )
            },
        ]
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getUsers();
    }

    render() {
        const {users,roles,isShow}=this.state;
        const user=this.user || {};
        const title=(
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )
        return(
            <Card title={title}>
                <Table
                    bordered
                    rowkey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                <UserForm
                        roles={roles}
                        user={user}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}