document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndLoadTable();

  const searchBtn = document.querySelector("#search-btn");
  const updateBtn = document.querySelector("#update-row-btn");

  const tableBody = document.querySelector("table tbody");

  searchBtn.onclick = function () {
    const searchValue = document.querySelector("#search-input").value;

    fetch(`http://localhost:8007/search/${searchValue}`)
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data["data"]));
  };

  updateBtn.onclick = function () {
    const updateNameInput = document.querySelector("#update-name-input");
    const updateExpenseName = document.querySelector("#update-expense-input");
    const updateAmount = document.querySelector("#update-Amount-input");

    fetch("http://localhost:8007/update", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: updateNameInput.dataset.id,
        username: updateNameInput.value,
        expensename: updateExpenseName.value,
        amount: updateAmount.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
          console.log("Update successful");
        }
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

    // Get the last 10 entries from the data array
    const lastTenEntries = data.slice(-10);

    let tableHtml = "";
    // Iterate through the last 10 entries in reverse order
    for (let i = lastTenEntries.length - 1; i >= 0; i--) {
      const { id, username, expensename, amount, date_add } = lastTenEntries[i];
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${username}</td>`;
      tableHtml += `<td>${expensename}</td>`;
      tableHtml += `<td>${amount}</td>`;
      tableHtml += `<td>${new Date(date_add).toLocaleString()}</td>`;
      tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
      tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
      tableHtml += "</tr>";
    }

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
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-name-input").dataset.id = id;
  }
});
