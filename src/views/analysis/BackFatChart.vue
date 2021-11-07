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
      <div id="main"></div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  // import echarts from 'echarts'
  const echarts = require('echarts')
  export default {
    name: 'BackFatChart',
    data () {
      return {
        stationList: ['01-02-0005', '01-01-0001'],
        queryParam: {}
      }
    },
    mounted () {
      this.myEcharts()
    },
    methods: {
      generateData (a, b, c) {
          const data = []
          for (let i = -200; i <= 240; i += 0.1) {
              data.push([i, a * i * i + b * i + c])
          }
          return data
      },
      myEcharts () {
        const myChart = echarts.init(document.getElementById('main'))

        // 指定图表的配置项和数据
        const option = {
          animation: false,
          grid: {
              top: 40,
              left: 50,
              right: 80,
              bottom: 50
          },
          xAxis: {
              name: '背膘厚/mm',
              minorTick: {
                  show: true
              },
              min: 5,
              max: 7,
              minorSplitLine: {
                  show: true
              }
          },
          yAxis: {
              name: '采食量/g',
              min: 0,
              max: 6000,
              minorTick: {
                  show: true
              },
              minorSplitLine: {
                  show: true
              }
          },
          dataZoom: [{
              show: true,
              type: 'inside',
              filterMode: 'none',
              xAxisIndex: [0],
              startValue: 8,
              endValue: 12
          }, {
              show: true,
              type: 'inside',
              filterMode: 'none',
              yAxisIndex: [0],
              startValue: -20,
              endValue: 6000
          }],
          series: [
              {
                  type: 'line',
                  showSymbol: false,
                  clip: true,
                  data: this.generateData(100, 0, 20)
              }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      }
    }
  }
</script>

<style scoped>
  #main{
    width: 1500px;
    height:650px;
    margin: 0 auto;
  }
</style>
