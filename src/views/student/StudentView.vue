<template>
  <div>
    <div v-if="mode === 'list'">
      <b-navbar>
        <template #brand>
          <b-navbar-item>
            <img src="@/images/small-logo.png" alt="上机考试" />
          </b-navbar-item>
        </template>
        <template #start
          ><b-navbar-item>
            {{ clock }}
          </b-navbar-item>
          <b-navbar-item>
            <span style="color: #755dd3; font-size: larger">{{ info.name }}</span
            >&nbsp;（{{ info.studentId }}）同学，欢迎使用大学生上机考试系统
          </b-navbar-item>
        </template>

        <template #end>
          <b-navbar-item tag="div">
            <b-button icon-right="logout" class="is-light" @click="logOut()">退出登录</b-button>
          </b-navbar-item>
        </template>
      </b-navbar>
      <div style="margin-left: 50px; margin-right: 50px">
        <b-table class="table" :data="exams" card-layout>
          <b-table-column
            label="标题"
            field="title"
            :centered="true"
            width="500px"
            sortable
            v-slot="props"
          >
            {{ props.row.title }}
          </b-table-column>
          <b-table-column
            label="开始时间"
            field="startTimeFormatted"
            :centered="true"
            sortable
            v-slot="props"
          >
            {{ props.row.startTimeFormatted }}
          </b-table-column>

          <b-table-column
            label="结束时间"
            field="endTimeFormatted"
            :centered="true"
            sortable
            v-slot="props"
          >
            {{ props.row.endTimeFormatted }}
          </b-table-column>

          <b-table-column label="状态" :centered="true" field="status" v-slot="props">
            <span :style="{ color: statusColor(props.row.status) }">
              {{ statusText(props.row.status) }}
            </span>
          </b-table-column>

          <b-table-column label="操作" :centered="true" field="status" v-slot="props">
            <div>
              <b-button v-if="props.row.status === 0" type="is-primary" disabled>等待开始</b-button>
              <b-button
                v-if="props.row.status === 1"
                type="is-success"
                @click="go(props.row, 'take')"
                >进入考试</b-button
              >
              <b-button
                v-else-if="props.row.status === 2"
                type="is-info"
                @click="go(props.row, 'check')"
                >查看试题</b-button
              >
            </div>
          </b-table-column>

          <template #empty>
            <div v-if="!isLoading" class="has-text-centered">无记录</div>
          </template>
        </b-table>
        <section style="margin: 10px">
          <h6 class="title is-6">考生信息</h6>
          <div class="block">
            <div><b>专业：</b>{{ info.major }}</div>
            <div><b>班级：</b>{{ info.schoolClass }}</div>
            <div><b>学号：</b>{{ info.studentId }}</div>
            <div><b>姓名：</b>{{ info.name }}</div>
          </div>
          <div class="block">如个人信息有误，请联系系统管理员修改</div>
        </section>
      </div>
    </div>

    <student-go-view
      v-if="mode === 'go'"
      :exam="exam"
      :studentUid="uid"
      :disabled="disabled"
    ></student-go-view>

    <b-loading :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from "axios";
import StudentGoView from "./StudentGoView.vue";
export default {
  components: { StudentGoView },
  data() {
    return {
      uid: null,
      info: {},

      mode: "list",
      exams: [],
      studentExam: [],
      isLoading: false,
      timeDiff: new Date().getTimezoneOffset() * 60000,
      interval: null,

      exam: {},
      disabled: true,
      clock: null,
    };
  },
  methods: {
    go(exam, permission) {
      // console.log("Go ", exam, permission);
      this.exam = exam;
      if (permission === "take") this.disabled = false;
      else if (permission === "check") this.disabled = true;
      this.mode = "go";
    },
    statusText(status) {
      switch (status) {
        case 0:
          return "未开始";
        case 1:
          return "进行中";
        case 2:
          return "已结束";
        default:
          return "";
      }
    },
    statusColor(status) {
      switch (status) {
        case 0:
          return "#755dd3";
        case 1:
          return "#4dc58f";
        case 2:
          return "#000000";
        default:
          return "#f04668";
      }
    },
    logOut() {
      localStorage.removeItem("access-student");
      this.$router.push("/student/login");
    },
  },
  created() {
    this.uid = JSON.parse(localStorage.getItem("access-student")).uid;
  },
  mounted() {
    axios
      .get("/api/students/" + this.uid)
      .then((response) => {
        this.info = response.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "服务器异常：" + error,
          type: "is-danger",
        });
        return;
      });
    this.isLoading = true;
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
    axios
      .get("/api/student-exams/list", { params: { studentUid: this.uid } })
      .then((result) => {
        var exams = result.data.data;
        for (let i of exams) {
          // console.log(i.startTime);
          var startTime = new Date(new Date(i.startTime).getTime() - this.timeDiff);
          var endTime = new Date(new Date(i.endTime) - this.timeDiff);
          let status = 3;
          if (startTime < endTime) {
            if (startTime > new Date()) status = 0;
            else if (endTime > new Date()) status = 1;
            else status = 2;
          }
          this.exams.push({
            examId: i.examId,
            title: i.title,
            introduction: i.introduction,
            startTime,
            endTime,
            startTimeFormatted: formatDateTime(startTime),
            endTimeFormatted: formatDateTime(endTime),
            status: status,
          });
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "服务器异常：" + error,
          type: "is-danger",
        });
      });
    this.clock = formatDateTime(new Date());
    this.interval = setInterval(() => {
      let clock = new Date();
      this.clock = formatDateTime(clock);
      for (let i of this.exams) {
        if (i.startTime < i.endTime) {
          if (i.startTime > clock) i.status = 0;
          else if (i.endTime > clock) i.status = 1;
          else i.status = 2;
        } else {
          i.status = 3;
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
