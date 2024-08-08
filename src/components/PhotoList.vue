<template>
  <div>
    <div v-if="photos.length === 0">No photos available</div>
    <div v-else class="photo-list">
      <div v-for="photo in photos" :key="photo.id" class="photo-item" @click="openPhotoView(photo)">
        <img :src="photo.url" :alt="photo.subject" v-if="photo.url"/>
        <p>{{ photo.subject }}</p>
      </div>
    </div>
    <PhotoView
        v-if="selectedPhoto"
        :photo="selectedPhoto"
        :isVisible="isPhotoViewVisible"
        @close="closePhotoView"
        @modify-subject="modifySubject"
        @duplicate-photo="duplicatePhoto"
        @save-filter="saveFilter"
        @encrypt-photo="encryptPhoto"
    />
  </div>
</template>

<script>
import PhotoView from './PhotoView.vue';

export default {
  components: {
    PhotoView
  },
  props: {
    photos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedPhoto: null,
      isPhotoViewVisible: false
    };
  },
  methods: {
    openPhotoView(photo) {
      this.selectedPhoto = photo;
      this.isPhotoViewVisible = true;
    },
    closePhotoView() {
      this.isPhotoViewVisible = false;
      this.selectedPhoto = null;
    },
    async modifySubject(newSubject) {
      if (this.selectedPhoto) {
        try {
          this.selectedPhoto.subject = newSubject;
          await this.$store.dispatch('updatePhotoSubject', { id: this.selectedPhoto.id, subject: newSubject });
        } catch (error) {
          console.error('Error updating photo subject:', error);
        }
      }
    },
    async duplicatePhoto() {
      if (this.selectedPhoto) {
        try {
          await this.$store.dispatch('duplicatePhoto', this.selectedPhoto);
        } catch (error) {
          console.error('Error duplicating photo:', error);
        }
      }
    },
    async saveFilter(photo)
    {
       if (this.photo) {
         try {
           await this.$store.dispatch('uploadPhoto', photo);
         } catch (error) {
           console.error('Error uploading photo:', error);
         }
       }
    }
    ,
      encryptPhoto(photo)
      {
        console.log('Encrypting photo:', photo);
      }
    }
};
</script>

<style scoped>
.photo-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.photo-item {
  margin: 10px;
  cursor: pointer;
}

.photo-item img {
  max-width: 22rem;
  max-height: 22rem;
}
</style>