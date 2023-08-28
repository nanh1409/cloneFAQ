import { memo } from "react";

const StopRecordIcon = memo(() => {
  return <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25.0947" cy="25.1838" r="25" fill="#FFE4DE" />
    <circle cx="25.4655" cy="25.1839" r="17.4318" fill="url(#paint0_linear_152_21)" />
    <rect x="18.0947" y="18.1838" width="14" height="14" rx="3" fill="white" />
    <defs>
      <linearGradient id="paint0_linear_152_21" x1="25.4655" y1="7.75208" x2="25.4655" y2="42.6157" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF8E4F" />
        <stop offset="1" stopColor="#FF3636" />
      </linearGradient>
    </defs>
  </svg>

});

export default StopRecordIcon;