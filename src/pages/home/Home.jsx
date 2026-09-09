import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './Home.css'
function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      hero.style.setProperty("--mouse-x", `${x}`);
      hero.style.setProperty("--mouse-y", `${y}`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main ref={heroRef} className="home-page">

      <div className="home-image"></div>
      <div className="home-overlay"></div>
      <div className="home-grid"></div>

      <div className="home-glow glow-left"></div>
      <div className="home-glow glow-right"></div>

      <div className="home-content">

        <div className="home-brand">
          <div className="brand-icon">
            <i className="bi bi-car-front-fill"></i>
          </div>

          <span>UDEVS</span>
        </div>

        <div className="home-line"></div>

        <p className="home-label">
          CAR SHOWROOM MANAGEMENT SYSTEM
        </p>

        <h1>
          Drive Your
          <br />
          <span>Business Forward</span>
        </h1>

        <p className="home-description">
          Manage vehicles, suppliers, customers, inventory,
          applications and showroom operations from one powerful workspace.
        </p>

        <Link to="/login" className="home-start-btn">
          <span>Get Started</span>

          <span className="start-icon">
            <i className="bi bi-arrow-up-right"></i>
          </span>
        </Link>

        <div className="home-scroll">
          <span className="scroll-line"></span>
          <span>SHOWROOM CONTROL</span>
        </div>

      </div>

      <div className="home-corner">
        <span>01</span>
        <span className="corner-line"></span>
        <span>UDEVS</span>
      </div>

    </main>
  );
}

export default Home;