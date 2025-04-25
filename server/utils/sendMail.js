const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail", auth: {
        user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS,
    },
});


const sendOrderConfirmationEmail = async (to, order) => {
    console.log(order)

    const items = order.items.map(item => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join("");

    const mailOptions = {
        from: process.env.EMAIL_USER, to, subject: "Order Confirmation", html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
    <h2 style="color: #4F46E5; text-align: center;">🛍️ Thank you for your order!</h2>
    <p style="font-size: 16px; color: #374151; margin-top: 20px;">Hi there,</p>
    <p style="font-size: 16px; color: #374151;">We’ve received your order and it’s currently being processed. Here are the details:</p>

    <hr style="margin: 20px 0; border-color: #e5e7eb;" />

    <p style="font-size: 16px;"><strong>Order ID:</strong> <span style="color: #4F46E5;">${order._id}</span></p>
    <p style="font-size: 16px;"><strong>Status:</strong> <span style="color: #10B981;">${order.status}</span></p>

    <h4 style="margin-top: 20px; font-size: 18px; color: #111827;">🧾 Items Ordered:</h4>
    <ul style="padding-left: 20px; color: #374151;">
      ${items}
    </ul>

    <p style="font-size: 16px; margin-top: 20px;"><strong>Total:</strong> <span style="color: #111827;">₹${order.total ?? 'N/A'}</span></p>

    <hr style="margin: 30px 0; border-color: #e5e7eb;" />

    <p style="font-size: 14px; color: #6B7280;">If you have any questions, just reply to this email—we’re always happy to help.</p>
    <p style="font-size: 14px; color: #6B7280;">– The Team</p>
  </div>
`,

    };

    await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (user, token) => {

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
        to: user.email, from: process.env.EMAIL_USER, subject: 'Password Reset', html: `
            <p>You requested a password reset</p>
            <p>Click <a href="${resetLink}">here</a> to reset your password</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {sendOrderConfirmationEmail, sendResetPasswordEmail};