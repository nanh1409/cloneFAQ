// import { Recorder } from "@web-lite/voice-recorder";
// import { forwardRef } from "react";
// import useAptor from "react-aptor";

// export type AptorRef = {
//   start: () => Promise<void>;
//   stop: () => Promise<{ blob: Blob }>;
// }

// const AptorConnector = forwardRef((_, ref) => {
//   useAptor(ref, {
//     getAPI: (recorder: AptorRef, params) => () => {
//       if (!recorder) {
//         return {
//           start: async () => { },
//           stop: async () => { }
//         }
//       }
//       return {
//         start: () => recorder.start(),
//         stop: () => recorder.stop()
//       }
//     },
//     instantiate: (_, params) => new Recorder()
//   });
//   return <></>;
// });

// export default AptorConnector;