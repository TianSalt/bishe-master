<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <b-sidebar
        :fullheight="true"
        style="text-align: center; font-weight: 400"
        :can-cancel="false"
        position="static"
        open
      >
        <div class="p-1">
          <div class="block">
            <img src="@/images/logo.png" alt="上机考试" />
          </div>
          <b-menu>
            <b-menu-list label="教师端"
              ><router-link to="/teacher/exams"
                ><b-menu-item
                  icon="google-classroom"
                  label="所有考试"
                ></b-menu-item></router-link
              ><router-link to="/teacher/papers"
                ><b-menu-item
                  icon="note-multiple-outline"
                  label="我的试卷"
                ></b-menu-item
              ></router-link>
              <router-link to="/teacher/questions"
                ><b-menu-item label="题库" icon="bookshelf"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="个人信息"
              ><router-link to="/teacher/personal"
                ><b-menu-item
                  active
                  icon="account"
                  :label="info.name"
                ></b-menu-item
              ></router-link>
              <b-menu-item
                icon="logout"
                label="退出"
                @click="logOut"
              ></b-menu-item>
            </b-menu-list>
            <b-menu-list label="大学生上机考试系统"
              ><router-link to="/admin/about"
                ><b-menu-item
                  icon="information-outline"
                  label="关于"
                ></b-menu-item
              ></router-link>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>

      

      <nav class="level" style="margin: 50px; width: 100%">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">工号</p>
            <p class="title">{{ this.info.employeeId }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">姓名</p>
            <p class="title">{{ this.info.name }}</p>
          </div>
        </div>
      </nav>

      <b-loading :active.sync="isLoading" :can-cancel="false"
        position="static"></b-loading>
    </section>
  </div>
</template>

<script>
import axios from "axios";
// import md5 from "js-md5";
export default {
  data() {
    return {
      info: {},
      isLoading: false,
      uid: null,
    };
  },
  methods: {
    logOut() {
      localStorage.removeItem("access-teacher");
      this.$router.push("/teacher/login");
    },
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
  mounted() {
    axios
      .get("/api/teachers/" + this.uid)
      .then((response) => {
        this.isLoading = false;
        this.info = response.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
        });
      });
  },
};
</script>

<style>
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}
.sidebar-page .sidebar-layout {
  display: flex;
  flex-direction: row;
  min-height: 100%;
}
</style>
