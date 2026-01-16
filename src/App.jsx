import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Save, ChevronLeft, Heart } from 'lucide-react';

const AnweshPlatformer = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [savedLevels, setSavedLevels] = useState([]);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const touchStartRef = useRef(null);

  const playerRef = useRef({
    x: 50,
    y: 300,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facingRight: true
  });

  const createLevels = () => {
    return [
      {
        name: "Level 1: The Beginning",
        platforms: [[0, 450, 800, 50], [150, 380, 120, 20], [320, 310, 120, 20], [500, 240, 120, 20], [650, 170, 150, 20]],
        coins: [[190, 340], [360, 270], [540, 200], [700, 130]],
        enemies: [[300, 430, 1, 1.5, 200, 400]],
        goal: [750, 120]
      },
      {
        name: "Level 2: Sky High",
        platforms: [[0, 450, 200, 50], [250, 400, 100, 20], [400, 350, 100, 20], [250, 280, 100, 20], [100, 210, 100, 20], [300, 140, 150, 20], [500, 200, 100, 20], [650, 130, 150, 20]],
        coins: [[290, 360], [140, 170], [350, 100], [700, 90]],
        enemies: [[260, 380, 1, 1, 250, 350], [310, 120, 1, 1.2, 300, 450]],
        goal: [720, 80]
      },
      {
        name: "Level 3: The Gauntlet",
        platforms: [[0, 450, 150, 50], [200, 400, 80, 20], [330, 350, 80, 20], [460, 300, 80, 20], [330, 230, 80, 20], [200, 180, 80, 20], [350, 110, 80, 20], [520, 160, 120, 20], [680, 220, 120, 20]],
        coins: [[230, 360], [490, 260], [230, 140], [560, 120], [730, 180]],
        enemies: [[210, 380, 1, 1.3, 200, 280], [470, 280, 1, 1.5, 460, 540], [530, 140, 1, 1.2, 520, 640]],
        goal: [750, 170]
      },
      {
        name: "Level 4: Stairway",
        platforms: [[0, 450, 150, 50], [150, 400, 100, 20], [250, 350, 100, 20], [350, 300, 100, 20], [450, 250, 100, 20], [550, 200, 100, 20], [650, 150, 150, 20]],
        coins: [[200, 360], [300, 310], [400, 260], [500, 210], [700, 110]],
        enemies: [[160, 380, 1, 1, 150, 250], [360, 280, 1, 1.3, 350, 450]],
        goal: [750, 100]
      },
      {
        name: "Level 5: Canyon Jump",
        platforms: [[0, 450, 200, 50], [280, 380, 90, 20], [350, 450, 150, 50], [580, 380, 90, 20], [600, 450, 200, 50], [250, 300, 100, 20], [500, 200, 100, 20]],
        coins: [[100, 410], [300, 260], [425, 410], [550, 160], [700, 410]],
        enemies: [[360, 430, 1, 1.5, 350, 500], [510, 180, 1, 1, 500, 600]],
        goal: [750, 400]
      },
      {
        name: "Level 6: Zigzag",
        platforms: [[0, 450, 150, 50], [200, 380, 100, 20], [350, 310, 100, 20], [200, 240, 100, 20], [350, 170, 100, 20], [500, 240, 100, 20], [650, 170, 150, 20]],
        coins: [[250, 340], [400, 270], [250, 200], [400, 130], [550, 200]],
        enemies: [[210, 360, 1, 1.2, 200, 300], [360, 290, 1, 1.4, 350, 450], [510, 220, 1, 1.3, 500, 600]],
        goal: [750, 120]
      },
      {
        name: "Level 7: The Pit",
        platforms: [[0, 450, 150, 50], [100, 350, 80, 20], [220, 280, 80, 20], [340, 200, 120, 20], [500, 280, 80, 20], [620, 350, 80, 20], [650, 450, 150, 50]],
        coins: [[140, 310], [260, 240], [390, 160], [540, 240], [660, 310]],
        enemies: [[110, 330, 1, 1, 100, 180], [350, 180, 1, 1.5, 340, 460]],
        goal: [750, 400]
      },
      {
        name: "Level 8: Speedrun",
        platforms: [[0, 450, 800, 50], [150, 350, 80, 20], [280, 350, 80, 20], [410, 350, 80, 20], [540, 350, 80, 20]],
        coins: [[190, 310], [320, 310], [450, 310], [580, 310], [700, 410]],
        enemies: [[200, 430, 1, 2, 100, 300], [400, 430, 1, 2.2, 350, 500], [600, 430, 1, 2.5, 520, 680]],
        goal: [750, 400]
      },
      {
        name: "Level 9: Tower Climb",
        platforms: [[0, 450, 150, 50], [180, 390, 100, 20], [80, 330, 100, 20], [180, 270, 100, 20], [80, 210, 100, 20], [180, 150, 100, 20], [300, 90, 500, 20]],
        coins: [[220, 350], [120, 290], [220, 230], [120, 170], [550, 50]],
        enemies: [[190, 370, 1, 1.2, 180, 280], [90, 310, 1, 1.3, 80, 180]],
        goal: [750, 40]
      },
      {
        name: "Level 10: Double Trouble",
        platforms: [[0, 450, 200, 50], [300, 350, 200, 20], [600, 250, 200, 20], [300, 150, 200, 20]],
        coins: [[100, 410], [400, 310], [700, 210], [400, 110]],
        enemies: [[310, 330, 1, 1.5, 300, 500], [460, 330, -1, 1.5, 300, 500], [610, 230, 1, 1.8, 600, 800], [760, 230, -1, 1.8, 600, 800]],
        goal: [400, 100]
      },
      {
        name: "Level 11: Narrow Path",
        platforms: [[0, 450, 120, 50], [170, 400, 60, 20], [280, 350, 60, 20], [390, 300, 60, 20], [500, 250, 60, 20], [610, 200, 60, 20], [720, 150, 80, 20]],
        coins: [[200, 360], [310, 310], [420, 260], [530, 210], [640, 160]],
        enemies: [[180, 380, 1, 1, 170, 230], [400, 280, 1, 1.2, 390, 450]],
        goal: [750, 100]
      },
      {
        name: "Level 12: The Maze",
        platforms: [[0, 450, 150, 50], [200, 450, 150, 50], [400, 450, 150, 50], [600, 450, 200, 50], [100, 350, 100, 20], [300, 350, 100, 20], [500, 350, 100, 20], [200, 250, 100, 20], [400, 250, 100, 20], [300, 150, 200, 20]],
        coins: [[150, 310], [350, 310], [250, 210], [450, 210], [400, 110]],
        enemies: [[210, 430, 1, 1.5, 200, 350], [410, 430, 1, 1.7, 400, 550], [310, 130, 1, 1.4, 300, 500]],
        goal: [450, 100]
      },
      {
        name: "Level 13: Platformer Pro",
        platforms: [[0, 450, 120, 50], [150, 380, 70, 20], [250, 320, 70, 20], [350, 260, 70, 20], [470, 200, 70, 20], [570, 140, 70, 20], [670, 80, 130, 20]],
        coins: [[180, 340], [280, 280], [380, 220], [500, 160], [600, 100], [730, 40]],
        enemies: [[160, 360, 1, 1, 150, 220], [360, 240, 1, 1.3, 350, 420], [580, 120, 1, 1.5, 570, 640]],
        goal: [750, 30]
      },
      {
        name: "Level 14: Floating Islands",
        platforms: [[0, 450, 150, 50], [200, 350, 100, 20], [350, 280, 100, 20], [500, 350, 100, 20], [650, 280, 100, 20], [400, 150, 150, 20]],
        coins: [[250, 310], [400, 240], [550, 310], [700, 240], [475, 110]],
        enemies: [[210, 330, 1, 1.3, 200, 300], [510, 330, 1, 1.5, 500, 600], [410, 130, 1, 1.2, 400, 550]],
        goal: [500, 100]
      },
      {
        name: "Level 15: The Long Jump",
        platforms: [[0, 450, 150, 50], [220, 400, 100, 20], [380, 370, 90, 20], [520, 350, 100, 20], [650, 300, 150, 20]],
        coins: [[100, 410], [270, 360], [430, 330], [580, 310], [720, 260]],
        enemies: [[230, 380, 1, 1, 220, 320], [530, 330, 1, 1.2, 520, 620]],
        goal: [750, 250]
      },
      {
        name: "Level 16: Precision",
        platforms: [[0, 450, 150, 50], [180, 390, 50, 20], [260, 330, 50, 20], [340, 270, 50, 20], [420, 210, 50, 20], [500, 150, 50, 20], [580, 210, 50, 20], [660, 270, 50, 20], [720, 330, 80, 20]],
        coins: [[205, 350], [285, 290], [365, 230], [525, 110], [685, 230]],
        enemies: [[190, 370, 1, 0.8, 180, 230], [350, 250, 1, 1, 340, 390]],
        goal: [750, 280]
      },
      {
        name: "Level 17: Rush Hour",
        platforms: [[0, 450, 800, 50], [100, 350, 100, 20], [250, 280, 100, 20], [400, 210, 100, 20], [550, 280, 100, 20], [700, 350, 100, 20]],
        coins: [[150, 310], [300, 240], [450, 170], [600, 240], [750, 310]],
        enemies: [[110, 430, 1, 2.5, 50, 750], [400, 430, -1, 2.8, 50, 750]],
        goal: [750, 300]
      },
      {
        name: "Level 18: Bounce House",
        platforms: [[0, 450, 150, 50], [200, 400, 80, 20], [330, 320, 80, 20], [460, 400, 80, 20], [590, 320, 80, 20], [720, 240, 80, 20]],
        coins: [[240, 360], [370, 280], [500, 360], [630, 280], [760, 200]],
        enemies: [[210, 380, 1, 1.3, 200, 280], [470, 380, 1, 1.5, 460, 540]],
        goal: [750, 190]
      },
      {
        name: "Level 19: The Descent",
        platforms: [[0, 100, 150, 20], [200, 170, 100, 20], [350, 240, 100, 20], [500, 310, 100, 20], [650, 380, 150, 20], [600, 450, 200, 50]],
        coins: [[75, 60], [250, 130], [400, 200], [550, 270], [700, 340]],
        enemies: [[210, 150, 1, 1.2, 200, 300], [510, 290, 1, 1.4, 500, 600]],
        goal: [750, 400]
      },
      {
        name: "Level 20: Platform Chaos",
        platforms: [[0, 450, 120, 50], [150, 400, 80, 20], [270, 350, 80, 20], [390, 300, 80, 20], [510, 350, 80, 20], [630, 400, 80, 20], [720, 450, 80, 50]],
        coins: [[190, 360], [310, 310], [430, 260], [550, 310], [670, 360]],
        enemies: [[160, 380, 1, 1.5, 150, 230], [400, 280, 1, 1.8, 390, 470], [640, 380, 1, 1.6, 630, 710]],
        goal: [750, 400]
      },
      {
        name: "Level 21: Sky Walker",
        platforms: [[0, 450, 150, 50], [200, 350, 100, 20], [350, 250, 100, 20], [500, 150, 100, 20], [650, 250, 100, 20]],
        coins: [[250, 310], [400, 210], [550, 110], [700, 210]],
        enemies: [[210, 330, 1, 1.4, 200, 300], [510, 130, 1, 1.6, 500, 600]],
        goal: [700, 200]
      },
      {
        name: "Level 22: The Challenge",
        platforms: [[0, 450, 100, 50], [130, 400, 60, 20], [220, 350, 60, 20], [310, 300, 60, 20], [400, 250, 60, 20], [490, 200, 60, 20], [580, 150, 60, 20], [670, 100, 130, 20]],
        coins: [[160, 360], [250, 310], [340, 260], [430, 210], [520, 160], [730, 60]],
        enemies: [[140, 380, 1, 1.1, 130, 190], [320, 280, 1, 1.3, 310, 370], [590, 130, 1, 1.5, 580, 640]],
        goal: [750, 50]
      },
      {
        name: "Level 23: Double Jump Gap",
        platforms: [[0, 450, 150, 50], [250, 400, 120, 20], [420, 380, 110, 20], [580, 350, 120, 20], [720, 300, 80, 20]],
        coins: [[100, 410], [310, 360], [480, 340], [640, 310], [750, 260]],
        enemies: [[260, 380, 1, 1.5, 250, 370], [590, 330, 1, 1.7, 580, 700]],
        goal: [750, 250]
      },
      {
        name: "Level 24: Spiral Ascent",
        platforms: [[0, 450, 150, 50], [200, 400, 100, 20], [350, 350, 100, 20], [500, 300, 100, 20], [350, 250, 100, 20], [200, 200, 100, 20], [350, 150, 100, 20], [500, 100, 200, 20]],
        coins: [[250, 360], [400, 310], [550, 260], [400, 210], [250, 160], [600, 60]],
        enemies: [[210, 380, 1, 1.3, 200, 300], [510, 280, 1, 1.5, 500, 600], [360, 130, 1, 1.4, 350, 450]],
        goal: [650, 50]
      },
      {
        name: "Level 25: The Gauntlet Returns",
        platforms: [[0, 450, 150, 50], [180, 400, 70, 20], [280, 350, 70, 20], [380, 300, 70, 20], [480, 250, 70, 20], [580, 200, 70, 20], [680, 150, 120, 20]],
        coins: [[215, 360], [315, 310], [415, 260], [515, 210], [615, 160], [740, 110]],
        enemies: [[190, 380, 1, 1.6, 180, 250], [390, 280, 1, 1.8, 380, 450], [590, 180, 1, 2, 580, 650]],
        goal: [750, 100]
      },
      {
        name: "Level 26: Island Hopper",
        platforms: [[0, 450, 120, 50], [160, 380, 80, 20], [280, 310, 80, 20], [400, 240, 80, 20], [520, 310, 80, 20], [640, 380, 80, 20], [720, 450, 80, 50]],
        coins: [[200, 340], [320, 270], [440, 200], [560, 270], [680, 340]],
        enemies: [[170, 360, 1, 1.4, 160, 240], [410, 220, 1, 1.6, 400, 480], [650, 360, 1, 1.5, 640, 720]],
        goal: [750, 400]
      },
      {
        name: "Level 27: Speed Challenge",
        platforms: [[0, 450, 800, 50], [100, 350, 100, 20], [300, 280, 100, 20], [500, 210, 100, 20], [700, 140, 100, 20]],
        coins: [[150, 310], [350, 240], [550, 170], [750, 100]],
        enemies: [[120, 430, 1, 2.8, 50, 750], [350, 430, -1, 3, 50, 750], [600, 430, 1, 3.2, 50, 750]],
        goal: [750, 90]
      },
      {
        name: "Level 28: Precision Master",
        platforms: [[0, 450, 130, 50], [160, 400, 45, 20], [235, 350, 45, 20], [310, 300, 45, 20], [385, 250, 45, 20], [460, 200, 45, 20], [535, 150, 45, 20], [610, 100, 45, 20], [685, 50, 115, 20]],
        coins: [[182, 360], [257, 310], [332, 260], [407, 210], [482, 160], [557, 110], [740, 10]],
        enemies: [[170, 380, 1, 0.9, 160, 205], [320, 280, 1, 1.1, 310, 355], [470, 180, 1, 1.3, 460, 505]],
        goal: [750, 0]
      },
      {
        name: "Level 29: Ultimate Test",
        platforms: [[0, 450, 120, 50], [150, 400, 70, 20], [250, 350, 70, 20], [350, 300, 70, 20], [450, 250, 70, 20], [350, 200, 70, 20], [250, 150, 70, 20], [150, 100, 70, 20], [250, 50, 70, 20], [400, 50, 400, 20]],
        coins: [[185, 360], [285, 310], [385, 260], [485, 210], [385, 160], [285, 110], [185, 60], [600, 10]],
        enemies: [[160, 380, 1, 1.5, 150, 220], [360, 280, 1, 1.7, 350, 420], [260, 130, 1, 1.6, 250, 320], [460, 30, 1, 2, 400, 800]],
        goal: [750, 0]
      },
      {
        name: "Level 30: Victory Lap",
        platforms: [[0, 450, 200, 50], [250, 380, 120, 20], [420, 310, 120, 20], [590, 240, 120, 20], [300, 170, 150, 20], [500, 100, 300, 20]],
        coins: [[100, 410], [310, 340], [480, 270], [650, 200], [375, 130], [650, 60]],
        enemies: [[260, 360, 1, 1.8, 250, 370], [430, 290, 1, 2, 420, 540], [600, 220, 1, 2.2, 590, 710], [510, 80, 1, 2.5, 500, 800]],
        goal: [750, 50]
      }
    ];
  };

  const levelsRef = useRef(createLevels());

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const result = await window.storage.get('anwesh-game-progress');
        if (result) {
          const data = JSON.parse(result.value);
          setSavedLevels(data.savedLevels || []);
          setCurrentLevel(data.currentLevel || 0);
          setScore(data.score || 0);
        }
      } catch (error) {
        console.log('No saved progress found');
      }
    };
    loadProgress();
  }, []);

  const saveProgress = async () => {
    try {
      const data = {
        savedLevels,
        currentLevel,
        score,
        timestamp: new Date().toISOString()
      };
      await window.storage.set('anwesh-game-progress', JSON.stringify(data));
      alert('Progress saved!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save progress');
    }
  };

  const drawPlayer = (ctx, player) => {
    const { x, y, width, height, facingRight } = player;
    
    ctx.save();
    if (!facingRight) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(x, y);
    }

    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(8, 0, 16, 16);
    
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(6, 0, 20, 6);
    ctx.fillRect(8, -2, 16, 4);
    ctx.fillRect(facingRight ? 20 : -4, 2, 6, 4);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 6, 2, 2);
    ctx.fillRect(18, 6, 2, 2);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(6, 16, 20, 18);
    
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(2, 18, 4, 12);
    ctx.fillRect(26, 18, 4, 12);
    
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(8, 34, 7, 14);
    ctx.fillRect(17, 34, 7, 14);
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(6, 46, 9, 2);
    ctx.fillRect(17, 46, 9, 2);
    
    ctx.restore();
  };

  const drawPlatform = (ctx, x, y, width, height) => {
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(x, y, width, 8);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y + 8, width, height - 8);
    ctx.fillStyle = '#654321';
    for (let i = 0; i < width; i += 20) {
      ctx.fillRect(x + i, y + 10, 3, 3);
      ctx.fillRect(x + i + 10, y + 20, 3, 3);
    }
  };

  const drawCoin = (ctx, x, y, collected) => {
    if (collected) return;
    const time = Date.now() / 1000;
    const float = Math.sin(time * 3) * 3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y + float, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(x, y + float, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFE0';
    ctx.beginPath();
    ctx.arc(x - 2, y + float - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawEnemy = (ctx, x, y) => {
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x, y, 30, 30);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 5, y + 8, 6, 6);
    ctx.fillRect(x + 19, y + 8, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 7, y + 10, 3, 3);
    ctx.fillRect(x + 21, y + 10, 3, 3);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 8, y + 20, 4, 5);
    ctx.fillRect(x + 18, y + 20, 4, 5);
  };

  const drawGoal = (ctx, x, y) => {
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 18, y, 4, 50);
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(x + 22, y);
    ctx.lineTo(x + 40, y + 10);
    ctx.lineTo(x + 22, y + 20);
    ctx.fill();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 14, y + 45, 12, 5);
  };

  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const resetLevel = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameOver');
        return 0;
      }
      return newLives;
    });
    
    playerRef.current = {
      x: 50,
      y: 300,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true
    };
  };

  const nextLevel = () => {
    if (currentLevel < levelsRef.current.length - 1) {
      setCurrentLevel(prev => prev + 1);
      if (!savedLevels.includes(currentLevel + 1)) {
        setSavedLevels(prev => [...prev, currentLevel + 1]);
      }
      playerRef.current = {
        x: 50,
        y: 300,
        width: 32,
        height: 48,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        facingRight: true
      };
    } else {
      setGameState('win');
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    const level = levelsRef.current[currentLevel];
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gravity = 0.6;
    const moveSpeed = 5;
    const jumpPower = 12;
    
    if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
      player.velocityX = -moveSpeed;
      player.facingRight = false;
    } else if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
      player.velocityX = moveSpeed;
      player.facingRight = true;
    } else {
      player.velocityX = 0;
    }
    
    if ((keysRef.current['ArrowUp'] || keysRef.current[' '] || keysRef.current['w']) && player.onGround) {
      player.velocityY = -jumpPower;
      player.onGround = false;
    }
    
    player.velocityY += gravity;
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    player.onGround = false;
    level.platforms.forEach(p => {
      const platform = { x: p[0], y: p[1], width: p[2], height: p[3] };
      if (checkCollision(player, platform)) {
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.onGround = true;
        } else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
          player.y = platform.y + platform.height;
          player.velocityY = 0;
        } else {
          if (player.velocityX > 0) {
            player.x = platform.x - player.width;
          } else if (player.velocityX < 0) {
            player.x = platform.x + platform.width;
          }
        }
      }
    });
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height) {
      resetLevel();
    }
    
    level.enemies.forEach(e => {
      if (!e[0]) return;
      e[0] += e[2] * e[3];
      
      if (e[0] <= e[4] || e[0] >= e[5] - 30) {
        e[2] *= -1;
      }
      
      const enemy = { x: e[0], y: e[1], width: 30, height: 30 };
      if (checkCollision(player, enemy)) {
        if (player.velocityY > 0 && player.y + player.height - 10 < enemy.y) {
          e[0] = -100;
          player.velocityY = -8;
          setScore(prev => prev + 50);
        } else {
          resetLevel();
        }
      }
    });
    
    level.coins.forEach(coin => {
      if (coin.length === 2) coin.push(false);
      if (!coin[2] && 
          Math.abs(player.x + player.width/2 - coin[0]) < 20 &&
          Math.abs(player.y + player.height/2 - coin[1]) < 20) {
        coin[2] = true;
        setScore(prev => prev + 10);
      }
    });
    
    if (checkCollision(player, { x: level.goal[0], y: level.goal[1], width: 40, height: 50 })) {
      nextLevel();
    }
    
    level.platforms.forEach(p => drawPlatform(ctx, p[0], p[1], p[2], p[3]));
    level.coins.forEach(c => drawCoin(ctx, c[0], c[1], c[2]));
    level.enemies.forEach(e => { if (e[0] > 0) drawEnemy(ctx, e[0], e[1]); });
    drawGoal(ctx, level.goal[0], level.goal[1]);
    drawPlayer(ctx, player);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${currentLevel + 1}/${levelsRef.current.length}`, 10, 60);
    
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(700 + i * 30, 30, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, currentLevel, score, lives]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key] = true;
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 30) {
        keysRef.current['ArrowRight'] = true;
        keysRef.current['ArrowLeft'] = false;
      } else if (deltaX < -30) {
        keysRef.current['ArrowLeft'] = true;
        keysRef.current['ArrowRight'] = false;
      }
    } else if (deltaY < -30) {
      keysRef.current['ArrowUp'] = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    keysRef.current = {};
  };

  const startGame = () => {
    setLives(3);
    setScore(0);
    playerRef.current = {
      x: 50,
      y: 300,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true
    };
    setGameState('playing');
  };

  const selectLevel = (levelIndex) => {
    setCurrentLevel(levelIndex);
    playerRef.current = {
      x: 50,
      y: 300,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">Anwesh's Adventure</h1>
        <p className="text-center text-gray-600 mb-4">Help Anwesh collect coins and reach the flag!</p>
        
        {gameState === 'menu' && (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Select Level</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-h-96 overflow-y-auto">
                {levelsRef.current.map((level, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectLevel(idx)}
                    disabled={idx > 0 && !savedLevels.includes(idx)}
                    className={`p-3 rounded-lg font-bold transition ${
                      idx > 0 && !savedLevels.includes(idx)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : currentLevel === idx
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {idx + 1}
                    {idx > 0 && !savedLevels.includes(idx) && <div className="text-xs">🔒</div>}
                  </button>
                ))}
              </div>
              
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-600 transition flex items-center gap-2 mx-auto"
              >
                <Play size={24} /> Start Game
              </button>
              
              <div className="mt-6 text-left bg-white p-4 rounded">
                <h3 className="font-bold mb-2">Controls:</h3>
                <p>🖥️ Desktop: Arrow Keys or WASD to move, Space/Up to jump</p>
                <p>📱 Mobile: Swipe left/right to move, swipe up to jump</p>
                <p>❤️ You have 3 lives - don't run out!</p>
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div className="space-y-4">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={500} 
              className="border-4 border-blue-500 rounded mx-auto max-w-full touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => setGameState('menu')}
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600"
              >
                <ChevronLeft size={20} /> Menu
              </button>
              <button
                onClick={() => {
                  playerRef.current = {
                    x: 50,
                    y: 300,
                    width: 32,
                    height: 48,
                    velocityX: 0,
                    velocityY: 0,
                    onGround: false,
                    facingRight: true
                  };
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-600"
              >
                <RotateCcw size={20} /> Restart Level
              </button>
              <button
                onClick={saveProgress}
                className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-600"
              >
                <Save size={20} /> Save Progress
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-red-600">Game Over!</h2>
            <p className="text-xl">Final Score: {score}</p>
            <p className="text-lg">Level Reached: {currentLevel + 1}</p>
            <button
              onClick={() => {
                setGameState('menu');
                setCurrentLevel(0);
                setScore(0);
                setLives(3);
              }}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600"
            >
              Back to Menu
            </button>
          </div>
        )}
        
        {gameState === 'win' && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600">🎉 बधाई छ! 🎉</h2>
            <p className="text-xl">तपाईंले सबै स्तरहरू पूरा गर्नुभयो!</p>
            <p className="text-2xl font-bold">अन्तिम स्कोर: {score}</p>
            <button
              onClick={() => {
                setGameState('menu');
                setCurrentLevel(0);
                setScore(0);
                setLives(3);
                levelsRef.current = createLevels();
              }}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600"
            >
              फेरि खेल्नुहोस्
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnweshPlatformer;
