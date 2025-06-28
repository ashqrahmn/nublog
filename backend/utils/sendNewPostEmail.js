import jwt from 'jsonwebtoken';
import EmailModel from '../models/EmailModel.js';

export async function sendNewPostEmail({ id, title, category, image }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable is NOT defined!');
    return;
  }

  if (!siteUrl) {
    console.error('NEXT_PUBLIC_SITE_URL environment variable is NOT defined!');
    return;
  }

  try {
    const subscribers = await EmailModel.find({});

    if (!subscribers.length) {
      console.log('ℹ️ No subscribers found. Skipping new post email.');
      return;
    }

    for (const user of subscribers) {
      const token = jwt.sign({ email: user.email }, jwtSecret, {
        expiresIn: '10m',
      });
      const unsubscribeLink = `${siteUrl}/unsubscribe?token=${token}`;

      const response = await fetch(process.env.BREVO_API_URL, {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL,
          },
          to: [{ email: user.email }],
          subject: `📰 ${title} - A Must Read in ${category}`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
              <h2 style="color: #66825a;">🚀 New Blog in ${category}</h2>
              <p style="font-size: 16px;">Hi there,</p>
              <p style="font-size: 15px; line-height: 1.6;">
                We've just published a new blog post, and we think you'll enjoy it!
              </p>
              <h3 style="color: #333;">${title}</h3>
              <a href="${siteUrl}/blogs/${id}" target="_blank">
                <img src="${image}" alt="${title}" style="width: 100%; max-width: 520px; border-radius: 8px; margin: 20px 0;" />
              </a>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/blogs/${id}" style="background-color: #66825a; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                  Read Full Blog
                </a>
              </div>
              <hr style="margin: 40px 0;" />
              <p style="font-size: 13px; color: #999; text-align: center;">
                You’re receiving this email because you subscribed to NuBlog updates.<br />
                <a href="${unsubscribeLink}" style="color: #888; text-decoration: underline;">
                  Unsubscribe
                </a>
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to send email to ${user.email}`, await response.text());
      } else {
        console.log(`New post email sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Error sending new post emails:', error);
  }
}