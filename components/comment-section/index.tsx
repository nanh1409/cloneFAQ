import classNames from "classnames";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ClientComment } from "../../features/comment/comment.model";
import { addComment, loadMoreCommentsInTopic, resetFirebaseStore, seekCommentsByTopic } from "../../features/comment/comment.slice";
import useAppConfig from "../../hooks/useAppConfig";
import FirebaseClient from "../../utils/firebase";
import CreateNewComment from "./CreateNewComment";
import "./index.scss";
import LoadMoreIcon from "./LoadMoreIcon";
import UserComment from "./UserComment";

const CommentSection = (props: { hidden?: boolean; }) => {
  const user = useSelector((state) => state.authState.user);
  const authLoading = useSelector((state) => state.authState.loading);
  const total = useSelector((state) => state.commentState.total);
  const commentsList = useSelector((state) => state.commentState.commentsList);
  const { currentTopic, loading: topicLoading } = useSelector((state) => state.topicState);
  const dispatch = useDispatch();
  const { useFirebase } = useAppConfig();

  useEffect(() => {
    const initComments = async () => {
      if (!currentTopic) return;
      const result = await dispatch(seekCommentsByTopic({ topicId: currentTopic._id })).unwrap();
      const lastCommentTime = result.comments[0]?.createDate ?? 0;
      const firestore = FirebaseClient.getFirestore();
      let unsubscribe = () => { };

      if (firestore)
        unsubscribe = onSnapshot(query(collection(firestore, "comments"), where("topicId", "==", currentTopic._id)), (snapshot) => {
          snapshot.docChanges().forEach((change) => {

            const newComment = change.doc.data();
            if (change.type === "added" && newComment.userId !== user?._id && newComment.createDate > lastCommentTime) {
              console.log(lastCommentTime);
              dispatch(addComment(new ClientComment(newComment)));
            }
          });
        });

      return () => {
        unsubscribe();
        if (user?._id) dispatch(resetFirebaseStore(user?._id));
      };
    };

    if (currentTopic?._id) initComments();
  }, [currentTopic?._id]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (user?._id && useFirebase) dispatch(resetFirebaseStore(user?._id));
    }

    window.addEventListener("beforeunload", () => handleRouteChange(), false);
    return () => {
      window.removeEventListener("beforeunload", () => handleRouteChange(), false);
    }
  }, [])


  const loadMoreComments = () => {
    dispatch(loadMoreCommentsInTopic({ topicId: currentTopic._id }));
  }

  return (
    <div className={classNames('comment-section', props.hidden ? "hidden" : "")}>
      <div className="comment-section-header">
        <b>Have question? Leave a comment!</b>
      </div>
      <div className="comment-section-body">
        <div className="comment-list">
          {commentsList.map(e => <UserComment comment={e} key={e._id} />)}
        </div>
        {commentsList.length < total && <div className="load-more-wrap" onClick={() => loadMoreComments()}>
          View more comments
          <LoadMoreIcon style={{ fontSize: 8 }} />
        </div>}
        {(authLoading || topicLoading)
          ? <></>
          : <CreateNewComment
            style={{ marginTop: "8px" }}
          />}
      </div>
    </div>
  )
}

export default CommentSection