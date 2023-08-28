import { unwrapResult } from "@reduxjs/toolkit";
import { CSSProperties, PropsWithoutRef, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ClientComment } from "../../../features/comment/comment.model";
import { createComment } from "../../../features/comment/comment.slice";
import UserAvatar from "../../../features/common/UserAvatar";
import useAppConfig from "../../../hooks/useAppConfig";
import CommentInput from "./CommentInput";
import "./index.scss";

const CreateNewComment = (props: PropsWithoutRef<{
  style?: CSSProperties;
  parentComment?: ClientComment;
  onCreate?: (newComment: ClientComment) => void;
}>) => {
  const {
    style,
    parentComment,
    onCreate = () => { }
  } = props;
  const user = useSelector((state) => state.authState.user);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const dispatch = useDispatch();
  const { useFirebase } = useAppConfig();

  const isReply = !!parentComment;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const placeholder = useMemo(() => {
    let _placeholder = isReply ? "Write a reply..." : "Write a comment...";
    return _placeholder;
  }, [isReply]);

  function _onSubmitComment() {
    if (textAreaRef.current && user && topic) {
      const content = textAreaRef.current.value || '';
      dispatch(createComment({
        user,
        content,
        courseId: topic.courseId,
        topicId: topic._id,
        parentId: parentComment?._id,
        useFirebase
      }))
        .then(unwrapResult)
        .then((newComment) => {
          onCreate(newComment);
        })
        .finally(() => {
          textAreaRef.current.value = '';
        })
    }
  }

  return user
    ? <div className="create-new-comment-container" style={style}>
      <UserAvatar url={user.avatar} size={31.5} />
      <CommentInput
        ref={textAreaRef}
        placeholder={placeholder}
        containerStyle={{ flex: 1, marginLeft: "7px" }}
        onSubmit={_onSubmitComment}
      />
    </div>
    : (!isReply
      ? <strong><i style={{ marginLeft: 38, fontSize: 14, cursor: "default" }}>
        Please log in to comment
      </i></strong>
      : <></>)
}

export default CreateNewComment;
