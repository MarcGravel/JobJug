<template>
    <div class="text-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
            >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="white"
                plain
                dark
                v-bind="attrs"
                v-on="on"
                >
                {{user.name}}
                </v-btn>
            </template>

            <v-card id="card">
                <v-list>
                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title>{{user.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{user.authLevel}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                    <h4>Change Your Password</h4>
                    </v-list-item-action>
                </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                <v-form ref="form" v-model="formValid" v-if="pwdSuccess == false">
                    <v-list-item>
                        <v-list-item-content>
                            <v-text-field
                                v-model="oldPass"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1"
                                placeholder="At least 6 characters"
                                :rules="[passwordRules.required, passwordRules.passmin, passwordRules.passmax]"
                                label="Current Password"
                            ></v-text-field>
                            <v-text-field
                                v-model="newPass"
                                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show2 ? 'text' : 'password'"
                                @click:append="show2 = !show2"
                                placeholder="At least 6 characters"
                                :rules="[passwordRules.required, passwordRules.passmin, passwordRules.passmax]"
                                label="New Password"
                            ></v-text-field>
                            <v-text-field
                                v-model="confirmPass"
                                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show3 ? 'text' : 'password'"
                                @click:append="show3 = !show3"
                                placeholder="Write password again"
                                :rules="[confirmRules.required, confirmRules.match]"
                                label="Confirm New Password"
                            ></v-text-field>
                            <h2>{{errorMsg}}</h2>
                        </v-list-item-content>
                    </v-list-item>
                </v-form>
                <h2 v-if="pwdSuccess == true">Success! Password Changed</h2>
                </v-list>
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text
                    @click="menu = false"
                >
                    Cancel
                </v-btn>
                <v-btn
                    v-if="pwdSuccess == false"
                    color="primary"
                    text
                    :disabled="!formValid"
                    @click="updatePass"
                    >
                    Save
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'
    export default {
        name: "ChangePassword",
        props: ["user"],
        data() {
            return {
                fav: true,
                menu: false,
                show1: false,
                show2: false,
                show3: false,
                formValid: false,
                passwordRules: {
                    required: v => !!v || 'Password is required',
                    passmin: v => (v != null && v.length) >= 6 || 'Min 6 characters',
                    passmax: v => (v != null && v.length) <= 50 || 'Max 50 characters'
                },
                confirmRules: {
                    required: v => !!v || 'Password is required',
                    match: v => v == this.newPass|| "Password must match"
                },
                oldPass: '',
                newPass: '',
                confirmPass: '',
                pwdSuccess: false,
                errorMsg: '',
            }
        },
        methods: {
            updatePass() {
                let session = cookies.get('session');
                let token = session.token;

                if (this.newPass != '') {
                    if (this.newPass == this.confirmPass) {
                        axios.request({
                            url: process.env.VUE_APP_API_SITE+'/api/password',
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: {
                                "sessionToken": token,
                                "password": this.oldPass,
                                "newPassword": this.newPass,
                            }
                        }).then(() => {
                            this.pwdSuccess = true;
                            this.newPass = '';
                            this.oldPass = '';
                            this.confirmPass = '';
                            this.callTimeout();
                        }).catch((error) => {
                            this.errorMsg = error.response.data;
                            this.$refs.form.reset()
                            this.$refs.form.resetValidation()
                        })
                    }
                }
            },
            //Change pwd variable back after set time so user can change password again later
            callTimeout() {
                setTimeout(function(){ 
                    this.pwdSuccess = false; 
                    }, 3000);
            }
        }
    }
</script>

<style lang="scss" scoped>
    h2 {
        text-align: center;
        color: #f47174;
    }
</style>