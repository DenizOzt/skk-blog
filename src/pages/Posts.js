import {
  collection,
  getDocs,
  startAfter,
  limit,
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
  const [lastQuery, setLastQuery] = useState(
    query(postCollectionRef, orderBy("timestamp", "desc"), limit(5))
  );

  let navigate = useNavigate();

  // const delay = ms => new Promise(
  //   resolve => setTimeout(resolve, ms)
  // );
  const fetchNextDocs = async () => {
    try {
      const documentSnapshots = await getDocs(lastQuery);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      const next = query(
        postCollectionRef,
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(5)
      );
      onSnapshot(next, (snapshot) => {
        setPostList([
          ...postList,
          ...snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: new Date(doc.data().timestamp.seconds * 1000),
          })),
        ]);
        setLastQuery(next);
      });
    } catch (error) {
      if (error.code === "invalid-argument") {
        alert(t("noMorePosts"));
      } else {
        alert(error);
      }
    }
  };

  const goToPost = (pID) => {
    navigate("/post/" + pID);
  };

  useEffect(() => {
    onSnapshot(lastQuery, (snapshot) => {
      setPostList(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          date: new Date(doc.data().timestamp.seconds * 1000),
        }))
      );
    });
  }, []);

  return (
    <div className="postsPage backgroundMarble">
      <div className="colLeft"></div>
      <div className="colMiddle">
        {postList.map((post) => {
          let postId = post.id;
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
                        title={file.name}
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

        <button className="loadMoreBtn" onClick={fetchNextDocs}>
          {t("loadMorePosts")}
        </button>
      </div>
      <div className="colRight"></div>
    </div>
  );
}

export default Posts;
