import { t } from 'i18next'
import React from 'react'
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
/* import {
  HttpsError,
  beforeUserCreated
} from "firebase-functions/v2/identity"; */


function Login({setIsAuth}) {
  
  let navigate = useNavigate();

  /* const beforecreated = beforeUserCreated((event) => {
    const user = event.data;
    if (user.email && !user.emailVerified) {
      throw new HttpsError(
        'invalid-argument', 'Unverified email');
    }
      return;
  }); */
  
  const signInWithGoogle = () => {
    /* beforecreated(); */
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true)
      setIsAuth(true);
      navigate("/");
    }).catch((err) => {
      debugger;
      alert(t("notAuth"));
    });
  };
  return (
    <div className='loginPage backgroundMarble'>
      <button className='login-with-google-btn' onClick={signInWithGoogle}>{t("sign-in")}</button>
    </div>
  )
}

export default Login