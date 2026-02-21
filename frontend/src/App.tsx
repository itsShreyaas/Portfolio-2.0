import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! 👋 I'm Shreyaas's portfolio assistant. Ask me anything about his skills, projects, or experience!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, couldn't reach the server!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed", bottom: "2.5rem", right: "2.5rem",
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, #b74b4b, #ff6b6b)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(183,75,75,0.6)", zIndex: 1000,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: "7rem", right: "2.5rem",
          width: "360px", height: "480px",
          background: "#0d0d0d",
          border: "1px solid rgba(183,75,75,0.4)",
          borderRadius: "1.5rem",
          display: "flex", flexDirection: "column",
          zIndex: 999,
          boxShadow: "0 0 60px rgba(183,75,75,0.2)",
          overflow: "hidden",
          animation: "slideUp 0.3s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "1.2rem 1.5rem",
            background: "linear-gradient(135deg, rgba(183,75,75,0.3), rgba(183,75,75,0.1))",
            borderBottom: "1px solid rgba(183,75,75,0.3)",
            display: "flex", alignItems: "center", gap: "0.8rem",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #b74b4b, #ff6b6b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: "bold", color: "white",
            }}>S</div>
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "0.95rem" }}>Shreyaas's Assistant</div>
              <div style={{ color: "#b74b4b", fontSize: "0.75rem" }}>● Online</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "1rem",
            display: "flex", flexDirection: "column", gap: "0.8rem",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "0.75rem 1rem",
                  borderRadius: m.role === "user" ? "1.2rem 1.2rem 0.2rem 1.2rem" : "1.2rem 1.2rem 1.2rem 0.2rem",
                  background: m.role === "user" ? "linear-gradient(135deg, #b74b4b, #d45555)" : "rgba(255,255,255,0.06)",
                  border: m.role === "assistant" ? "1px solid rgba(183,75,75,0.2)" : "none",
                  color: "white", fontSize: "0.88rem", lineHeight: "1.5",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "0.4rem", padding: "0.5rem" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#b74b4b",
                    animation: `bounce 1s ease ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding: "1rem", borderTop: "1px solid rgba(183,75,75,0.2)",
            display: "flex", gap: "0.6rem",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(183,75,75,0.3)",
                borderRadius: "2rem", color: "white",
                fontSize: "0.88rem", outline: "none",
              }}
            />
            <button onClick={send} disabled={loading} style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: loading ? "#555" : "linear-gradient(135deg, #b74b4b, #ff6b6b)",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const roles = ["Web Developer", "Software Designer", "Programmer", "Software Developer"];
  const roleIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    const tick = () => {
      const current = roles[roleIndex.current];
      if (!deleting.current) {
        setTypedText(current.slice(0, charIndex.current + 1));
        charIndex.current++;
        if (charIndex.current === current.length) {
          deleting.current = true;
          setTimeout(tick, 1500);
          return;
        }
      } else {
        setTypedText(current.slice(0, charIndex.current - 1));
        charIndex.current--;
        if (charIndex.current === 0) {
          deleting.current = false;
          roleIndex.current = (roleIndex.current + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting.current ? 60 : 100);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sections = ["home", "skills", "education", "experience", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = ["home", "skills", "education", "experience", "contact"];

  const skills = [
    { name: "HTML/CSS", icon: "🌐" },
    { name: "JavaScript", icon: "⚡" },
    { name: "C / C++", icon: "⚙️" },
    { name: "Python", icon: "🐍" },
    { name: "Java", icon: "☕" },
    { name: "Git & GitHub", icon: "🔗" },
    { name: "MySQL", icon: "🗄️" },
    { name: "Linux", icon: "🐧" },
  ];

  const projects = [
    {
      title: "Speech Emotion Classification",
      tag: "Research · Ongoing",
      desc: "End-to-end audio pipeline for speech emotion recognition using MFCC features and ML models.",
      tech: ["Python", "Audio ML", "EDA"],
    },
    {
      title: "CacheLab – CPU Cache Simulator",
      tag: "Systems · C++",
      desc: "Simulates FIFO, LRU, LFU cache algorithms with dynamic hit/miss rate visualization.",
      tech: ["C++", "Algorithms", "Visualization"],
    },
    {
      title: "Traffic Routing Engine",
      tag: "Graph Algorithms",
      desc: "Graph-based routing with BFS, DFS, Dijkstra. Benchmarks performance under varying traffic loads.",
      tech: ["C++", "Graphs", "Benchmarking"],
    },
    {
      title: "Personal Portfolio Website",
      tag: "Full Stack · Live",
      desc: "This very site! Full-stack developer portfolio with an AI-powered chatbot assistant.",
      tech: ["React", "FastAPI", "OpenRouter AI"],
    },
  ];

  return (
    <div style={{ background: "#080808", color: "white", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #b74b4b; border-radius: 2px; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(183,75,75,0.4); }
          50% { box-shadow: 0 0 40px rgba(183,75,75,0.8); }
        }
        .nav-link {
          color: rgba(255,255,255,0.7); text-decoration: none;
          font-size: 0.95rem; font-weight: 500; cursor: pointer;
          padding: 0.4rem 0; border-bottom: 2px solid transparent;
          transition: all 0.3s ease; background: none;
          border-top: none; border-left: none; border-right: none;
        }
        .nav-link:hover, .nav-link.active { color: #b74b4b; border-bottom-color: #b74b4b; }
        .skill-card {
          border: 1px solid rgba(183,75,75,0.25); border-radius: 1rem;
          padding: 2rem 1.5rem; text-align: center;
          background: rgba(183,75,75,0.04); transition: all 0.3s ease; cursor: default;
        }
        .skill-card:hover {
          background: rgba(183,75,75,0.12); border-color: #b74b4b;
          transform: translateY(-4px); box-shadow: 0 8px 30px rgba(183,75,75,0.2);
        }
        .project-card {
          border: 1px solid rgba(183,75,75,0.2); border-radius: 1.2rem;
          padding: 2rem; background: rgba(255,255,255,0.02); transition: all 0.3s ease;
        }
        .project-card:hover {
          border-color: rgba(183,75,75,0.6); background: rgba(183,75,75,0.06);
          transform: translateY(-4px); box-shadow: 0 12px 40px rgba(183,75,75,0.15);
        }
        .social-btn {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid rgba(183,75,75,0.5); background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease; text-decoration: none; color: white;
        }
        .social-btn:hover {
          background: rgba(183,75,75,0.2); border-color: #b74b4b;
          box-shadow: 0 0 15px rgba(183,75,75,0.4); transform: translateY(-2px);
        }
        .btn-primary {
          padding: 0.8rem 2.5rem; background: transparent;
          border: 2px solid #b74b4b; border-radius: 3rem;
          color: #b74b4b; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.05rem;
        }
        .btn-primary:hover {
          background: #b74b4b; color: white;
          box-shadow: 0 0 25px rgba(183,75,75,0.5); transform: scale(1.03);
        }
        .contact-input {
          width: 100%; padding: 1rem 1.2rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(183,75,75,0.3);
          border-radius: 0.8rem; color: white;
          font-size: 0.95rem; outline: none;
          transition: border-color 0.3s; font-family: inherit;
        }
        .contact-input:focus { border-color: #b74b4b; background: rgba(183,75,75,0.05); }
        .cursor-blink {
          display: inline-block; width: 2px; height: 1.2em;
          background: #b74b4b; margin-left: 2px; vertical-align: middle;
          animation: blink 0.7s step-end infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      {/* HEADER */}
      <header style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        padding: "1.2rem 6%",
        background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(183,75,75,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#b74b4b", cursor: "pointer" }}
          onClick={() => scrollTo("home")}>
          Shreyaas
        </span>
        <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {navLinks.map(link => (
            <button key={link} className={`nav-link ${activeSection === link ? "active" : ""}`}
              onClick={() => scrollTo(link)} style={{ textTransform: "capitalize" }}>
              {link}
            </button>
          ))}
        </nav>
      </header>

      {/* HOME */}
      <section id="home" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "8rem 6% 5rem", gap: "5rem", animation: "fadeInUp 0.8s ease",
      }}>
        <div style={{ flex: 1, maxWidth: "600px" }}>
          <p style={{ color: "#b74b4b", fontSize: "1rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Welcome to my portfolio
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: "800", lineHeight: 1.15, marginBottom: "1rem" }}>
            Hi, I'm <span style={{ color: "#b74b4b" }}>Shreyaas</span>
          </h1>
          <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: "400", color: "rgba(255,255,255,0.7)", marginBottom: "1.5rem", minHeight: "2.5rem" }}>
            I'm a <span style={{ color: "#b74b4b", fontWeight: "600" }}>{typedText}</span>
            <span className="cursor-blink"/>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "480px" }}>
            Second-year B.Tech CSE student at SRM University. I build system simulators, algorithmic engines, data pipelines, and web apps. CGPA: <span style={{ color: "#b74b4b", fontWeight: "600" }}>8.8/10</span>
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <a 
              href="https://mail.google.com/mail/?view=cm&to=shreyaasgupta280@gmail.com" 
              target="_blank"
              rel="noreferrer"
              className="btn-primary" 
              style={{ textDecoration: "none" }}
             >
             Hire Me
            </a>
            <button className="btn-primary" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }}
              onClick={() => scrollTo("skills")}>View Work</button>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
            <a href="https://github.com/itsShreyaas" target="_blank" rel="noreferrer" className="social-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/shreyaas-gupta-35896a324/" target="_blank" rel="noreferrer" className="social-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.instagram.com/shreyaas._.g/" target="_blank" rel="noreferrer" className="social-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: "320px", height: "320px", borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(183,75,75,0.3), rgba(183,75,75,0.05))",
            border: "3px solid rgba(183,75,75,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "float 4s ease-in-out infinite, glow 3s ease-in-out infinite",
            overflow: "hidden",
          }}>
            <img src="/images/shreyaas.jpeg" alt="Shreyaas"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ minHeight: "100vh", padding: "8rem 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: "#b74b4b", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>What I know</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", textAlign: "center", marginBottom: "4rem" }}>
          My <span style={{ color: "#b74b4b" }}>Skills</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto 5rem", width: "100%" }}>
          {skills.map(s => (
            <div key={s.name} className="skill-card">
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: "600" }}>{s.name}</div>
            </div>
          ))}
        </div>

        <p style={{ color: "#b74b4b", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>What I've built</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", textAlign: "center", marginBottom: "3rem" }}>
          My <span style={{ color: "#b74b4b" }}>Projects</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
          {projects.map(p => (
            <div key={p.title} className="project-card">
              <p style={{ color: "#b74b4b", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{p.tag}</p>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "0.8rem" }}>{p.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "1.2rem" }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {p.tech.map(t => (
                  <span key={t} style={{
                    padding: "0.25rem 0.8rem",
                    background: "rgba(183,75,75,0.12)",
                    border: "1px solid rgba(183,75,75,0.25)",
                    borderRadius: "2rem", fontSize: "0.78rem", color: "#b74b4b", fontWeight: "500",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
<section id="education" style={{ minHeight: "60vh", padding: "8rem 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
  <p style={{ color: "#b74b4b", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>Academic background</p>
  <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", textAlign: "center", marginBottom: "4rem" }}>
    My <span style={{ color: "#b74b4b" }}>Education</span>
  </h2>
  <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
    {[
      { title: "B.Tech in Computer Science & Engineering", sub: "SRM Institute of Science & Technology, Chennai", detail: "CGPA: 8.8/10 · 2024 – 2028 (Expected)" },
      { title: "Non-Medical (Class XII)", sub: "ASAM Memorial Senior Secondary School, Chennai", detail: "2022 – 2024" },
    ].map(e => (
      <div key={e.title} style={{
        paddingLeft: "2rem",
        paddingTop: "1.2rem",
        paddingBottom: "1.2rem",
        paddingRight: "2rem",
        background: "rgba(183,75,75,0.04)",
        borderRadius: "0 1rem 1rem 0",
        border: "1px solid rgba(183,75,75,0.2)",
        borderLeft: "4px solid #b74b4b",
      }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#b74b4b", marginBottom: "0.4rem" }}>{e.title}</h3>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.3rem" }}>{e.sub}</p>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>{e.detail}</p>
      </div>
    ))}
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "rgba(255,255,255,0.8)" }}>Certifications</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {["NPTEL: Java Programming (91%)", "NPTEL: OOP Fundamentals (81%)", "Udemy: Java Beginner to Master"].map(c => (
          <span key={c} style={{
            padding: "0.5rem 1rem",
            border: "1px solid rgba(183,75,75,0.3)",
            borderRadius: "2rem",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.7)",
            background: "rgba(183,75,75,0.06)",
          }}>{c}</span>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ minHeight: "60vh", padding: "8rem 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: "#b74b4b", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>What I've done</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", textAlign: "center", marginBottom: "4rem" }}>
          My <span style={{ color: "#b74b4b" }}>Experience</span>
        </h2>
        <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%" }}>
          <div style={{
            paddingLeft: "2rem", paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingRight: "2rem",
            background: "rgba(183,75,75,0.04)", borderRadius: "0 1rem 1rem 0",
            border: "1px solid rgba(183,75,75,0.2)", borderLeft: "4px solid #b74b4b",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#b74b4b" }}>Research Intern (UROP)</h3>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", background: "rgba(183,75,75,0.1)", padding: "0.3rem 0.8rem", borderRadius: "2rem" }}>Ongoing</span>
            </div>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", marginTop: "0.5rem", lineHeight: 1.7 }}>
              Built and trained a machine learning model to classify human emotions from speech as part of a University Research Opportunities Program (UROP). Involved end-to-end pipeline design, feature extraction (MFCC), and EDA.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ minHeight: "80vh", padding: "8rem 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: "#b74b4b", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>Get in touch</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", textAlign: "center", marginBottom: "1rem" }}>
          My <span style={{ color: "#b74b4b" }}>Contact</span>
        </h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginBottom: "3rem" }}>
          Looking for a Summer 2026 internship. Let's talk!
        </p>
        <form
          style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.2rem", width: "100%" }}
          onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}
        >
          <input className="contact-input" type="text" placeholder="Your Name" required />
          <input className="contact-input" type="email" placeholder="Your Email" required />
          <textarea className="contact-input" placeholder="Your Message" rows={5} required style={{ resize: "vertical" }} />
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>Send Message</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "2rem 6%", borderTop: "1px solid rgba(183,75,75,0.15)",
        textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.88rem",
      }}>
        © 2025 Shreyaas Gupta · Built with React + FastAPI + ❤️
      </footer>

      <ChatBot />
    </div>
  );
}