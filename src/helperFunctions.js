import cookies from 'vue-cookies'
import axios from 'axios'
import router from '../src/router'

function getCookiesAndUser() {
    cookies.get('session');
    let user;
    let token;
    let userId;
    let retObject;

    if (this.sessionCookie == undefined) {
        router.push('/');
    }
    else {
        if (this.sessionCookie.token == undefined) {
            router.push('/');
        }
        else {
            token = this.sessionCookie.token;
            userId = this.sessionCookie.userId; 

            if (this.$store.state.userInfo != undefined) {
                user = this.$store.state.userInfo;
            } else {
                //load user data if cookies exists and store does not already contain user data
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        'userId': this.userId
                    }
                }).then((response) => {
                    user = response.data[0]
                }).catch((error) => {
                    console.log(error + ' error');
                })
            }

            retObject = {user, token, userId};
            return retObject;
        }
    }
}


