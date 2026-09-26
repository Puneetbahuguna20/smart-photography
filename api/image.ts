import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

function loadLocalEnv() {
  if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^([A-Z_]+)=(.*)$/);
        if (match) {
          const key = match[1];
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      });
    }
  }
}

function getDriveClient() {
  loadLocalEnv();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive service account credentials are not configured in environment variables.');
  }

  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

function getQueryParam(req: VercelRequest | any, param: string): string | null {
  if (req.query && typeof req.query[param] === 'string') {
    return req.query[param] as string;
  }
  if (req.url) {
    const url = new URL(req.url, 'http://localhost');
    return url.searchParams.get(param);
  }
  return null;
}

function sendError(res: VercelResponse | any, status: number, error: string) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json({ error });
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error }));
}

export default async function handler(req: VercelRequest | any, res: VercelResponse | any) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  const id = getQueryParam(req, 'id');
  const size = getQueryParam(req, 'size'); // 'thumb' for optimized ~800px grid cards, default/null for full-res lightbox

  // Strict file ID validation prevents SSRF, traversal, or arbitrary URL access
  if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return sendError(res, 400, 'A valid Google Drive file ID is required.');
  }

  try {
    const drive = getDriveClient();

    // 1. Verify file exists, is not trashed, and is an image
    const metaRes = await drive.files.get({
      fileId: id,
      fields: 'id, name, mimeType, size, trashed, thumbnailLink',
    });

    if (metaRes.data.trashed) {
      return sendError(res, 404, 'Image not found or has been trashed.');
    }

    const mimeType = metaRes.data.mimeType || '';
    if (!mimeType.startsWith('image/')) {
      return sendError(res, 400, 'File is not a supported image.');
    }

    // 2. High-speed thumbnail delivery for gallery grid (optimized ~800px, ~100KB instead of ~7MB)
    if (size === 'thumb' && metaRes.data.thumbnailLink) {
      const thumbUrl = metaRes.data.thumbnailLink.replace(/=s\d+/, '=s800');
      const thumbRes = await fetch(thumbUrl);

      if (thumbRes.ok && thumbRes.body) {
        res.setHeader('Content-Type', thumbRes.headers.get('content-type') || 'image/jpeg');
        const length = thumbRes.headers.get('content-length');
        if (length) res.setHeader('Content-Length', length);

        // Aggressive caching: 7 days browser, 30 days CDN, stale-while-revalidate 1 day
        res.setHeader(
          'Cache-Control',
          'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400'
        );

        if (req.method === 'HEAD') {
          return res.end();
        }

        const buffer = await thumbRes.arrayBuffer();
        return res.end(Buffer.from(buffer));
      }
    }

    // 3. Full-resolution stream for Swiper Lightbox
    res.setHeader('Content-Type', mimeType);
    if (metaRes.data.size) {
      res.setHeader('Content-Length', metaRes.data.size);
    }
    // Cache full-resolution: 7 days browser, 30 days CDN
    res.setHeader(
      'Cache-Control',
      'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400'
    );

    if (req.method === 'HEAD') {
      return res.end();
    }

    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    (response.data as any).pipe(res);
  } catch (error: any) {
    if (error?.code === 404 || error?.status === 404) {
      return sendError(res, 404, 'Image not found in Google Drive.');
    }
    console.error('Image streaming error for ID', id, ':', error?.message || error);
    return sendError(res, 500, error?.message || 'Failed to retrieve image from Google Drive.');
  }
}
