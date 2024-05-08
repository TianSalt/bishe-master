<template>
  <section class="login-register-section">
    <div class="login-register-container">
      <h2 class="login-register-title">学生登录</h2>

      <b-field
        label="学号"
        :type="addField.studentId.type"
        :message="addField.studentId.message"
      >
        <b-input v-model="student.studentId"></b-input>
      </b-field>
      <b-field
        label="姓名"
        :type="addField.name.type"
        :message="addField.name.message"
      >
        <b-input v-model="student.name"></b-input>
      </b-field>
      <b-button @click="login()" type="is-primary">登录</b-button>
    </div>
    <b-loading :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      student: {
        name: "",
        studentId: "",
      },

      addField: {
        name: {
          type: null,
          message: null,
        },
        studentId: {
          type: null,
          message: null,
        },
      },
      isLoading: false,
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      axios
        .post("/api/student-login", {
          item1: this.student.studentId,
          item2: this.student.name,
        })
        .then((response) => {
          this.isLoading = false;
          let result = response.data;
          if (result.code === 1) {
            localStorage.setItem("access-student", JSON.stringify(result.data));
            this.$buefy.notification.open({
              message: "登录成功",
              type: "is-success",
              position: "is-top",
            });
            this.$router.replace({ path: "/student" });
          } else {
            this.$buefy.notification.open({
              message: result.msg,
              type: "is-danger",
              position: "is-top",
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
          });
        });
    },
  },
};
</script>

<style scoped>
.login-register-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-register-container {
  width: 300px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-register-title {
  margin-bottom: 20px;
  text-align: center;
}

.mode-switch {
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  color: #3273dc;
}

.b-field:not(:last-child) {
  margin-bottom: 20px;
}
</style>
