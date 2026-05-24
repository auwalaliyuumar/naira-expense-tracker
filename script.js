// Naira Expense Tracker - Complete Final Version
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart = null;

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');

// Format Amount
function formatAmount(amount) {
    return new Intl.NumberFormat('en-NG').format(Math.abs(amount));
}

function updateBalance() {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += parseFloat(t.amount);
        else expense += parseFloat(t.amount);
    });
    const balance = income - expense;
    balanceEl.textContent = formatAmount(balance);
    balanceEl.parentElement.style.color = balance >= 0 ? '#27ae60' : '#e74c3c';
    incomeEl.textContent = formatAmount(income);
    expenseEl.textContent = formatAmount(expense);
}

function updateChart() {
    const ctx = document.getElementById('expenseChart');
    const expenseByCategory = {};
    
    transactions.forEach(t => {
        if (t.type === 'expense' && t.category) {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + parseFloat(t.amount);
        }
    });

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(expenseByCategory).length ? Object.keys(expenseByCategory) : ['No expenses'],
            datasets: [{
                data: Object.values(expenseByCategory).length ? Object.values(expenseByCategory) : [1],
                backgroundColor: ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderTransactions() {
    transactionList.innerHTML = transactions.length === 0 
        ? '<li style="text-align:center; color:#777; padding:30px;">No transactions yet. Add one above 👆</li>' : '';

    transactions.slice().reverse().forEach((t, i) => {
        const index = transactions.length - 1 - i;
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${t.description}</strong><br>
                <small>${t.category} • ${new Date(t.date).toLocaleDateString('en-NG')}</small>
            </div>
            <div style="text-align:right">
                <span class="${t.type}">${t.type === 'income' ? '+' : '-'} ₦${formatAmount(t.amount)}</span><br>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this transaction?')) {
                transactions.splice(btn.dataset.index, 1);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                updateBalance();
                renderTransactions();
                updateChart();
            }
        });
    });
}

// Add Transaction
form.addEventListener('submit', e => {
    e.preventDefault();
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    if (!description || !amount || !category) return alert("Please fill all fields");

    transactions.push({ description, amount, type, category, date: new Date().toISOString() });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateBalance();
    renderTransactions();
    updateChart();
    form.reset();
});

// Export CSV
document.getElementById('export-btn').addEventListener('click', () => {
    if (!transactions.length) return alert("No transactions to export!");

    let csv = "Date,Description,Category,Type,Amount(₦)\n";
    transactions.forEach(t => {
        csv += `${new Date(t.date).toLocaleDateString('en-NG')},${t.description},${t.category || ''},${t.type},${t.amount}\n`;
    });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
    a.download = `naira-expenses-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
});

// Initialize
updateBalance();
renderTransactions();
updateChart();