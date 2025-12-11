function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <img src="/logo.png" alt="ปลาท๊องง" className="footer-logo" />
                    <span>ปลาท๊องง - ผู้ช่วยดูแลสุขภาพความดัน</span>
                </div>
                <div className="footer-links">
                    <a
                        href="https://lin.ee/WLfjeAG"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-line-btn"
                    >
                        <span>💚</span> Line OA
                    </a>
                    <a
                        href="https://www.facebook.com/profile.php?id=61584036074074"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-fb-btn"
                    >
                        <span>📘</span> Facebook
                    </a>
                </div>
                <div className="footer-copyright">
                    © 2025 ปลาท๊องง. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
