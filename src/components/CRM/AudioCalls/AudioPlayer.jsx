import moment from "moment";
import React from "react";
import { Icon, Placeholder } from "semantic-ui-react";

const player = new Audio();

const AudioPlayer = props => {

    const interval = React.useRef();
    const bar = React.useRef();
    const progress = React.useRef();

    const { data, nextPlay } = props;
    const [loading, setLoading] = React.useState(true);
    const [duration, setDuration] = React.useState(data.duration || 0);
    const [current, setCurrent] = React.useState(0);
    const [paused, setPaused] = React.useState(true);

    const intervalFn = () => {
        setCurrent(player.currentTime);
    }

    const play = () => {
        player.play();
        interval.current = setInterval(intervalFn, 250);
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
            play();
        }

        player.onended = () => {
            pause();
            nextPlay(data.id);
        }

        return () => pause();

    }, []);

    React.useEffect(() => {

        if (data?.url) {

            setLoading(true);

            if (!player.paused)
                pause();

            player.src = data.url;
        } else {
            pause();
        }

    }, [data?.url]);

    React.useEffect(() => {
        bar.current.style.width = `${((player.currentTime * 100) / player.duration)}%`;
    }, [current]);

    return <div className="audio-player">

        {loading && <Placeholder className="audio-player-loader" fluid>
            <Placeholder.Header>
                <Placeholder.Line length="full" />
            </Placeholder.Header>
        </Placeholder>}

        <span>
            <Icon
                name={paused ? "play" : "pause"}
                link
                className="mx-2"
                onClick={changePaused}
            />
        </span>

        <div className="audio-progress" onClick={setCurrentTime} ref={progress}>
            <div className="audio-progress-bar" ref={bar}></div>
        </div>

        <span>{moment.unix(current).utc().format(duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}</span>
        <span className="mx-1">/</span>
        <span>{moment.unix(duration).utc().format(duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}</span>

    </div >

}

export default AudioPlayer;