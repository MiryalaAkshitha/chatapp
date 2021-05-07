import React,{useState,useRef} from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import 'firebase/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  
  apiKey: "AIzaSyDo9tJP6u0fz9QG7e8oJqv6bLcgdeJGqio",
    authDomain: "chatapp-aa288.firebaseapp.com",
    projectId: "chatapp-aa288",
    storageBucket: "chatapp-aa288.appspot.com",
    messagingSenderId: "700759945748",
    appId: "1:700759945748:web:1c89c1ca25d9e3f0c7ad01",
    measurementId: "G-BLVH451N5S"


})

const auth  = firebase.auth();
const firestore =firebase.firestore();
// const analytics = firebase.analytics();

function App(){
const [user] =useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Let's chat!💬</h1>
        <SignOut/>
</header>

<section>
  {user? <ChatRoom/> :<SignIn/>}
</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle =() => {
    const provider =new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button className="sign-in"onClick ={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick ={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){

  const dummy =useRef();
  const messagesRef = firestore.collection('messages');
  const query =messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idField: 'id'});


const [formValue,setFormValue] =useState('');

const sendMessage =async(e) =>{
e.preventDefault();
const {uid,photoURL} =auth.currentUser;
await messagesRef.add({
  text:formValue,
  createdAt:firebase.firestore.FieldValue.serverTimestamp(),
  uid,
  photoURL
})

setFormValue('');
dummy.current.scrollIntoView({ behaviour:'smooth' });


}

return(
<>
  <main>
    {messages && messages.map (msg => <ChatMessage key={msg.id} message ={msg}/>)}
<span ref ={dummy}></span>

</main>
<form onSubmit ={sendMessage}> 
<input value ={formValue}onChange={(e) => setFormValue(e.target.value)} placeholder ="say somethig nice"/>

<button type ="submit" disabled={!formValue}>✅ </button>



</form>

</>
)
}

  function ChatMessage(props){
    const {text,uid,photoURL} = props.message;

    const messageClass =uid === auth.currentUser.uid ?'sent':'received';


    return(<>
      <div className ={'message ${messageClass}'}>
        <img src ={photoURL ||'alt'}/>
        <p>{text}</p>
      </div>
      </>
    )
  }
export default App;
