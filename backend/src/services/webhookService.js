const Webhook = require('../models/webhook');
const fetch = require('node-fetch');

async function triggerWebhooks(event, payload) {
  const webhooks = await Webhook.find({ event, enabled: true });
  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, ...payload })
      });
    } catch (err) {
      console.error(`Failed to trigger webhook (${webhook.url}):`, err.message);
    }
  }
}

module.exports = { triggerWebhooks }; 