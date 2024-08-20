let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let grid = 16; // Размер клетки
let speed = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    tail: [],
    maxTail: 4 // Стартовая длина
};

let apple = generateApplePosition();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateApplePosition() {
    return {
        x: getRandomInt(0, canvas.width / grid) * grid,
        y: getRandomInt(0, canvas.height / grid) * grid
    };
}

function loop() {
    requestAnimationFrame(loop);

    if (++speed < 4) {
        return;
    }
    speed = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Двигаем змейку
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Проверяем выход за границы
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Добавляем текущую позицию змейки в начало tail
    snake.tail.unshift({ x: snake.x, y: snake.y });

    // Обрезаем tail до maxTail
    if (snake.tail.length > snake.maxTail) {
        snake.tail.pop();
    }

    // Отрисовка яблока
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Отрисовка змейки
    context.fillStyle = 'green';
    snake.tail.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Проверка на столкновение с яблоком
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxTail++;
            apple = generateApplePosition();
        }

        // Проверка на столкновение с самой собой
        for (let i = index + 1; i < snake.tail.length; i++) {
            if (cell.x === snake.tail[i].x && cell.y === snake.tail[i].y) {
                // Сброс змейки после столкновения с собой
                snake.x = 160;
                snake.y = 160;
                snake.tail = [];
                snake.maxTail = 4;
                snake.dx = grid;
                snake.dy = 0;
                apple = generateApplePosition();
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);
