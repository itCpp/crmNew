import React from "react";
import moment from "moment";

const player = new Audio();

const AudioCalls = props => {

    const { row } = props;

    const interval = React.useRef();
    const bar = React.useRef();
    const progress = React.useRef();

    const [loading, setLoading] = React.useState(true);
    const [current, setCurrent] = React.useState(0);
    const [paused, setPaused] = React.useState(true);
    const [duration, setDuration] = React.useState(row.duration || 0);

    const intervalFn = () => {
        setCurrent(player.currentTime);
    }

    const play = () => {
        player.play();
        interval.current = setInterval(intervalFn, 100);
        setPaused(false);
    }

    const pause = () => {
        player.pause();
        clearInterval(interval.current);
        setPaused(true);
    }

    const changePaused = () => paused ? play() : pause();

    const setCurrentTime = e => {

        let width = progress.current.offsetWidth,
            click = e.pageX - progress.current.getBoundingClientRect().left,
            percent = Number((click * 100) / width).toFixed(2),
            time = +Number(player.duration * percent / 100).toFixed(2);

        clearInterval(interval.current);
        player.currentTime = time;
        setCurrent(time);
        interval.current = setInterval(intervalFn, 250);
    }

    React.useEffect(() => {

        player.onloadedmetadata = e => {
            setTimeout(() => setLoading(false), 300);
            setDuration(player.duration);
        }

        player.oncanplay = () => {
            console.log();
            play();
        }

        player.onended = () => pause();

        return () => pause();

    }, []);

    React.useEffect(() => {

        if (row?.path) {

            setLoading(true);

            if (!player.paused)
                pause();

            player.src = row.path;
        } else {
            pause();
        }

    }, [row?.path]);

    React.useEffect(() => {
        bar.current.style.width = `${((player.currentTime * 100) / player.duration)}%`;
    }, [current]);

    return <div className="audio-calls-log">

        <span>{moment.unix(current).utc().format(duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}</span>
        <span className="mx-1">/</span>
        <span>{moment.unix(duration).utc().format(duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}</span>

        <div className="calls-log-progress-bar" onClick={setCurrentTime} ref={progress}>
            <div className="calls-log-progress" ref={bar}></div>
        </div>

    </div>
}

export default AudioCalls;