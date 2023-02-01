import { NextApiRequest, NextApiResponse } from 'next';
import { {{.Collection.Name}} } from '../../../models/tigris/{{.Collection.JSON}}';
import tigris from '../../../lib/tigris';
{{- if ne (len .Collection.PrimaryKey) 1}}
import { LogicalOperator } from "@tigrisdata/core";
{{- end}}
{{with .Collection}}
type Data = {
  result?: {{.Name}};
  error?: string;
};

// GET /api/{{.JSONSingular}}/[id] -- gets document from collection where id = [id]
// PUT /api/{{.JSONSingular}}/[id] { {{.Name}} } -- updates the document in collection where id = [id]
// DELETE /api/{{.JSONSingular}}/[id] -- deletes the document in collection where id = [id]
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'PUT':
      await handlePut(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    const doc = await coll.findOne({ filter: {
    {{- $n := .Name -}}
    {{- if eq (len .PrimaryKey) 1}}
    {{- range .PrimaryKey}}
      {{.}}: req.query.{{.}} as {{$n}}["{{.}}"]
    {{- end}}
    {{- else}}
      op: LogicalOperator.AND,
        selectorFilters: [
      {{- range .PrimaryKey}}
          { {{.}}: req.query.{{.}} as {{$n}}["{{.}}"] },
    {{- end}}
        ]
    {{- end}}
    }});
    if (!doc) {
      res.status(404).json({ error: 'Not found' });
    } else {
      console.log('get: ' + req.query)
      res.status(200).json({ result: doc });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const doc = req.body as {{.Name}};
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    const updated = await coll.insertOrReplaceOne(doc);
    console.log('updated: ' + doc)
    res.status(200).json({ result: updated });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const coll = tigris.getCollection<{{.Name}}>("{{.JSON}}");
    const status = (await coll.deleteOne({ filter: {
    {{- $n := .Name -}}
    {{- if eq (len .PrimaryKey) 1}}
    {{- range .PrimaryKey}}
      {{.}}: req.query.{{.}} as {{$n}}["{{.}}"]
    {{- end}}
    {{- else}}
      op: LogicalOperator.AND,
        selectorFilters: [
      {{- range .PrimaryKey}}
          { {{.}}: req.query.{{.}} as {{$n}}["{{.}}"] },
      {{- end}}
        ]
    {{- end}}
    }})).status;
    if (status === 'deleted') {
      console.log('deleted:' + req.query)
      res.status(200).json({});
    } else {
      res.status(500).json({ error: `Failed to delete ${req.query.id}` });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
{{end}}