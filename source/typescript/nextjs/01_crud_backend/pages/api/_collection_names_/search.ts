import { NextApiRequest, NextApiResponse } from 'next';
import { {{.Collection.Name}} } from '../../../models/tigris/{{.Collection.JSON}}';
import { SearchQuery } from '@tigrisdata/core';
import tigris from '../../../lib/tigris';
{{with .Collection}}
type Data = {
  result?: Array<{{.Name}}>;
  error?: string;
};

// GET /api/{{.JSON}}/search?q=searchQ -- searches for items matching text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query['q'];
  if (query === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    const searchRequest: SearchQuery<{{.Name}}> = { q: query as string };
    const searchResult = await coll.search(searchRequest);
    const docs = new Array<{{.Name}}>();
    for await (const result of searchResult.stream()) {
      docs.push(result);
    }
    res.status(200).json({ result: docs });
  } catch (err) {
    const error = err as Error;
    console.log('search: ' + error.message)
    res.status(500).json({ error: error.message });
  }
}
{{end}}