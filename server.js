// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Mock Database & Tokens
const mockUsers = 
[
    { username: 'user1', password: 'password123' },
    { username: 'testuser', password: '1234' }
];

const mockTokens = 
{
    'google-token-abc': 'google-user-id-1',
    'apple-token-xyz': 'apple-user-id-2'
};

const mockGuestSessions = {}; // Store guest session tokens

// Start the server
app.listen(PORT, () => 
{
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Username/Password login

app.post('/login', (req, res) => 
{
    const { username, password } = req.body;
    console.log(`Attempted login for: ${username}`);

    const user = mockUsers.find(u => u.username === username && u.password === password);

    if (user) {
        console.log(`Login successful for: ${username}`);
        res.status(200).json({ success: true, message: 'Login successful', token: 'mock-token-123' });
    } else {
        console.log(`Invalid login attempt for: ${username}`);
        res.status(401).json({ success: false, message: 'Invalid username/password' });
    }
});

// Social Logins

app.post('/login/google', (req, res) => 
{
    const { token } = req.body;
    console.log(`Received Google token: ${token}`);

    if (mockTokens[token]) {
        console.log('Google login successful');
        res.status(200).json({ success: true, message: 'Google login successful', token: 'mock-google-token' });
    } else {
        console.log('OAuth token invalid');
        res.status(401).json({ success: false, message: 'OAuth token invalid' });
    }
});

app.post('/login/apple', (req, res) => 
{
    const { token } = req.body;
    console.log(`Received Apple token: ${token}`);

    if (mockTokens[token]) {
        console.log('Apple login successful');
        res.status(200).json({ success: true, message: 'Apple login successful', token: 'mock-apple-token' });
    } else {
        console.log('OAuth token invalid');
        res.status(401).json({ success: false, message: 'OAuth token invalid' });
    }
});

// Phone Number login

app.post('/login/phone', (req, res) => 
{
    const { phoneNumber, otp } = req.body;
    console.log(`Attempted phone login for: ${phoneNumber} with OTP: ${otp}`);

    // In a real system, you'd generate and send a code.
    // Here, we'll just check if the OTP is '123456'
    if (otp === '123456') {
        console.log('Phone login successful');
        res.status(200).json({ success: true, message: 'Phone login successful', token: 'mock-phone-token' });
    } else {
        console.log('Invalid OTP');
        res.status(401).json({ success: false, message: 'Invalid OTP' });
    }
});

// Sign-Up

app.post('/signup', (req, res) => 
{
    const { username, password } = req.body;
    console.log(`Attempted signup for: ${username}`);

    const userExists = mockUsers.some(u => u.username === username);

    if (userExists) {
        console.log(`Signup failed: Username already exists for: ${username}`);
        res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
        mockUsers.push({ username, password });
        console.log(`New user signed up: ${username}`);
        console.log('Current mock users:', mockUsers);
        res.status(201).json({ success: true, message: 'User created successfully' });
    }
});

// Guest Login
const { v4: uuidv4 } = require('uuid'); // Install this module: npm install uuid

app.post('/guest-session', (req, res) => 
{
    const guestToken = uuidv4();
    mockGuestSessions[guestToken] = { createdAt: Date.now() };
    console.log(`Generated guest session with token: ${guestToken}`);

    res.status(200).json({ success: true, message: 'Guest session created', token: guestToken });
});