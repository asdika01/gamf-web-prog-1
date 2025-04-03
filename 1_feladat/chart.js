document.addEventListener('DOMContentLoaded', () => {
    let myChart = null;

    // Táblázat inicializálása
    const initializeTable = () => {
        document.querySelectorAll('#dataTable tbody tr').forEach(row => {
            row.addEventListener('click', function() {
                document.querySelectorAll('#dataTable tbody tr').forEach(r =>
                    r.classList.remove('selected'));
                this.classList.add('selected');
                updateChart(this);
            });
        });
    };

    // Diagram frissítése
    const updateChart = (selectedRow) => {
        const data = Array.from(selectedRow.cells).map(cell =>
            parseInt(cell.textContent));

        const labels = ['Oszlop 1', 'Oszlop 2', 'Oszlop 3', 'Oszlop 4', 'Oszlop 5'];

        if (myChart) {
            myChart.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sor adatai',
                    data: data,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Kezdeti beállítások
    initializeTable();
    updateChart(document.querySelector('#dataTable tbody tr:first-child'));
});
