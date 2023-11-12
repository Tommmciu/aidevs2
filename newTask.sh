#!/bin/bash

# Function to create files in the specified directory
create_files() {
    local directory=$1
    touch "$directory/index.ts"
}

add_script_to_package_json() {
    local package_json="package.json"
    local task=$1
    local script_command="bun run tasks/$1/index.ts"

    # Check if package.json exists
    if [ -f "$package_json" ]; then
        # Add or update the script entry in the "scripts" section
        jq --arg script_name "$task" \
           --arg script_command "$script_command" \
           '.scripts[$script_name] = $script_command' \
           "$package_json" > "$package_json.tmp"
        mv "$package_json.tmp" "$package_json"
        echo "Updated $package_json with a new script: $task."
    else
        echo "Error: $package_json not found."
    fi
}

# Main script
echo "Please enter the directory:"
read task

directory="tasks/$task"
# Check if the directory exists
if [ -d "$directory" ]; then
    echo "Directory exists."
    exit 1
else
    echo "Directory does not exist. Creating directory and files."
    mkdir -p "$directory"
    create_files "$directory"
    add_script_to_package_json "$task"
fi
