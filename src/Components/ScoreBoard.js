import React from 'react'
import './ScoreBoard.css'

export default function ScoreBoard({Score, desc}) {
  return (
    <div className='scoreboard'>{desc} : {Score} </div>
  )
}
