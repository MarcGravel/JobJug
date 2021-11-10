<template>
    <div>
        <v-form id="createForm" v-model="formValid">
            <h1 id="formTitle">Create New Client</h1>
            <v-text-field
                v-model="newClient.name"
                placeholder="Limit 60 characters"
                :rules="[nameRules.required, nameRules.length]"
                label="Name"
            ></v-text-field>
            <v-text-field
                v-model="newClient.company"
                placeholder="Limit 100 characters"
                :rules="[companyRules.length]"
                label="Company"
            ></v-text-field>
            <v-text-field
                v-model="newClient.address"
                placeholder="Limit 100 characters"
                :rules="[addressRules.length]"
                label="Address"
            ></v-text-field>
            <v-text-field
                v-model="newClient.email"
                placeholder="Limit 50 characters"
                :rules="[emailRules.length, emailRules.valid]"
                label="Email"
            ></v-text-field>
            <v-text-field
                v-model="newClient.phone"
                placeholder="Limit 20 characters"
                :rules="[phoneRules.length]"
                label="Phone"
            ></v-text-field>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendNewClientData()"
                :disabled="!formValid">
                    Create Client
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
        name: "CreateClient",
        data() {
            return {
                newClient: {
                    name: '',
                    company: '',
                    address: '',
                    email: '',
                    phone: ''
                },
                formValid: false,
                nameRules: {
                    required: v => !!v || 'Name is required',
                    length: v => v.length  <= 60 || 'Max 60 characters'
                },
                companyRules: {
                    length: v => v.length  <= 100 || 'Max 100 characters'
                },
                addressRules: {
                    length: v => v.length  <= 100 || 'Max 100 characters'
                },
                emailRules: {
                    length: v => v.length  <= 50 || 'Max 50 characters',
                    valid: v => /.+@.+\..+/.test(v) || v == '' || 'E-mail must be valid'
                },
                phoneRules: {
                    length: v => v.length  <= 20 || 'Max 20 characters'
                },
            }
        },
        methods: {
            closeOverlay() {
                this.$emit("closeOverlay")
            },
            sendNewClientData() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/clients',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "name": this.newClient.name,
                        "company": this.newClient.company,
                        "address": this.newClient.address,
                        "email": this.newClient.email,
                        "phone": this.newClient.phone
                    }
                }).then(() => {
                    this.$emit("closeOverlay")
                    this.$emit("loadClients")
                }).catch((error) => {
                    console.log(error.response);
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
    }
</style>