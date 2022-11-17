// Переменная отвечающая за размер поля
let size = 25;

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

  // По нажатию на микроба его жизненное значение заменяется на противоположное
  changeCellState(event, i, j) {
    const selected_cell = event.target;
    console.log(selected_cell.innerHTML);
    this.field[i][j] = !this.field[i][j];
    // Изменяется класс микроба, его значение, а также сразу меняется цвет, т.к при изменении класса цвет не меняется автоматически
    if (selected_cell.innerText == "0") {
      selected_cell.innerHTML = "1";
      selected_cell.classList.remove("cell_dead");
      selected_cell.classList.add("cell_alive");
      selected_cell.style.backgroundColor = "#372725";
    } else {
      selected_cell.innerHTML = "0";
      selected_cell.classList.remove("cell_alive");
      selected_cell.classList.add("cell_dead");
      selected_cell.style.backgroundColor = "#78862D";
    }
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
        cell.setAttribute("onclick", `game.changeCellState(event, ${i}, ${j})`);
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
      this.timer = setInterval(() => this.displayField(), 200);
    }
    this.isActive = !this.isActive;
  },

  // На основе заданного параметра изменяет значение глобальной переменной и обновляет поле на нужный размер
  changeFieldSize(event) {
    size = event.target.value;
    event.target.value = "";
    this.clearField();
  },
};

const element = document.getElementById("main_draggable_container");
const main = document.getElementById("main");

// Функция, отвечающая за перемещение поля при ведении мышки
element.onmousedown = function (event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  moveAt(event.pageX, event.pageY);

  // Перемещает поле на координаты shiftX и shiftY
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

	// Повторяет это действие при каждом изменении мышки
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  // Поставить элемент на место
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
};

// Отключить высвечивание клона при движении поля
element.ondragstart = function () {
  return false;
};

// При изменении зума, поставить элемент на центр поля
function setFieldToCenter(event) {
  element.style.top = "2%";
  element.style.left = "31%";
}
