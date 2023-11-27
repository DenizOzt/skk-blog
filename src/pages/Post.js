import { collection, FieldPath } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
function Post() {

  const postCollectionRef = collection(db, "posts");

  let params = useParams();

  return <div className="singlePostPage">Post {params.postId}</div>;
}

export default Post;
