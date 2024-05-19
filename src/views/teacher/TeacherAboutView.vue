<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>
      <section style="margin: 50px; width: 100%">
        <div class="content">
          <h2>毕业设计</h2>
          <div class="buttons" style="justify-content: center">
            <b-button icon-left="github" @click="goToFrontend"> 前端源码 </b-button
            ><b-button icon-left="github" @click="goToBackend"> 后端源码 </b-button>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import TeacherSidebarView from "../teacher/TeacherSidebarView.vue";
export default {
  components: {
    TeacherSidebarView,
  },
  methods: {
    goToBackend() {
      window.open("https://github.com/TianSalt/bishe-backend", "_blank");
    },
    goToFrontend() {
      window.open("https://github.com/TianSalt/bishe-master", "_blank");
    },
  },
  data() {
    return {
      uid: null,
    };
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
};
</script>
