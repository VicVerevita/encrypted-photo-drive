<template>
  <div class="upload-container">
    <input type="file" @change="handleFileUpload" class="file-input" />
    <button @click="uploadPhoto" class="upload-button">Upload</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      selectedFile: null,
    };
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadPhoto() {
      if (!this.selectedFile) {
        alert('Please select a file to upload.');
        return;
      }

      try {
        await this.$store.dispatch('uploadPhoto', this.selectedFile);
        alert('Photo uploaded successfully');
        this.$emit('photoUploaded');
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.file-input {
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

input[type="file"] {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="file"]:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

.upload-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.upload-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.upload-button:active {
  background-color: #1e7e34;
  transform: scale(1);
}
</style>