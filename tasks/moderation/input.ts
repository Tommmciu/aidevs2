
export type ModerationInput = string[]

export type GetInputResponse = {
    code: number,
    msg: string,
    input: ModerationInput
}
