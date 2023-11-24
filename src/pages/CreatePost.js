import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { storage } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom';

function CreatePost({isAuth}) {
  
  const postMaxLength = 1000;
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState();

  const postCollectionRef = collection(db, "posts");

  let navigate = useNavigate();

  const uploadPost = () => {

    const file = postFile;
    const uName = "Uploads/"+file.name;
    const storageRef = ref(storage, uName);
    
    if (file) {
      uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(storageRef).then((url) => {
            addDoc(postCollectionRef, {
              title: title, 
              text: postText, 
              file: {url: url, type: url.split('.').pop()},
              author: {name: auth.currentUser.displayName , id: auth.currentUser.uid }, 
              timestamp: getTimeStamp()})
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                navigate("/posts");
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });});
    }else{
      addDoc(postCollectionRef, {
              postTitle: title, 
              postText: postText, 
              file: { url: "-", type:"-"},
              author: {name: auth.currentUser.displayName , id: auth.currentUser.uid }, 
              timestamp: getTimeStamp()})
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          navigate("/posts");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  };

  const getTimeStamp = () => {
    return new Date();
  };

  useEffect (() => {
    if (!isAuth) {
      navigate("/login")
    }
  }, []);
  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h1>{t("createPost")}</h1>
        <div className='inputGp'>
          <label>{t("postTitle")}:</label>
          <input 
            type="text" 
            id="post-title-inp" 
            placeholder={t("postTitlePH")} 
            onChange={(event) => {
              setTitle(event.target.value)}}
          />
        </div>
        <div className='inputGp'>
          <label>{t("postText")}:</label>
          <textarea 
            id="post-text-inp" 
            placeholder={t("postTextPH")} 
            maxLength={postMaxLength}
            onChange={(event) => {
              setPostText(event.target.value) }}
          ></textarea>
        </div>
        <div className='inputGp' id='post-file-inp-cont'>
          <input 
          type="file" 
          id='post-file-inp' 
          title='asdad'
          onChange={(event) => {
            setPostFile(event.target.files[0]);
          }}
          />
        </div>
        <button onClick={uploadPost} id='submit-btn'>
          {t("submitPostBtn")}
        </button>
      </div>
    </div>
  )
}

export default CreatePost