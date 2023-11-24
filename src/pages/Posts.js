import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";




function Posts() {
  const [postList, setPostList] = useState([]);
  const postCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      console.log(data.docs);
      const posts = data.docs.map((doc) => ({ 
        ...doc.data(), 
        id: doc.id, 
        date: new Date(doc.data().timestamp.seconds * 1000)}));
      console.log(posts);
      setPostList(posts);
    };
    getPosts();
  }, []);

  return (
    <div className="postsPage">
      {postList.map((post) => {
        return (
          <div className="postCont">
            <div className="postHeader">
              <div className="title">
                <h1>{post.title}</h1>
              </div>
            </div>
            <div className="postTextCont">{post.text}</div>
            <div className="postFooter">
              <div className="postAttachmentsCont">
                <a href={post.file.url} target="_blank" rel="noreferrer">
                </a>
              </div>
              <h3>@{post.author.name}</h3>
              <h4>{post.date.toLocaleString()}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
