const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* === КАРТИНКИ === */
const grandmaImg = new Image();
grandmaImg.src = "img/grandma.png";

const prizeImgs = ["prize1.png", "prize2.png", "prize3.png"].map(name => {
  const img = new Image();
  img.src = "img/" + name;
  return img;
});

const bookImg = new Image();
bookImg.src = "img/book.png";

const chestImg = new Image();
chestImg.src = "img/chest.png";

const phoneImg = new Image();
phoneImg.src = "img/phone.png";

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
  onGround: true
};

/* === ИГРА === */
let score = 0;
let books = [];
let phones = [];
let chest = null;

/* === ПРИЗЫ === */
let prizesOpened = [];
let nextPrizeScore = 50;

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

/* === СПАВН ТЕЛЕФОНОВ === */
function spawnPhone() {
  phones.push({
    x: canvas.width,
    y: groundY + 40,
    size: 40
  });
}
setInterval(spawnPhone, 4000);

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

  /* Учебники (+1) */
  for (let i = books.length - 1; i >= 0; i--) {
    books[i].x -= 6;

    if (
      books[i].x < player.x + player.width &&
      books[i].x + books[i].size > player.x &&
      books[i].y < player.y + player.height &&
      books[i].y + books[i].size > player.y
    ) {
      books.splice(i, 1);
      score++;

      if (score >= nextPrizeScore && !chest) {
        chest = {
          x: canvas.width,
          y: groundY + 20,
          size: 60
        };
      }
    }
  }

  /* Телефоны (-25) */
  for (let i = phones.length - 1; i >= 0; i--) {
    phones[i].x -= 6;

    if (
      phones[i].x < player.x + player.width &&
      phones[i].x + phones[i].size > player.x &&
      phones[i].y < player.y + player.height &&
      phones[i].y + phones[i].size > player.y
    ) {
      phones.splice(i, 1);
      score -= 25;
      if (score < 0) score = 0;
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
      const prizeIndex = prizesOpened.length;
      if (prizeIndex < prizeImgs.length) {
        prizesOpened.push(prizeImgs[prizeIndex]);
        nextPrizeScore += 50;
      }
      chest = null;
    }
  }
}

/* === ОТРИСОВКА === */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Бабушка */
  ctx.drawImage(grandmaImg, player.x, player.y, player.width, player.height);

  /* Учебники */
  books.forEach(b => {
    ctx.drawImage(bookImg, b.x, b.y, b.size, b.size);
  });

  /* Телефоны */
  phones.forEach(p => {
    ctx.drawImage(phoneImg, p.x, p.y, p.size, p.size);
  });

  /* Сундук */
  if (chest) {
    ctx.drawImage(chestImg, chest.x, chest.y, chest.size, chest.size);
  }

  /* Очки */
  ctx.fillStyle = "#5e2b97";
  ctx.font = "20px Arial";
  ctx.fillText("Очки: " + score, 20, 30);

  /* Призы */
  prizesOpened.forEach((img, i) => {
    ctx.drawImage(img, 20 + i * 45, 50, 40, 40);
  });
}

/* === ЦИКЛ === */
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
