<template>
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
              icon="table-chair"
              :active="
                this.$route.path === '/teacher/exams' ||
                this.$route.path === '/teacher/' ||
                this.$route.path === '/teacher'
              "
              label="所有考试"
            ></b-menu-item></router-link
          ><router-link to="/teacher/papers"
            ><b-menu-item
              :active="this.$route.path === '/teacher/papers'"
              icon="note-multiple-outline"
              label="我的试卷"
            ></b-menu-item
          ></router-link>
          <router-link to="/teacher/questions"
            ><b-menu-item
              label="题库"
              icon="bookshelf"
              :active="this.$route.path === '/teacher/questions'"
            ></b-menu-item
          ></router-link>
        </b-menu-list>
        <b-menu-list label="个人信息"
          ><router-link to="/teacher/personal"
            ><b-menu-item
              icon="account"
              :label="myName"
              :active="this.$route.path === '/teacher/personal'"
            ></b-menu-item
          ></router-link>
          <b-menu-item icon="logout" label="退出" @click="logOut"></b-menu-item>
        </b-menu-list>
        <b-menu-list label="大学生上机考试系统"
          ><router-link to="/teacher/about"
            ><b-menu-item
              icon="information-outline"
              label="关于"
              :active="this.$route.path === '/teacher/about'"
            ></b-menu-item
          ></router-link>
        </b-menu-list>
      </b-menu>
    </div>
  </b-sidebar>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      myName: "",
    };
  },
  props: ["uid"],
  methods: {
    logOut() {
      localStorage.removeItem("access-teacher");
      this.$buefy.notification.open({
        message: "您已退出登录",
        type: "is-info",
        position: "is-top",
      });
      this.$router.push("/teacher/login");
    },
  },
  mounted() {
    axios
      .get("/api/teachers/" + this.uid)
      .then((response) => {
        this.myName = response.data.data.name;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "服务器异常：" + error,
          type: "is-danger",
        });
        return;
      });
  },
};
</script>
