import { Router } from "express";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { eq, and, desc } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";

const router = Router();

const OWNER_EMAIL = "prathika.ramprakash@gmail.com";

function getBaseUrl(): string {
  const domains = process.env.REPLIT_DOMAINS;
  const domain = domains ? domains.split(",")[0].trim() : "";
  return domain ? `https://${domain}` : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pageShell(title: string, inner: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;background:#F6EFFB;margin:0;padding:48px 20px;color:#43286B;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:36px;text-align:center;">
    ${inner}
  </div>
</body></html>`;
}

function statusPage(title: string, message: string): string {
  return pageShell(
    title,
    `<h1 style="font-size:1.4rem;margin:0 0 12px;">${escapeHtml(title)}</h1>
     <p style="color:#4B5563;line-height:1.6;margin:0;">${escapeHtml(message)}</p>`,
  );
}

function confirmPage(action: "approve" | "reject", token: string, review: { name: string; rating: number; quote: string }): string {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const isApprove = action === "approve";
  const heading = isApprove ? "Approve this review?" : "Reject this review?";
  const note = isApprove
    ? "Once approved, this review will appear publicly on your site."
    : "Rejecting will permanently delete this review.";
  const btnColor = isApprove ? "#8B5CF6" : "#E05252";
  const btnLabel = isApprove ? "Yes, approve" : "Yes, reject";
  const instruction = isApprove
    ? "One last step — tap the green button below to publish this review on your site."
    : "One last step — tap the red button below to permanently delete this review.";
  return pageShell(
    heading,
    `<h1 style="font-size:1.4rem;margin:0 0 16px;">${escapeHtml(heading)}</h1>
     <p style="margin:0 0 6px;font-size:1.1rem;">${stars}</p>
     <p style="margin:0 0 4px;font-weight:700;">${escapeHtml(review.name)}</p>
     <div style="background:#F6EFFB;padding:16px;border-radius:8px;border:1px solid #E5E7EB;line-height:1.6;margin:12px 0 20px;text-align:left;">${escapeHtml(review.quote)}</div>
     <p style="color:#43286B;line-height:1.6;margin:0 0 20px;font-weight:700;">${escapeHtml(instruction)}</p>
     <form method="POST" action="/api/reviews/${action}">
       <input type="hidden" name="token" value="${escapeHtml(token)}">
       <button type="submit" style="display:block;width:100%;background:${btnColor};color:#fff;border:none;font-weight:700;padding:16px 28px;border-radius:8px;font-size:1.1rem;cursor:pointer;">${btnLabel}</button>
     </form>`,
  );
}

// Public: list approved reviews
router.get("/reviews", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: reviewsTable.id,
        name: reviewsTable.name,
        rating: reviewsTable.rating,
        quote: reviewsTable.quote,
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.approved, true))
      .orderBy(desc(reviewsTable.createdAt));
    res.set("Cache-Control", "no-store");
    res.json({ reviews: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch reviews");
    res.status(500).json({ error: "Failed to load reviews." });
  }
});

// Public: submit a review (pending approval)
router.post("/reviews", async (req, res) => {
  const { name, rating, quote } = req.body ?? {};

  const ratingNum = Number(rating);
  if (
    typeof name !== "string" || !name.trim() ||
    typeof quote !== "string" || !quote.trim() ||
    !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5
  ) {
    res.status(400).json({ error: "Please provide a name, a 1–5 rating, and a review." });
    return;
  }

  const cleanName = name.trim().slice(0, 80);
  const cleanQuote = quote.trim().slice(0, 1000);
  const token = randomUUID();

  try {
    await db.insert(reviewsTable).values({
      name: cleanName,
      rating: ratingNum,
      quote: cleanQuote,
      token,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save review");
    res.status(500).json({ error: "Failed to submit review. Please try again." });
    return;
  }

  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailPass) {
    const baseUrl = getBaseUrl();
    const approveUrl = `${baseUrl}/api/reviews/approve?token=${token}`;
    const rejectUrl = `${baseUrl}/api/reviews/reject?token=${token}`;
    const stars = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#43286B;">
        <div style="background:#43286B;padding:28px 32px;border-radius:10px 10px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:1.4rem;">New Review Awaiting Approval</h1>
        </div>
        <div style="background:#F6EFFB;padding:32px;border-radius:0 0 10px 10px;border:1px solid #E5E7EB;">
          <p style="margin:0 0 6px;font-size:1.1rem;">${stars}</p>
          <p style="margin:0 0 4px;font-weight:700;">${escapeHtml(cleanName)}</p>
          <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #E5E7EB;line-height:1.6;margin:12px 0 24px;">${escapeHtml(cleanQuote)}</div>
          <p style="margin:0 0 16px;color:#4B5563;">This review will only appear on your site after you approve it.</p>
          <a href="${approveUrl}" style="display:inline-block;background:#8B5CF6;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:8px;margin-right:10px;">Approve</a>
          <a href="${rejectUrl}" style="display:inline-block;background:#E05252;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:8px;">Reject</a>
        </div>
      </div>`;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: OWNER_EMAIL, pass: gmailPass },
      });
      await transporter.sendMail({
        from: `"Lavender" <${OWNER_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: `New review from ${cleanName} — awaiting approval`,
        html,
      });
    } catch (err) {
      req.log.error({ err }, "Failed to send review approval email");
    }
  } else {
    req.log.error("GMAIL_APP_PASSWORD is not set; review saved without approval email");
  }

  res.json({ success: true });
});

async function findPendingByToken(token: string) {
  const rows = await db
    .select({ name: reviewsTable.name, rating: reviewsTable.rating, quote: reviewsTable.quote })
    .from(reviewsTable)
    .where(and(eq(reviewsTable.token, token), eq(reviewsTable.approved, false)))
    .limit(1);
  return rows[0];
}

async function findByToken(token: string) {
  const rows = await db
    .select({ name: reviewsTable.name, rating: reviewsTable.rating, quote: reviewsTable.quote })
    .from(reviewsTable)
    .where(eq(reviewsTable.token, token))
    .limit(1);
  return rows[0];
}

// Owner: confirmation page for approving a review (GET is safe — no side effects)
router.get("/reviews/approve", async (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    res.status(400).type("html").send(statusPage("Invalid link", "This approval link is missing its token."));
    return;
  }
  try {
    const review = await findPendingByToken(token);
    if (!review) {
      res.type("html").send(statusPage("Already handled", "This review has already been approved or is no longer available."));
      return;
    }
    res.type("html").send(confirmPage("approve", token, review));
  } catch (err) {
    req.log.error({ err }, "Failed to load review for approval");
    res.status(500).type("html").send(statusPage("Something went wrong", "Could not load the review. Please try again."));
  }
});

// Owner: perform approval (state-changing POST, triggered from confirmation page)
router.post("/reviews/approve", async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  if (!token) {
    res.status(400).type("html").send(statusPage("Invalid request", "This request is missing its token."));
    return;
  }
  try {
    const result = await db
      .update(reviewsTable)
      .set({ approved: true })
      .where(and(eq(reviewsTable.token, token), eq(reviewsTable.approved, false)))
      .returning({ id: reviewsTable.id });
    if (result.length === 0) {
      res.type("html").send(statusPage("Already handled", "This review has already been approved or is no longer available."));
      return;
    }
    res.type("html").send(statusPage("Review approved", "The review is now live on your site. Thank you!"));
  } catch (err) {
    req.log.error({ err }, "Failed to approve review");
    res.status(500).type("html").send(statusPage("Something went wrong", "Could not approve the review. Please try again."));
  }
});

// Owner: confirmation page for rejecting a review (GET is safe — no side effects)
router.get("/reviews/reject", async (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    res.status(400).type("html").send(statusPage("Invalid link", "This link is missing its token."));
    return;
  }
  try {
    const review = await findByToken(token);
    if (!review) {
      res.type("html").send(statusPage("Already handled", "This review has already been removed or is no longer available."));
      return;
    }
    res.type("html").send(confirmPage("reject", token, review));
  } catch (err) {
    req.log.error({ err }, "Failed to load review for rejection");
    res.status(500).type("html").send(statusPage("Something went wrong", "Could not load the review. Please try again."));
  }
});

// Owner: perform rejection (state-changing POST, triggered from confirmation page)
router.post("/reviews/reject", async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  if (!token) {
    res.status(400).type("html").send(statusPage("Invalid request", "This request is missing its token."));
    return;
  }
  try {
    const result = await db
      .delete(reviewsTable)
      .where(eq(reviewsTable.token, token))
      .returning({ id: reviewsTable.id });
    if (result.length === 0) {
      res.type("html").send(statusPage("Already handled", "This review has already been removed or is no longer available."));
      return;
    }
    res.type("html").send(statusPage("Review removed", "The review has been deleted and will not appear on your site."));
  } catch (err) {
    req.log.error({ err }, "Failed to reject review");
    res.status(500).type("html").send(statusPage("Something went wrong", "Could not remove the review. Please try again."));
  }
});

export default router;
