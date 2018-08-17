<template>
 <v-container mb-2 text-center>
    <v-dialog  v-model="dialog"  max-width="720px"  >
      <v-btn block v-show="!policy.claim&&policy.status === 1" color="secondary"  slot="activator" ma-0><v-icon left dark>gavel</v-icon> Make a claim</v-btn>
<v-btn block color="yellow darken-2 white--text" class="mb-0 mt-2" slot="activator"  depressed v-show="policy.claim&&policy.status === 2" >Claim Raised</v-btn>
<v-btn block color="green darken-2" class="mb-0 mt-0" depressed  slot="activator" v-show="policy.claim&&policy.status === 3" >Claim Settled : Payout</v-btn>
<v-btn block color="error darken-1" class="mb-0 mt-0"  depressed  slot="activator" v-show="policy.claim&&policy.status === 4" >Claim Settled : No payout</v-btn>
<v-btn block color="yellow darken-3 white--text" class="mb-0 mt-0"  slot="activator"  depressed v-show="policy.claim&&policy.status === 5" >Claim Settled : Partial payout</v-btn>
      <v-card v-if="!policy.claim&&policy.status === 1" color="accent">
        <v-card-title>
          <span class="headline font-weight-thin">Fill the details of claim</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="primary darken-1"  :loading="loading" @click.native="addClaim(policy)">Register   <v-icon right dark>assignment_turned_in</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md pa-0>
            <v-layout wrap>
                <v-flex xs12 sm8 md8>
                    
                    <file-upload v-on:url="claim.claimURL = $event"></file-upload>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <img :src="claim.claimURL" v-show="claim.claimURL" alt="" style="max-height:250px;max-width:100%;">
                </v-flex>
              <v-flex xs12 sm6 md6>
                Infromation
                <v-textarea
          solo 
          v-model="claim.info"
          label="Solo textarea"
        placeholder="Write here your details about an accident"
        ></v-textarea>
             </v-flex>    
              <v-flex xs12 sm6 md4>
                  Date of accident
                     <v-date-picker v-model="claim.dateAt" color="cyan lighten-1" header-color="primary"></v-date-picker>
              </v-flex> 
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
        </v-card-actions>
      </v-card>
      <v-card v-else>
           <v-card-title>
          <span class="headline font-weight-thin">Details of claim/status</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
         </v-card-title>
        <v-card-text>
                 <img :src="policy.claim.claimURL" v-show="policy.claim.claimURL" alt="" style="max-height:250px;max-width:100%;">
             {{policy.claim.info}}  {{policy.claim.dateAt}}
        </v-card-text> 
      </v-card>
    </v-dialog>
    <v-snackbar
        :top="true"
      v-model="snackbar"
      color="success"
      :timeout="6000"
    >
     Claim raised!
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

 </v-container>
</template>
<script>
const FileUploadCmp = () => import('./FileUploader.vue')
export default {
  components: {
    'file-upload': FileUploadCmp
  },
  props: ['policy'],
  data: () => ({
    claim: {
      info: null,
      dateAt: null,
      claimURL: false
    },
    loading: false,
    snackbar: false,
    dialog: false
  }),
  methods: {
    addClaim (policy) {
      let store = this.$store
      policy.claim = this.claim
      this.loading = true

      store.dispatch('setPending', policy.id)
      store.dispatch('addClaim', policy).then(() => {
        this.dialog = false
        this.snackbar = true
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.text-center{text-align:center;}
</style>
