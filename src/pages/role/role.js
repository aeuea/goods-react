import React,{Component} from 'react';
import {Card, Select, Input, Button, Icon, Table, message, Modal} from 'antd'
import {formatDate} from "../../utils/dateUtils";
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqUpdateRole} from '../../api/index';
import {reqAddRole} from '../../api/index'
import AddForm from './add-form';
import AuthForm from './auth-form'
import {connect} from "react-redux";
import {logout} from "../../redux/actions";

class Role extends Component{
    constructor(){
        super();
        this.auth=React.createRef();
    }
    state={
        roles:[],
        role:{},
        isShowAdd:false,
        isShowAuth:false
    }
    onRow=(role)=>{
        return {
            onClick:event=>{
            this.setState({role})
        }
        }
    }

    getRoles=async ()=>{
        const result=await reqRoles();
        if(result.status===0){
            const roles=result.data;
            this.setState({roles})
        }
    }
    addRole=()=>{
        this.form.validateFields(async (error,value)=>{
            if(!error ){
                this.setState({isShowAdd:false})
                const {roleName}=value;
                this.form.resetFields();
                const result=await reqAddRole(roleName);
                if(result.status===0){
                    const role=result.data;
                    message.success('添加角色成功');
                    this.getRoles();
                    this.setState((state)=>({roles:[...state.roles,role]}))
                }
                else{
                    message.error('添加角色失败')
                }
            }
        })
    }

    updateRole=async ()=>{
        this.setState({isShowAuth:false})
        const role=this.state.role;
        const menus=this.auth.current.getMenus();
        role.menus=menus;
        role.auth_time=formatDate(Date.now())
        role.auth_name=this.props.user.username;

        const result=await reqUpdateRole(role);
        if(result.status===0){
            message.success('更新角色成功');
            //更新自己的权限,退出重新登录
            if(role._id===this.props.user.role_id){
                this.props.logout();
                message.success('权限已修改，重新登陆')
            }
            else{
                message.success('设置角色权限成功')
                this.setState({
                    roles:[...this.state.roles]//更新role里面保存的权限
                })
            }
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:(create_time)=>formatDate(create_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
            ]
    }

    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getRoles();
    }

    render() {
        const {roles,role,isShowAdd,isShowAuth}=this.state;
        const title = (
            <span>
                 <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                 <Button type='primary' onClick={()=>this.setState({isShowAuth:true})} disabled={!role._id}>设置权限</Button>
            </span>
            )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                            this.setState({
                                role
                            })
                        }

                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({isShowAdd:false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        role={role}
                        //当前组件的form保存form框的值
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                    <Modal
                        title="设置权限"
                        visible={isShowAuth}
                        onOk={this.updateRole}
                        onCancel={()=>{
                            this.setState({isShowAuth:false})
                        }}
                    >
                        <AuthForm
                            role={role}
                            ref={this.auth}
                        />
                </Modal>

            </Card>
    )
    }
}

export default connect(
    state=>({user:state.user}),
    {logout}
)(Role)