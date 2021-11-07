<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="饲喂站号">
                <a-select v-model="queryParam.stationId">
                  <a-select-option v-for="(s, index) in stationList" :key="index" :value="s">
                    {{ s }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="母猪电子耳标">
                <a-input v-model="queryParam.earId" style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'left', overflow: 'hidden' }">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="pigId"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">更换耳标</a>
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
  import { STable } from '@/components'
  import { getBuildUnitStationList } from '@/api/station'
  import { queryAllList, changeEarId } from '@/api/pig'
  import CreateForm from './CreateForm'

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '饲喂站号',
      dataIndex: 'stationId',
      customRender: (text) => text.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
    },
    {
      title: '母猪号',
      dataIndex: 'pigId'
    },
    {
      title: '母猪电子耳标',
      dataIndex: 'earId'
      // customRender: (text) => text + ' 次'
    },
    {
      title: '配种时间',
      dataIndex: 'breedTime',
      customRender: text => text.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    },
    {
      title: '背膘厚/mm',
      dataIndex: 'backFat'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'EarId',
    components: {
      STable,
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
        earId: 12,
        queryParam: {},
        stationList: [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          // const queryParam = {}
          // if (this.queryParam.stationId) {
          //   queryParam['stationId'] = this.queryParam.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
          //   queryParam['earId'] = this.queryParam.earId
          // }
          // const requestParameters = Object.assign({}, parameter, queryParam)
          const requestParameters = Object.assign({}, parameter)
          return queryAllList(requestParameters).then(res => res)
        },
        changePigId: ''
      }
    },
    created () {
      getBuildUnitStationList().then(res => {
        this.stationList = res.map(item => item.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        )
      })
    },
    methods: {
      handleEdit (record) {
        this.changePigId = record.id
        record.stationId = record.stationId.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        this.visible = true
        this.mdl = { ...record }
      },
      handleCancel () {
        this.visible = false
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            values.stationId = values.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
            if (values) {
              // 修改earId
              changeEarId(values).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.success('修改耳标号成功')
              }).catch(() => {
                this.visible = false
                this.confirmLoading = false
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.error('该饲喂站耳标号已存在')
              })
            }
          } else {
            this.confirmLoading = false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
