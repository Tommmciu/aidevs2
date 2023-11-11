import { execute } from "../../task-provider";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
const taskName = "embedding"

const model = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002"
});

await execute(taskName, async () => {

    const text = "Hawaiian pizza"
    const expectedEmbeddingsAmount = 1536;
    const embeddings = await model.embedQuery(text);

    if (embeddings.length !== expectedEmbeddingsAmount) {
        console.error("Embeddings", "Amount doesn't match expected")
        process.exit(1)
    }
    return embeddings
})
