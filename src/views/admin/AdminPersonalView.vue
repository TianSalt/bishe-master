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
            <b-menu-list label="管理员端"
              ><router-link to="/admin/students">
                <b-menu-item
                  icon="account-box-multiple"
                  label="学生管理"
                ></b-menu-item></router-link
              ><router-link to="/admin/teachers"
                ><b-menu-item icon="account-box-multiple-outline" label="教师管理"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="管理员信息"
              ><router-link to="/admin/personal"
                ><b-menu-item icon="account" label="个人资料" active></b-menu-item
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
      <div style="display: flex; flex: 1; align-items: center">
        <section style="width: 100%">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">用户名</p>
                <p class="title">{{ this.info.username }}</p>
              </div>
            </div>
          </nav>
          <div class="buttons" style="justify-content: center">
            <b-button type="is-info" outlined @click="isUsernameModalActive = true"
              >修改用户名</b-button
            >
            <b-button type="is-primary" outlined @click="isPasswordModalActive = true"
              >修改密码</b-button
            >
          </div>
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

      <b-modal v-model="isUsernameModalActive" has-modal-card trap-focus>
        <div class="modal-card" style="width: auto; text-align: left">
          <header class="modal-card-head">
            <p class="modal-card-title">修改用户名</p>
          </header>
          <section class="modal-card-body">
            <b-field :type="usernameField.type" :message="usernameField.message">
              <b-input type="username" v-model="newUsername" maxlength="255" required> </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              style="display: block; margin: 0 auto"
              label="确认修改"
              type="is-primary"
              @click="modifyUsername"
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
      newUsername: null,
      newPassword: null,
      isUsernameModalActive: false,
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
      usernameField: {
        type: null,
        message: null,
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
        .put("/api/admins", {
          uid: this.uid,
          username: this.info.username,
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
    async modifyUsername() {
      this.usernameField.type = null;
      this.usernameField.message = null;
      if (this.newUsername === "") {
        this.usernameField.type = "is-danger";
        this.usernameField.message = "请填写此字段。";
        return;
      }
      if (this.newUsername === this.info.username) {
        this.usernameField.type = "is-danger";
        this.usernameField.message = "与原用户名相同。";
        return;
      }
      this.isLoading = true;
      await axios
        .put("/api/admins", {
          uid: this.uid,
          username: this.newUsername,
          passwordHash: this.info.passwordHash,
        })
        .then(() => {
          this.$buefy.notification.open({
            message: "用户名修改成功",
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
      localStorage.removeItem("access-admin");
      this.$router.push("/admin/login");
    },
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-admin")).uid;
  },
  mounted() {
    axios
      .get("/api/admins/" + this.uid)
      .then((response) => {
        this.isLoading = false;
        this.info = response.data.data;
        this.newUsername = this.info.username;
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
