<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="饲喂站号">
                <a-select v-model="queryParam.stationId">
                  <a-select-option v-for="(item, index) in stationList" :key="index" :value="item">
                    {{ item }}
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
            <a @click="handleBackFat(record)">背膘厚</a>&nbsp;
            <a @click="handleFood(record)">饲喂量</a>
          </template>
        </span>
      </s-table>

      <back-fat
        ref="backFat"
        :visible="backFatVisible"
        :loading="backFatConfirmLoading"
        :model="backFatMdl"
        @cancel="backFatCancel"
        @ok="backFatOk"
      />
      <food
        ref="food"
        :visible="foodVisible"
        :loading="foodConfirmLoading"
        :model="foodMdl"
        @cancel="foodCancel"
        @ok="foodOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { getBuildUnitStationList } from '@/api/station'
  import { queryAllFeedingSetList } from '@/api/feeding'
  import backFat from './Backfat'
  import food from './Food'

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '饲喂站号',
      dataIndex: 'stationId',
      customRender: text => text.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
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
      title: '背膘厚/mm',
      dataIndex: 'backFat'
    },
    {
      title: '默认采食量/kg',
      dataIndex: 'indexQuantity'
    },
    {
      title: '推荐采食量/kg',
      dataIndex: 'algoQuantity',
      customRender: text => text / 10
    },
    {
      title: '设置采食量/kg',
      dataIndex: 'setQuantity',
      customRender: text => text / 10
    },
    {
      title: '上次设置时间',
      dataIndex: 'setTime'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'Intake',
    components: {
      STable,
      backFat,
      food
    },
    data () {
      this.columns = columns
      return {
        // create backFat model
        backFatVisible: false,
        backFatConfirmLoading: false,
        backFatMdl: null,
        // create food model
        foodVisible: false,
        foodConfirmLoading: false,
        foodMdl: null,
        // 查询参数
        earId: '',
        queryParam: {},
        stationList: [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const queryParam = {}
          if (this.queryParam.stationId) {
            queryParam['stationId'] = this.queryParam.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
            queryParam['earId'] = this.queryParam.earId
          }
          const requestParameters = Object.assign({}, parameter, queryParam)
          return queryAllFeedingSetList(requestParameters).then(res => res)
        }
      }
    },
    created () {
      getBuildUnitStationList().then(res => {
        this.stationList = res.map(item => item.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        )
      })
    },
    methods: {
      handleBackFat (record) {
        record.stationId = record.stationId.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        this.backFatVisible = true
        this.backFatMdl = { ...record }
      },
      backFatCancel () {
        this.backFatVisible = false
      },
      backFatOk () {
        const form = this.$refs.backFat.form
        this.backFatConfirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            values.stationId = values.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
            if (values) {
              // 修改earId
              // changeEarId(values).then(res => {
              //   this.visible = false
              //   this.confirmLoading = false
              //   // 刷新表格
              //   this.$refs.table.refresh()
              //
              //   this.$message.success('修改耳标号成功')
              // }).catch(() => {
              //   this.visible = false
              //   this.confirmLoading = false
              //   // 刷新表格
              //   this.$refs.table.refresh()
              //
              //   this.$message.error('该饲喂站耳标号已存在')
              // })
              console.log('backfat ok')
            }
          } else {
            this.backFatConfirmLoading = false
          }
        })
      },
      handleFood (record) {
        record.stationId = record.stationId.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        this.foodVisible = true
        this.foodMdl = { ...record }
      },
      foodCancel () {
        this.foodVisible = false
      },
      foodOk () {
        const form = this.$refs.food.form
        this.backFatConfirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            values.stationId = values.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
            if (values) {
              console.log('food ok')
            }
          } else {
            this.backFatConfirmLoading = false
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
