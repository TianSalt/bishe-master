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
                ><b-menu-item
                  active
                  icon="account-box-multiple-outline"
                  label="教师管理"
                ></b-menu-item
              ></router-link>
              <router-link to="/admin/questions"
                ><b-menu-item label="题库" icon="bookshelf"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="管理员信息"
              ><router-link to="/admin/personal"
                ><b-menu-item icon="account" label="个人资料"></b-menu-item
              ></router-link>
              <b-menu-item icon="logout" label="退出"></b-menu-item>
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

      <div style="padding-left: 300px"></div>

      <div style="margin: 10px">
        <div style="display: flex; justify-content: space-between">
          <div style="font-size: large">
            共计
            <span style="color: #755dd3; font-weight: 700; font-size: larger">{{
              data.length
            }}</span>
            名教师
          </div>
          <b-button
            type="is-primary"
            icon-left="account-plus"
            outlined
            @click="isAddModalActive = true"
            >添加教师</b-button
          >
          <b-modal
            v-model="isAddModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            close-button-aria-label="Close"
            aria-modal
          >
            <form action="">
              <div class="modal-card" style="width: auto; text-align: left">
                <header class="modal-card-head">
                  <p class="modal-card-title">教师注册</p>
                </header>
                <section class="modal-card-body">
                  <b-field
                    label="姓名"
                    :type="addField.name.type"
                    :message="addField.name.message"
                  >
                    <b-input v-model="teacher.name" maxlength="255" required>
                    </b-input>
                  </b-field>
                  <b-field
                    label="工号"
                    :type="addField.employeeId.type"
                    :message="addField.employeeId.message"
                  >
                    <b-input
                      v-model="teacher.employeeId"
                      maxlength="255"
                      required
                    >
                    </b-input>
                  </b-field>

                  <b-field
                    label="密码"
                    :type="addField.password.type"
                    :message="addField.password.message"
                  >
                    <b-input
                      type="password"
                      v-model="teacher.passwordHash"
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
                    label="确认注册"
                    type="is-primary"
                    @click="registerTeacher"
                  />
                </footer>
              </div>
            </form>
          </b-modal>
        </div>
        <b-table
          class="table is-striped"
          :data="data"
          :paginated="true"
          :per-page="10"
          :pagination-rounded="true"
          :sort-icon-size="null"
        >
          <b-table-column
            field="employeeId"
            label="工号"
            :numeric="true"
            :searchable="true"
            sortable
            v-slot="props"
          >
            {{ props.row.employeeId }}
          </b-table-column>

          <b-table-column
            field="name"
            label="姓名"
            :searchable="true"
            sortable
            centered
            v-slot="props"
          >
            {{ props.row.name }}
          </b-table-column>
          <b-table-column v-slot="props">
            <b-button
              class="button is-info is-light is-small"
              style="height: 25.8px"
              icon-right="pencil"
              @click="modifyClicked(props.row)"
            />
            <b-modal
              v-model="isModifyModalActive"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-label="Example Modal"
              close-button-aria-label="Close"
              aria-modal
            >
              <form action="">
                <div class="modal-card" style="width: auto; text-align: left">
                  <header class="modal-card-head">
                    <p class="modal-card-title">更改教师信息</p>
                  </header>
                  <section class="modal-card-body">
                    <b-field
                      label="姓名"
                      :type="modifyField.name.type"
                      :message="modifyField.name.message"
                    >
                      <b-input
                        v-model="teacherModify.name"
                        maxlength="255"
                        required
                      >
                      </b-input>
                    </b-field>
                    <b-field
                      label="工号"
                      :type="modifyField.employeeId.type"
                      :message="modifyField.employeeId.message"
                    >
                      <b-input
                        v-model="teacherModify.employeeId"
                        maxlength="255"
                        required
                      >
                      </b-input>
                    </b-field>
                    <b-field
                      label="密码（留空则不变）"
                      :type="modifyField.password.type"
                      :message="modifyField.password.message"
                    >
                      <b-input
                        type="password"
                        v-model="teacherModify.passwordHash"
                        maxlength="255"
                        password-reveal
                      >
                      </b-input>
                    </b-field>
                  </section>
                  <footer class="modal-card-foot">
                    <b-button
                      style="display: block; margin: 0 auto"
                      label="确认更改"
                      type="is-primary"
                      @click="modifyConfirmed(currentRow)"
                    />
                  </footer>
                </div>
              </form>
            </b-modal>
          </b-table-column>

          <b-table-column v-slot="props">
            <b-button
              class="button is-danger is-light is-small"
              style="height: 25.8px"
              icon-right="trash-can-outline"
              @click="deleteRow(props.row)"
            />
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">无记录</div>
          </template>
        </b-table>
      </div>

      <b-loading
        :active.sync="isLoading"
        :can-cancel="false"
        position="static"
      ></b-loading>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
export default {
  data() {
    return {
      data: [],

      currentRow: null,

      teacher: {
        uid: "",
        name: "",
        employeeId: "",
        passwordHash: "",
      },

      teacherModify: {
        uid: "",
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

      modifyField: {
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

      isAddModalActive: false,
      isModifyModalActive: false,
      isLoading: false,
    };
  },
  methods: {
    modifyClicked(row) {
      this.currentRow = row;
      this.isModifyModalActive = true;
      this.teacherModify = {
        uid: row.uid,
        name: row.name,
        employeeId: row.employeeId,
        passwordHash: "",
      };
      this.modifyField = {
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
    modifyConfirmed(row) {
      if (this.teacherModify.name === "") {
        this.modifyField.name.type = "is-danger";
        this.modifyField.name.message = "请填写此字段。";
      }
      if (this.teacherModify.employeeId === "") {
        this.modifyField.employeeId.type = "is-danger";
        this.modifyField.employeeId.message = "请填写此字段。";
      }
      if (md5(this.teacherModify.passwordHash) === row.passwordHash) {
        this.modifyField.password.type = "is-danger";
        this.modifyField.password.message = "新密码不能与原密码相同。";
      }
      if (
        this.teacherModify.name === "" ||
        this.teacherModify.employeeId === "" ||
        md5(this.teacherModify.passwordHash) === row.passwordHash
      )
        return;

      let teacherHashed = Object.assign({}, this.teacherModify);
      if (this.teacherModify.passwordHash !== "")
        teacherHashed.passwordHash = md5(teacherHashed.passwordHash);
      else teacherHashed.passwordHash = row.passwordHash;
      this.isLoading = true;
      axios
        .put("/api/teachers", teacherHashed)
        .then((result) => {
          this.isModifyModalActive = false;
          this.isLoading = false;
          if (result.data.code === 1) {
            this.$buefy.notification.open({
              message: "教师信息修改成功",
              type: "is-success",
            });
            location.reload();
          } else {
            this.$buefy.notification.open({
              message: result.data.msg,
              type: "is-danger",
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "修改失败：" + error,
            type: "is-danger",
          });
        });
    },
    registerTeacher() {
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
        .then((result) => {
          this.isLoading = false;
          this.isAddModalActive = false;
          if (result.data.code === 1) {
            this.$buefy.notification.open({
              message: "教师已成功注册",
              type: "is-success",
            });
            location.reload();
          } else {
            this.$buefy.notification.open({
              message: result.data.msg,
              type: "is-danger",
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "注册失败：" + error,
            type: "is-danger",
          });
        });
    },
    deleteRow(row) {
      this.$buefy.dialog.confirm({
        title: "注销",
        message:
          "确定要注销教师<b> " +
          row.name +
          "</b>（工号：" +
          row.employeeId +
          "）的账号吗？这将删除其创建的所有试卷、考试及向题库贡献的所有题目！",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          axios
            .delete("/api/teachers/" + row.uid)
            .then(() => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "教师已删除！",
                type: "is-link",
              });
              this.data.splice(this.data.indexOf(row), 1);
            })
            .catch((error) => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "网络异常：" + error,
                type: "is-danger",
              });
            });
        },
      });
    },
    openModal() {
      this.isComponentModalActive = true;
    },
    submitForm() {
      this.isComponentModalActive = false;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$buefy.toast.open({
          duration: 5000,
          message: "该教师信息更改完成",
          position: "is-top",
          type: "is-success",
        });
      }, 3000);
    },
  },
  mounted() {
    this.isLoading = true;
    axios
      .get("/api/teachers")
      .then((result) => {
        this.isLoading = false;
        this.data = result.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
        });
      });
    this.isLoading = false;
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
