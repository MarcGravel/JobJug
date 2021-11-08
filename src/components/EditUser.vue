<template>
    <div>
        <v-form id="editForm" v-model="formValid">
            <h1 id="formTitle">Edit Employee</h1>
            <v-btn id="deleteEmpBtn"
                color="error" 
                @click="removeEmployee"
                >
                    Delete Employee
            </v-btn>
            <v-text-field
                v-model="updUser.name"
                placeholder="Limit 60 characters"
                :rules="[nameRules.required, nameRules.length]"
                label="Name"
            ></v-text-field>
            <v-text-field
                v-model="updUser.email"
                placeholder="Limit 60 characters"
                :rules="[emailRules.required, emailRules.length, emailRules.valid]"
                label="Email"
            ></v-text-field>
            <v-text-field v-if="user.authLevel == 'admin' || user.userId == editUser.userId"
                v-model="updUser.password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                placeholder="At least 6 characters"
                :rules="[passwordRules.passmin, passwordRules.passmax]"
                label="Password"
            ></v-text-field>
            <h4 id="statusTitle">Role:</h4>
            <v-radio-group 
                v-model="updUser.authLevel"
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
                v-model="updUser.phone"
                placeholder="Limit 20 characters"
                :rules="[phoneRules.length]"
                label="Phone number (Optional)"
            ></v-text-field>
            <v-text-field
                v-model="updUser.hourlyRate"
                placeholder="Must be a number"
                type="number"
                label="Hourly Rate (Optional)"
            ></v-text-field>
            <h2 id="errorMsg">{{errorMsg}}</h2>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendUpdUserData()"
                :disabled="!formValid">
                    Save
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
import axios from 'axios'
import cookies from 'vue-cookies'

    export default {
        name: "EditUser",
        props: ["user", "editUser"],
        data() {
            return {
                updUser: {
                    name: this.editUser.name,
                    email: this.editUser.email,
                    authLevel: this.editUser.authLevel,
                    phone: this.editUser.phone,
                    hourlyRate: this.editUser.hourlyRate,
                    password: 'Reset Pass Here',
                },
                formValid: false,
                show1: true,
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
                    passmin: v => v.length == 0 || v.length >= 6 || 'Min 6 characters',
                    passmax: v => v.length <= 50 || 'Max 50 characters'
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
                this.$emit("closeOverlay");
            },
            removeEmployee() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "userId": this.editUser.userId
                    }
                }).then(() => {
                    this.$emit("closeOverlay")
                    this.$emit("loadUsers")
                }).catch((error) => {
                    console.log(error.response.data);
                    this.errorMsg = "Unauthorized to delete admins";
                })
            },
            sendUpdUserData() {
                let session = cookies.get('session');
                let token = session.token;

                this.updUser.sessionToken = token;
                this.updUser.userId = this.editUser.userId;

                if (this.updUser.email == this.editUser.email){
                    delete this.updUser.email;
                }

                if (this.updUser.password == 'Reset Pass Here') {
                    delete this.updUser.password;
                }

                if (this.updUser.authLevel == this.editUser.authLevel) {
                    delete this.updUser.authLevel;
                }

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.updUser
                }).then((response) => {
                    console.log(response.data[0]);
                    this.$emit("closeOverlay")
                    this.$emit("loadUsers")
                }).catch((error) => {
                    console.log(error.response.data);
                    if (error.response.data == "email already exists. Try another email") {
                        this.updUser.email = "Email already exists. Try another email"
                    }

                    if (error.response.data == "Not authorized to update to this auth level") {
                        this.updUser.authLevel = this.editUser.authLevel;
                        this.errorMsg = "Not authorized to assign the admin user role";
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #editForm {
        display: grid;

        #formTitle {
            justify-self: center;
            color: #52ab98;
        }

        #deleteEmpBtn {
            justify-self: end;
            width: fit-content;
            margin-bottom: 2vh;
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