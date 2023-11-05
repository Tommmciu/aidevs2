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
    const json = await response.json<AuthResponse>();
    if (response.status !== 200)
        throw new Error(`Request failed. Got response code: ${response.status}. Message: ${json.msg}`)

    return json.token;
}

export async function getTaskInput<T>(token: string): Promise<(T)> {
    const url = `${baseUrl}/task/${token}`;
    const response = await fetch(url);
    return await response.json<T>()
}

export async function sendResult(token: string, answer: any): Promise<boolean> {

    const url = `${baseUrl}/answer/${token}`;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            answer: answer
        })
    })
    console.log(response.status === 200)
    return response.status === 200;
}


