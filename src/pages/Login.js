import { t } from 'i18next'
import React from 'react'
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login({setIsAuth}) {
  
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true)
      setIsAuth(true);
      navigate("/");
    }).catch((err) => {
      alert(err);
    });
  };
  return (
    <div className='loginPage'>
      <button className='login-with-google-btn' onClick={signInWithGoogle}>{t("sign-in")}</button>
    </div>
  )
}

export default Login