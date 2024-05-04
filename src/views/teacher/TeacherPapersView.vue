<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <b-sidebar
        :fullheight="true"
        style="text-align: center; font-weight: 300"
        :can-cancel="false"
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
                  label="查看考试"
                ></b-menu-item></router-link
              ><router-link to="/teacher/papers"
                ><b-menu-item
                  active
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
                ><b-menu-item icon="account" :label="info.name"></b-menu-item
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

      <div style="padding-left: 280px"></div>

      <div style="margin: 30px; width: 100%" v-if="mode === 'list'">
        <div style="display: flex; justify-content: space-between">
          <div>
            共计
            <span style="color: #755dd3; font-weight: 800">{{
              data.length
            }}</span>
            份试卷
          </div>
          <b-button
            type="is-primary"
            icon-left="note-plus-outline"
            outlined
            @click="mode = 'add'"
            >添加试卷</b-button
          >
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
            label="标题"
            sortable
            :searchable="true"
            v-slot="props"
          >
            {{ props.row.title }}
          </b-table-column>
          <b-table-column label="状态" field="status" sortable v-slot="props">
            <span :style="{ color: statusColor(props.row.isPublished) }">
              {{ statusText(props.row.isPublished) }}
            </span>
          </b-table-column>
          <b-table-column v-slot="props">
            <b-button
              class="button is-danger is-light"
              icon-left="trash-can-outline"
              style="height: 25.8px"
              v-if="props.row.isPublished !== true"
              @click="deleteExam(props.row)"
            >
              删除
            </b-button>
            <b-button
              class="button is-info is-light"
              icon-left="pencil"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === false"
            >
              编辑
            </b-button>
            <b-button
              class="button is-info is-light"
              icon-left="magnify"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
            >
              查看
            </b-button>
            <b-button
              class="button is-primary is-light"
              icon-left="account-group"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
            >
              设置考生
            </b-button>
            <b-button
              class="button is-success is-light"
              icon-left="arrow-expand-up"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === false"
            >
              公开
            </b-button>
            <b-button
              class="button is-warning is-light"
              icon-left="arrow-expand-down"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
            >
              撤回
            </b-button>
          </b-table-column>

          <b-table-column v-slot="props">
            <b-button
              class="button is-link"
              icon-left="content-copy"
              style="margin-left: 10px; height: 25.8px"
              @click="console.log(props)"
            >
            </b-button>
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">无记录</div>
          </template>
        </b-table>
      </div>

      <div style="width: 100%" v-if="mode === 'add'">
        <div class="navbar-brand">
          <a class="navbar-item" @click="mode = 'list'">
            <b-icon icon="arrow-left" style="margin-right: 5px"> </b-icon>
            <p>返回</p>
          </a>
        </div>
        <div class="content" style="margin-left: 20px; margin-right: 20px">
          <b-input placeholder="标题" v-model="newExam.title"> </b-input>
          <b-input
            placeholder="序言"
            v-model="newExam.introduction"
            style="margin-top: 10px"
          >
          </b-input>
          <div style="display: flex; padding: 20px">
            <b-datetimepicker
              horizontal-time-picker
              placeholder="考试开始时间"
              v-model="newExam.startTime"
              :editable="true"
            ></b-datetimepicker>
            <b-icon icon="tilde" style="padding: 20px"></b-icon>
            <b-datetimepicker
              horizontal-time-picker
              placeholder="考试结束时间"
              :editable="true"
              v-model="newExam.endTime"
            ></b-datetimepicker>
          </div>
          <div style="display: flex; padding: 5px">
            共&nbsp;
            <span style="color: #755dd3; font-weight: 800">{{
              questionsInExamToAdd.length
            }}</span>
            &nbsp;题
          </div>
          <section>
            <b-table :data="questionsInExamToAdd">
              <b-table-column field="name" label="题号" v-slot="{ index }">
                {{ index + 1 }}
              </b-table-column>

              <b-table-column label="题型" v-slot="props">
                <span class="tag" :class="type(props.row.questionType)">
                  {{ ["单选", "多选", "填空"][props.row.questionType] }}
                </span>
              </b-table-column>

              <b-table-column label="预览" width="500" v-slot="props">
                {{ props.row.content | truncate(80) }}
              </b-table-column>

              <b-table-column label="分值" v-slot="props">
                <b-numberinput
                  v-model="props.row.score"
                  controls-position="compact"
                  size="is-small"
                ></b-numberinput>
              </b-table-column>

              <b-table-column v-slot="{ index }" label="操作">
                <b-button
                  rounded
                  type="is-danger is-light"
                  icon-left="close"
                  style="height: 25.8px; margin-right: 20px"
                  @click="questionsInExamToAdd.splice(index, 1)"
                ></b-button>
                <span
                  ><b-button
                    rounded
                    icon-left="chevron-double-up"
                    style="height: 25.8px"
                    v-if="index !== 0"
                    @click="
                      var questionToMoveTop = questionsInExamToAdd[index];
                      questionsInExamToAdd.splice(index, 1);
                      questionsInExamToAdd.unshift(questionToMoveTop);
                    "
                  >
                  </b-button
                  ><b-button
                    rounded
                    disabled
                    icon-left="chevron-double-up"
                    style="height: 25.8px"
                    v-else
                  >
                  </b-button
                ></span>
                <span
                  ><b-button
                    rounded
                    icon-left="chevron-up"
                    style="height: 25.8px"
                    v-if="index !== 0"
                    @click="swapQuestion(index, index - 1)"
                  >
                  </b-button>
                  <b-button
                    disabled
                    rounded
                    icon-left="chevron-up"
                    style="height: 25.8px"
                    v-else
                  ></b-button
                ></span>

                <span
                  ><b-button
                    rounded
                    icon-left="chevron-down"
                    style="height: 25.8px"
                    v-if="index !== questionsInExamToAdd.length - 1"
                    @click="swapQuestion(index, index + 1)"
                  >
                  </b-button
                  ><b-button
                    disabled
                    rounded
                    icon-left="chevron-down"
                    style="height: 25.8px"
                    v-else
                  ></b-button
                ></span>
              </b-table-column>
              <template #empty>
                <div class="has-text-centered">无记录</div>
              </template>
            </b-table>
            <b-button
              type="is-primary"
              icon-left="plus"
              rounded
              @click="
                addModalActive = true;
                loadAsyncData();
              "
            ></b-button>
          </section>
          <b-modal v-model="addModalActive" has-modal-card trap-focus>
            <div class="modal-card" style="width: auto; text-align: left">
              <section class="modal-card-body">
                <b-table
                  :data="questions"
                  paginated
                  :per-page="10"
                  :narrowed="true"
                >
                  <b-table-column
                    :searchable="true"
                    label="题型"
                    sortable
                    v-slot="props"
                  >
                    <span class="tag" :class="type(props.row.questionType)">
                      {{ ["单选", "多选", "填空"][props.row.questionType] }}
                    </span>
                  </b-table-column>

                  <b-table-column
                    :searchable="true"
                    label="预览"
                    width="500"
                    v-slot="props"
                  >
                    {{ props.row.content | truncate(80) }}
                  </b-table-column>

                  <b-table-column label="选择此题" v-slot="props">
                    <b-button
                      class="button is-success is-small"
                      icon-left="plus-thick"
                      rounded
                      @click="
                        questionsInExamToAdd.push(props.row);
                        // questionsInExamToAdd[
                        //   questionsInExamToAdd.length - 1
                        // ].score = 0;
                        // // questionsInExamToAdd = questionsInExamToAdd.slice();
                        addModalActive = false;
                      "
                      style="margin-right: 10px; height: 25.8px"
                    >
                    </b-button>
                  </b-table-column>
                  <template #empty>
                    <div class="has-text-centered">无记录</div>
                  </template>
                </b-table>
              </section>
            </div>
          </b-modal>
        </div>
        <b-button
          type="is-primary"
          icon-left="content-save"
          style="margin-bottom: 30px"
          @click="addSave"
        >
          <strong>保存</strong>
        </b-button>
      </div>

      <b-loading :active.sync="isLoading" :can-cancel="false"></b-loading>
    </section>
  </div>
</template>

<script>
import axios from "axios";
// import md5 from "js-md5";
export default {
  data() {
    return {
      uid: null,
      info: {},
      mode: "list",
      selectedType: 0,

      data: [],
      questions: [],
      questionsInExamToAdd: [],
      isLoading: false,

      questionTypes: [0, 1, 2],

      newExam: {
        creator: this.uid,
        isPublished: false,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
      },

      addModalActive: false,
    };
  },
  filters: {
    truncate(value, length) {
      return value.length > length ? value.substr(0, length) + "..." : value;
    },
  },

  methods: {
    loadAsyncData() {
      this.isLoading = true;
      axios
        .get("/api/questions")
        .then((result) => {
          this.questions = result.data.data;
          this.isLoading = false;
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
    logConsole() {
      for (let i of this.questionsInExamToAdd) {
        console.log(i.content);
      }
    },
    swapQuestion(x, y) {
      let t = Object.assign({}, this.questionsInExamToAdd[x]);
      this.questionsInExamToAdd[x] = Object.assign(
        {},
        this.questionsInExamToAdd[y]
      );
      this.questionsInExamToAdd[y] = Object.assign({}, t);
      this.questionsInExamToAdd = this.questionsInExamToAdd.slice();
    },
    backFromEdit() {
      this.$buefy.dialog.confirm({
        message: "确定要返回吗？您所作出的更改将不会被保留！",
        type: "is-danger",
        onConfirm: () => {
          this.mode = "list";
        },
      });
    },
    addSave() {
      var examToAdd = {
        creator: this.uid,
        title: this.newExam.title,
        startTime: this.newExam.startTime,
        endTime: this.newExam.endTime,
        introduction: this.newExam.introduction,
        isPublished: false,
      };
      console.log(examToAdd);
      this.isLoading = true;
      axios
        .post("/api/exams", examToAdd) // returns examId
        .then(async (result) => {
          let examId = result.data.data;
          for (var i = 0; i < this.questionsInExamToAdd.length; i++) {
            await axios.post("/api/exam-questions", {
              examId: examId,
              questionIndex: i,
              questionId: this.questionsInExamToAdd[i].questionId,
              score: this.questionsInExamToAdd[i].score,
            });
          }
          this.mode = "list";
          this.$buefy.notification.open({
            message: "试卷已保存",
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
          return;
        });
    },
    deleteExam(row) {
      this.$buefy.dialog.confirm({
        title: "删除试卷",
        message: "确定要删除试卷<b>" + row.title + "</b>吗？这将删除所有作答！",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          axios
            .delete("/api/exams/" + row.examId)
            .then(() => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "试卷已删除！",
                type: "is-link",
              });
              this.data.splice(this.data.indexOf(row), 1);
            })
            .catch((error) => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "服务器异常：" + error,
                type: "is-danger",
              });
            });
        },
      });
    },
    statusText(status) {
      switch (status) {
        case false:
          return "未公开";
        case true:
          return "已公开";
        default:
          return "异常";
      }
    },
    statusColor(status) {
      switch (status) {
        case false:
          return "#000000";
        case true:
          return "#755dd3";
        default:
          return "#f04668";
      }
    },
    logOut() {
      localStorage.removeItem("access-teacher");
      this.$router.push("/teacher/login");
    },
    type(value) {
      switch (value) {
        case 0:
          return "is-link is-light";
        case 1:
          return "is-info is-light";
        case 2:
          return "is-warning is-light";
        case 3:
          return "is-danger is-light";
        case 4:
          return "is-success is-light";
        case 5:
          return "is-primary is-light";
        default:
          break;
      }
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
        this.info = response.data.data;
        axios
          .get("/api/exams", { params: { creator: this.uid } })
          .then((result) => {
            this.data = result.data.data;
          });
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
