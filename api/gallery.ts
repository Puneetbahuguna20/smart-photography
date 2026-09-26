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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sendJson(res: VercelResponse | any, status: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: VercelRequest | any, res: VercelResponse | any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  loadLocalEnv();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    return sendJson(res, 500, {
      success: false,
      error: 'GOOGLE_DRIVE_FOLDER_ID environment variable is not configured.',
    });
  }

  try {
    const drive = getDriveClient();

    // 1. Fetch direct child folders from "only website"
    const folderRes = await drive.files.list({
      q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      orderBy: 'name asc',
      pageSize: 100,
    });

    const categoryFolders = folderRes.data.files || [];

    // All collected photos across all categories for the "All" pool
    const allCollectedPhotos: {
      id: string;
      name: string;
      mimeType: string;
      categoryName: string;
      categorySlug: string;
      thumbnailUrl: string;
      url: string;
    }[] = [];

    // 2. Fetch images inside each category folder
    const categories = await Promise.all(
      categoryFolders.map(async (folder) => {
        if (!folder.id) return null;

        const photosRes = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'image/webp' or mimeType = 'image/gif')`,
          fields: 'files(id, name, mimeType)',
          pageSize: 1000,
        });

        const rawFiles = photosRes.data.files || [];
        const slug = slugify(folder.name || 'untitled');

        const folderPhotos = rawFiles.map((file) => ({
          id: file.id || '',
          name: file.name || '',
          mimeType: file.mimeType || 'image/jpeg',
          categoryName: folder.name || 'Untitled',
          categorySlug: slug,
          thumbnailUrl: `/api/image?id=${file.id}&size=thumb`,
          url: `/api/image?id=${file.id}&size=full`,
        }));

        // Pool into allCollectedPhotos for "All"
        allCollectedPhotos.push(...folderPhotos);

        // Server-side limit: maximum 45 random photos per category
        const selectedPhotos = shuffle(folderPhotos).slice(0, 45);

        return {
          id: folder.id,
          name: folder.name || 'Untitled',
          slug,
          totalAvailable: folderPhotos.length,
          photos: selectedPhotos,
        };
      })
    );

    const validCategories = categories.filter(
      (cat): cat is {
        id: string;
        name: string;
        slug: string;
        totalAvailable: number;
        photos: any[];
      } => cat !== null
    );

    // "All" pool: maximum 45 random photos TOTAL across the whole gallery
    const randomAllPhotos = shuffle(allCollectedPhotos).slice(0, 45);

    // Cache on CDN for 60 seconds, stale-while-revalidate for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return sendJson(res, 200, {
      success: true,
      categories: validCategories,
      allPhotos: randomAllPhotos,
    });
  } catch (error: any) {
    console.error('Gallery API error:', error?.message || error);
    return sendJson(res, 500, {
      success: false,
      error: error?.message || 'Failed to fetch gallery from Google Drive.',
    });
  }
}
