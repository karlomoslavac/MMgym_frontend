import { createStore } from 'vuex'
import axios from 'axios'

axios.defaults.withCredentials = true;

export default createStore({
    state: {
        user: null,
        isLoggedIn: false
    },
    mutations: {
        login(state, user) {
            state.user = user;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
        }
    },
    actions: {
        async loginUser({ commit }, { username, password }) {
            try {
                const response = await axios.post('http://localhost:3000/users/login', { username, password });
                commit('login', response.data.user);
            } catch (error) {
                console.error(error);
            }
        },
        logoutUser({ commit }) {
            commit('logout');
        }
    }
})