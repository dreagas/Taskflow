import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: false
    }),
    actions: {
        async loginUser(email, password) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', {
                    email: email,
                    password: password
                });

                if (response.data && response.data.token) {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    this.isAuthenticated = true;
                    localStorage.setItem('token', this.token);
                    return true;
                }
                return false;
            } catch (error) {
                console.log('Error in loginUser:', error);
                throw error;
            }
        },
        async registerNewUser(name, email, password) {
             try {
                const response = await axios.post('http://localhost:3000/api/auth/register', {
                    name: name,
                    email: email,
                    password: password
                });

                if (response.data && response.data.token) {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    this.isAuthenticated = true;
                    localStorage.setItem('token', this.token);
                    return true;
                }
                return false;
             } catch(error) {
                 console.log('Error in registerNewUser:', error);
                 throw error;
             }
        },
        logoutUser() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        async fetchCurrentUser() {
             if (!this.token) {
                 return;
             }
             try {
                 const response = await axios.get('http://localhost:3000/api/auth/me', {
                     headers: { Authorization: `Bearer ${this.token}` }
                 });
                 if (response.data && response.data.user) {
                     this.user = response.data.user;
                     this.isAuthenticated = true;
                 }
             } catch(error) {
                 console.log('Error fetching current user:', error);
                 this.logoutUser();
             }
        }
    }
});