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
            <b-menu-list label="管理员端"
              ><router-link to="/admin/students">
                <b-menu-item
                  icon="account-box-multiple"
                  label="学生管理"
                ></b-menu-item></router-link
              ><router-link to="/admin/teachers"
                ><b-menu-item icon="account-box-multiple-outline" label="教师管理"></b-menu-item
              ></router-link>
            </b-menu-list>
            <b-menu-list label="管理员信息"
              ><router-link to="/admin/personal"
                ><b-menu-item icon="account" label="个人资料"></b-menu-item
              ></router-link>
              <b-menu-item icon="logout" label="退出" @click="logOut"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="大学生上机考试系统"
              ><router-link to="/admin/about"
                ><b-menu-item icon="information-outline" label="关于" active></b-menu-item
              ></router-link>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
      <section style="margin: 50px; width: 100%">
        <div class="content">
          <h2>毕业设计</h2>
          <div class="buttons" style="justify-content: center">
            <b-button icon-left="github" @click="goToFrontend"> 前端源码 </b-button
            ><b-button icon-left="github" @click="goToBackend"> 后端源码 </b-button>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    goToBackend() {
      window.open("https://github.com/TianSalt/bishe-backend", "_blank");
    },
    goToFrontend() {
      window.open("https://github.com/TianSalt/bishe-master", "_blank");
    },
  },
  created() {
    this.isLoading = true;
    this.uid = JSON.parse(localStorage.getItem("access-teacher")).uid;
  },
};
</script>
