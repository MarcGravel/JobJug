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
                <div id="test-credentials">
                    <h3>To test app, log in as a "manager" with:</h3>
                    <h4>E-mail: tim@gmail.com</h4>
                    <h4>Password: burton</h4>
                </div>
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
            sessionCookie() {
                return cookies.get('session') 
            },
        },
        //if token exists, redirect to home
        beforeMount() {
            if (this.sessionCookie != undefined) {
                if (this.sessionCookie.token != undefined) {
                    router.push('/schedule');
                }
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
                    let token = response.data.sessionToken;
                    let userId = response.data.userId;
                    let cookie = {token, userId};
                    cookies.set('session', cookie)
                    this.$store.commit('userData', response.data[0]);
                    router.push('/schedule')
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
        grid-template-rows: 20vh 10vh 60vh 10vh;
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
            min-height: 250px;
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

            #test-credentials {
                background-color: #cbf7e1;
                padding: 1vh 2vw;
                border-radius: 25px;
                text-align: center;
                margin-top: 5vh;
                color: rgb(255, 7, 7);

                h3 {
                    margin-bottom: 1vh;
                }
            }
        }

        #footer {
            grid-row: 4;
            height: 15vh;
        }
    }

    @media screen and (max-height: 650px) {
        #loginPage { 
            
            #slogan {
            hr {
                display: none;
            }
        }

            #footer {
                display: none;
            }
        }
    }

    @media screen and (min-width: 700px) {
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

    @media screen and (min-width: 1100px) {
        #loginPage {
            background-color: #f5fffd;

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