import { useState } from "react";

const GROQ_KEY = "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";

const SHREYAAS_CONTEXT = `
You are an AI assistant representing Shreyaas Gupta.

About Shreyaas:
- Full Stack Developer
- Skilled in React, TypeScript, Java, Spring Boot, FastAPI
- Built AI portfolio and multiple backend systems
- Strong in problem solving and scalable backend development
- Seeking internship and full-time roles

Answer professionally and confidently.
`;

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi, I'm Shreyaas AI. Ask anything about me." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SHREYAAS_CONTEXT },
            ...messages,
            userMsg
          ],
          max_tokens: 300,
        }),
      });

      const data = await res.json();

      const reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't respond.";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
    }

    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "Poppins", lineHeight: 1.6 }}>

      {/* HERO */}
      <section style={{ padding: "80px", textAlign: "center", background: "#0f172a", color: "white" }}>
        <h1 style={{ fontSize: "48px" }}>Shreyaas Gupta</h1>
        <p style={{ fontSize: "20px" }}>Full Stack Developer | AI Enthusiast</p>
      </section>

      {/* ABOUT */}
      <section style={{ padding: "50px", textAlign: "center" }}>
        <h2>About Me</h2>
        <p>
          I am a Full Stack Developer skilled in React, TypeScript, Java, Spring Boot, and FastAPI.
          I enjoy building scalable backend systems and AI powered applications.
        </p>
      </section>

      {/* PROJECTS */}
      <section style={{ padding: "50px", background: "#f1f5f9" }}>
        <h2 style={{ textAlign: "center" }}>Projects</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>

          <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px", background: "white" }}>
            <h3>AI Portfolio</h3>
            <p>Portfolio with integrated AI chatbot.</p>
            <p><b>Tech:</b> React, TypeScript, Groq</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px", background: "white" }}>
            <h3>Traffic Monitor</h3>
            <p>Smart traffic monitoring system.</p>
            <p><b>Tech:</b> Java, Backend</p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: "50px", textAlign: "center" }}>
        <h2>Contact</h2>
        <p>Email: shreyaas@example.com</p>
        <p>GitHub: github.com/itsShreyaas</p>
      </section>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "15px",
          borderRadius: "50%",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        💬
      </button>

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "white",
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column"
          }}
        >

          <div style={{ padding: "10px", background: "#2563eb", color: "white" }}>
            Shreyaas AI
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
              </div>
            ))}
            {loading && <div>Thinking...</div>}
          </div>

          <div style={{ display: "flex" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "10px" }}
            />
            <button onClick={sendMessage} style={{ padding: "10px" }}>
              Send
            </button>
          </div>

        </div>
      )}

    </div>
  );
}