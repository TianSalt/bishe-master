<template>
  <div>SANDBOX</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {},
  created() {
    let teacher = {
      uid: 35,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM1LCJyb2xlIjoidGVhY2hlciIsImp0aSI6ImExYWI1ZGE0LTAzNzctNDIzYy04NjllLTA5MGFiY2U1YzUzMCJ9.iwMK6lde9WIq5WQ_VPH1hwC8WEb_obT76TUk1X11RUs",
    };
    axios
      .get("/api/check-token", { params: { token: teacher.token } })
      .then((response) => {
        console.log(response.data);
      });
  },
};
</script>
