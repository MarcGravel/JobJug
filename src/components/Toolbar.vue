<template>
    <div>
        <div id="toolBar">
            <div id="sortByContainer">
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Toolbar",
        props: ["user"],
    }
</script>

<style lang="scss" scoped>
    #toolBar {
        z-index: 99;
        width: 100vw;
        height: 84px;
        position: fixed;
        margin-top: 56px;
        background-color: #2b6777;
        box-shadow: 0 3px 15px -5px black;
        color: #f5fffd;
    }

    @media screen and (min-width: 700px) {
        #toolBar {
            margin-top: 68px;
        }
    }

    @media screen and (min-width: 1100px) {
        #toolBar {
            margin-top: 0;
            height: 120px;
        }
    }
</style>