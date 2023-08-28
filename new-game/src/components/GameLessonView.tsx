import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { PropsWithoutRef, memo } from "react";
// import { ITopic } from "../../../share/model/topic";
import ScrollContainer from "./ScrollContainer";
import VideoPlayer from "./videoPlayer/VideoPlayer";


const GameLessonView = memo((props: PropsWithoutRef<{
  // onVideoProgress?: (args: { playedSecs: number, duration: number }) => void;
  name: string;
  description: string;
  videoUrl: string;
}
// & Pick<
//   ITopic,
//   "name" | "description" | "videoUrl"
// >
>) => {
  const { name, description, videoUrl } = props;
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  return <div className="game-object-view game-object-lesson">
    <Typography
      className="lesson-title"
      sx={{ textAlign: "center", fontWeight: 600, fontSize: 16, mb: "16px" }}
    >
      {name}
    </Typography>
    <ScrollContainer thumbSize={50}
      style={{ height: isTabletUI ? 485 : 600 }}
      className="normal-root-container"
      disableOverflowY={!!videoUrl && !description}
    >
      {!!videoUrl && <VideoPlayer
        url={videoUrl}
      />}
      {!!description && <Box
        sx={{ "& *": { fontFamily: "inherit !important" }, padding: "17px" }}
        className="game-lesson-view-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />}
    </ScrollContainer>
  </div>
})

export default GameLessonView;