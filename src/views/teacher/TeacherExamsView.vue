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
                  active
                  icon="google-classroom"
                  label="所有考试"
                ></b-menu-item></router-link
              ><router-link to="/teacher/papers"
                ><b-menu-item
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

      <div style="margin: 50px; width: 100%">
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
            <div class="has-text-centered">无记录</div>
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
// import md5 from "js-md5";
export default {
  data() {
    return {
      uid: null,
      info: {},

      data: [],
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
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
  async mounted() {
    this.isLoading = true;
    await axios
      .get("/api/teachers/" + this.uid)
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
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    };
    await axios
      .get("/api/exams", { params: { isPublished: true } })
      .then((result) => {
        var list = result.data.data;
        for (let i of list) {
          var startTimeStamp = new Date(i.startTime);
          var endTimeStamp = new Date(i.endTime);
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
          message: "服务器异常：" + error,
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
