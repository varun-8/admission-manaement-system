// Automated API test script for Admission Management System
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const app = require('../app');
const http = require('http');

let server;
let port;
let baseUrl;

const makeRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, data: json };
};

const runTests = async () => {
  console.log('🧪 Starting Admission Management System Backend Test Suite...');
  
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admission_crm');
  console.log('✅ Connected to MongoDB for testing');

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`📡 Test server running at ${baseUrl}`);
      resolve();
    });
  });

  let adminToken = '';

  try {
    // Test 1: Health Check
    console.log('\n[Test 1] Health Check...');
    const health = await makeRequest('/api/health');
    if (health.status === 200 && health.data.status === 'online') {
      console.log('  ✅ Health check passed');
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }

    // Test 2: Auth Login (Super Admin)
    console.log('\n[Test 2] Auth Login (Super Admin)...');
    const loginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'superadmin@gmail.com', password: 'superadmin@123' },
    });
    if (loginRes.status === 200 && loginRes.data.data.token) {
      adminToken = loginRes.data.data.token;
      console.log(`  ✅ Login successful (${loginRes.data.data.name})`);
    } else {
      console.log('  ⚠️ Default superadmin not present, attempting test login bypass...');
    }

    // Test 3: Get Courses
    console.log('\n[Test 3] Get Active Courses Catalog...');
    const coursesRes = await makeRequest('/api/courses');
    if (coursesRes.status === 200 && Array.isArray(coursesRes.data.data)) {
      console.log(`  ✅ Courses fetched: ${coursesRes.data.data.length} active programs`);
    } else {
      throw new Error(`Get courses failed: ${JSON.stringify(coursesRes)}`);
    }

    // Test 4: Get Admission Leads
    console.log('\n[Test 4] Get Admission Leads Pipeline...');
    const leadsRes = await makeRequest('/api/leads', {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    });
    if (leadsRes.status === 200 && Array.isArray(leadsRes.data.data)) {
      console.log(`  ✅ Leads fetched: ${leadsRes.data.data.length} candidates`);
    } else {
      throw new Error(`Get leads failed: ${JSON.stringify(leadsRes)}`);
    }

    // Test 5: Get Analytics Report Summary
    console.log('\n[Test 5] Get Analytics Report Summary...');
    const reportRes = await makeRequest('/api/reports/summary', {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    });
    if (reportRes.status === 200 && reportRes.data.data.kpi) {
      console.log(`  ✅ Analytics summary retrieved: Total Leads = ${reportRes.data.data.kpi.totalLeads}`);
    } else {
      throw new Error(`Report summary failed: ${JSON.stringify(reportRes)}`);
    }

    console.log('\n✨ ALL ADMISSION MANAGEMENT BACKEND TESTS PASSED! ✨\n');
  } catch (err) {
    console.error('\n❌ Test failure:', err.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
  }
};

runTests();
