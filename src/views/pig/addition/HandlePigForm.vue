<template>
  <a-form :form="form" class="form" ref="handleAddition">
    <a-row class="form-row" :gutter="16" type="flex" align="bottom">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="饲喂站号">
          <a-select
            placeholder="请选择饲喂站号"
            v-decorator="[
              'stationId',
              {rules: [{ required: true, message: '请选择饲喂站号'}]}
            ]">
            <a-select-option v-for="(s, index) in stationList" :key="index" :value="s">
              {{ s }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="母猪号">
          <a-input
            placeholder="请输入母猪号"
            v-decorator="[
              'pigId',
              {rules: [{ required: true, message: '请输入母猪号', whitespace: true}]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="母猪电子耳标">
          <a-input
            placeholder="请输入母猪电子耳标"
            v-decorator="[
              'earId',
              {rules: [{ required: true, message: '请输入母猪电子耳标'}]}
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16" type="flex" align="bottom">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="与配公猪号">
          <a-input
            placeholder="请输入与配公猪号"
            v-decorator="[
              'maleId',
              {rules: [{ required: true, message: '请输入与配公猪号'}]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="配种时间">
          <a-date-picker
            show-time
            style="width: 100%"
            placeholder="请选择配种时间"
            format="YYYY-MM-DD HH:mm"
            v-decorator="[
              'breedTime',
              {rules: [{ required: true, message: '请选择配种时间'}]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="背膘厚">
          <a-input
            placeholder="请输入背膘厚"
            v-decorator="[
              'backFat',
              // {rules: [{ required: false, message: '请输入背膘厚'}]}
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16" type="flex" align="bottom">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="胎龄">
          <a-input
            placeholder="请输入胎龄"
            v-decorator="[
              'gestationalAge',
              {rules: [{ required: true, message: '请输入胎龄'}]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 9}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item>
          <a-button type="primary" @click="validate" :loading="loading">入栏</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import moment from 'moment'
  import { getBuildUnitStationList } from '@/api/station'
  import { additionOnePig } from '@/api/pig'
  import { formatZero } from '@/utils/util'

  export default {
    name: 'HandlePigForm',
    data () {
      return {
        loading: false,
        form: this.$form.createForm(this),
        stationList: []
      }
    },
    created () {
      getBuildUnitStationList().then(res => {
        // console.log(res)
        this.stationList = res.map(item => item.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3')
        )
      })
    },
    methods: {
      // 最终全页面提交
      validate () {
        const additionPigForm = new Promise((resolve, reject) => {
          this.form.validateFields((err, values) => {
            if (err) {
              reject(err)
              return
            }
            resolve(values)
          })
        })
        additionPigForm.then(values => {
          values.breedTime = moment(values.breedTime).format('YYYY-MM-DD HH:mm')
          values.stationId = values.stationId.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$1$2$3')
          values.pigId = formatZero(values.pigId, 15)
          values.earId = formatZero(values.earId, 8)
          values.maleId = formatZero(values.maleId, 15)
          console.log('values', values)
          additionOnePig(values).then(res => {
            if (res.code === 1) {
              this.$message.success('入栏成功！')
              this.form.resetFields()
              this.$emit('handleRefresh')
            } else if (res.code === 0) {
              this.$message.error(res.message)
            }
          }).catch(() => {
            this.$message.error('入栏失败，请检查输入数据')
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
