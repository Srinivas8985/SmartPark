// ============================================================
// PARK SMART — Mock Database (Seeded Data)
// Used by api.js when no backend is available
// ============================================================

export const STORAGE_KEYS = {
  SLOTS: 'ps_slots',
  USERS: 'ps_users',
  BOOKINGS: 'ps_bookings',
  MESSAGES: 'ps_messages',
  REVIEWS: 'ps_reviews',
  CURRENT_USER: 'ps_user',
  TOKEN: 'token',
};

// ── Default Parking Slots ─────────────────────────────────
export const DEFAULT_SLOTS = [
  {
    _id: 'slot_1',
    name: 'Central Plaza Parking',
    description: 'Premium covered parking in the heart of the city. CCTV monitored, 24/7 security, EV charging available.',
    address: 'MG Road, Bengaluru, Karnataka 560001',
    coordinates: [77.5946, 12.9716],
    pricePerHour: 80,
    basePrice: 80,
    availability: { startTime: '06:00', endTime: '23:59' },
    owner: { _id: 'owner_1', name: 'Ravi Kumar', email: 'owner@demo.com', phone: '+91 98765 43210' },
    images: [],
    totalSpots: 20,
    availableSpots: 14,
    amenities: ['CCTV', 'Covered', 'EV Charging', '24/7 Security'],
    rating: 4.5,
    reviewCount: 23,
    bookingCount: 45,
    locked: false,
    lockExpiry: null,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: 'slot_2',
    name: 'Tech Park Bay Lots',
    description: 'Open-air parking adjacent to the IT corridor. Ideal for office goers with daily/monthly packages.',
    address: 'Whitefield, Bengaluru, Karnataka 560066',
    coordinates: [77.7480, 12.9698],
    pricePerHour: 50,
    basePrice: 50,
    availability: { startTime: '07:00', endTime: '21:00' },
    owner: { _id: 'owner_1', name: 'Ravi Kumar', email: 'owner@demo.com', phone: '+91 98765 43210' },
    images: [],
    totalSpots: 40,
    availableSpots: 22,
    amenities: ['CCTV', 'Open Air', 'Bike Friendly'],
    rating: 4.1,
    reviewCount: 17,
    bookingCount: 38,
    locked: false,
    lockExpiry: null,
    isActive: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    _id: 'slot_3',
    name: 'Airport Express Parking',
    description: 'Secure long-term parking near the airport. Shuttle service available every 30 minutes.',
    address: 'Kempegowda International Airport, Devanahalli 562300',
    coordinates: [77.7066, 13.1989],
    pricePerHour: 120,
    basePrice: 120,
    availability: { startTime: '00:00', endTime: '23:59' },
    owner: { _id: 'owner_2', name: 'Priya Sharma', email: 'priya@demo.com', phone: '+91 87654 32109' },
    images: [],
    totalSpots: 100,
    availableSpots: 67,
    amenities: ['CCTV', 'Covered', '24/7', 'Shuttle', 'Car Wash'],
    rating: 4.8,
    reviewCount: 56,
    bookingCount: 112,
    locked: false,
    lockExpiry: null,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    _id: 'slot_4',
    name: 'Koramangala Street Lot',
    description: 'Convenient neighbourhood parking in the Koramangala food and shopping district.',
    address: '5th Block, Koramangala, Bengaluru 560095',
    coordinates: [77.6245, 12.9352],
    pricePerHour: 40,
    basePrice: 40,
    availability: { startTime: '08:00', endTime: '22:00' },
    owner: { _id: 'owner_2', name: 'Priya Sharma', email: 'priya@demo.com', phone: '+91 87654 32109' },
    images: [],
    totalSpots: 15,
    availableSpots: 3,
    amenities: ['CCTV', 'Bike Friendly'],
    rating: 3.9,
    reviewCount: 11,
    bookingCount: 29,
    locked: false,
    lockExpiry: null,
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    _id: 'slot_5',
    name: 'Indiranagar Premium Vault',
    description: 'Fully automated multilevel parking in the heart of Indiranagar. App-controlled entry/exit.',
    address: '100 Feet Road, Indiranagar, Bengaluru 560038',
    coordinates: [77.6410, 12.9784],
    pricePerHour: 100,
    basePrice: 100,
    availability: { startTime: '06:00', endTime: '00:00' },
    owner: { _id: 'owner_1', name: 'Ravi Kumar', email: 'owner@demo.com', phone: '+91 98765 43210' },
    images: [],
    totalSpots: 60,
    availableSpots: 31,
    amenities: ['CCTV', 'Covered', 'EV Charging', 'Automated', '24/7'],
    rating: 4.7,
    reviewCount: 34,
    bookingCount: 88,
    locked: false,
    lockExpiry: null,
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

// ── Default Users ─────────────────────────────────────────
export const DEFAULT_USERS = [
  {
    _id: 'user_1',
    name: 'Demo Driver',
    email: 'driver@demo.com',
    password: 'demo123',
    phone: '+91 99999 00001',
    role: 'DRIVER',
    date: new Date(Date.now() - 90 * 86400000).toISOString(),
    avatar: null,
  },
  {
    _id: 'owner_1',
    name: 'Ravi Kumar',
    email: 'owner@demo.com',
    password: 'demo123',
    phone: '+91 98765 43210',
    role: 'OWNER',
    date: new Date(Date.now() - 60 * 86400000).toISOString(),
    avatar: null,
  },
  {
    _id: 'owner_2',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'demo123',
    phone: '+91 87654 32109',
    role: 'OWNER',
    date: new Date(Date.now() - 45 * 86400000).toISOString(),
    avatar: null,
  },
  {
    _id: 'admin_1',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    phone: '+91 00000 00000',
    role: 'ADMIN',
    date: new Date(Date.now() - 120 * 86400000).toISOString(),
    avatar: null,
  },
];

// ── Default Reviews ───────────────────────────────────────
export const DEFAULT_REVIEWS = [
  {
    _id: 'rev_1',
    slotId: 'slot_1',
    userId: 'user_1',
    userName: 'Demo Driver',
    rating: 5,
    comment: 'Excellent facility! Very clean and secure. Will definitely use again.',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: 'rev_2',
    slotId: 'slot_1',
    userId: 'user_guest1',
    userName: 'Arjun M.',
    rating: 4,
    comment: 'Good parking, EV charging worked perfectly. Slightly expensive but worth it.',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    _id: 'rev_3',
    slotId: 'slot_3',
    userId: 'user_guest2',
    userName: 'Sneha R.',
    rating: 5,
    comment: 'Best airport parking I have used. Shuttle was on time!',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

// ── Default Bookings ──────────────────────────────────────
export const DEFAULT_BOOKINGS = [
  {
    _id: 'booking_demo_1',
    slotId: 'slot_1',
    slot: DEFAULT_SLOTS[0],
    driver: { _id: 'user_1', name: 'Demo Driver', email: 'driver@demo.com' },
    driverId: 'user_1',
    startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    endTime: new Date(Date.now() - 2 * 86400000 + 7200000).toISOString(),
    totalAmount: 160,
    hours: 2,
    status: 'COMPLETED',
    invoiceNumber: 'INV-2026-001',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// ── Default Messages ──────────────────────────────────────
export const DEFAULT_MESSAGES = [
  {
    _id: 'msg_1',
    senderId: 'user_1',
    receiverId: 'owner_1',
    senderName: 'Demo Driver',
    message: 'Hi! Is the EV charging station working today?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    _id: 'msg_2',
    senderId: 'owner_1',
    receiverId: 'user_1',
    senderName: 'Ravi Kumar',
    message: 'Yes, all 4 EV chargers are operational. You can book slot A3 or A4.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
];

// ── Weekly Revenue Data (for Analytics) ──────────────────
export const WEEKLY_REVENUE = [
  { day: 'Mon', revenue: 1200, bookings: 8 },
  { day: 'Tue', revenue: 980, bookings: 6 },
  { day: 'Wed', revenue: 1560, bookings: 12 },
  { day: 'Thu', revenue: 2100, bookings: 15 },
  { day: 'Fri', revenue: 3200, bookings: 24 },
  { day: 'Sat', revenue: 4100, bookings: 31 },
  { day: 'Sun', revenue: 2800, bookings: 20 },
];

// ── Seed the localStorage DB ──────────────────────────────
export const seedDatabase = () => {
  const { SLOTS, USERS, BOOKINGS, MESSAGES, REVIEWS } = STORAGE_KEYS;
  if (!localStorage.getItem(SLOTS)) {
    localStorage.setItem(SLOTS, JSON.stringify(DEFAULT_SLOTS));
  }
  if (!localStorage.getItem(USERS)) {
    localStorage.setItem(USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(BOOKINGS)) {
    localStorage.setItem(BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem(MESSAGES)) {
    localStorage.setItem(MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
  }
  if (!localStorage.getItem(REVIEWS)) {
    localStorage.setItem(REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }
};
