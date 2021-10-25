<template>
    <div id="loginPage" @click="hideMsg">
            <h1 id="title">
                JobJug
            </h1>
            <div id="slogan">
                <hr>
                <h2>
                    Project managment.
                </h2>
                <h2>
                    <i>Simplified.</i>
                </h2>
            </div>
            <div id="formContainer">
                <v-form id="loginForm" v-model="formValid">
                    <v-text-field
                        v-model="email"
                        :rules="[emailRules.required, emailRules.valid]"
                        label="Email"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[passRules.required, passRules.min, passRules.max]"
                        :type="show1 ? 'text' : 'password'"
                        label="Password"
                        @click:append="show1 = !show1"
                        @keydown.enter="submitWithEnterButton"
                        required
                    ></v-text-field>
                    <div id="errorLogin">
                        <h3>Invalid Credentials. Try again.</h3>
                    </div>
                    <v-btn id="loginBtn"
                        depressed
                        :disabled="!formValid"
                        color="primary" 
                        @click="loginRequest">
                            Log In
                    </v-btn>
                </v-form>
            </div>
            <div id="footer">
                <PageFooter />
            </div>
    </div>
</template>

<script>
import PageFooter from '@/components/PageFooter.vue'
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "Login",
        components: {
            PageFooter
        },
        computed: {
            getToken() {
                return cookies.get('sessionToken') 
            },
        },
        //if token exists, redirect to home
        beforeMount() {
            if (this.getToken != undefined) {
                router.push('/home');
            }
        },
        data() {
            return  {
                email: '',
                emailRules: {
                    required: v => !!v || 'E-mail is required',
                    valid: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                },
                password: '',
                passRules: {
                    required: value => !!value || 'Required.',
                    min: v => v.length >= 6 || 'Min 6 characters',
                    max: v => v.length <= 50 || 'Max 50 characters',
                },
                formValid: false,
                show1: false,
            }
        },
        methods: {
            loginRequest() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/login',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'email': this.email,
                        'password': this.password
                    }
                }).then((response) => {
                    cookies.set('sessionToken', response.data.sessionToken)
                    cookies.set('userId', response.data.userId)
                    router.push('/home')
                }).catch((error) => {
                    console.log(error.response.data);
                    document.getElementById('errorLogin').style.display = "block";
                })
            },
            hideMsg() {
                document.getElementById('errorLogin').style.display = "none";
            },
            //allows user to submit the form by hitting enter button while inputs are selected 
            submitWithEnterButton() {
                this.loginRequest();
            },
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #loginPage {
        width: 100%;
        height: 100vh;
        display: grid;
        grid-template-rows: 20vh 10vh 55vh 15vh;
        align-items: center;
        justify-items: center;
        background-color: #52ab98;

        #title {
            font-family: 'Righteous', cursive;
            font-size: 5em;
            color: #2b6777;
        }

        #slogan {
            display: grid;
            justify-items: center;

            h2 {
                font-family: 'Raleway', sans-serif;
                color: #4a6c85;
            }

            hr {
                margin-bottom: 2vh;
                width: 50%;
            }
        }

        #formContainer {
            grid-row: 3;
            width: 90%;
            height: 60%;
            padding: 5vh 5vw 5vh 5vw;
            border-radius: 50px;
            align-self: start;

            #loginForm {   
                width: 100%;
                height: 100%;
                display: grid;

                #loginBtn {
                    justify-self: center;
                    padding: 0 15vw 0 15vw;
                }

                #errorLogin {
                    display: none;
                }
            }

            #errorLogin {
                h3 {
                    color: #cc0000;
                }
            }
        }

        #footer {
            grid-row: 4;
            height: 15vh;
        }
    }

    @media screen and (min-width: 768px) {
        #loginPage {

            #slogan {

                hr {
                    margin-bottom: 2vh;
                    width: 50%;
                }
            }

            #formContainer {
                width: 70%;
            }
        }
    }

    @media screen and (min-width: 900px) {
        #loginPage {
            background-color: #f5fffd;
        }
    }

    @media screen and (min-width: 1100px) {
        #loginPage {

            #slogan {

                hr {
                    margin-bottom: 2vh;
                    width: 200%;
                }
            }

            #formContainer {
                width: 50%;

                #loginForm {

                    #loginBtn {
                        padding: 0 5vw 0 5vw;
                    }
                }
            }
        }
    }
</style>