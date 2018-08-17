<template>
  <v-container fluid grid-list-md class="flex-directio-column">
    <v-layout row wrap>
      <v-flex

        v-for="policy in items"
        :key="policy.id" 
        xs12
        sm6
        md4
        lg3
      >
        <v-card color="secondary">
          <v-card-title   :class="policy.transaction+` subheading font-weight-bold`">
            <a  target="_blank"   :href='`https://rinkeby.etherscan.io/tx/`+policy.name'>{{ policy.name }}</a>
            </v-card-title>

          <v-divider></v-divider>
         
         
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
              <v-list-tile-content  class="font-weight-bold">Insurer:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ getInsurer(policy.insurer) }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Assessor:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ getAssessor(policy.assessor) }}</v-list-tile-content>
            </v-list-tile>
 

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Start time:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.startTime | moment("dddd, MMMM Do YYYY") }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">End time :</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ policy.endTime | moment("dddd, MMMM Do YYYY")}}</v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="text-center align-center text-right" v-if="!policy.claim.payout">
                <v-list-tile-content class="align-end title font-weight-black mr-2"> <img 
              src="http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
            width="32"
               alt=""></v-list-tile-content>
             
              <v-list-tile-content class="text-left align-start title font-weight-black"> {{policy.token}}</v-list-tile-content>
            </v-list-tile>
         
               <v-list-tile class="text-center align-center text-right" v-if="policy.claim.payout">
                <v-list-tile-content class="align-end title font-weight-black mr-2"> <div><img 
              src="http://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
            width="32" style="vertical-align:middle;"
               alt=""></div> </v-list-tile-content>
                  <v-list-tile-content class="text-left align-start title font-weight-black">Payout {{policy.claim.payout}}</v-list-tile-content>
           
               </v-list-tile>
           <v-list-tile class="text-center align-center">
            <claim  :loading="policy.pending" :policy="policy"  class="mb-0 mt-2" ></claim>
            
              </v-list-tile>
          </v-list>
        </v-card>

      </v-flex>
      <v-flex v-show='!items.length' text-center mt-5 mb-5>
         <h1 style="text-align:center;">NO INSURANCE POLICIES. ADD NEW POLICY BY BUTTON BELLOW</h1>
      </v-flex>
   </v-layout>
       
   <policy-dialog v-on:complete="getPendingTransaction"></policy-dialog>   
  </v-container>
</template>
<script>
 // eslint-disable-next-line
var apiURLetherscan = 'https://api-rinkeby.etherscan.io/api?module=transaction&action='
const PolicyDialogCmp = () => import('./Policy/Policy.vue')
const ClaimCmp = () => import('./Claim.vue')
export default {
   components: {
     'policy-dialog': PolicyDialogCmp,
     'claim': ClaimCmp
   },
   data: () => ({
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
     getInsurer (id) {
       if (id) { return this.$store.state.insurers.insurers[id].name } else return ''
     },

     getPendingTransaction ({txHash, policyId}) {
      // return axios.get(apiURLetherscan + 'gettxreceiptstatus&txhash=' + txHash + '&apikey=' + this.api_token_etherscan)
      //   .then((res) => {
      //     this.$store.dispatch('setPending',policyId)
      //     this.ethAdressBalance = res.data.result
      //   })
     // gettxreceiptstatus&txhash=0x513c1ba0bebf66436b5fed86ab668452b7805593c05073eb2d51d3a52f480a76&apikey=YourApiKeyToken
     }
   },
   computed: {

     items () {
       return this.$store.getters.getPolicies
     }
   },
   mounted () {

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
.v-list__tile .v-dialog__container{
  width: 100%;
}
</style>
