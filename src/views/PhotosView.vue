<template>
  <div class="photo-management-container">
    <PhotoUpload @photoUploaded="fetchPhotos" />
    <div class="subject-selector-container">
      <label for="subject-selector">Filter by Subject:</label>
      <select v-model="selectedSubject" id="subject-selector" class="subject-selector">
        <option value="">None</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
      </select>
    </div>
    <PhotoList :photos="filteredPhotos" />
  </div>
</template>

<script>
import PhotoUpload from '../components/PhotoUpload.vue';
import PhotoList from '../components/PhotoList.vue';
import { mapGetters, mapState} from 'vuex';

export default {
  components: {
    PhotoUpload,
    PhotoList
  },
  data() {
    return {
      selectedSubject: '',
      subjects: []
    };
  },
  computed: {
    ...mapGetters(['filteredPhotos']),
    ...mapState(['token']),
    filteredPhotos() {
      return this.$store.getters.filteredPhotos(this.selectedSubject);
    }
  },
  methods: {
    async fetchPhotos() {
      try {
        const response = await fetch('http://localhost:8081/api/photos', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          const photosWithUrls = data.map(photo => {
            try {
              const binary = atob(photo.data);
              const array = [];
              for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              photo.url = URL.createObjectURL(blob);
            } catch (error) {
              console.error('Error creating Blob or Object URL:', error);
              photo.url = '';
            }
            return photo;
          });
          this.$store.commit('setPhotos', photosWithUrls);
        } else {
          throw new Error('Failed to fetch photos');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  },
  mounted() {
    this.fetchPhotos();
  }
};
</script>

<style scoped>
.photo-management-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.subject-selector-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

label {
  margin-right: 10px;
  font-weight: bold;
}

.subject-selector {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>