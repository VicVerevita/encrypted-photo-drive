import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    token: localStorage.getItem('authToken'),
    photos: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setPhotos(state, photos) {
      state.photos = photos;
    },
    addPhoto(state, photo) {
      state.photos.push(photo);
    },
    updatePhotoSubject(state, { id, subject }) {
      const photo = state.photos.find(photo => photo.id === id);
      if (photo) {
        photo.subject = subject;
      }
    },
    duplicatePhoto(state, photo) {
      state.photos.push(photo);
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        commit('setUser', data.user);
        commit('setToken', data.token);
      } else {
        throw new Error(data.message);
      }
    },
    logout({ commit }) {
      commit('setUser', null);
      commit('setToken', null);
      localStorage.removeItem('authToken');
    },
    async getPhotos({ commit, state }) {
      const response = await fetch('http://localhost:8081/api/photos', {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        commit('setPhotos', data);
      } else {
        throw new Error(data.message);
      }
    },
    async updatePhotoSubject({ commit, state }, { id, subject }) {
      try {
        const response = await fetch(`http://localhost:8081/api/photos/subject/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`
          },
          body: JSON.stringify({ subject })
        });
        const data = await response.json();
        if (response.ok) {
          commit('updatePhotoSubject', { id, subject });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error updating photo subject:', error);
      }
    },
    async uploadPhoto({ commit, state }, file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8081/api/photos', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${state.token}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          commit('addPhoto', data);
        } else {
          throw new Error('Failed to upload photo');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
      },
    async duplicatePhoto({ commit, state }, photo) {
      const formData = new FormData();
      formData.append('file', photo);

      try {
        const response = await fetch('http://localhost:8081/api/photos', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${state.token}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          commit('duplicatePhoto', data);
        } else {
          throw new Error('Failed to upload photo');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    }
  },
  getters: {
    filteredPhotos: (state) => (subject) => {
      if (subject) {
        return state.photos.filter(photo => photo.subject === subject);
      }
      return state.photos;
    }
  },
  modules: {}
});

export default store;