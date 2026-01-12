import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx';
import './Card.css';

import pattern from '../assets/pattern.png'
import cat from '../assets/cat.png'
import dog from '../assets/dog.png'
import sun from '../assets/sun.png'
import moon from '../assets/moon.png'
import duck from '../assets/duck.png'
import leaf from '../assets/leaf.png'
import star from '../assets/star.png'
import flower from '../assets/flower.png'
import apple from '../assets/apple.png'
import strawberry from '../assets/strawberry.png'


const Card = ({icon, id, flippedCards, selectedCards, resetSignal, setSelectedCards, hasLost, hasWon, difficulty}) => {

  const isFaceDown = !flippedCards.includes(id) && !selectedCards.includes(id)
  const [isAnimating, setIsAnimating] = useState(false);
  const prevSelected = useRef(false);

  const iconMap = {
    cat: cat,
    dog: dog,
    sun: sun,
    moon: moon,
    duck: duck,
    leaf: leaf,
    star: star,
    flower: flower,
    apple: apple,
    strawberry: strawberry
  }

  function handleFlip (x) {
    if (isAnimating) {
      return;
    } 
    if (!flippedCards.includes(x) && !selectedCards.includes(x)) {
      if (selectedCards.length < 2) {
        setSelectedCards([...selectedCards, x]);
      }
    }
    else {
      return;
    }
  }


  useEffect(()=> {
    prevSelected.current = false;
    setIsAnimating(false);
  }, [resetSignal])

  return (
    <>
    <div className={clsx('rounded-sm flex justify-center items-center overflow-hidden', isFaceDown && 'cursor-pointer hover:scale-110 transition', difficulty === "hard" ? 'w-16 h-24 sm:w-16 sm:h-24' : 'w-16 h-24 sm:w-20 sm:h-30')}
         onClick={()=> (!hasLost && !hasWon) && handleFlip(id)}
         onAnimationEnd={()=> setIsAnimating(false)}
    >
      <div className={clsx('card-inner bg-amber-100 relative w-full h-full', !isFaceDown && 'flipped')}>
        <div className='card-front h-full w-full flex items-center justify-center absolute top-0 left-0'>
          <img src={iconMap[icon]} alt={icon} className={clsx(difficulty === "hard" ? 'w-11 h-11' : 'h-12 w-12 sm:w-14 sm:h-14')} />
        </div>
        <div className='card-back w-full h-full flex items-center justify-center absolute top-0 left-0'>
          <img src={pattern} alt="unflipped card" className='rounded-sm' />
        </div>
      </div>
    </div>
    </>
  )
}

export default Card
