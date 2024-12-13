const todoInput = document.getElementById("input-text");
const dateInput = document.getElementById("input-date");
const addBtn = document.getElementById("add-btn");
const table = document.querySelector("table");
const deleteAllBtn = document.getElementById("delete-all");
const categoryBtns = document.querySelectorAll(".selector");

const deleteHandler = (event) => {
  const row = event.target.parentElement.parentElement;
  row.remove();
  tableSnapshot();
};

const doHandler = (event) => {
  const row = event.target.parentElement.parentElement;
  if (row.children[2].innerText === "Completed") {
    row.children[2].innerText = "Pending";
    event.target.innerText = "Do";
  } else {
    row.children[2].innerText = "Completed";
    event.target.innerText = "undo";
  }
  tableSnapshot();
};

const editHandler = (event) => {
  const row = event.target.parentElement.parentElement;
  todoInput.value = row.children[0].innerText;
  dateInput.value = row.children[1].innerText;
  row.remove();
  tableSnapshot();
};

const addHandlerToBtns = () => {
  const actionBtns = document.querySelectorAll(".action-button");
  actionBtns.forEach((btn) => {
    if (btn.innerText === "Delete") {
      btn.addEventListener("click", deleteHandler);
    } else if (btn.innerText === "Edit") {
      btn.addEventListener("click", editHandler);
    } else {
      btn.addEventListener("click", doHandler);
    }
  });
};

const reloadTable = () => {
  if (localStorage.getItem("table") !== null) {
    const reloadedTabel = decodeURIComponent(
      JSON.parse(localStorage.getItem("table"))
    );
    table.innerHTML = reloadedTabel;
    addHandlerToBtns();
  }
};
reloadTable();

const tableSnapshot = () => {
  const tableString = JSON.stringify(encodeURIComponent(table.innerHTML));
  localStorage.setItem("table", tableString);
};

const activateBtn = (target) => {
  categoryBtns.forEach((btn) => {
    if (
      btn.textContent === target.textContent ||
      btn.classList.contains("active")
    ) {
      btn.classList.toggle("active");
    }
  });
};

const showCategoryHandler = (event) => {
  activateBtn(event.target);
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    if (event.target.textContent === "All") {
      row.style.display = "";
    } else {
      const status = row.children[2].textContent;
      if (status === event.target.textContent) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
};
categoryBtns.forEach((categoryBtn) => {
  categoryBtn.addEventListener("click", showCategoryHandler);
});

const makeNewRow = (todo, date) => {
  let newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${todo}</td>
              <td>${date}</td>
              <td>Pending</td>
              <td>
                <button class="edit-button action-button">Edit</button>
                <button class="do-button action-button">Do</button>
                <button class="delete-button action-button">Delete</button>
              </td>`;
  return newRow;
};

const today = () => {
  date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  date = `${year}-${month}-${day}`;
  return date;
};

const addHandler = (e) => {
  const todo = todoInput.value;
  let date = dateInput.value;
  if (todo === "") {
    alert("Please enter todo!");
  } else {
    if (date === "") {
      date = today();
    }
    const newRow = makeNewRow(todo, date);
    const tableBody = document.querySelector("tbody");
    tableBody.appendChild(newRow);
    todoInput.value = "";
    dateInput.value = "";
    addHandlerToBtns();
    tableSnapshot();
  }
};
addBtn.addEventListener("click", addHandler);

const deleteAllHandler = (event) => {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    row.remove();
  });
  tableSnapshot();
};
deleteAllBtn.addEventListener("click", deleteAllHandler);
