<template>
  <b-modal v-mode="thisModalActive" has-modal-card>
    <div class="modal-card" style="width: 1050px; height: 600px">
      <section class="modal-card-body">
        <div style="display: flex; flex: 1; align-items: center">
          <b-table
            :data="allStudents"
            :columns="studentColumns"
            :checked-rows.sync="checkedRows"
            paginated
            sticky-header
            height="400px"
            per-page="50"
            pagination-simple
            checkable
            checkbox-type="is-info"
            checkbox-position="right"
            narrowed
            striped
          >
            <template #bottom-left>
              <b>已选择：</b> {{ checkedRows.length }}
            </template>
          </b-table>
          <b-button
            icon-right="chevron-double-right"
            type="is-info is-light"
            rounded
            style="margin: 20px; font-weight: 500"
            @click="selectStudents"
            >添加</b-button
          >
          <header
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <header style="font-weight: 700; font-size: large">
              {{ currentExam.title }}
            </header>
            <div style="padding: 10px">
              已选择
              <span style="font-weight: 700; font-size: large; color: #007ce8"
                >{{ studentsToChangeTo.length }} </span
              >名考生
            </div>
            <!--
                        To update:
                        Use backend-sorting and backend-pagination props to let those tasks
                        to the backend, then manage it with page-change and sort events.
                        See: https://buefy.org/documentation/table#async-data
                      -->
            <b-table
              :data="studentsToChangeTo"
              narrowed
              sticky-header
              sort-icon="menu-up"
            >
              <b-table-column
                field="name"
                label="姓名"
                width="100px"
                sortable
                centered
                v-slot="propsJ"
              >
                {{ propsJ.row.name }}
              </b-table-column>
              <b-table-column
                field="studentId"
                label="学号"
                width="70px"
                sortable
                numeric
                v-slot="propsJ"
              >
                {{ propsJ.row.studentId }}
              </b-table-column>
              <b-table-column label="移除" v-slot="{ index }">
                <b-button
                  rounded
                  type="is-danger is-light is-small"
                  icon-left="close"
                  style="height: 25.8px"
                  @click="studentsToChangeTo.splice(index, 1)"
                ></b-button>
              </b-table-column>
            </b-table>
            <div style="display: flex; justify-content: space-between">
              <b-button
                type="is-info"
                outlined
                icon-left="checkbox-multiple-marked-outline"
                :loading="buttonLoading"
                size="is-medium"
                @click="confirmStudents(currentExam.examId)"
              >
                <div>更新名单</div></b-button
              ><b-button
                outlined
                :disabled="buttonDisabled"
                size="is-medium"
                @click="this.$emit('close')"
              >
                <div>取消</div>
              </b-button>
            </div>
          </header>
        </div>
      </section>
    </div>
    <b-loading :active.sync="isLoading"></b-loading>
  </b-modal>
</template>

<script>
import axios from "axios";
export default {
  props: ["exam"],
  components: {},
  data() {
    return {
      thisModalActive: true,
      currentExam: {
        examId: -1,
        creator: null,
        title: "",
        startTime: null,
        endTime: null,
        introduction: "",
        isPublished: false,
      },
      allStudents: [],
      initialUids: [],
      studentsToChangeTo: [],
      checkedRows: [],
      studentColumns: [
        {
          field: "major",
          label: "专业",
          width: "150",
          centered: true,
          searchable: true,
        },
        {
          field: "schoolClass",
          label: "班级",
          width: "100",
          centered: true,
          searchable: true,
        },
        {
          field: "studentId",
          label: "学号",
          width: "100",
          numeric: true,
          searchable: true,
        },
        {
          field: "name",
          label: "姓名",
          width: "100",
          centered: true,
          searchable: true,
        },
      ],
      buttonLoading: false,
      buttonDisabled: false,
      isLoading: false,
    };
  },
  methods: {
    selectStudents() {
      for (let i of this.checkedRows) {
        let found = false;
        for (let j of this.studentsToChangeTo) {
          if (i.uid === j.uid) {
            found = true;
            break;
          }
        }
        if (!found) {
          this.studentsToChangeTo.unshift(i);
        }
      }
      this.checkedRows = [];
    },
    confirmStudents(examId) {
      this.$buefy.dialog.confirm({
        hasIcon: true,
        title: "更新考生名单",
        message:
          "确定更新考生名单吗？<br>如果移除了原有的考生，其作答将被删除！",
        type: "is-warning",
        onConfirm: async () => {
          this.buttonLoading = true;
          this.buttonDisabled = true;
          let uidsToChangeTo = Array.from(this.studentsToChangeTo).map(
            (obj) => obj.uid
          );
          let asyncOperations = [];
          let success = true;
          for (let i of this.initialUids) {
            if (!success) break;
            if (!uidsToChangeTo.includes(i)) {
              asyncOperations.push(
                axios
                  .delete("/api/student-exams", {
                    params: { examId, studentUid: i },
                  })
                  .catch((error) => {
                    success = false;
                    this.buttonLoading = false;
                    this.buttonDisabled = false;
                    this.$buefy.notification.open({
                      message: "网络异常：" + error,
                      type: "is-danger",
                      pauseOnHover: true,
                    });
                  })
              );
            }
          }
          for (let i of uidsToChangeTo) {
            if (!success) break;
            if (!this.initialUids.includes(i)) {
              asyncOperations.push(
                axios
                  .post("/api/student-exams", { examId, studentUid: i })
                  .catch((error) => {
                    success = false;
                    this.buttonLoading = false;
                    this.buttonDisabled = false;
                    this.$buefy.notification.open({
                      message: "网络异常：" + error,
                      type: "is-danger",
                      pauseOnHover: true,
                    });
                  })
              );
            }
          }
          await Promise.all(asyncOperations);
          if (!success) return;
          this.$emit("close");
          this.$buefy.notification.open({
            message: "考生名单更新成功！",
            type: "is-info",
            position: "is-top",
          });
          this.buttonLoading = false;
          this.buttonDisabled = false;
          this.initialUids = [];
          this.studentsToChangeTo = [];
          this.mode = "list";
        },
      });
    },
  },
  mounted() {
    this.isLoading = true;
    axios
      .get("/api/students")
      .then((response) => {
        this.allStudents = response.data.data;
        axios
          .get("/api/student-exams/" + this.currentExam.examId)
          .then((response) => {
            this.isLoading = false;
            this.studentsToChangeTo = response.data.data;
            this.initialUids = Array.from(this.studentsToChangeTo).map(
              (obj) => obj.uid
            );
          });
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
};
</script>
