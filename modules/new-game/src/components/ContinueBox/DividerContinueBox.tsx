import { memo, PropsWithoutRef } from "react";

const DividerContinueBox = memo(({ width = 36 }: PropsWithoutRef<{ width?: number }>) => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="9" viewBox="0 0 36 9" fill="none" style={{ width }} className="divider-continue-box">
  <path fillRule="evenodd" clipRule="evenodd" d="M4.48249 8.09296C2.3116 8.09296 0.551758 6.3331 0.551758 4.1622C0.551758 1.99131 2.3116 0.231445 4.48249 0.231445C5.93799 0.231445 7.20873 1.02255 7.88817 2.19824L28.595 2.19824C29.2744 1.02255 30.545 0.231445 32.0005 0.231445C34.1712 0.231445 35.9309 1.99131 35.9309 4.1622C35.9309 6.3331 34.1712 8.09296 32.0005 8.09296C30.5462 8.09296 29.2764 7.30312 28.5966 6.129L7.88653 6.129C7.20669 7.30312 5.93683 8.09296 4.48249 8.09296Z" fill="#214D45" />
</svg>)

export default DividerContinueBox