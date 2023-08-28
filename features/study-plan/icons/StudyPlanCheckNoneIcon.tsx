import { memo, PropsWithoutRef } from "react"

const StudyPlanCheckNoneIcon = memo((props: PropsWithoutRef<{ stroke?: string }>) => {
  return <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.40152 0.697021H9.59848C12.8578 0.697021 15.5 3.33922 15.5 6.59854V9.79551C15.5 13.0548 12.8578 15.697 9.59848 15.697H6.40152C3.1422 15.697 0.5 13.0548 0.5 9.79551V6.59854C0.5 3.33922 3.1422 0.697021 6.40152 0.697021Z" fill="white" stroke={props.stroke ?? "#000"} />
  </svg>
});

export default StudyPlanCheckNoneIcon;