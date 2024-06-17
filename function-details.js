document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    if (fileName) {
        document.getElementById('file-name').textContent = `File: ${fileName}`;

        // Fetch function details JSON based on fileName
        fetch(`/run_python_script?file=${encodeURIComponent(fileName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const functionTable = document.getElementById('function-table').querySelector('tbody');
                functionTable.innerHTML = ''; // Clear any existing rows

                if (data.error) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="4">${data.error}</td>`;
                    functionTable.appendChild(row);
                } else {
                    data.forEach(func => {
                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${func.functionName}</td><td>${func.statementCoverage}</td><td>${func.branchCoverage}</td><td>${func.conditionCoverage}</td>`;
                        functionTable.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching function details:', error);
                const functionTable = document.getElementById('function-table').querySelector('tbody');
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="4">Error fetching function details.</td>`;
                functionTable.appendChild(row);
            });
    } else {
        console.error('File name parameter is missing.');
    }
});
