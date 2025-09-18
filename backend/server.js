import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/send-emails", upload.single("attachment"), async (req, res) => {
  try {
    const { senderEmail, senderPassword, recipients, subject, message } =
      req.body;
    const attachment = req.file;

    console.log("Email config:", senderEmail, recipients);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    let toList = recipients.split(",").map((e) => e.trim());

    for (let recipient of toList) {
      await transporter.sendMail({
        from: senderEmail,
        to: recipient,
        subject,
        text: message,
        attachments: attachment
          ? [{ filename: attachment.originalname, path: attachment.path }]
          : [],
      });
    }
    if (attachment) fs.unlinkSync(attachment.path);

    res.json({ success: true, message: "Emails sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
