<template>
  <div style="width: 100%">
    <div class="navbar-brand">
      <a class="navbar-item" @click="backToList" style="margin: 10px">
        <b-icon icon="chevron-left" style="margin-right: 5px"> </b-icon>
        <p style="font-weight: 800">返回</p>
      </a>
    </div>
    <div class="content" style="margin-left: 20px; margin-right: 20px">
      <b-input placeholder="标题" v-model="localExam.title"> </b-input>
      <b-input
        placeholder="序言"
        v-model="localExam.introduction"
        style="margin-top: 10px"
      >
      </b-input>
      <div style="display: flex; padding: 20px">
        <b-datetimepicker
          horizontal-time-picker
          placeholder="考试开始时间"
          v-model="localExam.startTime"
          :editable="true"
        ></b-datetimepicker>
        <b-icon icon="tilde" style="padding: 20px"></b-icon>
        <b-datetimepicker
          horizontal-time-picker
          placeholder="考试结束时间"
          :editable="true"
          v-model="localExam.endTime"
        ></b-datetimepicker>
      </div>
      <section>
        <b-table :data="questionsInExam">
          <b-table-column label="题号" centered v-slot="{ index }">
            <div style="font-size: 24px">{{ index + 1 }}</div>
          </b-table-column>

          <b-table-column label="题型" centered v-slot="props">
            <span class="tag" :class="type(props.row.questionType)">
              {{ questionTypes[props.row.questionType] }}
            </span>
          </b-table-column>

          <b-table-column label="预览" centered width="500" v-slot="props">
            {{ props.row.content | truncate(80) }}
          </b-table-column>

          <b-table-column
            :label="'分值（总分：' + totalScore + '）'"
            centered
            v-slot="props"
          >
            <b-numberinput
              v-model="props.row.score"
              controls-position="compact"
              @input="
                totalScore = questionsInExam.reduce(function (acc, current) {
                  return acc + current.score;
                }, 0)
              "
              min="0"
            ></b-numberinput>
          </b-table-column>

          <b-table-column v-slot="{ index }" label="删除" centered>
            <b-button
              rounded
              type="is-danger is-light"
              icon-left="close"
              @click="
                questionsInExam.splice(index, 1);
                totalScore = questionsInExam.reduce(function (acc, current) {
                  return acc + current.score;
                }, 0);
              "
            ></b-button>
          </b-table-column>
          <b-table-column v-slot="{ index }" label="移动" centered>
            <span
              ><b-button
                rounded
                icon-left="chevron-double-up"
                v-if="index !== 0"
                @click="
                  var questionToMoveTop = questionsInExam[index];
                  questionsInExam.splice(index, 1);
                  questionsInExam.unshift(questionToMoveTop);
                "
              >
              </b-button
              ><b-button rounded disabled icon-left="chevron-double-up" v-else>
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
                v-if="index !== questionsInExam.length - 1"
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
            if (allQuestions.length === 0) loadQuestions();
          "
        ></b-button>
      </section>
      <b-modal v-model="addModalActive" has-modal-card>
        <div class="modal-card" style="width: auto">
          <section class="modal-card-body">
            <b-table
              :data="allQuestions"
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
                  {{ questionTypes[props.row.questionType] }}
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
                    let temp = Object.assign({}, props.row);
                    temp.score = 0;
                    questionsInExam.push(temp);
                    addModalActive = false;
                  "
                  style="margin-right: 10px; height: 24.0px"
                >
                </b-button>
              </b-table-column>
              <template #empty>
                <div v-if="!isLoading" class="has-text-centered">
                  题库中没有任何题目，请前往贡献题目
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
      @click="mode === 'add' ? addSave() : editSave()"
    >
      <strong>保存</strong>
    </b-button>
    <b-loading :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["mode", "exam"],
  data() {
    return {
      localExam: this.exam,
      questionTypes: ["单选", "多选", "填空"],
      allQuestions: [],
      questionsInExam: [],
      initialQuestionCount: 0,
      totalScore: 0,
      isLoading: false,
      addModalActive: false,
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
          this.allQuestions = result.data.data;
          this.isLoading = false;
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
    swapQuestion(x, y) {
      let t = Object.assign({}, this.questionsInExam[x]);
      this.questionsInExam[x] = Object.assign({}, this.questionsInExam[y]);
      this.questionsInExam[y] = Object.assign({}, t);
      this.questionsInExam = this.questionsInExam.slice();
    },
    backToList() {
      if (this.mode === "edit") {
        this.$buefy.dialog.confirm({
          hasIcon: true,
          message: "确定要返回吗？您所作出的更改将不会被保留！",
          type: "is-danger",
          onConfirm: () => {
            this.$emit("backToList");
          },
        });
      } else {
        this.$emit("backToList");
      }
    },
    addSave() {
      if (
        this.localExam.startTime &&
        this.localExam.endTime &&
        this.localExam.startTime > this.localExam.endTime
      ) {
        this.$buefy.dialog.alert({
          title: "您的考试出师未捷身先死",
          message: "考试结束时间早于开始时间",
          type: "is-danger",
        });
        return;
      } else if (
        this.localExam.startTime < new Date("1582-10-15T00:00:00") ||
        this.localExam.endTime < new Date("1582-10-15T00:00:00")
      ) {
        this.$buefy.dialog.alert({
          message: "暂不支持格里历之前的日期",
          type: "is-danger",
        });
        return;
      }
      if (this.localExam.title === "") this.localExam.title = "无标题";
      this.isLoading = true;
      axios
        .post("/api/exams", this.localExam) // returns examId
        .then(async (result) => {
          let examId = result.data.data;
          let asyncOperations = [];
          for (let i = 0; i < this.questionsInExam.length; i++) {
            asyncOperations.push(
              axios.post("/api/exam-questions", {
                examId,
                questionIndex: i,
                questionId: this.questionsInExam[i].questionId,
                score: this.questionsInExam[i].score,
              })
            );
          }
          this.$buefy.notification.open({
            message: "即将完成，请稍候…",
            type: "is-success",
            position: "is-bottom",
          });
          await Promise.all(asyncOperations);
          location.reload();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "服务器错误：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
        });
    },
    editSave() {
      if (
        this.localExam.startTime &&
        this.localExam.endTime &&
        this.localExam.startTime > this.localExam.endTime
      ) {
        this.$buefy.dialog.alert({
          title: "您的考试出师未捷身先死",
          message: "考试结束时间早于开始时间",
          type: "is-danger",
        });
        return;
      } else if (
        this.localExam.startTime < new Date("1582-10-15T00:00:00") ||
        this.localExam.endTime < new Date("1582-10-15T00:00:00")
      ) {
        this.$buefy.dialog.alert({
          message: "暂不支持格里历之前的日期",
          type: "is-danger",
        });
        return;
      }
      if (this.localExam.title === "") this.localExam.title = "无标题";
      this.isLoading = true;
      let asyncOperations = [];
      axios
        .put("/api/exams", this.localExam)
        .then(async () => {
          for (let i = 0; i < this.questionsInExam.length; i++) {
            if (i < this.initialQuestionCount) {
              asyncOperations.push(
                axios.put("/api/exam-questions", {
                  examId: this.localExam.examId,
                  questionIndex: i,
                  questionId: this.questionsInExam[i].questionId,
                  score: this.questionsInExam[i].score,
                })
              );
            } else {
              asyncOperations.push(
                axios.post("/api/exam-questions", {
                  examId: this.localExam.examId,
                  questionIndex: i,
                  questionId: this.questionsInExam[i].questionId,
                  score: this.questionsInExam[i].score,
                })
              );
            }
          }
          for (
            let i = this.questionsInExam.length;
            i < this.initialQuestionCount;
            i++
          ) {
            asyncOperations.push(
              axios.delete("/api/exam-questions", {
                params: { examId: this.localExam.examId, questionIndex: i },
              })
            );
          }
          this.$buefy.notification.open({
            message: "即将完成，请稍候…",
            type: "is-success",
            position: "is-bottom",
          });
          await Promise.all(asyncOperations);
          location.reload();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "服务器错误：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
        });
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
  mounted() {
    if (this.mode === "edit") {
      this.isLoading = true;
      axios
        .get("/api/exam-questions/list", {
          params: { examId: this.localExam.examId },
        })
        .then((result) => {
          this.isLoading = false;
          this.questionsInExam = result.data.data;
          this.initialQuestionCount = this.questionsInExam.length;
          this.totalScore = this.questionsInExam.reduce(function (
            acc,
            current
          ) {
            return acc + current.score;
          },
          0);
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "服务器异常：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
        });
    }
  },
};
</script>
