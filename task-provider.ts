import { AuthResponse } from "./types/authResponse";
import { GetInputResponse } from "./types/getInputResponse";
import { TaskInfo } from "./types/taskInfo";
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

export async function getTaskInput<T>(token: string): Promise<(TaskInfo<T>)> {
    const url = `${baseUrl}/task/${token}`;
    const response = await fetch(url);
    const data = await response.json<GetInputResponse<T>>();
    return {
        Input: data.input,
        Description: data.msg
    }
}

export async function sendResult(token: string, answer: any): Promise<boolean> {

    const url = `${baseUrl}/answer/${token}`;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            answer: answer
        })
    })
    return response.status === 200;
}

export async function execute<T>(task: string, calculateResult: (arg: T) => any) {
    console.log(`Executing task: ${task}`)
    const token = await authorize(task);
    const { Input: input, Description: description } = await getTaskInput<T>(token);
    console.log("Description", description)
    console.log("Input", input)

    const result = await calculateResult(input);

    const success = await sendResult(token, result);
    console.log(`Status for task ${task}:`, success ? "COMPLETED" : "ERROR")


}
