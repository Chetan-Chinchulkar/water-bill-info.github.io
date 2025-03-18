// Global variables
let currentLanguage = 'en';
let translations = {};
let dataTable = null;
let jsonData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Load translations first
    loadTranslations()
        .then(() => {
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
            return fetch('data.json');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store the data globally
            jsonData = data;
            
            // Initialize DataTable after data is loaded
            initializeDataTable(data);
            
            // Set up language switcher
            setupLanguageSwitcher();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            const tableBody = document.querySelector('#dataTable tbody');
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

// Load translations for both languages
async function loadTranslations() {
    try {
        const [enResponse, mrResponse] = await Promise.all([
            fetch('translations/en.json'),
            fetch('translations/mr.json')
        ]);
        
        if (!enResponse.ok || !mrResponse.ok) {
            throw new Error('Failed to load translations');
        }
        
        const enData = await enResponse.json();
        const mrData = await mrResponse.json();
        
        translations = {
            en: enData,
            mr: mrData
        };
        
        // Apply initial translations
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Apply translations to the page
function applyTranslations() {
    const t = translations[currentLanguage];
    
    // Update page title
    document.title = t.title;
    
    // Update main heading
    document.querySelector('h1').textContent = t.title;
    
    // Update card header
    document.querySelector('.card-header h5').textContent = t.subtitle;
    
    // Update footer text
    document.querySelector('.text-muted').textContent = t.footer;
    
    // Update table headers
    const headerCells = document.querySelectorAll('#dataTable thead tr:first-child th');
    if (headerCells.length > 0) {
        headerCells[0].textContent = t.columns.connectionNo;
        headerCells[1].textContent = t.columns.consumerName;
        headerCells[2].textContent = t.columns.ownerName;
        headerCells[3].textContent = t.columns.address;
        headerCells[4].textContent = t.columns.mobileNo;
        headerCells[5].textContent = t.columns.emailId;
        headerCells[6].textContent = t.columns.connectionNoOld;
        headerCells[7].textContent = t.columns.connectionId;
    }
    
    // Update language switcher text
    document.querySelector('#languageLabel').textContent = t.language + ': ';
}

// Set up language switcher
function setupLanguageSwitcher() {
    // Create language switcher container
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    
    // Create language label
    const languageLabel = document.createElement('span');
    languageLabel.id = 'languageLabel';
    languageLabel.textContent = translations[currentLanguage].language + ': ';
    
    // Create English button
    const englishButton = document.createElement('button');
    englishButton.className = 'btn btn-sm ' + (currentLanguage === 'en' ? 'btn-primary' : 'btn-outline-primary');
    englishButton.textContent = translations[currentLanguage].english;
    englishButton.onclick = () => switchLanguage('en');
    
    // Create Marathi button
    const marathiButton = document.createElement('button');
    marathiButton.className = 'btn btn-sm ' + (currentLanguage === 'mr' ? 'btn-primary' : 'btn-outline-primary');
    marathiButton.textContent = translations[currentLanguage].marathi;
    marathiButton.onclick = () => switchLanguage('mr');
    
    // Append elements to language switcher
    languageSwitcher.appendChild(languageLabel);
    languageSwitcher.appendChild(englishButton);
    languageSwitcher.appendChild(marathiButton);
    
    // Add language switcher to the page
    const cardHeader = document.querySelector('.card-header');
    cardHeader.appendChild(languageSwitcher);
}

// Switch language
function switchLanguage(lang) {
    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    
    // Update UI with new language
    applyTranslations();
    
    // Reinitialize DataTable with new language
    if (dataTable) {
        dataTable.destroy();
    }
    
    initializeDataTable(jsonData);
    
    // Update language switcher buttons
    const englishButton = document.querySelector('.language-switcher button:nth-child(2)');
    const marathiButton = document.querySelector('.language-switcher button:nth-child(3)');
    
    englishButton.className = 'btn btn-sm ' + (currentLanguage === 'en' ? 'btn-primary' : 'btn-outline-primary');
    marathiButton.className = 'btn btn-sm ' + (currentLanguage === 'mr' ? 'btn-primary' : 'btn-outline-primary');
}

function initializeDataTable(data) {
    // Get translations for current language
    const t = translations[currentLanguage];
    
    // Clear any existing table
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
    }

    // Initialize DataTable with the JSON data
    dataTable = $('#dataTable').DataTable({
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
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copy',
                text: t.buttons.copy
            },
            {
                extend: 'excel',
                text: t.buttons.excel
            },
            {
                extend: 'pdf',
                text: t.buttons.pdf
            },
            {
                extend: 'print',
                text: t.buttons.print
            }
        ],
        responsive: true,
        language: {
            search: t.table.search,
            lengthMenu: t.table.lengthMenu,
            info: t.table.info,
            infoEmpty: t.table.infoEmpty,
            infoFiltered: t.table.infoFiltered,
            zeroRecords: t.table.zeroRecords,
            paginate: {
                first: t.table.paginate.first,
                last: t.table.paginate.last,
                next: t.table.paginate.next,
                previous: t.table.paginate.previous
            }
        },
        initComplete: function() {
            // Add filter row
            this.api().columns().every(function() {
                const column = this;
                const header = $(column.header());
                const columnIndex = column.index();
                
                // Add header row for filters if it doesn't exist
                if ($('#dataTable thead tr.filters').length === 0) {
                    $('#dataTable thead').append('<tr class="filters"></tr>');
                }
                
                // Create filter cell
                const filterCell = $('<th></th>');
                $('#dataTable thead tr.filters').append(filterCell);
                
                // Add appropriate filter based on column
                if (columnIndex === 1) { // Consumer Name (Add dropdown)
                    const select = $('<select class="form-select form-select-sm"><option value="">' + t.filter.all + '</option></select>')
                        .appendTo(filterCell)
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });
                    
                    // Get unique values for consumer name
                    const consumerNames = new Set();
                    data.resultData.forEach(item => {
                        if (item.consumerName) {
                            consumerNames.add(item.consumerName);
                        }
                    });
                    
                    // Add options to select
                    Array.from(consumerNames).sort().forEach(name => {
                        select.append('<option value="' + name + '">' + name + '</option>');
                    });
                }
                else if (columnIndex === 2) { // Owner Name (dropdown)
                    const select = $('<select class="form-select form-select-sm"><option value="">' + t.filter.all + '</option></select>')
                        .appendTo(filterCell)
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });
                    
                    // Get unique values for owner name
                    const ownerNames = new Set();
                    data.resultData.forEach(item => {
                        if (item.ownerName) {
                            ownerNames.add(item.ownerName);
                        }
                    });
                    
                    // Add options to select
                    Array.from(ownerNames).sort().forEach(name => {
                        select.append('<option value="' + name + '">' + name + '</option>');
                    });
                }
                else if (columnIndex === 3) { // Address (dropdown)
                    const select = $('<select class="form-select form-select-sm"><option value="">' + t.filter.all + '</option></select>')
                        .appendTo(filterCell)
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });
                    
                    // Get unique values for address
                    const addresses = new Set();
                    data.resultData.forEach(item => {
                        if (item.address) {
                            addresses.add(item.address);
                        }
                    });
                    
                    // Add options to select
                    Array.from(addresses).sort().forEach(address => {
                        select.append('<option value="' + address + '">' + address + '</option>');
                    });
                }
                else { // Other columns (text input)
                    $('<input type="text" class="form-control form-control-sm" placeholder="' + t.search.placeholder.replace('{0}', header.text()) + '" />')
                        .appendTo(filterCell)
                        .on('click', function(e) {
                            e.stopPropagation();
                        })
                        .on('keyup change', function() {
                            column.search($(this).val()).draw();
                        });
                }
            });
        },
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        order: [[0, 'asc']], // Default sort by connection number
    });
    
    // Add custom search functionality for all columns
    $('#dataTable_filter input').unbind().bind('keyup', function() {
        dataTable.search(this.value).draw();
    });
}
