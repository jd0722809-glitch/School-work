// Embedded pure HTML/JS/CSS game source codes for 100% offline, guaranteed iframe rendering
export const EMBEDDED_GAMES = {
  'snake-retro': `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    #game-container { position: relative; display: flex; flex-direction: column; align-items: center; }
    .header { display: flex; justify-content: space-between; width: 400px; max-width: 95vw; margin-bottom: 12px; font-weight: 700; font-size: 1.1rem; }
    .score-badge { background: #1e293b; padding: 6px 16px; border-radius: 8px; border: 1px solid #334155; }
    canvas { background: #020617; border: 2px solid #38bdf8; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.2); }
    #overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; }
    button { background: #38bdf8; color: #0f172a; border: none; padding: 10px 24px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: transform 0.1s, background 0.2s; margin-top: 12px; }
    button:hover { background: #7dd3fc; transform: scale(1.05); }
    .controls-hint { margin-top: 12px; font-size: 0.85rem; color: #94a3b8; }
  </style>
</head>
<body>
  <div id="game-container">
    <div class="header">
      <div class="score-badge">Score: <span id="score">0</span></div>
      <div class="score-badge">High: <span id="high">0</span></div>
    </div>
    <canvas id="canvas" width="400" height="400"></canvas>
    <div id="overlay">
      <h2 id="msg-title" style="font-size: 1.8rem; margin-bottom: 8px;">RETRO SNAKE</h2>
      <p id="msg-sub" style="color: #94a3b8; margin-bottom: 12px;">Use Arrow Keys or WASD to Move</p>
      <button id="start-btn">PLAY GAME</button>
    </div>
    <div class="controls-hint">Arrow Keys / WASD • Space to Pause</div>
  </div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');
    const msgTitle = document.getElementById('msg-title');
    const msgSub = document.getElementById('msg-sub');

    const GRID_SIZE = 20;
    const COUNT = canvas.width / GRID_SIZE;
    let snake = [];
    let food = { x: 5, y: 5 };
    let dx = 1, dy = 0;
    let nextDx = 1, nextDy = 0;
    let score = 0;
    let high = localStorage.getItem('snake_high') || 0;
    highEl.textContent = high;
    let gameInterval = null;
    let running = false;

    function reset() {
      snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ];
      dx = 1; dy = 0;
      nextDx = 1; nextDy = 0;
      score = 0;
      scoreEl.textContent = score;
      placeFood();
    }

    function placeFood() {
      while (true) {
        food.x = Math.floor(Math.random() * COUNT);
        food.y = Math.floor(Math.random() * COUNT);
        if (!snake.some(s => s.x === food.x && s.y === food.y)) break;
      }
    }

    function update() {
      dx = nextDx;
      dy = nextDy;
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= COUNT || head.y < 0 || head.y >= COUNT) {
        gameOver();
        return;
      }

      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        if (score > high) {
          high = score;
          highEl.textContent = high;
          localStorage.setItem('snake_high', high);
        }
        placeFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(food.x * GRID_SIZE + GRID_SIZE/2, food.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.roundRect(s.x * GRID_SIZE + 1, s.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
        ctx.fill();
      });
    }

    function gameOver() {
      clearInterval(gameInterval);
      running = false;
      msgTitle.textContent = 'GAME OVER';
      msgSub.textContent = 'Final Score: ' + score;
      startBtn.textContent = 'PLAY AGAIN';
      overlay.style.display = 'flex';
    }

    function start() {
      reset();
      overlay.style.display = 'none';
      running = true;
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(update, 90);
      draw();
    }

    startBtn.addEventListener('click', start);

    window.addEventListener('keydown', e => {
      if (!running && (e.code === 'Space' || e.code === 'Enter')) {
        start();
        return;
      }
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dy !== 1) { nextDx = 0; nextDy = -1; }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dy !== -1) { nextDx = 0; nextDy = 1; }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dx !== 1) { nextDx = -1; nextDy = 0; }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dx !== -1) { nextDx = 1; nextDy = 0; }
          break;
      }
    });

    draw();
  </script>
</body>
</html>`,

  'chrome-dino': `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    #wrapper { position: relative; }
    .header { display: flex; justify-content: space-between; width: 600px; max-width: 95vw; margin-bottom: 12px; font-weight: 700; }
    canvas { background: #1e293b; border-radius: 12px; border: 2px solid #475569; display: block; max-width: 95vw; }
    #overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; }
    button { background: #10b981; color: #0f172a; border: none; padding: 10px 24px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 10px; }
    button:hover { background: #34d399; }
    .badge { background: #334155; padding: 6px 14px; border-radius: 6px; }
  </style>
</head>
<body>
  <div id="wrapper">
    <div class="header">
      <div class="badge">Score: <span id="score">0</span></div>
      <div class="badge">Speed: <span id="speed">1x</span></div>
      <div class="badge">High: <span id="high">0</span></div>
    </div>
    <canvas id="c" width="600" height="250"></canvas>
    <div id="overlay">
      <h2 id="t" style="font-size: 1.8rem; margin-bottom: 6px;">T-REX RUNNER</h2>
      <p id="s" style="color: #94a3b8;">Press Spacebar or Click to Jump</p>
      <button id="b">START RUN</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score');
    const speedEl = document.getElementById('speed');
    const highEl = document.getElementById('high');
    const overlay = document.getElementById('overlay');
    const btn = document.getElementById('b');
    const title = document.getElementById('t');
    const sub = document.getElementById('s');

    let high = localStorage.getItem('dino_high') || 0;
    highEl.textContent = high;

    let dino = { x: 50, y: 190, w: 32, h: 40, vy: 0, grounded: true, ducking: false };
    let obstacles = [];
    let clouds = [];
    let score = 0;
    let speed = 5;
    let running = false;
    let reqId = null;

    function reset() {
      dino = { x: 50, y: 190, w: 30, h: 38, vy: 0, grounded: true, ducking: false };
      obstacles = [];
      clouds = [
        { x: 100, y: 40, speed: 0.5 },
        { x: 300, y: 60, speed: 0.7 },
        { x: 500, y: 30, speed: 0.6 }
      ];
      score = 0;
      speed = 5;
    }

    function jump() {
      if (dino.grounded) {
        dino.vy = -11;
        dino.grounded = false;
      }
    }

    function update() {
      if (!running) return;

      // Dino physics
      dino.vy += 0.55;
      dino.y += dino.vy;
      const groundY = dino.ducking ? 205 : 190;
      if (dino.y >= groundY) {
        dino.y = groundY;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Speed up slightly over time
      score += 1;
      if (score % 250 === 0) speed += 0.4;
      scoreEl.textContent = Math.floor(score / 5);
      speedEl.textContent = (speed / 5).toFixed(1) + 'x';

      // Move clouds
      clouds.forEach(cl => {
        cl.x -= cl.speed;
        if (cl.x < -60) cl.x = c.width + Math.random() * 80;
      });

      // Spawn obstacles
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < c.width - (180 + Math.random() * 160)) {
        const isBird = score > 600 && Math.random() > 0.65;
        if (isBird) {
          obstacles.push({ x: c.width, y: 155, w: 28, h: 20, type: 'bird' });
        } else {
          const h = 25 + Math.random() * 25;
          obstacles.push({ x: c.width, y: 228 - h, w: 20 + Math.random() * 12, h: h, type: 'cactus' });
        }
      }

      // Move & collide obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision check
        const dw = dino.ducking ? 38 : dino.w;
        const dh = dino.ducking ? 22 : dino.h;
        const dy = dino.ducking ? dino.y + 16 : dino.y;

        if (
          dino.x + 6 < obs.x + obs.w &&
          dino.x + dw - 6 > obs.x &&
          dy + 4 < obs.y + obs.h &&
          dy + dh > obs.y + 4
        ) {
          gameOver();
          return;
        }

        if (obs.x < -50) obstacles.splice(i, 1);
      }

      draw();
      reqId = requestAnimationFrame(update);
    }

    function draw() {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, c.width, c.height);

      // Clouds
      ctx.fillStyle = '#334155';
      clouds.forEach(cl => {
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 14, 0, Math.PI * 2);
        ctx.arc(cl.x + 14, cl.y - 4, 18, 0, Math.PI * 2);
        ctx.arc(cl.x + 28, cl.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground Line
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 228);
      ctx.lineTo(c.width, 228);
      ctx.stroke();

      // Ground details (dashes)
      ctx.strokeStyle = '#475569';
      for (let x = (score * speed) % 40 * -1; x < c.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 235);
        ctx.lineTo(x + 15, 235);
        ctx.stroke();
      }

      // Draw Dino
      ctx.fillStyle = '#10b981';
      if (dino.ducking) {
        ctx.fillRect(dino.x, dino.y + 16, 38, 22);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(dino.x + 30, dino.y + 18, 4, 4); // eye
      } else {
        ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(dino.x + 20, dino.y + 4, 4, 4); // eye
      }

      // Draw Obstacles
      obstacles.forEach(obs => {
        if (obs.type === 'cactus') {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          ctx.fillRect(obs.x - 4, obs.y + 6, obs.w + 8, 4);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
      });
    }

    function gameOver() {
      running = false;
      const finalScore = Math.floor(score / 5);
      if (finalScore > high) {
        high = finalScore;
        highEl.textContent = high;
        localStorage.setItem('dino_high', high);
      }
      title.textContent = 'RUN CRASHED!';
      sub.textContent = 'Score: ' + finalScore;
      btn.textContent = 'RETRY';
      overlay.style.display = 'flex';
    }

    function start() {
      reset();
      overlay.style.display = 'none';
      running = true;
      if (reqId) cancelAnimationFrame(reqId);
      update();
    }

    btn.addEventListener('click', start);
    c.addEventListener('click', () => { if (running) jump(); });

    window.addEventListener('keydown', e => {
      if (!running && (e.code === 'Space' || e.code === 'Enter')) {
        start();
        return;
      }
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') {
        jump();
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        dino.ducking = true;
      }
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowDown' || e.key === 's') {
        dino.ducking = false;
      }
    });

    draw();
  </script>
</body>
</html>`,

  'pong-classic': `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    #wrapper { position: relative; }
    .header { display: flex; justify-content: space-around; width: 600px; max-width: 95vw; margin-bottom: 12px; font-size: 1.5rem; font-weight: bold; }
    canvas { background: #020617; border: 2px solid #8b5cf6; border-radius: 12px; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2); }
    #overlay { position: absolute; inset: 0; background: rgba(9, 13, 22, 0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; }
    button { background: #8b5cf6; color: #fff; border: none; padding: 10px 24px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 12px; }
    button:hover { background: #a78bfa; }
  </style>
</head>
<body>
  <div id="wrapper">
    <div class="header">
      <div>Player: <span id="pScore" style="color: #38bdf8;">0</span></div>
      <div>CPU: <span id="cScore" style="color: #f43f5e;">0</span></div>
    </div>
    <canvas id="c" width="600" height="380"></canvas>
    <div id="overlay">
      <h2 id="t" style="font-size: 1.8rem; margin-bottom: 6px;">RETRO PONG</h2>
      <p id="s" style="color: #94a3b8;">Use Mouse or Up/Down Arrow to control paddle</p>
      <button id="b">START MATCH</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const pScoreEl = document.getElementById('pScore');
    const cScoreEl = document.getElementById('cScore');
    const overlay = document.getElementById('overlay');
    const btn = document.getElementById('b');
    const t = document.getElementById('t');
    const s = document.getElementById('s');

    let pScore = 0, cScore = 0;
    let paddleH = 75, paddleW = 12;
    let pY = 150, cY = 150;
    let ball = { x: 300, y: 190, vx: 4.5, vy: 3, r: 7 };
    let running = false;
    let reqId = null;

    function resetBall(servingToPlayer) {
      ball.x = c.width / 2;
      ball.y = c.height / 2;
      const speed = 5;
      const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
      ball.vx = (servingToPlayer ? -1 : 1) * speed * Math.cos(angle);
      ball.vy = speed * Math.sin(angle);
    }

    function update() {
      if (!running) return;

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top / Bottom bounds
      if (ball.y - ball.r <= 0) { ball.y = ball.r; ball.vy *= -1; }
      if (ball.y + ball.r >= c.height) { ball.y = c.height - ball.r; ball.vy *= -1; }

      // AI Paddle Movement (Smooth tracking with slight imperfection)
      const targetY = ball.y - paddleH / 2;
      cY += (targetY - cY) * 0.085;
      cY = Math.max(0, Math.min(c.height - paddleH, cY));

      // Player Paddle Collision
      if (ball.x - ball.r <= 20 + paddleW && ball.x + ball.r >= 20) {
        if (ball.y >= pY && ball.y <= pY + paddleH) {
          const hitPos = (ball.y - (pY + paddleH / 2)) / (paddleH / 2);
          const speed = Math.min(10, Math.hypot(ball.vx, ball.vy) * 1.05);
          const angle = hitPos * (Math.PI / 3.5);
          ball.vx = Math.abs(speed * Math.cos(angle));
          ball.vy = speed * Math.sin(angle);
          ball.x = 20 + paddleW + ball.r;
        }
      }

      // CPU Paddle Collision
      if (ball.x + ball.r >= c.width - 20 - paddleW && ball.x - ball.r <= c.width - 20) {
        if (ball.y >= cY && ball.y <= cY + paddleH) {
          const hitPos = (ball.y - (cY + paddleH / 2)) / (paddleH / 2);
          const speed = Math.min(10, Math.hypot(ball.vx, ball.vy) * 1.05);
          const angle = hitPos * (Math.PI / 3.5);
          ball.vx = -Math.abs(speed * Math.cos(angle));
          ball.vy = speed * Math.sin(angle);
          ball.x = c.width - 20 - paddleW - ball.r;
        }
      }

      // Point scoring
      if (ball.x < 0) {
        cScore++;
        cScoreEl.textContent = cScore;
        if (cScore >= 5) { endMatch('CPU WINS!'); return; }
        resetBall(false);
      } else if (ball.x > c.width) {
        pScore++;
        pScoreEl.textContent = pScore;
        if (pScore >= 5) { endMatch('YOU WIN!'); return; }
        resetBall(true);
      }

      draw();
      reqId = requestAnimationFrame(update);
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, c.width, c.height);

      // Center dashed net
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(c.width / 2, 0);
      ctx.lineTo(c.width / 2, c.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player Paddle
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(20, pY, paddleW, paddleH, 4);
      ctx.fill();

      // CPU Paddle
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(c.width - 20 - paddleW, cY, paddleW, paddleH, 4);
      ctx.fill();

      // Ball
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    }

    function endMatch(winnerText) {
      running = false;
      t.textContent = winnerText;
      s.textContent = 'Final: ' + pScore + ' - ' + cScore;
      btn.textContent = 'PLAY AGAIN';
      overlay.style.display = 'flex';
    }

    function start() {
      pScore = 0; cScore = 0;
      pScoreEl.textContent = '0';
      cScoreEl.textContent = '0';
      resetBall(true);
      overlay.style.display = 'none';
      running = true;
      if (reqId) cancelAnimationFrame(reqId);
      update();
    }

    btn.addEventListener('click', start);

    c.addEventListener('mousemove', e => {
      const rect = c.getBoundingClientRect();
      const clientY = e.clientY - rect.top;
      pY = Math.max(0, Math.min(c.height - paddleH, clientY - paddleH / 2));
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' || e.key === 'w') pY = Math.max(0, pY - 24);
      if (e.key === 'ArrowDown' || e.key === 's') pY = Math.min(c.height - paddleH, pY + 24);
    });

    draw();
  </script>
</body>
</html>`
};
