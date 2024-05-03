<template>
  <section class="login-register-section">
    <div class="login-register-container">
      <h2 class="login-register-title" v-if="mode === 'login'">教师登录</h2>
      <h2 class="login-register-title" v-else>教师注册</h2>

      <!-- 只在注册模式下显示姓名输入字段 -->
      <b-field
        label="姓名"
        :type="addField.name.type"
        :message="addField.name.message"
        v-if="mode === 'register'"
      >
        <b-input v-model="teacher.name" maxlength="255"></b-input>
      </b-field>

      <b-field
        label="工号"
        :type="addField.employeeId.type"
        :message="addField.employeeId.message"
      >
        <b-input
          v-model="teacher.employeeId"
          :maxlength="mode === 'login' ? null : 255"
        ></b-input>
      </b-field>

      <b-field
        label="密码"
        :type="addField.password.type"
        :message="addField.password.message"
      >
        <b-input
          type="password"
          v-model="teacher.passwordHash"
          :maxlength="mode === 'login' ? null : 255"
          password-reveal
        ></b-input>
      </b-field>

      <b-button
        @click="mode === 'login' ? login() : register()"
        :type="mode === 'login' ? 'is-primary' : 'is-success'"
        >{{ mode === "login" ? "登录" : "注册" }}</b-button
      >

      <p class="mode-switch" @click="toggleMode">
        {{ mode === "login" ? "新教师注册" : "已有账号？登录" }}
      </p>
    </div>
    <b-loading :active.sync="isLoading" :can-cancel="false"></b-loading>
  </section>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
export default {
  data() {
    return {
      mode: "login",
      teacher: {
        name: "",
        employeeId: "",
        passwordHash: "",
      },

      addField: {
        name: {
          type: null,
          message: null,
        },
        employeeId: {
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
      let teacherHashed = Object.assign({}, this.teacher);
      teacherHashed.passwordHash = md5(teacherHashed.passwordHash);
      this.isLoading = true;
      axios
        .post("/api/teacher-login", {
          item1: teacherHashed.employeeId,
          item2: teacherHashed.passwordHash,
        })
        .then((response) => {
          this.isLoading = false;
          let result = response.data;
          if (result.code === 1) {
            localStorage.setItem("access-teacher", JSON.stringify(result.data));
            this.$router.replace({ path: "/teacher" });
          } else {
            this.$buefy.notification.open({
              message: result.msg,
              type: "is-danger",
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网路异常：" + error,
            type: "is-danger",
          });
        });
    },
    register() {
      // Implement your registration logic here
      if (this.teacher.name === "") {
        this.addField.name.type = "is-danger";
        this.addField.name.message = "请填写此字段。";
      }
      if (this.teacher.employeeId === "") {
        this.addField.employeeId.type = "is-danger";
        this.addField.employeeId.message = "请填写此字段。";
      }
      if (this.teacher.passwordHash === "") {
        this.addField.password.type = "is-danger";
        this.addField.password.message = "请填写此字段。";
      }
      if (
        this.teacher.name === "" ||
        this.teacher.employeeId === "" ||
        this.teacher.passwordHash === ""
      )
        return;
      let teacherHashed = Object.assign({}, this.teacher);
      teacherHashed.passwordHash = md5(teacherHashed.passwordHash);
      this.isLoading = true;
      axios
        .post("/api/teachers", teacherHashed)
        .then(() => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "注册成功！",
            type: "is-success",
          });
          this.toggleMode();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "注册失败：" + error,
            type: "is-danger",
          });
        });
    },
    toggleMode() {
      this.mode = this.mode === "login" ? "register" : "login";
      this.teacher = {
        name: "",
        employeeId: "",
        passwordHash: "",
      };
      this.addField = {
        name: {
          type: null,
          message: null,
        },
        employeeId: {
          type: null,
          message: null,
        },
        password: {
          type: null,
          message: null,
        },
      };
    },
  },
};
</script>

<!-- ... 其他样式 ... -->

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
