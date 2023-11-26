const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function getDate(): string {
    const date = new Date();
    const dayOfWeek = daysOfWeek[date.getDay()]
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)

    return `${dayOfWeek}, ${year}-${month}-${day}`
}

export const today = (): string => `Today is: ${getDate()}`
