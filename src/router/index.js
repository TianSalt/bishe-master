import IndexView from "@/views/IndexView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AdminStudentsView from "@/views/admin/AdminStudentsView.vue";
import AdminTeachersView from "@/views/admin/AdminTeachersView.vue";
// import SandboxView from "@/views/sandbox/SandboxView.vue";
import TeacherErrorView from "@/views/teacher/TeacherErrorView.vue";
import StudentErrorView from "@/views/student/StudentErrorView.vue";
import AdminErrorView from "@/views/admin/AdminErrorView.vue";
import AdminLoginView from "@/views/admin/AdminLoginView.vue";
import TeacherLoginView from "@/views/teacher/TeacherLoginView.vue";
import StudentLoginView from "@/views/student/StudentLoginView.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import TeacherExamsView from "@/views/teacher/TeacherExamsView.vue";
import AdminPersonalView from "@/views/admin/AdminPersonalView.vue";
import TeacherPersonalView from "@/views/teacher/TeacherPersonalView.vue";
import TeacherPapersView from "../views/teacher/TeacherPapersView.vue";
import TeacherQuestionsView from "@/views/teacher/TeacherQuestionsView.vue";
import StudentView from "@/views/student/StudentView.vue";
import TeacherAboutView from "@/views/teacher/TeacherAboutView.vue";
import AdminAboutView from "@/views/admin/AdminAboutView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: IndexView,
  },
  // {
  //   path: "/sandbox",
  //   name: "Sandbox",
  //   component: SandboxView,
  // },
  {
    path: "/admin",
    name: "Admin",
    component: AdminStudentsView,
    meta: {
      title: "学生管理",
    },
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLoginView,
    meta: {
      title: "管理员登录",
    },
  },
  {
    path: "/admin/error",
    name: "AdminError",
    component: AdminErrorView,
  },
  {
    path: "/admin/about",
    name: "AdminAbout",
    component: AdminAboutView,
    meta: {
      title: "关于",
    },
  },
  {
    path: "/admin/students",
    name: "AdminStudents",
    component: AdminStudentsView,
    meta: {
      title: "学生管理",
    },
  },
  {
    path: "/admin/teachers",
    name: "AdminTeachers",
    component: AdminTeachersView,
    meta: {
      title: "教师管理",
    },
  },
  {
    path: "/admin/personal",
    name: "AdminPersonal",
    component: AdminPersonalView,
    meta: {
      title: "个人信息",
    },
  },
  {
    path: "/student",
    name: "Student",
    component: StudentView,
    meta: {
      title: "学生端",
    },
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
    meta: {
      title: "学生登录",
    },
  },
  {
    path: "/teacher",
    name: "Teacher",
    component: TeacherExamsView,
    meta: {
      title: "所有考试",
    },
  },
  {
    path: "/teacher/about",
    name: "TeacherAbout",
    component: TeacherAboutView,
    meta: {
      title: "关于",
    },
  },
  {
    path: "/teacher/exams",
    name: "TeacherExams",
    component: TeacherExamsView,
    meta: {
      title: "所有考试",
    },
  },
  {
    path: "/teacher/papers",
    name: "PapersExams",
    component: TeacherPapersView,
    meta: {
      title: "我的试卷",
    },
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
    meta: {
      title: "教师登录",
    },
  },
  {
    path: "/teacher/personal",
    name: "TeacherPersonal",
    component: TeacherPersonalView,
    meta: {
      title: "个人信息",
    },
  },
  {
    path: "/teacher/questions",
    name: "TeacherQuestions",
    component: TeacherQuestionsView,
    meta: {
      title: "题库",
    },
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
  const title = to.meta.title;
  if (title) {
    document.title = title + " - 大学生上机考试系统";
  } else {
    document.title = "大学生上机考试系统"; // 可以设置一个默认标题
  }
  if (to.path.startsWith("/teacher/") || to.path === "/teacher") {
    if (to.path === "/teacher/login" || to.path === "/teacher/error") return next();
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
        alert("服务器异常：" + error);
      });
    next();
  } else if (to.path.startsWith("/student/") || to.path === "/student") {
    if (to.path === "/student/login" || to.path === "/student/error") return next();
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
        alert("服务器异常：" + error);
      });
    next();
  } else if (to.path.startsWith("/admin/") || to.path === "/admin") {
    if (to.path === "/admin/login" || to.path === "/admin/error") return next();
    let user = JSON.parse(localStorage.getItem("access-admin"));
    if (!user) {
      return next("/admin/login");
    }
    await axios
      .get("/api/check-token", { params: { token: user.token } })
      .then((response) => {
        if (response.data.code === 0) return next("/admin/error");
      })
      .catch((error) => {
        alert("服务器异常：" + error);
      });
    next();
  } else next();
});

export default router;
