<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    @change="handleChange"
  >
    <p class="ant-upload-drag-icon">
      <a-icon type="inbox"/>
    </p>
    <p class="ant-upload-text" style="font-size: 50px;">
      点击或拖动文件到此区域以上传
    </p>
    <p class="ant-upload-hint" style="font-size: 30px;">
      支持单次上传,
    </p>
    <p class="ant-upload-hint" style="font-size: 30px;">
      仅支持excel文件
    </p>
  </a-upload-dragger>
</template>

<script>
  export default {
    name: 'AutoPigForm',
    data () {
      return {}
    },
    methods: {
      handleChange (info) {
        const status = info.file.status
        if (status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`)
        }
      }
    }
  }
</script>

<style scoped>

</style>
