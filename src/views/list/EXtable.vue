<template>
  <page-header-wrapper>
    <a-card>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
      </s-table>
    </a-card>
  <!--  <s-table-->
  <!--    ref="table"-->
  <!--    size="default"-->
  <!--    :rowKey="(record) => record.data.id"-->
  <!--    :columns="columns"-->
  <!--    :data="loadData"-->
  <!--    :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
  <!--  >-->
  <!--  </s-table>-->
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'

  export default {
    name: 'EXtable',
    components: {
      STable
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    data () {
      return {
        columns: [
          {
            title: '规则编号',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          },
          {
            title: '状态',
            dataIndex: 'status',
            needTotal: true
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true
          }
        ],
        // 查询条件参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log('parameter1', parameter)
          console.log('queryParam', this.queryParam)
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            console.log(res)
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>

<style scoped>

</style>
