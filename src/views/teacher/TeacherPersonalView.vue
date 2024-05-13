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
                ><b-menu-item icon="google-classroom" label="所有考试"></b-menu-item></router-link
              ><router-link to="/teacher/papers"
                ><b-menu-item icon="note-multiple-outline" label="我的试卷"></b-menu-item
              ></router-link>
              <router-link to="/teacher/questions"
                ><b-menu-item label="题库" icon="bookshelf"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="个人信息"
              ><router-link to="/teacher/personal"
                ><b-menu-item active icon="account" :label="info.name"></b-menu-item
              ></router-link>
              <b-menu-item icon="logout" label="退出" @click="logOut"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="大学生上机考试系统"
              ><router-link to="/admin/about"
                ><b-menu-item icon="information-outline" label="关于"></b-menu-item
              ></router-link>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>

      <section style="width: 100%">
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
        <div class="block">如个人信息有误，请联系系统管理员修改</div>
        <b-button type="is-primary" outlined @click="isAddModalActive = true">修改密码</b-button>
      </section>

      <b-modal v-model="isAddModalActive" has-modal-card trap-focus>
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
export default {
  data() {
    return {
      info: {},
      isLoading: false,
      uid: null,
      originalPassword: null,
      newPassword: null,
      isAddModalActive: false,
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
