import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginModal from '../components/LoginModal.vue';
import RegisterModal from '../components/RegisterModal.vue';
import PhotosView from '../views/PhotosView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginModal
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterModal
  },
  {
    path: '/photos',
    name: 'Photos',
    component: PhotosView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

