import type { VercelRequest, VercelResponse } from '@vercel/node';

function sendJson(res: VercelResponse | any, status: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: VercelRequest | any, res: VercelResponse | any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore parse error
      }
    }

    console.log('New booking request received:', {
      name: body?.fullName,
      email: body?.email,
      phone: body?.phone,
      eventType: body?.eventType,
      date: body?.date,
      package: body?.package,
    });

    return sendJson(res, 201, {
      success: true,
      message: 'Booking submitted successfully!',
      booking: body,
    });
  } catch (error: any) {
    console.error('Booking submission error:', error?.message || error);
    return sendJson(res, 500, { success: false, error: 'Failed to submit booking' });
  }
}
