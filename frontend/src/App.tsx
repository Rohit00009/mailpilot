import { useState } from "react";
import Logo from "./assets/Logo.png";

function App() {
  const [form, setForm] = useState({
    senderEmail: "",
    senderPassword: "",
    recipients: "",
    subject: "",
    message: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (attachment) data.append("attachment", attachment);

    try {
      const res = await fetch("http://localhost:5000/send-emails", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setStatus(
        result.success ? "Emails sent successfully!" : "Something went wrong!"
      );
    } catch {
      setStatus("Error while sending emails");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-200 to-red-300">
      <form
        onSubmit={handleSubmit}
        className="bg-[#e0e0e0] p-6 rounded-2xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] w-[90%] max-w-lg h-[90%] flex flex-col space-y-3 overflow-hidden"
      >
        <div className="flex items-center justify-center">
          <img src={Logo} alt="Mailer Logo" className="h-16 object-contain" />
        </div>

        <input
          name="senderEmail"
          type="email"
          placeholder="Your Email"
          value={form.senderEmail}
          onChange={handleChange}
          className="p-3 rounded-xl bg-[#e0e0e0] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
          required
        />

        <input
          name="senderPassword"
          type="password"
          placeholder="App Password"
          value={form.senderPassword}
          onChange={handleChange}
          className="p-3 rounded-xl bg-[#e0e0e0] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
          required
        />

        <textarea
          name="recipients"
          placeholder="Recipients (comma separated)"
          value={form.recipients}
          onChange={handleChange}
          className="p-3 rounded-xl bg-[#e0e0e0] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex-1 focus:outline-none resize-none"
          required
        />

        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="p-3 rounded-xl bg-[#e0e0e0] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
          required
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="p-3 rounded-xl bg-[#e0e0e0] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex-1 focus:outline-none resize-none"
          required
        />

        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                     file:rounded-full file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-[#e0e0e0] file:text-gray-700"
        />

        <button
          type="submit"
          className="bg-[#e0e0e0] text-gray-700 font-semibold px-4 py-3 rounded-xl w-full 
          shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] 
          active:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all"
        >
          Send
        </button>

        <p className="text-sm text-center text-gray-600">{status}</p>
      </form>
    </div>
  );
}

export default App;
