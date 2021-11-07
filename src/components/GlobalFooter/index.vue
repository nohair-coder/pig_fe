<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://github.com/nohair-coder" target="_blank">@nohair-coder</a>
    </template>
    <template v-slot:copyright>
      <a href="http://www.hzau.edu.cn/" target="_blank">华中农业大学</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
