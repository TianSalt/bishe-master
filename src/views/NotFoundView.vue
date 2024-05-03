<template>
  <section class="hero is-medium is-info">
    <div class="hero-body">
      <div class="">
        <p class="title">喵呜～您所访问的页面不存在</p>
        <p class="subtitle">大学生上机考试系统</p>
        <button class="button" @click="back">返回上一页</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      window.history.back();
    },
  },
};
</script>
