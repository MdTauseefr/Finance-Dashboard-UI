let role = "viewer";

const roleSelect = document.getElementById("roleSelect");
const addSection = document.getElementById("addTransaction");

roleSelect.addEventListener("change", () => {
  role = roleSelect.value;
  addSection.classList.toggle("hidden", role !== "admin");
});

function renderTransactions(data) {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  data.forEach(tx => {
    list.innerHTML += `
      <tr>
        <td>${tx.date}</td>
        <td>${tx.desc}</td>
        <td>₹${tx.amount}</td>
        <td>${tx.category}</td>
        <td>${tx.type}</td>
      </tr>
    `;
  });
}

function updateSummary() {
  let income = 0, expense = 0;

  transactions.forEach(tx => {
    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  });

  document.getElementById("income").innerText = `₹${income}`;
  document.getElementById("expense").innerText = `₹${expense}`;
  document.getElementById("balance").innerText = `₹${income - expense}`;
}

function addTransaction() {
  if (role !== "admin") return alert("Only admin allowed");

  const desc = document.getElementById("desc").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  const newTx = {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    desc,
    amount,
    category,
    type
  };

  transactions.push(newTx);
  renderTransactions(transactions);
  updateSummary();
  generateInsights();
}

function generateInsights() {
  let categoryMap = {};

  transactions.forEach(tx => {
    if (tx.type === "expense") {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    }
  });

  let top = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b
  );

  document.getElementById("topCategory").innerText =
    "Top spending category: " + top;
}

document.getElementById("search").addEventListener("input", filterData);
document.getElementById("filterType").addEventListener("change", filterData);

function filterData() {
  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("filterType").value;

  let filtered = transactions.filter(tx => {
    return (
      (type === "all" || tx.type === type) &&
      tx.desc.toLowerCase().includes(search)
    );
  });

  renderTransactions(filtered);
}

renderTransactions(transactions);
updateSummary();
generateInsights();