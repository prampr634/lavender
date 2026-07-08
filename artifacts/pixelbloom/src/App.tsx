import { useEffect, useState, createContext, useContext } from "react";
import "./index.css";
import aboutPhoto from "@assets/51EAACC2-BE42-4EFA-BD46-F5CCAC1FDEE5_1783273195746.JPG";
import brandLogo from "@assets/ChatGPT_Image_Jul_1,_2026,_06_03_49_PM_(1)_1783268183884.png";

const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => {} });

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  const navbar = document.getElementById("navbar");
  if (el && navbar) {
    const top = el.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function useFadeUp() {
  useEffect(() => {
    const fadeEls = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Navbar() {
  const { dark, toggle } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY + 80 >= (s as HTMLElement).offsetTop) {
          current = s.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "process", label: "Process" },
    { id: "pricing", label: "Pricing" },
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
        <div className="nav-inner">
          <button type="button" className="nav-brand" onClick={() => scrollToSection("home")} aria-label="Lavender — back to top">
            <img src={brandLogo} alt="Lavender logo" className="brand-img" />
            <span className="brand-text">Lavender</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button className="hamburger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={activeSection === item.id ? "active" : ""}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                  href={`#${item.id}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                className="nav-cta"
                onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
                href="#contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div
        className={`drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`drawer${drawerOpen ? " open" : ""}`}>
        <ul>
          {[...navItems, { id: "contact", label: "Contact" }].map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setDrawerOpen(false);
                  setTimeout(() => scrollToSection(item.id), 10);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-shapes" aria-hidden="true">
        <div className="shape shape-circle-lg" />
        <div className="shape shape-circle-sm" />
        <div className="shape shape-line-h" />
        <div className="shape shape-line-v" />
        <div className="shape shape-rect" />
      </div>
      <div className="hero-content">
        <p className="hero-tagline fade-up">Beautiful Websites. Built to Grow.</p>
        <h1 className="hero-heading fade-up delay-1">Designed with Purpose. Built with Care.</h1>
        <p className="hero-sub fade-up delay-1">
          From small businesses and organizations to personal projects and events, I build custom websites that are modern, easy to use, and uniquely yours.
        </p>
        <div className="hero-btns fade-up delay-2">
          <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>
            Get Started
          </a>
          <a href="#portfolio" className="btn btn-outline" onClick={(e) => { e.preventDefault(); scrollToSection("portfolio"); }}>
            View My Work
          </a>
        </div>
      </div>
    </section>
  );
}

function WhyChooseMe() {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Clear Communication",
      desc: "I'll keep you updated throughout the project and respond as quickly as I can, so you always know what's happening with your website.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      title: "Designed Around Your Brand",
      desc: "Every website is built from scratch to match your business, style, and goals—never copied from a template.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: "Looks Great on Every Device",
      desc: "Your website will be designed to work smoothly on phones, tablets, and computers, giving every visitor a great experience.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      title: "Honest & Affordable Pricing",
      desc: "Simple pricing with no hidden fees. You'll always know what's included before the project begins.",
    },
  ];

  return (
    <section className="why section-alt" id="why">
      <div className="container">
        <h2 className="section-title fade-up">Why Choose Me</h2>
        <div className="why-grid">
          {items.map((item, i) => (
            <div key={i} className={`why-card fade-up stagger-${i + 1}`}>
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Review = { id: number; name: string; rating: number; quote: string };

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {});
  }, []);

  // Review cards are added asynchronously after the global fade-up observer has
  // already run, so they would never receive the .visible class and would stay
  // invisible. Re-observe this section's fade-up elements whenever reviews change.
  useEffect(() => {
    const els = document.querySelectorAll("#testimonials .fade-up:not(.visible)");
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), rating, quote: quote.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
      setShowForm(false);
      setName("");
      setRating(5);
      setQuote("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="testimonials section-alt" id="testimonials">
      <div className="container">
        <h2 className="section-title fade-up">What People Say</h2>

        {reviews.length === 0 ? (
          <div className="empty-state fade-up">
            <p>No reviews yet — you could be the first one!</p>
          </div>
        ) : (
          <div className="testimonials-grid">
            {reviews.map((t) => (
              <div key={t.id} className="testimonial-card fade-up">
                <div className="stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                <p>"{t.quote}"</p>
                <div className="client-info">
                  <div className="avatar">{getInitials(t.name)}</div>
                  <div>
                    <div className="client-name">{t.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="review-cta fade-up">
          {submitted ? (
            <p className="review-thanks">Thanks so much for your review! It'll show up here once I check it.</p>
          ) : !showForm ? (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add a Review
            </button>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="field-wrap">
                <input
                  type="text"
                  id="review-name"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="review-name">Your Name</label>
              </div>
              <div className="field-wrap">
                <select
                  id="review-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>★★★★★ — 5 stars</option>
                  <option value={4}>★★★★ — 4 stars</option>
                  <option value={3}>★★★ — 3 stars</option>
                  <option value={2}>★★ — 2 stars</option>
                  <option value={1}>★ — 1 star</option>
                </select>
                <label htmlFor="review-rating" className="select-label">Rating</label>
              </div>
              <div className="field-wrap">
                <textarea
                  id="review-quote"
                  rows={3}
                  placeholder=" "
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                />
                <label htmlFor="review-quote">Your Review</label>
              </div>
              {error && <p className="review-error">{error}</p>}
              <div className="review-form-actions">
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "Submitting…" : "Submit Review"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setError(""); }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const plans = [
    {
      name: "Basic",
      price: "$100",
      tagline: "Perfect for individuals, portfolios, and small businesses.",
      delivery: "Delivery in approximately 1–2 weeks",
      features: [
        "Up to 3 custom pages",
        "Responsive design for phones, tablets, and desktops",
        "Contact form",
        "Basic SEO setup to help search engines find your website",
        "Social media links",
        "1 revision round",
      ],
      featured: false,
    },
    {
      name: "Standard",
      price: "$200",
      tagline: "Everything in Basic, plus more room to grow.",
      delivery: "Delivery in approximately 2–3 weeks",
      features: [
        "Up to 6 custom pages",
        "Fully custom website designed around your brand",
        "Responsive design for all devices",
        "Contact form with email notifications",
        "SEO-friendly setup",
        "Google Analytics integration",
        "Up to 3 revision rounds",
      ],
      featured: true,
    },
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title fade-up">Services</h2>
        <p className="section-sub fade-up">
          Every website is made just for you — no templates or page builders. Pick the plan that works best for you!
        </p>
        <div className="pricing-grid pricing-grid--two" id="pricing">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card fade-up stagger-${i + 1}${plan.featured ? " pricing-card--featured" : ""}`}>
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <div className="tier-name">{plan.name}</div>
              <div className="tier-price">{plan.price}</div>
              <p className="tier-tagline">{plan.tagline}</p>
              <ul className="feature-list">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <div className="tier-delivery">{plan.delivery}</div>
              <a
                href="#contact"
                className="btn btn-primary"
                onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
        <div className="addons fade-up">
          <h3 className="addons-title">➕ Add-Ons</h3>
          <p className="addons-sub">Need something extra? You can add these to any package.</p>
          <ul className="addons-list">
            <li>
              <span className="addon-name">Extra Page</span>
              <span className="addon-price">$20 / page</span>
            </li>
            <li>
              <span className="addon-name">Logo Design</span>
              <span className="addon-price">$35</span>
            </li>
          </ul>
          <p className="addons-note">Need something else? Just ask for a custom quote.</p>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section className="portfolio section-alt" id="portfolio">
      <div className="container">
        <h2 className="section-title fade-up">My Work</h2>
        <div className="projects-grid projects-grid--single fade-up">
          <a
            className="project-card"
            href="https://study-sync--prathikaramprak.replit.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="project-img-wrap">
              <div
                className="project-img"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}studysync.png)` }}
              />
              <div className="project-overlay">
                <span className="arrow-icon">↗</span>
              </div>
            </div>
            <div className="project-info">
              <span className="project-tag">Web App</span>
              <h3>StudySync</h3>
              <p>A website I built all by myself that lets you study with classmates on the same WiFi in real time. This one's my favorite!</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      num: "01",
      title: "Let's Talk",
      desc: "We'll chat about your ideas, what your website is for, and what you want it to look like. I'll ask a few questions so I can understand exactly what you're looking for.",
    },
    {
      num: "02",
      title: "Make a Plan",
      desc: "I'll send you a simple plan with what's included, how long it should take, and the total price. That way, you'll know exactly what to expect.",
    },
    {
      num: "03",
      title: "I Build Your Website",
      desc: "I'll start designing and building your website from scratch. As I work, I'll keep you updated so you can see how everything is coming together.",
    },
    {
      num: "04",
      title: "You Review It",
      desc: "Once it's ready, you'll take a look and let me know if you'd like any changes. I'll make the included revisions to make sure everything looks just right.",
    },
    {
      num: "05",
      title: "Go Live!",
      desc: "When everything's finished, I'll publish your website so everyone can see it. I'll also make sure it's working properly before we call it done.",
    },
  ];

  return (
    <section className="process" id="process">
      <div className="container">
        <h2 className="section-title fade-up">How It Works</h2>
        <p className="section-sub fade-up">
          Getting your website made is easy! Here's what the process looks like from start to finish.
        </p>
        <div className="process-steps">
          {steps.map((step, i) => (
            <div key={step.num} style={{ display: "contents" }}>
              <div className={`process-step fade-up stagger-${i + 1}`}>
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="process-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-alt" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo fade-up">
            <div className="about-photo-inner">
              <img src={aboutPhoto} alt="Prathika, founder of Lavender" className="about-photo-img" />
            </div>
          </div>
          <div className="about-text fade-up delay-1">
            <h2>Hi, I'm Prathika.</h2>
            <p>
              I'm a 12-year-old web designer and entrepreneur. I moved from India to the United States when I was in 4th grade. Starting over in a new country taught me how to adapt, learn quickly, and take on challenges with confidence. Those experiences helped shape who I am today and encouraged me to explore new opportunities.
            </p>
            <p>
              I started my website business because I wanted to help people bring their ideas online. As a young entrepreneur, I enjoy learning new skills, solving problems, and finding creative ways to help others.
            </p>
            <p>
              Although I am still a student, I believe age should never limit what someone can achieve. I am always looking for ways to grow, improve, and take on new challenges. My goal is to create websites that help businesses and organizations share their story, connect with more people, and make a lasting impression.
            </p>
            <blockquote className="mission-quote">
              "Every great website starts with a great idea—and I'm here to help bring yours to life."
            </blockquote>
            <p className="about-disclaimer">
              This website is a non-commercial student project built for educational and portfolio purposes only.
            </p>
            <div className="values-row">
              {[
                { icon: "🎨", label: "Creativity" },
                { icon: "💬", label: "Communication" },
                { icon: "🌱", label: "Growth" },
                { icon: "✨", label: "Quality" },
                { icon: "🤝", label: "Trust" },
                { icon: "💜", label: "Passion" },
              ].map((v) => (
                <div key={v.label} className="value-item">
                  <span>{v.icon}</span>
                  <div>{v.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container">
        <h2 className="fade-up">Want to Build Something Awesome?</h2>
        <p className="fade-up delay-1">Tell me your idea and I'll turn it into a website you'll love.</p>
        <a
          href="#contact"
          className="btn btn-sage fade-up delay-2"
          onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
        >
          Let's Talk
        </a>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    websiteType: "",
    plan: "",
    description: "",
    deadline: "",
  });
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  function validateEmail(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError(value && !validateEmail(value) ? "Please enter a valid email address." : "");
    }
    if (name === "name" && value.trim()) setNameError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!formData.name.trim()) { setNameError(true); valid = false; }
    if (!validateEmail(formData.email)) { setEmailError("Please enter a valid email address."); valid = false; }
    if (!valid) return;

    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSendError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSendError("Could not send message. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2 className="section-title fade-up">Let's Work Together</h2>
        <p className="section-sub fade-up">Fill out the form below and I'll get back to you within a day to talk about your project!</p>

        {!submitted ? (
          <form className="contact-form fade-up" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field-wrap">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  style={nameError ? { borderBottomColor: "#E05252" } : {}}
                />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="field-wrap">
                <input type="text" id="business" name="business" placeholder=" " value={formData.business} onChange={handleChange} />
                <label htmlFor="business">Business Name (optional)</label>
              </div>
            </div>
            <div className="form-row">
              <div className="field-wrap">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  style={emailError ? { borderBottomColor: "#E05252" } : {}}
                />
                <label htmlFor="email">Email Address</label>
                <span className="field-error">{emailError}</span>
              </div>
              <div className="field-wrap">
                <input type="tel" id="phone" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
                <label htmlFor="phone">Phone Number (optional)</label>
              </div>
            </div>
            <div className="form-row">
              <div className="field-wrap">
                <select id="website-type" name="websiteType" required value={formData.websiteType} onChange={handleChange}>
                  <option value="" disabled> </option>
                  <option>Business Website</option>
                  <option>School / Club</option>
                  <option>Event Website</option>
                  <option>Personal Brand</option>
                  <option>Nonprofit</option>
                  <option>E-commerce</option>
                  <option>Other</option>
                </select>
                <label htmlFor="website-type" className="select-label">Type of Website Needed</label>
              </div>
              <div className="field-wrap">
                <select id="plan" name="plan" required value={formData.plan} onChange={handleChange}>
                  <option value="" disabled> </option>
                  <option>Basic — $100</option>
                  <option>Standard — $200</option>
                  <option>Not sure yet</option>
                </select>
                <label htmlFor="plan" className="select-label">Which Plan?</label>
              </div>
            </div>
            <div className="field-wrap">
              <textarea id="description" name="description" rows={5} placeholder=" " value={formData.description} onChange={handleChange} />
              <label htmlFor="description">Project Description</label>
            </div>
            <div className="field-wrap field-wrap--half">
              <label htmlFor="deadline" className="date-label">Preferred Deadline</label>
              <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} />
            </div>
            {sendError && (
          <p style={{ color: "#E05252", fontSize: "0.88rem", marginBottom: 8 }}>{sendError}</p>
        )}
        <button type="submit" className="btn btn-submit" disabled={sending}>
          {sending ? "Sending…" : "Send It My Way →"}
        </button>
          </form>
        ) : (
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="form-success fade-up visible">
              <span className="form-success-icon">🎉</span>
              <div>
                <strong>Got it!</strong>
                <p>Thanks for reaching out! I'll get back to you within a day.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WhatIBuild() {
  const types = [
    { icon: "🏢", title: "Business Websites", desc: "A clean, professional home online for your shop, service, or brand." },
    { icon: "🎉", title: "Event & Club Pages", desc: "Share dates, details, and sign-ups for your event, team, or club." },
    { icon: "🛍️", title: "Online Stores", desc: "Sell your products with a simple, easy-to-use online store." },
    { icon: "🎨", title: "Portfolios", desc: "Show off your work, art, or projects with a site that stands out." },
    { icon: "🚀", title: "Landing Pages", desc: "One bold page to launch an idea, product, or big announcement." },
    { icon: "📚", title: "School Projects", desc: "Cool websites for class assignments, clubs, or fundraisers." },
  ];
  return (
    <section className="build-types" id="build-types">
      <div className="container">
        <h2 className="section-title fade-up">What I Can Build</h2>
        <p className="section-sub fade-up">
          Whatever your idea is, there's a good chance I can make it. Here are some of the things I build most.
        </p>
        <div className="types-grid">
          {types.map((t, i) => (
            <div key={i} className={`type-card fade-up stagger-${(i % 5) + 1}`}>
              <div className="type-icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    { q: "What kinds of websites do you make?", a: "I build websites for small businesses, clubs, school projects, events, portfolios, and personal projects. If you have an idea, I'd love to hear about it!" },
    { q: "Will my website work on phones?", a: "Yes! Every website I build is designed to look great on phones, tablets, and computers." },
    { q: "Can I choose how my website looks?", a: "Absolutely! I'll design your website based on your ideas, style, and the look you're going for." },
    { q: "How do we get started?", a: "Just send me a message with your idea. We'll talk about what you need, choose the right package, and then I'll get started." },
    { q: "Can you add a contact form?", a: "Yes! I can add a contact form so visitors can easily reach you through your website." },
    { q: "Can you connect my domain name?", a: "Yes! If you already have a domain name, I'll help connect it to your website and get everything set up." },
    { q: "Do I need to provide the words and pictures?", a: "Yes. You'll send me the text, photos, and any other content you'd like on your website. If you're not sure what to include, I'll help guide you." },
    { q: "Do you make websites for school clubs or community events?", a: "Definitely! I enjoy creating websites for school clubs, nonprofits, fundraisers, community events, and small businesses." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq" id="faq">
      <div className="container">
        <h2 className="section-title fade-up">🌿 Questions? I've Got Answers</h2>
        <p className="section-sub fade-up">
          Here are the things people ask me most. Still wondering about something? Just send me a message!
        </p>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className="fade-up">
              <div className={`faq-item${open === i ? " open" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-a-${i}`}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div
                  className="faq-answer"
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  inert={open !== i}
                >
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      className={`scroll-top${show ? " visible" : ""}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-name">
              <img src={brandLogo} alt="Lavender logo" className="brand-img" />
              <span>Lavender</span>
            </div>
            <div className="footer-tagline">Beautiful websites. Built to grow.</div>
          </div>
          <div className="footer-links">
            <div className="footer-col-title">Quick Links</div>
            <ul>
              {[
                { id: "services", label: "Services" },
                { id: "portfolio", label: "Portfolio" },
                { id: "about", label: "About" },
                { id: "contact", label: "Contact" },
              ].map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(l.id); }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-contact">
            <div className="footer-col-title">Get In Touch</div>
            <a href="mailto:prathika.ramprakash@gmail.com">prathika.ramprakash@gmail.com</a>
            <a href="tel:7346373168">734-637-3168</a>
            <div className="social-icons">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" aria-label="Behance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 6h8a4 4 0 0 1 0 8H2V6z" />
                  <path d="M2 14h9a4 4 0 0 1 0 8H2v-8z" />
                  <line x1="14" y1="7" x2="21" y2="7" />
                  <path d="M14 12h7M14 17h5a3 3 0 0 0 0-6h-5v6z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Lavender. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useFadeUp();

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <Navbar />
      <Hero />
      <WhyChooseMe />
      <WhatIBuild />
      <Testimonials />
      <Services />
      <Portfolio />
      <Process />
      <About />
      <Faq />
      <CtaBanner />
      <Contact />
      <Footer />
      <ScrollTop />
    </ThemeContext.Provider>
  );
}

export default function App() {
  return <LandingPage />;
}
