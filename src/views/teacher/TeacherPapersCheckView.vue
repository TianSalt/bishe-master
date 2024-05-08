<template>
  <div>
    <div class="navbar-brand">
      <a class="navbar-item" @click="backToList" style="margin: 10px">
        <b-icon icon="chevron-left" style="margin-right: 5px"> </b-icon>
        <p style="font-weight: 800">退出预览</p>
      </a>
    </div>

    <section style="text-align: center">
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
        padding-left: 300px;
        padding-right: 200px;
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
  props: ["exam"],
  data() {
    return {
      localDisabled: false,
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      questions: [],
      loadingQuestions: [],
      clock: "",
      interval: null,

      isLoading: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动
      });
    },
    backToList() {
      this.$emit("backToList");
    },
  },
  async mounted() {
    this.isLoading = true;
    await axios
      .get("/api/exam-questions/no-answer-list", {
        params: { examId: this.exam.examId },
      })
      .then(async (response) => {
        this.loadingQuestions = response.data.data;
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
      if (i.questionType === 0) {
        i.splited = i.content.split("\n#");
        i.answer = "";
      } else if (i.questionType === 1) {
        i.splited = i.content.split("\n#");
        i.answer = [];
      } else if (i.questionType === 2) {
        i.splited = i.content.split("#_");
        i.answer = "";
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
