const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transactions');
const themeToggle = document.getElementById('theme-toggle');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    totalBalance.textContent = formatCurrency(balance);
    totalIncome.textContent = formatCurrency(income);
    totalExpenses.textContent = formatCurrency(expenses);

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };

    transactions.push(transaction);
    updateBalance();
    addTransactionToDOM(transaction);
    transactionForm.reset();
}

function addTransactionToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type === 'income' ? 'income-item' : 'expense-item');
    li.classList.add('fade-in');

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}</span>
    `;

    transactionList.prepend(li);

    // Animate the new transaction
    gsap.from(li, {
        opacity: 0,
        x: -50,
        duration: 0.5,
        ease: "power2.out"
    });
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--primary-color', '#3498db');
        document.documentElement.style.setProperty('--secondary-color', '#ecf0f1');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#1a1a2e');
        document.documentElement.style.setProperty('--text-color', '#e0e0e0');
        document.documentElement.style.setProperty('--primary-color', '#0f3460');
        document.documentElement.style.setProperty('--secondary-color', '#16213e');
        document.documentElement.style.setProperty('--card-bg', '#16213e');
    }
}

transactionForm.addEventListener('submit', addTransaction);
themeToggle.addEventListener('click', toggleTheme);

// Initial render
updateBalance();
transactions.forEach(addTransactionToDOM);

// Animate dashboard on load
gsap.from('.dashboard > *', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});