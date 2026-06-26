import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function federatedStatsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cwd = process.cwd();
    const statsPath = path.join(cwd, '.next/server/federated-stats.json');
    let stats: any = {};

    if (fs.existsSync(statsPath)) {
      stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const globalCSS: string[] = [];

    const stylesDir = path.join(cwd, 'public', 'styles');
    if (fs.existsSync(stylesDir)) {
      const files = fs.readdirSync(stylesDir);
      files.forEach(file => {
        if (file.endsWith('.css')) {
          globalCSS.push(`${baseUrl}/styles/${file}`);
        }
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      ...stats,
      globalCSS,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read federated stats' });
  }
}
