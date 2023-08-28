const GameMarkMenuIcon2 = (props: { isMarked: boolean, width?: number, height?: number, className?: string }) => {
	const { isMarked, width = 18, height = 19, className = "" } = props;
	return <svg className={className} width={width} height={height} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.17568 12.5141L6.35307 10.9419C6.8519 10.7171 7.1269 10.7078 7.66655 10.9419L11.7147 12.5141C12.1788 12.7508 12.5 12.5374 12.5 12.173V2.2807C12.5 1.35807 11.7859 0.61377 10.909 0.61377H3.09099C2.21409 0.61377 1.5 1.36195 1.5 2.2807V12.1691C1.5 12.5374 1.72021 12.732 2.17568 12.5141Z" fill={`url(#paint0_linear_0_1_${isMarked ? "marked" : "unmarked"})`} />
		<g filter="url(#filter0_d_0_1)">
			<path d="M7 8.72119C8.65685 8.72119 10 7.37805 10 5.72119C10 4.06434 8.65685 2.72119 7 2.72119C5.34315 2.72119 4 4.06434 4 5.72119C4 7.37805 5.34315 8.72119 7 8.72119Z" fill={isMarked ? "#FFEDAF" : "#D7EDF3"} />
		</g>
		<g filter="url(#filter1_d_0_1)">
			<path d="M8.59513 4.4748C8.49161 4.37171 8.35064 4.31137 8.2019 4.30647C8.05316 4.30158 7.90826 4.35253 7.79769 4.44858C7.45868 4.74156 7.13654 5.05218 6.83269 5.37905C6.73436 5.4613 6.64037 5.54826 6.55108 5.63958C6.45282 5.75039 6.38615 5.75293 6.27473 5.64465C6.00629 5.38159 5.65011 5.37397 5.40886 5.60575C5.16761 5.83752 5.17375 6.1801 5.4536 6.45163C5.63257 6.627 5.81241 6.80041 5.99313 6.97184C6.18262 7.15201 6.40808 7.17824 6.6546 7.07842C6.81075 7.01498 6.88708 6.88387 6.99674 6.78067C7.45233 6.34927 7.90618 5.91731 8.35827 5.48478C8.46151 5.4189 8.55205 5.33618 8.62584 5.24032C8.72061 5.132 8.77 4.99345 8.76432 4.85183C8.75864 4.71021 8.6983 4.57575 8.59513 4.4748Z" fill={isMarked ? "#FF731F" : "#618AA5"} />
		</g>
		<defs>
			<filter id="filter0_d_0_1" x="0" y="0.721191" width="14" height="14" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="2" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0.0731944 0 0 0 0 0.15725 0 0 0 0 0.283333 0 0 0 0.1 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
			</filter>
			<filter id="filter1_d_0_1" x="1.23535" y="2.30615" width="11.5293" height="10.8301" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="2" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0.0708507 0 0 0 0 0.155845 0 0 0 0 0.320833 0 0 0 0.1 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
			</filter>
			{isMarked
				? <linearGradient id="paint0_linear_0_1_marked" x1="7" y1="0.61377" x2="7" y2="12.6138" gradientUnits="userSpaceOnUse">
					<stop stopColor="#FFC83B" />
					<stop offset="1" stopColor="#FFA74A" />
				</linearGradient>
				: <linearGradient id="paint0_linear_0_1_unmarked" x1="7" y1="0.61377" x2="7" y2="12.6138" gradientUnits="userSpaceOnUse">
					<stop stopColor="#BDCFDB" />
					<stop offset="1" stopColor="#8BAEC5" />
				</linearGradient>
			}
		</defs>
	</svg>
}

const GameMarkMenuIcon = (props: { isMarked: boolean, width?: number, height?: number, className?: string }) => {
	const { isMarked, width = 18, height = 19, className = "" } = props;
	return <svg className={className} width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1.17568 11.9516L5.35307 10.3794C5.8519 10.1546 6.1269 10.1453 6.66655 10.3794L10.7147 11.9516C11.1788 12.1883 11.5 11.9749 11.5 11.6105V1.7182C11.5 0.795573 10.7859 0.0512695 9.90902 0.0512695H2.09099C1.21409 0.0512695 0.5 0.79945 0.5 1.7182V11.6066C0.5 11.9749 0.720215 12.1695 1.17568 11.9516Z" fill={`url(#paint0_linear_2905_${isMarked ? "marked" : "unmarked"})`} />
		<defs>
			<linearGradient id="paint0_linear_2905_marked" x1="6" y1="0.0512695" x2="6" y2="12.0513" gradientUnits="userSpaceOnUse">
				<stop offset="0.3" stop-color="#FFC83B" />
				<stop offset="1" stop-color="#FFA74A" />
			</linearGradient>
			<linearGradient id="paint0_linear_2905_unmarked" x1="6" y1="0.61377" x2="6" y2="12.6138" gradientUnits="userSpaceOnUse">
				<stop stop-color="#BDCFDB" />
				<stop offset="1" stop-color="#8BAEC5" />
			</linearGradient>

		</defs>
	</svg>

}

export default GameMarkMenuIcon;