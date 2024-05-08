<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <teacher-sidebar-view :uid="uid"></teacher-sidebar-view>

      <div
        style="
          margin-left: 30px;
          margin-right: 30px;
          margin-top: 10px;
          width: 100%;
        "
      >
        <section style="color: #755dd3; text-align: left">
          此处展示所有公开的考试。您在创建试卷后点击「发布」即可公开试卷。
        </section>
        <b-table
          class="table is-striped"
          :data="data"
          :paginated="true"
          :per-page="10"
          :pagination-rounded="true"
          :sort-icon-size="null"
          :striped="true"
        >
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
            label="创建者"
            field="creatorName"
            :centered="true"
            sortable
            v-slot="props"
          >
            {{ props.row.creatorName }}
          </b-table-column>
          <b-table-column
            label="开始时间"
            field="startTime"
            :centered="true"
            sortable
            v-slot="props"
          >
            {{ props.row.startTime }}
          </b-table-column>

          <b-table-column
            label="结束时间"
            field="endTime"
            :centered="true"
            sortable
            v-slot="props"
          >
            {{ props.row.endTime }}
          </b-table-column>

          <b-table-column
            label="状态"
            :centered="true"
            field="status"
            v-slot="props"
          >
            <span :style="{ color: statusColor(props.row.status) }">
              {{ statusText(props.row.status) }}
            </span>
          </b-table-column>

          <template #empty>
            <div v-if="!isLoading" class="has-text-centered">无记录</div>
          </template>
        </b-table>
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
import TeacherSidebarView from "./TeacherSidebarView.vue";
export default {
  components: { TeacherSidebarView },
  data() {
    return {
      uid: null,

      data: [],
      timeDiff: new Date().getTimezoneOffset() * 60000,
      isLoading: false,
    };
  },
  methods: {
    statusText(status) {
      switch (status) {
        case 0:
          return "未开始";
        case 1:
          return "进行中";
        case 2:
          return "已结束";
        default:
          return "时间错误";
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
      localStorage.removeItem("access-teacher");
      this.$router.push("/teacher/login");
    },
  },
  created() {
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
  async mounted() {
    this.isLoading = true;
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      return y + " 年 " + m + " 月 " + d + " 日　" + h + ":" + minute;
    };
    await axios
      .get("/api/exams", { params: { isPublished: true } })
      .then((result) => {
        var list = result.data.data;
        for (let i of list) {
          var startTimeStamp = new Date(
            new Date(i.startTime).getTime() - this.timeDiff
          );
          var endTimeStamp = new Date(new Date(i.endTime) - this.timeDiff);
          let status = 3;
          if (startTimeStamp.getTime() <= endTimeStamp.getTime()) {
            if (startTimeStamp.getTime() > Date.now()) status = 0;
            else if (endTimeStamp.getTime() > Date.now()) status = 1;
            else status = 2;
          }
          this.data.push({
            title: i.title,
            creatorName: i.creatorName,
            startTime: formatDateTime(startTimeStamp),
            endTime: formatDateTime(endTimeStamp),
            status: status,
          });
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "网络异常：" + error,
          type: "is-danger",
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
