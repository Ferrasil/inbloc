<template>
  <v-app >
    <v-navigation-drawer app temporary v-model="sideNav">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="userIsAuthenticated"
          @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="secondary">
      <!-- <v-toolbar-side-icon  
        @click.stop="sideNav = !sideNav"
        ></v-toolbar-side-icon> -->
      <router-link :to="mainLink" tag="span" style="cursor: pointer"><v-toolbar-title class="logo-text secondary lighten-1">
        INBLOC
      </v-toolbar-title></router-link>  <v-chip color="accent" white>{{pageTitle}}</v-chip>
      <v-spacer></v-spacer>
       <v-progress-linear v-show="readyState" color="secondary" :indeterminate="true"></v-progress-linear>
      <app-metamask v-show="!userIsAuthenticated"></app-metamask>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
</v-btn>
        <v-btn
          v-if="userIsAuthenticated"
          flat
          @click="onLogout">
          <v-icon left dark>exit_to_app</v-icon>
          Logout
</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main app fill-height class="accent">
      <router-view></router-view>
    </main>

    <v-footer
    height="auto"
    color="secondary"
  >
    <v-layout
      justify-center
      row
      wrap
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        flat
        round
      >
        {{ link }}
      </v-btn>
      <!-- <v-flex
        accent
        lighten-2
        py-3
        text-xs-center
        
        xs12
      >
        &copy;2018 — <strong>INBLOC</strong>
      </v-flex> -->
    </v-layout>
  </v-footer>
  </v-app>
</template>
<script>
  export default {
    data () {
      return {
        links: [
          'Terms of use',
          'Privacy policy',
          'Contact us' ],
        sideNav: false
      }
    },
    computed: {
      mainLink () {
        if (this.userIsAuthenticated) { return '/dashboard' } else { return '/' }
      },
      readyState () {
        return this.$store.state.shared.loading
      },
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign in', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'assignment', title: 'Insurer', link: '/insurer'},
            {icon: 'assignment_ind', title: 'Assessor', link: '/assessor'},
            {icon: 'person', title: 'Profile', link: '/profile'}
          ]
        }
        return menuItems
      },
      pageTitle () {
        return this.$route.meta.title
      },
      authenticatedMenu () {
        if (this.userIsAuthenticated) {
          return [
            {icon: 'face', title: 'Sign up', link: '/signup'},
            {icon: 'lock_open', title: 'Sign in', link: '/signin'}
          ]
        } else return null
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    beforeCreate () {
      console.log('registerWeb3 Action dispatched from App.vue')
      this.$store.dispatch('registerWeb3')
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/')
      }
    }
  }
</script>
<style scoped>
.logo-text{font-weight: 300;
    margin: 0px 0;
    padding: 17px 20px;
    min-width: 112px;
    margin-right: 15px;}
  
footer {
  overflow: hidden;
}
main {
  height: 100%;
}
</style>
