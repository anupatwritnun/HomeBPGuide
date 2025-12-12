import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { defaultStats, fetchStats, features, reviews, aboutUs } from '../data/siteData';

// Hook to fetch real stats from n8n
function useStats() {
    const [stats, setStats] = useState(defaultStats);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats()
            .then(data => {
                setStats(data);
                setIsLoading(false);
            })
            .catch(() => {
                setStats(defaultStats);
                setIsLoading(false);
            });
    }, []);

    return { stats, isLoading };
}

// Animated Counter Hook
function useCountUp(end, duration = 2000, startOnView = true) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(!startOnView);
    const ref = useRef(null);

    useEffect(() => {
        if (startOnView) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                    }
                },
                { threshold: 0.5 }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, [startOnView, hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, hasStarted]);

    return { count, ref };
}

// Scroll Animation Hook
function useScrollAnimation() {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// Phone Carousel Component
function PhoneCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const slides = [
        {
            id: 1,
            title: "ส่งรูปค่าความดัน",
            userMessage: { type: "image", icon: "📸", text: "ส่งรูปค่าความดัน" },
            botMessages: [
                { type: "bp", systolic: 128, diastolic: 82, pulse: 70, status: "ปกติ", statusColor: "#22c55e", icon: "✅" },
                { type: "chart", text: "กราฟ 7 วันล่าสุด 📊" }
            ]
        },
        {
            id: 2,
            title: "พิมพ์ค่าความดัน",
            userMessage: { type: "text", text: "120/80 70" },
            botMessages: [
                { type: "bp", systolic: 120, diastolic: 80, pulse: 70, status: "ปกติ", statusColor: "#22c55e", icon: "✅" },
                { type: "text", text: "บันทึกเรียบร้อยแล้วค่ะ 📝" }
            ]
        },
        {
            id: 3,
            title: "ส่งรูปใบนัด",
            userMessage: { type: "image", icon: "📋", text: "ส่งรูปใบนัดหมาย" },
            botMessages: [
                { type: "appointment", date: "15 ม.ค. 68", time: "09:30", doctor: "พญ.สมใจ", icon: "📅" },
                { type: "text", text: "ตั้งเตือนก่อนนัด 1 วันค่ะ 🔔" }
            ]
        },
        {
            id: 4,
            title: "พิมพ์วันนัด",
            userMessage: { type: "text", text: "นัด 20 ม.ค. 10:00" },
            botMessages: [
                { type: "appointment", date: "20 ม.ค. 68", time: "10:00", doctor: "นพ.สมชาย", icon: "📅" },
                { type: "text", text: "เพิ่มนัดหมายเรียบร้อยแล้วค่ะ ✨" }
            ]
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextSlide();
        }
        if (touchStart - touchEnd < -50) {
            prevSlide();
        }
    };

    const slide = slides[currentSlide];

    return (
        <div className="phone-mockup">
            <div className="phone-frame">
                <div className="phone-notch"></div>
                <div
                    className="phone-screen"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="screen-header">
                        <img src="/logo.png" alt="ปลาท๊องง" className="screen-logo" />
                        <span>ปลาท๊องง</span>
                    </div>
                    <div className="screen-chat" key={currentSlide}>
                        {/* User Message */}
                        <div className="chat-bubble user-bubble">
                            {slide.userMessage.type === "image" ? (
                                <>
                                    <div className="bubble-image">{slide.userMessage.icon}</div>
                                    <span>{slide.userMessage.text}</span>
                                </>
                            ) : (
                                <span className="user-text-msg">{slide.userMessage.text}</span>
                            )}
                        </div>

                        {/* Bot Messages */}
                        {slide.botMessages.map((msg, idx) => (
                            <div key={idx} className="chat-bubble bot-bubble">
                                {msg.type === "bp" && (
                                    <>
                                        <div className="bp-reading-demo">
                                            <span className="bp-val">{msg.systolic}</span>
                                            <span className="bp-slash">/</span>
                                            <span className="bp-val">{msg.diastolic}</span>
                                            <span className="bp-pulse">{msg.pulse}</span>
                                        </div>
                                        <span className="bp-status" style={{ color: msg.statusColor }}>
                                            {msg.icon} {msg.status}
                                        </span>
                                    </>
                                )}
                                {msg.type === "chart" && (
                                    <>
                                        <div className="mini-chart">
                                            <div className="chart-bar" style={{ height: '60%' }}></div>
                                            <div className="chart-bar" style={{ height: '75%' }}></div>
                                            <div className="chart-bar" style={{ height: '55%' }}></div>
                                            <div className="chart-bar" style={{ height: '80%' }}></div>
                                            <div className="chart-bar active" style={{ height: '65%' }}></div>
                                        </div>
                                        <span>{msg.text}</span>
                                    </>
                                )}
                                {msg.type === "appointment" && (
                                    <div className="appointment-card">
                                        <div className="appt-icon">{msg.icon}</div>
                                        <div className="appt-details">
                                            <div className="appt-date">{msg.date}</div>
                                            <div className="appt-time">🕐 {msg.time}</div>
                                            <div className="appt-doctor">👨‍⚕️ {msg.doctor}</div>
                                        </div>
                                    </div>
                                )}
                                {msg.type === "text" && (
                                    <span>{msg.text}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Slide Indicator */}
                    <div className="slide-indicator">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`indicator-dot ${idx === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(idx)}
                            />
                        ))}
                    </div>

                    {/* Swipe Hint */}
                    <div className="swipe-hint">
                        <span>👈 เลื่อนดูตัวอย่าง 👉</span>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button className="phone-nav phone-nav-prev" onClick={prevSlide}>‹</button>
            <button className="phone-nav phone-nav-next" onClick={nextSlide}>›</button>

            <div className="phone-glow"></div>
        </div>
    );
}

function HomePage() {
    // Fetch real stats from n8n webhook
    const { stats } = useStats();

    const statsAnim = useScrollAnimation();
    const featuresAnim = useScrollAnimation();
    const phoneAnim = useScrollAnimation();
    const reviewsAnim = useScrollAnimation();
    const aboutAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    const usersCount = useCountUp(stats.totalUsers, 2000);
    const bpLogsCount = useCountUp(stats.totalBPLogs, 2500);
    const appointmentsCount = useCountUp(stats.totalAppointments, 2000);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                {/* Animated Fish Characters */}
                <div className="swimming-fish">
                    <img src="/Doctor.png" alt="" className="swim-fish swim-fish-1" />
                    <img src="/SocialMedia.png" alt="" className="swim-fish swim-fish-2" />
                    <img src="/Review.png" alt="" className="swim-fish swim-fish-3" />
                    <img src="/Instruction.png" alt="" className="swim-fish swim-fish-4" />
                </div>

                {/* Fish Tank Decorations */}
                <div className="tank-decorations">
                    <div className="seaweed seaweed-1">🌿</div>
                    <div className="seaweed seaweed-2">🌱</div>
                    <div className="seaweed seaweed-3">🌿</div>
                    <div className="coral coral-1">🪸</div>
                    <div className="coral coral-2">🐚</div>
                </div>

                {/* Bubbles */}
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>

                <div className="hero-content animate-fade-in">
                    <div className="hero-fish-container">
                        <img src="/logo.png" alt="ปลาท๊องง" className="hero-fish" />
                        <div className="hero-glow"></div>
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line">ปลาท๊องง</span>
                    </h1>
                    <p className="hero-tagline">{aboutUs.tagline}</p>
                    <div className="hero-buttons">
                        <Link to="/guide" className="btn btn-glow btn-large">
                            <span className="btn-icon">🏥</span>
                            <span>เริ่มเรียนรู้การวัด BP</span>
                        </Link>
                        <a
                            href="https://lin.ee/WLfjeAG"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-line btn-large"
                        >
                            <span className="btn-icon">💚</span>
                            <span>Add Line OA</span>
                        </a>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>เลื่อนลง</span>
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* Stats Section with Animated Numbers */}
            <section
                ref={statsAnim.ref}
                className={`stats-section ${statsAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="stats-grid">
                    <div className="stat-card stat-card-1" ref={usersCount.ref}>
                        <div className="stat-icon-wrapper">
                            <span className="stat-icon">👥</span>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">{usersCount.count.toLocaleString()}</div>
                            <div className="stat-label">ผู้ใช้งาน</div>
                        </div>
                        <div className="stat-bg-icon">👥</div>
                    </div>
                    <div className="stat-card stat-card-2" ref={bpLogsCount.ref}>
                        <div className="stat-icon-wrapper">
                            <span className="stat-icon">📊</span>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">{bpLogsCount.count.toLocaleString()}</div>
                            <div className="stat-label">ปลาท๊องงช่วยจดความดัน</div>
                        </div>
                        <div className="stat-bg-icon">📊</div>
                    </div>
                    <div className="stat-card stat-card-3" ref={appointmentsCount.ref}>
                        <div className="stat-icon-wrapper">
                            <span className="stat-icon">📅</span>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">{appointmentsCount.count.toLocaleString()}</div>
                            <div className="stat-label">ปลาท๊องงช่วยจดนัดหมาย</div>
                        </div>
                        <div className="stat-bg-icon">📅</div>
                    </div>
                </div>
            </section>

            {/* Phone Demo Section */}
            <section
                ref={phoneAnim.ref}
                className={`phone-demo-section ${phoneAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="phone-demo-container">
                    <div className="phone-demo-content">
                        <span className="section-badge">📱 วิธีใช้งาน</span>
                        <h2 className="section-title-fancy">ง่ายแค่ส่ง Line</h2>
                        <div className="phone-steps">
                            <div className="phone-step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h3>ปลาท๊องงช่วยจดความดัน</h3>
                                    <p>ถ่ายรูปหน้าจอ หรือพิมพ์ค่า 120/80 70</p>
                                </div>
                            </div>
                            <div className="phone-step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h3>ปลาท๊องงช่วยจดนัดหมาย</h3>
                                    <p>ถ่ายรูปใบนัด หรือพิมพ์วันเวลานัดพบแพทย์</p>
                                </div>
                            </div>
                            <div className="phone-step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h3>ดูผลและติดตาม</h3>
                                    <p>ระบบแปลผล สร้างกราฟ และแจ้งเตือนนัดล่วงหน้า</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PhoneCarousel />
                </div>
            </section>

            {/* Features Section */}
            <section
                ref={featuresAnim.ref}
                className={`features-section ${featuresAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="section-header">
                    <h2 className="section-title-fancy">ทำไมต้องใช้ ปลาท๊องง?</h2>
                    <p className="section-subtitle">เครื่องมือครบครันสำหรับดูแลความดันโลหิต</p>
                </div>
                <div className="features-bento">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card feature-card-${index + 1}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">{feature.icon}</span>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <div className="feature-shine"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews Section */}
            <section
                ref={reviewsAnim.ref}
                className={`reviews-section ${reviewsAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="section-header">
                    <h2 className="section-title-fancy">เสียงจากผู้ใช้งานจริง</h2>
                </div>
                <div className="reviews-carousel">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="review-card"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="review-quote">"</div>
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-author">
                                <span className="review-avatar">{review.avatar}</span>
                                <span className="review-stars">
                                    {"★".repeat(review.rating)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Us Section */}
            <section
                ref={aboutAnim.ref}
                className={`about-section ${aboutAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="about-container">
                    <div className="about-visual">
                        <div className="about-fish-wrapper">
                            <img src="/logo.png" alt="ปลาท๊องง" className="about-fish" />
                            <div className="about-ring about-ring-1"></div>
                            <div className="about-ring about-ring-2"></div>
                            <div className="about-ring about-ring-3"></div>
                        </div>
                    </div>
                    <div className="about-content">
                        <span className="section-badge">🐟 เกี่ยวกับเรา</span>
                        <h2 className="about-title">{aboutUs.name}</h2>
                        <p className="about-vision">{aboutUs.vision}</p>
                        <p className="about-subvision">{aboutUs.subVision}</p>
                        <div className="about-mission">
                            {aboutUs.mission.map((item, index) => (
                                <div
                                    key={index}
                                    className="mission-item"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <span className="mission-check">✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                ref={ctaAnim.ref}
                className={`cta-section ${ctaAnim.isVisible ? 'animate-in' : ''}`}
            >
                <div className="cta-card">
                    <div className="cta-waves">
                        <div className="wave wave-1"></div>
                        <div className="wave wave-2"></div>
                    </div>
                    <div className="cta-content">
                        <h2>พร้อมดูแลสุขภาพความดันแล้วหรือยัง?</h2>
                        <p>เรียนรู้การวัดความดันที่ถูกต้อง บันทึกผลง่ายๆ ผ่าน Line</p>
                        <div className="cta-buttons">
                            <Link to="/guide" className="btn btn-white btn-large">
                                <span>📖</span> ดูคู่มือการวัด
                            </Link>
                            <Link to="/knowledge" className="btn btn-outline-white btn-large">
                                <span>🧠</span> เรียนรู้เพิ่มเติม
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
