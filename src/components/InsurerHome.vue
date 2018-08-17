<template>

  <v-container fluid grid-list-md>
    <v-layout row wrap>
   <v-flex xs12 sm3>
      <v-card>
        <v-toolbar color="light-blue" dark>


          <v-toolbar-title>New insurances</v-toolbar-title>

          <v-spacer></v-spacer>
 
        </v-toolbar>

        <v-list two-line subheader>
        
          <v-list-tile
            v-for="item in items"
            :key="item.title"
            avatar 
            
          >
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
             
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
  
        </v-list>
      </v-card>
    </v-flex>
  <v-flex lg9 class="layout row wrap">
      <v-card width="100%">
    <v-card-title>
      <h2>My insurances</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="policies"
      :total-items="10"
      :search="search"
    >
      <template slot="items" slot-scope="policy">
        <td><a  target="_blank"   :href='`https://rinkeby.etherscan.io/tx/`+policy.item.name'><v-icon>compare_arrows</v-icon></a></td>
        <td class="text-xs-right">{{ policy.item.type }}</td>
        <td class="text-xs-left">{{ policy.item.subtype }} {{ policy.item.model }}</td>
        <td class="text-xs-right">{{ policy.item.startTime | moment("DD.MM.YYYY") }}</td>
        <td class="text-xs-right">{{ policy.item.endTime | moment("DD.MM.YYYY")}}</td>
        <td class="text-xs-right nowrap">
          <img    style="vertical-align:middle;" class="mr-2"
          src="http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
            width="16" >{{policy.item.token}}
        </td>
        <td>
            <v-btn    block class="mb-0 mt-2" flat  v-show="policy.item.status === 1" >Active</v-btn>
            <v-tooltip left>
            <v-btn  slot="activator"  @click="showClaim(policy.item)" block color="yellow darken-3" class="mb-0 mt-2" depressed v-show="policy.item.claim&&policy.item.status === 2" >Raised</v-btn>
           <span> Show claim</span>
          </v-tooltip>
           <v-tooltip left>
            <v-btn slot="activator" block @click="showClaim(policy.item)"  color="error darken-2" class="mb-0 mt-2" depressed v-show="policy.item.claim&&policy.item.status === 3" >Settled : Payout</v-btn>
            <span> Show claim</span>
             </v-tooltip>    <v-tooltip left>
             <v-btn slot="activator"  block @click="showClaim(policy.item)"   color="green darken-1 white--text" class="mb-0 mt-2"  depressed v-show="policy.item.claim&&policy.item.status === 4" >Settled : No payout</v-btn>
        <span> Show claim</span>
             </v-tooltip>    <v-tooltip left>
            <v-btn slot="activator"  block @click="showClaim(policy.item)"  color="yellow darken-3" class="mb-0 mt-2"  depressed v-show="policy.item.claim&&policy.item.status === 5" >Settled : Partial payout</v-btn>
        <span> Show claim</span>
             </v-tooltip>
        </td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
  </v-flex>
   </v-layout>   
    <v-dialog
      v-model="claimDialog"
      max-width="400"
    >
    <v-card>
        <v-card-media
          v-bind:class="{ 'white--text': claimModal.claim.claimURL }"
          height="200px"
          :src="getURL(claimModal.claim.claimURL)"
        >
          <v-container fill-height fluid>
            <v-layout fill-height justify-space-between column >
              <v-flex xs12 align-start flexbox>
                <span class="headline">Claim for contract <font class="txID">{{claimModal.name}}</font></span>
              </v-flex>
              <v-flex sm12  align-end v-show="claimModal.claim.payout">
              <h3>Payout: {{claimModal.claim.payout}} $</h3>
              
            </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-title>
          <v-layout>
            <v-flex sm12>
            <span class="grey--text">{{ claimModal.subtype }} {{ claimModal.model }}</span><br>
            <span>{{claimModal.claim.info}}</span><br>
            <span>{{claimModal.claim.dateAt | moment("DD.MM.YYYY")}}</span>
            </v-flex>
            
          </v-layout>
        </v-card-title>
        <v-card-actions>
            <v-btn

            flat="flat"
            @click="claimDialog = false"
          >
            Close
          </v-btn>
              <v-spacer></v-spacer>
          <v-btn v-if="claimModal.status!=2"
          :loading="loading"
            color="red darken-1 white--text"
            @click="settleClaim(claimModal,2)"
          >
            Disagree
          </v-btn>

          <v-btn v-if="claimModal.status!=2"
          :loading="loading"
            color="green darken-1 white--text"
            @click="settleClaim(claimModal,claimModal.status)"
          >
            Settle
          </v-btn>
        </v-card-actions>
      </v-card> 
    </v-dialog> 
   </v-container>
</template>
<script>
// eslint-disable-next-line
import getContract from '@/utils/getContract'
// eslint-disable-next-line
import db from '@/db' 
 // eslint-disable-next-line
var apiURLetherscan = 'https://api-rinkeby.etherscan.io/api?module=transaction&action='

export default {

  data: () => ({
    search: '',
    claimDialog: false,
    claimModal: {claim: {}},
    loading: false,
    items: [
          { icon: 'directions_boat', iconClass: 'secondary lighten-1 white--text', token: 2, title: 'Super boat brand', subtitle: 'Big crusader' },
          { icon: 'directions_car', iconClass: 'light-blue  white--text', title: 'Ford', token: 1, subtitle: 'Focus 2' },
          { icon: 'directions_bike', iconClass: 'secondary  darken-1 white--text', token: 3, title: 'Suzuki', subtitle: 'R100' },
          { icon: 'directions_bike', iconClass: 'secondary  darken-1  white--text', token: 5, title: 'Kawasaki', subtitle: 'BR323' },
          { icon: 'directions_car', iconClass: 'light-blue white--text', title: 'Tesla', token: 4, subtitle: 'X' }

    ],
    headers: [
          { text: 'txID', value: 'name', sortable: false },
      {
        text: 'Product type',
        align: 'left',
        sortable: false,
        value: 'type'
      },
          { text: 'Model', value: 'subtype' },
          { text: 'Start time', value: 'startTime' },
          { text: 'End time', value: 'endTime' },
          { text: 'Cost', value: 'token' },
          { text: 'Actions', value: '', sortable: false }
    ],
    data: [],
    right: null,
    policies: [],
    claimPending: false,
    api_token_etherscan: 'BEA4FM7K4ZT3D7CRC28H6J19I7USTPI87Z'
  }),
  watch: {
    items () {
      this.itemsLoading = false
    }
  },
  methods: {
    getAssessor (id) {
      if (id) { return this.$store.state.assessors.assessors[id].name } else return ''
    },
    getURL (url) {
      if (url) return url
      else return 'https://allmods.net/wp-content/uploads/2018/08/no-image-available.png'
    },
    showClaim (policy) {
      this.claimModal = policy
      this.claimDialog = true
    },
    settleClaim (policy) {
      let store = this.$store
      policy.claim = this.claim
      this.loading = true

      store.dispatch('setPending', policy.id)
      store.dispatch('updateClaim', policy).then(() => {
        this.loading = false
        this.claimDialog = false
      })
    },
    getInsurer (id) {
      if (id) { return this.$store.state.insurers.insurers[id].name } else return ''
    }
  },
  computed: {

  },
  mounted () {
    var th = this
    this.$store.dispatch('getAllInsurances').then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
        th.policies.push(doc.data())
        console.log(doc.id, ' => ', doc.data())
      })
    }, error => {
      console.error('Got nothing from server. Prompt user to check internet connection and try again' + error)
    })
// https://api-rinkeby.etherscan.io/api?module=transaction&action=getstatus&txhash=0x5314a7614623cda0d8ddc045006beb5503ac7718e247204c2a25376f14f3622d&apikey=BEA4FM7K4ZT3D7CRC28H6J19I7USTPI87Z
  }
}
</script>
<style scoped>
.subheading a{
      color: white;
    font-size: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    direction: rtl;
}
.txID{max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    direction: rtl;}
</style>
