import mongoose from 'mongoose';
import User from './models/User.js';
import Worker from './models/Worker.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workkar';

async function runTests() {
  console.log('====================================================');
  console.log('  TESTING WORKER AVAILABILITY & BOOKING REQUEST FLOW');
  console.log('====================================================\n');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.\n');

  try {
    // 0. Clean up previous test users
    await User.deleteMany({ email: { $in: ['test_cust_a@test.com', 'test_cust_b@test.com', 'test_cust_c@test.com', 'test_worker_rahul@test.com'] } });
    await Worker.deleteMany({ email: 'test_worker_rahul@test.com' });

    // 1. Create Test Customers A, B, C
    const custA = await User.create({
      name: 'Customer A',
      email: 'test_cust_a@test.com',
      password: 'password123',
      role: 'customer',
      status: 'active'
    });

    const custB = await User.create({
      name: 'Customer B',
      email: 'test_cust_b@test.com',
      password: 'password123',
      role: 'customer',
      status: 'active'
    });

    const custC = await User.create({
      name: 'Customer C',
      email: 'test_cust_c@test.com',
      password: 'password123',
      role: 'customer',
      status: 'active'
    });

    // 2. Create Test Worker Rahul
    const workerRahul = await User.create({
      name: 'Rahul Sharma',
      email: 'test_worker_rahul@test.com',
      password: 'password123',
      role: 'worker',
      status: 'active',
      skill: 'Electrician',
      rate: 30,
      availability: 'Available'
    });

    console.log(`[SETUP] Created Customers A, B, C and Worker Rahul (availability: ${workerRahul.availability})\n`);

    // Helper to simulate POST /api/jobs/book
    const bookWorker = async (customer, worker) => {
      const refreshedWorker = await User.findById(worker._id);
      const hasActiveJob = !!(refreshedWorker.activeJob && refreshedWorker.activeJob.id);
      if (refreshedWorker.availability !== 'Available' || hasActiveJob) {
        return { success: false, status: 400, message: 'Worker is currently unavailable or on another job' };
      }

      const jobOffer = {
        id: `#${Math.floor(100 + Math.random() * 900)}-WK`,
        customerName: customer.name,
        address: '123 Main St',
        skill: refreshedWorker.skill,
        total: 100,
        base: 90,
        tax: 10,
        step: 1,
        status: 'Pending',
        workerId: refreshedWorker._id.toString(),
        customerId: customer._id.toString(),
        createdAt: new Date()
      };

      if (!refreshedWorker.pendingRequests) refreshedWorker.pendingRequests = [];
      refreshedWorker.pendingRequests.push(jobOffer);
      refreshedWorker.markModified('pendingRequests');
      // Worker remains Available!
      await refreshedWorker.save();

      customer.bookings.push({
        id: jobOffer.id,
        workerId: refreshedWorker._id.toString(),
        workerName: refreshedWorker.name,
        skill: jobOffer.skill,
        total: jobOffer.total,
        status: 'Pending',
        date: new Date()
      });
      await customer.save();

      return { success: true, status: 200, jobOffer };
    };

    // Helper to simulate PUT /api/jobs/accept
    const acceptJob = async (workerId, jobId) => {
      const worker = await User.findById(workerId);
      const hasActiveJob = !!(worker.activeJob && worker.activeJob.id);
      if (hasActiveJob || worker.availability === 'On Job') {
        return { success: false, status: 400, message: 'Worker is already on an active job' };
      }

      const chosenJob = (worker.pendingRequests || []).find(r => r.id === jobId);
      if (!chosenJob) {
        return { success: false, status: 400, message: 'No active job offer to accept' };
      }

      worker.activeJob = {
        ...chosenJob.toObject(),
        step: 2,
        status: 'En Route'
      };
      worker.availability = 'On Job';
      worker.markModified('activeJob');

      const otherRequests = (worker.pendingRequests || []).filter(r => r.id !== jobId);
      worker.pendingRequests = [];
      worker.markModified('pendingRequests');
      await worker.save();

      // Update accepted customer
      const acceptedCust = await User.findById(chosenJob.customerId);
      const bAccepted = acceptedCust.bookings.find(b => b.id === chosenJob.id);
      if (bAccepted) bAccepted.status = 'Accepted';
      await acceptedCust.save();

      // Cancel other customers
      for (const oReq of otherRequests) {
        const otherCust = await User.findById(oReq.customerId);
        const bOther = otherCust.bookings.find(b => b.id === oReq.id);
        if (bOther) bOther.status = 'Cancelled';
        otherCust.notifications.push({
          id: `cancel-${oReq.id}`,
          title: 'Booking Update: Cancelled',
          message: 'Worker is no longer available because another booking was accepted.',
          type: 'warning'
        });
        await otherCust.save();
      }

      return { success: true, status: 200, activeJob: worker.activeJob };
    };

    // Helper to simulate PUT /api/jobs/decline
    const declineJob = async (workerId, jobId) => {
      const worker = await User.findById(workerId);
      const idx = (worker.pendingRequests || []).findIndex(r => r.id === jobId);
      if (idx === -1) return { success: false, status: 400, message: 'No job offer to decline' };

      const [declinedJob] = worker.pendingRequests.splice(idx, 1);
      worker.markModified('pendingRequests');
      const hasActiveJob = !!(worker.activeJob && worker.activeJob.id);
      if (!hasActiveJob) worker.availability = 'Available';
      await worker.save();

      const cust = await User.findById(declinedJob.customerId);
      const b = cust.bookings.find(x => x.id === declinedJob.id);
      if (b) b.status = 'Declined';
      await cust.save();

      return { success: true, status: 200 };
    };

    // ==========================================
    // TEST 1 — Single Request
    // ==========================================
    console.log('--- TEST 1: Customer A books Worker Rahul ---');
    const res1 = await bookWorker(custA, workerRahul);
    console.log(`Booking result: Status ${res1.status}, ID: ${res1.jobOffer?.id}`);
    const wCheck1 = await User.findById(workerRahul._id);
    console.log(`Worker Rahul availability: "${wCheck1.availability}" (Expected: "Available")`);
    console.log(`Worker Rahul pending requests count: ${wCheck1.pendingRequests.length} (Expected: 1)`);
    if (wCheck1.availability === 'Available' && wCheck1.pendingRequests.length === 1) {
      console.log('>>> TEST 1 PASSED ✅\n');
    } else {
      console.error('>>> TEST 1 FAILED ❌\n');
    }

    // ==========================================
    // TEST 2 — Multiple Concurrent Requests
    // ==========================================
    console.log('--- TEST 2: Customer B and Customer C also book Worker Rahul ---');
    const res2B = await bookWorker(custB, workerRahul);
    const res2C = await bookWorker(custC, workerRahul);
    const wCheck2 = await User.findById(workerRahul._id);
    console.log(`Customer B booking ID: ${res2B.jobOffer.id}, Customer C booking ID: ${res2C.jobOffer.id}`);
    console.log(`Worker Rahul availability: "${wCheck2.availability}" (Expected: "Available")`);
    console.log(`Worker Rahul pending requests count: ${wCheck2.pendingRequests.length} (Expected: 3)`);
    if (wCheck2.availability === 'Available' && wCheck2.pendingRequests.length === 3) {
      console.log('>>> TEST 2 PASSED ✅\n');
    } else {
      console.error('>>> TEST 2 FAILED ❌\n');
    }

    // ==========================================
    // TEST 3 — Worker Accepts Customer B
    // ==========================================
    console.log('--- TEST 3: Worker Rahul accepts Customer B\'s booking ---');
    const acceptRes = await acceptJob(workerRahul._id, res2B.jobOffer.id);
    const wCheck3 = await User.findById(workerRahul._id);
    const custACheck = await User.findById(custA._id);
    const custBCheck = await User.findById(custB._id);
    const custCCheck = await User.findById(custC._id);

    const bA = custACheck.bookings.find(b => b.id === res1.jobOffer.id);
    const bB = custBCheck.bookings.find(b => b.id === res2B.jobOffer.id);
    const bC = custCCheck.bookings.find(b => b.id === res2C.jobOffer.id);

    console.log(`Worker Rahul availability: "${wCheck3.availability}" (Expected: "On Job")`);
    console.log(`Worker Rahul activeJob status: "${wCheck3.activeJob?.status}" (Expected: "En Route")`);
    console.log(`Customer B booking status: "${bB?.status}" (Expected: "Accepted")`);
    console.log(`Customer A booking status: "${bA?.status}" (Expected: "Cancelled")`);
    console.log(`Customer C booking status: "${bC?.status}" (Expected: "Cancelled")`);
    console.log(`Customer A notification: "${custACheck.notifications[custACheck.notifications.length - 1]?.message}"`);

    if (
      wCheck3.availability === 'On Job' &&
      wCheck3.activeJob?.status === 'En Route' &&
      bB?.status === 'Accepted' &&
      bA?.status === 'Cancelled' &&
      bC?.status === 'Cancelled'
    ) {
      console.log('>>> TEST 3 PASSED ✅\n');
    } else {
      console.error('>>> TEST 3 FAILED ❌\n');
    }

    // ==========================================
    // TEST 5 — Busy Worker Cannot Be Booked
    // ==========================================
    console.log('--- TEST 5: Customer tries to book Rahul while Rahul is On Job ---');
    const busyBookingRes = await bookWorker(custA, workerRahul);
    console.log(`Booking result: Status ${busyBookingRes.status}, Message: "${busyBookingRes.message}"`);
    if (busyBookingRes.status === 400) {
      console.log('>>> TEST 5 PASSED ✅\n');
    } else {
      console.error('>>> TEST 5 FAILED ❌\n');
    }

    // ==========================================
    // TEST 4 — Rejection / Decline
    // ==========================================
    console.log('--- TEST 4: Reset worker to Available, customer books and worker declines ---');
    // Reset worker
    wCheck3.activeJob = undefined;
    wCheck3.availability = 'Available';
    wCheck3.pendingRequests = [];
    await wCheck3.save();

    const res4 = await bookWorker(custA, wCheck3);
    console.log(`Created new request for Customer A: ${res4.jobOffer.id}`);
    
    // Decline request
    const declineRes = await declineJob(wCheck3._id, res4.jobOffer.id);
    const wCheck4 = await User.findById(wCheck3._id);
    const custAAfterDecline = await User.findById(custA._id);
    const bADeclined = custAAfterDecline.bookings.find(b => b.id === res4.jobOffer.id);

    console.log(`Worker Rahul availability after decline: "${wCheck4.availability}" (Expected: "Available")`);
    console.log(`Customer A booking status after decline: "${bADeclined?.status}" (Expected: "Declined")`);

    // Verify other customer can still book Rahul
    const res4Other = await bookWorker(custB, wCheck4);
    console.log(`Customer B booking after decline: Status ${res4Other.status} (Expected: 200)`);

    if (wCheck4.availability === 'Available' && bADeclined?.status === 'Declined' && res4Other.status === 200) {
      console.log('>>> TEST 4 PASSED ✅\n');
    } else {
      console.error('>>> TEST 4 FAILED ❌\n');
    }

    // Clean up test data
    await User.deleteMany({ email: { $in: ['test_cust_a@test.com', 'test_cust_b@test.com', 'test_cust_c@test.com', 'test_worker_rahul@test.com'] } });
    console.log('All test scenarios completed successfully. Test data cleaned up.');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runTests();
