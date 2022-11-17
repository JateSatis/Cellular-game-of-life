// Переменная отвечающая за размер поля
let size = 30;

let speed = 200;

// Is drawing mode selected
let isDrawingMode = false;

// Is pen mode selected
let isPen = true;

// Main object creating the field and all the cells
const game = {
  // Запущена ли в данный момент игра
  isActive: false,

  // При первой загрузке страницы заполняется поле из пустых (мертвых) значений этим генератором.
  field: Array.apply(null, Array(size)).map((item) => {
    return Array.apply(null, Array(size)).map(function (item) {
      return 0;
    });
  }),

  // Функция, получающая на вход координаты микроба, выщитывающая на их основании кол-во живых соседов микроба
  checkNeighbours(i, j) {
    let count = 0;
    // Сначала проверяются соседи у всех клеток, ниже первого ряда
    if (i > 0) {
      if (this.field[i - 1][j] != 0) {
        count += 1;
      }
      // Проверяется угол
      if (j > 1) {
        if (this.field[i - 1][j - 1] != 0) {
          count += 1;
        }
      }
      // Проверяется угол
      if (j < size - 1) {
        if (this.field[i - 1][j + 1]) {
          count += 1;
        }
      }
    }

    // Проверяются соседи у всех клеток, выше последнего ряда
    if (i < size - 1) {
      if (this.field[i + 1][j] != 0) {
        count += 1;
      }
      // Проверяется угол
      if (j > 0) {
        if (this.field[i + 1][j - 1] != 0) {
          count += 1;
        }
      }
      // Проверяется угол
      if (j < size - 1) {
        if (this.field[i + 1][j + 1]) {
          count += 1;
        }
      }
    }

    // Проверяются соседи у всех клеток, правее начального столбца
    if (j > 0) {
      if (this.field[i][j - 1] != 0) {
        count += 1;
      }
    }
    // Проверяются соседи у всех клеток, левее последнего столбца
    if (j < size - 1) {
      if (this.field[i][j + 1] != 0) {
        count += 1;
      }
    }
    return count;
  },

  // Проходит по массиву жизненных значений микробов, создавая новый массив обновленных значений
  updateField() {
    // Создается новый массив, который будет хранить в себе обновленные значение
    let updated_field = [];
    for (let i = 0; i < size; i++) {
      updated_field.push([]);
      for (let j = 0; j < size; j++) {
        // На проверку берется кол-во живых соседей клетки и обновляется по условиям оригинальной игры
        neighbours_amount = this.checkNeighbours(i, j);
        if (this.field[i][j] == 0) {
          if (neighbours_amount == 3) {
            updated_field[i].push(1);
          } else {
            updated_field[i].push(0);
          }
        } else {
          if (neighbours_amount == 2 || neighbours_amount == 3) {
            updated_field[i].push(1);
          } else {
            updated_field[i].push(0);
          }
        }
      }
    }

    // Дополнительная проверка на пустоту поля. Если поле пустое, оно отчищается и симуляция останавливается
    let amountOfAliveCells = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        amountOfAliveCells += updated_field[i][j];
      }
    }
    if (amountOfAliveCells == 0) {
      const button = document.getElementById("startSimulation");
      clearInterval(this.timer);
      this.timer = setInterval(() => this.displayField(), 100000000);
      button.getElementsByTagName("p")[0].innerHTML = "Start";
      this.isActive = false;
      this.field = Array.apply(null, Array(100)).map(() => {
        return Array.apply(null, Array(100)).map(function () {
          return 0;
        });
      });
    }
    return updated_field;
  },

  // Для каждого обновленного микроба - обновляет для него html элемент на странице
  displayField() {
    // Заменяем старое поле на обновленное (можно оптимизировать)
    this.field = this.updateField();
    const main = document.getElementById("main_draggable_container");
    // Очищаем контейнер, содержащий всех микробов
    main.innerHTML = null;
    for (let i = 0; i < size; i++) {
      this.field.push([]);
      // Создаем отдельный элемент, который будет хранить строчку из микробов
      const row = document.createElement("div");
      row.id = i;
      row.className = "cell_row";
      for (let j = 0; j < size; j++) {
        // Создаем элемент, являющийся презентацией микроба на сайте
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `${i}-${j}`;
        this.field[i][j]
          ? cell.classList.add("cell_dead")
          : cell.classList.add("cell_alive");
        cell.innerText = this.field[i][j];
        row.appendChild(cell);
      }
      main.appendChild(row);
    }
  },

  // Полностью очищает поле
  clearField() {
    const button = document.getElementById("startSimulation");
    // Очищает интервал, обновляющий симуляцию
    clearInterval(this.timer);
    this.timer = setInterval(() => this.displayField(), 100000000);
    // Изменяет значение кнопки старт
    button.getElementsByTagName("p")[0].innerHTML = "Start";
    this.isActive = false;
    // Очищает поле
    this.field = Array.apply(null, Array(100)).map((item) => {
      return Array.apply(null, Array(100)).map(function (item) {
        return 0;
      });
    });

    // При очищении поля ставим его на начальную позицию
    this.setFieldToCenter();
    document.body.style.zoom = "100%";

    // Выводит его
    this.displayField();
  },

  // Запускает симуляцию
  startSimulation() {
    const button = document.getElementById("startSimulation");
    // Логика замены слова внутри кнопки
    button.getElementsByTagName("p")[0].innerHTML == "Start"
      ? (button.getElementsByTagName("p")[0].innerHTML = "Stop")
      : (button.getElementsByTagName("p")[0].innerHTML = "Start");

    // Постановка интервала, который будет отвечать за скорость обновления симуляции
    if (this.isActive) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.displayField(), 10000000);
    } else {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.displayField(), speed);
    }
    this.isActive = !this.isActive;
  },

  // На основе заданного параметра изменяет значение глобальной переменной и обновляет поле на нужный размер
  changeFieldSize(event) {
    size = event.target.value;
    event.target.value = "";
    this.clearField();
  },

  changeSimSpeed(event) {
    speed = event.target.value;
    event.target.value = "";
    this.isActive = !this.isActive;
    if (this.isActive) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.displayField(), 10000000);
    } else {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.displayField(), speed);
    }
    this.isActive = !this.isActive;
  },

  // При изменении зума, поставить элемент на центр поля
  setFieldToCenter() {
    fieldDraggableContainer.style.top = "2%";
    fieldDraggableContainer.style.left = "31%";
  },
};

// Getting all the elements that need to be used or updated
const drawingModeButton = document.getElementById("drawingMode");
const fieldDraggableContainer = document.getElementById(
  "main_draggable_container"
);
const main = document.getElementById("main");
let selected_cells = document.getElementsByClassName("cell");
const penButton = document.getElementById("pen");
const rubberButton = document.getElementById("rubber");

// Function changing the state of the drawing mode button. It also changes the state of the drawingMode variable
drawingModeButton.onclick = function (event) {
  isDrawingMode = !isDrawingMode;
  if (isDrawingMode) {
    event.target.innerText = "Drawing mode";
  } else {
    event.target.innerText = "Field move mode";
    // When we change to the move mode, clear the drawing event on the cells
    for (let i = 0; i < selected_cells.length; i++) {
      let elem = selected_cells[i];
      elem.onmousedown = null;
    }
  }
};

// Set the mode to the pen
function setPen(event) {
  isPen = true;
  rubberButton.style.backgroundColor = "#dfdf90";
  penButton.style.backgroundColor = "#e5ae2e";
}

// Set the mode to the pen
function setRubber(event) {
  isPen = false;
  penButton.style.backgroundColor = "#dfdf90";
  rubberButton.style.backgroundColor = "#e5ae2e";
}

// Функция, отвечающая за перемещение поля при ведении мышки
fieldDraggableContainer.onmousedown = function (event) {
  // Поле перемещается если включен режим пережвижения поля
  if (!isDrawingMode) {
    let shiftX =
      event.clientX - fieldDraggableContainer.getBoundingClientRect().left;
    let shiftY =
      event.clientY - fieldDraggableContainer.getBoundingClientRect().top;

    moveAt(event.pageX, event.pageY);

    // Перемещает поле на координаты shiftX и shiftY
    function moveAt(pageX, pageY) {
      let new_left = pageX - shiftX;
      let new_top = pageY - shiftY;
      fieldDraggableContainer.style.left = `${new_left}px`;
      fieldDraggableContainer.style.top = `${new_top}px`;
    }

    // Повторяет это действие при каждом изменении мышки
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.onclick = function () {
      document.removeEventListener("mousemove", onMouseMove);
    };

    document.addEventListener("mousemove", onMouseMove);

    // Поставить элемент на место
    fieldDraggableContainer.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      fieldDraggableContainer.onmouseup = null;
    };
  } else {
    // В ином случае запускается логика по рисованию на поле
    function drawCell(event) {
      const selected_cell = event.target;
      const id = selected_cell.id.split("-");
      let i = +id[0];
      let j = +id[1];
      if (isPen) {
        game.field[i][j] = 1;
        // Изменяется класс микроба, его значение, а также сразу меняется цвет, т.к при изменении класса цвет не меняется автоматически
        selected_cell.innerHTML = "1";
        selected_cell.classList.remove("cell_dead");
        selected_cell.classList.add("cell_alive");
        selected_cell.style.backgroundColor = "#372725";
      } else {
        game.field[i][j] = 0;
        // Изменяется класс микроба, его значение, а также сразу меняется цвет, т.к при изменении класса цвет не меняется автоматически
        selected_cell.innerHTML = "0";
        selected_cell.classList.remove("cell_alive");
        selected_cell.classList.add("cell_dead");
        selected_cell.style.backgroundColor = "#78862d";
      }
    }

    // Creating an event for the first press on the mouse
    for (let i = 0; i < selected_cells.length; i++) {
      let elem = selected_cells[i];
      elem.onmousedown = function (event) {
        drawCell(event);
      };
      elem.addEventListener("pointerenter", drawCell);
    }

    // Clearance of events on each individual cell
    fieldDraggableContainer.onmouseup = function () {
      for (let i = 0; i < selected_cells.length; i++) {
        let elem = selected_cells[i];
        elem.removeEventListener("pointerenter", drawCell);
        fieldDraggableContainer.click = null;
      }
    };
  }
};
