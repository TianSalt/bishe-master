<template>
  <div>
    <b-button @click="setStudents"> </b-button>
    <b-modal v-model="studentModalActive" has-modal-card>
      <div class="modal-card" style="width: 1050px">
        <section class="modal-card-body">
          <div style="display: flex; align-items: center">
            <b-table
              :data="allStudents"
              :columns="studentColumns"
              :checked-rows.sync="checkedRows"
              paginated
              pagination-simple
              checkable
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
              type="is-primary"
              outlined
              rounded
              style="margin: 20px; font-weight: 500"
              @click="selectStudents"
              >参加</b-button
            >
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
              "
            >
              <section
                style="
                  color: #755dd3;
                  font-weight: 700;
                  margin: 30px;
                  font-size: large;
                "
              >
                <!-- {{ props.row.title }} -->
                这是考试的标题
              </section>
              <header style="padding: 10px"></header>
              <b-table
                :data="studentsToChangeTo"
                narrowed
                sticky-header
                style="height: 100%"
              >
                <b-table-column
                  field="name"
                  label="姓名"
                  sortable
                  centered
                  v-slot="props"
                >
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column
                  field="studentId"
                  label="学号"
                  width="100"
                  sortable
                  numeric
                  v-slot="props"
                >
                  {{ props.row.studentId }}
                </b-table-column>
                <b-table-column v-slot="{ index }">
                  <b-button
                    rounded
                    type="is-danger is-light is-small"
                    icon-left="close"
                    style="height: 25.8px"
                    @click="studentsToChangeTo.splice(index, 1)"
                  ></b-button>
                </b-table-column>
              </b-table>

              <div @click="confirmStudents">
                <b-button
                  v-if="studentsToChangeTo.length !== 0"
                  type="is-warning"
                  icon-left="checkbox-multiple-marked-outline"
                >
                  <span>
                    将考生设为这
                    <span style="font-weight: 700">{{
                      studentsToChangeTo.length
                    }}</span>
                    人
                  </span>
                </b-button>
                <b-button
                  v-else-if="!InitiallyNoStudents"
                  type="is-danger is-light"
                  icon-left="broom"
                  >清除所有考生</b-button
                >
              </div>
            </div>
          </div>
        </section>
        Bottom
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentModalActive: true,
      allStudents: [
        {
          uid: 1,
          studentId: "2020204622",
          name: "葛昶",
          major: "软件工程（创新班）",
          schoolClass: "20软工创新",
        },
        {
          uid: 2,
          studentId: "02",
          name: "Student 2",
          major: "Science",
          schoolClass: "Class 2",
        },
        {
          uid: 3,
          studentId: "03",
          name: "Student 3",
          major: "History",
          schoolClass: "Class 3",
        },
        {
          uid: 4,
          studentId: "04",
          name: "Student 4",
          major: "English",
          schoolClass: "Class 4",
        },
        {
          uid: 5,
          studentId: "05",
          name: "Student 5",
          major: "Math",
          schoolClass: "Class 5",
        },
        {
          uid: 6,
          studentId: "06",
          name: "Student 6",
          major: "Science",
          schoolClass: "Class 6",
        },
        {
          uid: 7,
          studentId: "07",
          name: "Student 7",
          major: "History",
          schoolClass: "Class 7",
        },
        {
          uid: 8,
          studentId: "08",
          name: "Student 8",
          major: "Science",
          schoolClass: "Class 8",
        },
        {
          uid: 9,
          studentId: "09",
          name: "Student 9",
          major: "Math",
          schoolClass: "Class 9",
        },
        {
          uid: 10,
          studentId: "010",
          name: "Student 10",
          major: "History",
          schoolClass: "Class 10",
        },
      ],
      studentsToChangeTo: [
        {
          uid: 4,
          studentId: "04",
          name: "Student 4",
          major: "English",
          schoolClass: "Class 4",
        },
        {
          uid: 5,
          studentId: "05",
          name: "Student 5",
          major: "Math",
          schoolClass: "Class 5",
        },
        {
          uid: 6,
          studentId: "06",
          name: "Student 6",
          major: "Science",
          schoolClass: "Class 6",
        },
      ],
      // studentsToChangeTo: null,
      InitiallyNoStudents: true,
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
    };
  },
  methods: {
    loadStudentsOfExam(examId) {
      alert("load " + examId + " from backend");
      // load to studentsToChangeTo
    },
    setStudents(examId) {
      this.studentModalActive = true;
      // loading
      if (this.allStudents === null)
        this.loadStudentsOfExam(examId);
      // stop loading
      if (this.studentsToChangeTo.length === 0) this.InitiallyNoStudents = true;
      else this.InitiallyNoStudents = false;
    },
    selectStudents() {
      this.studentsToChangeTo = [
        ...new Set([...this.checkedRows, ...this.studentsToChangeTo]),
      ];
      this.checkedRows = [];
    },
    confirmStudents() {
      // delete and post to /api/student_exams
      // studentsToChangeTo = [];
    },
  },
};
</script>

<!-- <div style="padding-left: 280px"></div> -->
