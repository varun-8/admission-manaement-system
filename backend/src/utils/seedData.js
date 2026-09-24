const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const Target = require('../models/Target');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database collections...');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lead.deleteMany({});
    await FollowUp.deleteMany({});
    await Target.deleteMany({});

    console.log('Seeding Courses catalog...');
    const courses = await Course.create([
      {
        code: 'CSE-101',
        name: 'B.Tech Computer Science & Engineering',
        department: 'Engineering',
        durationYears: 4,
        totalSeats: 120,
        seatsFilled: 45,
        annualFee: 180000,
        description: 'Specialization in AI, Machine Learning, and Software Engineering.',
        eligibilityCriteria: 'Minimum 60% in 10+2 Physics, Chemistry, Math.',
      },
      {
        code: 'MBA-201',
        name: 'Master of Business Administration (MBA)',
        department: 'Management',
        durationYears: 2,
        totalSeats: 60,
        seatsFilled: 28,
        annualFee: 250000,
        description: 'Dual specialization in Marketing, Finance, and Analytics.',
        eligibilityCriteria: 'Bachelor Degree with minimum 50% & CAT/MAT score.',
      },
      {
        code: 'NUR-301',
        name: 'B.Sc Nursing & Healthcare',
        department: 'Medical & Allied',
        durationYears: 4,
        totalSeats: 50,
        seatsFilled: 20,
        annualFee: 120000,
        description: 'Clinical clinical training with affiliated multispecialty hospital.',
        eligibilityCriteria: '10+2 PCB with minimum 50%.',
      },
      {
        code: 'DS-102',
        name: 'B.Sc Data Science & Artificial Intelligence',
        department: 'Engineering',
        durationYears: 3,
        totalSeats: 60,
        seatsFilled: 18,
        annualFee: 140000,
        description: 'Industry aligned degree with Python, R, and Data Analytics.',
        eligibilityCriteria: '10+2 with Mathematics.',
      },
      {
        code: 'DIP-401',
        name: 'Diploma in Web Development & Cloud Computing',
        department: 'Diploma',
        durationYears: 1,
        totalSeats: 40,
        seatsFilled: 12,
        annualFee: 65000,
        description: 'Hands-on practical diploma for rapid tech career entry.',
        eligibilityCriteria: 'Pass in 10th or 12th standard.',
      },
    ]);

    console.log('Seeding Staff & Counsellor Users...');
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: 'superadmin@123',
        role: 'superadmin',
        phone: '+91 99999 00000',
        specialization: 'Executive Management',
      },
      {
        name: 'Dr. Rajesh Sharma',
        email: 'manager@institution.edu',
        password: 'password123',
        role: 'manager',
        phone: '+91 98765 43210',
        specialization: 'General',
        maxCapacity: 100,
      },
      {
        name: 'Priya Sundaram',
        email: 'priya.s@institution.edu',
        password: 'password123',
        role: 'counsellor',
        phone: '+91 98765 43211',
        specialization: 'Engineering',
        activeLeadCount: 12,
        maxCapacity: 50,
      },
      {
        name: 'Anil Kumar',
        email: 'anil.k@institution.edu',
        password: 'password123',
        role: 'counsellor',
        phone: '+91 98765 43212',
        specialization: 'Management',
        activeLeadCount: 10,
        maxCapacity: 50,
      },
      {
        name: 'Kavitha Raman',
        email: 'kavitha.r@institution.edu',
        password: 'password123',
        role: 'counsellor',
        phone: '+91 98765 43213',
        specialization: 'Medical & Allied',
        activeLeadCount: 8,
        maxCapacity: 50,
      },
      {
        name: 'Suresh Patel',
        email: 'suresh.p@institution.edu',
        password: 'password123',
        role: 'counsellor',
        phone: '+91 98765 43214',
        specialization: 'General',
        activeLeadCount: 15,
        maxCapacity: 50,
      },
    ]);

    const counsellorPriya = users[2];
    const counsellorAnil = users[3];
    const counsellorKavitha = users[4];
    const counsellorSuresh = users[5];

    const courseCSE = courses[0];
    const courseMBA = courses[1];
    const courseNUR = courses[2];
    const courseDS = courses[3];
    const courseDIP = courses[4];

    console.log('Seeding Admission Leads...');
    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    const sampleLeads = [
      {
        leadNumber: 'ADM-2026-1001',
        studentName: 'Aarav Mehta',
        parentName: 'Sanjay Mehta',
        email: 'aarav.m@gmail.com',
        phone: '+91 98401 12345',
        city: 'Chennai',
        state: 'Tamil Nadu',
        previousQualification: '12th CBSE',
        academicPercentage: 88.5,
        entranceExamScore: 'JEE Main Percentile: 94.2',
        preferredCourse: courseCSE._id,
        preferredCourseName: courseCSE.name,
        source: 'Website',
        status: 'Counseling Scheduled',
        assignedCounsellor: counsellorPriya._id,
        assignedCounsellorName: counsellorPriya.name,
        assignedAt: daysAgo(2),
        assignmentType: 'Specialization Routing',
        nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        lastContactedAt: daysAgo(1),
        followUpCount: 2,
        createdAt: daysAgo(2),
        notes: 'Inquired about CS AI spec and campus placement stats.',
      },
      {
        leadNumber: 'ADM-2026-1002',
        studentName: 'Sneha Verma',
        parentName: 'Ramesh Verma',
        email: 'sneha.v@yahoo.com',
        phone: '+91 98402 23456',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        previousQualification: 'B.Com General',
        academicPercentage: 74.0,
        entranceExamScore: 'MAT Score: 680',
        preferredCourse: courseMBA._id,
        preferredCourseName: courseMBA.name,
        source: 'Walk-in',
        status: 'Campus Visit',
        assignedCounsellor: counsellorAnil._id,
        assignedCounsellorName: counsellorAnil.name,
        assignedAt: daysAgo(5),
        assignmentType: 'Manual Manager Reallocation',
        nextFollowUpDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        lastContactedAt: daysAgo(2),
        followUpCount: 3,
        createdAt: daysAgo(6),
        notes: 'Visited campus with parents. Very impressed by MBA seminar hall.',
      },
      {
        leadNumber: 'ADM-2026-1003',
        studentName: 'Rohan Deshmukh',
        parentName: 'Vijay Deshmukh',
        email: 'rohan.d@outlook.com',
        phone: '+91 98403 34567',
        city: 'Madurai',
        state: 'Tamil Nadu',
        previousQualification: '12th State Board',
        academicPercentage: 91.0,
        entranceExamScore: 'TNEA Cutoff: 189.5',
        preferredCourse: courseCSE._id,
        preferredCourseName: courseCSE.name,
        source: 'Educational Fair',
        fairLocation: 'Coimbatore Education Expo 2026',
        status: 'Enrolled',
        assignedCounsellor: counsellorPriya._id,
        assignedCounsellorName: counsellorPriya.name,
        assignedAt: daysAgo(12),
        assignmentType: 'Specialization Routing',
        lastContactedAt: daysAgo(1),
        followUpCount: 4,
        enrolledCourse: courseCSE._id,
        feePaidAmount: 50000,
        enrollmentDate: daysAgo(1),
        createdAt: daysAgo(15),
        notes: 'Enrolled and paid seat reservation deposit.',
      },
      {
        leadNumber: 'ADM-2026-1004',
        studentName: 'Divya Nair',
        parentName: 'Gopinath Nair',
        email: 'divya.nair@gmail.com',
        phone: '+91 98404 45678',
        city: 'Kochi',
        state: 'Kerala',
        previousQualification: '12th State Board (PCB)',
        academicPercentage: 82.0,
        entranceExamScore: 'NEET Score: 420',
        preferredCourse: courseNUR._id,
        preferredCourseName: courseNUR.name,
        source: 'WhatsApp',
        status: 'Contacted',
        assignedCounsellor: counsellorKavitha._id,
        assignedCounsellorName: counsellorKavitha.name,
        assignedAt: daysAgo(1),
        assignmentType: 'Specialization Routing',
        nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        lastContactedAt: daysAgo(1),
        followUpCount: 1,
        hostelRequired: true,
        createdAt: daysAgo(1),
        notes: 'Inquired via WhatsApp regarding Nursing hostel facilities.',
      },
      {
        leadNumber: 'ADM-2026-1005',
        studentName: 'Karthik Raja',
        parentName: 'Muthusamy Raja',
        email: 'karthik.r@gmail.com',
        phone: '+91 98405 56789',
        city: 'Trichy',
        state: 'Tamil Nadu',
        previousQualification: '12th CBSE',
        academicPercentage: 78.0,
        preferredCourse: courseDS._id,
        preferredCourseName: courseDS.name,
        source: 'Campaign',
        campaignName: 'Meta Ads - B.Sc AI 2026',
        status: 'New',
        assignedCounsellor: counsellorSuresh._id,
        assignedCounsellorName: counsellorSuresh.name,
        assignedAt: daysAgo(0.5),
        assignmentType: 'Auto Round-Robin',
        createdAt: daysAgo(0.5),
        notes: 'Lead captured from Facebook Ad form.',
      },
      {
        leadNumber: 'ADM-2026-1006',
        studentName: 'Ananya Roy',
        parentName: 'Subhash Roy',
        email: 'ananya.roy@gmail.com',
        phone: '+91 98406 67890',
        city: 'Bengaluru',
        state: 'Karnataka',
        previousQualification: '12th ISC',
        academicPercentage: 85.0,
        preferredCourse: courseDIP._id,
        preferredCourseName: courseDIP.name,
        source: 'Website',
        status: 'Lost',
        assignedCounsellor: counsellorSuresh._id,
        assignedCounsellorName: counsellorSuresh.name,
        assignedAt: daysAgo(35),
        lostReason: 'Joined Competitor Institution',
        createdAt: daysAgo(40),
        notes: 'Opted for local college in Bengaluru.',
      },
      {
        leadNumber: 'ADM-2026-1007',
        studentName: 'Vikram Singh',
        parentName: 'Harpreet Singh',
        email: 'vikram.singh@gmail.com',
        phone: '+91 98407 78901',
        city: 'Salem',
        state: 'Tamil Nadu',
        previousQualification: '12th CBSE',
        academicPercentage: 65.0,
        preferredCourse: courseCSE._id,
        preferredCourseName: courseCSE.name,
        source: 'Phone Call',
        status: 'Application Submitted',
        assignedCounsellor: counsellorPriya._id,
        assignedCounsellorName: counsellorPriya.name,
        assignedAt: daysAgo(10),
        assignmentType: 'Specialization Routing',
        nextFollowUpDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        lastContactedAt: daysAgo(2),
        followUpCount: 3,
        createdAt: daysAgo(12),
        notes: 'Submitted application form online. Pending fee payment.',
      },
      {
        leadNumber: 'ADM-2026-1008',
        studentName: 'Meera Pillai',
        parentName: 'Narayanan Pillai',
        email: 'meera.p@gmail.com',
        phone: '+91 98408 89012',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        previousQualification: 'B.Sc Computer Science',
        academicPercentage: 79.5,
        preferredCourse: courseMBA._id,
        preferredCourseName: courseMBA.name,
        source: 'Referral',
        status: 'Counseling Scheduled',
        assignedCounsellor: counsellorAnil._id,
        assignedCounsellorName: counsellorAnil.name,
        assignedAt: daysAgo(3),
        assignmentType: 'Auto Round-Robin',
        nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        lastContactedAt: daysAgo(1),
        followUpCount: 2,
        createdAt: daysAgo(4),
        notes: 'Referred by alumnus. Virtual counseling scheduled via Google Meet.',
      }
    ];

    const createdLeads = await Lead.create(sampleLeads);

    console.log('Seeding Counseling Follow-up Logs...');
    await FollowUp.create([
      {
        lead: createdLeads[0]._id,
        counsellor: counsellorPriya._id,
        counsellorName: counsellorPriya.name,
        type: 'Phone Call',
        outcome: 'Connected - Interested',
        notes: 'Discussed CS course syllabus and placement record. Scheduled counseling session.',
        scheduledFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        lead: createdLeads[1]._id,
        counsellor: counsellorAnil._id,
        counsellorName: counsellorAnil.name,
        type: 'Campus Counseling',
        outcome: 'Scheduled Campus Visit',
        notes: 'Showed campus labs, library and hostel rooms to candidate and father.',
        scheduledFollowUpDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        lead: createdLeads[2]._id,
        counsellor: counsellorPriya._id,
        counsellorName: counsellorPriya.name,
        type: 'Document Submission',
        outcome: 'Fee Paid',
        notes: 'Verified 12th marksheet and issued provisional admission letter.',
      },
      {
        lead: createdLeads[3]._id,
        counsellor: counsellorKavitha._id,
        counsellorName: counsellorKavitha.name,
        type: 'WhatsApp Message',
        outcome: 'Connected - Thinking',
        notes: 'Sent PDF brochure of Nursing program & hostel fee structure via WhatsApp.',
      }
    ]);

    console.log('Seeding Counsellor Targets...');
    await Target.create([
      {
        counsellor: counsellorPriya._id,
        counsellorName: counsellorPriya.name,
        month: '2026-09',
        leadsAssignedTarget: 40,
        counselingCallsTarget: 80,
        enrollmentsTarget: 10,
        achievedEnrollments: 4,
      },
      {
        counsellor: counsellorAnil._id,
        counsellorName: counsellorAnil.name,
        month: '2026-09',
        leadsAssignedTarget: 35,
        counselingCallsTarget: 70,
        enrollmentsTarget: 8,
        achievedEnrollments: 3,
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
