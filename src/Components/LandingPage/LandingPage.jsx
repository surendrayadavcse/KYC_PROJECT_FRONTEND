import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./LandingPage.css"; // <-- External CSS
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const features = [
  { title: "Authentication & Registration", desc: "Secure sign-up, email OTP, and login for all users.", icon: "bi-person-check" },
  { title: "KYC & Consent", desc: "Stepwise KYC with consent modals and data privacy.", icon: "bi-shield-lock" },
  { title: "Document Upload & Auto Verification", desc: "Aadhaar, PAN, and selfie upload with instant AI checks.", icon: "bi-file-earmark-arrow-up" },
  { title: "Customer Dashboard", desc: "Track KYC status, view services, and manage your profile.", icon: "bi-speedometer2" },
  { title: "Admin Monitoring", desc: "Role-based access, user stats, and service management.", icon: "bi-bar-chart-line" },
];

const steps = [
  { title: "Register & Login", desc: "Create your account and verify your email with OTP.", icon: "bi-person-plus" },
  { title: "Give Consent", desc: "Review and accept our data policy before KYC.", icon: "bi-file-earmark-check" },
  { title: "Upload Documents", desc: "Upload Aadhaar, PAN, and a selfie for verification.", icon: "bi-upload" },
  { title: "Get Verified", desc: "Instant KYC status and access to all services.", icon: "bi-patch-check" },
];

const testimonials = [
  { name: "Rajesh Kumar", role: "CFO, FinTech Solutions", content: "HexaEdge's KYC solution reduced our onboarding time by 70%.", rating: 5 },
  { name: "Priya Sharma", role: "Compliance Officer", content: "The automated document verification has been a game-changer.", rating: 4 },
  { name: "Amit Patel", role: "Banking Executive", content: "Implementation was smooth and the support team was responsive.", rating: 5 }
];

const faqs = [
  { question: "What documents are required for KYC verification?", answer: "You'll need your Aadhaar card, PAN card, and a recent selfie." },
  { question: "How long does the verification process take?", answer: "Most verifications are completed within 2-5 minutes." },
  { question: "Is my data secure with HexaEdge?", answer: "We use bank-grade encryption and comply with all regulations." },
  { question: "Can I track my KYC status?", answer: "Yes, our dashboard provides real-time updates on your KYC status." }
];

export default function LandingPage() {
   const navigate=useNavigate()
   useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
  
    if (token) {
      if (role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    }
    // ❌ Do not redirect if no token
  }, []);
  
  return (
    <div className="landing-page  pt-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm p-4 fixed-top ">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="#">Hexa<span className="text-dark">Edge</span> </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="#howitworks">How It Works</a></li>
              {/* <li className="nav-item"><a className="nav-link" href="#dashboard">Dashboard</a></li> */}
             
              <li className="nav-item">
  <Link className="btn btn-outline-primary ms-2" to="/login">Login</Link>
</li>
<li className="nav-item">
  <Link className="btn btn-primary ms-2 text-white" to="/register">Register</Link>
</li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container text-center py-5">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="display-4 fw-bold mb-3">
          Seamless, Secure <span className="text-primary">KYC Verification</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="lead mb-4">
          Onboard customers faster with HexaEdge's automated, compliant, and user-friendly KYC platform.
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }}>
        <Link to="/register" className="btn btn-primary btn-lg shadow">Get Started</Link>

        </motion.div>
      </div>

      {/* Features */}
      <section id="features" className="container py-5">
  <h2 className="text-center fw-bold mb-4">Platform <span className="text-primary">Features</span></h2>
  <div className="row g-4 justify-content-center">
    {features.map((f) => (
      <div key={f.title} className="col-md-6 col-lg-4 d-flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card border-0 shadow-sm text-center feature-card h-100 w-100"
        >
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="mb-3">
              <i className={`bi ${f.icon} text-primary`} style={{ fontSize: 40 }}></i>
            </div>
            <h5 className="fw-bold">{f.title}</h5>
            <p className="text-muted">{f.desc}</p>
          </div>
        </motion.div>
      </div>
    ))}
  </div>
</section>


      {/* How It Works */}
      <section id="howitworks" className="container py-5">
        <h2 className="text-center fw-bold mb-4">How <span className="text-primary">It Works</span></h2>
        <div className="row g-4 justify-content-center">
          {steps.map((step) => (
            <div key={step.title} className="col-md-3">
              <motion.div whileHover={{ scale: 1.08 }} className="p-4 rounded shadow-sm text-center step-card">
                <div className="mb-3"><i className={`bi ${step.icon}`} style={{ fontSize: 40 }}></i></div>
                <h5 className="fw-bold mb-2">{step.title}</h5>
                <p>{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container py-5">
        <h2 className="text-center fw-bold mb-4">What Our <span className="text-primary">Clients Say</span></h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {testimonials.map((t, idx) => (
                    <div key={t.name} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                      <div className="card border-0 shadow-sm text-center p-4">
                        <div className="mb-3">
                          {[...Array(t.rating)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill text-warning"></i>
                          ))}
                        </div>
                        <blockquote className="blockquote mb-4">
                          <p className="fs-5 fst-italic">"{t.content}"</p>
                        </blockquote>
                        <h6 className="fw-bold mb-0">{t.name}</h6>
                        <small className="text-muted">{t.role}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
    {/* FAQ */}
<section id="faq" className="container py-5">
  <h2 className="text-center fw-bold mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
  <div className="row justify-content-center">
    <div className="col-md-8">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, idx) => (
            <div key={idx} className="accordion-item">
              <h2 className="accordion-header" id={`heading${idx}`}>
                <button 
                  className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`} 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse${idx}`} 
                  aria-expanded={idx === 0 ? 'true' : 'false'}
                  aria-controls={`collapse${idx}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div 
                id={`collapse${idx}`} 
                className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} 
                aria-labelledby={`heading${idx}`} 
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>


      {/* Demo Banner */}
      <section className="container text-center py-5">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }} className="p-4 rounded bg-primary text-white shadow">
          <h4 className="fw-bold mb-2">Try the KYC Demo</h4>
          <p>Experience the onboarding flow as a new user or admin.</p>
          <a href="#demo" className="btn btn-light fw-bold px-4">Start Demo</a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <span className="fw-bold text-primary">Team HexaEdge</span>
          <small className="text-muted">© 2024 HexaEdge KYC Platform</small>
        </div>
      </footer>
    </div>
  );
}
