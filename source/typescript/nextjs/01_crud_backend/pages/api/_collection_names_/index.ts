import type { NextApiRequest, NextApiResponse } from 'next';
import { {{.Collection.Name}} } from '../../../models/tigris/{{.Collection.JSON}}';
import tigris from '../../../lib/tigris';
{{with .Collection}}
type Response = {
  result?: Array<{{.Name}}>;
  error?: string;
};

// GET /api/{{.JSON}} -- gets documents from collection
// POST /api/{{.JSON}} { {{.Name}} } -- inserts a new document to the collection
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    const cursor = coll.findMany();
    const docs = await cursor.toArray();
    console.log(docs)
    res.status(200).json({ result: docs });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const doc = req.body as {{.Name}};
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    console.log(doc)
    const inserted = await coll.insertOne(doc);
    console.log(doc)
    res.status(200).json({ result: [inserted] });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
{{end}}