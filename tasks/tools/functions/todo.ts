export const addToDoSchema = {
    "name": "addToDo",
    "description": "Add ToDo to list. Only availble when no date specified",
    "parameters": {
        "type": "object",
        "properties": {
            "task": {
                "type": "string",
                "description": "Task that has to be added to todo list"
            },
        },
        "required": ["task"]
    }
}
