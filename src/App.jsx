import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, Star, Heart } from 'lucide-react';

export default function AnweshPlatformer() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [touchControls, setTouchControls] = useState({
    left: false,
    right: false,
    jump: false
  });
  
  const gameRef = useRef({
    player: {
      x: 100,
      y: 300,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      speed: 5,
      jumpPower: 12,
      isJumping: false,
      direction: 'right'
    },
    platforms: [],
    coins: [],
    enemies: [],
    goal: null,
    gravity: 0.5,
    keys: {},
    animationFrame: null
  });

  const levels = {
    1: {
      name: "Green Hills",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50 },
        { x: 200, y: 450, width: 150, height: 20 },
        { x: 400, y: 350, width: 150, height: 20 },
        { x: 600, y: 250, width: 150, height: 20 }
      ],
      coins: [
        { x: 230, y: 410, collected: false },
        { x: 260, y: 410, collected: false },
        { x: 430, y: 310, collected: false },
        { x: 630, y: 210, collected: false }
      ],
      enemies: [
        { x: 300, y: 520, width: 30, height: 30, speedX: 2, direction: 1, type: 'goomba' }
      ],
      goal: { x: 650, y: 180, width: 40, height: 60 }
    },
    2: {
      name: "Sky Castle",
      platforms: [
        { x: 0, y: 550, width: 200, height: 50 },
        { x: 250, y: 480, width: 100, height: 20 },
        { x: 400, y: 400, width: 100, height: 20 },
        { x: 550, y: 320, width: 100, height: 20 },
        { x: 400, y: 240, width: 100, height: 20 },
        { x: 250, y: 160, width: 150, height: 20 }
      ],
      coins: [
        { x: 280, y: 440, collected: false },
        { x: 430, y: 360, collected: false },
        { x: 580, y: 280, collected: false },
        { x: 430, y: 200, collected: false },
        { x: 300, y: 120, collected: false }
      ],
      enemies: [
        { x: 260, y: 450, width: 30, height: 30, speedX: 1.5, direction: 1, type: 'goomba' },
        { x: 560, y: 290, width: 30, height: 30, speedX: 1.5, direction: 1, type: 'goomba' }
      ],
      goal: { x: 300, y: 90, width: 40, height: 60 }
    },
    3: {
      name: "Volcano Valley",
      platforms: [
        { x: 0, y: 550, width: 150, height: 50 },
        { x: 200, y: 500, width: 100, height: 20 },
        { x: 350, y: 450, width: 80, height: 20 },
        { x: 480, y: 400, width: 80, height: 20 },
        { x: 600, y: 350, width: 100, height: 20 },
        { x: 500, y: 250, width: 120, height: 20 },
        { x: 350, y: 180, width: 100, height: 20 }
      ],
      coins: [
        { x: 230, y: 460, collected: false },
        { x: 370, y: 410, collected: false },
        { x: 510, y: 360, collected: false },
        { x: 630, y: 310, collected: false },
        { x: 540, y: 210, collected: false },
        { x: 380, y: 140, collected: false }
      ],
      enemies: [
        { x: 210, y: 470, width: 30, height: 30, speedX: 1, direction: 1, type: 'goomba' },
        { x: 490, y: 370, width: 30, height: 30, speedX: 1.5, direction: 1, type: 'goomba' },
        { x: 510, y: 220, width: 30, height: 30, speedX: 1, direction: 1, type: 'goomba' }
      ],
      goal: { x: 370, y: 110, width: 40, height: 60 }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const initLevel = () => {
      const level = levels[currentLevel];
      game.platforms = [...level.platforms];
      game.coins = level.coins.map(c => ({ ...c, collected: false }));
      game.enemies = level.enemies.map(e => ({ ...e }));
      game.goal = { ...level.goal };
      game.player.x = 50;
      game.player.y = 300;
      game.player.velocityX = 0;
      game.player.velocityY = 0;
      game.player.isJumping = false;
    };

    const drawPlayer = () => {
      const px = game.player.x;
      const py = game.player.y;
      
      ctx.fillStyle = '#0066CC';
      ctx.fillRect(px + 8, py + 20, 6, 12);
      ctx.fillRect(px + 18, py + 20, 6, 12);
      
      ctx.fillStyle = '#333';
      ctx.fillRect(px + 6, py + 28, 8, 4);
      ctx.fillRect(px + 18, py + 28, 8, 4);
      
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(px + 6, py + 12, 20, 10);
      
      ctx.fillStyle = '#FFB380';
      ctx.fillRect(px + 4, py + 14, 4, 8);
      ctx.fillRect(px + 24, py + 14, 4, 8);
      
      ctx.fillStyle = '#FFB380';
      ctx.fillRect(px + 13, py + 10, 6, 3);
      
      ctx.fillStyle = '#FFCC99';
      ctx.beginPath();
      ctx.arc(px + 16, py + 6, 7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#2196F3';
      if (game.player.direction === 'right') {
        ctx.fillRect(px + 9, py + 3, 14, 3);
        ctx.fillRect(px + 19, py + 3, 6, 2);
      } else {
        ctx.fillRect(px + 9, py + 3, 14, 3);
        ctx.fillRect(px + 7, py + 3, 6, 2);
      }
      
      ctx.fillStyle = '#1976D2';
      ctx.beginPath();
      ctx.arc(px + 16, py + 3, 7, Math.PI, 0, false);
      ctx.fill();
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('A', px + 13, py + 4);
      
      ctx.fillStyle = '#000';
      if (game.player.direction === 'right') {
        ctx.fillRect(px + 18, py + 6, 2, 2);
        ctx.beginPath();
        ctx.arc(px + 18, py + 9, 2, 0, Math.PI);
        ctx.stroke();
      } else {
        ctx.fillRect(px + 12, py + 6, 2, 2);
        ctx.beginPath();
        ctx.arc(px + 14, py + 9, 2, 0, Math.PI);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 11px Arial';
      ctx.strokeText('ANWESH', px - 4, py - 8);
      ctx.fillText('ANWESH', px - 4, py - 8);
      ctx.lineWidth = 1;
    };

    const drawPlatforms = () => {
      game.platforms.forEach(platform => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.fillStyle = '#228B22';
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
      });
    };

    const drawCoins = () => {
      game.coins.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFA500';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawEnemies = () => {
      game.enemies.forEach(enemy => {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 6, 6);
        ctx.fillRect(enemy.x + 19, enemy.y + 8, 6, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 7, enemy.y + 10, 3, 3);
        ctx.fillRect(enemy.x + 21, enemy.y + 10, 3, 3);
      });
    };

    const drawGoal = () => {
      if (game.goal) {
        ctx.fillStyle = '#666';
        ctx.fillRect(game.goal.x + 15, game.goal.y, 5, game.goal.height);
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.moveTo(game.goal.x + 20, game.goal.y);
        ctx.lineTo(game.goal.x + 45, game.goal.y + 15);
        ctx.lineTo(game.goal.x + 20, game.goal.y + 30);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      if (currentLevel === 1) {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
      } else if (currentLevel === 2) {
        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(1, '#9370DB');
      } else {
        gradient.addColorStop(0, '#FF4500');
        gradient.addColorStop(1, '#FFD700');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
    };

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const updatePlayer = () => {
      if (game.keys['ArrowLeft'] || game.keys['a'] || touchControls.left) {
        game.player.velocityX = -game.player.speed;
        game.player.direction = 'left';
      } else if (game.keys['ArrowRight'] || game.keys['d'] || touchControls.right) {
        game.player.velocityX = game.player.speed;
        game.player.direction = 'right';
      } else {
        game.player.velocityX = 0;
      }

      if ((game.keys['ArrowUp'] || game.keys['w'] || game.keys[' '] || touchControls.jump) && !game.player.isJumping) {
        game.player.velocityY = -game.player.jumpPower;
        game.player.isJumping = true;
      }

      game.player.velocityY += game.gravity;
      game.player.x += game.player.velocityX;
      game.player.y += game.player.velocityY;

      let onPlatform = false;
      game.platforms.forEach(platform => {
        if (checkCollision(game.player, platform)) {
          if (game.player.velocityY > 0) {
            game.player.y = platform.y - game.player.height;
            game.player.velocityY = 0;
            game.player.isJumping = false;
            onPlatform = true;
          }
        }
      });

      game.coins.forEach(coin => {
        if (!coin.collected) {
          const distance = Math.sqrt(
            Math.pow(game.player.x + 16 - coin.x, 2) + 
            Math.pow(game.player.y + 16 - coin.y, 2)
          );
          if (distance < 25) {
            coin.collected = true;
            setCoins(prev => prev + 1);
            setScore(prev => prev + 100);
          }
        }
      });

      game.enemies.forEach(enemy => {
        if (checkCollision(game.player, enemy)) {
          if (game.player.velocityY > 0 && game.player.y + game.player.height - 10 < enemy.y) {
            enemy.x = -1000;
            setScore(prev => prev + 200);
            game.player.velocityY = -8;
          } else {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameover');
              }
              return newLives;
            });
            game.player.x = 50;
            game.player.y = 300;
            game.player.velocityX = 0;
            game.player.velocityY = 0;
          }
        }
      });

      if (game.goal && checkCollision(game.player, game.goal)) {
        setGameState('levelComplete');
        if (!completedLevels.includes(currentLevel)) {
          setCompletedLevels(prev => [...prev, currentLevel]);
        }
      }

      if (game.player.x < 0) game.player.x = 0;
      if (game.player.x + game.player.width > 800) {
        game.player.x = 800 - game.player.width;
      }

      if (game.player.y > 600) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameover');
          }
          return newLives;
        });
        game.player.x = 50;
        game.player.y = 300;
        game.player.velocityY = 0;
      }
    };

    const updateEnemies = () => {
      game.enemies.forEach(enemy => {
        enemy.x += enemy.speedX * enemy.direction;
        game.platforms.forEach(platform => {
          if (enemy.y + enemy.height >= platform.y - 5 &&
              enemy.y + enemy.height <= platform.y + 5) {
            if (enemy.x < platform.x || enemy.x + enemy.width > platform.x + platform.width) {
              enemy.direction *= -1;
            }
          }
        });
      });
    };

    const gameLoop = () => {
      if (gameState !== 'playing') return;
      ctx.clearRect(0, 0, 800, 600);
      drawBackground();
      drawPlatforms();
      drawCoins();
      drawEnemies();
      drawGoal();
      drawPlayer();
      updatePlayer();
      updateEnemies();
      game.animationFrame = requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      game.keys[e.key] = true;
      if (e.key === 'Escape' && gameState === 'playing') {
        setGameState('paused');
      }
    };

    const handleKeyUp = (e) => {
      game.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (gameState === 'playing') {
      initLevel();
      gameLoop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (game.animationFrame) {
        cancelAnimationFrame(game.animationFrame);
      }
    };
  }, [gameState, currentLevel, touchControls, completedLevels]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCoins(0);
    setCurrentLevel(1);
  };

  const restartLevel = () => {
    setGameState('playing');
    setLives(3);
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(prev => prev + 1);
      setGameState('playing');
    } else {
      if (score > highScore) {
        setHighScore(score);
      }
      setGameState('menu');
    }
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/95 backdrop-blur-lg rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-2xl sm:text-4xl">🎮</div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                  Anwesh's Adventure
                </h1>
                <p className="text-xs sm:text-base text-gray-600 font-semibold">Epic Platformer Quest</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <div className="text-center bg-yellow-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 border-yellow-400">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-bold text-sm sm:text-xl">{score}</span>
                </div>
                <p className="text-xs text-gray-600 hidden sm:block">Score</p>
              </div>
              <div className="text-center bg-red-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 border-red-400">
                <div className="flex items-center gap-1">
                  <Heart className="text-red-500" size={16} />
                  <span className="font-bold text-sm sm:text-xl">{lives}</span>
                </div>
                <p className="text-xs text-gray-600 hidden sm:block">Lives</p>
              </div>
              <div className="text-center bg-amber-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 border-amber-400">
                <div className="text-lg sm:text-2xl">🪙</div>
                <p className="font-bold text-sm sm:text-base">{coins}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-black">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full touch-none"
            style={{ maxHeight: '70vh' }}
          />
          
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="text-center text-white p-4 sm:p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full">
                <h2 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4">🎮 START ADVENTURE</h2>
                <p className="text-base sm:text-xl mb-4 sm:mb-6">Help Anwesh reach the flag!</p>
                <div className="bg-white/20 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-left text-sm sm:text-base">
                  <p className="font-bold mb-2">🎯 Controls:</p>
                  <p className="hidden sm:block">← → or A/D: Move</p>
                  <p className="hidden sm:block">↑ or W or Space: Jump</p>
                  <p className="hidden sm:block">ESC: Pause</p>
                  <p className="sm:hidden">Use on-screen buttons to play!</p>
                </div>
                <div className="mb-4 sm:mb-6 text-sm sm:text-base">
                  <p className="font-bold mb-2">🏆 High Score: {highScore}</p>
                  <p className="text-xs sm:text-sm">Levels Completed: {completedLevels.length}/3</p>
                </div>
                <button
                  onClick={startGame}
                  className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-lg sm:text-xl hover:scale-110 transition-all shadow-xl"
                >
                  <Play className="inline mr-2" size={20} />
                  START GAME
                </button>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="text-center text-white p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl sm:rounded-3xl shadow-2xl">
                <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">⏸️ PAUSED</h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={resumeGame}
                    className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:scale-110 transition-all"
                  >
                    <Play className="inline mr-2" size={20} />
                    Resume
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:scale-110 transition-all"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="text-center text-white p-6 sm:p-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl sm:rounded-3xl shadow-2xl">
                <h2 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4">💀 GAME OVER</h2>
                <p className="text-xl sm:text-2xl mb-3 sm:mb-4">Final Score: {score}</p>
                <p className="text-lg sm:text-xl mb-4 sm:mb-6">Coins: {coins}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={restartLevel}
                    className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:scale-110 transition-all"
                  >
                    <RotateCcw className="inline mr-2" size={20} />
                    Try Again
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:scale-110 transition-all"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === 'levelComplete' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="text-center text-white p-6 sm:p-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl sm:rounded-3xl shadow-2xl">
                <h2 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4">🎉 LEVEL COMPLETE!</h2>
                <p className="text-lg sm:text-2xl mb-2">Level {currentLevel}: {levels[currentLevel].name}</p>
                <p className="text-base sm:text-xl mb-3 sm:mb-4">Score: {score}</p>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6">Coins Collected: {coins}</p>
                {currentLevel < 3 ? (
                  <button
                    onClick={nextLevel}
                    className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-lg sm:text-xl hover:scale-110 transition-all shadow-xl"
                  >
                    Next Level →
                  </button>
                ) : (
                  <div>
                    <p className="text-2xl sm:text-3xl mb-4">🏆 YOU WIN! 🏆</p>
                    <button
                      onClick={() => setGameState('menu')}
                      className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-lg sm:text-xl hover:scale-110 transition-all shadow-xl"
                    >
                      <Trophy className="inline mr-2" size={24} />
                      Main Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {gameState === 'playing' && (
          <div className="sm:hidden bg-white/90 backdrop-blur-lg p-4 rounded-b-2xl">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-3">
                <button
                  onTouchStart={() => setTouchControls(prev => ({ ...prev, left: true }))}
                  onTouchEnd={() => setTouchControls(prev => ({ ...prev, left: false }))}
                  className="bg-blue-500 text-white w-16 h-16 rounded-xl font-black text-2xl active:bg-blue-600 shadow-lg"
                >
                  ←
                </button>
                <button
                  onTouchStart={() => setTouchControls(prev => ({ ...prev, right: true }))}
                  onTouchEnd={() => setTouchControls(prev => ({ ...prev, right: false }))}
                  className="bg-blue-500 text-white w-16 h-16 rounded-xl font-black text-2xl active:bg-blue-600 shadow-lg"
                >
                  →
                </button>
              </div>
              <button
                onTouchStart={() => setTouchControls(prev => ({ ...prev, jump: true }))}
                onTouchEnd={() => setTouchControls(prev => ({ ...prev, jump: false }))}
                className="bg-red-500 text-white w-20 h-20 rounded-full font-black text-lg active:bg-red-600 shadow-lg"
              >
                JUMP
              </button>
              <button
                onClick={() => setGameState('paused')}
                className="bg-gray-500 text-white w-12 h-12 rounded-lg active:bg-gray-600 shadow-lg flex items-center justify-center"
              >
                <Pause size={24} />
              </button>
            </div>
           
    )}
  </div>
</div>
);
}
