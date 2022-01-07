<template>
    <div id="footer">
        <img id="image" src="@/assets/jobjugLogo.png" alt="Logo">
        <h4 id=deskTop>JobJug</h4>
        <h4>2021 ©</h4>
    </div>
</template>

<script>
    export default {
        name: "PageFooter"
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #footer {
        width: 100vw;
        height: 15vh;
        background-color: #52ab98;
        display: grid;
        justify-items: center;
        align-items: center;
        grid-template-columns: 50% 50%;

        img {
            height: 15vh;
            max-width: 200px;
            justify-self: end;
            padding-bottom: 3vh;
        }

        h4 {
            color: #2b6777;
            grid-column: 2;
            justify-self: start;
            padding-left: 50px;
            align-self: center;
            font-size: 1.5em;
            font-family: 'Righteous', cursive;
            padding-bottom: 3vh;
        }

        #deskTop {
            display: none;
        }
    }

    @media screen and (max-width: 335px) {
        #footer {
            img {
                position: relative;
                left: 10vw;
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #footer {
            height: 100%;
            background-color: #f5fffd;
            align-items: end;

            #image {
                display: none;
                padding-bottom: 0;
            }

            #deskTop {
                display: inline-block;
                grid-column: 1;
                justify-self: end;
                font-size: 1.6em;
            }

            h4 {
                align-self: end;
                padding-bottom: 0;
            }
        }
    }
</style>