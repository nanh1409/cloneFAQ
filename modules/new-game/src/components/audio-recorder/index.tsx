import axios from "axios";
import { forwardRef, memo, PropsWithoutRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { ReactMicStopEvent } from "react-mic";
import { ReactMic } from "@cleandersonlobo/react-mic";
// import AptorConnector, { AptorRef } from "./aptor/Connector";
import StartRecordIcon from "./StartRecordIcon";
import StopRecordIcon from "./StopRecordIcon";
import "./style.scss";

export interface AudioRecorderRef {
  stopRecord: () => void;
}

export enum RecordFileStatus {
  SAVING,
  SAVED,
  ERROR
}

type AudioRecorderProps = {
  id?: any;
  autoStart?: boolean;
  uploadURL?: string;
  once?: boolean;
  onSavingFile?: () => void;
  onSaveFileSuccess?: (args: { data: any; timeMs: number }) => void;
  onSavedFileError?: (err: Error) => void;
  forceStop?: boolean;
  // useAptor?: boolean;
}

const AudioRecorder = forwardRef<
  AudioRecorderRef,
  PropsWithoutRef<AudioRecorderProps>
>((props, ref) => {
  const {
    id,
    autoStart,
    uploadURL = "",
    once,
    onSavingFile = () => { },
    onSaveFileSuccess = () => { },
    onSavedFileError = () => { },
    forceStop,
    // useAptor
  } = props;

  const [recording, setRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const [recordFileStatus, setRecordFileStatus] = useState(RecordFileStatus.SAVING);
  const [startTime, setStartTime] = useState(0);
  const [stopTime, setStopTime] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobURL, setBlobURL] = useState("");
  // const [timeMs, setTimeMs] = useState(0);
  // const [aptorRef, setAptorRef] = useState<AptorRef | null>(null);

  useImperativeHandle(ref, () => ({
    stopRecord() {
      setRecording(false);
      setStopTime(Date.now());
      // if (useAptor) {
      //   handleAptorStop()
      // }
    }
  }));

  const statusText = useMemo(() => {
    switch (recordFileStatus) {
      case RecordFileStatus.SAVING:
        return "Uploading...";
      case RecordFileStatus.SAVED:
        return "Saved!";
      case RecordFileStatus.ERROR:
        return "Something went wrong!";
      default:
        return "";
    }
  }, [recordFileStatus]);

  useEffect(() => {
    if (autoStart && !recording) {
      // if (!useAptor) {
      setRecording(true);
      const timeStart = Date.now();
      setStartTime(timeStart);
      // } 
      // else if (useAptor && aptorRef) {
      //   aptorRef.start()
      //     .then(() => {
      //       setRecording(true);
      //     })
      // }
    }
    return () => {
      setRecording(false);
      setFinished(false);
      setRecordFileStatus(RecordFileStatus.SAVING);
      setStartTime(0);
      setStopTime(0);
      setBlob(null);
      setBlobURL("");
    }
  }, [
    id,
    // useAptor
  ]);

  useEffect(() => {
    if (forceStop && recording) {
      setRecording(false);
      setStopTime(Date.now());
      // if (useAptor) {
      //   handleAptorStop();
      // }
    }
  }, [
    forceStop,
    recording,
    //  useAptor
  ]);

  const handleRecord = (evt: ReactMicStopEvent) => {
    setFinished(true);
    const { blob, blobURL } = evt;
    setBlob(blob);
    setBlobURL(blobURL);
    // if (useAptor) {
    //   setTimeMs(timeMs);
    //   return;
    // }
    // handleUploadFile({ blob, blobURL, timeMs });
  }

  // const handleAptorStop = () => {
  //   if (aptorRef) {
  //     aptorRef.stop()
  //       .then((voice) => {
  //         const blob = voice.blob;
  //         const blobURL = URL.createObjectURL(blob);
  //         handleUploadFile({ blob, blobURL, timeMs });
  //       })
  //   }
  // }

  useEffect(() => {
    if (startTime && stopTime && blob && blobURL) {
      handleUploadFile({ blob, blobURL, timeMs: stopTime - startTime });
    }
  }, [startTime, stopTime, blob, blobURL]);

  const handleUploadFile = (args: { blob: Blob; blobURL: string; timeMs: number }) => {
    const { blob, blobURL, timeMs } = args;
    // const dataTimeMs = timeMsArg || timeMs;
    onSavingFile();
    if (!uploadURL) {
      setTimeout(() => {
        setRecordFileStatus(RecordFileStatus.SAVED);
        onSaveFileSuccess({ data: blobURL, timeMs });
      }, 300);
    } else {
      const formData = new FormData();
      formData.append("file", blob, "audio_record.mp3");

      axios
        .post(uploadURL, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(({ data }) => {
          setRecordFileStatus(RecordFileStatus.SAVED);
          onSaveFileSuccess({ data, timeMs });
        })
        .catch((err) => {
          setRecordFileStatus(RecordFileStatus.ERROR);
          onSavedFileError(err);
        });
    }
  }

  return <div className="game-audio-recorder-module">
    <div className="game-audio-recorder-module-mic-wrap">
      <ReactMic
        className="game-audio-recorder-module-visualizer"
        record={recording}
        visualSetting="sinewave"
        mimeType="audio/mp3"
        noiseSuppression
        backgroundColor="#000"
        strokeColor="#00fe7e"
        onStop={handleRecord}
      />
      {/* <AptorConnector ref={setAptorRef} /> */}
      {!autoStart && !recording && !finished && <span title="Start Record" className="game-audio-recorder-module-button start-record" onClick={() => {
        setRecording(true);
        setStartTime(Date.now());
        // if (useAptor && aptorRef) {
        //   aptorRef.start().then(() => { })
        // }
      }}>
        <StartRecordIcon fill="#fff" />
        Start Record
      </span>}
      {recording && !finished && <span title="Stop Recording" className="game-audio-recorder-module-button" onClick={() => {
        setRecording(false);
        setStopTime(Date.now());
        // if (useAptor) {
        //   handleAptorStop();
        // }
      }}>
        <StopRecordIcon />
      </span>}
    </div>
    {finished && <div className="game-audio-recorded-status">
      {statusText}
    </div>}
  </div>
});

export default memo(AudioRecorder, (prevProps, nextProps) => { 
  return !['id', 'autoStart', 'uploadURL', 'once', 'forceStop'].some(prop => prevProps[prop] !== nextProps[prop])
});