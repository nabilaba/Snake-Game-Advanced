const CELL_SIZE = 15;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 420;
let REDRAW_INTERVAL = 10;
const WIDTH = CANVAS_WIDTH / CELL_SIZE;
const HEIGHT = CANVAS_HEIGHT / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
let MOVE_INTERVAL = 120;
let colorText = "black";
let score = 0;
let nyawa = 3;
let level = 1;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection()
    }
}
let snake1 = initSnake();

let apple = {
    position: initPosition()
}

let apple2 = {
    position: initPosition()
}

let hati = {
    position: initPosition()
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawCellWithImage(img, ctx, x, y) {
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawNyawa(img, ctx, x, y) {
    ctx.drawImage(img, x, y, 20, 20);
}

var suara_makan = new Audio('assets/suara/suara_makan.wav');
var suara_nambah_level = new Audio('assets/suara/nambah_level.mp3');
var suara_mati = new Audio('assets/suara/game-over.mp3');
var suara_nyawa_berkurang = new Audio('assets/suara/nyawa_berkurang.wav');

let ok = false;
function leveling(ctx) {
    tantangan(ctx);
    if (score === 5) {
        buatLevelBaru(2, 100);
    } else if (score === 10) {
        buatLevelBaru(3, 80);
    } else if (score === 15) {
        buatLevelBaru(4, 60);
    } else if (score === 20) {
        buatLevelBaru(5, 40);
    } else if (score === 25) {
        buatLevelBaru(6, 20);
        snake1 = initSnake();
        initGame();
        MOVE_INTERVAL = 120;
        nyawa = 3;
        level = 1;
        score = 0;
    } else {
        ok = false;
    }
}

function tantangan(ctx) {
    if (level === 2) {
        buatTantanganHorizontal(ctx, 5, WIDTH - 5, 4);
        buatTantanganHorizontal(ctx, 5, WIDTH - 5, HEIGHT - 5);
    } else if (level === 3) {
        buatTantanganVertical(ctx, 4, HEIGHT - 4, 6);
        buatTantanganVertical(ctx, WIDTH - 5, HEIGHT - 5, 6);
        buatTantanganVertical(ctx, WIDTH/2 - WIDTH/6, HEIGHT - 9, 9);
        buatTantanganVertical(ctx, WIDTH/2 + WIDTH/6, HEIGHT - 9, 9);
    } else if (level === 4) {
        buatTantanganVertical(ctx, 4, HEIGHT - 5, 6);
        buatTantanganVertical(ctx, WIDTH - 5, HEIGHT - 5, 6);
        buatTantanganHorizontal(ctx, 10, WIDTH - 10, 3);
        buatTantanganHorizontal(ctx, 10, WIDTH - 10, HEIGHT -4);
    } else if (level === 5) {
        buatTantanganVertical(ctx, WIDTH/2, HEIGHT - 1, 1);
        buatTantanganHorizontal(ctx, 1, WIDTH - 1, HEIGHT/2);
    }
}

function buatTantanganHorizontal(ctx, x, panjang, y) {
    let warna_penghalang = "orange";
    for (let i = x; i < panjang; i++) {
        drawCell(ctx, i, y, warna_penghalang);
        if (snake1.head.x == i && snake1.head.y == y) {
            suara_nyawa_berkurang.play();
            nyawa--;
            snake1 = initSnake();
            initGame();
        }
        antisipasi(apple, i, y);
        antisipasi(apple2, i, y);
        antisipasi(hati, i, y);
    }
}

function buatTantanganVertical(ctx, x, panjang, y) {
    let warna_penghalang = "orange";
    for (let i = y; i < panjang; i++) {
        drawCell(ctx, x, i, warna_penghalang);
        if (snake1.head.x == x && snake1.head.y == i) {
            suara_nyawa_berkurang.play();
            nyawa--;
            snake1 = initSnake();
            initGame();
        }
        antisipasi(apple, i, y);
        antisipasi(apple2, i, y);
        antisipasi(hati, i, y);
    }
}

function antisipasi(object, i, y) {
    if (object.position.x === i && object.position.y === y) {
        object.position = initPosition();
    }
}

function buatLevelBaru(levelnya, kecepatannya) {
    if(ok == false) {
        alert("Level " + level + " Complete");
        suara_nambah_level.play();
        if (nyawa < 3) {
            nyawa = 3; 
        }
        ok = true;
    }
    level = levelnya;
    MOVE_INTERVAL = kecepatannya;
}

function drawLevel() {
    let levelCanvas = document.getElementById("level");
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    levelCtx.font = "15px Arial";
    levelCtx.fillStyle = colorText;
    levelCtx.textAlign = "center";
    levelCtx.fillText("Snake Game - Level:" + level, 450, 15);
}

function drawScore(snake) {
    let scoreCanvas = document.getElementById("score1Board");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = colorText;
    if (score >= 10) {
        scoreCtx.fillText(score, 20, 40);
    } else {
        scoreCtx.fillText(score, 30, 40);
    }
}

function drawSpeed() {
    let speedCanvas = document.getElementById("speed");
    let speedCtx = speedCanvas.getContext("2d");

    speedCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    speedCtx.font = "15px Arial";
    speedCtx.fillStyle = colorText;
    speedCtx.textAlign = "center";
    speedCtx.fillText("Speed :" + MOVE_INTERVAL + ".ms", 450, 15);
}

const apel = new Image();
apel.onload = draw;
apel.src = 'assets/gambar/apple.png';

const gambar_nyawa = new Image();
gambar_nyawa.onload = draw;
gambar_nyawa.src = 'assets/gambar/nyawa.png';

let pala_ular_kekiri = new Image();
pala_ular_kekiri.onload = draw;
pala_ular_kekiri.src = 'assets/gambar/pala_kekiri.png';

let pala_ular_kekanan = new Image();
pala_ular_kekanan.onload = draw;
pala_ular_kekanan.src = 'assets/gambar/pala_kekanan.png';

let pala_ular_keatas = new Image();
pala_ular_keatas.onload = draw;
pala_ular_keatas.src = 'assets/gambar/pala_keatas.png';

let pala_ular_kebawah = new Image();
pala_ular_kebawah.onload = draw;
pala_ular_kebawah.src = 'assets/gambar/pala_kebawah.png';

function cekPrima(nilai) {
    if (nilai > 1) {
        for(x = 2; x < nilai; x++) {
            if((nilai % x) == 0 && nilai > 2) {
                return false;
            }
        }
        return true;
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        leveling(ctx);
        if(snake1.direction === DIRECTION.LEFT) {
            REDRAW_INTERVAL = WIDTH;
            drawCellWithImage(pala_ular_kekiri, ctx, snake1.head.x, snake1.head.y);
        } else if(snake1.direction === DIRECTION.RIGHT) {
            REDRAW_INTERVAL = WIDTH;
            drawCellWithImage(pala_ular_kekanan, ctx, snake1.head.x, snake1.head.y);
        } else if(snake1.direction === DIRECTION.UP) {
            REDRAW_INTERVAL = HEIGHT;
            drawCellWithImage(pala_ular_keatas, ctx, snake1.head.x, snake1.head.y);
        } else if(snake1.direction === DIRECTION.DOWN) {
            REDRAW_INTERVAL = HEIGHT;
            drawCellWithImage(pala_ular_kebawah, ctx, snake1.head.x, snake1.head.y);
        }
        for (let i = 1; i < snake1.body.length; i++) {
            if (i % 2 == 0) {
                drawCell(ctx, snake1.body[i].x, snake1.body[i].y, "#a4b4f1");
            } else {
                drawCell(ctx, snake1.body[i].x, snake1.body[i].y, "#5c7cfc");
            }
        }
        
        drawCellWithImage(apel, ctx, apple.position.x, apple.position.y);
        drawCellWithImage(apel, ctx, apple2.position.x, apple2.position.y);

        var frequency = 200;
        if (cekPrima(score)) {
            if (Math.floor(Date.now() / frequency) % 2) {
                drawCellWithImage(gambar_nyawa, ctx, hati.position.x, hati.position.y);
            }
        }
        for (let i = 0; i < nyawa; i++) {
            drawNyawa(gambar_nyawa, ctx, 25 * i + 5, 5);
        }

        drawLevel();
        drawScore(snake1);
        drawSpeed();

        if(nyawa < 1) {
            suara_mati.play();
            alert("Yah Mati");
            MOVE_INTERVAL = 120;
            nyawa = 3;
            level = 1;
            score = 0;
        }
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_WIDTH / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_HEIGHT / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        suara_makan.play();
    }
}

function makanHati(snake) {
    if (snake.head.x == hati.position.x && snake.head.y == hati.position.y) {
        hati.position = initPosition();
        score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        nyawa++;
        suara_makan.play();
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    if (cekPrima(score)) {
        makanHati(snake);
    } else {
        hati.position = initPosition();
    }
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    if (cekPrima(score)) {
        makanHati(snake);
    } else {
        hati.position = initPosition();
    }
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    if (cekPrima(score)) {
        makanHati(snake);
    } else {
        hati.position = initPosition();
    }
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    if (cekPrima(score)) {
        makanHati(snake);
    } else {
        hati.position = initPosition();
    }
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        suara_nyawa_berkurang.play();
        nyawa--;
        snake1 = initSnake();
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight" || event.key === "d") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp" || event.key === "w") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown" || event.key === "s") {
        turn(snake1, DIRECTION.DOWN);
    }
})

// Android Swipe Control Support
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||
         evt.originalEvent.touches;
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            turn(snake1, DIRECTION.LEFT); 
        } else {
            turn(snake1, DIRECTION.RIGHT);
        }                       
    } else {
        if ( yDiff > 0 ) {
            turn(snake1, DIRECTION.UP);
        } else { 
            turn(snake1, DIRECTION.DOWN);
        }                                                                 
    }
    
    xDown = null;
    yDown = null;                                             
};

function initGame() {
    move(snake1);
}

initGame();