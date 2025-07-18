import React, { useState } from 'react'
import "./moodSongs.css"

const Songs = () => {

    const [songs, setSongs] = useState([
        {
            title: "test-title",
            artist: "test-artist",
            url: "test-url"
        },
        {
            title: "test-title",
            artist: "test-artist",
            url: "test-url"
        },
        {
            title: "test-title",
            artist: "test-artist",
            url: "test-url"
        }
    ])

    return (
        <div className='mood-songs'>
            <h2>Recommended Songs</h2>
            <div>
                {songs.map((song, index) => (
                    <div className='song' key={index}>
                        <div className="title">
                            <h3>{song.title}</h3>
                            <p>{song.artist}</p>
                        </div>
                        <div className="play-pause-button">
                            <i class="ri-play-circle-line"></i>
                            <i class="ri-pause-circle-line"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Songs