$(document).ready(function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Set the volume to 10%
            const birthdayAudio = $("#birthdayAudio")[0];
            birthdayAudio.volume = 0.1;

            function checkVolume() {
                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((sum, value) => sum + value) / bufferLength;
                const maxVolume = 255;
                const fadeThreshold = 50;
                const opacity = Math.max(0, (maxVolume - Math.min(volume, maxVolume - fadeThreshold)) / fadeThreshold);

                const flame = $("#flame");
                const candle = $("#candle");
                const txt = $("h1");

                if (volume > fadeThreshold) {
                    flame.removeClass("burn").addClass("puff");
                    $(".smoke").each(function () {
                        $(this).addClass("puff-bubble");
                    });
                    $("#glow").remove();
                    txt.hide().html("BUOONNNN COMPLEANNO ESMERALDA. FINALMENTE. 28 ANNI NON CI POSSO CREDERE").delay(750).fadeIn(300);
                    candle.animate({
                        opacity: "0"
                    }, 1000);

                    if (birthdayAudio.paused) {
                        birthdayAudio.play();
                    }

                    // Set a timeout to bring the flame back after 3 seconds
                    setTimeout(function() {
                        flame.removeClass("puff").addClass("burn");
                        candle.animate({
                            opacity: "1"
                        }, 1000);
                    }, 3000); // 3 seconds delay
                } else {
                    flame.css("opacity", opacity);
                    candle.css("opacity", opacity);
                }

                requestAnimationFrame(checkVolume);
            }

            checkVolume();
        })
        .catch(err => console.error('Error accessing microphone', err));
});
