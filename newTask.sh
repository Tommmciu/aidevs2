#!/bin/bash

# Function to create files in the specified directory
create_files() {
    local directory=$1
    local task=$2

    local input_filename="$task""Input"
    touch "$directory/index.ts"
    touch "$directory/$input_filename"".ts"

    local first_letter=
    first_letter=$(echo "${task}" | cut -c1 | tr '[:lower:]' '[:upper:]')
    local task_cap="${first_letter}${task:1}"
    local input_class="$task_cap""Input"
    local index_content="import { execute } from \"../../task-provider\";
import { $input_class } from \"./$input_filename\"

const taskName=\"$task\"    
await execute(taskName, async (input: $input_class) => {
    throw Error('Not implemented')
},false)"

    local input_content="export type $task_cap""Input = {
    code: number,
    msg: string,
    hint: string
}"

    echo "$index_content" > "$directory/index.ts"
    echo "$input_content" > "$directory/$task""Input.ts"
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
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq before running this script."
    exit 1
fi
task=$1

if [[ -z $task ]]; then
echo "Please enter the directory:"
read task
fi
directory="tasks/$task"
# Check if the directory exists
if [ -d "$directory" ]; then
    echo "Directory exists."
    exit 1
else
    echo "Directory does not exist. Creating directory and files."
    mkdir -p "$directory"
    create_files "$directory" "$task"
    add_script_to_package_json "$task"
fi
