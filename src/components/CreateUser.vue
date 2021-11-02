<template>
    <div>
        <v-form id="createForm" v-model="formValid">
            <h1 id="formTitle">Create New Job</h1>
            <v-text-field
                v-model="newUser.name"
                placeholder="Limit 60 characters"
                :rules="[nameRules.required, nameRules.length]"
                label="Name (Required)"
            ></v-text-field>
            <v-text-field
                v-model="newUser.authLevel"
                placeholder="Limit 15 characters"
                :rules="[authRules.required, authRules.length, authRules.type]"
                label="Employee role (admin, manager, or employee)"
            ></v-text-field>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendNewJobData()"
                :disabled="!formValid">
                    Create Employee
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'

    export default {
        name: "CreateUser",
        beforeMount() {
            this.loadAllEmployees();
        },
        data() {
            return {
                allEmployees: [],
                newUser: {
                    authLevel: '',
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    hourlyRate: ''
                },
                nameRules: {
                    required: v => !!v || 'Name is required',
                    length: v => v.length  <= 60 || 'Max 60 characters'
                },
            }
        },
        methods: {
            loadAllEmployees() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': token
                    },
                }).then((response) => {
                    this.allEmployees = response.data
                }).catch((error) => {
                    console.log(error.response);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>