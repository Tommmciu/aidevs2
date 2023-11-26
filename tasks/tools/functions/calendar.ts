export const addEventSchema = {
    "name": "addEvent",
    "description": "Add event in calendar",
    "parameters": {
        "type": "object",
        "properties": {
            "event": {
                "type": "string",
                "description": "Name of event that has to be added in calendar"
            },
            "date": {
                "type": "string",
                "description": "Date of event on format YYYY-MM-DD"
            }
        },
        "required": ["task", "date"]
    }
}
