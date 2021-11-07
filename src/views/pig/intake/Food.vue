<template>
  <a-modal
    title="离栏"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="饲喂站号">
          <a-input v-decorator="['stationId', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="母猪号">
          <a-input v-decorator="['pigId', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="电子耳标">
          <a-input v-decorator="['earId', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="默认饲喂量">
          <a-input v-decorator="['indexQuantity', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="推荐饲喂量">
          <a-input v-decorator="['algoQuantity', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="设置饲喂量">
          <a-input v-decorator="['setQuantity', { initialValue: 0 }]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'

  // 表单字段
  const fields = ['stationId', 'pigId', 'earId', 'indexQuantity', 'algoQuantity', 'setQuantity']
  export default {
    name: 'food',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => null
      }
    },
    data () {
      this.formLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
      return {
        form: this.$form.createForm(this)
      }
    },
    created () {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    },
    methods: {}
  }
</script>

<style scoped>

</style>
