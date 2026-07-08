import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, business, email, phone, websiteType, plan, description, deadline } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required." });
    return;
  }

  const gmailUser = "prathika.ramprakash@gmail.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPass) {
    req.log.error("GMAIL_APP_PASSWORD is not set");
    res.status(500).json({ error: "Email service is not configured." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#43286B;">
      <div style="background:#43286B;padding:28px 32px;border-radius:10px 10px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:1.4rem;">New Project Inquiry — Lavender</h1>
      </div>
      <div style="background:#F6EFFB;padding:32px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;width:180px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${name}</td></tr>
          ${business ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Business</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${business}</td></tr>` : ""}
          <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Email</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;"><a href="mailto:${email}" style="color:#8B5CF6;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${phone}</td></tr>` : ""}
          ${websiteType ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Website Type</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${websiteType}</td></tr>` : ""}
          ${plan ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Plan</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${plan}</td></tr>` : ""}
          ${deadline ? `<tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;">Deadline</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">${deadline}</td></tr>` : ""}
        </table>
        ${description ? `<div style="margin-top:20px;"><div style="font-weight:700;margin-bottom:8px;">Project Description</div><div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #E5E7EB;line-height:1.6;">${description}</div></div>` : ""}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Lavender" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `New Inquiry from ${name}${business ? ` — ${business}` : ""}`,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
