// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/contact.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// Contact us: the centre's address, hours, phone, email, map links and photo (ContactUs.jsx).

export const QUERY = 'Vajiram+%26+Ravi,+1-B%2F7+Pusa+Road,+Old+Rajinder+Nagar,+New+Delhi+110060';

export const CENTRE = {
  name: 'Vajiram & Ravi, New Delhi',
  address: '1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi 110060',
  near: ['Next to Gate 5 of Karol Bagh Metro Station,', 'near pillar 103'],
  hours: 'Mon – Sat, 9 am – 7 pm',
  phone: { label: '080-6220-6330', href: 'tel:+918062206330' },
  email: 'admissions@vajiramandravi.com',
  maps: `https://www.google.com/maps/search/?api=1&query=${QUERY}`,
  embed: `https://www.google.com/maps?q=${QUERY}&z=16&output=embed`,
};

export const PHOTO = { src: '/assets/img/photos/campus-building.webp', w: 800, h: 400 };
