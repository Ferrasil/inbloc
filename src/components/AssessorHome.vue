<template>
<v-container fluid grid-list-md>
  <v-chip color="secondary"><h1 class="white--text">All raised Claims</h1></v-chip>
  <v-layout row wrap>
    <v-flex xs12 sm4 v-for="(policy,index) in policies" v-bind:key="policy.name">
      <v-card > <v-carousel     style="height:270px;">
        <v-carousel-item
      v-for="(item,i) in getImgs(policy)"
      :key="i"
  
      cycle="false"
      :src="item.src"
    ></v-carousel-item></v-carousel>
        <!-- <v-card-media
          src="https://ccrslaw.com/wp-content/uploads/2017/12/pain-and-suffering.jpg"
          height="200px"
        >
        </v-card-media> -->

        <v-card-title primary-title>
          <div>
            <div class="headline">{{ policy.subtype }} {{ policy.model }}</div>
            <span class="grey--text">{{ policy.type }} / 5N1ED28T54C614210 (e.g. VIN code)</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat v-on:click="hidePolicy(index);"  v-if="!policy.claim.payout">Hide claim</v-btn>
          <v-btn flat color="green"  v-if="policy.claim.payout">Under an approval</v-btn>
          <v-dialog v-model="policy.dialog" persistent max-width="400px" v-if="!policy.claim.payout">
            <v-btn slot="activator"   color="secondary">Settle the claim</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Settle the claim of <font class="txID">{{policy.name}}</font></span>

        </v-card-title>
        <v-card-text class="pt-0">
            <v-list dense>
            <v-list-tile>
              <v-list-tile-content class="font-weight-bold">Product type:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.type }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Model:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.subtype }} {{ policy.model }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Start time:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.startTime | moment("dddd, MMMM Do YYYY") }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">End time :</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.endTime | moment("dddd, MMMM Do YYYY")}}</v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="text-center align-center text-right">
                <v-list-tile-content  class="font-weight-bold">Contract cost :</v-list-tile-content>

              <v-list-tile-content class="text-right "><div><img 
              src="http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
            width="18" style="vertical-align:middle;"> {{policy.token}}</div></v-list-tile-content>
            </v-list-tile> 
          </v-list>
          <v-divider></v-divider>
          <v-layout row align-center>
      <v-flex xs4>
        <v-subheader>Payout</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          label="Payout"
          v-model="payout"
          value="10.00"  single-line
          suffix="ETH"
        ></v-text-field>
      </v-flex>
    </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-chip color="green" v-if="status==3" text-color="white">Full payout</v-chip>
    <v-chip color="red" v-else-if="status==4" text-color="white">No payout</v-chip>
    <v-chip color="yellow darken-1" v-else-if="status==5" text-color="white">Partial payout</v-chip>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="policy.dialog = false">Close</v-btn>
          <v-btn color="primary darken-1"  :loading="loading"
           :disabled="!payout"
           @click.native="settleClaim(policy,payout,status)">Settle</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
          
          <v-spacer></v-spacer>
          <v-btn icon @click="policy.show = !policy.show ">
            <v-icon>{{ policy.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-slide-y-transition>
          <v-card-text v-show="policy.show"  > 
          <v-list-tile>
               {{policy.claim.info}}
            </v-list-tile>
          <v-list dense>
            
            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Start time:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.startTime | moment("dddd, MMMM Do YYYY") }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">End time :</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.endTime | moment("dddd, MMMM Do YYYY")}}</v-list-tile-content>
            </v-list-tile>
             <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Any other detail</v-list-tile-content>
              <v-list-tile-content class="align-end"> about policy/claim...</v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="text-center align-center text-right">
                <v-list-tile-content class="align-end title font-weight-black mr-2"> <img 
              src="http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
            width="32"
               alt=""></v-list-tile-content>


            
              <v-list-tile-content class="text-left align-start title font-weight-black"> {{policy.token}}</v-list-tile-content>
            </v-list-tile>
              <v-btn round small color="secondary"  > <a  target="_blank"  class="tx-hash white--text"  :href='`https://rinkeby.etherscan.io/tx/`+policy.name'>{{ policy.name }}</a></v-btn>
             
               </v-list>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>
<script>
// eslint-disable-next-line
import getContract from '@/utils/getContract'
 // eslint-disable-next-line
var apiURLetherscan = 'https://api-rinkeby.etherscan.io/api?module=transaction&action='

export default {

  data: () => ({
    search: '',
    data: [],
    right: null,
    payout: null,
    loading: false,
    status: false,
    policies: [],
    claimPending: false,
    api_token_etherscan: 'BEA4FM7K4ZT3D7CRC28H6J19I7USTPI87Z'
  }),
  watch: {
    payout (val) {
      if (parseFloat(val) === 0) { this.status = 4 } else if (parseFloat(val) >= 10) { this.status = 3 } else if (parseFloat(val) > 0) { this.status = 5 }
    },
    items () {
      this.itemsLoading = false
    }
  },
  methods: {

    hidePolicy (index) {
      this.policies.splice(index, 1)
    },
    settleClaim (policy, payout, status) {
      let store = this.$store
      policy.status = status
      policy.claim = {...policy.claim, payout}
      console.log(policy)
      this.loading = true
      store.dispatch('updateClaim', policy).then(() => {
        this.loading = false
        policy.dialog = false
      })
    },
    getImgs (policy) {
      if (policy.claim.claimURL) return [{src: policy.claim.claimURL}]
      else {
        return [
          {
            src: 'https://ccrslaw.com/wp-content/uploads/2017/12/pain-and-suffering.jpg'
          },
          {
            src: 'https://bloximages.newyork1.vip.townnews.com/wtxl.com/content/tncms/assets/v3/editorial/c/80/c8061d38-4c83-11e7-945a-0f3ebe459fe6/5939aab0c61b5.image.jpg'
          },
          {
            src: 'https://localtvwhnt.files.wordpress.com/2017/08/car-accident-image.png?w=400&h=225&crop=1'
          },
          {
            src: 'https://www.zirkinandschmerlinglaw.com/wp-content/uploads/what-do-i-do-if-i-am-in-a-car-accident-in-maryland-1.jpg'
          }
        ]
      }
    }
  },
  computed: {

  },
  mounted () {
    var th = this
    this.$store.dispatch('getAllClaimed').then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
        th.policies.push({...doc.data(), show: false, id: doc.id})
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
.tx-hash {
  text-decoration: none;
  font-size: 10.5px;
}
</style>
