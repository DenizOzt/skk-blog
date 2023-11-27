import { collection, getDocs } from "firebase/firestore";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useNavigate } from "react-router-dom";

function Posts() {
  const [postList, setPostList] = useState([]);
  const postCollectionRef = collection(db, "posts");

  let btnIdNum = 0;
  let navigate = useNavigate();

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const goToPost = (pID) => {
    navigate("/post/" + pID);
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      const posts = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: new Date(doc.data().timestamp.seconds * 1000),
      }));
      setPostList(posts);
    };
    getPosts();
  }, []);

  return (
    <div className="postsPage">
      {postList.map((post) => {
        let postId = post.id;
        let readMoreBtnId = (++btnIdNum).toString().padStart(10, "0");
        return (
          <div
            className="postCont"
            onClick={() => {
              goToPost(postId);
            }}
          >
            <div className="postHeader">
              <div className="title">
                <h1>{post.title}</h1>
              </div>
            </div>
            <div className="postTextCont">
              <p>{post.text}</p>
              <label htmlFor={readMoreBtnId} className="readMoreLabel">
                {t("readMoreText")}
              </label>
              <button
                id={readMoreBtnId}
                className="readMoreBtn"
                // onClick={() => {
                //   goToPost(postId);
                // }}
              ></button>
            </div>
            <div className="postFooter">
              <div className="postAttachmentsCont">
                <h2>{t("postAttachments")}</h2>
                <a
                  className="postAttachmentsLink"
                  href={post.file.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* {
                      (post.file.type==="jpeg"|| post.file.type==="jpg"|| post.file.type==="png"|| post.file.type==="gif"|| post.file.type==="raw") ? <FcImageFile title={post.file.name} size={42}></FcImageFile>
                    : (post.file.type==="mp3"|| post.file.type==="wav"|| post.file.type==="m4a") ? <FcAudioFile title={post.file.name} size={42}></FcAudioFile>
                    : (post.file.type==="mp4"|| post.file.type==="mkv"|| post.file.type==="webm"|| post.file.type==="mov"|| post.file.type==="avi") ? <FcVideoFile title={post.file.name} size={42}></FcVideoFile>
                    : <FcFile title={post.file.name}  size={42}></FcFile>
                  } */}
                  <div className="postAttachmentsIcon">
                    <FileIcon
                      extension={post.file.type}
                      {...defaultStyles[post.file.type]}
                    ></FileIcon>
                  </div>
                </a>
                {/* <h4>{post.file.name}</h4> */}
              </div>
              <div className="postSignatureCont">
                <h3>@{post.author.name}</h3>
                <h4>{post.date.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
