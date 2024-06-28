import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { storage } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

function CreatePost({ isAuth }) {
  const postMaxLength = 10000;
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postFiles, setPostFiles] = useState([]);
  // const [postFilesWUrlArr, setPostFilesWUrlArr] = useState([]);
  const [loading, setLoading] = useState(false);

  const postCollectionRef = collection(db, "posts");

  let navigate = useNavigate();
  var filesArr = [];

  const uploadPost = async () => {
    setLoading(true);

    const bar = new Promise((resolve, reject) => {
      let files = postFiles;
      if (files.length === 0) {
        resolve();
      } else {
        [...files].forEach((file, index, arr) => {
          let uName = "Uploads/" + file.name;
          let storageRef = ref(storage, uName);
          uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              filesArr.push({
                url: url,
                type: url.split(".").pop().split("?")[0],
                name: file.name,
              });
              if (filesArr.length === arr.length) {
                resolve();
              }
            });
          });
        });
      }
    });

    bar.then(() => {
      addDoc(postCollectionRef, {
        title: title,
        text: postText,
        files: filesArr,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        timestamp: getTimeStamp(),
      })
        .then((docRef) => {
          setLoading(false);
          console.log("Document written with ID: ", docRef.id);
          navigate("/posts");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    });
  };

  const getTimeStamp = () => {
    return new Date();
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="createPostPage backgroundMarble">
      <div className="cpContainer">
        <h1 className="cpTitle">{t("createPost")}</h1>
        <div className="inputGp">
          <label>{t("postTitle")}:</label>
          <input
            type="text"
            id="post-title-inp"
            disabled={loading}
            placeholder={t("postTitlePH")}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>{t("postText")}:</label>
          <textarea
            id="post-text-inp"
            placeholder={t("postTextPH")}
            maxLength={postMaxLength}
            disabled={loading}
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          ></textarea>
        </div>
        <div className="inputGp" id="post-file-inp-cont">
          <input
            type="file"
            id="post-file-inp"
            disabled={loading}
            multiple
            onChange={(event) => {
              if (event.target.files[0].size > 52428800) {
                alert("Files can't be bigger than 50MB!");
                event.target.value = "";
              } else {
                setPostFiles(event.target.files);
              }
            }}
          />
          <div className="loadingCircleCont">
            <RotatingLines
              strokeColor="black"
              strokeWidth="4"
              animationDuration="0.7"
              width="80"
              visible={loading}
            ></RotatingLines>
          </div>
        </div>
        <button onClick={uploadPost} id="submit-btn" disabled={loading}>
          {t("submitPostBtn")}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
