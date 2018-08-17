import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'
firebase.initializeApp({
  apiKey: 'AIzaSyD-90WTEfe4dyFYGSSs-gfKjclr0da796o',
  authDomain: 'inbloc-46e46.firebaseapp.com',
  databaseURL: 'https://inbloc-46e46.firebaseio.com',
  projectId: 'inbloc-46e46',
  storageBucket: 'inbloc-46e46.appspot.com',
  messagingSenderId: '974764757039'
})

export default firebase
