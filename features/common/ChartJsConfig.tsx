import { Chart as ChartJS, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  ...registerables,
  zoomPlugin
);

const ChartJSConfig = () => {
  return <></>;
}

export default ChartJSConfig;