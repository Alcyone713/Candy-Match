import React, { useState, useEffect, useCallback } from 'react'
import './Game.css'
import blueCandy from '../Assets/blue-candy.png'
import greenCandy from '../Assets/green-candy.png'
import orangeCandy from '../Assets/orange-candy.png'
import purpleCandy from '../Assets/purple-candy.png'
import redCandy from '../Assets/red-candy.png'
import yellowCandy from '../Assets/yellow-candy.png'
import blank from '../Assets/blank.png'
import ScoreBoard from './ScoreBoard'

const width = 8;
const candyColors = [
    blueCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy,
    greenCandy
]
let numberOfMoves=0;

export default function Game() {


    const [currentBoard, setCurrentBoard] = useState([])
    const [blockBeingDragged, setBlockBeingDragged]= useState(null)
    const [blockBeingReplaced, setBlockBeingReplaced]= useState(null)
    const [score, setScore] = useState(0)


    const createBoard = () => {
        const RandomColorArray = []
        for (let i = 0; i < width * width; i++) {
            let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            RandomColorArray.push(randomColor)
        }
        setCurrentBoard(RandomColorArray)
        console.log(RandomColorArray)
    }


    const checkForColumnsOfThree = useCallback(() => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = currentBoard[i]
            const isBlank = currentBoard[i]===blank
            if (columnOfThree.every(block => currentBoard[block] === decidedColor && !isBlank)) {
                columnOfThree.forEach(block => currentBoard[block] = blank)
                setScore((score)=>score+3)
                return true
            }
        }
    })


    const checkForColumnsOfFour = useCallback(() => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentBoard[i]
            const isBlank = currentBoard[i]===blank
            if (columnOfFour.every(block => currentBoard[block] === decidedColor && !isBlank)) {
                columnOfFour.forEach(block => currentBoard[block] = blank)
                setScore((score)=>score+4)
                return true
            }
        }
    })


    const checkForRowsOfThree = useCallback(() => {
        for (let i = 0; i < 64 ; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentBoard[i]
            const isBlank = currentBoard[i]===blank
            const notValid= [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]
            if(notValid.includes(i)) continue
            if (rowOfThree.every(block => currentBoard[block] === decidedColor && !isBlank)) {
                rowOfThree.forEach(block => currentBoard[block] = blank)
                setScore((score)=>score+3)
                return true
            }
        }
    })


    const checkForRowsOfFour = useCallback(() => {
        for (let i = 0; i < 64 ; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentBoard[i]
            const isBlank = currentBoard[i]===blank
            const notValid= [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63]
            if(notValid.includes(i)) continue
            if (rowOfFour.every(block => currentBoard[block] === decidedColor && !isBlank)) {
                rowOfFour.forEach(block => currentBoard[block] = blank)
                setScore((score)=>score+4)
                return true;
            }
        }
    })


    const moveBelow = useCallback(() => {
        const firstRow=[0, 1, 2, 3, 4, 5, 6, 7]
        for(let i=0; i<=55; i++){
            if(firstRow.includes(i) && currentBoard[i]===blank){
                currentBoard[i]=candyColors[Math.floor(Math.random()*candyColors.length)]
            }
            if(currentBoard[i+width]===blank){
                currentBoard[i+width]=currentBoard[i]
                currentBoard[i]=blank
            }
        }
    })


    const dragStart = useCallback((e)=>{
        setBlockBeingDragged(e.target)
    })

    const dragDrop = useCallback((e)=>{
        setBlockBeingReplaced(e.target)
    })

    const dragEnd = () => {
        const blockBeingDraggedId = parseInt(blockBeingDragged.getAttribute('data-id'))
        const blockBeingReplacedId = parseInt(blockBeingReplaced.getAttribute('data-id'))

        currentBoard[blockBeingDraggedId]= blockBeingReplaced.getAttribute('src')
        currentBoard[blockBeingReplacedId]= blockBeingDragged.getAttribute('src')

        const validMoves=[
            blockBeingDraggedId-1,
            blockBeingDraggedId+1,
            blockBeingDraggedId-width,
            blockBeingDraggedId+width,
        ]

        const isValidMove= validMoves.includes(blockBeingReplacedId)

        const isAColumnOfFour = checkForColumnsOfFour()
        const isARowOfFour = checkForRowsOfFour()
        const isAColumnOfThree = checkForColumnsOfThree()
        const isARowOfThree = checkForRowsOfThree()


        if(blockBeingReplacedId && isValidMove && (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)){
            setBlockBeingDragged(null)
            setBlockBeingReplaced(null)
            numberOfMoves++
        }
        else{
            currentBoard[blockBeingDraggedId]= blockBeingDragged.getAttribute('src')
            currentBoard[blockBeingReplacedId]= blockBeingReplaced.getAttribute('src')
            setCurrentBoard([...currentBoard])
        }
    }

    
    useEffect(() => {
        createBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnsOfThree()
            checkForRowsOfThree()
            checkForColumnsOfFour()
            checkForRowsOfFour()
            moveBelow()
            setCurrentBoard([...currentBoard])
        }, 200)
        return () => clearInterval(timer)
    }, [checkForColumnsOfThree, checkForRowsOfThree, checkForColumnsOfFour, checkForRowsOfFour, moveBelow, currentBoard])

    // console.log(currentBoard)

    return (
        <div className='Game'>
            {currentBoard.length < 3 ? ("none") :
                (
                    <div className='board'>
                        {currentBoard.map((candyColor, index) => (
                            <img
                                key={index}
                                src={candyColor}
                                alt={index} 
                                data-id={index}
                                draggable={numberOfMoves>=20? false: true}
                                onDragStart={dragStart}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()}
                                onDragLeave={(e) => e.preventDefault()}
                                onDrop={dragDrop}
                                onDragEnd={dragEnd}
                                />
                        ))}
                    </div>
                )
            }
            <div className='details'>
            <ScoreBoard desc={"Moves left"} Score={20-numberOfMoves}/>
            <ScoreBoard desc={"Score"} Score={score}/>
            </div>
        </div>
    )
}
