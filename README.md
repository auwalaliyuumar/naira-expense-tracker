<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Naira Expense Tracker</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <h1>💰 Naira Expense Tracker</h1>

    <div class="balance">
      <h2>Balance: ₦<span id="balance">0</span></h2>
    </div>

    <form id="transaction-form">
      <input type="text" id="description" placeholder="What did you spend on?" required>
      <select id="category" required>
        <option value="">Select Category</option>
        <option value="Food">🍲 Food</option>
        <option value="Transport">🛵 Transport</option>
        <option value="Airtime">📱 Airtime & Data</option>
        <option value="Fuel">⛽ Fuel</option>
        <option value="NEPA">⚡ NEPA/Electricity</option>
        <option value="Rent">🏠 Rent</option>
        <option value="Salary">💰 Salary</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Health">🩹 Health</option>
        <option value="Other">📌 Other</option>
      </select>
      <input type="number" id="amount" placeholder="Amount (₦)" step="0.01" required>
      <select id="type" required>
        <option value="expense">Expense (-)</option>
        <option value="income">Income (+)</option>
      </select>
      <button type="submit">Add Transaction</button>
    </form>

    <div class="summary">
      <p>Income: ₦<span id="income">0</span></p>
      <p>Expenses: ₦<span id="expense">0</span></p>
    </div>

    <div style="margin: 25px 0;">
      <canvas id="expenseChart" height="220"></canvas>
    </div>

    <div style="text-align: center; margin: 15px 0;">
      <button id="export-btn" style="background: #27ae60; padding: 12px 30px; font-size: 16px;">
        📥 Export to CSV
      </button>
    </div>

    <!-- Support Button with your real link -->
    <div style="text-align: center; margin: 35px 0; padding: 25px; background: #e8f5e9; border-radius: 12px;">
      <p style="margin-bottom: 15px; font-weight: bold; color: #2c3e50; font-size: 18px;">💌 Support this project</p>
      <a href="https://paystack.shop/pay/7-ub2n9idd" 
         target="_blank"
         style="background: #00C853; color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px;">
        ☕ Buy Me Data / Support Development
      </a>
    </div>

    <h3>Recent Transactions</h3>
    <ul id="transaction-list"></ul>
  </div>

  <script src="script.js"></script>
</body>
</html>