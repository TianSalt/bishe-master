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
                  active
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

      <div style="padding-left: 280px"></div>

      <div style="margin: 50px">
        <div style="display: flex; justify-content: space-between">
          <div></div>
          <div>
            共计
            <span style="color: #755dd3; font-weight: 800">{{
              data.length
            }}</span>
            场考试
          </div>
          <!-- <div>
            请在
            <span style="color: #755dd3; font-weight: 800">试卷管理</span>
            中添加、删除、变更考试
          </div> -->
        </div>
        <b-table
          class="table is-striped"
          :data="data"
          :paginated="true"
          :per-page="10"
          :pagination-rounded="true"
          :sort-icon-size="null"
          :striped="true"
        >
          <b-table-column label="标题" sortable v-slot="props">
            {{ props.row.title }}
          </b-table-column>
          <b-table-column label="创建者" field="name" sortable v-slot="props">
            {{ props.row.creator }}
          </b-table-column>
          <b-table-column label="开始时间" field="time" sortable v-slot="props">
            {{ props.row.startTime }}
          </b-table-column>

          <b-table-column label="结束时间" field="time" sortable v-slot="props">
            {{ props.row.endTime }}
          </b-table-column>

          <b-table-column label="状态" field="status" v-slot="props">
            <span :style="{ color: statusColor(props.row.status) }">
              {{ statusText(props.row.status) }}
            </span>
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">无记录</div>
          </template>
        </b-table>
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
      uid: null,
      currentTime: Date.now(),
      info: {},

      data: [],
      isLoading: false,
    };
  },
  methods: {
    statusText(status) {
      switch (status) {
        case 0:
          return "已结束";
        case 1:
          return "进行中";
        case 2:
          return "未开始";
        default:
          return "未始即终";
      }
    },
    statusColor(status) {
      switch (status) {
        case 0:
          return "#000000";
        case 1:
          return "#4dc58f";
        case 2:
          return "#755dd3";
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
  mounted() {
    axios
      .get("/api/teachers/" + this.uid)
      .then((response) => {
        this.isLoading = false;
        this.info = response.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        this.$buefy.notification.open({
          message: "服务器异常：" + error,
          type: "is-danger",
        });
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
    axios
      .get("/api/exams", { params: { isPublished: true } })
      .then(async (result) => {
        for (var i of result.data.data) {
          await axios.get("/api/teachers/" + i.creator).then((response) => {
            var creator = response.data.data.name;
            var status = 3;
            var startTimeStamp = new Date(i.startTime);
            var endTimeStamp = new Date(i.endTime);
            if (startTimeStamp.getTime() <= endTimeStamp.getTime()) {
              status = 0;
              if (startTimeStamp.getTime() > this.currentTime) status = 2;
              else if (endTimeStamp.getTime() > this.currentTime) status = 1;
            }
            this.data.push({
              title: i.title,
              creator: creator,
              startTime: formatDateTime(startTimeStamp),
              endTime: formatDateTime(endTimeStamp),
              status: status,
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
        });
      });
    this.isLoading = false;
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
