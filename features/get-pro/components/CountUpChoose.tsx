import CountUp from 'react-countup';
import AddIcon from '@mui/icons-material/Add';

const CountUpChoose = (props: {
    start: number,
    end: number,
    title: string,
    colorNumber?: string,
    duration?: number,
    enableScrollSpy?: boolean,
    className?: string;
    prefix?: string;
}) => {
    const { start, end, prefix, title, colorNumber = "#4F4F4F", duration = 2, enableScrollSpy, className } = props
    return (
        <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", width: "100%", textAlign: "center" }}>{prefix}</span>
            <CountUp
                start={start}
                end={end}
                delay={0}
                duration={duration}
                enableScrollSpy={enableScrollSpy}
                scrollSpyOnce
            >
                {({ countUpRef }) => (
                    <div style={{ textAlign: 'center' }} className={className}>
                        <span ref={countUpRef} className='countup-number' style={{ color: colorNumber }} />
                        <span><AddIcon sx={{
                            color: colorNumber,
                            fontWeight: 900,
                            fontSize: "49px",
                            lineHeight: "96px",
                            marginBottom: "16px",
                        }} className='icon-add' /></span>
                        <p className='countup-title'>{title}</p>
                    </div>
                )}
            </CountUp>
        </div>
    )
}

export default CountUpChoose;