<template>
  <v-app>
    <v-main>
      <router-view :key="$route.fullPath"/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

    * {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        font-family:  'Roboto', sans-serif;
    }

</style>
