import FaceMoodDetector from "./components/FaceMoodDetector";
import Songs from "./components/MoodSongs";
import { useState } from "react";


function App() {
  const [songs, setSongs] = useState([
        // {
        //     title: "test-title",
        //     artist: "test-artist",
        //     url: "test-url"
        // },
        // {
        //     title: "test-title",
        //     artist: "test-artist",
        //     url: "test-url"
        // },
        // {
        //     title: "test-title",
        //     artist: "test-artist",
        //     url: "test-url"
        // }
    ])

  const handleMoodChange = (newMood) => {
    console.log("Detected Mood:", newMood);
    // You can now trigger your music logic here
  };

  return (
    <div className="p-6">
      {/* <h2 className="font-bold">ModyPlayer 🎵</h2> */}
      <FaceMoodDetector setSongs={setSongs} onMoodChange={handleMoodChange} />
      <Songs songs={songs}></Songs>
    </div>
  );
}

export default App;
