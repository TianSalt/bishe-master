<template>
  <div>
    <b-field class="file is-primary" :class="{'has-name': !!file}">
      <b-upload v-model="file" class="file-label" @input="handleFileUpload">
        <span class="file-cta">
          <b-icon class="file-icon" icon="upload"></b-icon>
          <span class="file-label">Click to upload</span>
        </span>
        <span class="file-name" v-if="file">
          {{ file.name }}
        </span>
      </b-upload>
    </b-field>

    <div v-if="file">
      <h2>File Content:</h2>
      <pre>{{ fileContent }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      fileContent: null
    };
  },
  methods: {
    handleFileUpload(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
      };

      reader.readAsText(file);
    }
  }
};
</script>
