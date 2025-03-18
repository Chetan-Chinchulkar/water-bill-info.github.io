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
    const table = $('#dataTable').DataTable({
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
            // Create a row for filters in the thead
            const headerRow = $('<tr class="filters"></tr>').appendTo($('#dataTable thead'));
            
            // Add individual column search inputs and dropdowns
            this.api().columns().every(function(index) {
                const column = this;
                const title = $(column.header()).text();
                const cell = $('<th></th>').appendTo(headerRow);
                
                // Create input element for search (for all columns)
                const input = $('<input type="text" class="form-control form-control-sm" placeholder="Search ' + title + '" />')
                    .appendTo(cell)
                    .on('click', function(e) {
                        e.stopPropagation(); // Prevent sorting when clicking on the input
                    })
                    .on('keyup change', function() {
                        if (column.search() !== this.value) {
                            column
                                .search(this.value)
                                .draw();
                        }
                    });
                
                // Add dropdown filters for specific columns (Owner Name and Address)
                if (index === 2 || index === 3) { // Owner Name or Address column
                    const select = $('<select class="form-select form-select-sm mt-2"><option value="">All</option></select>')
                        .appendTo(cell)
                        .on('click', function(e) {
                            e.stopPropagation(); // Prevent sorting when clicking on the select
                        })
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                            
                            // Clear the text input when dropdown is used
                            $(this).closest('th').find('input').val('');
                        });
                    
                    // Populate dropdown with unique values
                    column.data().unique().sort().each(function(d) {
                        if (d && d.trim() !== '') {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        }
                    });
                }
            });
            
            // Display total number of records
            const totalRecords = data.totalRows;
            $('.card-header h5').append(` <span class="badge bg-secondary">${totalRecords.toLocaleString()} Records</span>`);
        }
    });
    
    // Add custom search functionality for all columns
    $('#dataTable_filter input').unbind().bind('keyup', function() {
        table.search(this.value).draw();
    });
}
