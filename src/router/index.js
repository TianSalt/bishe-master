import IndexView from "@/views/IndexView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AdminStudentsView from "@/views/admin/AdminStudentsView.vue";
import AdminTeachersView from "@/views/admin/AdminTeachersView.vue";
import SandboxView from "@/views/sandbox/SandboxView.vue";
import TeacherErrorView from "@/views/teacher/TeacherErrorView.vue";
import TeacherLoginView from "@/views/teacher/TeacherLoginView.vue";
import TeacherView from "@/views/teacher/TeacherExamsView.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import TeacherExamsView from "@/views/teacher/TeacherExamsView.vue";
import TeacherPersonalView from "@/views/teacher/TeacherPersonalView.vue";
import TeacherPapersView from "../views/teacher/TeacherPapersView.vue";
import TeacherQuestionsView from "@/views/teacher/TeacherQuestionsView.vue";

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
    let teacher = JSON.parse(localStorage.getItem("access-teacher"));
    if (!teacher) {
      return next("/teacher/login");
    }
    await axios
      .get("/api/check-token", { params: { token: teacher.token } })
      .then((response) => {
        if (response.data.code === 0) return next("/teacher/error");
      });
    next();
  } else next();
});

export default router;
