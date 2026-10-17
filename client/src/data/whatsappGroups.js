// Official WhatsApp group for each event, keyed by event slug (slugify(title)). These are the same invite links as the QR
// code printed at the end of each rule book (client/public/rulebooks). They are shown to people whose registration is
// VERIFIED, and on the event page itself for Unstop-only events (Gaming Nexus / Fun Arena).
const WHATSAPP_GROUPS = {
    'bgmi': 'https://chat.whatsapp.com/FSKPeK13944INHUdnRFkDt',
    'brainwave-bonanza': 'https://chat.whatsapp.com/KVjy3wj4GxcDulgJBqlOUh',
    'circuit-debugging': 'https://chat.whatsapp.com/Iad475OzTvqGqZiIx8rxCC',
    'circuit-designing': 'https://chat.whatsapp.com/LmJ42odB6AiK95eQKQTZcx',
    'codathon': 'https://chat.whatsapp.com/IAL8tz3PXqA5w2elNrrSyi',
    'dune-dominator': 'https://chat.whatsapp.com/JizHXdUmdNa0L6pxL5Rtsv',
    'edge-of-collapse': 'https://chat.whatsapp.com/CUd2a3JIzLVLbmGY7MqIFN',
    'electromind': 'https://chat.whatsapp.com/CUpVRm9PSjNJVFUU33t648',
    'energix': 'https://chat.whatsapp.com/C6uhjiWjEYrKAaS5mNQGje',
    'fifa-showdown': 'https://chat.whatsapp.com/FE37k0lRmTw1CGX2muJpdX',
    'hackathon': 'https://chat.whatsapp.com/I51npfQiQUt6ZBk9e7gyC7',
    'hydraulic-warzone': 'https://chat.whatsapp.com/G8VuP2oxPYTEongTTDpPrt',
    'line-follower': 'https://chat.whatsapp.com/ER6OmDiDzOx9FOUIMuawj7',
    'mobile-legends-bang-bang': 'https://chat.whatsapp.com/HzV7B0F5PPk61MFO7JlroW',
    'prompt-pixel': 'https://chat.whatsapp.com/LeE2reNJPuAJwsqw8OepA2',
    'real-cricket-24': 'https://chat.whatsapp.com/JwyvezRCpOt2tXX1PpY7PE',
    'robo-soccer': 'https://chat.whatsapp.com/ICFKGhhfE5IDpdysazXsYW',
    'sky-forge': 'https://chat.whatsapp.com/KnIU8n4owC47mqRr53uJ7W',
    'solid-siege': 'https://chat.whatsapp.com/BnEdVWIeMCy3LC5n314xJH',
    'tekken-showdown': 'https://chat.whatsapp.com/Ck5hMIIkWIb9gZtzFJkH9L',
    'the-seismic-arena': 'https://chat.whatsapp.com/JwPSHdL0urnDkaxl2FxBL5',
    'treasure-hunt': 'https://chat.whatsapp.com/E0pX0C2B5NgHNtq32W4XqZ',
    'verilog': 'https://chat.whatsapp.com/HVz6Jphe3uiK39G6jg1Zzu',
};

// Only a real WhatsApp invite link is ever returned, so a bad entry can never turn into some other kind of link.
const WHATSAPP_INVITE = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}$/;

export const whatsappGroupFor = (slug) => {
    const url = WHATSAPP_GROUPS[slug];
    return typeof url === 'string' && WHATSAPP_INVITE.test(url) ? url : '';
};
