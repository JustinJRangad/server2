document.addEventListener('DOMContentLoaded', function() {
    // Example data (replace with actual data fetching logic)
    const fileData = [
        { fileName: 'file1.c', functionCoverage: '80%', statementCoverage: '75%', branchCoverage: '90%' },
        { fileName: 'file2.c', functionCoverage: '85%', statementCoverage: '80%', branchCoverage: '95%' }
        // Add more file data as needed
    ];

    const fileTable = document.getElementById('file-table').querySelector('tbody');

    fileData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><a href="function-details.html?file=${encodeURIComponent(entry.fileName)}" class="file-link">${entry.fileName}</a></td><td>${entry.functionCoverage}</td><td>${entry.statementCoverage}</td><td>${entry.branchCoverage}</td>`;
        fileTable.appendChild(row);
    });

    // Event listener for file link clicks
    fileTable.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('file-link')) {
            event.preventDefault();
            const fileName = target.textContent.trim();
            // Navigate to function details page with file name
            window.location.href = `function-details.html?file=${encodeURIComponent(fileName)}`;
        }
    });
});
