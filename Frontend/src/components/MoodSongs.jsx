import React, { useState } from 'react'
import "./moodSongs.css"

const Songs = ({songs}) => {

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
                            <audio src={song.audio} controls controlsList="nodownload"></audio>
                            {/* <i className="ri-play-circle-line"></i>
                            <i className="ri-pause-circle-line"></i> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Songs