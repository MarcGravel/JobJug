<template>
    <div>
        <h1>Home Page</h1>
    </div>
</template>

<script>
import router from '../router'
import cookies from 'vue-cookies'

    export default {
        name: "Home",
        computed: {
            getToken() {
                return cookies.get('sessionToken') 
            },
        },
        //if token not valid, redirect to login
        beforeMount() {
            if (this.getToken == undefined) {
                router.push('/');
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>