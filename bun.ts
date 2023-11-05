declare module "bun" {
    interface Env {
        API_TOKEN: string,
        API_URL: string,
        OPENAI_API_KEY: string
    }
}
