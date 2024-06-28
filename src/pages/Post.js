import { doc, getDoc } from "firebase/firestore";
import { db, storage, ref, getDownloadURL } from "../firebase-config";
import { useParams } from "react-router-dom";
import { t } from "i18next";
import { useEffect, useState } from "react";
import mammoth from 'mammoth';

function Post() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const params = useParams();
  const getDocumentById = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log(docSnap.data());
      return docSnap.data();
    } else {
      throw new Error("No such document!");
    }
  };

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docData = await getDocumentById("posts", params.postId);
        setDocument(docData);

          const docRef = ref(storage, "Uploads/"+ docData.files[0].name); // Adjust the path as needed
          const url = await getDownloadURL(docRef);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          console.log(htmlContent);
          setHtmlContent(value);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [htmlContent, params]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }
  if (document && htmlContent) {
    return (
      <div>
        <div>
          <h1>{document.title}</h1>
        </div>
        <div>
          <p>{document.text}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <div className="postSignatureCont">
                    <h3>@{document.author.name}</h3>
                    <h4>{new Date(document.timestamp.seconds * 1000).toLocaleString()}</h4>
                  </div>
      </div>
    );
  }
}

export default Post;
