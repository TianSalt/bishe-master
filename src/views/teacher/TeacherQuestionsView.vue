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
                  icon="note-multiple-outline"
                  label="我的试卷"
                ></b-menu-item
              ></router-link>
              <router-link to="/teacher/questions"
                ><b-menu-item active label="题库" icon="bookshelf"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="个人信息"
              ><router-link to="/teacher/personal"
                ><b-menu-item icon="account" :label="myName"></b-menu-item
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
      <div style="margin: 50px; width: 100%" v-if="mode === 'list'">
        <div style="display: flex; justify-content: space-between">
          <div>
            共计
            <span style="color: #755dd3; font-weight: 800">{{
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
        <!--
          Use backend-sorting and backend-pagination props to let those tasks
          to the backend, then manage it with page-change and sort events.
          See: https://buefy.org/documentation/table#async-data
        -->
        <section>
          <b-table :data="data" paginated :per-page="perPage" :narrowed="true">
            <b-table-column
              :searchable="true"
              field="name"
              label="贡献者"
              sortable
              v-slot="props"
            >
              {{ props.row.creatorName }}
            </b-table-column>

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

            <b-table-column v-slot="props">
              <b-button
                class="button is-info is-light is-small"
                icon-left="pencil"
                @click="
                  editing.questionId = props.row.questionId;
                  mode = 'edit';
                "
                style="margin-right: 10px; height: 25.8px"
                v-if="props.row.creator === uid"
              >
                编辑
              </b-button>
              <b-button
                class="button is-info is-light is-small"
                icon-left="magnify"
                @click="observeQuestion(props.row)"
                style="height: 25.8px"
                v-else
              >
                查看
              </b-button>
              <b-button
                class="button is-danger is-light is-small"
                icon-left="trash-can-outline"
                style="height: 25.8px"
                v-if="props.row.creator === uid"
              >
                删除
              </b-button>
            </b-table-column>
            <template #empty>
              <div class="has-text-centered">无记录</div>
            </template>
          </b-table>
        </section>
      </div>

      <div style="width: 100%" v-if="mode === 'add'">
        <nav class="navbar">
          <div class="navbar-brand">
            <a class="navbar-item" @click="mode = 'list'">
              <b-icon icon="arrow-left" style="margin-right: 5px"> </b-icon>
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
                      ["单项选择题", "多项选择题", "填空题"][
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
                    {{ ["单项选择题", "多项选择题", "填空题"][item] }}
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </nav>
        <div style="margin-left: 20px; margin-right: 20px">
          <div class="content" style="text-align: left">
            <div class="content" style="text-align: left">
              <div
                v-if="
                  newQuestion.questionType === 0 ||
                  newQuestion.questionType === 1
                "
              >
                <span style="color: #755dd3; font-weight: 800">格式：</span
                ><br />题干<br />A. 选项内容（注意 A. 后有空格）<br />...
              </div>
              <div v-else-if="newQuestion.questionType === 2">
                <span style="color: #755dd3; font-weight: 800">格式：</span
                ><br />使用 <code>$_</code> 表示空的位置。暂不支持多个空。
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
          <div class="content" style="text-align: left; padding-top: 20px">
            <div v-if="newQuestion.questionType === 0">请输入一个字母：</div>
            <div v-if="newQuestion.questionType === 1">请输入多个字母：</div>
            <div v-if="newQuestion.questionType === 2">请输入应填的内容：</div>
          </div>
          <b-input placeholder="请输入答案" v-model="newQuestion.correctAnswer">
          </b-input>
        </div>
        <div style="width: 100%">
          <b-navbar :fixed-bottom="true">
            <template #end>
              <b-navbar-item tag="div">
                <b-button
                  type="is-success"
                  icon-left="upload"
                  @click="confirmAdd"
                >
                  <strong>确定</strong>
                </b-button>
              </b-navbar-item>
            </template>
          </b-navbar>
        </div>
      </div>

      <div style="width: 100%" v-if="mode === 'edit'">
        <nav class="navbar">
          <div class="navbar-brand">
            <a class="navbar-item" @click="mode = 'list'">
              <b-icon icon="arrow-left" style="margin-right: 5px"> </b-icon>
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
                      ["单项选择题", "多项选择题", "填空题"][
                        editing.questionType
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
                  <div @click="editing.questionType = item">
                    {{ ["单项选择题", "多项选择题", "填空题"][item] }}
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </nav>
        <div style="margin-left: 20px; margin-right: 20px">
          <div class="content" style="text-align: left">
            <div class="content" style="text-align: left">
              <div
                v-if="editing.questionType === 0 || editing.questionType === 1"
              >
                <span style="color: #755dd3; font-weight: 800">格式：</span
                ><br />题干<br />A. 选项内容（注意 A. 后有空格）<br />...
              </div>
              <div v-else-if="editing.questionType === 2">
                <span style="color: #755dd3; font-weight: 800">格式：</span
                ><br />使用 <code>$_</code> 表示空的位置。暂不支持多个空。
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
            v-model="editing.content"
          ></textarea>
          <div class="content" style="text-align: left; padding-top: 20px">
            <div v-if="editing.questionType === 0">请输入一个字母：</div>
            <div v-if="editing.questionType === 1">请输入多个字母：</div>
            <div v-if="editing.questionType === 2">请输入应填的内容：</div>
          </div>
          <b-input placeholder="请输入答案" v-model="editing.correctAnswer">
          </b-input>
        </div>
        <div style="width: 100%">
          <b-navbar :fixed-bottom="true">
            <template #end>
              <b-navbar-item tag="div">
                <b-button type="is-primary" icon-left="content-save">
                  <strong>保存</strong>
                </b-button>
              </b-navbar-item>
            </template>
          </b-navbar>
        </div>
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
      perPage: 20,

      editing: {
        questionId: null,
        creator: this.uid,
        questionType: 0,
        content: "",
        correctAnswer: "",
      },

      uid: null,
      myName: "",
      mode: "list",

      data: [],
      isLoading: false,

      newQuestion: {
        creator: 0,
        questionType: 0,
        content: "",
        correctAnswer: "",
      },
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
    loadAsyncData() {
      this.isLoading = true;
      axios
        .get("/api/questions")
        .then(async (result) => {
          this.data = [];
          for (var i of result.data.data) {
            await axios.get("/api/teachers/" + i.creator).then((response) => {
              this.data.push({
                questionId: i.questionId,
                creator: i.creator,
                creatorName: response.data.data.name,
                questionType: i.questionType,
                content: i.content,
                correctAnswer: i.correctAnswer,
              });
            });
          }
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
    confirmAdd() {
      this.isLoading = true;
      this.newQuestion.creator = this.uid;
      axios
        .post("/api/questions", this.newQuestion)
        .then(() => {
          this.isLoading = false;
          this.$buefy.notification.open({
            message: "题目已加入题库",
            type: "is-success",
          });
          this.mode = "list";
          this.loadAsyncData();
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
      this.newQuestion = {
        creator: 0,
        questionType: 0,
        content: "",
        correctAnswer: "",
      };
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
    axios
      .get("/api/teachers/" + this.uid)
      .then((response) => {
        this.isLoading = false;
        this.myName = response.data.data.name;
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
    this.loadAsyncData();
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
