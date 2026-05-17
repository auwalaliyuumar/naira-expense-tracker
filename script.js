// Naira Expense Tracker - Final Version with Chart
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart = null;

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');

// Format amount with Nigerian style
function formatAmount(amount) {
    return new Intl.NumberFormat('en-NG').format(Math.abs(amount));
}

// Update Balance
function updateBalance() {
    let income = 0;
    let expense = 0;

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

// Update Pie Chart
function updateChart() {
    const ctx = document.getElementById('expenseChart');
    
    const expenseByCategory = {};
    transactions.forEach(t => {
        if (t.type === 'expense' && t.category) {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + parseFloat(t.amount);
        }
    });

    const labels = Object.keys(expenseByCategory);
    const dataValues = Object.values(expenseByCategory);

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels.length > 0 ? labels : ['No expenses yet'],
            datasets: [{
                data: dataValues.length > 0 ? dataValues : [1],
                backgroundColor: [
                    '#e74c3c', '#f39c12', '#3498db', '#2ecc71',
                    '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 15 } },
                title: { display: true, text: 'Expenses by Category', font: { size: 16 } }
            }
        }
    });
}

// Render Transaction List
function renderTransactions() {
    transactionList.innerHTML = '';

    if (transactions.length === 0) {
        transactionList.innerHTML = '<li style="text-align:center; color:#777; padding:20px;">No transactions yet. Add one above 👆</li>';
        return;
    }

    transactions.slice().reverse().forEach((t, index) => {
        const realIndex = transactions.length - 1 - index;
        const sign = t.type === 'income' ? '+' : '-';
        const typeClass = t.type === 'income' ? 'income' : 'expense';

        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${t.description}</strong><br>
                <small>${t.category || ''} • ${new Date(t.date).toLocaleDateString('en-NG')}</small>
            </div>
            <div style="text-align: right;">
                <span class="${typeClass}">${sign} ₦${formatAmount(t.amount)}</span><br>
                <button class="delete-btn" data-index="${realIndex}">Delete</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (confirm('Delete this transaction?')) {
                transactions.splice(index, 1);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                updateBalance();
                renderTransactions();
                updateChart();
            }
        });
    });
}

// Add Transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    if (!description || !amount || amount <= 0 || !category) {
        alert("Please fill all fields correctly");
        return;
    }

    transactions.push({
        description,
        amount,
        type,
        category,
        date: new Date().toISOString()
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    renderTransactions();
    updateChart();

    form.reset();
});

// Export to CSV
document.getElementById('export-btn').addEventListener('click', () => {
    if (transactions.length === 0) {
        alert("No transactions to export yet!");
        return;
    }

    let csv = "Date,Description,Category,Type,Amount (₦)\n";
    
    transactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('en-NG');
        csv += `${date},${t.description},${t.category || ''},${t.type},${t.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naira-expenses-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
});

// Initialize the app
updateBalance();
renderTransactions();
updateChart();