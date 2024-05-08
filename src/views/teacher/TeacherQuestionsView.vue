<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>

      <div
        style="
          margin-left: 25.8px;
          margin-right: 25.8px;
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
                icon-left="pencil"
                style="height: 25.8px"
                @click="
                  editedQuestion.questionId = props.row.questionId;
                  mode = 'edit';
                "
                v-if="props.row.creator === uid"
              >
              </b-button>
              <b-button
                class="button is-info is-light"
                icon-left="magnify"
                style="margin-left: 10px; height: 25.8px"
                @click="observeQuestion(props.row)"
                v-else
              >
              </b-button>
              <b-button
                icon-left="content-copy"
                style="margin-left: 10px; height: 25.8px"
                @click="copyQuestion(props.row)"
              >
              </b-button
              ><b-button
                class="button is-danger is-light"
                icon-left="trash-can-outline"
                style="margin-left: 10px; height: 25.8px"
                v-if="props.row.creator === uid"
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
            <a class="navbar-item" @click="mode = 'list'">
              <b-icon icon="chevron-left" style="margin-right: 5px"> </b-icon>
              <p>返回</p>
            </a>
          </div>

          <div class="navbar-menu">
            <div class="navbar-item">
              <b-dropdown
                append-to-body
                aria-role="menu"
                scrollable
                max-height="200"
                trap-focus
              >
                <template #trigger>
                  <a class="navbar-item" role="button">
                    <span>{{
                      ["单项选择题", "多项/不定项选择题", "填空题"][
                        newQuestion.questionType
                      ]
                    }}</span>
                    <b-icon icon="menu-down"></b-icon>
                  </a>
                </template>

                <b-dropdown-item custom aria-role="listitem"> </b-dropdown-item>

                <b-dropdown-item
                  v-for="item of [0, 1, 2]"
                  :key="item"
                  aria-role="listitem"
                >
                  <div @click="newQuestion.questionType = item">
                    {{ ["单项选择题", "多项/不定项选择题", "填空题"][item] }}
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
                  newQuestion.questionType === 0 ||
                  newQuestion.questionType === 1
                "
              >
                <span style="color: #755dd3; font-weight: 800">格式：</span>
                <pre>
题干
#选项一内容
#选项二内容
...（至多 26 项）</pre
                >
              </div>
              <div v-else-if="newQuestion.questionType === 2">
                <span style="color: #755dd3; font-weight: 800">格式：</span
                ><br />使用 <code>#_</code> 表示空的位置。暂不支持多个空。
              </div>
              <div v-else>
                <span style="color: #755dd3; font-weight: 800"
                  >暂不支持该题型</span
                >
              </div>
            </div>
          </div>
          <textarea
            class="textarea has-fixed-size"
            placeholder="请输入题目内容"
            style="height: 200px"
            v-model="newQuestion.content"
          ></textarea>
          <div
            class="content"
            style="text-align: left; margin-top: 20px; margin-bottom: 10px"
          >
            <div v-if="newQuestion.questionType === 0">请输入一个字母：</div>
            <div v-if="newQuestion.questionType === 1">
              请输入一个或（按顺序）多个字母：
            </div>
            <div v-if="newQuestion.questionType === 2">请输入应填的内容：</div>
          </div>
          <b-input placeholder="请输入答案" v-model="newQuestion.correctAnswer">
          </b-input>
        </div>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <b-button
            type="is-success"
            icon-left="check-bold"
            style="margin: 25.8px"
            @click="confirmAdd"
          >
            <strong>提交</strong>
          </b-button>
        </div>
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
import TeacherSidebarView from "../teacher/TeacherSidebarView.vue";
// import md5 from "js-md5";
export default {
  components: {
    TeacherSidebarView,
  },
  data() {
    return {
      editedQuestion: {
        questionId: null,
        creator: this.uid,
        questionType: 0,
        content: "",
        correctAnswer: "",
      },

      uid: null,
      mode: "list",

      data: [],
      isLoading: false,

      newQuestion: {
        creator: this.uid,
        questionType: 0,
        content: "",
        correctAnswer: "",
      },
      teacherUidNameMap: [],
    };
  },
  computed: {},
  methods: {
    backFromEdit() {
      this.$buefy.dialog.confirm({
        message: "确定要返回吗？您所作出的更改将不会被保留！",
        type: "is-danger",
        onConfirm: () => {
          this.mode = "list";
        },
      });
    },
    loadQuestions() {
      this.data = [];
      this.isLoading = true;
      axios
        .get("/api/questions")
        .then(async (result) => {
          for (var i of result.data.data) {
            if (!this.teacherUidNameMap[i.creator])
              await axios.get("/api/teachers/" + i.creator).then((response) => {
                this.teacherUidNameMap[i.creator] = response.data.data.name;
              });
            i.creatorName = this.teacherUidNameMap[i.creator];
            this.data.push(i);
          }
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
    observeQuestion(row) {
      alert("该功能开发中！" + row);
    },
    copyQuestion(row) {
      alert("该功能开发中！" + row);
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
      console.log(this.newQuestion);
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
