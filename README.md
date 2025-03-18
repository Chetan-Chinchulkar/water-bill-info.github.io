# Maharashtra Water Bill Data Viewer

This is a web application for viewing and interacting with Maharashtra Water Bill data. The application displays the data in a table format with search, filter, sort, and export functionality.

## Features

- **Interactive Data Table**: View all water connection records in a responsive table
- **Search**: Quickly search across all fields in the data
- **Filter**: Filter data by specific columns (Owner Name, Address)
- **Sort**: Sort data by clicking on column headers
- **Export**: Export data in various formats (Copy, Excel, PDF, Print)
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

1. Make sure you have Node.js installed on your system
2. Navigate to the project directory in your terminal
3. Run the server:
   ```
   node server.js
   ```
4. Open your browser and go to: http://localhost:3000

## Files in this Project

- `index.html` - The main HTML file that displays the data table
- `styles.css` - CSS styles for the application
- `script.js` - JavaScript code to load and display the data
- `server.js` - A simple Node.js server to serve the files
- `data.json` - The JSON data file containing water bill records
- `404.html` - Custom 404 error page

## Technologies Used

- HTML5, CSS3, JavaScript
- jQuery
- DataTables.js - For table functionality
- Bootstrap 5 - For responsive design
- Node.js - For the server

## GitHub Pages Setup

To deploy this project to GitHub Pages, follow these steps:

1. Fork or clone this repository
2. Update the GitHub links in index.html:
   - Change `YOUR_USERNAME` to your actual GitHub username
   - Change `YOUR_NAME` to your name or organization name
3. Commit and push your changes to GitHub
4. Go to your repository settings on GitHub
5. Navigate to the "Pages" section
6. Set the source to the main branch
7. Click "Save"
8. Your site will be published at `https://YOUR_USERNAME.github.io/Maharashtra_Water_Bill/`

## Data Structure

The data contains water connection information with the following fields:
- Connection Number
- Consumer Name
- Owner Name
- Address
- Mobile Number
- Email ID
- Old Connection Number
- Connection ID
