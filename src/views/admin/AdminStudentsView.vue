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
                  active
                ></b-menu-item></router-link
              ><router-link to="/admin/teachers"
                ><b-menu-item icon="account-box-multiple-outline" label="教师管理"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="管理员信息"
              ><router-link to="/admin/personal"
                ><b-menu-item icon="account" label="个人资料"></b-menu-item
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

      <div style="margin-left: 100px; margin-top: 10px">
        <div style="display: flex; justify-content: space-between">
          <div style="font-size: large">
            共计
            <span style="color: #755dd3; font-weight: 700; font-size: larger">{{
              data.length
            }}</span>
            名学生
          </div>
          <div v-if="deleteMode"><b>已选择：</b> {{ checkedRows.length }}</div>
          <div class="buttons">
            <b-button
              type="is-primary"
              icon-left="account-plus-outline"
              outlined
              @click="isAddModalActive = true"
              v-if="!deleteMode"
              >添加学生</b-button
            >
            <b-button
              type="is-primary"
              icon-left="account-multiple-plus-outline"
              @click="isAddAllModalActive = true"
              v-if="!deleteMode"
              >批量添加</b-button
            >
            <b-button
              type="is-danger"
              icon-left="trash-can-outline"
              outlined
              @click="deleteMode = true"
              v-if="!deleteMode"
              >删除学生</b-button
            >
            <b-button
              icon-left="cancel"
              @click="
                checkedRows = [];
                deleteMode = false;
              "
              v-if="deleteMode"
              >返回</b-button
            >
            <b-button type="is-danger" icon-left="trash-can" @click="deleteAll" v-if="deleteMode"
              >删除选定项</b-button
            >
          </div>
        </div>
        <b-table
          :data="data"
          :checked-rows.sync="checkedRows"
          paginated
          per-page="50"
          :checkable="deleteMode"
          checkbox-position="right"
          checkbox-type="is-danger"
          narrowed
          striped
        >
          <b-table-column field="major" label="专业" searchable v-slot="props">
            {{ props.row.major }}</b-table-column
          >
          <b-table-column field="schoolClass" label="班级" searchable v-slot="props">
            {{ props.row.schoolClass }}</b-table-column
          >
          <b-table-column field="studentId" label="学号" numeric searchable v-slot="props">
            {{ props.row.studentId }}</b-table-column
          >
          <b-table-column field="name" label="姓名" searchable v-slot="props">
            {{ props.row.name }}</b-table-column
          >

          <b-table-column v-slot="props" label="编辑" v-if="!deleteMode"
            ><b-button
              class="button is-info is-light is-small"
              style="height: 24px"
              icon-right="pencil"
              @click="modifyClicked(props.row)"
          /></b-table-column>
        </b-table>
      </div>

      <b-loading :active.sync="isLoading" :can-cancel="false" position="static"></b-loading>
    </section>
    <b-modal v-model="isAddModalActive" has-modal-card trap-focus :destroy-on-hide="false">
      <form action="">
        <div class="modal-card" style="width: auto; text-align: left">
          <header class="modal-card-head">
            <p class="modal-card-title">学生注册</p>
          </header>
          <section class="modal-card-body">
            <b-field label="专业">
              <b-input v-model="student.major" maxlength="255" required> </b-input>
            </b-field>
            <b-field label="班级">
              <b-input v-model="student.schoolClass" maxlength="255" required> </b-input>
            </b-field>
            <b-field
              label="学号"
              :type="addField.studentId.type"
              :message="addField.studentId.message"
            >
              <b-input v-model="student.studentId" maxlength="255" required> </b-input
            ></b-field>
            <b-field label="姓名" :type="addField.name.type" :message="addField.name.message">
              <b-input v-model="student.name" maxlength="255" required> </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              style="display: block; margin: 0 auto"
              label="确认注册"
              type="is-primary"
              @click="registerstudent"
            />
          </footer>
        </div>
      </form>
    </b-modal>
    <b-modal v-model="isModifyModalActive" has-modal-card trap-focus>
      <form action="">
        <div class="modal-card" style="width: auto; text-align: left">
          <header class="modal-card-head">
            <p class="modal-card-title">更改学生信息</p>
          </header>
          <section class="modal-card-body">
            <b-field label="专业">
              <b-input v-model="studentToModify.major" maxlength="255" required> </b-input>
            </b-field>
            <b-field label="班级">
              <b-input v-model="studentToModify.schoolClass" maxlength="255" required> </b-input>
            </b-field>
            <b-field
              label="学号"
              :type="modifyField.studentId.type"
              :message="modifyField.studentId.message"
            >
              <b-input v-model="studentToModify.studentId" maxlength="255" required> </b-input
            ></b-field>
            <b-field label="姓名" :type="modifyField.name.type" :message="modifyField.name.message">
              <b-input v-model="studentToModify.name" maxlength="255" required> </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              style="display: block; margin: 0 auto"
              label="确认更改"
              type="is-primary"
              @click="modifySave"
            />
          </footer>
        </div>
      </form>
    </b-modal>
    <b-modal v-model="isAddAllModalActive" has-modal-card>
      <div class="modal-card" style="width: auto; text-align: left">
        <header class="modal-card-head">
          <p class="modal-card-title">学生批量注册</p>
        </header>
        <section class="modal-card-body">
          <section style="margin-bottom: 20px">
            请上传 CSV 文件<b>（UTF-8 编码）</b
            ><br />格式：「专业」「班级」「学号」「姓名」四列，顺序不限。<br />须有表头列。
          </section>
          <section>
            <b-field v-if="!addAllLoading" class="file">
              <b-upload v-model="file" expanded accept=".csv" @input="handleFileUpload">
                <a class="button is-primary is-fullwidth">
                  <b-icon icon="upload"></b-icon>
                  <span>点击上传（请注意检查字符编码）</span>
                </a>
              </b-upload>
            </b-field>
            <b-progress v-if="addAllLoading"></b-progress>
          </section>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: [],
      checkedRows: [],

      deleteMode: false,

      student: {},

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

      studentToModify: {},

      modifyField: {
        name: {
          type: null,
          message: null,
        },
        studentId: {
          type: null,
          message: null,
        },
      },

      isAddModalActive: false,
      isAddAllModalActive: false,
      isModifyModalActive: false,
      isLoading: false,
      addAllLoading: false,
      file: {},
    };
  },
  methods: {
    registerstudent() {
      this.addField = {
        name: {
          type: null,
          message: null,
        },
        studentId: {
          type: null,
          message: null,
        },
      };
      if (this.student.name === "") {
        this.addField.name.type = "is-danger";
        this.addField.name.message = "请填写此字段。";
      }
      if (this.student.studentId === "") {
        this.addField.studentId.type = "is-danger";
        this.addField.studentId.message = "请填写此字段。";
      }
      if (this.student.name === "" || this.student.studentId === "") return;
      this.isLoading = true;
      axios
        .post("/api/students", this.student)
        .then((result) => {
          this.isLoading = false;
          this.isAddModalActive = false;
          if (result.data.code === 1) {
            this.$buefy.notification.open({
              message: "学生已成功注册",
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
    deleteAll() {
      if (this.checkedRows.length === 0) return;
      this.$buefy.dialog.confirm({
        title: "删除学生",
        type: "is-danger",
        hasIcon: true,
        message:
          "确定要删除这 " +
          this.checkedRows.length +
          " 名学生吗？<br>这会将其从参加的考试中除名，并删除所有作答",
        onConfirm: () => {
          this.isLoading = true;
          let uidArray = this.checkedRows.map((obj) => obj.uid);
          console.log(uidArray);
          axios
            .delete("/api/students/" + uidArray)
            .then(() => {
              location.reload();
            })
            .catch((error) => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "服务器异常：" + error,
                type: "is-danger",
                position: "is-top",
              });
            });
        },
      });
    },
    async handleFileUpload() {
      this.$buefy.notification.open({
        message: "上传中…",
        position: "is-top",
      });
      this.isLoading = true;
      let reader = new FileReader();
      reader.onload = async () => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "文件已上传，正在添加学生…",
          position: "is-top",
        });
        this.addAllLoading = true;
        let fileContent = reader.result.replace(/\r\n/g, "\n").trim();
        let lines = fileContent.split("\n");
        let headers = lines.shift().split(",");
        const propertyMap = {
          专业: "major",
          班级: "schoolClass",
          学号: "studentId",
          姓名: "name",
        };
        let studentsToAdd = lines.map((line) => {
          let values = line.split(",");
          let student = {};
          headers.forEach((header, index) => {
            const propertyName = propertyMap[header];
            student[propertyName] = values[index];
          });
          return student;
        });
        console.log(studentsToAdd);
        await axios
          .post("/api/students/all", studentsToAdd)
          .then((result) => {
            this.isLoading = false;
            this.addAllLoading = false;
            this.isAddAllModalActive = false;
            this.$buefy.dialog.confirm({
              title: "添加完成",
              hasIcon: true,
              message: result.data.data,
              onConfirm: () => {
                location.reload();
              },
              onCancel: () => {
                location.reload();
              },
            });
          })
          .catch((error) => {
            this.isLoading = false;
            this.addAllLoading = false;
            this.$buefy.notification.open({
              message: "服务器异常：" + error,
              type: "is-danger",
              position: "is-top",
            });
          });
      };
      try {
        reader.readAsText(this.file);
      } catch (error) {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "请上传 .CSV 文件",
          type: "is-danger",
          position: "is-top",
        });
      }
    },
    modifyClicked(student) {
      this.studentToModify = Object.assign({}, student);
      this.isModifyModalActive = true;
    },
    modifySave() {
      this.isModifyModalActive = false;
      this.isLoading = true;
      axios
        .put("/api/students", this.studentToModify)
        .then(() => {
          this.$buefy.notification.open({
            message: "学生信息修改成功",
            type: "is-success",
          });
          location.reload();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "服务器异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
        });
    },
    logOut() {
      localStorage.removeItem("access-admin");
      this.$router.push("/admin/login");
    },
  },
  async mounted() {
    this.isLoading = true;
    await axios
      .get("/api/students")
      .then((response) => {
        this.isLoading = false;
        this.data = response.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "服务器异常：" + error,
          type: "is-danger",
          pauseOnHover: true,
        });
        return;
      });
  },
};
</script>
