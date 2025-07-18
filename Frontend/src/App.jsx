import FaceMoodDetector from "./components/FaceMoodDetector";
import Songs from "./components/MoodSongs";

function App() {
  const handleMoodChange = (newMood) => {
    console.log("Detected Mood:", newMood);
    // You can now trigger your music logic here
  };

  return (
    <div className="p-6">
      {/* <h2 className="font-bold">ModyPlayer 🎵</h2> */}
      <FaceMoodDetector onMoodChange={handleMoodChange} />
      <Songs></Songs>
    </div>
  );
}

export default App;
