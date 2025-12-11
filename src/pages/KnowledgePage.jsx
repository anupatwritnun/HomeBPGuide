import { useState } from 'react';
import { bpControlTips, bpInterpretation } from '../data/siteData';

function KnowledgePage() {
    const [expandedTip, setExpandedTip] = useState(null);
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [result, setResult] = useState(null);

    const toggleTip = (index) => {
        setExpandedTip(expandedTip === index ? null : index);
    };

    const interpretBP = () => {
        const sys = parseInt(systolic);
        const dia = parseInt(diastolic);

        if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) {
            setResult({ error: true, message: 'กรุณากรอกค่าความดันให้ถูกต้อง' });
            return;
        }

        let interpretation = null;

        // Check from highest to lowest severity
        if (sys > 180 || dia > 120) {
            interpretation = bpInterpretation.find(bp => bp.level === 'วิกฤต');
        } else if (sys >= 140 || dia >= 90) {
            interpretation = bpInterpretation.find(bp => bp.level === 'ความดันสูงระยะ 2');
        } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
            interpretation = bpInterpretation.find(bp => bp.level === 'ความดันสูงระยะ 1');
        } else if (sys >= 120 && sys <= 129 && dia < 80) {
            interpretation = bpInterpretation.find(bp => bp.level === 'ค่อนข้างสูง');
        } else if (sys < 120 && dia < 80) {
            interpretation = bpInterpretation.find(bp => bp.level === 'ปกติ');
        } else {
            interpretation = bpInterpretation.find(bp => bp.level === 'ค่อนข้างสูง');
        }

        setResult({ error: false, data: interpretation, sys, dia });
    };

    const resetForm = () => {
        setSystolic('');
        setDiastolic('');
        setResult(null);
    };

    return (
        <div className="knowledge-page">
            {/* Hero */}
            <section className="knowledge-hero">
                <div className="knowledge-hero-icon">🧠</div>
                <h1>ความรู้เรื่องความดันโลหิต</h1>
                <p>ตรวจสอบค่าความดัน เรียนรู้วิธีควบคุม และเข้าใจผลที่วัดได้</p>
            </section>

            {/* 1. BP Checker Form - FIRST */}
            <section className="bp-checker-section">
                <div className="bp-checker-card">
                    <div className="bp-checker-header">
                        <span className="bp-checker-icon">🩺</span>
                        <h2>ตรวจสอบค่าความดันของคุณ</h2>
                        <p>กรอกค่าความดันที่วัดได้ เพื่อดูผลการแปลความหมาย</p>
                    </div>

                    <div className="bp-input-group">
                        <div className="bp-input-wrapper">
                            <label htmlFor="systolic">Systolic (ตัวบน)</label>
                            <div className="bp-input-container">
                                <input
                                    type="number"
                                    id="systolic"
                                    placeholder="120"
                                    value={systolic}
                                    onChange={(e) => setSystolic(e.target.value)}
                                    min="60"
                                    max="250"
                                />
                                <span className="bp-unit">mmHg</span>
                            </div>
                        </div>

                        <div className="bp-input-divider">/</div>

                        <div className="bp-input-wrapper">
                            <label htmlFor="diastolic">Diastolic (ตัวล่าง)</label>
                            <div className="bp-input-container">
                                <input
                                    type="number"
                                    id="diastolic"
                                    placeholder="80"
                                    value={diastolic}
                                    onChange={(e) => setDiastolic(e.target.value)}
                                    min="40"
                                    max="150"
                                />
                                <span className="bp-unit">mmHg</span>
                            </div>
                        </div>
                    </div>

                    <div className="bp-checker-buttons">
                        <button className="btn-check" onClick={interpretBP}>
                            🔍 ตรวจสอบผล
                        </button>
                        {(systolic || diastolic || result) && (
                            <button className="btn-reset" onClick={resetForm}>
                                ล้างค่า
                            </button>
                        )}
                    </div>

                    {/* Result Display */}
                    {result && (
                        <div className={`bp-result ${result.error ? 'bp-result-error' : ''}`}>
                            {result.error ? (
                                <div className="bp-result-error-content">
                                    <span className="bp-result-icon">⚠️</span>
                                    <p>{result.message}</p>
                                </div>
                            ) : (
                                <div className="bp-result-content">
                                    <div
                                        className="bp-result-badge"
                                        style={{ backgroundColor: result.data.color }}
                                    >
                                        <span className="bp-result-emoji">{result.data.icon}</span>
                                        <span className="bp-result-level">{result.data.level}</span>
                                    </div>
                                    <div className="bp-result-values">
                                        <span className="bp-result-reading">{result.sys}/{result.dia}</span>
                                        <span className="bp-result-label">mmHg</span>
                                    </div>
                                    <div className="bp-result-action">
                                        <strong>คำแนะนำ:</strong> {result.data.action}
                                    </div>
                                    {result.data.level === 'วิกฤต' && (
                                        <div className="bp-result-emergency">
                                            🚨 หากมีอาการปวดหัว เจ็บหน้าอก หรือหายใจลำบาก ให้โทร 1669 ทันที!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 2. BP Interpretation Table - SECOND */}
            <section className="interpretation-section">
                <h2 className="section-title">📊 ตารางแปลผลความดันโลหิต</h2>
                <p className="interpretation-note">
                    ค่าความดันวัดเป็น mmHg (มิลลิเมตรปรอท) โดย Systolic คือตัวบน, Diastolic คือตัวล่าง
                </p>

                <div className="interpretation-table-wrapper">
                    <table className="interpretation-table">
                        <thead>
                            <tr>
                                <th>ระดับ</th>
                                <th>Systolic (บน)</th>
                                <th>Diastolic (ล่าง)</th>
                                <th>คำแนะนำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bpInterpretation.map((row, index) => (
                                <tr key={index} style={{ '--row-color': row.color }}>
                                    <td>
                                        <span className="level-badge" style={{ backgroundColor: row.color }}>
                                            {row.icon} {row.level}
                                        </span>
                                    </td>
                                    <td className="bp-value">{row.systolic}</td>
                                    <td className="bp-value">{row.diastolic}</td>
                                    <td className="action-text">{row.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 3. Lifestyle Modification Tips - THIRD (at bottom) */}
            <section className="tips-section">
                <h2 className="section-title">💪 การปรับเปลี่ยนพฤติกรรม (Lifestyle Modification)</h2>
                <p className="section-subtitle">วิธีควบคุมความดันโลหิตด้วยตัวเอง</p>
                <div className="tips-grid">
                    {bpControlTips.map((tip, index) => (
                        <div
                            key={index}
                            className={`tip-card ${expandedTip === index ? 'expanded' : ''}`}
                            onClick={() => toggleTip(index)}
                        >
                            <div className="tip-header">
                                <span className="tip-icon">{tip.icon}</span>
                                <h3 className="tip-title">{tip.title}</h3>
                                <span className="tip-expand">{expandedTip === index ? '−' : '+'}</span>
                            </div>
                            <p className="tip-description">{tip.description}</p>
                            {expandedTip === index && (
                                <ul className="tip-details">
                                    {tip.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Important Notes */}
            <section className="notes-section">
                <div className="notes-card">
                    <h3>📝 หมายเหตุสำคัญ</h3>
                    <ul>
                        <li>ค่าความดันอาจเปลี่ยนแปลงได้ตลอดทั้งวัน ควรวัดเป็นประจำ</li>
                        <li>หากค่าความดันสูงกว่าปกติ ควรพักผ่อน 5 นาที แล้ววัดใหม่</li>
                        <li>หากค่าผิดปกติต่อเนื่อง ควรปรึกษาแพทย์</li>
                        <li>การวินิจฉัยโรคความดันต้องทำโดยแพทย์เท่านั้น</li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="knowledge-cta">
                <a
                    href="https://lin.ee/WLfjeAG"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-line btn-large"
                >
                    💚 บันทึกค่าความดันผ่าน Line OA ปลาท๊องง
                </a>
            </section>
        </div>
    );
}

export default KnowledgePage;
