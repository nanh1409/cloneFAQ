import Check from "@mui/icons-material/Check";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SlowMotionVideo from "@mui/icons-material/SlowMotionVideo";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Slider as MuiSlider, Tooltip } from "@mui/material";
import classNames from "classnames";
import React, { memo, PropsWithoutRef, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { useDispatch } from "react-redux";
import ReactSound from "react-sound";
import { useGameSelector } from "../../hooks";
import useCountdown from "../../hooks/useCountdown";
import { setCurrentPlayingAudioId, setUserInteracted } from "../../redux/reducers/game.slice";
import { getBrowserVersion } from "../../utils/system";
import './gameAudioPlayer.scss';
import LoaderIcon from "./LoaderIcon";

type SoundMngArgs = {
  /** ms */
  duration: number;
  /** * ms */
  position: number;
}

const GameAudioPlayer = memo((props: PropsWithoutRef<{
  src?: string;
  playOnRender?: boolean;
  // useHowler?: boolean;
  useNative?: boolean;
  enableSetCurrentAudio?: boolean;
  audioId?: string;
  disableSeek?: boolean;
  disableLoop?: boolean;
  /** Disable Control Pause/Play */
  disableControl?: boolean;
  /** Available if `disableLoop` */
  onEnd?: () => void;
  /** In Seconds */
  delay?: number;
  hideControl?: boolean;
  hideSeek?: boolean;
  hideSpeedRate?: boolean;
}>) => {
  const {
    onEnd = () => { }
  } = props;
  const [isReady, setReady] = useState(false);
  const [isPlaying, setisPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime_, setCurrentTime_] = useState(0)
  const [dataSeek, setDataSeek] = useState(0)
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [rate, setRate] = useState(1);
  const [openRateOpts, setOpenRateOpts] = useState(false);
  const [speedControlZIndex, setSpeedControlZIndex] = useState(1);
  const [isFinished, setFinished] = useState(false);
  const isSupportedAutoPlay = useMemo(() => {
    const browserData = getBrowserVersion();
    const [_name, _version] = browserData.split(' ');
    const name = _name.toLowerCase();
    const version = +_version;
    let isSupported = true;
    if ((name === 'safari' && version < 16)
      // || (name === 'edg' && version < 116)
    ) isSupported = false;
    return isSupported;
  }, []);
  // const [howlerRef, setHowlerRef] = useState<ReactHowler | null>(null);
  // const _raf = useRef<number>(null);

  const disableAutoPlayAudio = useGameSelector((state) => state.gameState.disableAutoPlayAudio);
  const currentPlayingAudioId = useGameSelector((state) => state.gameState.currentPlayingAudioId);
  const isUserInteracted = useGameSelector((state) => state.gameState.isUserInteracted);
  const audioSpeedBtnRef = useRef<HTMLButtonElement>(null);
  const prevOpenRateOpts = useRef(openRateOpts);

  const dispatch = useDispatch();
  const { value: delaySecs } = props.delay ? useCountdown({ key: props.audioId, total: Math.round(props.delay ?? 0) }) : { value: 0 }


  useEffect(() => {
    if (prevOpenRateOpts.current === true && openRateOpts === false) {
      audioSpeedBtnRef.current?.focus();
    }
    prevOpenRateOpts.current = openRateOpts;
  }, [openRateOpts]);

  useEffect(() => {
    setSpeedControlZIndex(isShown ? -1 : 1);
  }, [isShown])

  useEffect(() => {
    if (isReady && props.playOnRender && !disableAutoPlayAudio && (isSupportedAutoPlay || isUserInteracted)) {
      if (!props.delay || props.delay <= 0) setisPlaying(true);
      else {
        setTimeout(() => { setisPlaying(true) }, (props.delay ?? 0) * 1000);
      }
    }
  }, [props.playOnRender, isReady, disableAutoPlayAudio, props.delay, isSupportedAutoPlay, isUserInteracted]);

  useEffect(() => {
    if (props.enableSetCurrentAudio && props.audioId !== currentPlayingAudioId) {
      setisPlaying(false);
    }
  }, [props.enableSetCurrentAudio, props.audioId, currentPlayingAudioId])

  // useEffect(() => {
  //   if (howlerRef && howlerRef.howler && isReady) {
  //     setDuration(howlerRef.duration() || 0);
  //     howlerRef.howler.volume(0.75);
  //     howlerRef.howler.mute(false);
  //     howlerRef.howler.on("play", () => {
  //       setisPlaying(true);
  //       renderSeekPos();
  //     });
  //     howlerRef.howler.on("stop", onNotPlayingHowler);
  //     howlerRef.howler.on("pause", onNotPlayingHowler);
  //     howlerRef.howler.on("end", onNotPlayingHowler);
  //   }
  // }, [howlerRef?.howler, isReady]);

  useEffect(() => {
    return () => {
      setReady(false);
      setisPlaying(false);
      setDuration(0);
      setCurrentTime_(0);
      setDataSeek(0);
      setFinished(false);
      // clearRAF();
    }
  }, [props.src]);

  const onChangeIsPlaying = () => {
    if (props.disableLoop && isFinished) return;
    setisPlaying((isPlaying) => {
      if (!isPlaying && props.enableSetCurrentAudio) {
        dispatch(setCurrentPlayingAudioId(props.audioId))
      }
      if (!isPlaying && !isUserInteracted) {
        dispatch(setUserInteracted(true))
      }
      return !isPlaying;
    })
  }
  const caculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnMinutes}:${returnSeconds}`
  }
  const changeRange = (e: number) => {
    const valueCurrentTime = Math.round((Number(e) * duration) / 100);
    setCurrentTime_(valueCurrentTime);
    setDataSeek(valueCurrentTime);
    // if (howlerRef && howlerRef.howler) {
    //   howlerRef.seek(valueCurrentTime);
    // }
  }
  const clickMuted = () => {
    setMuted((muted) => {
      // howlerRef.howler.mute(!muted);
      return !muted;
    });
  }
  const changeVolume = (e: number) => {
    setVolume(e);
    setMuted(!e);
    // if (howlerRef && howlerRef.howler) {
    //   howlerRef.howler.volume(e / 100);
    //   howlerRef.howler.mute(!e);
    // }
  }

  const changeRate = (_rate: number) => {
    setRate(_rate);
  }

  const handleOpenRateOpts = () => {
    setOpenRateOpts((prevOpen) => !prevOpen);
  }

  const handleCloseRateOpts = (event: Event | SyntheticEvent) => {
    if (audioSpeedBtnRef.current && audioSpeedBtnRef.current.contains(event.target as HTMLElement)) return;
    setOpenRateOpts(false);
  }

  const handleUpdateDuration = (args: SoundMngArgs) => {
    setDuration(args.duration / 1000);
  }

  // const onNotPlayingHowler = () => {
  //   setisPlaying(false);
  //   clearRAF();
  // }

  // const renderSeekPos = () => {
  //   _raf.current = raf(renderSeekPos);
  //   if (howlerRef) {
  //     const time = howlerRef.seek();
  //     setCurrentTime_(time);
  //     setDataSeek(time);
  //   }
  // }

  // const clearRAF = () => {
  //   raf.cancel(_raf.current);
  // };

  return props.useNative
    ? <>
      <ReactAudioPlayer
        src={props.src}
        controls
        preload="metadata" id={props.src}
      />
    </>
    : <>
      <div className={classNames("custom-react-audio-player", (props.hideControl || props.hideSeek || props.hideSpeedRate) && "auto-width")}>
        {!!props.delay && <div className="audio-delay-block">
          {delaySecs > 0
            ? <>
              <HourglassEmpty fontSize="inherit" className="audio-delay-icon" />
              {delaySecs}
            </>
            : <></>}
        </div>}
        {!props.hideControl && !(props.delay && delaySecs > 0) && (!isReady 
          ? <LoaderIcon strokeWidth={2} className="iconButton__" />
          : <IconButton className="iconButton__" disabled={props.disableControl && (isSupportedAutoPlay || isUserInteracted)} onClick={onChangeIsPlaying}>
          {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
        </IconButton>)}

        <div className="current-time-audio-player">
          {isReady ? caculateTime(currentTime_) : '--:--'} / {isReady ? caculateTime(duration) : '--:--'}
        </div>
        {!props.hideSeek && <div className="audio-progress-control" style={isShown ? { marginRight: '80px', transition: '.5s' } : { marginRight: '30px', transition: '.5s' }}>
          <MuiSlider
            className="audio-progress-control-slider"
            classes={{
              rail: "audio-progress-control-slider-rail",
              thumb: "audio-progress-control-slider-thumb",
              track: "audio-progress-control-slider-track"
            }}
            min={0}
            max={100}
            step={0.01}
            disabled={props.disableSeek}
            value={dataSeek / (duration || 1) * 100}
            onChange={(_evt, value) => {
              setisPlaying(false);
              changeRange(value as number)
            }}
            onChangeCommitted={() => setisPlaying(true)}
          />
        </div>}
        {!props.hideSpeedRate && <div className="audio-speed-control" style={{ zIndex: speedControlZIndex }}>
          <Tooltip title="Playback speed">
            <IconButton size="small" ref={audioSpeedBtnRef} onClick={handleOpenRateOpts}>
              <SlowMotionVideo fontSize="small" />
            </IconButton>
          </Tooltip>
          <span className="audio-speed-control-label">{rate}x</span>
          <Popper
            open={openRateOpts}
            anchorEl={audioSpeedBtnRef.current}
            placement="bottom-start"
            transition
            disablePortal
            className="audio-speed-control-menu"
            style={{ zIndex: speedControlZIndex }}
          >
            {({ TransitionProps, placement }) => (<Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom-start" ? "left top" : "left bottom" }}>
              <Paper>
                <ClickAwayListener onClickAway={handleCloseRateOpts}>
                  <MenuList autoFocusItem={openRateOpts} className="audio-playback-speed-opts" onKeyDown={(e) => {
                    if (e.key === "Escape") setOpenRateOpts(false);
                  }}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((_rate, i) =>
                      <MenuItem className="audio-playback-speed-opts-item" key={i} onClick={() => {
                        changeRate(_rate);
                        setOpenRateOpts(false);
                      }}>
                        {_rate === 1 ? "Normal" : _rate}{_rate === rate ? <Check fontSize="small" color="success" /> : <></>}
                      </MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>)}
          </Popper>
        </div>}
        <div className="icon-button-audio-player"
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}>
          <div className="wrapper-audio-player">
            <div className="audio-volume-control">
              <MuiSlider
                className="audio-volume-control-slider"
                classes={{
                  rail: "audio-volume-control-slider-rail",
                  thumb: "audio-volume-control-slider-thumb",
                  track: "audio-volume-control-slider-track"
                }}
                min={0}
                max={100}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(_evt, value) => changeVolume(value as number)}
              />
            </div>
          </div>
          <div className="volumeAudio">
            <IconButton className="iconButton__volume" onClick={() => clickMuted()}>
              {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </div>
        </div>
      </div>
      {/* {props.useHowler
        ? (iPhoneChecked
          ? <></>
          : <ReactHowler
            src={props.src}
            ref={setHowlerRef}
            playing={isPlaying}
            onLoad={(_) => {
              setReady(true);
            }}
            onLoadError={(_, e) => console.error(e)}
            volume={muted ? 0 : volume / 100}
            mute={muted}
            rate={rate}
          />)
        :  */}
      <ReactSound
        url={props.src}
        autoLoad
        loop={!props.disableLoop}
        playStatus={isPlaying ? "PLAYING" : "PAUSED"}
        onLoad={((args: { loaded: boolean }) => {
          setReady(args.loaded);
        }) as () => void}
        playbackRate={rate}
        onLoading={(handleUpdateDuration) as () => void}
        position={currentTime_ * 1000}
        onPlaying={((args: SoundMngArgs) => {
          handleUpdateDuration(args);
          if (props.disableLoop) {
            const pos = Math.round(args.position / 1000);
            const dur = Math.round(args.duration / 1000);
            if (args.position > 0 && isPlaying && isReady && pos === dur) {
              setFinished((isFinished) => {
                if (isFinished) return true;
                setTimeout(() => {
                  onEnd();
                }, 500);
                return !isFinished;
              })
            }
          }
          if (args.position !== args.duration) {
            const _value = args.position / 1000;
            setCurrentTime_(_value);
            setDataSeek(_value);
          } else {
            setisPlaying(false);
            setCurrentTime_(0);
          }
        }) as () => void}
        onPause={(handleUpdateDuration) as () => void}
        onResume={(handleUpdateDuration) as () => void}
        onStop={(handleUpdateDuration) as () => void}
        volume={muted ? 0 : volume}
      />
      {/* } */}
    </>
});
export default GameAudioPlayer