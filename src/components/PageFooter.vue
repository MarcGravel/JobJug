<template>
    <div id="footer">
        <img src="@/assets/logo.png" alt="Logo">
        <h4>JobJug 2021 ©</h4>
    </div>
</template>

<script>
    export default {
        name: "PageFooter"
    }
</script>

<style lang="scss" scoped>
    #footer {
        width: 100vw;
        height: 100%;
        background-color: #52ab98;
        display: grid;
        justify-items: center;
        align-items: center;

        img {
            height: 5vh;
            max-width: 200px;
        }

        h4 {
            color: #4a6c85;
        }
    }

    @media screen and (min-width: 900px) {
        #footer {
        background-color: #f5fffd;
        display: grid;
        grid-template-columns: 50% 50%;

        img {
            grid-column: 1;
            justify-self: end;
        }

        h4 {
            grid-column: 2;
            justify-self: start;
            margin-top: 3vh;
        }
    }
    }
</style>