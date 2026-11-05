Play Tetris
===========

.. raw:: html

    <div id="tetris">
      <canvas id="canvas-main" width="240" height="480"></canvas>
      <div id="container-gameOver">
        <h1>GAME OVER</h1>
        <button id="button-restart">
          Play Again
        </button>
      </div>
      <div id="container-start">
        <h1>Tetris</h1>
        <button id="button-start">
          Start Game
        </button>
      </div>
      <div id="container-sidebar">
        <div id="container-sidebarNext">
          <span id="text-sidebarNextTitle">Next</span>
          <canvas id="canvas-next" width="96" height="96"></canvas>
        </div>
        <div id="container-gameInfo">
          <div id="container-score">
            <span id="title-score">Score:</span>
            <span id="text-score">0</span>
          </div>
          <div id="container-level">
            <span id="title-level">Level:</span>
            <span id="text-level">1</span>
          </div>
          <div id="container-lines">
            <span id="title-lines">Lines:</span>
            <span id="text-lines">0</span>
          </div>
          <div id="container-controls">
            <p>
              Use Arrow Keys to Move/Rotate<br>
              Spacebar to Hard Drop
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      const mainContext = document.querySelector("#canvas-main").getContext("2d");
      const nextContext = document.querySelector("#canvas-next").getContext("2d");
      mainContext.scale(24, 24);
      nextContext.scale(24, 24);

      const PIECES = {
        "I": [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        "L": [
          [0, 0, 2],
          [2, 2, 2],
          [0, 0, 0]
        ],
        "J": [
          [3, 0, 0],
          [3, 3, 3],
          [0, 0, 0]
        ],
        "O": [
          [4, 4],
          [4, 4]
        ],
        "Z": [
          [5, 5, 0],
          [0, 5, 5],
          [0, 0, 0]
        ],
        "S": [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0]
        ],
        "T": [
          [0, 7, 0],
          [7, 7, 7],
          [0, 0, 0]
        ]
      }

      const COLORS = [
        null,
        "#00f0f0",
        "#f0a000",
        "#0000f0",
        "#f0f000",
        "#f00000",
        "#00f000",
        "#a000f0"
      ]

      function createMatrix(width, height) {
        const matrix = [];
        while (height--) {
          matrix.push(new Array(width).fill(0));
        }
        return matrix;
      }

      const matrix = createMatrix(10, 20);
      const player = {
        position: {
          x: 0,
          y: 0
        },
        piece: null,
        nextPiece: null,
        score: 0,
        lines: 0,
        level: 1
      };

      let dropCounter = 0;
      let dropInterval = 1000;
      let lastTime = 0;

      const keysPressed = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowDown: false
      };
      const DAS_DELAY = 160;
      const ARR_RATE = 25;
      let dasCounter = 0;
      let arrCounter = 0;
      let currentDirection = 0;

      let isGameOver = false;
      let isGameStarted = false;

      let lockCounter = 0;
      const LOCK_DELAY = 1000;

      function collide(matrix, player) {
        for (let y = 0; y < player.piece.length; ++y) {
          for (let x = 0; x < player.piece[y].length; ++x) {
            if (player.piece[y][x] !== 0 && (matrix[y + player.position.y] && matrix[y + player.position.y][x + player.position.x]) !== 0) return true;
          }
        }
        return false;
      }

      function matrixSweep() {
        let rowCount = 1;
        outer: for (let y = matrix.length - 1; 0 <= y; --y) {
          for (let x = 0; x < matrix[y].length; ++x) {
            if (matrix[y][x] === 0) {
              continue outer;
            }
          }
          const row = matrix.splice(y, 1)[0].fill(0);
          matrix.unshift(row);
          y++;
          player.score += rowCount * 10;
          player.lines++;
          rowCount *= 2;
          const newLevel = Math.floor(player.lines / 10) + 1;
          if (newLevel !== player.level) {
            player.level = newLevel;
            updateDropInterval();
          }
          updateScore();
        }
      }

      function draw() {
        mainContext.fillStyle = "#000";
        mainContext.fillRect(0, 0, document.querySelector("#canvas-main").width, document.querySelector("#canvas-main").height);
        drawPiece(mainContext, matrix, {x: 0, y: 0});
        const shadowPosition = {
          x: player.position.x,
          y: player.position.y
        };
        while (!collide(matrix, {piece: player.piece, position: shadowPosition})) {
          shadowPosition.y++;
        }
        shadowPosition.y--;
        drawPiece(mainContext, player.piece, shadowPosition, true);
        drawPiece(mainContext, player.piece, player.position);
        nextContext.fillStyle = "#000";
        nextContext.fillRect(0, 0, 4, 4);
        const offsetX = (4 - player.nextPiece[0].length) / 2;
        const offsetY = (4 - player.nextPiece.length) / 2;
        drawPiece(nextContext, player.nextPiece, {x: offsetX, y: offsetY});
      }

      function drawPiece(context, piece, offset, isShadow = false) {
        piece.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              if (isShadow) {
                context.fillStyle = "rgba(128, 128, 128, 0.3)";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.lineWidth = 0.05;
                context.strokeStyle = "rgba(255, 255, 255, 0.4)";
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
              } else {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.lineWidth = 0.05;
                context.strokeStyle = "#222";
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
              }
            }
          });
        });
      }

      function merge(matrix, player) {
        player.piece.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              matrix[y + player.position.y][x + player.position.x] = value;
            }
          })
        });
      }

      function rotate(piece, direction) {
        for (let y = 0; y < piece.length; ++y) {
          for (let x = 0; x < y; ++x) {
            [piece[x][y], piece[y][x]] = [piece[y][x], piece[x][y]];
          }
        }
        if (0 < direction) {
          piece.forEach(row => row.reverse());
        } else {
          piece.reverse();
        }
      }

      function pieceRotate(direction) {
        const position = player.position.x;
        let offset = 1;
        rotate(player.piece, direction);
        while (collide(matrix, player)) {
          player.position.x += offset;
          offset = -(offset + (offset > 0 ? 1 : -1));
          if (player.piece[0].length < offset) {
            rotate(player.piece, -direction);
            player.position.x = position;
            return;
          }
        }
        lockCounter = 0;
      }

      function pieceDrop() {
        player.position.y++;
        const isGrounded = collide(matrix, player);
        player.position.y--;
        if (isGrounded) {
          dropCounter = 0;
          return;
        }
        player.position.y++;
        dropCounter = 0;
      }

      function pieceMove(direction) {
        player.position.x += direction;
        if (collide(matrix, player)) {
          player.position.x -= direction;
        } else {
          lockCounter = 0;
        }
      }

      function cloneMatrix(matrix) {
        return matrix.map(row => [...row]);
      }

      function playerReset() {
        const pieces = "ILJOSZT";
        if (!player.nextPiece) {
          player.nextPiece = cloneMatrix(PIECES[pieces[Math.floor(Math.random() * pieces.length)]]);
        }
        player.piece = player.nextPiece;
        player.nextPiece = cloneMatrix(PIECES[pieces[Math.floor(Math.random() * pieces.length)]]);
        player.position.y = 0;
        player.position.x = Math.floor(matrix[0].length / 2) - Math.floor(player.piece[0].length / 2);

        lockCounter = 0;

        if (collide(matrix, player)) {
          isGameOver = true;
          document.querySelector("#container-gameOver").style.display = "flex";
        }
      }

      function update(time = 0) {
        if (isGameOver || !isGameStarted) return;
      
        const deltaTime = time - lastTime;
        lastTime = time;

        let alreadyDropped = false;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval && !keysPressed.ArrowDown) {
          pieceDrop();
          alreadyDropped = true;
        }

        player.position.y++;
        const isGrounded = collide(matrix, player);
        player.position.y--;

        if (isGrounded) {
          lockCounter += deltaTime;
          if (LOCK_DELAY <= lockCounter) {
            merge(matrix, player);
            playerReset();
            matrixSweep();
          }
        } else {
          lockCounter = 0;
        }

        if (keysPressed.ArrowLeft || keysPressed.ArrowRight || keysPressed.ArrowDown) {
          dasCounter += deltaTime;
          if (DAS_DELAY <= dasCounter) {
            arrCounter += deltaTime;
            if (ARR_RATE <= arrCounter) {
              if (keysPressed.ArrowDown && !alreadyDropped) {
                pieceDrop();
                alreadyDropped = true;
              } else {
                pieceMove(currentDirection);
              }
              arrCounter = 0;
            }
          }
        }

        draw();
        requestAnimationFrame(update);
      }

      function updateScore() {
        document.querySelector("#text-score").innerText = player.score;
        document.querySelector("#text-lines").innerText = player.lines;
        document.querySelector("#text-level").innerText = player.level;
      }

      function updateDropInterval() {
        dropInterval = Math.max(60, 1000 - (player.level - 1) * 75);
      }

      document.addEventListener('keydown', event => {
        if (!isGameStarted) return;
        if (["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown", " "].includes(event.key)) {
          event.preventDefault();
        }
        if (event.repeat) return;

        if (event.key === "ArrowUp") {
          pieceRotate(1);
          return;
        } else if (event.key === "z") {
          pieceRotate(-1);
          return;
        } else if (event.key === " ") {
          while (!collide(matrix, player)) {
            player.position.y++;
          }
          player.position.y--;
          merge(matrix, player);
          playerReset();
          matrixSweep();
          return;
        }

        if (event.key === "ArrowLeft") {
          keysPressed.ArrowLeft = true;
          currentDirection = -1;
          pieceMove(-1);
          dasCounter = 0;
          arrCounter = 0;
        } else if (event.key === "ArrowRight") {
          keysPressed.ArrowRight = true;
          currentDirection = 1;
          pieceMove(1);
          dasCounter = 0;
          arrCounter = 0;
        } else if (event.key === "ArrowDown") {
          keysPressed.ArrowDown = true;
          // pieceDrop();
        }
      });

      document.addEventListener("keyup", event => {
        if (event.key === "ArrowLeft") {
          keysPressed.ArrowLeft = false;
          if (keysPressed.ArrowRight) currentDirection = 1;
        } else if (event.key === "ArrowRight") {
          keysPressed.ArrowRight = false;
          if (keysPressed.ArrowLeft) currentDirection = -1;
        } else if (event.key === "ArrowDown") {
          keysPressed.ArrowDown = false;
        }
      });

      document.querySelector("#button-restart").addEventListener("click", () => {
        matrix.forEach(row => row.fill(0));
        player.score = 0;
        player.lines = 0;
        player.level = 1;
        dropInterval = 1000;
        updateScore();
        document.querySelector("#container-gameOver").style.display = "none";
        isGameOver = false;
        playerReset();
        lastTime = performance.now();
        update();
      });

      document.querySelector("#button-start").addEventListener("click", () => {
        document.querySelector("#container-start").style.display = "none";
        isGameStarted = true;
        isGameOver = false;
        playerReset();
        lastTime = performance.now();
        update();
      });
    </script>