import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

axios.defaults.baseURL = 'https://mmgymback.onrender.com';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

createApp(App)
    .use(router)
    .use(store)
    .mount('#app');
