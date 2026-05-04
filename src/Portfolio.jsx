import { useEffect, useRef, useState } from "react";

const SECTIONS = ["inicio", "proyecto", "base-de-datos", "automatizaciones", "plantillas", "panel-admin", "infraestructura", "herramientas", "contacto"];

const T = {
  es: {
    nav: ["Inicio","Proyecto","BD","Auto","Plantillas","Admin","Infra","Apps","Contacto"],
    tagline: "> full stack developer · automatizaciones con Claude AI",
    heroDesc: "Construí un e-commerce completo para una librería real — desde el schema SQL hasta los mensajes automáticos de WhatsApp. Todo en producción.",
    heroBtnProj: "Ver el proyecto",
    heroBtnLive: "Ver sitio en vivo →",
    heroBtnGH: "GitHub →",
    s01label: "01 — El proyecto", s01title: "Librería Natsu",
    s01what: "¿Qué es?",
    s01whatDesc: "E-commerce completo para una librería y papelería en Mar del Plata. 1142 productos reales, carrito funcional, panel de administración y automatizaciones que corren 24/7 en un VPS de producción.",
    s01stack: "Stack",
    s02label: "02 — Base de datos", s02title: "Schema MySQL",
    s02tables: "Tablas principales",
    s02fix: "Fix encoding real",
    s02coalesce: "COALESCE para métricas",
    s02note: "El charset fue el mayor desafío: los datos del Excel original tenían doble encoding UTF-8. Se corrigieron 15 productos manualmente y el resto con scripts Node.js + queries SQL con REPLACE hexadecimal. charset: 'utf8mb4' + SET NAMES utf8mb4 en cada conexión.",
    s03label: "03 — Automatizaciones", s03title: "n8n + WhatsApp",
    f1: "Flujo 1 — Pedido nuevo", f2: "Flujo 2 — Pedido listo",
    f3: "Flujo 3 — Alerta stock bajo", f4: "Flujo 4 — Reporte diario",
    f1s1:"POST /pedidos", f1s2:"Wasender", f1s3:"Cliente",
    f2s1:"estado=listo", f2s2:"Wasender",
    f3s1:"Schedule 23hs", f3s2:"MySQL query", f3s3:"Admin WA",
    f4s1:"Schedule 22hs", f4s2:"SQL métricas", f4s3:"Admin WA",
    normTitle: "Normalización de teléfonos",
    s04label: "04 — Panel Admin", s04title: "Dashboard + Stock",
    kpiTitle: "KPIs en tiempo real",
    metTitle: "Endpoint /api/metricas",
    stockTitle: "Gestión de stock inline",
    stockDesc: "Click en ✏️ → input tipo texto con inputMode numérico → Enter para guardar. Se eliminó el type=\"number\" para evitar el bug del spinner nativo.",
    selTitle: "Selección múltiple con Set",
    s05label: "05 — Infraestructura", s05title: "Docker + VPS",
    infraTitle: "Stack en producción",
    deployTitle: "Deploy en un comando",
    composeTitle: "docker-compose.yml",
    ctaTitle: "¿Querés ver el código?",
    s06label: "06 — Apps de aprendizaje", s06title: "Herramientas & Simuladores",
    s06desc: "Apps standalone construidas para estudiar, practicar y prepararse para entrevistas técnicas.",
    ctaDesc: "Todo el proyecto está en GitHub, con documentación TP01–TP07 que explica cada decisión técnica.",
    ctaBtnLive: "Ver sitio en vivo →",
    ctaBtnGH: "Ver en GitHub →",
  },
  en: {
    nav: ["Home","Project","DB","Auto","Templates","Admin","Infra","Apps","Contact"],
    tagline: "> full stack developer · automations with Claude AI",
    heroDesc: "Built a complete e-commerce for a real stationery store — from the SQL schema to automatic WhatsApp messages. Everything in production.",
    heroBtnProj: "See the project",
    heroBtnLive: "See live site →",
    heroBtnGH: "GitHub →",
    s01label: "01 — The project", s01title: "Librería Natsu",
    s01what: "What is it?",
    s01whatDesc: "Full e-commerce for a stationery store in Mar del Plata, Argentina. 1142 real products, functional cart, admin panel and automations running 24/7 on a production VPS.",
    s01stack: "Stack",
    s02label: "02 — Database", s02title: "MySQL Schema",
    s02tables: "Main tables",
    s02fix: "Real encoding fix",
    s02coalesce: "COALESCE for metrics",
    s02note: "Charset was the biggest challenge: the original Excel data had double UTF-8 encoding. 15 products were fixed manually and the rest with Node.js scripts + SQL queries with hexadecimal REPLACE. charset: 'utf8mb4' + SET NAMES utf8mb4 on each connection.",
    s03label: "03 — Automations", s03title: "n8n + WhatsApp",
    f1: "Flow 1 — New order", f2: "Flow 2 — Order ready",
    f3: "Flow 3 — Low stock alert", f4: "Flow 4 — Daily report",
    f1s1:"POST /orders", f1s2:"Wasender", f1s3:"Customer",
    f2s1:"status=ready", f2s2:"Wasender",
    f3s1:"Schedule 11pm", f3s2:"MySQL query", f3s3:"Admin WA",
    f4s1:"Schedule 10pm", f4s2:"SQL metrics", f4s3:"Admin WA",
    normTitle: "Phone number normalization",
    s04label: "04 — Admin Panel", s04title: "Dashboard + Stock",
    kpiTitle: "Real-time KPIs",
    metTitle: "Endpoint /api/metrics",
    stockTitle: "Inline stock management",
    stockDesc: "Click ✏️ → text input with numeric inputMode → Enter to save. Removed type=\"number\" to avoid native spinner bug.",
    selTitle: "Multi-select with Set",
    s05label: "05 — Infrastructure", s05title: "Docker + VPS",
    infraTitle: "Production stack",
    deployTitle: "Deploy in one command",
    composeTitle: "docker-compose.yml",
    ctaTitle: "Want to see the code?",
    s06label: "06 — Learning Apps", s06title: "Tools & Simulators",
    s06desc: "Standalone apps built to study, practice, and prepare for technical interviews.",
    ctaDesc: "The full project is on GitHub, with TP01–TP07 documentation explaining every technical decision.",
    ctaBtnLive: "See live site →",
    ctaBtnGH: "View on GitHub →",
  }
};

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.dx = (Math.random() * 0.4) - 0.2;
        this.dy = (Math.random() * 0.4) - 0.2;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100,160,255,0.7)";
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
        if (mouse.x !== null) {
          const ddx = mouse.x - this.x, ddy = mouse.y - this.y;
          const dist = Math.sqrt(ddx*ddx + ddy*ddy);
          if (dist < mouse.radius) {
            const f = (mouse.radius - dist) / mouse.radius;
            this.x -= (ddx/dist) * f * 3;
            this.y -= (ddy/dist) * f * 3;
          }
        }
        this.x += this.dx; this.y += this.dy;
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const n = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < n; i++) particles.push(new Particle());
    };

    const connect = () => {
      const maxDist = (canvas.width / 7) * (canvas.height / 7);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d = dx*dx + dy*dy;
          if (d < maxDist) {
            const op = 1 - d / maxDist;
            ctx.strokeStyle = `rgba(74,158,255,${op * 0.3})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connect();
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onOut = () => { mouse.x = null; mouse.y = null; };

    resize(); animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);
}

function Tag({ children }) {
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"4px", fontSize:"12px", fontFamily:"'JetBrains Mono',monospace", background:"rgba(120,180,255,0.12)", color:"#7eb8ff", border:"1px solid rgba(120,180,255,0.25)", marginRight:"6px", marginBottom:"6px" }}>{children}</span>;
}

function SectionTitle({ label, title }) {
  return (
    <div style={{ marginBottom:"2.5rem" }}>
      <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono',monospace", color:"#4a9eff", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"0.75rem" }}>{label}</div>
      <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#eef2ff", margin:0, lineHeight:1.1 }}>{title}</h2>
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div style={{
      background:"rgba(15,20,40,0.7)",
      border:`1px solid ${accent || "rgba(74,158,255,0.2)"}`,
      borderRadius:"16px",
      padding:"1.5rem",
      backdropFilter:"blur(12px)",
      transition:"border-color 0.3s",
    }}>
      {children}
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre style={{
      background:"rgba(0,0,0,0.5)",
      border:"1px solid rgba(74,158,255,0.15)",
      borderRadius:"10px",
      padding:"1rem 1.25rem",
      fontFamily:"'JetBrains Mono',monospace",
      fontSize:"12px",
      color:"#a8c8ff",
      overflowX:"auto",
      margin:0,
      lineHeight:1.6,
    }}>{code}</pre>
  );
}

function StatBadge({ value, label }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#4a9eff", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"12px", color:"rgba(200,215,255,0.6)", marginTop:"4px", fontFamily:"'JetBrains Mono',monospace" }}>{label}</div>
    </div>
  );
}

function FlowStep({ icon, label, sub, color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", flex:1 }}>
      <div style={{ width:"52px", height:"52px", borderRadius:"12px", background:`rgba(${color},0.15)`, border:`1px solid rgba(${color},0.3)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{icon}</div>
      <div style={{ fontSize:"13px", fontWeight:600, color:"#eef2ff", textAlign:"center" }}>{label}</div>
      {sub && <div style={{ fontSize:"11px", color:"rgba(200,215,255,0.5)", textAlign:"center", fontFamily:"'JetBrains Mono',monospace" }}>{sub}</div>}
    </div>
  );
}

function Arrow() {
  return <div style={{ color:"rgba(74,158,255,0.4)", fontSize:"20px", alignSelf:"center", flexShrink:0 }}>→</div>;
}

export default function Portfolio() {
  const canvasRef = useRef(null);
  const [active, setActive] = useState("inicio");
  const [lang, setLang] = useState("es");
  const t = T[lang];
  useParticles(canvasRef);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setActive(id);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const sectionStyle = {
    minHeight:"100vh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    padding:"6rem clamp(1.5rem,6vw,8rem)",
    position:"relative",
    zIndex:1,
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:"#060a18", color:"#c8d7ff", minHeight:"100vh" }}>

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Particles canvas — hero only */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <canvas ref={canvasRef} style={{ width:"100%", height:"100%" }} />
      </div>

      {/* Nav */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"1rem clamp(1.5rem,6vw,8rem)",
        background:"rgba(6,10,24,0.7)",
        backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(74,158,255,0.1)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#eef2ff", letterSpacing:"-0.02em" }}>
            SA<span style={{ color:"#4a9eff" }}>.</span>dev
          </div>
          <button onClick={() => setLang(l => l==="es" ? "en" : "es")} style={{
            background:"rgba(74,158,255,0.1)",
            border:"1px solid rgba(74,158,255,0.3)",
            borderRadius:"6px",
            cursor:"pointer",
            fontSize:"12px",
            fontFamily:"'JetBrains Mono',monospace",
            color:"#4a9eff",
            padding:"4px 10px",
            transition:"all 0.2s",
          }}>{lang === "es" ? "EN" : "ES"}</button>
        </div>
        <div style={{ display:"flex", gap:"clamp(0.8rem,2vw,2rem)", alignItems:"center" }}>
          {SECTIONS.map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontSize:"13px", fontFamily:"'JetBrains Mono',monospace",
              color: active===id ? "#4a9eff" : "rgba(200,215,255,0.5)",
              padding:"4px 0",
              borderBottom: active===id ? "1px solid #4a9eff" : "1px solid transparent",
              transition:"all 0.2s",
            }}>{t.nav[i]}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="inicio" style={{ ...sectionStyle, minHeight:"100vh", justifyContent:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:"800px" }}>
          <div style={{ fontSize:"13px", fontFamily:"'JetBrains Mono',monospace", color:"#4a9eff", letterSpacing:"0.2em", marginBottom:"1.5rem", opacity:0.8 }}>
            {t.tagline}
          </div>
          <h1 style={{
            fontSize:"clamp(3rem,8vw,6rem)",
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            color:"#eef2ff",
            margin:"0 0 1rem",
            lineHeight:1.0,
            letterSpacing:"-0.03em",
          }}>
            Santiago<br />
            <span style={{ color:"#4a9eff" }}>Acquisto</span>
          </h1>
          <p style={{ fontSize:"clamp(1rem,2vw,1.2rem)", color:"rgba(200,215,255,0.65)", maxWidth:"520px", lineHeight:1.7, margin:"0 0 2.5rem", fontWeight:300 }}>
            {t.heroDesc}
          </p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => scrollTo("proyecto")} style={{
              padding:"0.8rem 2rem", borderRadius:"8px",
              background:"#4a9eff", color:"#060a18",
              border:"none", cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", fontWeight:500,
              transition:"transform 0.2s, box-shadow 0.2s",
            }} onMouseEnter={e=>e.target.style.transform="translateY(-2px)"} onMouseLeave={e=>e.target.style.transform="none"}>
              {t.heroBtnProj}
            </button>
            <a href="https://librerianatsu.com" target="_blank" rel="noopener" style={{
              padding:"0.8rem 2rem", borderRadius:"8px",
              background:"transparent", color:"#34d399",
              border:"1px solid rgba(52,211,153,0.35)",
              textDecoration:"none",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"13px",
              display:"flex", alignItems:"center", gap:"6px",
            }}>
              {t.heroBtnLive}
            </a>
            <a href="https://github.com/SantiagoAcquisto/libreria-ecommerce" target="_blank" rel="noopener" style={{
              padding:"0.8rem 2rem", borderRadius:"8px",
              background:"transparent", color:"#eef2ff",
              border:"1px solid rgba(74,158,255,0.3)",
              textDecoration:"none",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"13px",
              display:"flex", alignItems:"center", gap:"6px",
            }}>
              {t.heroBtnGH}
            </a>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:"2rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity:0.4 }}>
          <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.15em" }}>SCROLL</div>
          <div style={{ width:"1px", height:"40px", background:"linear-gradient(to bottom, #4a9eff, transparent)" }} />
        </div>
      </section>

      {/* PROYECTO */}
      <section id="proyecto" style={{ ...sectionStyle, background:"rgba(6,10,24,0.95)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s01label} title={t.s01title} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem", marginBottom:"2.5rem" }}>
            <Card>
              <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.s01what}</div>
              <p style={{ fontSize:"15px", lineHeight:1.7, color:"rgba(200,215,255,0.8)", margin:0 }}>
                {t.s01whatDesc}
              </p>
            </Card>
            <Card>
              <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.s01stack}</div>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {["React 18","Vite","Express.js","MySQL 8","Docker","Traefik","n8n","PM2","Wasender API"].map(s => <Tag key={s}>{s}</Tag>)}
              </div>
            </Card>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1rem" }}>
            {[["1142","productos","#4a9eff"],["27","categorías","#a78bfa"],["827","con imagen real","#34d399"],["5","flujos n8n","#f59e0b"]].map(([v,l,c]) => (
              <div key={l} style={{ background:"rgba(15,20,40,0.8)", border:`1px solid ${c}33`, borderRadius:"12px", padding:"1.25rem", textAlign:"center" }}>
                <div style={{ fontSize:"2.2rem", fontFamily:"'Syne',sans-serif", fontWeight:800, color:c }}>{v}</div>
                <div style={{ fontSize:"12px", color:"rgba(200,215,255,0.5)", fontFamily:"'JetBrains Mono',monospace", marginTop:"4px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BASE DE DATOS */}
      <section id="base-de-datos" style={{ ...sectionStyle }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s02label} title={t.s02title} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem", marginBottom:"2rem" }}>
            <Card>
              <div style={{ fontSize:"13px", color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.s02tables}</div>
              {[
                ["categorias","id, nombre"],
                ["productos","id, nombre, precio, stock, cod_proveedor, imagen_url, categoria_id"],
                ["pedidos","id, cliente, telefono, total, estado ENUM, creado_en"],
                ["pedido_items","pedido_id, producto_id, cantidad, precio_unit"],
                ["alertas_stock","producto_id, stock_minimo"],
              ].map(([tb,cols]) => (
                <div key={tb} style={{ marginBottom:"0.75rem" }}>
                  <div style={{ fontSize:"13px", fontWeight:500, color:"#c4b5fd", fontFamily:"'JetBrains Mono',monospace" }}>{tb}</div>
                  <div style={{ fontSize:"11px", color:"rgba(200,215,255,0.4)", fontFamily:"'JetBrains Mono',monospace", paddingLeft:"0.75rem" }}>{cols}</div>
                </div>
              ))}
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <Card accent="rgba(167,139,250,0.2)">
                <div style={{ fontSize:"13px", color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.s02fix}</div>
                <CodeBlock code={`-- Productos con doble encoding\nUPDATE productos\nSET nombre = REPLACE(nombre, 0xC2BA, 'º')\nWHERE nombre LIKE '%Ã%';\n\n-- Fix Ñ con Node.js\nname.replaceAll('ARAÃ\\u2018A', 'ARAÑA')`} />
              </Card>
              <Card accent="rgba(167,139,250,0.2)">
                <div style={{ fontSize:"13px", color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.s02coalesce}</div>
                <CodeBlock code={`SELECT \n  COALESCE(SUM(total), 0) AS facturacion,\n  COALESCE(AVG(total), 0) AS ticket_promedio\nFROM pedidos\nWHERE estado NOT IN ('cancelado')\n  AND DATE(creado_en) = CURDATE();`} />
              </Card>
            </div>
          </div>
          <div style={{ background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:"12px", padding:"1rem 1.25rem" }}>
            <div style={{ fontSize:"13px", color:"rgba(200,215,255,0.6)", lineHeight:1.7 }}>{t.s02note}</div>
          </div>
        </div>
      </section>

      {/* AUTOMATIZACIONES */}
      <section id="automatizaciones" style={{ ...sectionStyle, background:"rgba(6,10,24,0.95)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s03label} title={t.s03title} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem", marginBottom:"2rem" }}>
            <Card accent="rgba(52,211,153,0.2)">
              <div style={{ fontSize:"13px", color:"#34d399", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.f1}</div>
              <div style={{ display:"flex", gap:"8px", alignItems:"stretch", flexWrap:"wrap" }}>
                <FlowStep icon="🛒" label={t.f1s1} sub="Express API" color="52,211,153" />
                <Arrow />
                <FlowStep icon="📨" label={t.f1s2} sub="WhatsApp API" color="52,211,153" />
                <Arrow />
                <FlowStep icon="📱" label={t.f1s3} sub="mensaje WA" color="52,211,153" />
              </div>
            </Card>

            <Card accent="rgba(52,211,153,0.2)">
              <div style={{ fontSize:"13px", color:"#34d399", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.f2}</div>
              <div style={{ display:"flex", gap:"8px", alignItems:"stretch", flexWrap:"wrap" }}>
                <FlowStep icon="✅" label={t.f2s1} sub="PATCH /pedidos" color="52,211,153" />
                <Arrow />
                <FlowStep icon="📨" label={t.f2s2} sub="normaliza tel." color="52,211,153" />
                <Arrow />
                <FlowStep icon="📱" label={t.f1s3} sub="549XXXXXXXXXX" color="52,211,153" />
              </div>
            </Card>

            <Card accent="rgba(245,158,11,0.2)">
              <div style={{ fontSize:"13px", color:"#f59e0b", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.f3}</div>
              <div style={{ display:"flex", gap:"8px", alignItems:"stretch", flexWrap:"wrap" }}>
                <FlowStep icon="⏰" label={t.f3s1} sub="n8n diario" color="245,158,11" />
                <Arrow />
                <FlowStep icon="🗄️" label={t.f3s2} sub="TOP 10 bajo" color="245,158,11" />
                <Arrow />
                <FlowStep icon="📱" label={t.f3s3} sub="lista productos" color="245,158,11" />
              </div>
            </Card>

            <Card accent="rgba(245,158,11,0.2)">
              <div style={{ fontSize:"13px", color:"#f59e0b", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.f4}</div>
              <div style={{ display:"flex", gap:"8px", alignItems:"stretch", flexWrap:"wrap" }}>
                <FlowStep icon="⏰" label={t.f4s1} sub="n8n diario" color="245,158,11" />
                <Arrow />
                <FlowStep icon="📊" label={t.f4s2} sub="ventas del día" color="245,158,11" />
                <Arrow />
                <FlowStep icon="📱" label={t.f4s3} sub="resumen diario" color="245,158,11" />
              </div>
            </Card>
          </div>
          <Card>
            <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.normTitle}</div>
            <CodeBlock code={`function normalizarTelefono(tel) {\n  const digits = tel.replace(/\\D/g, '');\n  if (digits.startsWith('549')) return digits;\n  if (digits.startsWith('54'))  return '549' + digits.slice(2);\n  if (digits.startsWith('0'))   return '549' + digits.slice(1);\n  if (digits.length === 10)     return '549' + digits;\n  return '549' + digits;\n}`} />
          </Card>
        </div>
      </section>

      {/* GALERÍA DE PLANTILLAS */}
      <section id="plantillas" style={{ ...sectionStyle, background:"rgba(8,12,28,0.98)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label="04 — Plantillas n8n" title="Galería de Automatizaciones" />
          <p style={{ color:"rgba(200,215,255,0.6)", fontSize:"15px", lineHeight:1.7, marginBottom:"2rem" }}>
            Colección de flujos de automatización listos para deployar. Cada plantilla resuelve un problema real de negocio usando n8n, IA y APIs externas.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.2rem" }}>
            {[
              { icon:"📅", name:"Agente Secretario", desc:"Agente conversacional con memoria que gestiona agenda, reuniones y tareas vía webhook.", tags:["n8n","OpenAI","Memory","Webhook"] },
              { icon:"👔", name:"Asistente Personal CEO", desc:"Suite completa: WhatsApp, Gmail, Calendar, MCP y memoria persistente para ejecutivos.", tags:["n8n","WhatsApp","Gmail","MCP","OpenAI"] },
              { icon:"🎭", name:"Avatar Marca Personal", desc:"Genera contenido en tu voz y estilo automáticamente desde Gmail y Google Sheets.", tags:["n8n","Gmail","OpenAI","Sheets"] },
              { icon:"📧", name:"Email Scrapper", desc:"Encuentra y valida emails de potenciales clientes automáticamente por industria.", tags:["n8n","HTTP","Sheets","Filtros"] },
              { icon:"🤝", name:"Icebreaker Clientes", desc:"Personaliza mensajes de prospección con datos reales del cliente via IA.", tags:["n8n","OpenAI","Gmail","Sheets"] },
              { icon:"📸", name:"Appointment Setter Instagram", desc:"Califica leads de Instagram y agenda reuniones automáticamente vía webhook.", tags:["n8n","OpenAI","PostgreSQL","MCP"] },
              { icon:"✍️", name:"Creador Blog SEO", desc:"Genera posts optimizados para SEO desde RSS feeds y los publica en WordPress.", tags:["n8n","OpenAI","WordPress","RSS","Gmail"] },
              { icon:"🎬", name:"Generador Guiones YouTube", desc:"Crea guiones completos para YouTube desde tendencias y los envía por Gmail.", tags:["n8n","OpenAI","RSS","Google Docs"] },
              { icon:"🛍️", name:"Manager E-Commerce Shopify", desc:"Gestiona productos, inventario y consultas de clientes en Shopify con IA.", tags:["n8n","Shopify","OpenAI","Supabase"] },
              { icon:"📊", name:"Extractor KPIs Meta Ads", desc:"Extrae métricas de campañas de Facebook Ads y genera reportes automáticos.", tags:["n8n","Facebook API","Sheets"] },
              { icon:"🧠", name:"Indexador RAG Avanzado", desc:"Indexa documentos de Google Drive en base vectorial para búsqueda semántica.", tags:["n8n","OpenAI","Supabase","Drive"] },
              { icon:"📨", name:"MCP Server Email", desc:"Servidor MCP que expone Gmail como herramienta para agentes de Claude AI.", tags:["MCP","Claude","Gmail"] },
              { icon:"📆", name:"MCP Server Calendar", desc:"Servidor MCP que conecta Google Calendar con agentes de Claude AI.", tags:["MCP","Claude","Calendar"] },
              { icon:"✅", name:"MCP Server Tasks", desc:"Servidor MCP que gestiona Google Tasks desde agentes de Claude AI.", tags:["MCP","Claude","Tasks"] },
            ].map((item, i) => (
              <div key={i} style={{
                background:"rgba(15,20,40,0.8)",
                border:"1px solid rgba(74,158,255,0.15)",
                borderRadius:"14px",
                padding:"1.25rem",
                backdropFilter:"blur(8px)",
                transition:"border-color 0.3s, transform 0.2s",
                cursor:"default",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,158,255,0.45)"; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(74,158,255,0.15)"; e.currentTarget.style.transform="none"; }}
              >
                <div style={{ fontSize:"28px", marginBottom:"10px" }}>{item.icon}</div>
                <div style={{ fontSize:"14px", fontWeight:600, color:"#eef2ff", marginBottom:"6px", fontFamily:"'Syne',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize:"12px", color:"rgba(200,215,255,0.55)", lineHeight:1.6, marginBottom:"12px" }}>{item.desc}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize:"10px", padding:"2px 8px", borderRadius:"4px",
                      background:"rgba(74,158,255,0.1)", color:"#7eb8ff",
                      border:"1px solid rgba(74,158,255,0.2)",
                      fontFamily:"'JetBrains Mono',monospace",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PANEL ADMIN */}
      <section id="panel-admin" style={{ ...sectionStyle }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s04label} title={t.s04title} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <Card accent="rgba(74,158,255,0.2)">
                <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.kpiTitle}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                  {[["$0","hoy"],["$12.4k","esta semana"],["$48.2k","este mes"],["$3.2k","ticket promedio"]].map(([v,l]) => (
                    <div key={l} style={{ background:"rgba(0,0,0,0.3)", borderRadius:"8px", padding:"0.75rem", textAlign:"center" }}>
                      <div style={{ fontSize:"1.2rem", fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#4a9eff" }}>{v}</div>
                      <div style={{ fontSize:"11px", color:"rgba(200,215,255,0.4)", fontFamily:"'JetBrains Mono',monospace" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card accent="rgba(74,158,255,0.2)">
                <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.metTitle}</div>
                <CodeBlock code={`// Una sola llamada devuelve todo\nGET /api/metricas\nHeaders: x-admin-token: ***\n\n// Respuesta\n{\n  "hoy": { pedidos:0, facturacion:0 },\n  "semana": { ... },\n  "topProductos": [...],\n  "ventasPorDia": [...]\n}`} />
              </Card>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <Card>
                <div style={{ fontSize:"13px", color:"#34d399", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.stockTitle}</div>
                <p style={{ fontSize:"14px", color:"rgba(200,215,255,0.7)", lineHeight:1.6, margin:"0 0 0.75rem" }}>{t.stockDesc}</p>
                <CodeBlock code={`<input\n  type="text"\n  inputMode="numeric"\n  onKeyDown={e => {\n    if (e.key==='Enter') guardarStock(id);\n    if (e.key==='Escape') setEditando(null);\n  }}\n/>`} />
              </Card>
              <Card>
                <div style={{ fontSize:"13px", color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.selTitle}</div>
                <CodeBlock code={`// O(1) lookup, sin duplicados\nconst [sel, setSel] = useState(new Set());\n\n// Marcar múltiples sin stock\nawait Promise.all(\n  [...sel].map(id =>\n    fetch(\`/api/productos/\${id}/stock\`, {\n      method:'PATCH',\n      body: JSON.stringify({stock:0})\n    })\n  )\n);`} />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* INFRAESTRUCTURA */}
      <section id="infraestructura" style={{ ...sectionStyle, background:"rgba(6,10,24,0.95)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s05label} title={t.s05title} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem", marginBottom:"2rem" }}>
            <Card accent="rgba(245,158,11,0.2)">
              <div style={{ fontSize:"13px", color:"#f59e0b", fontFamily:"'JetBrains Mono',monospace", marginBottom:"1rem" }}>{t.infraTitle}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                {[
                  ["Hostinger VPS","Ubuntu 24.04 · 72.61.62.170","#f59e0b"],
                  ["Traefik","Reverse proxy + SSL automático","#34d399"],
                  ["MySQL 8","Docker · 172.18.0.4:3306","#4a9eff"],
                  ["n8n","Automatizaciones · puerto 5678","#a78bfa"],
                  ["Express + PM2","API · puerto 3000 · auto-restart","#f59e0b"],
                  ["React + Nginx","Frontend · /var/www/libreria","#34d399"],
                ].map(([name, desc, color]) => (
                  <div key={name} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:color, flexShrink:0, marginTop:"5px" }} />
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:500, color:"#eef2ff", fontFamily:"'JetBrains Mono',monospace" }}>{name}</div>
                      <div style={{ fontSize:"11px", color:"rgba(200,215,255,0.45)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <Card>
                <div style={{ fontSize:"13px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.deployTitle}</div>
                <CodeBlock code={`# Build y deploy frontend\ncd /root/libreria-ecommerce/frontend\nnpm run build\ncp -r dist/* /var/www/libreria/\ndocker restart n8n-libreria-1\n\n# Reiniciar API\npm2 restart libreria-api --update-env`} />
              </Card>
              <Card>
                <div style={{ fontSize:"13px", color:"#34d399", fontFamily:"'JetBrains Mono',monospace", marginBottom:"0.75rem" }}>{t.composeTitle}</div>
                <CodeBlock code={`services:\n  traefik:   # 80/443 + SSL\n  n8n:       # automatizaciones\n  libreria:  # nginx → /var/www\n  libreria-api: # proxy → :3000\n\n# SSL automático via Let's Encrypt\n# librerianatsu.com + api.librerianatsu.com`} />
              </Card>
            </div>
          </div>

          {/* Footer CTA */}
          <div style={{
            background:"linear-gradient(135deg, rgba(74,158,255,0.1), rgba(167,139,250,0.1))",
            border:"1px solid rgba(74,158,255,0.2)",
            borderRadius:"16px",
            padding:"2rem",
            textAlign:"center",
          }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"#eef2ff", margin:"0 0 0.75rem" }}>
              {t.ctaTitle}
            </h3>
            <p style={{ color:"rgba(200,215,255,0.6)", fontSize:"14px", margin:"0 0 1.5rem" }}>
              {t.ctaDesc}
            </p>
            <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="https://librerianatsu.com" target="_blank" rel="noopener" style={{
                display:"inline-block", padding:"0.8rem 2rem",
                background:"#34d399", color:"#060a18",
                borderRadius:"8px", textDecoration:"none",
                fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", fontWeight:500,
              }}>{t.ctaBtnLive}</a>
              <a href="https://github.com/SantiagoAcquisto/libreria-ecommerce" target="_blank" rel="noopener" style={{
                display:"inline-block", padding:"0.8rem 2rem",
                background:"#4a9eff", color:"#060a18",
                borderRadius:"8px", textDecoration:"none",
                fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", fontWeight:500,
              }}>{t.ctaBtnGH}</a>
            </div>
          </div>
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section id="herramientas" style={{ ...sectionStyle, background:"rgba(8,12,28,0.98)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label={t.s06label} title={t.s06title} />
          <p style={{ color:"rgba(200,215,255,0.6)", fontSize:"15px", lineHeight:1.7, marginBottom:"2.5rem" }}>
            {t.s06desc}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.5rem" }}>
            <div style={{
              background:"rgba(15,20,40,0.8)",
              border:"1px solid rgba(124,109,250,0.25)",
              borderRadius:"16px",
              padding:"1.75rem",
              backdropFilter:"blur(8px)",
              display:"flex",
              flexDirection:"column",
              gap:"1rem",
              transition:"border-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(124,109,250,0.55)"; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(124,109,250,0.25)"; e.currentTarget.style.transform="none"; }}
            >
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
                <div style={{ fontSize:"36px" }}>🧠</div>
                <span style={{
                  fontSize:"10px", padding:"3px 10px", borderRadius:"20px",
                  background:"rgba(109,250,189,0.1)", color:"#6dfabd",
                  border:"1px solid rgba(109,250,189,0.25)",
                  fontFamily:"'JetBrains Mono',monospace", letterSpacing:"1px",
                  whiteSpace:"nowrap",
                }}>STANDALONE · HTML</span>
              </div>
              <div>
                <div style={{ fontSize:"17px", fontWeight:700, color:"#eef2ff", fontFamily:"'Syne',sans-serif", marginBottom:"6px" }}>
                  AI Engineer — Prueba Técnica
                </div>
                <div style={{ fontSize:"13px", color:"rgba(200,215,255,0.6)", lineHeight:1.65 }}>
                  100 preguntas técnicas para preparar entrevistas de AI Engineer. Organizadas en niveles JR / SSR / SR con respuestas, autoevaluación y progreso guardado en localStorage.
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                {["100 preguntas","JR / SSR / SR","localStorage","Vanilla JS","Sin dependencias"].map(tag => (
                  <span key={tag} style={{
                    fontSize:"10px", padding:"2px 9px", borderRadius:"4px",
                    background:"rgba(124,109,250,0.1)", color:"#a78bfa",
                    border:"1px solid rgba(124,109,250,0.2)",
                    fontFamily:"'JetBrains Mono',monospace",
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", paddingTop:"4px" }}>
                {[["33","JR","#6dfabd"],["34","SSR","#7c6dfa"],["33","SR","#fa6d8e"]].map(([n,lbl,c]) => (
                  <div key={lbl} style={{ background:"rgba(0,0,0,0.3)", borderRadius:"8px", padding:"8px", textAlign:"center" }}>
                    <div style={{ fontSize:"1.3rem", fontFamily:"'Syne',sans-serif", fontWeight:800, color:c }}>{n}</div>
                    <div style={{ fontSize:"10px", color:"rgba(200,215,255,0.4)", fontFamily:"'JetBrains Mono',monospace" }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"8px", paddingTop:"4px" }}>
                <a
                  href="https://SantiagoAcquisto.github.io/ai-engineer-quiz"
                  target="_blank" rel="noopener"
                  style={{
                    flex:1, padding:"9px 0", textAlign:"center",
                    background:"rgba(124,109,250,0.15)", color:"#a78bfa",
                    border:"1px solid rgba(124,109,250,0.35)",
                    borderRadius:"8px", textDecoration:"none",
                    fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", fontWeight:600,
                    transition:"background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(124,109,250,0.28)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(124,109,250,0.15)"}
                >
                  Abrir app →
                </a>
                <a
                  href="https://github.com/SantiagoAcquisto/ai-engineer-quiz"
                  target="_blank" rel="noopener"
                  style={{
                    flex:1, padding:"9px 0", textAlign:"center",
                    background:"transparent", color:"rgba(200,215,255,0.5)",
                    border:"1px solid rgba(74,158,255,0.2)",
                    borderRadius:"8px", textDecoration:"none",
                    fontFamily:"'JetBrains Mono',monospace", fontSize:"12px",
                    transition:"border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,158,255,0.5)"; e.currentTarget.style.color="#eef2ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(74,158,255,0.2)"; e.currentTarget.style.color="rgba(200,215,255,0.5)"; }}
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ ...sectionStyle, background:"rgba(6,10,24,0.98)", minHeight:"auto", padding:"5rem clamp(1.5rem,6vw,8rem)" }}>
        <div style={{ maxWidth:"600px", margin:"0 auto", width:"100%" }}>
          <SectionTitle label="08 — Contacto" title="Hablemos" />
          <p style={{ color:"rgba(200,215,255,0.6)", fontSize:"15px", lineHeight:1.7, marginBottom:"2rem" }}>
            Tu mensaje llega directo a mi WhatsApp vía SAXI. Respondó en menos de 24hs.
          </p>
          <FormularioContacto />
        </div>
      </section>

      {/* ROBOT FLOTANTE */}
      <ChatFlotante />

    </div>
  );
}

const SYSTEM_PROMPT = `Sos un agente de IA que representa a Santiago Andrés Acquisto, desarrollador Full Stack de 33 años de Mar del Plata, Argentina. Respondé en el mismo idioma que te hablen (español o inglés). Sé directo, honesto y conciso.

PERFIL:
- Full Stack Developer con proyecto real en producción: Librería Natsu (librerianatsu.com)
- Stack: React 18, Node.js, Express, MySQL 8, Docker, Traefik, SSL, PM2
- Automatizaciones: n8n, WhatsApp API, Claude AI, MCP, Selenium
- Portfolio: acquisto.dev | GitHub: github.com/SantiagoAcquisto/libreria-ecommerce
- Email: andresacquisto@gmail.com | LinkedIn: linkedin.com/in/acquisto-dev

PROYECTO LIBRERÍA NATSU:
- E-commerce con 1142 productos reales, 27 categorías, carrito funcional
- Panel admin con KPIs en tiempo real, Recharts, gestión de stock inline
- 4 flujos n8n en producción: WhatsApp al crear/completar pedido, alerta stock, reporte diario
- Fix encoding UTF-8 doble en MySQL, scraping imágenes con Selenium
- Deploy: VPS + Docker Compose + Traefik + SSL automático
- Documentación TP01-TP07 en GitHub

FORMACIÓN: Digital House (Full Stack 2022-23), Coderhouse (Data Analyst, AI Automation), secundario en curso, aprendiendo Python.

BÚSQUEDA LABORAL: Roles Full Stack, Backend, AI Automation o AI Engineer Jr. Remoto o España. Expectativa $1200-1800 USD/mes. Sin experiencia formal pero con proyecto real en producción.

Si no sabés algo, decilo honestamente. No inventés datos.`;

function FormularioContacto() {
  const [form, setForm] = useState({ nombre:"", email:"", mensaje:"" });
  const [estado, setEstado] = useState(null); // null | "enviando" | "ok" | "error"

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async () => {
    if (!form.nombre || !form.email || !form.mensaje) return;
    setEstado("enviando");
    try {
      const res = await fetch("https://api.librerianatsu.com/api/contacto", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.ok) {
        setEstado("ok");
        setForm({ nombre:"", email:"", mensaje:"" });
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(74,158,255,0.2)", borderRadius:"8px",
    padding:"0.75rem 1rem", color:"#eef2ff", fontSize:"14px",
    fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box",
    transition:"border-color 0.2s",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <div>
          <label style={{ fontSize:"12px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", display:"block", marginBottom:"6px" }}>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" style={inputStyle}
            onFocus={e => e.target.style.borderColor="rgba(74,158,255,0.6)"}
            onBlur={e => e.target.style.borderColor="rgba(74,158,255,0.2)"}
          />
        </div>
        <div>
          <label style={{ fontSize:"12px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", display:"block", marginBottom:"6px" }}>Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" style={inputStyle}
            onFocus={e => e.target.style.borderColor="rgba(74,158,255,0.6)"}
            onBlur={e => e.target.style.borderColor="rgba(74,158,255,0.2)"}
          />
        </div>
      </div>
      <div>
        <label style={{ fontSize:"12px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace", display:"block", marginBottom:"6px" }}>Mensaje</label>
        <textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="¿En qué puedo ayudarte?" rows={5}
          style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }}
          onFocus={e => e.target.style.borderColor="rgba(74,158,255,0.6)"}
          onBlur={e => e.target.style.borderColor="rgba(74,158,255,0.2)"}
        />
      </div>

      {estado === "ok" && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", color:"#34d399", fontSize:"14px", fontFamily:"'JetBrains Mono',monospace" }}>
          ✅ Mensaje enviado. Te respondo en menos de 24hs.
        </div>
      )}
      {estado === "error" && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", fontSize:"14px", fontFamily:"'JetBrains Mono',monospace" }}>
          ❌ Hubo un error. Escribime a andresacquisto@gmail.com
        </div>
      )}

      <button onClick={enviar} disabled={estado==="enviando" || !form.nombre || !form.email || !form.mensaje} style={{
        padding:"0.85rem 2rem", background:"#4a9eff", color:"#060a18",
        border:"none", borderRadius:"8px", cursor:"pointer",
        fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", fontWeight:600,
        opacity: (estado==="enviando" || !form.nombre || !form.email || !form.mensaje) ? 0.5 : 1,
        transition:"opacity 0.2s, transform 0.2s",
        alignSelf:"flex-start",
      }}
      onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform="none"}
      >
        {estado==="enviando" ? "Enviando..." : "Enviar mensaje →"}
      </button>

      <div style={{ display:"flex", gap:"1.5rem", marginTop:"0.5rem" }}>
        {[
          ["📧", "andresacquisto@gmail.com", "mailto:andresacquisto@gmail.com"],
          ["💼", "linkedin.com/in/acquisto-dev", "https://linkedin.com/in/acquisto-dev"],
          ["🐙", "GitHub", "https://github.com/SantiagoAcquisto"],
        ].map(([icon, label, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener" style={{
            display:"flex", alignItems:"center", gap:"6px",
            fontSize:"12px", color:"rgba(200,215,255,0.5)",
            textDecoration:"none", fontFamily:"'JetBrains Mono',monospace",
            transition:"color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color="#4a9eff"}
          onMouseLeave={e => e.currentTarget.style.color="rgba(200,215,255,0.5)"}
          >
            {icon} {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Robot({ size = 48, talking = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antena */}
      <line x1="32" y1="4" x2="32" y2="12" stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="3" r="3" fill="#4a9eff">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      {/* Cabeza */}
      <rect x="14" y="12" width="36" height="28" rx="8" fill="#1a2a4a" stroke="#4a9eff" strokeWidth="1.5"/>
      {/* Ojos */}
      <circle cx="24" cy="24" r="5" fill="#060a18"/>
      <circle cx="40" cy="24" r="5" fill="#060a18"/>
      <circle cx="24" cy="24" r="3" fill="#4a9eff">
        <animate attributeName="r" values="3;2;3" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="24" r="3" fill="#4a9eff">
        <animate attributeName="r" values="3;2;3" dur="3s" begin="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="25" cy="23" r="1" fill="white"/>
      <circle cx="41" cy="23" r="1" fill="white"/>
      {/* Boca */}
      {talking ? (
        <rect x="24" y="33" width="16" height="4" rx="2" fill="#4a9eff">
          <animate attributeName="height" values="4;7;4;2;4" dur="0.5s" repeatCount="indefinite"/>
          <animate attributeName="y" values="33;31;33;34;33" dur="0.5s" repeatCount="indefinite"/>
        </rect>
      ) : (
        <path d="M24 35 Q32 39 40 35" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      )}
      {/* Cuerpo */}
      <rect x="18" y="42" width="28" height="18" rx="6" fill="#1a2a4a" stroke="#4a9eff" strokeWidth="1.5"/>
      {/* Botón pecho */}
      <circle cx="32" cy="51" r="4" fill="#060a18" stroke="#4a9eff" strokeWidth="1"/>
      <circle cx="32" cy="51" r="2" fill="#4a9eff">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      {/* Brazos */}
      <rect x="6" y="44" width="10" height="6" rx="3" fill="#1a2a4a" stroke="#4a9eff" strokeWidth="1.5"/>
      <rect x="48" y="44" width="10" height="6" rx="3" fill="#1a2a4a" stroke="#4a9eff" strokeWidth="1.5"/>
    </svg>
  );
}

function ChatFlotante() {
  const [abierto, setAbierto] = useState(false);
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:"¡Hola! Soy SAXI — Santiago Acquisto eXpert Intelligence. Soy un agente construido sobre Claude AI y entrenado con toda la información de Santiago. Preguntame sobre sus proyectos, stack técnico, automatizaciones o disponibilidad laboral 👾" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bubble, setBubble] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs]);

  useEffect(() => {
    const t = setTimeout(() => setBubble(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:"user", content:input.trim() };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.librerianatsu.com/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages: newMsgs.map(m => ({ role:m.role, content:m.content })) })
      });
      const data = await res.json();
      const reply = data.content || "No pude procesar tu pregunta.";
      setMsgs(prev => [...prev, { role:"assistant", content:reply }]);
    } catch {
      setMsgs(prev => [...prev, { role:"assistant", content:"Error al conectar. Intentá de nuevo." }]);
    }
    setLoading(false);
  };

  const sugerencias = ["¿Qué proyectos hizo?","¿Qué stack usa?","¿Está disponible?","Tell me about his work"];

  return (
    <div style={{ position:"fixed", bottom:"2rem", right:"2rem", zIndex:1000, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"12px" }}>

      {/* Burbuja inicial */}
      {bubble && !abierto && (
        <div style={{
          background:"rgba(10,16,36,0.95)", border:"1px solid rgba(74,158,255,0.3)",
          borderRadius:"16px 16px 4px 16px", padding:"10px 14px",
          fontSize:"13px", color:"#eef2ff", maxWidth:"200px",
          fontFamily:"'Inter',sans-serif", lineHeight:1.5,
          animation:"fadeIn 0.3s ease",
          boxShadow:"0 4px 20px rgba(74,158,255,0.15)",
        }}>
          👋 ¡Hola! Soy SAXI. ¿Tenés alguna pregunta sobre Santiago?
        </div>
      )}

      {/* Panel de chat */}
      {abierto && (
        <div style={{
          width:"340px", background:"rgba(6,10,24,0.97)",
          border:"1px solid rgba(74,158,255,0.25)", borderRadius:"16px",
          overflow:"hidden", boxShadow:"0 8px 40px rgba(74,158,255,0.15)",
          animation:"slideUp 0.3s ease",
        }}>
          {/* Header */}
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(74,158,255,0.15)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(15,20,40,0.8)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <Robot size={36} talking={loading} />
              <div>
                <div style={{ fontSize:"13px", fontWeight:600, color:"#eef2ff", fontFamily:"'Syne',sans-serif" }}>SAXI</div>
                <div style={{ fontSize:"11px", color:"#4a9eff", fontFamily:"'JetBrains Mono',monospace" }}>● online</div>
              </div>
            </div>
            <button onClick={() => setAbierto(false)} style={{ background:"none", border:"none", color:"rgba(200,215,255,0.4)", cursor:"pointer", fontSize:"18px", lineHeight:1 }}>×</button>
          </div>

          {/* Mensajes */}
          <div style={{ height:"300px", overflowY:"auto", padding:"1rem", display:"flex", flexDirection:"column", gap:"10px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"8px", alignItems:"flex-start" }}>
                {m.role==="assistant" && <Robot size={28} talking={false} />}
                <div style={{
                  maxWidth:"75%", padding:"8px 12px",
                  borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",
                  background:m.role==="user"?"#4a9eff":"rgba(255,255,255,0.06)",
                  color:m.role==="user"?"#060a18":"#eef2ff",
                  fontSize:"13px", lineHeight:1.6,
                  border:m.role==="assistant"?"1px solid rgba(74,158,255,0.12)":"none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                <Robot size={28} talking={true} />
                <div style={{ padding:"8px 12px", borderRadius:"12px 12px 12px 4px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(74,158,255,0.12)" }}>
                  <div style={{ display:"flex", gap:"4px" }}>
                    {[0,1,2].map(i => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4a9eff", animation:`pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias */}
          {msgs.length <= 1 && (
            <div style={{ padding:"0 1rem 0.5rem", display:"flex", gap:"4px", flexWrap:"wrap" }}>
              {sugerencias.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  background:"rgba(74,158,255,0.08)", border:"1px solid rgba(74,158,255,0.2)",
                  borderRadius:"20px", padding:"3px 10px", fontSize:"11px",
                  color:"#7eb8ff", cursor:"pointer", fontFamily:"'JetBrains Mono',monospace",
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"0.75rem 1rem", display:"flex", gap:"6px", borderTop:"1px solid rgba(74,158,255,0.1)" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && send()}
              placeholder="Escribí tu pregunta..."
              style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(74,158,255,0.2)", borderRadius:"8px", padding:"6px 10px", color:"#eef2ff", fontSize:"13px", fontFamily:"'Inter',sans-serif", outline:"none" }}
            />
            <button onClick={send} disabled={loading} style={{ padding:"6px 12px", background:"#4a9eff", color:"#060a18", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700, opacity:loading?0.5:1, fontSize:"14px" }}>→</button>
          </div>
        </div>
      )}

      {/* Botón robot */}
      <button
        onClick={() => { setAbierto(!abierto); setBubble(false); }}
        style={{
          width:"64px", height:"64px", borderRadius:"50%",
          background:"rgba(10,16,36,0.95)", border:"2px solid rgba(74,158,255,0.4)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 24px rgba(74,158,255,0.25)",
          transition:"transform 0.2s, box-shadow 0.2s",
          animation:"float 3s ease-in-out infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow="0 6px 32px rgba(74,158,255,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 24px rgba(74,158,255,0.25)"; }}
      >
        <Robot size={44} talking={loading} />
      </button>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
