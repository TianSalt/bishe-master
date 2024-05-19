<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>

      <div
        style="margin-left: 30px; margin-right: 30px; margin-top: 10px; width: 100%"
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
          <b-button type="is-primary" icon-left="note-plus-outline" outlined @click="addExam"
            >新建试卷</b-button
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
            width="550px"
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
              style="height: 24px"
              v-if="props.row.isPublished !== true"
              @click="deleteExam(props.row)"
            >
            </b-button>
            <b-button
              class="button is-info"
              outlined
              icon-left="pencil"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === false"
              @click="editExam(props.row)"
            >
            </b-button>
            <b-button
              class="button is-info"
              outlined
              icon-left="magnify"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === true"
              @click="checkExam(props.row)"
            >
            </b-button>
            <b-button
              class="button is-primary"
              outlined
              icon-left="poll"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === true"
              @click="stat(props.row)"
            >
            </b-button>
            <b-button
              class="button is-info"
              icon-left="account-edit-outline"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === true"
              @click="setStudents(props.row)"
            >
              考生
            </b-button>
            <b-button
              class="button is-success"
              icon-left="eye"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === false"
              @click="togglePublish(props.row, true)"
            >
              发布
            </b-button>
            <b-button
              class="button is-warning"
              icon-left="eye-off"
              style="margin-left: 10px; height: 24px"
              v-if="props.row.isPublished === true"
              @click="togglePublish(props.row, false)"
            >
              撤下
            </b-button>
          </b-table-column>

          <b-table-column label="复制试题" :centered="true" v-slot="props">
            <b-button
              icon-left="content-copy"
              style="margin-left: 10px; height: 24px"
              @click="copyExam(props.row)"
            >
            </b-button>
          </b-table-column>

          <template #empty>
            <div v-if="!isLoading" class="has-text-centered">无记录</div>
          </template>
        </b-table>
      </div>

      <b-modal v-model="studentModalActive" has-modal-card @close="checkedRows = []">
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
                <template #bottom-left> <b>已选择：</b> {{ checkedRows.length }} </template>
              </b-table>
              <b-button
                icon-right="chevron-double-right"
                type="is-info is-light"
                rounded
                style="margin: 20px; font-weight: 500"
                @click="selectStudents"
                >添加</b-button
              >
              <header style="display: flex; flex-direction: column; justify-content: center">
                <header style="font-weight: 700; font-size: large">
                  {{ currentExam.title }}
                </header>
                <div style="padding: 10px">
                  已选择
                  <span style="font-weight: 700; font-size: large; color: #007ce8"
                    >{{ studentsToChangeTo.length }} </span
                  >名考生
                </div>
                <b-table :data="studentsToChangeTo" narrowed sticky-header sort-icon="menu-up">
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
                      style="height: 24px"
                      @click="studentsToChangeTo.splice(index, 1)"
                    ></b-button>
                  </b-table-column>
                  <template #empty>
                    <div class="has-text-centered">从左侧学生名单中选取考生</div>
                  </template>
                </b-table>
                <div style="display: flex; justify-content: space-between">
                  <b-button
                    type="is-info"
                    outlined
                    icon-left="checkbox-multiple-marked-outline"
                    :loading="buttonLoading"
                    size="is-medium"
                    @click="confirmStudents(currentExam.examId)"
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

      <b-modal v-model="statModalActive" has-modal-card>
        <header class="modal-card-head">
          <p class="modal-card-title">成绩单</p>
          <b-button type="is-primary" icon-left="download" @click="exportCSV()">下载 CSV</b-button>
        </header>
        <div class="modal-card" style="width: auto">
          <section class="modal-card-body">
            <b-table :data="studentsToStat" paginated sticky-header per-page="50" narrowed striped>
              <b-table-column centered v-slot="{ index }">
                <div style="font-weight: 700">{{ index + 1 }}</div>
              </b-table-column>
              <b-table-column
                field="major"
                label="专业"
                width="150"
                centered
                searchable
                sortable
                v-slot="props"
              >
                {{ props.row.major }}
              </b-table-column>

              <b-table-column
                field="schoolClass"
                label="班级"
                width="100"
                searchable
                sortable
                centered
                v-slot="props"
              >
                {{ props.row.schoolClass }}
              </b-table-column>

              <b-table-column
                field="studentId"
                label="学号"
                width="100"
                searchable
                sortable
                numeric
                v-slot="props"
              >
                {{ props.row.studentId }}
              </b-table-column>

              <b-table-column
                field="name"
                label="姓名"
                width="100"
                centered
                searchable
                sortable
                v-slot="props"
              >
                {{ props.row.name }}
              </b-table-column>

              <b-table-column
                field="score"
                :label="totalScore"
                numeric
                searchable
                sortable
                v-slot="props"
              >
                {{ props.row.score }}
              </b-table-column>
              <template #empty>
                <div v-if="!isLoading" class="has-text-centered">考生名单为空</div>
              </template>
            </b-table>
            <b-loading :is-full-page="false" v-model="isStatLoading"></b-loading>
          </section>
        </div>
      </b-modal>

      <teacher-papers-modify-view
        v-if="mode === 'add'"
        :mode="mode"
        :exam="examToAdd"
        @backToList="mode = 'list'"
      ></teacher-papers-modify-view>

      <teacher-papers-modify-view
        v-if="mode === 'edit'"
        :mode="mode"
        :exam="examToEdit"
        @backToList="mode = 'list'"
      ></teacher-papers-modify-view>

      <teacher-papers-check-view
        v-if="mode === 'check'"
        :exam="examToCheck"
        @backToList="mode = 'list'"
      ></teacher-papers-check-view>

      <b-loading :active.sync="isLoading"></b-loading>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import TeacherSidebarView from "../teacher/TeacherSidebarView.vue";
import TeacherPapersModifyView from "../teacher/TeacherPapersModifyView.vue";
import TeacherPapersCheckView from "../teacher/TeacherPapersCheckView.vue";
export default {
  components: {
    TeacherSidebarView,
    TeacherPapersModifyView,
    TeacherPapersCheckView,
  },
  data() {
    return {
      uid: null,
      mode: "list",
      selectedType: 0,

      data: [],
      isLoading: false,
      isStatLoading: false,
      buttonLoading: false,
      buttonDisabled: false,
      currentExam: {
        creator: null,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
        isPublished: false,
      },

      examToEdit: {
        creator: null,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
        isPublished: false,
      },

      examToAdd: {
        creator: null,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
        isPublished: false,
      },

      examToCheck: null,

      studentModalActive: false,
      statModalActive: false,
      allStudents: [],
      initialUids: [],
      studentsToChangeTo: [],
      checkedRows: [],
      studentsToStat: [],
      totalScore: "得分（满分：）",
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
      timeDiff: new Date().getTimezoneOffset() * 60000,
    };
  },
  methods: {
    stat(row) {
      this.studentsToStat = [];
      this.totalScore = "得分（满分：）";
      let students = [];
      this.statModalActive = true;
      this.isStatLoading = true;
      axios
        .get("/api/exam-questions/list", { params: { examId: row.examId } })
        .then((list) => {
          this.totalScore =
            "得分（满分：" +
            list.data.data.reduce(function (acc, current) {
              return acc + current.score;
            }, 0) +
            "）";
          axios.get("/api/student-exams/" + row.examId).then(async (response) => {
            students = response.data.data;
            for (let i of students) {
              await axios
                .get("/api/student-exams", {
                  params: { studentUid: i.uid, examId: row.examId },
                })
                .then(async (presenceRes) => {
                  let presence = presenceRes.data.data[0].presence;
                  if (!presence) i.score = "缺席";
                  else
                    await axios
                      .get("/api/student-exam-questions/sum-score", {
                        params: { studentUid: i.uid, examId: row.examId },
                      })
                      .then((result) => {
                        i.score = result.data.data ? result.data.data : 0;
                      });
                });
            }
            this.isStatLoading = false;
            this.studentsToStat = students;
          });
        })
        .catch((error) => {
          this.isStatLoading = false;
          this.$buefy.notification.open({
            message: "服务器异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    addExam() {
      this.mode = "add";
    },
    editExam(row) {
      this.mode = "edit";
      this.examToEdit = row;
    },
    checkExam(row) {
      var formatDateTime = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var minute = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        minute = minute < 10 ? "0" + minute : minute;
        return y + "-" + m + "-" + d + "　" + h + ":" + minute;
      };
      row.startTimeFormatted = formatDateTime(row.startTime);
      row.endTimeFormatted = formatDateTime(row.endTime);
      this.examToCheck = row;
      this.mode = "check";
    },
    togglePublish(row, changeTo) {
      if (changeTo === true && (row.startTime === null || row.endTime === null)) {
        this.$buefy.dialog.alert({
          hasIcon: true,
          message: "设置了起止时间才能发布考试",
          type: "is-danger",
        });
        return;
      }
      this.isLoading = true;
      row.isPublished = changeTo;
      axios
        .put("/api/exams", row)
        .then(() => {
          this.isLoading = false;
          this.$buefy.dialog.alert(
            changeTo
              ? {
                  title: "试卷已公开",
                  message: "您可以在「所有考试」中查看所有公开的试卷",
                  type: "is-success",
                }
              : {
                  title: "已设置为非公开",
                  message:
                    "考生名单及作答信息保留；更改题目分值后，考生需要再次提交答案才能更新成绩",
                  type: "is-warning",
                }
          );
        })
        .catch((error) => {
          this.isLoading = false;
          row.isPublished = !row.isPublished;
          this.$buefy.notification.open({
            message: "服务器异常：" + error,
            type: "is-danger",
          });
        });
    },
    deleteExam(row) {
      this.$buefy.dialog.confirm({
        title: "删除试卷",
        message:
          "确定要删除试卷<span style='font-weight: 600'>" +
          row.title +
          "</span>吗？<br>这将删除所有考生的作答！",
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
                position: "is-top",
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
            this.data.unshift(examToCopy);
            this.mode = "list";
            this.$buefy.notification.open({
              message: "试卷已复制",
              type: "is-success",
              position: "is-top",
            });
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
    async loadAllStudents() {
      await axios
        .get("/api/students")
        .then((response) => {
          this.allStudents = response.data.data;
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
    async loadStudentsOfExam(examId) {
      await axios
        .get("/api/student-exams/" + examId)
        .then((response) => {
          this.studentsToChangeTo = response.data.data;
          this.initialUids = Array.from(this.studentsToChangeTo).map((obj) => obj.uid);
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
    async setStudents(exam) {
      this.isLoading = true;
      this.currentExam = exam;
      this.studentModalActive = true;
      await this.loadStudentsOfExam(exam.examId);
      if (this.allStudents.length === 0) await this.loadAllStudents();
      this.isLoading = false;
    },
    selectStudents() {
      let addedStudents = [];
      for (let i of this.checkedRows) {
        let found = false;
        for (let j of this.studentsToChangeTo) {
          if (i.uid === j.uid) {
            found = true;
            break;
          }
        }
        if (!found) {
          addedStudents.push(i);
        }
      }
      this.studentsToChangeTo = addedStudents.concat(this.studentsToChangeTo);
      this.checkedRows = [];
    },
    confirmStudents(examId) {
      this.$buefy.dialog.confirm({
        title: "更新考生名单",
        hasIcon: true,
        message: "确定更新考生名单吗？<br>如果移除了原有的考生，其作答将被删除！",
        type: "is-warning",
        onConfirm: async () => {
          this.buttonLoading = true;
          this.buttonDisabled = true;
          let uidsToChangeTo = Array.from(this.studentsToChangeTo).map((obj) => obj.uid);
          let asyncOperations = [];
          let success = true;
          for (let i of this.initialUids) {
            if (!success) break;
            if (!uidsToChangeTo.includes(i)) {
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
                      message: "服务器异常：" + error,
                      type: "is-danger",
                      pauseOnHover: true,
                    });
                  })
              );
            }
          }
          for (let i of uidsToChangeTo) {
            if (!success) break;
            if (!this.initialUids.includes(i)) {
              asyncOperations.push(
                axios.post("/api/student-exams", { examId, studentUid: i }).catch((error) => {
                  success = false;
                  this.buttonLoading = false;
                  this.buttonDisabled = false;
                  this.$buefy.notification.open({
                    message: "服务器异常：" + error,
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
            position: "is-top",
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
    exportCSV() {
      const selectedColumns = ["major", "schoolClass", "studentId", "name", "score"];
      const csvContent =
        "data:text/csv;charset=utf-8," +
        selectedColumns.map(this.renameColumn).join(",") +
        "\n" +
        this.studentsToStat
          .map((student) => selectedColumns.map((col) => student[col]).join(","))
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "成绩单.csv");
      document.body.appendChild(link);
      link.click();
    },
    renameColumn(key) {
      switch (key) {
        case "major":
          return "专业";
        case "schoolClass":
          return "班级";
        case "studentId":
          return "学号";
        case "name":
          return "姓名";
        case "score":
          return "得分";
        default:
          return key;
      }
    },
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
    this.examToAdd.creator = this.uid;
    this.examToEdit.creator = this.uid;
  },
  mounted() {
    axios
      .get("/api/exams", { params: { creator: this.uid } })
      .then((result) => {
        this.isLoading = false;
        for (let i of result.data.data) {
          if (i.startTime) i.startTime = new Date(new Date(i.startTime).getTime() - this.timeDiff);
          if (i.endTime) i.endTime = new Date(new Date(i.endTime) - this.timeDiff);
          this.data.push(i);
        }
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
};
</script>
