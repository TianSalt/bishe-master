<template>
  <div>
    <b-button @click="buttonClicked"> </b-button>
    <b-modal v-model="modalActive" has-modal-card>
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">Card Body</section>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalActive: false,
    };
  },
  methods: {
    buttonClicked() {
      this.modalActive = true;
    },
  },
};
</script>
