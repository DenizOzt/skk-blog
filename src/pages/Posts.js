import {
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useNavigate } from "react-router-dom";

function Posts() {
  const [postList, setPostList] = useState([]);
  const postCollectionRef = collection(db, "posts");

  let navigate = useNavigate();

  // const delay = ms => new Promise(
  //   resolve => setTimeout(resolve, ms)
  // );

  const goToPost = (pID) => {
    navigate("/post/" + pID);
  };

  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPostList(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: new Date(doc.data().timestamp.seconds * 1000),
          }))
        );
      }
    );

    // const getPosts = async () => {
    //   const data = await getDocs(postCollectionRef);
    //   debugger;
    //   const posts = data.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //     date: new Date(doc.data().timestamp.seconds * 1000),
    //   }));
    //   setPostList(posts);
    // };
    // getPosts();
  }, []);

  return (
    <div className="postsPage">
      {postList.map((post) => {
        debugger;
        let postId = post.id;
        return (
          <div
            className="postCont"
            onClick={() => {
              console.log("div");
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
              <label className="readMoreText">{t("readMoreText")}</label>
            </div>
            <div className="postFooter">
              <div className="postAttachmentsCont">
                <h2>{t("postAttachments")}</h2>
                {post.files.map((file) => {
                  return (
                    <a
                      className="postAttachmentsLink"
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="postAttachmentsIcon">
                        <FileIcon
                          extension={file.type}
                          {...defaultStyles[file.type]}
                        ></FileIcon>
                      </div>
                    </a>
                  );
                })}
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
