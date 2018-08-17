<template>
<div style="width :100%;">
    <v-dialog  id="new-policy" v-model="dialog" persistent max-width="500px" class="mt-2">
      <v-btn block slot="activator" color="secondary" large dark>Add new policy</v-btn> 
      <v-card pa-0>
        <!-- <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title> -->
        <v-card-text class="pa-0">
        
            <v-stepper v-model="e6" vertical>
            <v-stepper-step color="secondary" :complete="e6 > 1" step="1">
              Select the product you want to insure
              <small>Summarize if needed</small>
            </v-stepper-step>

            <v-stepper-content step="1">
               <v-radio-group v-model="type" row>
                  <v-radio color="primary"
                  v-for="(typeName,type) in types"
                    :key="type"
                    :label="type"
                    :value="type" ></v-radio> 
                </v-radio-group>
              <v-btn color="secondary" @click="e6 = 2;">Continue</v-btn> 
            </v-stepper-content>

            <v-stepper-step color="secondary" :complete="e6 > 2" step="2">Select the model of your product
              
            </v-stepper-step>

            <v-stepper-content step="2">
            
                 <v-autocomplete
                  :loading="loading"
                  :items="subtypes" 
                  v-model="subtype"
                
                  flat
                  hide-no-data
                  hide-details
                  label="Brand of your product"
                  solo-inverted
                ></v-autocomplete>
                 <v-autocomplete
                  :loading="loading"
                  :items="models" 
                  v-model="model"
                
                  :disabled="!subtype"
                  class="mt-1 mb-1"
                  flat
                  hide-no-data
                  hide-details
                  label="Model of your product"
                  solo-inverted
                ></v-autocomplete>
    <!-- :disabled="!model || !subtype" -->
              <v-btn  color="secondary" :disabled="!model || !subtype"
               @click="e6 = 3">Continue</v-btn>
              <v-btn flat  @click="e6 = 1">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step color="secondary" :complete="e6 > 3" step="3">Time and additional info</v-stepper-step>

            <v-stepper-content step="3">
                 <v-layout row wrap> 
                        <v-menu
                  ref="menu"
                  :close-on-content-click="false"
                  v-model="menu"
                  :nudge-right="40"
                  :return-value.sync="startTime"
                  lazy
                  transition="scale-transition"
                  offset-y 
                >
                  <v-text-field
                    slot="activator"
                    v-model="startTime"
                    label="Start date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field> 
                  <v-date-picker v-model="startTime"  @input="$refs.menu.save(startTime)"></v-date-picker>
                </v-menu>

                          <v-menu
                  ref="menu2"

                  :close-on-content-click="false"
                  v-model="menu2"
                  :nudge-right="40"
                  :return-value.sync="completeTime"
                  lazy
                  transition="scale-transition"
                  offset-y
                >
                  <v-text-field
                    slot="activator"
                    v-model="completeTime"
                    label="End date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                   <v-date-picker v-model="completeTime" :min="startTime" @input="$refs.menu2.save(completeTime)"></v-date-picker> 
                </v-menu> 
                </v-layout>
                <v-textarea
                    box 
                    label="Additional info"
                    v-model="addInfo"
                  ></v-textarea>
              <v-btn  color="secondary" @click="e6 = 4" :disabled="!startTime&&!completeTime">Continue</v-btn>
              <v-btn flat  @click="e6 = 2">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step step="4">Summary</v-stepper-step>
            <v-stepper-content step="4">
               <!-- <v-btn flat  @click="e6 = 3">Back</v-btn> -->
              <v-card color="primary" class="mb-1" >
                   <v-list dense>
            <v-list-tile>
              <v-list-tile-content class="font-weight-bold">Product type:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ type }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Model:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ subtype }} {{ model }}</v-list-tile-content>
            </v-list-tile> 

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Start time:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ startTime }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">End time :</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ completeTime }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content  class="font-weight-bold">Additional info :</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ addInfo }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content row class="font-weight-bold align-center"><v-icon>attach_money</v-icon> Insurance cost : 0.1 Ethereum</v-list-tile-content>
            </v-list-tile>
                   </v-list>
              </v-card>  

               <v-btn color="secondary" block :loading="loader" large @click.native="sendTransaction()">Add policy</v-btn>
            </v-stepper-content>
          </v-stepper>  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
         
        </v-card-actions>
      </v-card>
    </v-dialog>
<v-snackbar
        :top="true"
      v-model="snackbar"
      :color="color"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
     </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    snackbar: false,
    color: 'success',
    mode: '',
    token: 0.1,
    loader: false,
    timeout: 6000,
    text: 'Policy has been added',
    dialog: false,
    addInfo: null,
    model: null,
    menu: false,
    loading: false,
    menu2: false,
    startTime: null,
    completeTime: null,
    subtype: null,
    e6: 1,
    models: [],
    type: 'Boat'
  }),
  methods: {
    sendTransaction () {
      this.loader = true
      let web3 = this.$store.state.metamask.web3.web3Instance()
      var message = {from: this.$store.state.user.user.name,
        to: '0x482da356EF2030e5378a89581B23539627E93023',
        value: web3.toWei(this.token, 'ether')}
      web3.eth.sendTransaction(message, (err, txId) => {
        if (!err) {
          let newPolicy = {
            name: txId,
            insurer: this.$store.getters.getRandomInsurer(this.type),
            assessor: this.$store.getters.getRandomAssessor,
            insured: this.$store.state.user.user.id,
            type: this.type,
            status: 1,
            token: this.token,
            subtype: this.subtype,
            model: this.model,
            startTime: this.startTime,
            endTime: this.completeTime,
            addInfo: this.addInfo
          }
          this.$store.dispatch('addPolicy', newPolicy).then((policy) => {
            this.snackbar = true
            this.dialog = false
            this.loader = false
            Object.assign(this.$data, this.$options.data())

            this.$emit('complete', {txId, policy})
          })
        } else { console.log(err) }
      })

    //   this.$store.state.contractInstance().bet(event.target.innerHTML, {
    //     gas: 300000,
    //     value: this.$store.state.web3.web3Instance().toWei(this.amount, 'ether'),
    //     from: this.$store.state.web3.coinbase
    //   }, (err, result) => {

    // }
    }
  },
  watch: {
    type (val) {
      this.subtype = null
      this.$store.dispatch('getSubTypes', val)
    },
    subtype (val) {
      this.model = null
      this.models = this.$store.state.types.subtypes[val].models
    }
  },
  mounted () {
    this.$store.dispatch('getTypes')
    this.$store.dispatch('getSubTypes', 'Boatc')
  },
  computed: {
    ...mapState({
      insurers: state => state.insurers,
      types: state => state.types.types,
      subtypes: state => Object.keys(state.types.subtypes)
      // convoIds: state => state.conversations.allIds
    })
  }
}
</script>
<style scoped>
.flex-direction-row{
  flex-direction: row
}
#new-policy{width: 100%;}
</style>
