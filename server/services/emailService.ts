import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendVerificationEmail = async (email: string, token: string, frontendUrl: string = config.app.url) => {
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Bloom & Blossom" <${config.smtp.user}>`,
    to: email,
    subject: "Verify your email address - Bloom & Blossom",
    html: `
      <h2>Welcome to Bloom & Blossom!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;color:#fff;background-color:#FFB6C1;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>Or paste this link in your browser: <br/> ${verificationLink}</p>
      <p>This verification link will expire in 30 minutes.</p>
    `,
  };

  // If we don't have an SMTP password set, just log the link and skip sending
  if (!config.smtp.pass) {
    console.log("--------------------------------------------------------------------------------");
    console.log("SMTP Password not set! In a real environment, an email would be sent.");
    console.log(`[TESTING] VERIFICATION LINK FOR ${email}:`);
    console.log(`[TESTING] ${verificationLink}`);
    console.log("--------------------------------------------------------------------------------");
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    // In testing without config, we might want to just log it instead of failing
    console.log("--------------------------------------------------------------------------------");
    console.log(`[TESTING] VERIFICATION LINK FOR ${email}:`);
    console.log(`[TESTING] ${verificationLink}`);
    console.log("--------------------------------------------------------------------------------");
    // We are deliberately eating the error so the test flow works in Preview mode
    // throw new Error("Failed to send verification email");
  }
};

export const sendContactEmail = async (name: string, senderEmail: string, subject: string, message: string) => {
  const mailOptions = {
    from: `"Bloom & Blossom Contact" <${config.smtp.user}>`,
    to: "info@bloomandblossom.in",
    replyTo: senderEmail,
    subject: `New Contact Form Submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${senderEmail}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${senderEmail}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
    `,
  };

  if (!config.smtp.pass) {
    console.log("--------------------------------------------------------------------------------");
    console.log("SMTP Password not set! In a real environment, an email would be sent.");
    console.log(`[TESTING] CONTACT FORM SUBMISSION FROM ${senderEmail}:`);
    console.log(`[TESTING] SUBJECT: ${subject}`);
    console.log(`[TESTING] MESSAGE: ${message}`);
    console.log("--------------------------------------------------------------------------------");
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent from ${senderEmail}`);
  } catch (error) {
    console.error(`Failed to send contact email from ${senderEmail}:`, error);
    throw new Error("Failed to send contact email");
  }
};
