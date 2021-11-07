<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="栋号">
                <a-input v-model="queryParam.build" style="width: 100%" placeholder="请输入栋号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="单元号">
                <a-input v-model="queryParam.unit" style="width: 100%" placeholder="请输入单元号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="饲喂站号">
                <a-input v-model="queryParam.stationId" style="width: 100%" placeholder="请输入饲喂站号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="addStation()">添加</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">开关机</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import {
    queryAllStationList,
    addOneStation,
    changeStatus
  } from '@/api/station'

  import CreateForm from './CreateForm'
  import { formatZero } from '@/utils/util'

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '饲喂站号',
      dataIndex: 'build_unit_station',
      scopedSlots: { customRender: 'build_unit_station' },
      customRender: text => text.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      scopedSlots: { customRender: 'temperature' },
      customRender: text => text + ' ℃'
    },
    {
      title: '湿度',
      dataIndex: 'humidity',
      scopedSlots: { customRender: 'humidity' },
      customRender: (text) => text + ' %'
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' }
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updatedAt'
    // },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const statusMap = {
    'OFF': {
      status: 'default',
      text: '关闭'
    },
    'ON': {
      status: 'processing',
      text: '运行中'
    },
    'ERROR': {
      status: 'error',
      text: '异常'
    }
  }

  export default {
    name: 'Station',
    components: {
      STable,
      Ellipsis,
      CreateForm
    },
    data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter)
          return queryAllStationList(requestParameters).then(() => []).catch(() => {
            return {
              data: [{
                    id: 1,
                    build_unit_station: '01020005',
                    temperature: 25,
                    humidity: 40,
                    status: 'OFF'
              }],
              pageNo: 1,
              pageSize: 20,
              totalCount: 1,
              totalPage: 1
            }
          })
        }
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    methods: {
      handleEdit (record) {
        this.visible = true
        record.build_unit_station = record.build_unit_station.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        console.log(record)
        this.mdl = { ...record }
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            if (values.status !== this.mdl.status) {
            // if (a === true) {
              // 状态不同，需通知下位机修改
              // 修改 e.g.
              values.build_unit_station = values.build_unit_station.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
              changeStatus(values).then(res => {
                console.log(res)
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                if (res.code === 1) this.$message.info('操作成功！')
                else if (res.code === 0) this.$message.error('操作失败，请重试')
              })
            } else {
              // 状态相同，直接关闭form
              this.visible = false
              this.confirmLoading = false
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      addStation () {
        // build_unit_station
        const build = formatZero(this.queryParam.build, 2)
        const unit = formatZero(this.queryParam.unit, 2)
        const station = formatZero(this.queryParam.stationId, 4)
        const data = build + unit + station
        addOneStation({ 'build_unit_station': data }).then(res => {
          console.log(res)
          if (res.code === 1) this.$message.success('添加成功')
          else if (res.code === 0) this.$message.error(res.message)
          this.$refs.table.refresh(true)
        }).catch(() => {
          this.$message.error('添加失败')
        })
      }
    }
  }
</script>

<style scoped>

</style>
