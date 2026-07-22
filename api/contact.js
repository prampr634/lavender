import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    business,
    email,
    phone,
    websiteType,
    plan,
    description,
    deadline,
  } = req.body;

  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("HAS_APP_PASSWORD:", !!process.env.GMAIL_APP_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Lavender Contact Form - ${name}`,
      text: `
Name: ${name}

Business: ${business}

Email: ${email}

Phone: ${phone}

Website Type: ${websiteType}

Plan: ${plan}

Preferred Deadline: ${deadline}

Project Description:
${description}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send email." });
  }
}