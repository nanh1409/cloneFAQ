import { Skeleton, Grid } from "@mui/material";
import { memo } from "react";

const CDLTestListSkeleton = memo(() => {
  return <div className="sub-section-list">
    <div className="sub-header">
      <Skeleton className="sub-title" style={{ minWidth: 320 }} />
    </div>
    <div className="sub-list">
      <Grid container spacing={2}>
        {[...(new Array(10))].map((_, i) => {
          return <Grid key={i} item xs={12} sm={6} md={2.4}>
            <div className="topic-item-component">
              <div className="topic-avatar-container">
                <Skeleton className="topic-avatar"
                  style={{
                    position: "absolute", width: "100%", height: "100%",
                    top: "50%", transform: "translateY(-50%)"
                  }}
                />
              </div>

              <div className="topic-meta">
                <Skeleton className="topic-name-text dot-2" />
              </div>

              <div className="topic-meta-content">
                <Skeleton />
              </div>
            </div>
          </Grid>
        })}
      </Grid>
    </div>
  </div>
});

export default CDLTestListSkeleton;