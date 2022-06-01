import React from "react";

const AudioVisual = props => {

    const { player } = props;
    const canvas = React.useRef();

    React.useEffect(() => {

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var canvasContext, analyser, width, height, dataArray, bufferLength, sourceNode;

        function visualize() {

            // очистить canvas
            canvasContext.clearRect(0, 0, width, height);

            // Или используйте заливку RGBA, чтобы получить небольшой эффект размытия
            //canvasContext.fillStyle = 'rgba (0, 0, 0, 0.5)';
            //canvasContext.fillRect(0, 0, width, height);

            // Получить данные анализатора
            analyser.getByteFrequencyData(dataArray);

            var barWidth = width / bufferLength;
            barWidth = 1;
            var barHeight, heightScale;
            var x = 0;

            // значения изменяются от 0 до 256, а высота холста равна 100. Давайте изменим масштаб
            // перед отрисовкой. Это масштабный коэффициент
            heightScale = height / 128;

            for (var i = 0; i < bufferLength; i++) {

                barHeight = dataArray[i];

                canvasContext.fillStyle = 'rgb(' + (barHeight + 0) + ',0,0)';
                // canvasContext.fillStyle = 'rgb(0,0,0)';
                barHeight *= heightScale;
                canvasContext.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

                // 2 - количество пикселей между столбцами
                x += barWidth + 1;
            }

            // вызовите снова функцию визуализации со скоростью 60 кадров / с
            requestAnimationFrame(visualize);
        }

        width = canvas.current.width;
        height = canvas.current.height;
        canvasContext = canvas.current.getContext('2d');
        sourceNode = audioContext.createMediaElementSource(player);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        sourceNode.connect(analyser);
        analyser.connect(audioContext.destination);

        requestAnimationFrame(visualize);

    }, []);

    return <canvas id="audio-visualisation" className="audio-visualisation-canvas" width="40" height="20" ref={canvas}></canvas>;
}

export default AudioVisual;