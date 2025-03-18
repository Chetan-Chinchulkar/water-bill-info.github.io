#!/bin/bash

# This script helps initialize a GitHub repository for this project
# and prepares it for GitHub Pages deployment

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Maharashtra Water Bill Data Viewer - GitHub Setup${NC}"
echo "This script will help you set up a GitHub repository for this project."
echo ""

# Ask for GitHub username
read -p "Enter your GitHub username: " github_username
echo ""

# Ask for name
read -p "Enter your name or organization name: " user_name
echo ""

# Update the index.html file with the GitHub username and name
echo -e "${YELLOW}Updating index.html with your information...${NC}"
sed -i '' "s/YOUR_USERNAME/$github_username/g" index.html
sed -i '' "s/YOUR_NAME/$user_name/g" index.html

# Update the README.md file with the GitHub username
echo -e "${YELLOW}Updating README.md with your information...${NC}"
sed -i '' "s/YOUR_USERNAME/$github_username/g" README.md

echo -e "${GREEN}Files updated successfully!${NC}"
echo ""

# Ask if the user wants to initialize a Git repository
read -p "Do you want to initialize a Git repository? (y/n): " init_git
if [ "$init_git" = "y" ] || [ "$init_git" = "Y" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit"
    
    echo -e "${GREEN}Git repository initialized!${NC}"
    echo ""
    
    # Ask if the user wants to create a GitHub repository
    read -p "Do you want to create a GitHub repository? (y/n): " create_repo
    if [ "$create_repo" = "y" ] || [ "$create_repo" = "Y" ]; then
        echo -e "${YELLOW}Creating GitHub repository...${NC}"
        echo "Please visit: https://github.com/new"
        echo "Repository name: Maharashtra_Water_Bill"
        echo "Description: Maharashtra Water Bill Data Viewer"
        echo "Make it Public"
        echo "Do NOT initialize with README, .gitignore, or license"
        echo ""
        read -p "Press Enter when you've created the repository..."
        
        echo -e "${YELLOW}Pushing to GitHub...${NC}"
        git remote add origin "https://github.com/$github_username/Maharashtra_Water_Bill.git"
        git branch -M main
        git push -u origin main
        
        echo -e "${GREEN}Repository pushed to GitHub!${NC}"
        echo ""
        
        echo -e "${YELLOW}Setting up GitHub Pages...${NC}"
        echo "Please visit: https://github.com/$github_username/Maharashtra_Water_Bill/settings/pages"
        echo "Set Source to: 'Deploy from a branch'"
        echo "Branch: main"
        echo "Folder: / (root)"
        echo "Click Save"
        echo ""
        echo -e "${GREEN}Your site will be available at: https://$github_username.github.io/Maharashtra_Water_Bill/${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo "Thank you for using the Maharashtra Water Bill Data Viewer."
