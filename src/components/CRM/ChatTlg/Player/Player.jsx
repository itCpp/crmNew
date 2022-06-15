import React from "react";
import { Icon, Loader } from "semantic-ui-react";
import { axios, getDurationDisplay } from "./../../../system";
import Cookies from "js-cookie";
import "./player.css";

const Player = props => {

    const { file, setFile } = props;
    const hash = file?.hash || null;

    const body = React.useRef();
    const audio = React.useRef();
    const interval = React.useRef();

    const [loaded, setLoaded] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(null);
    const [play, setPlay] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const bar = React.useRef();

    React.useEffect(() => {

        return () => {
            clearInterval(interval.current);
        }

    }, []);

    const loadedData = React.useCallback(() => {
        setDuration(audio.current.duration);
        setLoaded(true);
        setPlay(true);
    }, []);

    React.useEffect(() => {

        if (hash) {
            setLoaded(false);
            setCurrentTime(0);

            const tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";
            const token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);

            audio.current.src = process.env.REACT_APP_API_URL + `chat/file/${hash}?token=${token}`;
            audio.current.addEventListener('loadeddata', loadedData);

            clearInterval(interval.current);
        }

        return () => {
            audio.current && audio.current.removeEventListener('loadeddata', loadedData);
        }

    }, [hash]);

    const stepProgress = () => {

        let time = audio.current?.currentTime || 0,
            percent = duration > 0 ? time * 100 / duration : 0;

        if (duration > 0 && time >= duration) {
            setPlay(false);
            setCurrentTime(null);
            setFile({ ...file, isPlay: false });
            clearInterval(interval.current);
            bar.current.style.width = `0%`;
            return;
        }

        setCurrentTime(time);
        bar.current.style.width = `${percent > 100 ? 100 : percent}%`;

    }

    React.useEffect(() => {

        if (loaded && play) {
            audio.current && audio.current.play();
            interval.current = setInterval(stepProgress, 1000);
        } else if (loaded) {
            audio.current && audio.current.pause();
            clearInterval(interval.current);
        }

        return () => {
            clearInterval(interval.current);
        }

    }, [loaded, play]);

    React.useEffect(() => {

        if (file && loaded) {

            // console.log(file);

            // if (file?.isPlay || false) {
            //     setPlay(file?.isPlay || false);
            // } else {
            //     audio.current.pause();
            // }

        }

    }, [file])

    React.useEffect(() => {
        if (loaded) {
            setPlay(file?.isPlay || false);
        }
    }, [file?.isPlay])

    const changeCurrentTime = e => {

        const rect = e.currentTarget.getBoundingClientRect();

        let remote = e.pageX - rect.x;
        let percent = remote * 100 / rect.width;

        let currentTime = duration * percent / 100;
        audio.current.currentTime = currentTime;

        percent = duration > 0 ? currentTime * 100 / duration : 0;
        bar.current.style.width = `${percent > 100 ? 100 : percent}%`;

    }

    if (!file)
        return null;

    const playIcon = play ? "pause" : "play";

    return <div className="audio-player" ref={body}>

        <div>
            <Icon
                name={playIcon}
                link
                onClick={() => setFile({ ...file, isPlay: !(file?.isPlay || false) })}
                disabled={!loaded}
            />
            <span>{file.name}</span>
        </div>

        <div className="player-buttons-panel">
            {!loaded && <span><Loader active inline inverted size="mini" /></span>}
            <span>
                {currentTime !== null && <span>
                    {getDurationDisplay(Number(!loaded ? 0 : currentTime).toFixed(0))}/
                </span>}
                {getDurationDisplay(Number(duration).toFixed(0))}
            </span>
            <Icon name="close" link fitted onClick={() => setFile(null)} />
        </div>

        <div className="progress-bar-body" onClick={changeCurrentTime}>
            <div className="progress-bar-time" ref={bar}></div>
        </div>

        <audio ref={audio}></audio>

    </div>
}

export default Player;