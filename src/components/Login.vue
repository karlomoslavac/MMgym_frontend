<template>
    <div class="login-container">
        <h1 class="login-title">Login</h1>
        <form @submit.prevent="login">
            <div class="input-container">
                <input v-model="username" placeholder="Username" required>
            </div>
            <div class="input-container">
                <input v-model="password" type="password" placeholder="Password" required>
            </div>
            <div class="input-container">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import store from '../store';

    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            async login() {
                try {
                    const response = await axios.post('/users/login', {
                        username: this.username,
                        password: this.password
                    });
                    localStorage.setItem('token', response.data.token);
                    store.commit('login', response.data.user);
                    this.$router.push(response.data.user.role === 'owner' ? '/owner-dashboard' : '/user-dashboard');
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
</script>

<style scoped>
    .login-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100% - 60px);
    }

    .login-title {
        color: white;
        background-color: rgba(0, 0, 0, 0.86);
        padding: 10px;
        border-radius: 5px;
    }

    .input-container {
        margin-bottom: 10px;
    }
</style>
