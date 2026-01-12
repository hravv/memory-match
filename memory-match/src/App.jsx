import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';

import './App.css'

import Card from './components/Card'
import heart from './assets/heart.png'
import clsx from 'clsx';

function App() {

  const icons = ["moon", "moon", "duck", "duck", "sun", "sun", "cat", "cat", "dog", "dog", "leaf", "leaf"];
  const iconsHard = [...icons, "star", "star", "flower", "flower", "apple", "apple", "strawberry", "strawberry"]
  const [areCardsShuffled, setAreCardsShuffled] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [lives, setLives] = useState(5);
  const [hasLost, setHasLost] = useState(false);
  const [areSelectedValid, setAreSelectedValid] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [difficulty, setDifficulty] = useState("normal");
  const [showSplash, setShowSplash] = useState(false);

  function randomiseCards () {
    let difficultySet = null;
    if (difficulty === "normal") {
      difficultySet = icons
    }
    else if (difficulty === "hard") {
      difficultySet = iconsHard
    }
    const base = difficultySet.map((icon, i) => ({id: i, icon}))
    const shuffled = [...base].sort(() => 0.5 - Math.random());
    setShuffledCards(shuffled);
    setAreCardsShuffled(true);
  }

  function checkCards () {
    if (selectedCards.length !== 2) return;
    const [a, b] = selectedCards;
      if (shuffledCards[a].icon === shuffledCards[b].icon) {
        setTimeout(()=> {
          setFlippedCards(prev => [...prev, a, b]);
          setSelectedCards([]);
        }, 300)
      } else {
        setLives(lives - 1);
        setTimeout(() => 
          setSelectedCards([])
        , 700);
      }
    }
  
  function checkWin () {
    let difficultySet = null;
    if (difficulty === "normal") {
      difficultySet = icons
    }
    else if (difficulty === "hard") {
      difficultySet = iconsHard
    }
    if (flippedCards.length === difficultySet.length) {
      setHasWon(true);
    } 
  }

  function handleReset () {
    setTimeout(()=> {
      randomiseCards();
    }, 300);
    setFlippedCards([]);
    setShowSplash(false);
    setHasWon(false);
    setHasLost(false);
    setSelectedCards([]);
    if (difficulty === "normal") {
      setLives(5);
    } else if (difficulty === "hard") {
      setLives(8);
    }
    setResetSignal(prev => prev + 1);
  }

  useEffect(() => {
    handleReset();
  },[difficulty])

  useEffect(() => {
    (lives === 0) && setHasLost(true);
  }, [lives])

  useEffect(() => {
    checkCards();
    checkWin();
  },[selectedCards])

  useEffect(() => {
    if (hasWon || hasLost) {
      setShowSplash(true);
    }
  }, [hasWon, hasLost])


  return (
    <div className='h-screen flex flex-col'>
      <header className='header w-full flex justify-center py-5 xl:py-15'>
        <h1 className='text-[3rem] my-4 text-amber-100'>Memory Match!</h1>
      </header>

      <section className='main-content flex flex-col flex-1 lg:flex-row items-center justify-center lg:justify-around max-w-250 mx-auto'>
        <div className='flex flex-col items-center lg:mr-18'>
          <div className={clsx('lives-cont flex items-center justify-left mb-8 lg:mb-0 bg-yellow-900 py-2 px-3 rounded-lg', (difficulty === "normal" ? "w-64 sm:w-70" : "w-90 sm:w-100"))}>
            <p className='text-amber-100 text-[1.5rem]'>Lives: </p>
            
              <AnimatePresence>
              {Array.from({ length: lives}, (_, i) => {
                return (
                    <motion.img 
                      className='h-7 w-7 sm:h-8 sm:w-8 mx-1' 
                      key={i} 
                      src={heart}
                      initial={{ scale:0, opacity:0 }}  
                      animate={{ scale:1, opacity:1}}
                      exit={{ scale:0, opacity:0 }}
                      transition={{ duration: 0.3 }}
                    />
                )
              })}
              </AnimatePresence>

          </div>
          <div className='choose-diff mb-4 sm:mt-10 flex gap-5'>
            <p className='text-[1.9rem] text-amber-100 w-fit'>Difficulty</p>
            <div className='flex gap-5'>
              <button 
                className={clsx('text-[1.3rem] bg-yellow-900 px-3 py-2 rounded-lg', difficulty === "normal" ? 'text-amber-200' : 'text-amber-100 cursor-pointer')}
                onClick={()=> setDifficulty("normal")}
                disabled={difficulty === "normal" || (hasWon || hasLost)}
                >
                Normal
              </button>
              <button 
                className={clsx('text-[1.3rem] bg-yellow-900 px-3 py-2 rounded-lg', difficulty === "hard" ? 'text-amber-200' : 'text-amber-100 cursor-pointer')}
                onClick={()=> setDifficulty("hard")}
                disabled={difficulty === "hard" || (hasWon || hasLost)}
                >
                Hard
              </button>
            </div>
          </div>
        </div>
        <div className='game-cont flex flex-col justify-center text-center'>
          <div className={clsx('cards-cont grid gap-y-6 gap-x-3 sm:gap-x-12 w-fit mb-5', difficulty === "normal" ? 'grid-cols-4' : 'grid-cols-5' )}>
            {
              areCardsShuffled ?
              shuffledCards.map((card, index) => {
                return(
                  <Card 
                    key={index}
                    id={index}
                    icon={card.icon}
                    flippedCards={flippedCards}
                    setFlippedCards={setFlippedCards}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    hasLost={hasLost}
                    hasWon={hasWon}
                    areSelectedValid={areSelectedValid}
                    setAreSelectedValid={setAreSelectedValid}
                    resetSignal={resetSignal}
                    difficulty={difficulty}
                    />
                )
              }) : <p>Shuffling Cards...</p>
            }
          </div>
            <AnimatePresence>
              {showSplash ?
              <motion.div 
              className='flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit px-12 py-10 min-w-75 rounded-sm justify-center items-center bg-yellow-900'
              initial={{ scale:0 }}  
              animate={{ scale:1 }}
              exit={{ scale:0  }}
              transition={{ duration: 0.5 }}
              >
                <p className='text-[2.2rem] text-amber-100'>{hasLost ? "Oh no! Have another go?"  : "You won!"}</p>
                <p className='text-[2.2rem] text-amber-100'>{hasWon && (difficulty === "normal" ? "Try hard mode?"  : "Wow, you beat hard mode!")}</p>
                <button className='cursor-pointer w-fit text-[1.8rem] text-amber-100 hover:text-amber-200 bg-yellow-800 rounded-md px-3 mt-1 transition-colors duration-200' onClick={()=>handleReset()}>Reset</button>
              </motion.div> : ""}
            </AnimatePresence>
  
          
        </div>
      </section>

      <footer className='bottom-0 w-full flex justify-center items-center bg-lime-900'>
        <p className='text-[1.1rem] text-amber-100 font-sans font-medium my-1'>Harvey Burman {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
