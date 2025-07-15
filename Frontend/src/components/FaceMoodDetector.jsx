import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceMoodDetector = ({ onMoodChange }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [mood, setMood] = useState("Click Button to detect");
    const cleanupRef = useRef(null);
    
    const loadModels = async () => {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // videoRef.current.onloadedmetadata = () => {
                    // videoRef.current.play();
                    
                    // Start detection loop after video is ready
                    // const interval = setInterval(() => {
                    //     detectMood();
                    // }, 2000);
                    // cleanupRef.current = interval;
                // };
            }
        } catch (err) {
            console.error("Camera access denied..! : ", err);
        }
    };

    const detectMood = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) return;
        
        const displaySize = {
            width: video.videoWidth,
            height: video.videoHeight,
        };

        if (!displaySize.width || !displaySize.height) return;

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if(!detections || detections.length === 0){
            console.log("No Face Detected.!");
            return;
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resizedDetections.forEach((detection) => {
            const { expressions, detection: box } = detection;
            
            const sorted = Object.entries(expressions)
                .filter(([exp]) =>
                    ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"].includes(exp)
                )
                .sort((a, b) => b[1] - a[1]);
            
            const moodText = sorted
                .map(([expression, confidence]) => `${expression} (${confidence.toFixed(2)})`)
                .join("\n");
            
            const drawBox = new faceapi.draw.DrawBox(box.box, { label: moodText });
            drawBox.draw(canvas);
            
            const topMood = sorted[0][0];
            setMood(topMood);
            if (onMoodChange) onMoodChange(topMood);
        });
    };
    
    useEffect(() => {
        loadModels().then(startVideo);
        
        return () => {
            if (cleanupRef.current) clearInterval(cleanupRef.current);
        };
    }, []);

    return (
        <div style={{position: 'relative'}}>
            <video
                ref={videoRef}
                autoPlay
                muted
                // width="640"
                // height="480"
                // className="absolute top-0 left-0 rounded-md"
                style={{ transform: "scaleX(-1)", width: "720px", height: "560px" }}
            />
            <canvas
                ref={canvasRef}
                // width="640"
                // height="480"
                // className="absolute top-0 left-0"
                style={{ position: "absolute", top: 0, left: 0, width: "720px", height: "560px"}}
            />
            <p className="mt-2 text-center text-blue-600 font-semibold">
                Current Mood: {mood}
            </p>
            <button onClick={detectMood}>Detect Mood</button>
        </div>
    );
};

export default FaceMoodDetector;
