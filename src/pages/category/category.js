import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import LinkButton from '../../components/link-button/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/*商品分类路由*/
export default class Category extends Component {

    state = {
        loading: false,
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 将每一行的对象传入render(),antd实现
                    <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

          </span>
                )
            }
        ]
    }

    /*异步获取一级/二级分类列表显示parentId:
    如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求 */
    getCategorys = async (parentId) => {

        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({loading: false})

        if(result.status===0) {
            const categorys = result.data
            if(parentId==='0') {
                // 更新一级分类状态
                this.setState({
                    categorys
                })
                console.log('----', this.state.categorys.length)
            } else {
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*显示指定一级分类对象的二子列表*/
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            console.log('parentId', this.state.parentId) // '0'
            this.getCategorys()
        })

    }
    /*显示指定一级分类列表*/
    showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    showStatus: 0
                })

                // 收集数据, 并提交添加分类的请求
                const {parentId, categoryName} = values
                this.form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if(result.status===0) {

                    // 添加的分类就是当前分类列表下的分类
                    if(parentId===this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                        this.getCategorys('0')
                    }
                }
            }
        })
    }

    /*显示修改的确认框*/
    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    updateCategory = () => {
        console.log('updateCategory()')
        this.form.validateFields(async (err, values) => {
            if(!err) {
                this.setState({
                    showStatus: 0
                })

                const categoryId = this.category._id
                const {categoryName} = values
                // 清除输入数据
                this.form.resetFields()

                // 发请求更新分类
                const result = await reqUpdateCategory({categoryId, categoryName})
                if (result.status===0) {
                    this.getCategorys()
                }
            }
        })


    }
    componentWillMount () {
        this.initColumns()
    }
    componentDidMount () {
        this.getCategorys()
    }
    render() {
        const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
        // 读取指定的分类
        const category = this.category || {};
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}