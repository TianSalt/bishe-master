<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>
      <div style="display: flex; flex: 1; align-items: center">
        <section style="width: 100%">
          <nav class="level">
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
          <div class="block">如个人信息有误，请联系系统管理员修改</div>
          <b-button type="is-primary" outlined @click="isPasswordModalActive = true"
            >修改密码</b-button
          >
        </section>
      </div>

      <b-modal v-model="isPasswordModalActive" has-modal-card trap-focus>
        <div class="modal-card" style="width: auto; text-align: left">
          <header class="modal-card-head">
            <p class="modal-card-title">修改密码</p>
          </header>
          <section class="modal-card-body">
            <b-field
              label="原密码"
              :type="passwordField.originalPassword.type"
              :message="passwordField.originalPassword.message"
            >
              <b-input
                type="password"
                v-model="originalPassword"
                maxlength="255"
                password-reveal
                required
              >
              </b-input>
            </b-field>
            <b-field
              label="新密码"
              :type="passwordField.newPassword.type"
              :message="passwordField.newPassword.message"
            >
              <b-input
                type="password"
                v-model="newPassword"
                maxlength="255"
                password-reveal
                required
              >
              </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              style="display: block; margin: 0 auto"
              label="确认修改"
              type="is-primary"
              @click="modifyPassword"
            />
          </footer>
        </div>
      </b-modal>

      <b-loading :active.sync="isLoading" :can-cancel="false" position="static"></b-loading>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
import TeacherSidebarView from "../teacher/TeacherSidebarView.vue";
export default {
  components: {
    TeacherSidebarView,
  },
  data() {
    return {
      info: {},
      isLoading: false,
      uid: null,
      originalPassword: null,
      newPassword: null,
      isPasswordModalActive: false,
      passwordField: {
        originalPassword: {
          type: null,
          message: null,
        },
        newPassword: {
          type: null,
          message: null,
        },
      },
    };
  },
  methods: {
    async modifyPassword() {
      this.passwordField = {
        originalPassword: {
          type: null,
          message: null,
        },
        newPassword: {
          type: null,
          message: null,
        },
      };
      let ok = true;
      if (this.originalPassword === "") {
        this.passwordField.originalPassword.type = "is-danger";
        this.passwordField.originalPassword.message = "请填写此字段。";
        ok = false;
      }
      if (this.newPassword === "") {
        this.passwordField.newPassword.type = "is-danger";
        this.passwordField.newPassword.message = "请填写此字段。";
        ok = false;
      }
      if (!ok) return;
      if (md5(this.originalPassword) !== this.info.passwordHash) {
        this.passwordField.originalPassword.type = "is-danger";
        this.passwordField.originalPassword.message = "密码错误。";
        return;
      }
      if (md5(this.newPassword) === this.info.passwordHash) {
        this.passwordField.newPassword.type = "is-danger";
        this.passwordField.newPassword.message = "新密码不能与原密码相同。";
        return;
      }
      this.isLoading = true;
      await axios
        .put("/api/teachers", {
          uid: this.uid,
          name: this.info.name,
          employeeId: this.info.employeeId,
          passwordHash: md5(this.newPassword),
        })
        .then(() => {
          this.$buefy.notification.open({
            message: "密码修改成功",
            type: "is-success",
          });
          location.reload();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "服务器异常：" + error,
            type: "is-danger",
          });
        });
    },
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
          message: "服务器异常：" + error,
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
