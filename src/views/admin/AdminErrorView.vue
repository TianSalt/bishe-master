<template>
    <div></div>
  </template>
  
  <script>
  export default {
    created() {
      localStorage.removeItem("access-admin");
      this.$buefy.dialog.alert("登录已过期或失效，请重新登录");
      this.$router.replace("/admin/login");
    },
  };
  </script>
  