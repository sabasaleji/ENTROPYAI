const bcrypt = require('bcryptjs');
const supabase = require('./supabaseClient');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies

// Email Configuration
// NOTE: For real sending, you need to add your email credentials to a .env file
// Example .env:
// EMAIL_USER=services@entropy-ai.in
// EMAIL_PASS=your_password_here

// Verify email credentials are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  WARNING: EMAIL_USER or EMAIL_PASS not found in .env file!');
  console.warn('Email sending will fail. Please check your .env file.');
}

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',  // GoDaddy SMTP server
  port: 465,  // SSL port
  secure: true,  // Use SSL
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  // Add connection timeout
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ==================== AUTHENTICATION ROUTES ====================

// User Registration
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: data.id,
        email: data.email,
        name: data.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// Google Sign-In
app.post('/api/google-signin', async (req, res) => {
  const { email, name, googleId } = req.body;

  try {
    // Check if user exists
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // If user doesn't exist, create them
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email,
            name,
            google_id: googleId,
            password: null // No password for Google sign-ins
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Google sign-in successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Google sign-in failed' 
    });
  }
});

// ==================== EMAIL ROUTE ====================

app.post('/api/send-email', async (req, res) => {
  const { firstName, lastName, email, interest, message } = req.body;

  console.log('Received form submission:', req.body);

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured!');
    return res.status(500).json({ 
      success: false, 
      message: 'Email service not configured. Please contact the administrator.' 
    });
  }

  // Email Content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Must match authenticated email
    replyTo: email, // Replies will go to the user's email
    to: 'services@entropy-ai.in', // Your email
    subject: `Entropy AI Query: ${interest} - ${firstName} ${lastName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Area of Interest: ${interest}
      
      Message:
      ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0284c7;">New Contact Form Submission</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Area of Interest:</strong> ${interest}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3 style="color: #0284c7;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `,
  };

  try {
    // Verify transporter connection first
    console.log('Attempting to send email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    
    // Actually send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('To:', mailOptions.to);
    console.log('From user:', email);
    
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials in the .env file.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection timed out. Please try again later.';
    } else if (error.response) {
      errorMessage = `Email server error: ${error.response}`;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Email user configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
  console.log(`Email password configured: ${process.env.EMAIL_PASS ? 'Yes' : 'No'}`);
  console.log(`Supabase URL configured: ${process.env.SUPABASE_URL ? 'Yes' : 'No'}`);
  console.log(`Supabase Key configured: ${process.env.SUPABASE_KEY ? 'Yes' : 'No'}`);
});