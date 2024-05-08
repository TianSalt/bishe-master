import IndexView from "@/views/IndexView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AdminStudentsView from "@/views/admin/AdminStudentsView.vue";
import AdminTeachersView from "@/views/admin/AdminTeachersView.vue";
import SandboxView from "@/views/sandbox/SandboxView.vue";
import TeacherErrorView from "@/views/teacher/TeacherErrorView.vue";
import StudentErrorView from "@/views/student/StudentErrorView.vue";
import TeacherLoginView from "@/views/teacher/TeacherLoginView.vue";
import StudentLoginView from "@/views/student/StudentLoginView.vue";
import TeacherView from "@/views/teacher/TeacherExamsView.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import TeacherExamsView from "@/views/teacher/TeacherExamsView.vue";
import TeacherPersonalView from "@/views/teacher/TeacherPersonalView.vue";
import TeacherPapersView from "../views/teacher/TeacherPapersView.vue";
import TeacherQuestionsView from "@/views/teacher/TeacherQuestionsView.vue";
import StudentView from "@/views/student/StudentView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Default",
    // component: IndexView,
    component: SandboxView,
  },
  {
    path: "/index",
    name: "Index",
    component: IndexView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminTeachersView,
  },
  {
    path: "/admin/students",
    name: "AdminStudents",
    component: AdminStudentsView,
  },
  {
    path: "/admin/teachers",
    name: "AdminTeachers",
    component: AdminTeachersView,
  },
  {
    path: "/student",
    name: "Student",
    component: StudentView,
  },
  {
    path: "/student/error",
    name: "StudentError",
    component: StudentErrorView,
  },
  {
    path: "/student/login",
    name: "StudentLogin",
    component: StudentLoginView,
  },
  {
    path: "/teacher",
    name: "Teacher",
    component: TeacherView,
  },
  {
    path: "/teacher/exams",
    name: "TeacherExams",
    component: TeacherExamsView,
  },
  {
    path: "/teacher/papers",
    name: "PapersExams",
    component: TeacherPapersView,
  },
  {
    path: "/teacher/error",
    name: "TeacherError",
    component: TeacherErrorView,
  },
  {
    path: "/teacher/login",
    name: "TeacherLogin",
    component: TeacherLoginView,
  },
  {
    path: "/teacher/personal",
    name: "TeacherPersonal",
    component: TeacherPersonalView,
  },
  {
    path: "/teacher/questions",
    name: "TeacherQuestions",
    component: TeacherQuestionsView,
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith("/teacher/") || to.path === "/teacher") {
    if (to.path === "/teacher/login" || to.path === "/teacher/error")
      return next();
    let user = JSON.parse(localStorage.getItem("access-teacher"));
    if (!user) {
      return next("/teacher/login");
    }
    await axios
      .get("/api/check-token", { params: { token: user.token } })
      .then((response) => {
        if (response.data.code === 0) return next("/teacher/error");
      })
      .catch((error) => {
        alert("网络异常：" + error);
      });
    next();
  } else if (to.path.startsWith("/student/") || to.path === "/student") {
    if (to.path === "/student/login" || to.path === "/student/error")
      return next();
    let user = JSON.parse(localStorage.getItem("access-student"));
    if (!user) {
      return next("/student/login");
    }
    await axios
      .get("/api/check-token", { params: { token: user.token } })
      .then((response) => {
        if (response.data.code === 0) return next("/student/error");
      })
      .catch((error) => {
        alert("网络异常：" + error);
      });
    next();
  } else next();
});

export default router;
