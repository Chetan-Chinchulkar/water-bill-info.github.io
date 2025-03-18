document.addEventListener('DOMContentLoaded', function() {
    // Show loading spinner
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </td>
        </tr>
    `;

    // Fetch the JSON data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Initialize DataTable after data is loaded
            initializeDataTable(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <div class="my-5">
                            <h5>Error loading data</h5>
                            <p>${error.message}</p>
                        </div>
                    </td>
                </tr>
            `;
        });
});

function initializeDataTable(data) {
    // Clear any existing table
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
    }

    // Initialize DataTable with the JSON data
    $('#dataTable').DataTable({
        data: data.resultData,
        columns: [
            { data: 'connectionNo' },
            { data: 'consumerName' },
            { data: 'ownerName' },
            { data: 'address' },
            { data: 'mobileNo', render: function(data) {
                return data || 'N/A';
            }},
            { data: 'emailId', render: function(data) {
                return data || 'N/A';
            }},
            { data: 'connectionNoOld' },
            { data: 'connectionId' }
        ],
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'excel', 'pdf', 'print'
        ],
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoEmpty: "Showing 0 to 0 of 0 entries",
            infoFiltered: "(filtered from _MAX_ total entries)",
            zeroRecords: "No matching records found",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        },
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        order: [[0, 'asc']], // Default sort by connection number
        initComplete: function() {
            // Add individual column search boxes
            this.api().columns().every(function() {
                const column = this;
                const columnIndex = column.index();
                const title = $(column.header()).text();
                
                // Create input element for search
                const input = $('<input type="text" class="form-control form-control-sm" placeholder="Search ' + title + '" />')
                    .appendTo($(column.header()))
                    .on('keyup change', function() {
                        column
                            .search(this.value)
                            .draw();
                    });
            });
            
            // Display total number of records
            const totalRecords = data.totalRows;
            $('.card-header h5').append(` <span class="badge bg-secondary">${totalRecords.toLocaleString()} Records</span>`);
        }
    });
}
