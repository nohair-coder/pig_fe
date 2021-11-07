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

        <span slot="action">
          <template>
            1
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { getBuildUnitStationList } from '@/api/station'
  import { queryIntakeData } from '@/api/records'

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '饲喂站号',
      dataIndex: 'stationId',
      scopedSlots: { customRender: 'stationId' },
      customRender: text => text.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
    },
    {
      title: '母猪号',
      dataIndex: 'pigId',
      scopedSlots: { customRender: 'pigId' }
    },
    {
      title: '母猪电子耳标',
      dataIndex: 'earId',
      scopedSlots: { customRender: 'earId' }
      // customRender: (text) => text + ' 次'
    },
    {
      title: '背膘厚/mm',
      dataIndex: 'backFat'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      scopedSlots: { customRender: 'breedTime' },
      customRender: (text) => text.replace(/(.+)T(.+)/, '$1 $2')
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      scopedSlots: { customRender: 'backFat' },
      customRender: (text) => text.replace(/(.+)T(.+)/, '$1 $2')
    },
    {
      title: '采食量/g',
      dataIndex: 'mount',
      width: '150px'
    }
  ]

  export default {
    name: 'IntakeData',
    components: {
      STable
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
        stationList: [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return queryIntakeData(requestParameters).then(res => {
            console.log(res)
            return res
          })
        }
      }
    },
    created () {
      getBuildUnitStationList().then(res => {
        this.stationList = res.map(item => item.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3'))
      })
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
