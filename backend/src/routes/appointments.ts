import express from 'express';
import { auth, db } from '../firebaseAdmin';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      uid: string;
      role: string;
    };
  }
}

// POST /api/appointments - Create a new appointment booking
router.post('/', authenticate, async (req, res) => {
  try {
    const { counselorId, date, time, reason } = req.body;
    const userId = req.user!.uid;

    const bookingRef = db.collection('appointments').doc(userId).collection('bookings').doc();
    await bookingRef.set({
      counselorId,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date(),
      userId,
    });

    res.status(201).json({ message: 'Appointment booked successfully', bookingId: bookingRef.id });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// GET /api/appointments - Get user's appointments
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const bookingsSnapshot = await db.collection('appointments').doc(userId).collection('bookings').orderBy('createdAt', 'desc').get();
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/all - Get all appointments (Admin only)
router.get('/all', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const allBookings: any[] = [];
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const bookingsSnapshot = await db.collection('appointments').doc(userId).collection('bookings').get();
      bookingsSnapshot.docs.forEach(doc => {
        allBookings.push({ id: doc.id, userId, ...doc.data() });
      });
    }

    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// PUT /api/appointments/:bookingId - Update appointment status (Admin only)
router.put('/:bookingId', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Find the booking across all users
    const usersSnapshot = await db.collection('users').get();
    let found = false;
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const bookingRef = db.collection('appointments').doc(userId).collection('bookings').doc(bookingId);
      const bookingDoc = await bookingRef.get();
      if (bookingDoc.exists) {
        await bookingRef.update({ status });
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;
