<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>

      <div
        style="margin-left: 24px; margin-right: 24px; margin-top: 10px; width: 100%"
        v-if="mode === 'list'"
      >
        <div style="display: flex; justify-content: space-between">
          <div style="font-size: large">
            共计
            <span style="color: #755dd3; font-weight: 700; font-size: larger">{{
              data.length
            }}</span>
            题
          </div>
          <b-button
            type="is-primary"
            icon-left="text-box-plus-outline"
            outlined
            @click="mode = 'add'"
            >贡献题目</b-button
          >
        </div>
        <section>
          <b-table :data="data" paginated per-page="20" page-input>
            <b-table-column
              :searchable="true"
              :numeric="true"
              width="100"
              field="questionId"
              label="题目 ID"
              sortable
              v-slot="props"
            >
              {{ props.row.questionId }}
            </b-table-column>

            <b-table-column
              field="questionType"
              label="题型"
              width="100"
              centered
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
            <b-table-column
              :searchable="true"
              field="creatorName"
              label="贡献者"
              width="100"
              sortable
              centered
              v-slot="props"
            >
              {{ props.row.creatorName }}
            </b-table-column>
            <b-table-column label="操作" centered v-slot="props">
              <b-button
                class="button is-info is-light"
                icon-left="magnify"
                style="height: 24px"
                @click="checkQuestion(props.row)"
              >
              </b-button
              ><b-button
                class="button is-info is-light"
                icon-left="pencil"
                style="margin-left: 10px; height: 24px"
                @click="
                  editedQuestion = props.row;
                  mode = 'edit';
                "
                v-if="props.row.creator === uid"
              >
              </b-button>
              <b-button
                icon-left="content-copy"
                style="margin-left: 10px; height: 24px"
                @click="copyQuestion(props.row)"
              >
              </b-button
              ><b-button
                class="button is-danger is-light"
                icon-left="trash-can-outline"
                style="margin-left: 10px; height: 24px"
                v-if="props.row.creator === uid"
                @click="deleteQuestion(props.row)"
              >
              </b-button>
            </b-table-column>
            <template #empty>
              <div v-if="!isLoading" class="has-text-centered">
                题库空空如也，请点击右上角「贡献题目」
              </div>
            </template>
          </b-table>
        </section>
      </div>

      <div style="width: 100%" v-if="mode === 'add' || mode === 'edit'">
        <nav class="navbar" style="background-color: transparent">
          <div class="navbar-brand">
            <a class="navbar-item" @click="backToList">
              <b-icon icon="chevron-left" style="margin-right: 5px"> </b-icon>
              <p>返回</p>
            </a>
          </div>

          <div class="navbar-menu">
            <div class="navbar-item">
              <b-dropdown append-to-body aria-role="menu" scrollable max-height="200" trap-focus>
                <template #trigger>
                  <a class="navbar-item" role="button">
                    <span>{{
                      questionTypes[(mode === "add" ? newQuestion : editedQuestion).questionType]
                    }}</span>
                    <b-icon icon="menu-down"></b-icon>
                  </a>
                </template>

                <b-dropdown-item custom aria-role="listitem"> </b-dropdown-item>

                <b-dropdown-item v-for="item of [0, 1, 2]" :key="item" aria-role="listitem">
                  <div @click="(mode === 'add' ? newQuestion : editedQuestion).questionType = item">
                    {{ questionTypes[item] }}
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </nav>
        <div style="margin-left: 50px; margin-right: 20px">
          <div class="content" style="text-align: left">
            <div class="content" style="text-align: left">
              <div
                v-if="
                  (mode === 'add' ? newQuestion : editedQuestion).questionType === 0 ||
                  (mode === 'add' ? newQuestion : editedQuestion).questionType === 1
                "
              >
                <span style="color: #755dd3; font-weight: 800">格式：</span>
                <pre>
题干
#选项A内容
#选项B内容
...（至多 26 项）</pre
                >
              </div>
              <div v-else-if="(mode === 'add' ? newQuestion : editedQuestion).questionType === 2">
                <span style="color: #755dd3; font-weight: 800">格式：</span><br />使用
                <code>#_</code> 表示空的位置。暂不支持多个空。
              </div>
              <div v-else>
                <span style="color: #755dd3; font-weight: 800">暂不支持该题型</span>
              </div>
            </div>
          </div>
          <textarea
            class="textarea has-fixed-size"
            placeholder="请输入题目内容"
            style="height: 200px"
            v-model="(mode === 'add' ? newQuestion : editedQuestion).content"
          ></textarea>
          <div class="content" style="text-align: left; margin-top: 20px; margin-bottom: 10px">
            <div v-if="(mode === 'add' ? newQuestion : editedQuestion).questionType === 0">
              请输入一个大写字母：
            </div>
            <div v-if="(mode === 'add' ? newQuestion : editedQuestion).questionType === 1">
              请输入一个或（按顺序）多个大写字母：
            </div>
            <div v-if="(mode === 'add' ? newQuestion : editedQuestion).questionType === 2">
              请输入应填的内容：
            </div>
          </div>
          <b-input
            placeholder="请输入答案"
            v-model="(mode === 'add' ? newQuestion : editedQuestion).correctAnswer"
          >
          </b-input>
        </div>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <b-button
            type="is-success"
            icon-left="check-bold"
            style="margin: 24px"
            @click="mode === 'add' ? confirmAdd() : confirmEdit()"
          >
            <strong>提交</strong>
          </b-button>
        </div>
      </div>

      <b-loading :active.sync="isLoading" :can-cancel="false" position="static"></b-loading>

      <b-modal v-model="checkModalActive" has-modal-card>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">题目 {{ checkedQuestion.questionId }}</p>
          </header>
          <section class="modal-card-body">
            <div
              style="
                text-align: left;
                padding-bottom: 50px;
                padding-left: 20px;
                padding-right: 20px;
                font-size: 18px;
              "
            >
              <div v-if="checkedQuestion.questionType === 0">
                <div class="statement">{{ checkedQuestion.splited[0] }}</div>
                <b-field
                  v-for="(option, optionIndex) in checkedQuestion.splited.slice(1)"
                  :key="optionIndex"
                  ><b-radio
                    disabled
                    v-model="checkedQuestion.answer"
                    :native-value="letters[optionIndex]"
                    >{{ letters[optionIndex] }}.&nbsp;{{ option }}</b-radio
                  ></b-field
                >
              </div>
              <div v-else-if="checkedQuestion.questionType === 1">
                <div class="statement">{{ checkedQuestion.splited[0] }}</div>
                <b-field
                  v-for="(option, optionIndex) in checkedQuestion.splited.slice(1)"
                  :key="optionIndex"
                  ><b-checkbox
                    disabled
                    v-model="checkedQuestion.answer"
                    :native-value="letters[optionIndex]"
                    >{{ letters[optionIndex] }}.&nbsp;{{ option }}</b-checkbox
                  ></b-field
                >
              </div>
              <div v-else-if="checkedQuestion.questionType === 2">
                <div class="statement">
                  <b-field>
                    {{ checkedQuestion.splited[0] }}
                    <b-input
                      style="
                        width: 150px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-left: 5px;
                        margin-right: 5px;
                      "
                      disabled
                      v-model="checkedQuestion.answer"
                    ></b-input>
                    {{ checkedQuestion.splited[1] }}
                  </b-field>
                </div>
              </div>
              <div v-else style="color: gray">由于暂不支持该题型，题目未显示</div>
            </div>
          </section>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import TeacherSidebarView from "../teacher/TeacherSidebarView.vue";
// import md5 from "js-md5";
export default {
  components: {
    TeacherSidebarView,
  },
  data() {
    return {
      editedQuestion: {},
      checkedQuestion: {},

      uid: null,
      mode: "list",

      data: [],
      isLoading: false,
      checkModalActive: false,
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      questionTypes: ["单项选择题", "多项/不定项选择题", "填空题"],

      newQuestion: {
        creator: this.uid,
        questionType: 0,
        content: "",
        correctAnswer: "",
      },
    };
  },
  computed: {},
  methods: {
    backToList() {
      if (this.mode === "edit")
        this.$buefy.dialog.confirm({
          message: "确定要返回吗？您的更改将不会保留！",
          type: "is-danger",
          onConfirm: () => {
            this.mode = "list";
          },
        });
      else this.mode = "list";
    },
    loadQuestions() {
      this.data = [];
      this.isLoading = true;
      axios
        .get("/api/questions")
        .then((result) => {
          this.data = result.data.data;
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
    checkQuestion(row) {
      if (row.questionType === 0 || row.questionType === 1) {
        row.splited = row.content.split("\n#");
      } else if (row.questionType === 2) {
        row.splited = row.content.split("#_");
      } else {
        row.splited = null;
      }
      this.checkedQuestion = row;
      this.checkedQuestion.answer =
        row.questionType !== 1 ? row.correctAnswer : row.correctAnswer.split("");
      this.checkModalActive = true;
    },
    async copyQuestion(row) {
      this.isLoading = true;
      let question = Object.assign({}, row);
      question.questionId = null;
      question.creator = this.uid;
      await axios
        .post("/api/questions", question)
        .then(() => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "复制成功",
            type: "is-success",
          });
          this.loadQuestions();
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
    confirmAdd() {
      this.newQuestion.content = this.newQuestion.content.trim();
      this.newQuestion.correctAnswer = this.newQuestion.correctAnswer.trim();
      if (!this.newQuestion.content || !this.newQuestion.correctAnswer) {
        this.$buefy.notification.open({
          message: "题目、答案不能为空",
          type: "is-danger",
        });
        return;
      }
      this.newQuestion.creator = this.uid;
      this.isLoading = true;
      axios
        .post("/api/questions", this.newQuestion)
        .then(() => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "题目已加入题库，感谢您的贡献！",
            type: "is-success",
          });
          this.mode = "list";
          this.newQuestion = {
            creator: this.uid,
            questionType: 0,
            content: "",
            correctAnswer: "",
          };
          this.loadQuestions();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "题目添加失败：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
          return;
        });
    },
    confirmEdit() {
      this.editedQuestion.content = this.editedQuestion.content.trim();
      this.editedQuestion.correctAnswer = this.editedQuestion.correctAnswer.trim();
      if (!this.editedQuestion.content || !this.editedQuestion.correctAnswer) {
        this.$buefy.notification.open({
          message: "题目、答案不能为空",
          type: "is-danger",
        });
        return;
      }
      this.isLoading = true;
      axios
        .put("/api/questions", this.editedQuestion)
        .then(() => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "题目修改成功",
            type: "is-success",
          });
          this.mode = "list";
          this.editedQuestion = {};
          this.loadQuestions();
        })
        .catch((error) => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "题目添加失败：" + error,
            type: "is-danger",
            pauseOnHover: true,
          });
        });
    },
    deleteQuestion(row) {
      this.$buefy.dialog.confirm({
        message: "确定要删除题目 " + row.questionId + " 吗？<br>这将在所有使用它的试卷中将它删除！",
        type: "is-danger",
        onConfirm: async () => {
          this.isLoading = true;
          await axios
            .delete("/api/questions/" + row.questionId)
            .then(() => {
              this.isLoading = false;
              this.$buefy.notification.open({
                message: "题目已删除",
                type: "is-info",
              });
              this.loadQuestions();
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
    logOut() {
      localStorage.removeItem("access-teacher");
      this.$router.push("/teacher/login");
    },
  },
  filters: {
    truncate(value, length) {
      return value.length > length ? value.substr(0, length) + "..." : value;
    },
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
  mounted() {
    this.loadQuestions();
  },
};
</script>

<style>
.statement {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
