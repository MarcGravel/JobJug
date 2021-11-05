<template>
    <div @click="errorMsg = ''">
        <v-form id="createForm" v-model="formValid">
            <h1 id="formTitle">Create New User</h1>
            <v-text-field
                v-model="newUser.name"
                placeholder="Limit 60 characters"
                :rules="[nameRules.required, nameRules.length]"
                label="Name"
            ></v-text-field>
            <v-text-field
                v-model="newUser.email"
                placeholder="Limit 60 characters"
                :rules="[emailRules.required, emailRules.length, emailRules.valid]"
                label="Email"
            ></v-text-field>
            <v-text-field
                v-model="newUser.password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                placeholder="At least 6 characters"
                :rules="[passwordRules.required, passwordRules.passmin, passwordRules.passmax]"
                label="Password"
            ></v-text-field>
            <v-text-field
                v-model="confirmPass"
                :type="show2 ? 'text' : 'password'"
                placeholder="Write password again"
                :rules="[confirmRules.required, confirmRules.match]"
                label="Confirm Password"
            ></v-text-field>
            <h4 id="statusTitle">Role (Required):</h4>
            <v-radio-group 
                v-model="newUser.authLevel"
                row
                :rules="[authRules.required]"
                >
                <v-radio
                    label="Admin"
                    value="admin"
                    color="#24a0ed"
                    >
                </v-radio>
                <v-radio
                    label="Manager"
                    value="manager"
                    color="#24a0ed"
                    >
                </v-radio>
                <v-radio
                    label="Employee"
                    value="employee"
                    color="#24a0ed"
                    >
                </v-radio>
            </v-radio-group>
            <v-text-field
                v-model="newUser.phone"
                placeholder="Limit 20 characters"
                :rules="[phoneRules.length]"
                label="Phone number (Optional)"
            ></v-text-field>
            <v-text-field
                v-model="newUser.hourlyRate"
                placeholder="Must be a number"
                type="number"
                label="Hourly Rate (Optional)"
            ></v-text-field>
            <h2 id="errorMsg">{{errorMsg}}</h2>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendNewUserData()"
                :disabled="!formValid">
                    Create Employee
            </v-btn>
            <v-btn id="backBtn"
                color="#52ab98" 
                @click="closeOverlay">
                    Back
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'

    export default {
        name: "CreateUser",
        data() {
            return {
                newUser: {
                    authLevel: '',
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    hourlyRate: ''
                },
                confirmPass: '',
                formValid: false,
                show1: false,
                show2: false,
                nameRules: {
                    required: v => !!v || 'Name is required',
                    length: v => v.length  <= 60 || 'Max 60 characters'
                },
                emailRules: {
                    required: v => !!v || 'Email is required',
                    length: v => v.length  <= 60 || 'Max 60 characters',
                    valid: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                },
                passwordRules: {
                    required: v => !!v || 'Password is required',
                    passmin: v => v.length >= 6 || 'Min 6 characters',
                    passmax: v => v.length <= 50 || 'Max 50 characters'
                },
                confirmRules: {
                    required: v => !!v || 'Password is required',
                    match: v => v == this.newUser.password || "Password must match"
                },
                authRules: {
                    required: v => !!v || 'Role is required',
                },
                phoneRules: {
                    length: v => v.length  <= 20 || 'Max 20 characters'
                },
                errorMsg: '',
            }
        },
        methods: {
            closeOverlay() {
                this.$emit("closeOverlay")
            },
            sendNewUserData() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "authLevel": this.newUser.authLevel,
                        "name": this.newUser.name,
                        "email": this.newUser.email,
                        "password": this.newUser.password,
                        "phone": this.newUser.phone,
                        "hourlyRate": this.newUser.hourlyRate
                    }
                }).then((response) => {
                    console.log(response.data[0]);
                    this.$emit("closeOverlay")
                    this.$emit("loadUsers")
                }).catch((error) => {
                    if (error.response.data == "email already exists. Try another email") {
                        this.newUser.email = "Email already exists. Try another email"
                    }

                    if (error.response.data == "Not authorized to create this user type") {
                        this.newUser.authLevel = '';
                        this.errorMsg = "Not authorized to create this user type";
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #createForm {
        display: grid;

        #formTitle {
            justify-self: center;
            color: #52ab98;
        }

        #saveUpdateBtn {
            justify-self: center;
            width: 80%;
            margin-bottom: 2vh;
        }

        #backBtn {
            justify-self: center;
            width: 80%;
        }

        #errorMsg {
            justify-self: center;
            margin-bottom: 2vh;
            color: #f47174;
        }
    }
</style>