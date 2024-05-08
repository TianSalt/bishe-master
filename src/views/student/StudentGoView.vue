<template>
  <div>
    <b-navbar fixed-top shadow style="height: 10vh">
      <template #start>
        <b-navbar-item>
          <img src="@/images/smalllogo.png" alt="上机考试" />
        </b-navbar-item>
        <b-navbar-item>
          <span style="color: #755dd3; font-size: larger">{{ myName }}</span
          >&nbsp;（{{ mySid }}）
        </b-navbar-item>
        <b-navbar-item>
          {{ clock }}
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item tag="div" v-if="!localDisabled">
          <b-button
            icon-left="content-save-outline"
            class="is-primary"
            @click="save"
            >保存答案</b-button
          >
        </b-navbar-item>
        <b-navbar-item tag="div" v-if="!localDisabled">
          <b-button
            icon-right="chevron-right"
            class="is-light"
            @click="saveExit()"
            >保存并返回</b-button
          >
        </b-navbar-item>
        <b-navbar-item tag="div" v-if="localDisabled">
          <b-button icon-right="chevron-right" class="is-light" @click="exit()"
            >返回</b-button
          >
        </b-navbar-item>
      </template>
    </b-navbar>
    <section style="margin-top: 100px; text-align: center">
      <h1 class="title">{{ exam.title }}</h1>
      <h2 class="subtitle">{{ exam.introduction }}</h2>
      <div>
        <span style="font-weight: 700">开始时间：</span
        >{{ exam.startTimeFormatted }}
      </div>
      <div>
        <span style="font-weight: 700">结束时间：</span
        >{{ exam.endTimeFormatted }}
      </div>
    </section>
    <section
      style="
        text-align: left;
        padding-left: 400px;
        padding-right: 300px;
        margin-bottom: 50px;
        font-size: 18px;
      "
    >
      <div v-for="(question, index) in questions" :key="index">
        <div v-if="question.questionType === 0">
          <div class="statement">
            {{ index + 1 }}.&nbsp;{{ question.splited[0] }}
          </div>
          <b-field
            v-for="(option, optionIndex) in question.splited.slice(1)"
            :key="optionIndex"
            ><b-radio
              :disabled="localDisabled"
              v-model="question.answer"
              :native-value="letters[optionIndex]"
              @input="questions = questions.slice()"
              >{{ letters[optionIndex] }}.&nbsp;{{ option }}</b-radio
            ></b-field
          >
        </div>
        <div v-else-if="question.questionType === 1">
          <div class="statement">
            {{ index + 1 }}.&nbsp;{{ question.splited[0] }}
          </div>
          <b-field
            v-for="(option, optionIndex) in question.splited.slice(1)"
            :key="optionIndex"
            ><b-checkbox
              :disabled="localDisabled"
              v-model="question.answer"
              :native-value="letters[optionIndex]"
              @input="questions = questions.slice()"
              >{{ letters[optionIndex] }}.&nbsp;{{ option }}</b-checkbox
            ></b-field
          >
        </div>
        <div v-else-if="question.questionType === 2">
          <div class="statement">
            <b-field>
              {{ index + 1 }}.&nbsp;{{ question.splited[0] }}
              <b-input
                style="
                  width: 150px;
                  display: inline-block;
                  vertical-align: middle;
                  margin-left: 10px;
                  margin-right: 10px;
                "
                :disabled="localDisabled"
                v-model="question.answer"
                @input="questions = questions.slice()"
              ></b-input>
              {{ question.splited[1] }}
            </b-field>
          </div>
        </div>
        <div v-else style="color: gray">由于暂不支持该题型，题目未显示</div>
      </div>
    </section>
    <div class="block" style="text-align: center; color: #755dd3">
      <b-button icon-left="arrow-expand-up" @click="scrollToTop"
        >回到顶部</b-button
      >
    </div>
    <b-loading :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["exam", "studentUid", "disabled"],
  data() {
    return {
      localDisabled: this.disabled,
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      questions: [],
      loadingQuestions: [],
      clock: "",
      interval: null,
      myName: "",
      mySid: "",

      isLoading: false,
    };
  },
  methods: {
    async save() {
      this.$buefy.notification.open({
        message: "正在保存",
        type: "is-info",
      });
      axios
        .put("/api/student-exams", {
          studentUid: this.studentUid,
          examId: this.exam.examId,
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "网络异常：" + error,
            type: "is-danger",
          });
        });
      let asyncOperations = [];
      for (let i = 0; i < this.questions.length; i++) {
        let answer = null;
        if (this.questions[i].answer) {
          if (this.questions[i].questionType === 0)
            answer = this.questions[i].answer;
          else if (this.questions[i].questionType === 1)
            answer = this.questions[i].answer.sort().join("");
          else if (this.questions[i].questionType === 2)
            answer = this.questions[i].answer.trim();
        }
        asyncOperations.push(
          axios.post("/api/student-exam-questions", {
            studentUid: this.studentUid,
            examId: this.exam.examId,
            questionIndex: i,
            answer,
          })
        );
      }
      await Promise.all(asyncOperations);
      this.isLoading = false;
      this.$buefy.notification.open({
        message: "已保存",
        type: "is-success",
      });
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动
      });
    },
    async saveExit() {
      await this.save();
      location.reload();
    },
    exit() {
      location.reload();
    },
  },
  async mounted() {
    this.isLoading = true;
    axios
      .get("/api/students/" + this.studentUid)
      .then((response) => {
        this.myName = response.data.data.name;
        this.mySid = response.data.data.studentId;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
        });
        return;
      });
    await axios
      .get("/api/exam-questions/no-answer-list", {
        params: { examId: this.exam.examId },
      })
      .then(async (response) => {
        let studentExamQuestions = [];
        this.loadingQuestions = response.data.data;
        await axios
          .get("/api/student-exam-questions", {
            params: { studentUid: this.studentUid, examId: this.exam.examId },
          })
          .then((result) => {
            studentExamQuestions = result.data.data;
          });
        for (let i = 0; i < this.loadingQuestions.length; i++) {
          let found = false;
          for (let j of studentExamQuestions) {
            if (j.questionIndex === i) {
              if (this.loadingQuestions[i].questionType !== 1)
                this.loadingQuestions[i].answer = j.answer ? j.answer : "";
              else {
                this.loadingQuestions[i].answer = j.answer
                  ? j.answer.split("")
                  : [];
              }
              found = true;
              break;
            }
          }
          if (!found) {
            if (this.loadingQuestions[i].questionType !== 1)
              this.loadingQuestions[i].answer = "";
            else {
              this.loadingQuestions[i].answer = [];
            }
          }
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
        });
        return;
      });
    for (let i of this.loadingQuestions) {
      if (i.questionType === 0 || i.questionType === 1) {
        i.splited = i.content.split("\n#");
      } else if (i.questionType === 2) {
        i.splited = i.content.split("#_");
      } else {
        i.splited = null;
      }
    }
    this.questions = this.loadingQuestions;
    this.isLoading = false;
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var minute = date.getMinutes();
      var s = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      s = s < 10 ? "0" + s : s;
      return y + " 年 " + m + " 月 " + d + " 日　" + h + ":" + minute + ":" + s;
    };
    this.clock = formatDateTime(new Date());
    this.interval = setInterval(() => {
      let clock = new Date();
      this.clock = formatDateTime(clock);
      if (clock > this.exam.endTime && !this.localDisabled) {
        clearInterval(this.interval);
        this.localDisabled = true;
        this.saveExit();
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style>
.statement {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
