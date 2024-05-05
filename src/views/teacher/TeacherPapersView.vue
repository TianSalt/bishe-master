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
                ><b-menu-item
                  icon="google-classroom"
                  label="所有考试"
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

      <div
        style="
          margin-left: 30px;
          margin-right: 30px;
          margin-top: 10px;
          width: 100%;
        "
        v-if="mode === 'list'"
      >
        <div style="display: flex; justify-content: space-between">
          <div style="font-size: large">
            共计
            <span style="color: #755dd3; font-weight: 700; font-size: larger">{{
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
            field="title"
            sortable
            :searchable="true"
            width="600px"
            v-slot="props"
          >
            {{ props.row.title }}
          </b-table-column>
          <b-table-column
            label="状态"
            :centered="true"
            field="isPublished"
            width="5em"
            sortable
            v-slot="props"
          >
            <span :style="{ color: statusColor(props.row.isPublished) }">
              {{ statusText(props.row.isPublished) }}
            </span>
          </b-table-column>
          <b-table-column v-slot="props" label="操作" centered>
            <b-button
              class="button is-danger"
              outlined
              icon-left="trash-can-outline"
              style="height: 25.8px"
              v-if="props.row.isPublished !== true"
              @click="deleteExam(props.row)"
            >
            </b-button>
            <b-button
              class="button is-info"
              outlined
              icon-left="pencil"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === false"
              @click="editExam(props.row)"
            >
            </b-button>
            <b-button
              class="button is-info"
              outlined
              icon-left="magnify"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
            >
            </b-button>
            <b-button
              class="button is-primary"
              outlined
              icon-left="view-list-outline"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
            >
              成绩
            </b-button>
            <b-button
              class="button is-info"
              icon-left="account-group"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
              @click="setStudents(props.row.examId)"
            >
              考生
            </b-button>
            <b-button
              class="button is-success"
              icon-left="arrow-expand-up"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === false"
              @click="togglePublish(props.row, true)"
            >
              发布
            </b-button>
            <b-button
              class="button is-warning"
              icon-left="arrow-expand-down"
              style="margin-left: 10px; height: 25.8px"
              v-if="props.row.isPublished === true"
              @click="togglePublish(props.row, false)"
            >
              撤下
            </b-button>
            <b-modal v-model="studentModalActive" has-modal-card>
              <div class="modal-card" style="width: 1050px; height: 600px">
                <section class="modal-card-body">
                  <div style="display: flex; flex: 1; align-items: center">
                    <b-table
                      :data="allStudents"
                      :columns="studentColumns"
                      :checked-rows.sync="checkedRows"
                      paginated
                      sticky-header
                      height="400px"
                      per-page="50"
                      pagination-simple
                      checkable
                      checkbox-type="is-info"
                      checkbox-position="right"
                      narrowed
                      striped
                    >
                      <template #bottom-left>
                        <b>已选择：</b> {{ checkedRows.length }}
                      </template>
                    </b-table>
                    <b-button
                      icon-right="chevron-double-right"
                      type="is-info is-light"
                      rounded
                      style="margin: 20px; font-weight: 500"
                      @click="selectStudents"
                      >添加</b-button
                    >
                    <header
                      style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                      "
                    >
                      <header style="font-weight: 700; font-size: large">
                        {{ props.row.title }}
                      </header>
                      <div style="padding: 10px">
                        已选择
                        <span
                          style="
                            font-weight: 700;
                            font-size: large;
                            color: #007ce8;
                          "
                          >{{ studentsToChangeTo.length }} </span
                        >名考生
                      </div>
                      <!--
                        To update:
                        Use backend-sorting and backend-pagination props to let those tasks
                        to the backend, then manage it with page-change and sort events.
                        See: https://buefy.org/documentation/table#async-data
                      -->
                      <b-table
                        :data="studentsToChangeTo"
                        narrowed
                        sticky-header
                        sort-icon="menu-up"
                      >
                        <b-table-column
                          field="name"
                          label="姓名"
                          width="100px"
                          sortable
                          centered
                          v-slot="propsJ"
                        >
                          {{ propsJ.row.name }}
                        </b-table-column>
                        <b-table-column
                          field="studentId"
                          label="学号"
                          width="70px"
                          sortable
                          numeric
                          v-slot="propsJ"
                        >
                          {{ propsJ.row.studentId }}
                        </b-table-column>
                        <b-table-column label="移除" v-slot="{ index }">
                          <b-button
                            rounded
                            type="is-danger is-light is-small"
                            icon-left="close"
                            style="height: 25.8px"
                            @click="studentsToChangeTo.splice(index, 1)"
                          ></b-button>
                        </b-table-column>
                      </b-table>
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <b-button
                          type="is-info"
                          outlined
                          icon-left="checkbox-multiple-marked-outline"
                          :loading="buttonLoading"
                          size="is-medium"
                          @click="confirmStudents(props.row.examId)"
                        >
                          <div>更新名单</div></b-button
                        ><b-button
                          outlined
                          :disabled="buttonDisabled"
                          size="is-medium"
                          @click="studentModalActive = false"
                        >
                          <div>取消</div>
                        </b-button>
                      </div>
                    </header>
                  </div>
                </section>
              </div>
            </b-modal>
          </b-table-column>

          <b-table-column label="复制试题" :centered="true" v-slot="props">
            <b-button
              icon-left="content-copy"
              style="margin-left: 10px; height: 25.8px"
              @click="copyExam(props.row)"
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
          <b-input placeholder="标题" v-model="examToAdd.title"> </b-input>
          <b-input
            placeholder="序言"
            v-model="examToAdd.introduction"
            style="margin-top: 10px"
          >
          </b-input>
          <div style="display: flex; padding: 20px">
            <b-datetimepicker
              horizontal-time-picker
              placeholder="考试开始时间"
              v-model="examToAdd.startTime"
              :editable="true"
            ></b-datetimepicker>
            <b-icon icon="tilde" style="padding: 20px"></b-icon>
            <b-datetimepicker
              horizontal-time-picker
              placeholder="考试结束时间"
              :editable="true"
              v-model="examToAdd.endTime"
            ></b-datetimepicker>
          </div>
          <section>
            <b-table :data="questionsInExamToAdd">
              <b-table-column label="题号" centered v-slot="{ index }">
                <div style="font-size: larger">{{ index + 1 }}</div>
              </b-table-column>

              <b-table-column label="题型" centered v-slot="props">
                <span class="tag" :class="type(props.row.questionType)">
                  {{ ["单选", "多选", "填空"][props.row.questionType] }}
                </span>
              </b-table-column>

              <b-table-column label="预览" centered width="500" v-slot="props">
                {{ props.row.content | truncate(80) }}
              </b-table-column>

              <b-table-column
                :label="'分值（总分：' + addTotalScore + '）'"
                centered
                v-slot="props"
              >
                <b-numberinput
                  v-model="props.row.score"
                  controls-position="compact"
                  @input="
                    addTotalScore = questionsInExamToAdd.reduce(function (
                      acc,
                      current
                    ) {
                      return acc + current.score;
                    },
                    0)
                  "
                  min="0"
                ></b-numberinput>
              </b-table-column>

              <b-table-column v-slot="{ index }" label="删除" centered>
                <b-button
                  rounded
                  type="is-danger is-light"
                  icon-left="close"
                  @click="questionsInExamToAdd.splice(index, 1)"
                ></b-button>
              </b-table-column>
              <b-table-column v-slot="{ index }" label="移动" centered>
                <span
                  ><b-button
                    rounded
                    icon-left="chevron-double-up"
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
                    v-else
                  >
                  </b-button
                ></span>
                <span
                  ><b-button
                    rounded
                    icon-left="chevron-up"
                    v-if="index !== 0"
                    @click="swapQuestion(index, index - 1)"
                  >
                  </b-button>
                  <b-button
                    disabled
                    rounded
                    icon-left="chevron-up"
                    v-else
                  ></b-button
                ></span>
                <span
                  ><b-button
                    rounded
                    icon-left="chevron-down"
                    v-if="index !== questionsInExamToAdd.length - 1"
                    @click="swapQuestion(index, index + 1)"
                  >
                  </b-button
                  ><b-button
                    disabled
                    rounded
                    icon-left="chevron-down"
                    v-else
                  ></b-button
                ></span>
              </b-table-column>
              <template #empty>
                <div class="has-text-centered">点击➕从题库中选择题目</div>
              </template>
            </b-table>
            <b-button
              type="is-primary"
              icon-left="plus"
              rounded
              @click="
                addModalActive = true;
                if (questions.length === 0) loadQuestions();
              "
            ></b-button>
          </section>
          <b-modal v-model="addModalActive" has-modal-card>
            <div class="modal-card" style="width: auto">
              <section class="modal-card-body">
                <b-table
                  :data="questions"
                  paginated
                  :per-page="10"
                  :narrowed="true"
                >
                  <b-table-column
                    :searchable="true"
                    :numeric="true"
                    field="questionId"
                    label="题目 ID"
                    width="80"
                    sortable
                    v-slot="props"
                  >
                    <span class="questionId">
                      {{ props.row.questionId }}
                    </span>
                  </b-table-column>
                  <b-table-column
                    field="questionType"
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
                    field="content"
                    label="预览"
                    width="500"
                    v-slot="props"
                  >
                    {{ props.row.content | truncate(80) }}
                  </b-table-column>

                  <b-table-column label="选择此题" v-slot="props" centered>
                    <b-button
                      class="button is-success is-small"
                      icon-left="plus-thick"
                      rounded
                      @click="
                        let questionToAdd = props.row;
                        questionToAdd.score = 0;
                        questionsInExamToAdd.push(questionToAdd);
                        addModalActive = false;
                      "
                      style="margin-right: 10px; height: 25.8px"
                    >
                    </b-button>
                  </b-table-column>
                  <template #empty>
                    <div class="has-text-centered">
                      暂无题目，您可以前往「题库」贡献题目
                    </div>
                  </template>
                </b-table>
              </section>
            </div>
          </b-modal>
        </div>
        <b-button
          type="is-success"
          outlined
          icon-left="check-bold"
          style="margin-bottom: 30px"
          @click="addSave"
        >
          <strong>保存</strong>
        </b-button>
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
      questionsInExamToEdit: [],
      addTotalScore: 0,
      isLoading: false,
      buttonLoading: false,
      buttonDisabled: false,

      questionTypes: [0, 1, 2],

      examToAdd: {
        creator: this.uid,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
        isPublished: false,
      },

      addModalActive: false,

      studentModalActive: false,
      allStudents: [],
      initialUids: [],
      studentsToChangeTo: [],
      checkedRows: [],
      studentColumns: [
        {
          field: "major",
          label: "专业",
          width: "150",
          centered: true,
          searchable: true,
        },
        {
          field: "schoolClass",
          label: "班级",
          width: "100",
          centered: true,
          searchable: true,
        },
        {
          field: "studentId",
          label: "学号",
          width: "100",
          numeric: true,
          searchable: true,
        },
        {
          field: "name",
          label: "姓名",
          width: "100",
          centered: true,
          searchable: true,
        },
      ],
    };
  },
  filters: {
    truncate(value, length) {
      return value.length > length ? value.substr(0, length) + "..." : value;
    },
  },

  methods: {
    loadQuestions() {
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
            message: "网络异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
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
        hasIcon: true,
        message: "确定要返回吗？您所作出的更改将不会被保留！",
        type: "is-danger",
        onConfirm: () => {
          this.mode = "list";
        },
      });
    },
    addSave() {
      if (
        this.examToAdd.startTime &&
        this.examToAdd.endTime &&
        this.examToAdd.startTime > this.examToAdd.endTime
      ) {
        this.$buefy.dialog.alert({
          message: "考试结束时间早于开始时间",
          type: "is-danger",
        });
        return;
      } else if (
        this.examToAdd.startTime < new Date("1582-10-15T00:00:00") ||
        this.examToAdd.endTime < new Date("1582-10-15T00:00:00")
      ) {
        this.$buefy.dialog.alert({
          message: "暂不支持格里历之前的日期",
          type: "is-danger",
        });
        return;
      }
      this.examToAdd.creator = this.uid;
      if (this.examToAdd.title === "") this.examToAdd.title = "无标题";
      this.isLoading = true;
      axios
        .post("/api/exams", this.examToAdd) // returns examId
        .then((result) => {
          let examId = result.data.data;
          for (var i = 0; i < this.questionsInExamToAdd.length; i++) {
            axios.post("/api/exam-questions", {
              examId: examId,
              questionIndex: i,
              questionId: this.questionsInExamToAdd[i].questionId,
              score: this.questionsInExamToAdd[i].score,
            });
          }
          this.isLoading = false;
          this.examToAdd.examId = examId;
          this.data.unshift(this.examToAdd);
          this.mode = "list";
          this.addTotalScore = 0;
          this.examToAdd = {
            creator: this.uid,
            title: "",
            startTime: null,
            endTime: null,
            introduction: "",
            isPublished: false,
          };
          this.questionsInExamToAdd = [];
          this.$buefy.notification.open({
            message: "试卷已添加",
            type: "is-success",
            position: "is-bottom",
          });
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "试卷添加失败：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    editExam(row) {
      alert("该功能尚未开发" + row);
    },
    togglePublish(row, changeTo) {
      if (
        changeTo === true &&
        (row.startTime === null || row.endTime === null)
      ) {
        this.$buefy.dialog.alert({
          hasIcon: true,
          message: "设置了起止时间才能发布考试",
          type: "is-danger",
        });
        return;
      }
      this.isLoading = true;
      axios
        .put("/api/exams", { examId: row.examId, isPublished: changeTo })
        .then(() => {
          this.isLoading = false;
          row.isPublished = changeTo;
          this.$buefy.notification.open(
            changeTo
              ? {
                  message:
                    "试卷已公开<br>您可以在「所有考试」中查看所有公开的试卷",
                  type: "is-success",
                  position: "is-bottom",
                }
              : {
                  message: "已设置为非公开，考生名单及作答信息保留",
                  type: "is-warning",
                  position: "is-bottom",
                }
          );
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
          });
        });
    },
    deleteExam(row) {
      this.$buefy.dialog.confirm({
        title: "删除试卷",
        message:
          "确定要删除试卷<b>" + row.title + "</b>吗？这将删除所有考生的作答！",
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
                position: "is-bottom",
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
    copyExam(row) {
      let examToCopy = {
        creator: row.creator,
        isPublished: false,
        title: row.title,
        startTime: row.startTime,
        endTime: row.endTime,
        introduction: row.introduction,
      };
      this.isLoading = true;
      axios
        .get("/api/exam-questions", { params: { examId: row.examId } })
        .then((response) => {
          let examQuestionsToCopy = response.data.data;
          axios.post("/api/exams", examToCopy).then((result) => {
            let examId = result.data.data;
            for (let i of examQuestionsToCopy) {
              axios.post("/api/exam-questions", {
                examId: examId,
                questionIndex: i.questionIndex,
                questionId: i.questionId,
                score: i.score,
              });
            }
            this.isLoading = false;
            examToCopy.examId = examId;
            this.data.push(examToCopy);
            this.mode = "list";
            this.$buefy.notification.open({
              message: "试卷已复制",
              type: "is-success",
              position: "is-bottom",
            });
          });
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    loadAllStudents() {
      axios
        .get("/api/students")
        .then((response) => {
          this.allStudents = response.data.data;
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    loadStudentsOfExam(examId) {
      axios
        .get("/api/student-exams/" + examId)
        .then((response) => {
          this.studentsToChangeTo = response.data.data;
          this.initialUids = Array.from(this.studentsToChangeTo).map(
            (obj) => obj.uid
          );
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    setStudents(examId) {
      this.studentModalActive = true;
      this.isLoading = true;
      if (this.allStudents.length === 0) {
        this.loadAllStudents();
        this.loadStudentsOfExam(examId);
        this.isLoading = false;
      } else {
        this.loadStudentsOfExam(examId);
        this.isLoading = false;
      }
    },
    selectStudents() {
      for (let i of this.checkedRows) {
        let found = false;
        for (let j of this.studentsToChangeTo) {
          if (i.uid === j.uid) {
            found = true;
            break;
          }
        }
        if (!found) {
          this.studentsToChangeTo.push(i);
        }
      }
      this.checkedRows = [];
    },
    confirmStudents(examId) {
      this.$buefy.dialog.confirm({
        hasIcon: true,
        message:
          "确定更新考生名单吗？<br>如果移除了原有的考生，其作答将被删除！",
        type: "is-info",
        onConfirm: async () => {
          this.buttonLoading = true;
          this.buttonDisabled = true;
          let uidsToChangeTo = Array.from(this.studentsToChangeTo).map(
            (obj) => obj.uid
          );
          let asyncOperations = [];
          let success = true;
          for (let i of this.initialUids) {
            if (!success) break;
            if (uidsToChangeTo.indexOf(i) === -1) {
              asyncOperations.push(
                axios
                  .delete("/api/student-exams", {
                    params: { examId, studentUid: i },
                  })
                  .catch((error) => {
                    success = false;
                    this.buttonLoading = false;
                    this.buttonDisabled = false;
                    this.$buefy.notification.open({
                      message: "网络异常：" + error,
                      type: "is-danger",
                      pauseOnHover: true,
                    });
                  })
              );
            }
          }
          for (let i of uidsToChangeTo) {
            if (!success) break;
            if (this.initialUids.indexOf(i) === -1) {
              asyncOperations.push(
                axios
                  .post("/api/student-exams", { examId, studentUid: i })
                  .catch((error) => {
                    success = false;
                    this.buttonLoading = false;
                    this.buttonDisabled = false;
                    this.$buefy.notification.open({
                      message: "网络异常：" + error,
                      type: "is-danger",
                      pauseOnHover: true,
                    });
                  })
              );
            }
          }
          await Promise.all(asyncOperations);
          if (!success) return;
          this.studentModalActive = false;
          this.$buefy.notification.open({
            message: "考生名单更新成功！",
            type: "is-info",
            position: "is-bottom",
          });
          this.buttonLoading = false;
          this.buttonDisabled = false;
          this.initialUids = [];
          this.studentsToChangeTo = [];
          this.mode = "list";
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
            this.isLoading = false;
            this.data = result.data.data;
          })
          .catch((error) => {
            this.isLoading = false;
            this.$buefy.notification.open({
              message: "网络异常：" + error,
              type: "is-danger",
              pauseOnHover: true,
            });
          });
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
          pauseOnHover: true,
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
