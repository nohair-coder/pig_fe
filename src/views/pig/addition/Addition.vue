<template>
  <page-header-wrapper>
    <!-- 操作 -->
    <a-card
      class="card"
      style="margin-top: 24px;height: 410px;"
      :bordered="false"
      :tabList="additionTabList"
      :activeTabKey="additionActiveTabKey"
      @tabChange="(key) => {this.additionActiveTabKey = key}"
    >
      <handle-pig-form v-if="additionActiveTabKey === '1'" ref="handleAddition" @handleRefresh="refresh"/>
      <AutoPigForm v-if="additionActiveTabKey === '2'"/>
    </a-card>
    <!-- table -->
    <a-card>
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
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import HandlePigForm from './HandlePigForm'
  import AutoPigForm from '@/views/pig/addition/AutoPigForm'
  import { baseMixin } from '@/store/app-mixin'
  import { queryAllList } from '@/api/pig'

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '饲喂站号',
      dataIndex: 'stationId',
      key: 'stationId',
      scopedSlots: { customRender: 'stationId' },
      customRender: (text) => text.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
    },
    {
      title: '母猪号',
      dataIndex: 'pigId',
      key: 'pigId',
      scopedSlots: { customRender: 'pigId' }
    },
    {
      title: '母猪电子耳标',
      dataIndex: 'earId',
      key: 'earId',
      scopedSlots: { customRender: 'earId' }
    },
    {
      title: '与配公猪号',
      dataIndex: 'maleId',
      key: 'maleId',
      scopedSlots: { customRender: 'maleId' }
    },
    {
      title: '配种时间',
      dataIndex: 'breedTime',
      key: 'breedTime',
      scopedSlots: { customRender: 'breedTime' },
      customRender: text => text.replace(/^(.+)T(.+)$/, '$1 $2')
    },
    {
      title: '背膘厚/mm',
      dataIndex: 'backFat',
      key: 'backFat',
      scopedSlots: { customRender: 'backFat' }
    },
    {
      title: '胎龄',
      dataIndex: 'gestationalAge',
      key: 'gestationalAge',
      scopedSlots: { customRender: 'gestationalAge' }
    }
  ]
  export default {
    name: 'Addition',
    mixins: [baseMixin],
    components: {
      HandlePigForm,
      AutoPigForm,
      STable
    },
    data () {
      this.columns = columns
      return {
        // 切换tab
        additionTabList: [
          {
            key: '1',
            tab: '手动入栏'
          },
          {
            key: '2',
            tab: '自动入栏'
          }
        ],
        additionActiveTabKey: '1',

        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter)
          return queryAllList(requestParameters).then(res => {
            console.log(res)
            return res
          })
        }
      }
    },
    methods: {
      refresh () {
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style lang="less" scoped>
  .card {
    margin-bottom: 24px;
  }

  .popover-wrapper {
    /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }

  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;

    i {
      margin-right: 4px;
    }
  }

  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }

    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }

    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0, 0, 0, .45);
      font-size: 12px;
    }
  }
</style>
