import { useState } from "react";

const defaultTactics = [
  { name: "Tactic 1", budget: 30000 },
  { name: "Tactic 2", budget: 25000 },
  { name: "Tactic 3", budget: 25000 },
  { name: "Tactic 4", budget: 20000 },
  { name: "Tactic 5", budget: 0 },
  { name: "Tactic 6", budget: 0 },
  { name: "Tactic 7", budget: 0 },
  { name: "Tactic 8", budget: 0 },
  { name: "Tactic 9", budget: 0 },
  { name: "Tactic 10", budget: 0 },
];

const fmt = (n) =>
  n === 0 ? "—" : "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n) => (n === 0 ? "—" : (n * 100).toFixed(1) + "%");

export default function App() {
  const [campaignName, setCampaignName] = useState("My PARK Campaign");
  const [totalBudget, setTotalBudget] = useState(100000);
  const [monthlySpend, setMonthlySpend] = useState(16250);
  const [tactics, setTactics] = useState(defaultTactics);
  const [activeTab, setActiveTab] = useState("calculator");

  const tacticTotal = tactics.reduce((s, t) => s + (parseFloat(t.budget) || 0), 0);
  const budgetMatch = Math.abs(tacticTotal - totalBudget) < 0.01;

  const updateTactic = (i, field, val) => {
    const next = [...tactics];
    next[i] = { ...next[i], [field]: val };
    setTactics(next);
  };

  const addTactic = () => setTactics([...tactics, { name: `Tactic ${tactics.length + 1}`, budget: 0 }]);
  const removeTactic = (i) => tactics.length > 1 && setTactics(tactics.filter((_, idx) => idx !== i));

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: "100vh",
      background: "#e8edf2",
      color: "#1a2533",
      fontSize: 13,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: inherit; }
        .tab-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          padding: 10px 18px;
          color: #6b7c93;
          transition: all 0.15s;
        }
        .tab-btn.active { color: #1a3a6a; border-bottom: 2px solid #1a3a6a; }
        .tab-btn:hover:not(.active) { color: #1a3a6a; }
        .tactic-row {
          display: grid;
          grid-template-columns: 1fr 180px 100px 48px;
          align-items: center;
          border-bottom: 1px solid #e4eaf1;
          background: #fff;
          transition: background 0.1s;
        }
        .tactic-row:hover { background: #f5f8fc; }
        .cell { padding: 9px 14px; }
        .name-input, .budget-input {
          background: transparent;
          border: none;
          color: #1a2533;
          font-family: inherit;
          font-size: 13px;
          width: 100%;
          outline: none;
        }
        .name-input:focus, .budget-input:focus { background: #f0f5fb; border-radius: 3px; padding: 1px 4px; }
        .budget-input { text-align: right; }
        .summary-card { background: #ffffff; border: 1px solid #dce5ef; padding: 18px 22px; border-radius: 6px; }
        .match-badge { display: inline-block; padding: 2px 9px; font-size: 11px; font-weight: 500; border-radius: 20px; }
        .match-ok  { background: #e6f4ea; color: #1e7e34; border: 1px solid #a8d5b0; }
        .match-err { background: #fdecea; color: #b71c1c; border: 1px solid #f5a8a8; }
        .add-btn {
          background: none;
          border: 1px solid #c5d3e0;
          color: #3a5f85;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .add-btn:hover { border-color: #1a3a6a; color: #1a3a6a; background: #f0f5fb; }
        .del-btn { background: none; border: none; color: #b0bec5; font-size: 17px; cursor: pointer; padding: 3px 7px; border-radius: 3px; line-height: 1; transition: all 0.15s; }
        .del-btn:hover { color: #c62828; background: #fdecea; }
        .bar-track { height: 4px; background: #e4eaf1; border-radius: 2px; overflow: hidden; margin-top: 10px; }
        .bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
        .col-header { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #7a90a8; padding: 8px 14px; background: #f4f7fa; border-bottom: 1px solid #dce5ef; }
        .total-input { background: #f4f7fa; border: 1px solid #dce5ef; color: #1a3a6a; font-family: inherit; font-size: 20px; font-weight: 600; width: 190px; padding: 7px 12px; border-radius: 4px; outline: none; text-align: right; }
        .total-input:focus { border-color: #1a3a6a; background: #fff; box-shadow: 0 0 0 2px rgba(26,58,106,0.08); }
        .month-input { background: #f4f7fa; border: 1px solid #dce5ef; color: #1a5276; font-family: inherit; font-size: 20px; font-weight: 600; width: 190px; padding: 7px 12px; border-radius: 4px; outline: none; text-align: right; }
        .month-input:focus { border-color: #1a5276; background: #fff; box-shadow: 0 0 0 2px rgba(26,82,118,0.08); }
        .card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #7a90a8; margin-bottom: 10px; }
      `}</style>

      <div style={{ padding: "18px 22px" }}>
        <div style={{ background: "#fff", border: "1px solid #dce5ef", borderRadius: 6, overflow: "hidden" }}>

          {/* Campaign title */}
          <div style={{ padding: "10px 18px", borderBottom: "1px solid #edf1f6", display: "flex", alignItems: "center" }}>
            <input
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 14, fontWeight: 600, color: "#1a2533", flex: 1, background: "transparent" }}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", paddingLeft: 4, borderBottom: "1px solid #edf1f6", background: "#fafbfd" }}>
            {[
              { key: "calculator", label: "Budget Calculator" },
              { key: "monthly",    label: "Monthly Actuals" },
            ].map(({ key, label }) => (
              <button key={key} className={`tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 18px" }}>

            {/* BUDGET CALCULATOR */}
            {activeTab === "calculator" && (
              <div>
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div className="summary-card" style={{ flex: 1 }}>
                    <div className="card-label">Total Campaign Budget</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#7a90a8", fontSize: 18, fontWeight: 500 }}>$</span>
                      <input className="total-input" type="number" value={totalBudget} onChange={e => setTotalBudget(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="summary-card" style={{ flex: 1 }}>
                    <div className="card-label">Tactic Total</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20, fontWeight: 600, color: budgetMatch ? "#1e7e34" : "#b71c1c" }}>{fmt(tacticTotal)}</span>
                      <span className={`match-badge ${budgetMatch ? "match-ok" : "match-err"}`}>
                        {budgetMatch ? "✓ Balanced" : `${fmt(Math.abs(totalBudget - tacticTotal))} ${tacticTotal > totalBudget ? "over" : "under"}`}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{
                        width: `${Math.min((tacticTotal / (totalBudget || 1)) * 100, 100)}%`,
                        background: budgetMatch ? "linear-gradient(90deg, #43a85a, #66cc7a)" : "linear-gradient(90deg, #3a6ea8, #5a9fd4)",
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{ border: "1px solid #dce5ef", borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 100px 48px" }}>
                    {["Placement / Tactic Name", "Budget ($)", "% of Total", ""].map((h, i) => (
                      <div key={i} className="col-header" style={{ textAlign: i === 1 || i === 2 ? "right" : "left" }}>{h}</div>
                    ))}
                  </div>
                  {tactics.map((t, i) => {
                    const b = parseFloat(t.budget) || 0;
                    const p = totalBudget > 0 ? b / totalBudget : 0;
                    return (
                      <div key={i} className="tactic-row">
                        <div className="cell">
                          <input className="name-input" value={t.name} onChange={e => updateTactic(i, "name", e.target.value)} placeholder={`Tactic ${i + 1}`} />
                        </div>
                        <div className="cell" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                          <span style={{ color: "#aab8c8", fontSize: 12 }}>$</span>
                          <input className="budget-input" type="number" value={t.budget === 0 ? "" : t.budget} placeholder="0" onChange={e => updateTactic(i, "budget", parseFloat(e.target.value) || 0)} style={{ width: 130 }} />
                        </div>
                        <div className="cell" style={{ textAlign: "right", color: p > 0 ? "#1a3a6a" : "#c5d3e0", fontWeight: p > 0 ? 500 : 400 }}>{pct(p)}</div>
                        <div className="cell" style={{ textAlign: "center" }}>
                          <button className="del-btn" onClick={() => removeTactic(i)}>×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="add-btn" onClick={addTactic}>+ Add Tactic</button>
              </div>
            )}

            {/* MONTHLY ACTUALS */}
            {activeTab === "monthly" && (
              <div>
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div className="summary-card" style={{ flex: 1 }}>
                    <div className="card-label">Monthly Spend</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#7a90a8", fontSize: 18, fontWeight: 500 }}>$</span>
                      <input className="month-input" type="number" value={monthlySpend} onChange={e => setMonthlySpend(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="summary-card" style={{ flex: 1 }}>
                    <div className="card-label">Calculated From</div>
                    <div style={{ fontSize: 13, color: "#6b7c93" }}>
                      Budget percentages set in <span style={{ color: "#1a3a6a", fontWeight: 500 }}>Budget Calculator</span> tab
                    </div>
                    <div style={{ fontSize: 11, color: "#aab8c8", marginTop: 5 }}>Monthly spend distributed proportionally by tactic %</div>
                  </div>
                </div>

                <div style={{ border: "1px solid #dce5ef", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px" }}>
                    {["Placement / Tactic", "Monthly Spend ($)", "% of Budget"].map((h, i) => (
                      <div key={i} className="col-header" style={{ textAlign: i > 0 ? "right" : "left" }}>{h}</div>
                    ))}
                  </div>
                  {tactics.filter(t => (parseFloat(t.budget) || 0) > 0 || t.name.trim()).map((t, i) => {
                    const b = parseFloat(t.budget) || 0;
                    const p = totalBudget > 0 ? b / totalBudget : 0;
                    const monthly = monthlySpend * p;
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px", borderBottom: "1px solid #e4eaf1", background: "#fff", transition: "background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5f8fc"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                      >
                        <div className="cell" style={{ color: p > 0 ? "#1a2533" : "#aab8c8" }}>{t.name || `Tactic ${i + 1}`}</div>
                        <div className="cell" style={{ textAlign: "right", fontWeight: 500, color: monthly > 0 ? "#1a5276" : "#aab8c8" }}>{monthly > 0 ? fmt(monthly) : "—"}</div>
                        <div className="cell" style={{ textAlign: "right", color: p > 0 ? "#1a3a6a" : "#aab8c8" }}>{pct(p)}</div>
                      </div>
                    );
                  })}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px", background: "#f4f7fa", borderTop: "1px solid #dce5ef" }}>
                    <div className="cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#7a90a8" }}>Total</div>
                    <div className="cell" style={{ textAlign: "right", fontWeight: 600, color: "#1a5276" }}>{fmt(monthlySpend)}</div>
                    <div className="cell" style={{ textAlign: "right", fontWeight: 500, color: "#1a3a6a" }}>100.0%</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ padding: "10px 18px", borderTop: "1px solid #edf1f6", background: "#fafbfd", fontSize: 11, color: "#aab8c8" }}>
            TIP: Rename tactics to their Placement Names in PARK · Double-check totals before submitting
          </div>
        </div>
      </div>
    </div>
  );
}
