import { Box, Button, TextareaAutosize, TextareaAutosizeProps } from "@mui/material";
import { CSSProperties, forwardRef, MouseEvent, MouseEventHandler, PropsWithoutRef } from "react";
import SendIcon from "../SendIcon";

const CommentInput = forwardRef<HTMLTextAreaElement, PropsWithoutRef<TextareaAutosizeProps & {
  containerStyle?: CSSProperties;
  onSubmit?: MouseEventHandler<HTMLButtonElement>
}>>((props, ref) => {
  const {
    onSubmit: _onSubmit,
    containerStyle,
    ...textAreaProps
  } = props;

  const onSubmit = (args: MouseEvent<HTMLButtonElement>) => {
    // @ts-ignore
    const value = ref.current?.value;
    if (!value) return;
    _onSubmit(args);
  };

  return <Box className="comment-input-container"
    style={containerStyle}
    sx={{
      display: "flex",
      border: '1px solid #5f7d95',
      borderRadius: "10px",
      alignItems: "center",
      "& textarea": {
        paddingLeft: "8px",
        borderRadius: "10px",
        outline: "none",
        resize: "none",
        flex: 1,
        border: "none"
      }
    }}
  >
    <TextareaAutosize
      {...textAreaProps}
      minRows={1}
      maxRows={5}
      ref={ref}
      onKeyDown={(e) => {
        if (textAreaProps && textAreaProps.onKeyDown) textAreaProps.onKeyDown(e);
        if (e.key === 'Enter' && !e.shiftKey && !!onSubmit) {
          e.preventDefault();
          onSubmit(null);
        }
      }}
    />
    <Button onClick={onSubmit} sx={{
      height: "100%",
      borderRadius: "0 10px 10px 0",
      borderLeft: "1px solid #5f7d95",
      minWidth: 0,
      width: 40
    }}>
      <SendIcon style={{ fontSize: 16 }} />
    </Button>
  </Box>
})

export default CommentInput;