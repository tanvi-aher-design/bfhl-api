export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, err: 'Use POST only' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({ ok: false, err: 'Body must be { "data": [...] }' });
    }

    const arr = body.data.map(x => (typeof x === 'string' ? x : String(x)));

    const evens = [];
    const odds = [];
    const words = [];
    const symbols = [];

    let total = 0n;
    const chars = [];

    for (const item of arr) {
      const numOnly = /^[0-9]+$/.test(item);
      const alphaOnly = /^[A-Za-z]+$/.test(item);
      const symOnly = /^[^A-Za-z0-9]+$/.test(item);

      const found = item.match(/[A-Za-z]/g);
      if (found) chars.push(...found);

      if (numOnly) {
        const n = BigInt(item);
        if (n % 2n === 0n) evens.push(item);
        else odds.push(item);
        total += n;
      } else if (alphaOnly) {
        words.push(item.toUpperCase());
      } else if (symOnly) {
        symbols.push(item);
      } else {
        symbols.push(item);
      }
    }

    chars.reverse();
    let mixed = '';
    for (let i = 0; i < chars.length; i++) {
      mixed += (i % 2 === 0) ? chars[i].toUpperCase() : chars[i].toLowerCase();
    }

    const uname = (process.env.FULL_NAME || 'john_doe').toLowerCase().replace(/\s+/g, '_');
    const dob = process.env.DOB_DDMMYYYY || '17091999';
    const mail = process.env.EMAIL || 'john@xyz.com';
    const roll = process.env.ROLL_NUMBER || 'ABCD123';

    return res.status(200).json({
      ok: true,
      user_id: `${uname}_${dob}`,
      email: mail,
      roll_no: roll,
      odds,
      evens,
      words,
      symbols,
      total: total.toString(),
      mixed
    });
  } catch {
    return res.status(400).json({ ok: false, err: 'Invalid JSON' });
  }
}
