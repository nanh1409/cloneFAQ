import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import _ from "lodash";
import { forwardRef, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ClientComment } from "../../features/comment/comment.model";
import { deleteComment, likeComment, loadMoreRepliesInComment, updateCommentContent } from "../../features/comment/comment.slice";
import UserAvatar from '../../features/common/UserAvatar';
import CreateNewComment from "./CreateNewComment";
import CommentInput from "./CreateNewComment/CommentInput";
import LikeIcon from "./LikeIcon";
import LoadMoreIcon from "./LoadMoreIcon";
import "./UserComment.scss";

const UserComment = forwardRef((props: React.PropsWithoutRef<{
  comment: ClientComment;
  parentComment?: ClientComment;
  onRemove?: (id: string) => void;
}>) => {
  const { comment, parentComment, onRemove = () => { } } = props;
  const isReply = !!parentComment;
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const mapChildComments = useSelector((state) => state.commentState.mapChildComments);
  const replies = mapChildComments[comment._id] ?? [];

  const [openReplies, setOpenReplies] = useState(false);
  const [_likes, setLikes] = useState(comment.likes);
  const [_content, setContent] = useState(comment.content);
  const [_lastUpdate, setLastUpdate] = useState(comment.lastUpdate);
  const [openOptionMenu, setOpenOptionMenu] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusedOnStart, setFocusedOnStart] = useState(false);
  const [openConfirmDelDialog, setOpenConfirmDelDialog] = useState(false);
  // const [totalReplies, setTotalReplies] = useState(comment.totalReplies);

  const optionMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const editContentRef = useRef<HTMLTextAreaElement | null>(null);
  const cancelTextRef = useRef<HTMLSpanElement | null>(null);

  const dispatch = useDispatch();

  const isLiked = useMemo(() => {
    return _likes.includes(userId);
  }, [userId, _likes]);

  const loadMoreReplies = () => {
    dispatch(loadMoreRepliesInComment({ parentId: comment._id }))
    // .then(unwrapResult)
    // .then(({ replies }) => {
    //   setReplies((prev) => [...prev, ...replies])
    // })
  };

  const handleLike = useCallback(_.debounce(() => {
    if (!user) return;
    setLikes((prev) => {
      const isLiked = prev.includes(userId);
      dispatch(likeComment({ commentId: comment._id, userId, like: !isLiked }));
      if (isLiked) return prev.filter((e) => e !== userId);
      return [...prev, userId];
    })
  }, 200), [comment?._id, user]);

  useEffect(() => {
    return () => {
      handleLike.cancel();
    }
  }, [handleLike]);

  const elapsedTime = useMemo(() => {
    const timestamp = _lastUpdate || comment.createDate;
    if (!timestamp) return "";
    const time = new Date(timestamp).toLocaleTimeString("vi-VN", { timeStyle: "short" });
    const date = new Date(timestamp).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric", day: "2-digit" });
    return `${time} ${date}`;
  }, [_lastUpdate, comment.createDate]);

  const handleClickReply = () => {
    setOpenReplies((open) => !open);
  }

  const handleClickOpenOptionMenu = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setOpenOptionMenu(true);
  }

  const handleCloseOpenOptionMenu = () => {
    setOpenOptionMenu(false);
  }

  const handleEnterEditMode = () => {
    setOnEdit(true);
    handleCloseOpenOptionMenu();
  }

  const handleExitEditMode = () => {
    setFocusedOnStart(false);
    setOnEdit(false);
  }

  const handleEndEdit = () => {
    const newContent = editContentRef.current?.value ?? "";
    handleExitEditMode();
    setContent(newContent);
    dispatch(updateCommentContent({ _id: comment._id, parentId: parentComment?._id, content: newContent }))
      .then(unwrapResult)
      .then((d) => {
        setLastUpdate(d?.lastUpdate ?? Date.now())
      })
  }

  const handleOpenConfirmDel = () => {
    setOpenConfirmDelDialog(true);
    handleCloseOpenOptionMenu();
  }

  const handleCloseConfirmDel = () => {
    setOpenConfirmDelDialog(false);
  }

  const handleDelComment = () => {
    dispatch(deleteComment({ _id: comment._id, parentId: parentComment?._id }))
    onRemove(comment._id);
    handleCloseConfirmDel();
  }

  const onRemoveReply = useCallback((id: string) => {
    // setReplies((prev) => prev.filter((c) => c._id !== id));
    // setTotalReplies((prev) => prev - 1);
  }, [comment._id])

  return <>
    <div className="comment-container">
      <UserAvatar url={comment.user?.avatar} size={31.5} />
      <div className={classNames("comment-content", onEdit ? "editing" : "")}>
        <div className="comment-content-header">
          <span className="comment-user-name">
            {comment.user?.name}
          </span>
          {onEdit ?
            <div className="comment-edit-mode-container">
              <CommentInput
                ref={editContentRef}
                defaultValue={_content}
                containerStyle={{ flex: 1 }}
                autoFocus
                onFocus={(evt) => {
                  if (!focusedOnStart) {
                    const textLength = _content.length;
                    evt.target.setSelectionRange(textLength, textLength);
                    setFocusedOnStart(true);
                  }
                  setFocused(true);
                }}
                onBlur={(evt) => {
                  setFocused(false);
                }}
                onSubmit={handleEndEdit}
                onKeyDown={(evt) => {
                  if (evt.key === 'Escape') {
                    handleExitEditMode();
                  }
                }}
              />
              <span className="edit-tooltip">
                {focused ? `Press Esc to ` : ''}
                <span className="cancel-edit-text" ref={cancelTextRef} onClick={(evt) => {
                  handleExitEditMode();
                }}>
                  {focused ? 'cancel' : 'Cancel'}
                </span>
              </span>
            </div>
            : <pre className="comment-text" dangerouslySetInnerHTML={{ __html: _content }} />}
        </div>

        <div className="comment-content-footer">
          <div className="comment-meta-section">
            <IconButton onClick={handleLike} size="small">
              <LikeIcon style={{ fontSize: 13, color: isLiked ? "#007aff" : undefined }} />
            </IconButton>
            <span className={classNames("meta-value-title", isLiked ? "liked" : "")}>
              {_likes.length}
            </span>
          </div>

          {!isReply && <div className="comment-meta-section">
            <IconButton onClick={handleClickReply} size="small">
              <ChatBubbleOutlineIcon style={{ fontSize: 13 }} />
            </IconButton>
            <span className="meta-value-title">
              {comment.totalReplies || 0}
            </span>
          </div>}

          <span className="meta-value-title">
            {elapsedTime}
          </span>
        </div>
      </div>

      {!!user && userId === comment.userId && !onEdit && <>
        <IconButton
          size="small"
          style={{ width: 30, height: 30 }}
          ref={optionMenuBtnRef}
          onClick={handleClickOpenOptionMenu}
        >
          <MoreHorizIcon />
        </IconButton>
        <Popper
          open={openOptionMenu}
          anchorEl={optionMenuBtnRef.current}
          placement="bottom-end"
          transition
          disablePortal
          style={{ zIndex: 2 }}
          children={({ placement, TransitionProps }) => <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === "bottom-start" ? "left top" : "left bottom" }}
          >
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleCloseOpenOptionMenu}>
                <MenuList autoFocusItem={openOptionMenu} onKeyDown={(e) => {
                  if (e.key === "Escape") handleCloseOpenOptionMenu();
                }}>
                  <MenuItem onClick={handleEnterEditMode}>
                    Edit
                  </MenuItem>

                  <MenuItem onClick={handleOpenConfirmDel}>
                    Delete
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>}
        />
      </>}
    </div>
    {openReplies && <div className="comment-reply-section">
      {replies.map((rep, index) => {
        return <div className="reply-container" key={`${rep._id}_${index}`}>
          <UserComment
            comment={rep}
            parentComment={comment}
            onRemove={onRemoveReply}
          />
        </div>
      })}
      {(replies.length < comment.totalReplies) && <>
        <div className="load-more-reply" onClick={loadMoreReplies}>
          View more replies
          <LoadMoreIcon style={{ fontSize: 8, marginLeft: "6px" }} />
        </div>
      </>}
      <CreateNewComment style={{ marginTop: "4px" }} parentComment={comment} onCreate={(comment) => {
        // setReplies((prev) => [...prev, comment]);
        // setTotalReplies((prev) => prev + 1);
      }} />
    </div>}

    <Dialog
      open={openConfirmDelDialog}
      onClose={handleCloseConfirmDel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Delete {!!parentComment ? 'Reply' : 'Comment'}?
      </DialogTitle>

      <DialogContent>
        Are you sure you want to delete this {!!parentComment ? 'reply' : 'comment'}?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseConfirmDel}>
          No
        </Button>

        <Button variant="contained" color="primary" onClick={handleDelComment}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </>
})

export default UserComment