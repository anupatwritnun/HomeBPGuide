import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="/logo.png" alt="ปลาท๊องง" className="navbar-logo" />
                <span className="navbar-title">ปลาท๊องง</span>
            </div>
            <div className="navbar-links">
                <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
                    หน้าแรก
                </Link>
                <Link to="/guide" className={`navbar-link ${isActive('/guide') ? 'active' : ''}`}>
                    คู่มือวัด BP
                </Link>
                <Link to="/knowledge" className={`navbar-link ${isActive('/knowledge') ? 'active' : ''}`}>
                    ความรู้
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
