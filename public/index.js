document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.querySelector("#add-name-btn");
  const tableBody = document.querySelector("table tbody");

  addBtn.onclick = function () {
    const nameInput = document.querySelector("#user-name-input");
    const ExpenseInput = document.querySelector("#expense-name-input");
    const AmountInput = document.querySelector("#Amount-input");
    const username = nameInput.value;
    const expensename = ExpenseInput.value;
    const amount = AmountInput.value;

    fetch("http://localhost:8007/insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
        expensename: expensename,
        amount: amount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Expense added by ${username}`);
          insertRowIntoTable(data["data"]);
          location.reload();
        } else {
          alert("Failed to add expense. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  };

  function fetchDataAndLoadTable() {
    fetch("http://localhost:8007/getAll")
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data["data"]));
  }

  function loadHTMLTable(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
      table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
      return;
    }

    let tableHtml = "";
    data.forEach(function ({ id, username, expensename, amount, date_add }) {
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${username}</td>`;
      tableHtml += `<td>${expensename}</td>`;
      tableHtml += `<td>${amount}</td>`;
      tableHtml += `<td>${new Date(date_add).toLocaleString()}</td>`;
      tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
      tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
      tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
  }

  tableBody.addEventListener("click", function (event) {
    if (event.target.className === "delete-row-btn") {
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
      handleEditRow(event.target.dataset.id);
    }
  });

  function deleteRowById(id) {
    fetch(`http://localhost:8007/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  }

  function handleEditRow(id) {
    // Handle the edit row functionality here
  }

  fetchDataAndLoadTable();
});
