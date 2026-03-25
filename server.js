const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const RENTCAST_KEY = process.env.RENTCAST_API_KEY;

const SEARCHES = [
  { city: 'Boston',     state: 'MA' },
  { city: 'Cambridge',  state: 'MA' },
  { city: 'Somerville', state: 'MA' },
  { city: 'Brookline',  state: 'MA' },
  { city: 'Medford',    state: 'MA' },
  { city: 'Quincy',     state: 'MA' },
];

app.get('/listings', async (req, res) => {
  if (!RENTCAST_KEY) return res.status(500).json({ error: 'RENTCAST_API_KEY not set' });

  let all = [];
  for (const s of SEARCHES) {
    try {
      const url = `https://api.rentcast.io/v1/listings/rental/long-term?city=${encodeURIComponent(s.city)}&state=${s.state}&limit=20&status=Active`;
      const r = await fetch(url, { headers: { 'X-Api-Key': RENTCAST_KEY } });
      const data = await r.json();
      const items = Array.isArray(data) ? data : (data.listings || data.data || []);
      all = all.concat(items);
    } catch (e) {
      console.error(`Error fetching ${s.city}:`, e.message);
    }
  }

  res.json(all);
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
