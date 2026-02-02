const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* === КАРТИНКИ === */
const grandmaImg = new Image();
grandmaImg.src = "img/grandma.png";

const grandma2Img = new Image();
grandma2Img.src = "img/grandma2.png";

const bookImg = new Image();
bookImg.src = "img/book.png";

const chestImg = new Image();
chestImg.src = "img/chest.png";

/* === ИГРОК === */
const groundY = 450;

let player = {
  x: 60,
  y: groundY,
  width: 80,
  height: 120,
  vy: 0,
  gravity: 1,
  jumpPower: -18,
  onGround: true,
  skin: grandmaImg
};

/* === ИГРОВЫЕ ДАННЫЕ === */
let score = 0;
let books = [];
let chest = null;
let chestSpawned = false;

/* === УПРАВЛЕНИЕ === */
function jump() {
  if (player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("touchstart", jump);

/* === СПАВН УЧЕБНИКОВ === */
function spawnBook() {
  books.push({
    x: canvas.width,
    y: groundY + 40,
    size: 40
  });
}

setInterval(spawnBook, 1500);

/* === ОБНОВЛЕНИЕ === */
function update() {
  /* Прыжок */
  player.y += player.vy;
  player.vy += player.gravity;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  /* Учебники */
  for (let i = books.length - 1; i >= 0; i--) {
    books[i].x -= 6;

    if (books[i].x + books[i].size < 0) {
      books.splice(i, 1);
      continue;
    }

    if (
      books[i].x < player.x + player.width &&
      books[i].x + books[i].size > player.x &&
      books[i].y < player.y + player.height &&
      books[i].y + books[i].size > player.y
    ) {
      books.splice(i, 1);
      score++;

      if (score >= 50 && !chestSpawned) {
        chest = {
          x: canvas.width,
          y: groundY + 20,
          size: 60
        };
        chestSpawned = true;
      }
    }
  }

  /* Сундук */
  if (chest) {
    chest.x -= 6;

    if (
      chest.x < player.x + player.width &&
      chest.x + chest.size > player.x &&
      chest.y < player.y + player.height &&
      chest.y + chest.size > player.y
    ) {
      player.skin = grandma2Img;
      chest = null;
    }
  }
}

/* === ОТРИСОВКА === */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(player.skin, player.x, player.y, player.width, player.height);

  books.forEach(b => {
    ctx.drawImage(bookImg, b.x, b.y, b.size, b.size);
  });

  if (chest) {
    ctx.drawImage(chestImg, chest.x, chest.y, chest.size, chest.size);
  }

  ctx.fillStyle = "#5e2b97";
  ctx.font = "20px Arial";
  ctx.fillText("Очки: " + score, 20, 30);
}

/* === ИГРОВОЙ ЦИКЛ === */
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
