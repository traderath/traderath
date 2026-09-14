/// <reference path="../types.d.ts" />

// Backend-only notification for each new enquiry submission.
//
// The email is sent BEFORE the record is saved. If delivery fails we throw,
// which aborts the save so no orphaned/duplicate enquiry is created and the
// frontend can surface a clean, customer-friendly error. If delivery succeeds
// we call e.next() and the record is persisted as usual.
//
// Mailbox credentials are never exposed to the browser — delivery uses the
// platform's secure built-in mailer ($app.newMailClient()).
onRecordCreateRequest((e) => {
  const r = e.record;

  const company = r.get("company") || "—";
  const email = r.get("email") || "—";
  const phone = r.get("phone") || "—";
  const service = r.get("service_interest") || "—";
  const message = r.get("message") || "—";
  const received = new Date().toUTCString();

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e8eef5;border-radius:12px;overflow:hidden">
      <div style="background:#0C2340;padding:18px 24px">
        <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600">New Website Enquiry — TradeRath</p>
        <p style="margin:4px 0 0;color:#13B8B2;font-size:12px;letter-spacing:.08em;text-transform:uppercase">A visitor submitted the enquiry form</p>
      </div>
      <div style="padding:20px 24px;color:#0C2340;font-size:14px;line-height:1.6">
        <p style="margin:0 0 12px"><strong>Company:</strong> ${company}</p>
        <p style="margin:0 0 12px"><strong>Email:</strong> <a href="mailto:${email}" style="color:#1F5EFF">${email}</a></p>
        <p style="margin:0 0 12px"><strong>Phone:</strong> ${phone}</p>
        <p style="margin:0 0 12px"><strong>Service interest:</strong> ${service}</p>
        <p style="margin:0 0 6px"><strong>Message:</strong></p>
        <div style="background:#F7F9FC;border:1px solid #e8eef5;border-radius:8px;padding:12px 14px;white-space:pre-wrap">${message}</div>
        <p style="margin:16px 0 0;color:#667085;font-size:12px">Received: ${received}</p>
      </div>
    </div>
  `;

  const mailMessage = new MailerMessage({
    from: { name: "TradeRath Website" },
    to: [{ address: "info@traderath.com" }],
    subject: `New enquiry from ${company}`,
    html,
  });

  try {
    $app.newMailClient().send(mailMessage);
  } catch (err) {
    $app
      .logger()
      .error("enquiry notification email failed", "from", email, "err", String(err));
    throw new Error(
      "Your details were received but we couldn't complete the submission. Please try again.",
    );
  }

  e.next();
}, "enquiries");
