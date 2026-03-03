import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInquiryNotification(inquiry: {
  full_name: string;
  email: string;
  phone: string;
  product_name: string;
  message: string | null;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_APP_PASSWORD not set — skipping email notification");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "adarshakk1234@gmail.com";

  console.log("Sending email to:", adminEmail);
  console.log("Inquiry:", inquiry);

  try {
    const result = await transporter.sendMail({
      from: `"MAX 3D Print" <${adminEmail}>`,
      to: adminEmail,
      subject: `New Inquiry: ${inquiry.product_name}`,
      html: `
        <h2>New Product Inquiry</h2>
        <p><strong>Product:</strong> ${inquiry.product_name}</p>
        <p><strong>Name:</strong> ${inquiry.full_name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        ${inquiry.message ? `<p><strong>Message:</strong> ${inquiry.message}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from MAX 3D Printing website</p>
      `,
    });
    console.log("Email sent:", result.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
