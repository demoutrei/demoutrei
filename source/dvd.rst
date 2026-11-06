DVD Animation
=============

.. grid:: 1
    :gutter: 3
    
    .. grid-item-card:: Controls

        1. Use the arrow keys to control the direction of the icon.
        2. Click the icon to change its color.

.. tabs::

    .. tab:: Canvas

        .. raw:: html

            <div id="dvdAnimation" style="justify-self: center;">
              <canvas id="canvas" width="600" height="400"></canvas>
              <div id="container-bounceCount">
                Bounces: <span id="text-bounceCount">0</span>
              </div>
              <div id="container-controls">
                <button id="button-toggleState" onclick="toggleState();">
                  <svg id="icon-pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3.75 2h5.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 9.25 22h-5.5A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2Zm11 0h5.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22h-5.5A1.75 1.75 0 0 1 13 20.25V3.75c0-.966.784-1.75 1.75-1.75ZM3.5 3.75v16.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25Zm11 0v16.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25Z"></path></svg>
                  <svg id="icon-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5.4 5.403a1.8 1.8 0 0 1 2.667-1.577l12 6.595c1.244.684 1.244 2.472 0 3.156l-12 6.595A1.8 1.8 0 0 1 5.4 18.595zm1.5 13.192a.3.3 0 0 0 .444.263l12-6.596a.3.3 0 0 0 0-.526l-12-6.596a.3.3 0 0 0-.444.263z"></path></svg>
                </button>
                <button id="button-reset" onclick="reset();">
                  <svg id="icon-reset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3.38 8A9.502 9.502 0 0 1 12 2.5a9.502 9.502 0 0 1 9.215 7.182.75.75 0 1 0 1.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 0 0-9.5 5.452V4.75a.75.75 0 0 0-1.5 0V8.5a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H3.38Zm-.595 6.318a.75.75 0 0 0-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 0 0 1.5 0V15.5a1 1 0 0 0-1-1h-3.75a.75.75 0 0 0 0 1.5h2.37A9.502 9.502 0 0 1 12 21.5c-4.446 0-8.181-3.055-9.215-7.182Z"></path></svg>
                </button>
              </div>
            </div>
            <script>
              const context = document.querySelector("#canvas").getContext("2d");
              const box = {
                height: 50,
                width: 100,
                color: null,
                verticalDirection: randomDirection(),
                horizontalDirection: randomDirection(),
                position: {
                  x: 0,
                  y: 0
                }
              };
              const circle = {
                radius: 30,
                color: null,
                verticalDirection: randomDirection(),
                horizontalDirection: randomDirection(),
                position: {
                  x: 0,
                  y: 0,
                }
              }
              const MOVE_DELAY = 100;
              let moveCounter = 0;
              let lastTime = 0;
              const TEXT = "DVD";
              const TEXT_METRICS = context.measureText(TEXT);
              const TEXT_WIDTH = TEXT_METRICS.actualBoundingBoxLeft + TEXT_METRICS.actualBoundingBoxRight;
              const TEXT_HEIGHT = TEXT_METRICS.actualBoundingBoxAscent + TEXT_METRICS.actualBoundingBoxDescent;
              const COLORS = [ "red", "orange", "yellow", "green", "blue", "violet", "pink", "brown" ];
              let isRunning = false;
              let hasBounced = false;
              let bounceCount = 0;
              
              document.querySelector("#icon-pause").style.display = "none";

              function clearCanvas() {
                context.clearRect(0, 0, 600, 400);
              }

              function randomDirection() {
                let DIRECTIONS = [-1, 1];
                return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
              }

              function draw() {
                clearCanvas();
                if (!box.color) changeColor(box);
                if (!circle.color) changeColor(circle);
                context.fillStyle = box.color;
                context.fillRect(box.position.x, box.position.y, box.width, box.height);
                context.fillStyle = circle.color;
                context.beginPath();
                context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
                context.fill();
                context.font = "bold 40px Arial";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(TEXT, box.position.x + (box.width / 2), box.position.y + (TEXT_HEIGHT / 2) + (box.height / 2));
              }

              function isTouchingTopBoundary(shape) {
                if (shape === circle) {
                  return shape.position.y - shape.radius <= 0;
                }
                return shape.position.y <= 0;
              }

              function isTouchingBottomBoundary(shape) {
                if (shape === circle) {
                  return canvas.height <= (shape.position.y + shape.radius);
                }
                return (canvas.height - shape.height) <= shape.position.y;
              }

              function isTouchingLeftBoundary(shape) {
                if (shape === circle) {
                  return shape.position.x - shape.radius <= 0;
                }
                return shape.position.x <= 0;
              }

              function isTouchingRightBoundary(shape) {
                if (shape === circle) {
                  return canvas.width <= (shape.position.x + shape.radius);
                }
                return (canvas.width - shape.width) <= shape.position.x;
              }

              function isTouchingHorizontalBoundaries(shape) {
                return isTouchingLeftBoundary(shape) || isTouchingRightBoundary(shape);
              }

              function isTouchingVerticalBoundaries(shape) {
                return isTouchingTopBoundary(shape) || isTouchingBottomBoundary(shape);
              }
              
              function move(shape) {
                const newColor = isTouchingHorizontalBoundaries(shape) || isTouchingVerticalBoundaries(shape);
                if (newColor) changeColor(shape);
                shape.position.x += shape.horizontalDirection * 5;
                shape.position.y += shape.verticalDirection * 5;
                moveCounter = 0;
              }

              function changeColor(shape) {
                let newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
                while (newColor == shape.color) {
                  newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
                }
                shape.color = newColor;
              }

              function updateDirection(shape) {
                let hitWall = false;
                if (isTouchingLeftBoundary(shape)) {
                  shape.horizontalDirection = 1;
                  hitWall = true;
                } else if (isTouchingRightBoundary(shape)) {
                  shape.horizontalDirection = -1;
                  hitWall = true;
                }
                if (isTouchingTopBoundary(shape)) {
                  shape.verticalDirection = 1;
                  hitWall = true;
                } else if (isTouchingBottomBoundary(shape)) {
                  shape.verticalDirection = -1;
                  hitWall = true;
                }
                if (hitWall) {
                  if (shape === box) {
                    bounceCount++;
                    updateBounceCount();
                  }
                  move(shape);
                }
              }

              function updateBounceCount() {
                document.querySelector("#text-bounceCount").textContent = bounceCount;
              }

              function update(time = 0) {
                if (!isRunning) return;
                const deltaTime = time - lastTime;
                lastTime = time;
                moveCounter += deltaTime;
                if (MOVE_DELAY <= moveCounter) {
                  move(box);
                  move(circle);
                }
                const collision = checkCollision();
                if (collision.isColliding) {
                  if (collision.axis == "x") {
                    box.horizontalDirection *= -1;
                    circle.horizontalDirection *= -1;
                  } else if (collision.axis == "y") {
                    box.verticalDirection *= -1;
                    circle.verticalDirection *= -1;
                  }
                  hasBounced = true;
                  const pushX = collision.overlapVector.x / 2;
                  const pushY = collision.overlapVector.y / 2;
                  box.position.x -= pushX;
                  box.position.y -= pushY;
                  circle.position.x += pushX;
                  circle.position.y += pushY;
                  changeColor(box);
                  changeColor(circle);
                }
                updateDirection(box);
                updateDirection(circle);
                draw();
                if (hasBounced) {
                  bounceCount += 1;
                  hasBounced = false;
                }
                updateBounceCount();
                requestAnimationFrame(update);
              }

              function toggleState() {
                isRunning = !isRunning;
                document.querySelector("#icon-pause").style.display = isRunning ? "flex" : "none";
                document.querySelector("#icon-play").style.display = isRunning ? "none" : "flex";
                if (isRunning) {
                  lastTime = performance.now();
                  update()
                };
              }

              function randomBoxPosition() {
                box.position.x = Math.floor(Math.random() * (canvas.width - box.width));
                box.position.y = Math.floor(Math.random() * (canvas.height - box.height));
              }

              function checkCollision() {
                const closestX = Math.max(box.position.x, Math.min(circle.position.x, box.position.x + box.width));
                const closestY = Math.max(box.position.y, Math.min(circle.position.y, box.position.y + box.height));
                const distanceX = circle.position.x - closestX;
                const distanceY = circle.position.y - closestY;
                const distanceSquared = (distanceX ** 2) + (distanceY ** 2);
                let overlapVector = {
                  x: 0,
                  y: 0
                };
                if (distanceSquared < (circle.radius ** 2)) {
                  const distance = Math.sqrt(distanceSquared);
                  const overlapX = circle.radius - Math.abs(circle.position.x - (box.position.x + box.width / 2)) + (box.width / 2);
                  const overlapY = circle.radius - Math.abs(circle.position.y - (box.position.y + box.height / 2)) + (box.height / 2);
                  let axis = null;
                  const insideX = (circle.position.x >= box.position.x && circle.position.x <= box.position.x + box.width);
                  const insideY = (circle.position.y >= box.position.y && circle.position.y <= box.position.y + box.height);
                  if (insideX) {
                    axis = "y";
                    const overlapY = circle.radius - Math.abs(distanceY);
                    overlapVector.y = distanceY >= 0 ? overlapY : -overlapY;
                  } else if (insideY) {
                    axis = "x";
                    const overlapX = circle.radius - Math.abs(distanceX);
                    overlapVector.x = distanceX >= 0 ? overlapX : -overlapX;
                  } else {
                    if (Math.abs(distanceX) > Math.abs(distanceY)) {
                      axis = "x";
                    } else {
                      axis = "y";
                    }
                    if (distance !== 0) {
                      const overlap = circle.radius - distance;
                      overlapVector.x = (distanceX / distance) * overlap;
                      overlapVector.y = (distanceY / distance) * overlap;
                    }
                  }
                  return {
                    isColliding: true,
                    axis: axis,
                    overlapVector: overlapVector
                  };
                }
                return {
                  isColliding: false,
                  axis: null,
                  overlapVector: overlapVector
                };
              }

              function randomCirclePosition() {
                circle.position.x = Math.floor(Math.random() * (canvas.width - (circle.radius * 2))) + circle.radius;
                circle.position.y = Math.floor(Math.random() * (canvas.height - (circle.radius * 2))) + circle.radius;
              }

              function reset() {
                isRunning = false;
                document.querySelector("#icon-pause").style.display = isRunning ? "flex" : "none";
                document.querySelector("#icon-play").style.display = isRunning ? "none" : "flex";
                bounceCount = 0;
                box.horizontalDirection = randomDirection();
                box.verticalDirection = randomDirection();
                circle.horizontalDirection = randomDirection();
                circle.verticalDirection = randomDirection();
                updateBounceCount();
                randomBoxPosition();
                randomCirclePosition();
                while (checkCollision().isColliding) {
                  randomBoxPosition();
                  randomCirclePosition();
                }
                changeColor(box);
                changeColor(circle);
                draw();
              }

              function isBoxClicked(x, y) {
                return ((box.position.x <= x) && (x <= box.position.x + box.width)) && ((box.position.y <= y) && (y <= box.position.y + box.height));
              }

              function isCircleClicked(x, y) {
                const dx = x - circle.position.x;
                const dy = y - circle.position.y;
                const distanceSquared = (dx ** 2) + (dy ** 2);
                return distanceSquared <= circle.radius ** 2;
              }

              function fetchClickedShape(x, y) {
                if (isBoxClicked(x, y)) return box;
                if (isCircleClicked(x, y)) return circle;
                return null;
              }

              document.querySelector("#canvas").addEventListener("click", (event) => {
                const clickedShape = fetchClickedShape(event.offsetX, event.offsetY);
                if (!clickedShape) return;
                changeColor(clickedShape);
                draw();
              });

              document.addEventListener("keydown", (event) => {
                if (!isRunning) return;
                if (["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(event.key)) {
                  event.preventDefault();
                }
                if (event.repeat) return;
                if (event.key === "ArrowUp") {
                  box.verticalDirection = -1;
                } else if (event.key === "ArrowRight") {
                  box.horizontalDirection = 1;
                } else if (event.key === "ArrowDown") {
                  box.verticalDirection = 1;
                } else if (event.key === "ArrowLeft") {
                  box.horizontalDirection = -1;
                }
              });

              reset();
            </script>

    .. code-tab:: html

        <div id="dvdAnimation" style="justify-self: center;">
          <canvas id="canvas" width="600" height="400"></canvas>
          <div id="container-bounceCount">
            Bounces: <span id="text-bounceCount">0</span>
          </div>
          <div id="container-controls">
            <button id="button-toggleState" onclick="toggleState();">
              <svg id="icon-pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3.75 2h5.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 9.25 22h-5.5A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2Zm11 0h5.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22h-5.5A1.75 1.75 0 0 1 13 20.25V3.75c0-.966.784-1.75 1.75-1.75ZM3.5 3.75v16.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25Zm11 0v16.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25h-5.5a.25.25 0 0 0-.25.25Z"></path></svg>
              <svg id="icon-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5.4 5.403a1.8 1.8 0 0 1 2.667-1.577l12 6.595c1.244.684 1.244 2.472 0 3.156l-12 6.595A1.8 1.8 0 0 1 5.4 18.595zm1.5 13.192a.3.3 0 0 0 .444.263l12-6.596a.3.3 0 0 0 0-.526l-12-6.596a.3.3 0 0 0-.444.263z"></path></svg>
            </button>
            <button id="button-reset" onclick="reset();">
              <svg id="icon-reset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3.38 8A9.502 9.502 0 0 1 12 2.5a9.502 9.502 0 0 1 9.215 7.182.75.75 0 1 0 1.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 0 0-9.5 5.452V4.75a.75.75 0 0 0-1.5 0V8.5a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H3.38Zm-.595 6.318a.75.75 0 0 0-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 0 0 1.5 0V15.5a1 1 0 0 0-1-1h-3.75a.75.75 0 0 0 0 1.5h2.37A9.502 9.502 0 0 1 12 21.5c-4.446 0-8.181-3.055-9.215-7.182Z"></path></svg>
            </button>
          </div>
        </div>
        <script>
          const context = document.querySelector("#canvas").getContext("2d");
          const box = {
            height: 50,
            width: 100,
            color: null,
            verticalDirection: randomDirection(),
            horizontalDirection: randomDirection(),
            position: {
              x: 0,
              y: 0
            }
          };
          const circle = {
            radius: 30,
            color: null,
            verticalDirection: randomDirection(),
            horizontalDirection: randomDirection(),
            position: {
              x: 0,
              y: 0,
            }
          }
          const MOVE_DELAY = 100;
          let moveCounter = 0;
          let lastTime = 0;
          const TEXT = "DVD";
          const TEXT_METRICS = context.measureText(TEXT);
          const TEXT_WIDTH = TEXT_METRICS.actualBoundingBoxLeft + TEXT_METRICS.actualBoundingBoxRight;
          const TEXT_HEIGHT = TEXT_METRICS.actualBoundingBoxAscent + TEXT_METRICS.actualBoundingBoxDescent;
          const COLORS = [ "red", "orange", "yellow", "green", "blue", "violet", "pink", "brown" ];
          let isRunning = false;
          let hasBounced = false;
          let bounceCount = 0;
          
          document.querySelector("#icon-pause").style.display = "none";

          function clearCanvas() {
            context.clearRect(0, 0, 600, 400);
          }

          function randomDirection() {
            let DIRECTIONS = [-1, 1];
            return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
          }

          function draw() {
            clearCanvas();
            if (!box.color) changeColor(box);
            if (!circle.color) changeColor(circle);
            context.fillStyle = box.color;
            context.fillRect(box.position.x, box.position.y, box.width, box.height);
            context.fillStyle = circle.color;
            context.beginPath();
            context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
            context.fill();
            context.font = "bold 40px Arial";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(TEXT, box.position.x + (box.width / 2), box.position.y + (TEXT_HEIGHT / 2) + (box.height / 2));
          }

          function isTouchingTopBoundary(shape) {
            if (shape === circle) {
              return shape.position.y - shape.radius <= 0;
            }
            return shape.position.y <= 0;
          }

          function isTouchingBottomBoundary(shape) {
            if (shape === circle) {
              return canvas.height <= (shape.position.y + shape.radius);
            }
            return (canvas.height - shape.height) <= shape.position.y;
          }

          function isTouchingLeftBoundary(shape) {
            if (shape === circle) {
              return shape.position.x - shape.radius <= 0;
            }
            return shape.position.x <= 0;
          }

          function isTouchingRightBoundary(shape) {
            if (shape === circle) {
              return canvas.width <= (shape.position.x + shape.radius);
            }
            return (canvas.width - shape.width) <= shape.position.x;
          }

          function isTouchingHorizontalBoundaries(shape) {
            return isTouchingLeftBoundary(shape) || isTouchingRightBoundary(shape);
          }

          function isTouchingVerticalBoundaries(shape) {
            return isTouchingTopBoundary(shape) || isTouchingBottomBoundary(shape);
          }
          
          function move(shape) {
            const newColor = isTouchingHorizontalBoundaries(shape) || isTouchingVerticalBoundaries(shape);
            if (newColor) changeColor(shape);
            shape.position.x += shape.horizontalDirection * 5;
            shape.position.y += shape.verticalDirection * 5;
            moveCounter = 0;
          }

          function changeColor(shape) {
            let newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            while (newColor == shape.color) {
              newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
            shape.color = newColor;
          }

          function updateDirection(shape) {
            let hitWall = false;
            if (isTouchingLeftBoundary(shape)) {
              shape.horizontalDirection = 1;
              hitWall = true;
            } else if (isTouchingRightBoundary(shape)) {
              shape.horizontalDirection = -1;
              hitWall = true;
            }
            if (isTouchingTopBoundary(shape)) {
              shape.verticalDirection = 1;
              hitWall = true;
            } else if (isTouchingBottomBoundary(shape)) {
              shape.verticalDirection = -1;
              hitWall = true;
            }
            if (hitWall) {
              if (shape === box) {
                bounceCount++;
                updateBounceCount();
              }
              move(shape);
            }
          }

          function updateBounceCount() {
            document.querySelector("#text-bounceCount").textContent = bounceCount;
          }

          function update(time = 0) {
            if (!isRunning) return;
            const deltaTime = time - lastTime;
            lastTime = time;
            moveCounter += deltaTime;
            if (MOVE_DELAY <= moveCounter) {
              move(box);
              move(circle);
            }
            const collision = checkCollision();
            if (collision.isColliding) {
              if (collision.axis == "x") {
                box.horizontalDirection *= -1;
                circle.horizontalDirection *= -1;
              } else if (collision.axis == "y") {
                box.verticalDirection *= -1;
                circle.verticalDirection *= -1;
              }
              hasBounced = true;
              const pushX = collision.overlapVector.x / 2;
              const pushY = collision.overlapVector.y / 2;
              box.position.x -= pushX;
              box.position.y -= pushY;
              circle.position.x += pushX;
              circle.position.y += pushY;
              changeColor(box);
              changeColor(circle);
            }
            updateDirection(box);
            updateDirection(circle);
            draw();
            if (hasBounced) {
              bounceCount += 1;
              hasBounced = false;
            }
            updateBounceCount();
            requestAnimationFrame(update);
          }

          function toggleState() {
            isRunning = !isRunning;
            document.querySelector("#icon-pause").style.display = isRunning ? "flex" : "none";
            document.querySelector("#icon-play").style.display = isRunning ? "none" : "flex";
            if (isRunning) {
              lastTime = performance.now();
              update()
            };
          }

          function randomBoxPosition() {
            box.position.x = Math.floor(Math.random() * (canvas.width - box.width));
            box.position.y = Math.floor(Math.random() * (canvas.height - box.height));
          }

          function checkCollision() {
            const closestX = Math.max(box.position.x, Math.min(circle.position.x, box.position.x + box.width));
            const closestY = Math.max(box.position.y, Math.min(circle.position.y, box.position.y + box.height));
            const distanceX = circle.position.x - closestX;
            const distanceY = circle.position.y - closestY;
            const distanceSquared = (distanceX ** 2) + (distanceY ** 2);
            let overlapVector = {
              x: 0,
              y: 0
            };
            if (distanceSquared < (circle.radius ** 2)) {
              const distance = Math.sqrt(distanceSquared);
              const overlapX = circle.radius - Math.abs(circle.position.x - (box.position.x + box.width / 2)) + (box.width / 2);
              const overlapY = circle.radius - Math.abs(circle.position.y - (box.position.y + box.height / 2)) + (box.height / 2);
              let axis = null;
              const insideX = (circle.position.x >= box.position.x && circle.position.x <= box.position.x + box.width);
              const insideY = (circle.position.y >= box.position.y && circle.position.y <= box.position.y + box.height);
              if (insideX) {
                axis = "y";
                const overlapY = circle.radius - Math.abs(distanceY);
                overlapVector.y = distanceY >= 0 ? overlapY : -overlapY;
              } else if (insideY) {
                axis = "x";
                const overlapX = circle.radius - Math.abs(distanceX);
                overlapVector.x = distanceX >= 0 ? overlapX : -overlapX;
              } else {
                if (Math.abs(distanceX) > Math.abs(distanceY)) {
                  axis = "x";
                } else {
                  axis = "y";
                }
                if (distance !== 0) {
                  const overlap = circle.radius - distance;
                  overlapVector.x = (distanceX / distance) * overlap;
                  overlapVector.y = (distanceY / distance) * overlap;
                }
              }
              return {
                isColliding: true,
                axis: axis,
                overlapVector: overlapVector
              };
            }
            return {
              isColliding: false,
              axis: null,
              overlapVector: overlapVector
            };
          }

          function randomCirclePosition() {
            circle.position.x = Math.floor(Math.random() * (canvas.width - (circle.radius * 2))) + circle.radius;
            circle.position.y = Math.floor(Math.random() * (canvas.height - (circle.radius * 2))) + circle.radius;
          }

          function reset() {
            isRunning = false;
            document.querySelector("#icon-pause").style.display = isRunning ? "flex" : "none";
            document.querySelector("#icon-play").style.display = isRunning ? "none" : "flex";
            bounceCount = 0;
            box.horizontalDirection = randomDirection();
            box.verticalDirection = randomDirection();
            circle.horizontalDirection = randomDirection();
            circle.verticalDirection = randomDirection();
            updateBounceCount();
            randomBoxPosition();
            randomCirclePosition();
            while (checkCollision().isColliding) {
              randomBoxPosition();
              randomCirclePosition();
            }
            changeColor(box);
            changeColor(circle);
            draw();
          }

          function isBoxClicked(x, y) {
            return ((box.position.x <= x) && (x <= box.position.x + box.width)) && ((box.position.y <= y) && (y <= box.position.y + box.height));
          }

          function isCircleClicked(x, y) {
            const dx = x - circle.position.x;
            const dy = y - circle.position.y;
            const distanceSquared = (dx ** 2) + (dy ** 2);
            return distanceSquared <= circle.radius ** 2;
          }

          function fetchClickedShape(x, y) {
            if (isBoxClicked(x, y)) return box;
            if (isCircleClicked(x, y)) return circle;
            return null;
          }

          document.querySelector("#canvas").addEventListener("click", (event) => {
            const clickedShape = fetchClickedShape(event.offsetX, event.offsetY);
            if (!clickedShape) return;
            changeColor(clickedShape);
            draw();
          });

          document.addEventListener("keydown", (event) => {
            if (!isRunning) return;
            if (["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(event.key)) {
              event.preventDefault();
            }
            if (event.repeat) return;
            if (event.key === "ArrowUp") {
              box.verticalDirection = -1;
            } else if (event.key === "ArrowRight") {
              box.horizontalDirection = 1;
            } else if (event.key === "ArrowDown") {
              box.verticalDirection = 1;
            } else if (event.key === "ArrowLeft") {
              box.horizontalDirection = -1;
            }
          });

          reset();
        </script>