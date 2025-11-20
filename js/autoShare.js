/* autoShare.js - client stub showing how to call a webhook on publish
   In production you should trigger this from Sanity server-side webhook or Studio on publish.
   This file demonstrates the payload you'd send to Zapier/Make/etc.
*/

async function fireAutoShareWebhook({title, excerpt, url, image}) {
  const webhook = '/api/webhook-share'; // serverless endpoint that forwards to Zapier or directly posts
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title, excerpt, url, image})
    });
    return res.ok;
  } catch (err) {
    console.error('Auto share failed', err);
    return false;
  }
}
