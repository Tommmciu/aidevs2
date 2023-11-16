import { AuthResponse } from "./types/authResponse";
const apiKey = Bun.env.API_TOKEN;
const baseUrl = Bun.env.API_URL;
export async function authorize(task: string): Promise<string> {
    const url = `${baseUrl}/token/${task}`
    const response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify({
                apikey: apiKey
            }),
        })
    const json = await response.json() as AuthResponse;
    if (response.status !== 200)
        throw new Error(`Request failed. Got response code: ${response.status}. Message: ${json.msg}`)

    return json.token;
}

export async function getTaskInput<T>(token: string,): Promise<T> {
    const url = `${baseUrl}/task/${token}`;
    const response = await fetch(url);
    const text = await response.json();
    console.log(text);
    const data = text as T;
    return data
}
export async function postTaskInput<T>(token: string, data: FormData): Promise<T> {
    const url = `${baseUrl}/task/${token}`;
    const response = await fetch(url, {
        method: "post",
        body: data
    });
    const text = await response.json();
    console.log(text);
    const responseData = text as T;
    return responseData
}

export async function sendResult(token: string, answer: any): Promise<boolean> {

    const url = `${baseUrl}/answer/${token}`;

    const json = JSON.stringify({
        answer: answer
    })
    console.info("Sending:", json)
    const response = await fetch(url, {
        method: 'POST',
        body: json
    })

    console.log(response.status)
    console.log("TASK RESULT:", await response.json())
    return response.status === 200;
}

export async function execute<T>(task: string, calculateResult: (arg: T) => any) {
    console.log(`Executing task: ${task}`)
    const token = await authorize(task);

    const data = await getTaskInput<T>(token);

    const result = await calculateResult(data);

    console.log("result", result)
    const success = await sendResult(token, result);
    console.log(`Status for task ${task}:`, success ? "COMPLETED" : "ERROR")
}
