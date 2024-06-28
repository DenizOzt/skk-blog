import './App.css';
import { Navbar } from 'react-bootstrap'; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Posts from './pages/Posts';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./services/LanguageSwitcher";
import logo from "./pictures/companyLogo.png";
import { useState } from "react";
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

function App() {

  const { t } = useTranslation();
  const [isAuth, setIsAuth] = useState(false);
  const signUserOut = () => {
    signOut(auth).then((result) => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    }).catch((err) => {
      alert(err);
    });
  };

  return (
  <Router>
    <nav>
      <Navbar.Brand>
        {/* <img id='compLogo' src={logo} alt='SKK'/> */}
      </Navbar.Brand>
      <Link to={"/"}>{t("home")}</Link>
      {isAuth && <Link to={"/createpost"}>{t("createPost")}</Link>}
      <Link to={"/posts"}>{t("posts")}</Link>
      {!isAuth ? <Link to={"/login"}>{t("login")}</Link> : <Link onClick={signUserOut}>{t("logout")}</Link>}
      <LanguageSwitcher/>
    </nav>
    <Routes>
      <Route path='' element={<Home/>}/>
      <Route path='createpost' element={<CreatePost isAuth={isAuth}/>}/>
      <Route path='posts' element={<Posts/>}/>
      <Route path='post/:postId' element={<Post/>}/>
      <Route path='login' element={<Login setIsAuth={setIsAuth}/>}/>
    </Routes>
  </Router>
  )
}

export default App;
