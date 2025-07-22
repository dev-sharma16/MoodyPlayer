import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facialExpressionDetector.css"
import axios from 'axios'

const FaceMoodDetector = ({setSongs, onMoodChange }) => {
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
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    console.log("Video started successfully");
                };
            }
        } catch (err) {
            console.error("Camera access denied..! : ", err);
        }
    };

    const detectMood = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) {
            console.log("Video or canvas not available");
            return;
        };
        
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

            //? when we get 'topMood' then we have to hit api at 'http://localhost:3000/songs?mood={topMood}'
            axios.get(`http://localhost:3000/songs?mood=${topMood}`)
            .then(response=>{
                console.log(`Songs for mood ${topMood} : `,response.data);
                setSongs(response.data.songs);
            })
        });
    };
    
    useEffect(() => {
        loadModels().then(startVideo);
        
        return () => {
            if (cleanupRef.current) clearInterval(cleanupRef.current);
        };
    }, []);

    return (
        <div className="mood-element">
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    // width="640"
                    // height="480"
                    // className="absolute top-0 left-0 rounded-md"
                    // style={{ transform: "scaleX(-1)", width: "720px", height: "560px" }}
                    className="user-feed-video"
                />
                <canvas
                    ref={canvasRef}
                    // width="640"
                    // height="480"
                    // className="absolute top-0 left-0"
                    // style={{ position: "absolute", top: 5, left: 0, width: "720px", height: "560px"}}
                    className="video-overlay-canvas"
                />
            </div>
            <div className="mood-element-right-section">
                <p className="mt-2 text-center text-blue-600 font-semibold">
                    Current Mood: {mood}
                </p>
                <button onClick={detectMood}>Detect Mood</button>
            </div>
        </div>
    );
};

export default FaceMoodDetector;
