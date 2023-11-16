import { execute } from "../../task-provider";
import { SearchInput } from "./searchInput"
import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from 'uuid';
import { News } from "./news";
const COLLECTION_NAME = "search";
const taskName = "search"
const archive = "https://unknow.news/archiwum.json"

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

const loadData = async () => {
    const result = await qdrant.getCollections();
    const indexed = result.collections.find((collection) => collection.name === COLLECTION_NAME);
    console.log(result);
    // Create collection if not exists
    if (!indexed) {
        console.log(`Creationg collection: ${COLLECTION_NAME}`)
        await qdrant.createCollection(COLLECTION_NAME, { vectors: { size: 1536, distance: 'Cosine', on_disk: true } });
    }
    const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
    if (!collectionInfo.points_count) {
        console.log(`Filling collection: ${COLLECTION_NAME}`)

        // Read archive
        const response = await fetch(archive);

        const news = (await response.json<News[]>()).slice(0, 300);
        const documents = news.map((resource) => ({
            pageContent: {
                ...resource,
            },
            metadata: {
                source: COLLECTION_NAME,
                content: { ...resource },
                uuid: uuidv4(),
            },
        }));

        const points = await Promise.all(
            documents.map(async (document) => {
                const [embedding] = await embeddings.embedDocuments([document.pageContent.title]);
                return {
                    id: document.metadata.uuid,
                    payload: document.metadata,
                    vector: embedding,
                };
            })
        );

        // Index
        console.log(`Inserting collection: ${COLLECTION_NAME}`)

        await qdrant.upsert(COLLECTION_NAME, {
            wait: true,
            batch: {
                ids: points.map((point) => (point.id)),
                vectors: points.map((point) => (point.vector)),
                payloads: points.map((point) => (point.payload)),
            },
        })
    }
}

await loadData();

await execute(taskName, async (input: SearchInput) => {
    const queryEmbedding = await embeddings.embedQuery(input.question);
    const search = await qdrant.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit: 1,
        filter: {
            must: [
                {
                    key: 'source',
                    match: {
                        value: COLLECTION_NAME
                    }
                }
            ]
        }
    });
    const result = search[0].payload!.content as News
    console.log(result)
    return result.url
})
