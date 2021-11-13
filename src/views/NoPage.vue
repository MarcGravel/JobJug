<template>
    <div>
        <div id="notFoundContainer">
            <img src="@/assets/404Page.png" alt="404 page not found">
            <h1 id="sorryMsg">Sorry the page you requested was not found.</h1>
            <h1 id="homeLink" @click="routeHome">Go Home</h1>
            <a href='https://pngtree.com/so/error'>error png from pngtree.com/</a>
        </div>
    </div>
</template>

<script>
import router from '../router'

    export default {
        name: "NoPage",
        methods: {
            routeHome() {
                router.push("/schedule")
            }
        }
    }
</script>

<style lang="scss" scoped>
    #notFoundContainer {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-rows: 60% 20% 10% 10%;
        overflow-y: hidden;

        img {
            grid-row: 1;
            width: 80vw;
            align-self: end;
            justify-self: center;
        }

        #sorryMsg {
            grid-row: 2;
            justify-self: center;
            align-self: center;
            text-align: center;
            font-family: 'Righteous', cursive;
            color: #2b6777;
        }

        #homeLink {
            grid-row: 3;
            justify-self: center;
            align-self: center;
            font-family: 'Righteous', cursive;
            color: #2b6777;
            text-decoration: underline;
        }

        a {
            grid-row: 4;
            justify-self: center;
            align-self: end;
            margin-bottom: 2vh;
        }
    }

@media screen and (min-width: 1100px){
    #notFoundContainer {
        width: 100vw;
        height: 100vh;
        grid-template-columns: 50vw 25vw 25vw;
        grid-template-rows: 50vh 50vh;

        img {
            grid-row: 1 / 3;
            grid-column: 1;
            justify-self: end;
            align-self: center;
            width: 60%;
            margin-right: 1vw;
        }

        #sorryMsg {
            grid-row: 1 / 3;
            grid-column: 2;
            justify-self: start;
            text-align: start;
            margin-left: 1vw;
        }

        #homeLink {
            grid-row: 2;
            grid-column: 1 / 4;
            margin-top: 15vh;
            cursor: pointer;
        }

        a {
            grid-row: 2;
            grid-column: 1 / 4;
            justify-self: center;
            align-self: end;
            margin-bottom: 2vh;
        }
    }   
}
</style>