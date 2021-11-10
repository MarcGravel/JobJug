<template>
    <div>
        <v-form id="editForm" v-model="formValid">
            <h1 id="formTitle">Edit Client</h1>
            <v-btn id="deleteClientBtn"
                color="error" 
                @click="removeClient()"
                >
                    Delete Client
            </v-btn>
            <v-text-field
                v-model="updClient.name"
                placeholder="Limit 60 characters"
                :rules="[nameRules.required, nameRules.length]"
                label="Name"
            ></v-text-field>
            <v-text-field
                v-model="updClient.company"
                placeholder="Limit 100 characters"
                :rules="[companyRules.length]"
                label="Company"
            ></v-text-field>
            <v-text-field
                v-model="updClient.address"
                placeholder="Limit 100 characters"
                :rules="[addressRules.length]"
                label="Address"
            ></v-text-field>
            <v-text-field
                v-model="updClient.email"
                placeholder="Limit 50 characters"
                :rules="[emailRules.length, emailRules.valid]"
                label="Email"
            ></v-text-field>
            <v-text-field
                v-model="updClient.phone"
                placeholder="Limit 20 characters"
                :rules="[phoneRules.length]"
                label="Phone"
            ></v-text-field>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendUpdClientData()"
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
        name: "EditClient",
        props: ["editClient"],
        data() {
            return {
                updClient: {
                    name: this.editClient.name,
                    company: this.editClient.company,
                    address: this.editClient.address,
                    email: this.editClient.email,
                    phone: this.editClient.phone
                },
                formValid: false,
                nameRules: {
                    required: v => !!v || 'Name is required',
                    length: v => v.length  <= 60 || 'Max 60 characters'
                },
                companyRules: {
                    length: v => (v != null && v.length  <= 100) || 'Max 100 characters'
                },
                addressRules: {
                    length: v => (v != null && v.length  <= 100) || 'Max 100 characters'
                },
                emailRules: {
                    length: v => (v != null && v.length  <= 50) || 'Max 50 characters',
                    valid: v => /.+@.+\..+/.test(v) || v == '' || 'E-mail must be valid'
                },
                phoneRules: {
                    length: v => (v != null && v.length  <= 20) || 'Max 20 characters'
                },
            }
        },
        methods: {
            closeOverlay() {
                this.$emit("closeOverlay")
            },
            removeClient() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/clients',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "clientId": this.editClient.clientId
                    }
                }).then(() => {
                    this.$emit("closeOverlay")
                    this.$emit("loadClients")
                }).catch((error) => {
                    console.log(error.response.data);
                })
            },
            sendUpdClientData() {
                let session = cookies.get('session');
                let token = session.token;

                this.updClient.sessionToken = token;
                this.updClient.clientId = this.editClient.clientId;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/clients',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.updClient
                }).then((response) => {
                    console.log(response.data[0]);
                    this.$emit("closeOverlay")
                    this.$emit("loadClients")
                }).catch((error) => {
                    console.log(error.response.data);
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

        #deleteClientBtn {
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
    }
</style>