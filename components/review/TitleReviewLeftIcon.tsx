import { memo, PropsWithoutRef } from "react";

const TitleReviewLeftIcon = memo((props: PropsWithoutRef<{
  fill?: string;
}>) => {
  return <div style={{
    width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start"
  }}>
    <span style={{
      fontWeight: 700,
      fontSize: 35,
      color: props.fill || "#000"
    }}>
      Participants' Review
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" width="228" height="5" viewBox="0 0 228 5" fill="none">
      <rect x="0.679688" y="0.880371" width="226.447" height="4" fill={props.fill || "#000"} />
    </svg>
  </div>
});

export default TitleReviewLeftIcon;