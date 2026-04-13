// ============================================================
// PARK SMART — API Service (Dual-Mode)
// 
// When VITE_API_URL is set → real Axios calls to backend
// Otherwise → localStorage mock with simulated async delay
// ============================================================

import axios from 'axios';
import { STORAGE_KEYS, seedDatabase } from './mockData';

// ── Initialise seed data ──────────────────────────────────
seedDatabase();

const USE_BACKEND = !!import.meta.env.VITE_API_URL;

// ── Real Axios Instance (backend mode) ───────────────────
// Automatically fix the Vercel VITE_API_URL so the user doesn't have to manually update their Vercel settings
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (baseURL === 'https://smartpark-91ct.onrender.com' || baseURL === 'https://smartpark-91ct.onrender.com/') {
    baseURL = 'https://smartpark-91ct.onrender.com/api';
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// ── Helpers ────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const getLS = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Smart Pricing Engine (Feature #1) ─────────────────────
export const calculateSmartPrice = (basePrice, hour = new Date().getHours(), bookingCount = 0) => {
  let multiplier = 1.0;

  // Peak hours boost
  if (hour >= 8 && hour <= 10) multiplier += 0.3;   // Morning rush
  if (hour >= 17 && hour <= 21) multiplier += 0.5;  // Evening peak
  if (hour >= 12 && hour <= 14) multiplier += 0.2;  // Lunch rush
  if (hour >= 0 && hour <= 5) multiplier -= 0.3;    // Late night discount

  // Demand score based on bookings (0–1 scale)
  const demandScore = Math.min(bookingCount / 50, 1);
  multiplier += demandScore * 0.2;

  return Math.round(basePrice * multiplier);
};

export const getPricingLabel = (hour = new Date().getHours()) => {
  if (hour >= 8 && hour <= 10) return { label: 'Morning Rush', color: 'text-orange-500' };
  if (hour >= 17 && hour <= 21) return { label: '🔥 Peak Hour', color: 'text-red-500' };
  if (hour >= 12 && hour <= 14) return { label: 'Busy Lunch', color: 'text-yellow-500' };
  if (hour >= 0 && hour <= 5) return { label: 'Night Deal 🌙', color: 'text-blue-400' };
  return { label: 'Normal', color: 'text-green-500' };
};

// ── Distance Calculation (Feature #2) ─────────────────────
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
};

// ── Slot Lock Engine (Feature #3) ─────────────────────────
const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const lockSlot = (slotId) => {
  const slots = getLS(STORAGE_KEYS.SLOTS);
  const slot = slots.find((s) => s._id === slotId);
  if (!slot) throw new Error('Slot not found');

  // Check if already locked by someone else
  if (slot.locked && slot.lockExpiry && Date.now() < slot.lockExpiry) {
    throw new Error('Slot is temporarily reserved by another user. Please try again in a few minutes.');
  }

  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  slot.locked = true;
  slot.lockExpiry = Date.now() + LOCK_DURATION_MS;
  slot.lockedBy = currentUser?._id || 'unknown';
  setLS(STORAGE_KEYS.SLOTS, slots);
  return slot;
};

const unlockSlot = (slotId) => {
  const slots = getLS(STORAGE_KEYS.SLOTS);
  const slot = slots.find((s) => s._id === slotId);
  if (slot) {
    slot.locked = false;
    slot.lockExpiry = null;
    slot.lockedBy = null;
    setLS(STORAGE_KEYS.SLOTS, slots);
  }
};

// Auto-expire locks
const expireOldLocks = () => {
  const slots = getLS(STORAGE_KEYS.SLOTS);
  let changed = false;
  slots.forEach((s) => {
    if (s.locked && s.lockExpiry && Date.now() > s.lockExpiry) {
      s.locked = false;
      s.lockExpiry = null;
      s.lockedBy = null;
      changed = true;
    }
  });
  if (changed) setLS(STORAGE_KEYS.SLOTS, slots);
};

// ── Mock API Router ────────────────────────────────────────
const mockHandlers = {
  // ── AUTH ──────────────────────────────────────────────
  'POST /auth/login': async ({ email, password }) => {
    await delay();
    const users = getLS(STORAGE_KEYS.USERS);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...safeUser } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, `mock_token_${user._id}`);
    return { user: safeUser, token: `mock_token_${user._id}` };
  },

  'POST /auth/register': async ({ name, email, password, phone, role }) => {
    await delay();
    const users = getLS(STORAGE_KEYS.USERS);
    if (users.find((u) => u.email === email)) throw new Error('User already exists');
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'DRIVER',
      date: new Date().toISOString(),
      avatar: null,
    };
    users.push(newUser);
    setLS(STORAGE_KEYS.USERS, users);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, `mock_token_${newUser._id}`);
    return { user: safeUser, token: `mock_token_${newUser._id}` };
  },

  // ── SLOTS ─────────────────────────────────────────────
  'GET /slots': async () => {
    await delay(600);
    expireOldLocks();
    const slots = getLS(STORAGE_KEYS.SLOTS).filter((s) => s.isActive);
    const hour = new Date().getHours();
    return slots.map((s) => ({
      ...s,
      smartPrice: calculateSmartPrice(s.basePrice, hour, s.bookingCount),
      pricingInfo: getPricingLabel(hour),
    }));
  },

  'GET /slots/:id': async ({ id }) => {
    await delay();
    expireOldLocks();
    const slots = getLS(STORAGE_KEYS.SLOTS);
    const slot = slots.find((s) => s._id === id);
    if (!slot) throw new Error('Slot not found');
    const hour = new Date().getHours();
    return { ...slot, smartPrice: calculateSmartPrice(slot.basePrice, hour, slot.bookingCount) };
  },

  'POST /slots': async (body) => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user || user.role !== 'OWNER') throw new Error('Unauthorized');
    const newSlot = {
      _id: `slot_${Date.now()}`,
      ...body,
      basePrice: parseFloat(body.pricePerHour),
      owner: { _id: user._id, name: user.name, email: user.email },
      images: [],
      totalSpots: parseInt(body.totalSpots) || 10,
      availableSpots: parseInt(body.totalSpots) || 10,
      rating: 0,
      reviewCount: 0,
      bookingCount: 0,
      locked: false,
      lockExpiry: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      coordinates: body.coordinates || [77.5946, 12.9716],
    };
    const slots = getLS(STORAGE_KEYS.SLOTS);
    slots.push(newSlot);
    setLS(STORAGE_KEYS.SLOTS, slots);
    return newSlot;
  },

  'GET /slots/smart-price': async () => {
    await delay();
    const hour = new Date().getHours();
    const basePrice = 60;
    const bookings = getLS(STORAGE_KEYS.BOOKINGS).length;
    const suggested = calculateSmartPrice(basePrice, hour, bookings);
    return { suggestedPrice: suggested, demandLevel: bookings > 20 ? 'HIGH' : bookings > 10 ? 'MEDIUM' : 'LOW' };
  },

  'DELETE /slots/:id': async ({ id }) => {
    await delay();
    const slots = getLS(STORAGE_KEYS.SLOTS);
    const updated = slots.filter((s) => s._id !== id);
    setLS(STORAGE_KEYS.SLOTS, updated);
    return { message: 'Slot deleted' };
  },

  // ── BOOKINGS ──────────────────────────────────────────
  'POST /bookings': async (body) => {
    await delay(800);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) throw new Error('Not authenticated');

    // Lock the slot (Feature #3)
    const lockedSlot = lockSlot(body.slotId);
    const slots = getLS(STORAGE_KEYS.SLOTS);
    const slot = slots.find((s) => s._id === body.slotId);

    const start = new Date(body.startTime);
    const end = new Date(body.endTime);
    const hours = Math.max(1, Math.round((end - start) / 3600000));
    const smartPrice = calculateSmartPrice(slot.basePrice, start.getHours(), slot.bookingCount);
    const totalAmount = body.totalAmount || smartPrice * hours;

    const invoiceNum = `INV-${new Date().getFullYear()}-${String(getLS(STORAGE_KEYS.BOOKINGS).length + 1).padStart(3, '0')}`;

    const newBooking = {
      _id: `booking_${Date.now()}`,
      slotId: body.slotId,
      slot: { ...slot },
      driver: { _id: user._id, name: user.name, email: user.email },
      driverId: user._id,
      startTime: body.startTime,
      endTime: body.endTime,
      hours,
      totalAmount,
      status: 'PENDING',
      invoiceNumber: invoiceNum,
      createdAt: new Date().toISOString(),
    };

    const bookings = getLS(STORAGE_KEYS.BOOKINGS);
    bookings.push(newBooking);
    setLS(STORAGE_KEYS.BOOKINGS, bookings);

    // Increment slot bookingCount
    slot.bookingCount = (slot.bookingCount || 0) + 1;
    if (slot.availableSpots > 0) slot.availableSpots--;
    setLS(STORAGE_KEYS.SLOTS, slots);

    // Auto-unlock after booking created
    unlockSlot(body.slotId);

    return newBooking;
  },

  'GET /bookings/my-bookings': async () => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) return [];
    const bookings = getLS(STORAGE_KEYS.BOOKINGS);
    return bookings.filter((b) => b.driverId === user._id).reverse();
  },

  'GET /bookings/owner-bookings': async () => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user || user.role !== 'OWNER') return [];
    const bookings = getLS(STORAGE_KEYS.BOOKINGS);
    return bookings.filter((b) => b.slot?.owner?._id === user._id).reverse();
  },

  'PUT /bookings/:id': async ({ id }, body) => {
    await delay();
    const bookings = getLS(STORAGE_KEYS.BOOKINGS);
    const booking = bookings.find((b) => b._id === id);
    if (!booking) throw new Error('Booking not found');
    Object.assign(booking, body);
    setLS(STORAGE_KEYS.BOOKINGS, bookings);
    return booking;
  },

  'PUT /bookings/:id/cancel': async ({ id }) => {
    await delay();
    const bookings = getLS(STORAGE_KEYS.BOOKINGS);
    const booking = bookings.find((b) => b._id === id);
    if (!booking) throw new Error('Not found');
    booking.status = 'CANCELLED';
    setLS(STORAGE_KEYS.BOOKINGS, bookings);

    // Restore slot availability
    const slots = getLS(STORAGE_KEYS.SLOTS);
    const slot = slots.find((s) => s._id === booking.slotId);
    if (slot && slot.availableSpots < slot.totalSpots) slot.availableSpots++;
    setLS(STORAGE_KEYS.SLOTS, slots);

    return booking;
  },

  // ── REVIEWS ───────────────────────────────────────────
  'GET /reviews/:slotId': async ({ slotId }) => {
    await delay();
    const reviews = getLS(STORAGE_KEYS.REVIEWS);
    return reviews.filter((r) => r.slotId === slotId).reverse();
  },

  'POST /reviews': async (body) => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) throw new Error('Not authenticated');
    const newReview = {
      _id: `rev_${Date.now()}`,
      slotId: body.slotId,
      userId: user._id,
      userName: user.name,
      rating: body.rating,
      comment: body.comment,
      date: new Date().toISOString(),
    };
    const reviews = getLS(STORAGE_KEYS.REVIEWS);
    reviews.push(newReview);
    setLS(STORAGE_KEYS.REVIEWS, reviews);

    // Update slot average rating
    const slots = getLS(STORAGE_KEYS.SLOTS);
    const slot = slots.find((s) => s._id === body.slotId);
    if (slot) {
      const slotReviews = [...reviews.filter((r) => r.slotId === body.slotId)];
      slot.rating = slotReviews.reduce((a, r) => a + r.rating, 0) / slotReviews.length;
      slot.reviewCount = slotReviews.length;
      setLS(STORAGE_KEYS.SLOTS, slots);
    }
    return newReview;
  },

  // ── MESSAGES ──────────────────────────────────────────
  'GET /chat/conversations': async () => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) return [];
    const messages = getLS(STORAGE_KEYS.MESSAGES);
    const users = getLS(STORAGE_KEYS.USERS);

    const peers = new Set();
    messages.forEach((m) => {
      if (m.senderId === user._id) peers.add(m.receiverId);
      if (m.receiverId === user._id) peers.add(m.senderId);
    });

    return [...peers].map((peerId) => {
      const peer = users.find((u) => u._id === peerId) || { _id: peerId, name: 'Unknown' };
      const conv = messages
        .filter(
          (m) =>
            (m.senderId === user._id && m.receiverId === peerId) ||
            (m.senderId === peerId && m.receiverId === user._id)
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { user: peer, lastMessage: conv[0], unreadCount: conv.filter((m) => !m.read && m.receiverId === user._id).length };
    });
  },

  'GET /chat/messages/:receiverId': async ({ receiverId }) => {
    await delay();
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) return [];
    const messages = getLS(STORAGE_KEYS.MESSAGES);
    return messages
      .filter(
        (m) =>
          (m.senderId === user._id && m.receiverId === receiverId) ||
          (m.senderId === receiverId && m.receiverId === user._id)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  'POST /chat/message': async (body) => {
    await delay(200);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (!user) throw new Error('Not authenticated');
    const newMsg = {
      _id: `msg_${Date.now()}`,
      senderId: user._id,
      receiverId: body.receiverId,
      senderName: user.name,
      message: body.message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const messages = getLS(STORAGE_KEYS.MESSAGES);
    messages.push(newMsg);
    setLS(STORAGE_KEYS.MESSAGES, messages);
    return newMsg;
  },

  // ── ADMIN/USERS ───────────────────────────────────────
  'GET /users': async () => {
    await delay();
    const users = getLS(STORAGE_KEYS.USERS);
    return users.map(({ password: _, ...u }) => u);
  },

  'DELETE /users/:id': async ({ id }) => {
    await delay();
    const users = getLS(STORAGE_KEYS.USERS);
    setLS(STORAGE_KEYS.USERS, users.filter((u) => u._id !== id));
    return { message: 'User deleted' };
  },
};

// ── Mock API Request Dispatcher ───────────────────────────
const dispatchMock = async (method, path, data) => {
  const routes = Object.keys(mockHandlers);

  for (const route of routes) {
    const [routeMethod, routePath] = route.split(' ');
    if (routeMethod !== method.toUpperCase()) continue;

    // Convert route pattern to regex (e.g., /slots/:id → /slots/([^/]+))
    const paramNames = [];
    const regexStr = routePath.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexStr}$`);
    const match = path.match(regex);
    if (!match) continue;

    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });

    try {
      const result = await mockHandlers[route](method === 'GET' ? params : { ...params, ...data }, data);
      return { data: result };
    } catch (err) {
      throw { response: { data: { msg: err.message }, status: 400 } };
    }
  }

  throw { response: { data: { msg: `Mock route not found: ${method} ${path}` }, status: 404 } };
};

// ── Unified API Object ─────────────────────────────────────
const api = {
  get: async (path) => {
    if (!USE_BACKEND) return dispatchMock('GET', path, null);
    const res = await axiosInstance.get(path);
    if (path === '/slots' || path.match(/^\/slots\/[a-f0-9]+$/i)) {
        const hour = new Date().getHours();
        if (Array.isArray(res.data)) {
            res.data = res.data.map(s => ({
                ...s, 
                smartPrice: calculateSmartPrice(s.pricePerHour || s.basePrice || 50, hour, s.bookingCount || 0),
                pricingInfo: getPricingLabel(hour)
            }));
        } else if (res.data && res.data._id) {
            res.data.smartPrice = calculateSmartPrice(res.data.pricePerHour || res.data.basePrice || 50, hour, res.data.bookingCount || 0);
            res.data.pricingInfo = getPricingLabel(hour);
        }
    }
    return res;
  },

  post: (path, data) =>
    USE_BACKEND
      ? axiosInstance.post(path, data)
      : dispatchMock('POST', path, data),

  put: (path, data) =>
    USE_BACKEND
      ? axiosInstance.put(path, data)
      : dispatchMock('PUT', path, data),

  delete: (path) =>
    USE_BACKEND
      ? axiosInstance.delete(path)
      : dispatchMock('DELETE', path, null),
};

export { lockSlot, unlockSlot, expireOldLocks };
export default api;
