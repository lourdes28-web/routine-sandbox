import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.FATHOM_API_KEY;
if (!API_KEY) {
  process.stderr.write('Error: FATHOM_API_KEY environment variable is required\n');
  process.exit(1);
}

const BASE = 'https://api.fathom.ai/external/v1';
const HEADERS = { 'X-Api-Key': API_KEY, 'Content-Type': 'application/json' };

async function fathomFetch(path, params = {}) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), { headers: HEADERS });
  if (!res.ok) throw new Error(`Fathom API ${res.status}: ${await res.text()}`);
  return res.json();
}

const server = new Server(
  { name: 'fathom', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'fathom_list_meetings',
      description: 'List recent Fathom meeting recordings sorted by most recent first. Returns meeting IDs, titles, dates, attendees, and summaries.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max number of meetings to return (default 5)' },
          include_transcript: { type: 'boolean', description: 'Include full transcript in results (default false)' }
        }
      }
    },
    {
      name: 'fathom_get_meeting',
      description: 'Get full details for a specific meeting including transcript and summary.',
      inputSchema: {
        type: 'object',
        properties: {
          meeting_id: { type: 'string', description: 'The Fathom meeting ID' },
        },
        required: ['meeting_id']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'fathom_list_meetings') {
    const data = await fathomFetch('/meetings', {
      limit: args?.limit ?? 5,
      include_transcript: args?.include_transcript ?? false
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  if (name === 'fathom_get_meeting') {
    const data = await fathomFetch(`/meetings/${args.meeting_id}`, {
      include_transcript: true
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
