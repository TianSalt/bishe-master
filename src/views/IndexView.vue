<template>
  <section class="main-section">
    <img src="@/images/logo-white.png" class="logo" alt="Logo" />
    <div class="card-container">
      <div class="card-link" @click="goTo('/admin')">
        <div class="card-content">
          <b-icon icon="account-edit-outline" size="is-large"></b-icon>
          <p>管理员端</p>
        </div>
      </div>
      <div class="card-link" @click="goTo('/teacher')">
        <div class="card-content">
          <b-icon icon="list-status" size="is-large"></b-icon>
          <p>教师端</p>
        </div>
      </div>
      <div class="card-link" @click="goTo('/student')">
        <div class="card-content">
          <b-icon icon="table-chair" size="is-large"></b-icon>
          <p>学生端</p>
        </div>
      </div>
    </div>
    <div style="margin-top: 50px">
      <b-button icon-left="information-outline" @click="aboutModalActive = true">关于</b-button>
    </div>
    <b-modal v-model="aboutModalActive" has-modal-card>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="content">
            <h2>毕业设计</h2>
            <div class="buttons" style="justify-content: center">
              <b-button icon-left="github" @click="goToFrontend"> 前端源码 </b-button
              ><b-button icon-left="github" @click="goToBackend"> 后端源码 </b-button>
            </div>
          </div>
        </section>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      aboutModalActive: false,
    };
  },
  methods: {
    goTo(path) {
      window.open("/#" + path);
    },
    goToBackend() {
      window.open("https://github.com/TianSalt/bishe-backend", "_blank");
    },
    goToFrontend() {
      window.open("https://github.com/TianSalt/bishe-master", "_blank");
    },
  },
};
</script>

<style scoped>
.main-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6d54d0, #a68ef2);
  color: #fff;
}

.logo {
  width: 200px;
}

.card-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.card-link {
  width: 200px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
  color: #6d54d0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-link:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-content p {
  margin-top: 10px;
  font-size: 1.2em;
  color: #6d54d0;
}
</style>
