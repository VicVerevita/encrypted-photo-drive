<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cssgram/0.1.10/cssgram.min.css">
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ photo.subject }}</h2>
      <input v-model="newSubject" placeholder="Enter new subject" />
      <button @click="modifySubject">Modify Subject</button>
      <figure :class=filter ref="figure">
        <img :src="photo.url" :alt="photo.subject" class="photo" ref="img" @load="onImageLoad"/>
      </figure>
      <button @click="duplicatePhoto">Duplicate Photo</button>
      <div class="filter-container">
        <label for="filter-selector">Select a Filter:</label>
        <select v-model="selectedFilter" id="filter-selector" class="filter-selector">
          <option value="">None</option>
          <option v-for="filter in filters" :key="filter" :value="filter">{{ filter }}</option>
        </select>
        <div class="filter-buttons">
          <button class="apply-filter" @click="applyFilter">Apply Filter</button>
          <button class="save-filter" @click="saveFilter">Save New Photo</button>
        </div>
      </div>
      <button @click="encryptPhoto">Encrypt Photo</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    photo: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newSubject: '',
      selectedFilter: '',
      filter: '',
      filters: ['aden', 'amaro', 'brannan', 'brooklyn', 'clarendon', 'gingham', 'hudson', 'inkwell', 'kelvin', 'lark', 'lofi', 'mayfair', 'moon', 'nashville', 'perpetua', 'reyes', 'rise', 'slumber', 'stinson', 'toaster', 'valencia', 'walden', 'willow', 'xpro2']
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    modifySubject() {
      if (this.newSubject) {
        this.$emit('modify-subject', this.newSubject);
      } else {
        alert('Please enter a new subject.');
      }
    },
    duplicatePhoto() {
      this.$emit('duplicate-photo', this.photo);
    },
    applyFilter() {
      if (this.selectedFilter) {
        this.filter = this.selectedFilter;
      } else {
        alert('Please select a filter.');
      }
    },
    async saveFilter() {
      if (this.filter) {
        const figure = this.$refs.figure;
        const img = this.$refs.img;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        context.filter = getComputedStyle(figure).filter;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg');
        const blob = await fetch(dataURL).then(res => res.blob());

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          this.$emit('save-photo', base64data);
        };
      } else {
        alert('Please apply a filter first.');
      }
    },
    encryptPhoto() {
      this.$emit('encrypt-photo', this.photo);
    },
    onImageLoad() {}
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.photo {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
}

.filter-container {
  margin: 20px 0;
}

.filter-selector {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-right: 10px;
}

input[type="text"] {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

button:active {
  background-color: #004494;
  transform: scale(1);
}

button.modify {
  background-color: #007bff;
  color: #fff;
}

button.duplicate {
  background-color: #28a745;
  color: #fff;
}

button.apply-filter {
  background-color: #ffc107;
  color: #fff;
}

button.encrypt {
  background-color: #dc3545;
  color: #fff;
}
</style>