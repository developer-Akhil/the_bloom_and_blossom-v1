import express from "express";
import { sendContactEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Name, email, subject, and message are required" });
    }

    // Send email asynchronously so we don't block the HTTP response if SMTP is slow/hanging
    sendContactEmail(name, email, subject, message).catch(err => {
      console.error("Async contact email error:", err);
    });

    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error: any) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

export default router;
