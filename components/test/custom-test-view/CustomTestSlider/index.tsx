import classNames from "classnames";
import Slider from '@mui/material/Slider';
import "./customTestSlider.scss";

const CustomTestSlider = (props: {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  color?: string;
  className?: string;
}) => {
  const {
    value = 0,
    onChange = () => { },
    min = 0,
    max = 200,
    color,
    className
  } = props;

  return <div className={classNames(className, "custom-test-slider-wrap")}>
    <Slider 
      className="custom-test-control-slider"
      classes={{
        rail: "custom-test-control-slider-rail",
        thumb: "custom-test-control-slider-thumb",
        track: "custom-test-control-slider-track",
        valueLabel: "custom-test-control-slider-value-label",
      }}
      min={min}
      max={max}
      size="small"
      defaultValue={value}
      valueLabelDisplay="on"
      onChange={(event, value: number) => onChange(value)}
    />
  </div>
}

export default CustomTestSlider;