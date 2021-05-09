import React, { useRef, useState } from 'react';
import './App.css';
import 'firebase/analytics';
import Switch from '@material-ui/core/Switch';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCxrt6orA2Hm9zvf7rSyIqVTkaBbxojz3Q",
  authDomain: "vibez-10b60.firebaseapp.com",
  projectId: "vibez-10b60",
  storageBucket: "vibez-10b60.appspot.com",
  messagingSenderId: "669391746446",
  appId: "1:669391746446:web:54759c3f4be2f3040060df"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const[user] = useAuthState(auth);

  const [ darkMode, setDarkMode ] = useState(false);

  const theme = createMuiTheme({
    palette:{
      type: darkMode ? 'dark' : 'light',
  }
  })

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline>

    <div className="App">
      <header className="App-header">
      <SignOut />
      <div className="Switch">
      <Switch onChange={handleDarkMode} value={darkMode}/>
      </div>
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
    </CssBaseline>
    </ThemeProvider>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )



}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}




function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Write a message..." />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}




function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="dp" />
      <p>{text}</p>
    </div>
  </>)
}


export default App;