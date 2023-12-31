var FIELD_SIZE_X = 30;//строки
var FIELD_SIZE_Y = 30; //столблцы
var SNAKE_SPEED = 100;// Интервал между перемещениями змейки
var snake = []; // сама змейка
var direction = 'y+';// Напрпвление движения змейки
var gameIsRunning = false; //Запущенная игра
var snake_timer; //Таймер змейки
var food_timer; //Таймер для еды
var score = 0; //Очки

function init() {
    prepareGameField(); //Генерация поля
    var wrap = document.getElementsByClassName('wrap')[0];

    wrap.style.width = '400px';
    // Событяи кнопок Страт и Новая игра
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click',refreshGame);
    //Отслежвание клав клавиатура
    addEventListener('keydown', changeDirection);

}
//Функиция генерации игрового поля

function prepareGameField() {
    // Создаем таблицу
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table')

    //Генерация ячеек игровой таблицы
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        // Создание строки
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            // Создание чейки
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;
            row.appendChild(cell); // Добавление ячейки

        }
        game_table.appendChild(row); //Добавление строки
    }
    document.getElementById('snake-field').appendChild(game_table); //Добавление таблицы

}

//Старт игры
function startGame() {
    gameIsRunning = true;
    respawn(); // Создали змейку
    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 5000);
}
// Функиця расположения змейки на игровом поле

function respawn() {
    //Змейка- массив td
    // Старотова длина змейки =2
    // REspawn змейки из центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    // Голова змейки
    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    // Тело змейки
    var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y - 1) + '-' + start_coord_x)[0];
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    snake.push(snake_head);
    snake.push(snake_tail);
}

//Движение змейки

function move() {
    //сборка классов
    var snake_head_classes = snake[snake.length - 1].getAttribute('class').split(' ');
    // Сдвиг головы
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Определяем новую точку

    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
    }
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
    }
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
    }
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
    }

    //Проверки 
    
    if (!isSnakeUnit(new_unit) && new_unit !== undefined) {
        console.log(new_unit);
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);
        //Провереяем надо ли убрать хвост
        
        if (!haveFood(new_unit)) {
            //Находим хвост
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            // удаляем хвост
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    }
    else {
        finishTheGame();
    }
}

function isSnakeUnit(unit) {
    var check = false;
    if (snake.includes(unit)) {
        check = true;
    }
    return check;
}
//проверка на еду

function haveFood(unit) {
    var check = false;
    var unit_classes = unit.getAttribute('class').split(' ');
    //Если еда
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();

        score++;
    }
    return check
}

// Создание еды

function createFood() {
    var foodCreated = false;
    while (!foodCreated) {
        // рандом
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');
        // проверка на змейку
        if (!food_cell_classes.includes(' snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }
            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}
//Изменение напрвалния движения змейки

function changeDirection(e) {
    console.log(e);
    switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // клавиша вверж
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: // клавиша вниз
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
    }

}

//Функция завершения игры

function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('Вы проиграли! Ваш результат: ' + score.toString());
}



//Новая игра
function refreshGame() {
    location.reload;
}


// Инициализация 
window.onload = init;