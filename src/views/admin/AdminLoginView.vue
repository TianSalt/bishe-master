<template>
  <section class="login-register-section">
    <div class="login-register-container">
      <h2 class="login-register-title">管理员登录</h2>

      <b-field
        label="用户名"
        :type="addField.username.type"
        :message="addField.username.message"
      >
        <b-input v-model="admin.username"></b-input>
      </b-field>

      <b-field
        label="密码"
        :type="addField.password.type"
        :message="addField.password.message"
      >
        <b-input
          type="password"
          v-model="admin.passwordHash"
          password-reveal
        ></b-input>
      </b-field>

      <b-button @click="login" type="is-primary">登录</b-button>
    </div>
    <b-loading :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
export default {
  data() {
    return {
      admin: {
        username: "",
        passwordHash: "",
      },

      addField: {
        username: {
          type: null,
          message: null,
        },
        password: {
          type: null,
          message: null,
        },
      },
      isLoading: false,
    };
  },
  methods: {
    login() {
      // Implement your login logic here
      let adminHashed = Object.assign({}, this.admin);
      adminHashed.passwordHash = md5(adminHashed.passwordHash);
      this.isLoading = true;
      axios
        .post("/api/admin-login", {
          item1: adminHashed.username,
          item2: adminHashed.passwordHash,
        })
        .then((response) => {
          this.isLoading = false;
          let result = response.data;
          if (result.code === 1) {
            localStorage.setItem("access-admin", JSON.stringify(result.data));
            this.$buefy.notification.open({
              message: "登录成功",
              type: "is-success",
              position: "is-top",
            });
            this.$router.replace({ path: "/admin" });
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
            message: "服务器异常：" + error,
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
