// Petty Cash Calculator
(function () {
  'use strict';

  // ================== State ==================
  const state = {
    currency: '$',
    startingBalance: 0,
    expenses: [],
    charts: { category: null, trend: null }
  };

  const CURRENCY_SYMBOLS = {
    '$': '$',
    'SAR': 'SAR',
    'AED': 'AED',
    '€': '€',
    '£': '£'
  };

  const CATEGORIES = ['Office', 'Travel', 'Meals', 'Supplies', 'Utilities', 'Other'];
  const CATEGORY_COLORS = {
    'Office': '#3b82f6',
    'Travel': '#f59e0b',
    'Meals': '#ef4444',
    'Supplies': '#10b981',
    'Utilities': '#8b5cf6',
    'Other': '#64748b'
  };

  // ================== DOM refs ==================
  const $ = (id) => document.getElementById(id);
  const currencyEl = $('currency');
  const currencySymbolEl = $('currency-symbol');
  const startingBalanceEl = $('starting-balance');
  const expenseForm = $('expense-form');
  const expenseDateEl = $('expense-date');
  const expenseDescEl = $('expense-desc');
  const expenseCategoryEl = $('expense-category');
  const expenseAmountEl = $('expense-amount');
  const expensesBody = $('expenses-body');
  const emptyRow = $('empty-row');
  const summaryBalance = $('summary-balance');
  const summarySpent = $('summary-spent');
  const summaryCount = $('summary-count');
  const summaryTop = $('summary-top');
  const themeToggle = $('theme-toggle');
  const themeIcon = $('theme-icon');
  const toast = $('toast');
  const toastMessage = $('toast-message');
  const categoryChartCanvas = $('category-chart');
  const trendChartCanvas = $('trend-chart');
  const categoryChartEmpty = $('category-chart-empty');
  const trendChartEmpty = $('trend-chart-empty');

  // ================== Helpers ==================
  function formatMoney(amount) {
    const symbol = CURRENCY_SYMBOLS[state.currency] || state.currency;
    const value = parseFloat(amount || 0).toFixed(2);
    if (state.currency === '$' || state.currency === '€' || state.currency === '£') {
      return symbol + value;
    }
    return value + ' ' + symbol;
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function generateId() {
    return 'exp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }

  function showToast(message, duration = 2500) {
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ================== Analytics ==================
  function trackToolEvent(eventName, payload = {}) {
    try {
      if (typeof gtag === 'function') {
        gtag('event', eventName, payload);
      }
      if (window.PettyCashFirebase?.trackVisitor) {
        // Firestore event logging (best-effort)
      }
    } catch (e) {}
  }

  // ================== State persistence / URL share ==================
  function encodeState() {
    try {
      const data = {
        c: state.currency,
        b: state.startingBalance,
        e: state.expenses.map(e => ({
          i: e.id,
          d: e.date,
          de: e.description,
          ca: e.category,
          a: e.amount
        }))
      };
      return btoa(encodeURIComponent(JSON.stringify(data))).replace(/=/g, '');
    } catch (e) {
      return '';
    }
  }

  function decodeState(str) {
    try {
      const json = decodeURIComponent(atob(str));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function updateUrlShare() {
    try {
      const hash = encodeState();
      if (!hash) return;
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }

  function loadFromUrl() {
    try {
      const url = new URL(window.location.href);
      const hash = url.hash.replace('#', '');
      if (!hash) return false;
      const data = decodeState(hash);
      if (!data) return false;
      state.currency = CURRENCY_SYMBOLS[data.c] ? data.c : '$';
      state.startingBalance = parseFloat(data.b) || 0;
      state.expenses = (data.e || []).map(item => ({
        id: item.i || generateId(),
        date: item.d || todayStr(),
        description: item.de || '',
        category: item.ca || 'Other',
        amount: parseFloat(item.a) || 0
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ================== Calculations ==================
  function getTotals() {
    const totalSpent = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = Math.max(0, state.startingBalance - totalSpent);
    const byCategory = {};
    state.expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    let topCategory = '—';
    let topAmount = -1;
    Object.entries(byCategory).forEach(([cat, amt]) => {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    });
    return { totalSpent, remaining, byCategory, topCategory, topAmount };
  }

  function getTrendData() {
    const map = {};
    state.expenses.forEach(e => {
      map[e.date] = (map[e.date] || 0) + e.amount;
    });
    const dates = Object.keys(map).sort();
    return { dates, values: dates.map(d => map[d]) };
  }

  // ================== Rendering ==================
  function renderSummary() {
    const { totalSpent, remaining, topCategory } = getTotals();
    summaryBalance.textContent = formatMoney(remaining);
    summarySpent.textContent = formatMoney(totalSpent);
    summaryCount.textContent = state.expenses.length;
    summaryTop.textContent = topCategory;

    if (remaining < totalSpent * 0.15 && remaining > 0) {
      summaryBalance.parentElement.classList.remove('from-green-500', 'to-emerald-600');
      summaryBalance.parentElement.classList.add('from-amber-500', 'to-orange-600');
    } else if (remaining <= 0) {
      summaryBalance.parentElement.classList.remove('from-green-500', 'to-emerald-600', 'from-amber-500', 'to-orange-600');
      summaryBalance.parentElement.classList.add('from-red-500', 'to-rose-600');
    } else {
      summaryBalance.parentElement.classList.remove('from-amber-500', 'to-orange-600', 'from-red-500', 'to-rose-600');
      summaryBalance.parentElement.classList.add('from-green-500', 'to-emerald-600');
    }
  }

  function renderTable() {
    expensesBody.innerHTML = '';
    if (state.expenses.length === 0) {
      expensesBody.appendChild(emptyRow);
      return;
    }

    const sorted = [...state.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(expense => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors';
      tr.innerHTML = `
        <td class='px-4 py-3 text-slate-700 dark:text-slate-200 whitespace-nowrap'>${escapeHtml(expense.date)}</td>
        <td class='px-4 py-3 text-slate-700 dark:text-slate-200'>${escapeHtml(expense.description)}</td>
        <td class='px-4 py-3'>
          <span class='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium' style='background:${CATEGORY_COLORS[expense.category]}20;color:${CATEGORY_COLORS[expense.category]}'>${escapeHtml(expense.category)}</span>
        </td>
        <td class='px-4 py-3 text-end font-medium text-slate-900 dark:text-white'>${formatMoney(expense.amount)}</td>
        <td class='px-4 py-3 text-center no-print'>
          <button type='button' data-delete='${expense.id}' class='text-slate-400 hover:text-red-500 transition-colors p-1 rounded' aria-label='Delete expense'>
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'></polyline><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path></svg>
          </button>
        </td>
      `;
      expensesBody.appendChild(tr);
    });

    expensesBody.querySelectorAll('button[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delete;
        state.expenses = state.expenses.filter(e => e.id !== id);
        updateAll();
        trackToolEvent('calculator_expense_deleted');
      });
    });
  }

  function renderCharts() {
    if (state.expenses.length === 0) {
      categoryChartEmpty.classList.remove('hidden');
      trendChartEmpty.classList.remove('hidden');
      if (state.charts.category) { state.charts.category.destroy(); state.charts.category = null; }
      if (state.charts.trend) { state.charts.trend.destroy(); state.charts.trend = null; }
      return;
    }

    categoryChartEmpty.classList.add('hidden');
    trendChartEmpty.classList.add('hidden');

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const { byCategory } = getTotals();
    const labels = Object.keys(byCategory).sort((a, b) => byCategory[b] - byCategory[a]);
    const data = labels.map(l => byCategory[l]);
    const colors = labels.map(l => CATEGORY_COLORS[l] || '#64748b');

    if (state.charts.category) state.charts.category.destroy();
    state.charts.category = new Chart(categoryChartCanvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: textColor, font: { family: 'Inter', size: 12 }, boxWidth: 12 } }
        },
        cutout: '65%'
      }
    });

    const trend = getTrendData();
    if (state.charts.trend) state.charts.trend.destroy();
    state.charts.trend = new Chart(trendChartCanvas, {
      type: 'bar',
      data: {
        labels: trend.dates,
        datasets: [{
          label: 'Spent',
          data: trend.values,
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  function updateAll() {
    renderSummary();
    renderTable();
    renderCharts();
    updateUrlShare();
  }

  // ================== Chart lazy loader ==================
  function loadChartJs() {
    return new Promise((resolve, reject) => {
      if (window.Chart) return resolve(window.Chart);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
      script.defer = true;
      script.onload = () => resolve(window.Chart);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // ================== Export helpers ==================
  function getReportTitle() {
    return 'Petty Cash Report - ' + new Date().toLocaleDateString();
  }

  function getExportData() {
    const { totalSpent, remaining, byCategory } = getTotals();
    const rows = [...state.expenses].sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => ({
      Date: e.date,
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
      Currency: state.currency
    }));
    rows.push({ Date: '', Description: 'TOTAL SPENT', Category: '', Amount: totalSpent, Currency: state.currency });
    rows.push({ Date: '', Description: 'STARTING BALANCE', Category: '', Amount: state.startingBalance, Currency: state.currency });
    rows.push({ Date: '', Description: 'REMAINING BALANCE', Category: '', Amount: remaining, Currency: state.currency });
    return { rows, totalSpent, remaining, byCategory };
  }

  function exportCSV(filename = 'petty-cash-report.csv') {
    const { rows } = getExportData();
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        const v = r[h];
        const cell = String(v ?? '');
        if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
          return '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function exportExcel() {
    // Generate a real Excel 2003 XML file (works in Excel, no external library)
    const { rows } = getExportData();
    const xmlRows = rows.map(r => `
      <Row>
        <Cell><Data ss:Type="String">${escapeXml(r.Date)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.Description)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.Category)}</Data></Cell>
        <Cell><Data ss:Type="Number">${r.Amount}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.Currency)}</Data></Cell>
      </Row>
    `).join('');

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Petty Cash">
    <Table>
      <Row>
        <Cell ss:StyleID="sHead"><Data ss:Type="String">Date</Data></Cell>
        <Cell ss:StyleID="sHead"><Data ss:Type="String">Description</Data></Cell>
        <Cell ss:StyleID="sHead"><Data ss:Type="String">Category</Data></Cell>
        <Cell ss:StyleID="sHead"><Data ss:Type="String">Amount</Data></Cell>
        <Cell ss:StyleID="sHead"><Data ss:Type="String">Currency</Data></Cell>
      </Row>
      ${xmlRows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'petty-cash-report.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    trackToolEvent('calculator_export_excel');
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function exportPDF() {
    // Use browser print to PDF for reliability; hide non-print elements
    trackToolEvent('calculator_export_pdf');
    window.print();
  }

  function copyResult() {
    const { totalSpent, remaining, topCategory } = getTotals();
    const lines = [
      'Petty Cash Summary',
      `Starting Balance: ${formatMoney(state.startingBalance)}`,
      `Total Spent: ${formatMoney(totalSpent)}`,
      `Remaining Balance: ${formatMoney(remaining)}`,
      `Transactions: ${state.expenses.length}`,
      `Top Category: ${topCategory}`,
      '',
      'Expenses:',
      ...state.expenses.map(e => `${e.date} | ${e.category} | ${e.description} | ${formatMoney(e.amount)}`)
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      showToast('Summary copied to clipboard');
      trackToolEvent('calculator_copy_result');
    }).catch(() => showToast('Copy failed'));
  }

  function shareLink() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Petty Cash Report', url }).catch(() => {});
      trackToolEvent('calculator_share');
    } else {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard');
        trackToolEvent('calculator_share');
      }).catch(() => showToast('Copy failed'));
    }
  }

  // ================== Event handlers ==================
  function onAddExpense(e) {
    e.preventDefault();
    const amount = parseFloat(expenseAmountEl.value);
    if (!amount || amount <= 0) {
      expenseAmountEl.focus();
      return;
    }
    const expense = {
      id: generateId(),
      date: expenseDateEl.value || todayStr(),
      description: expenseDescEl.value.trim() || '—',
      category: expenseCategoryEl.value,
      amount: amount
    };
    state.expenses.push(expense);
    expenseDescEl.value = '';
    expenseAmountEl.value = '';
    expenseDescEl.focus();
    updateAll();
    trackToolEvent('calculator_expense_added', { category: expense.category });
  }

  function onStartingBalanceChange() {
    state.startingBalance = parseFloat(startingBalanceEl.value) || 0;
    updateAll();
  }

  function onCurrencyChange() {
    state.currency = currencyEl.value;
    currencySymbolEl.textContent = CURRENCY_SYMBOLS[state.currency] || state.currency;
    updateAll();
  }

  function onReset() {
    if (!state.expenses.length && !state.startingBalance) return;
    if (confirm('Reset all data? This cannot be undone.')) {
      state.expenses = [];
      state.startingBalance = 0;
      startingBalanceEl.value = '';
      updateAll();
      trackToolEvent('calculator_reset');
    }
  }

  // ================== Dark mode ==================
  function applyTheme(dark) {
    if (dark) {
      document.documentElement.classList.add('dark');
      themeIcon.textContent = '☀️';
    } else {
      document.documentElement.classList.remove('dark');
      themeIcon.textContent = '🌙';
    }
    if (state.expenses.length) renderCharts();
  }

  function initTheme() {
    const saved = localStorage.getItem('pettycash-calculator-dark');
    if (saved !== null) {
      applyTheme(saved === 'true');
    } else {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('pettycash-calculator-dark') === null) applyTheme(e.matches);
    });
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(!isDark);
    localStorage.setItem('pettycash-calculator-dark', String(!isDark));
  }

  // ================== Init ==================
  async function init() {
    try {
      await loadChartJs();

      initTheme();

      // Set today's date as default
      expenseDateEl.value = todayStr();

      // Load state from URL
      const loaded = loadFromUrl();
      if (!loaded) {
        state.currency = 'SAR'; // Default for region
      }

      currencyEl.value = state.currency;
      currencySymbolEl.textContent = CURRENCY_SYMBOLS[state.currency] || state.currency;
      startingBalanceEl.value = state.startingBalance || '';

      // Bind events
      expenseForm.addEventListener('submit', onAddExpense);
      startingBalanceEl.addEventListener('input', onStartingBalanceChange);
      currencyEl.addEventListener('change', onCurrencyChange);
      $('export-pdf').addEventListener('click', exportPDF);
      $('export-excel').addEventListener('click', exportExcel);
      $('print-report').addEventListener('click', () => { trackToolEvent('calculator_print'); window.print(); });
      $('copy-result').addEventListener('click', copyResult);
      $('share-link').addEventListener('click', shareLink);
      $('reset-all').addEventListener('click', onReset);
      themeToggle.addEventListener('click', toggleTheme);
      $('cta-start-free').addEventListener('click', () => trackToolEvent('calculator_cta_click'));

      updateAll();
      trackToolEvent('calculator_loaded');
    } catch (err) {
      console.error('Calculator init error:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
