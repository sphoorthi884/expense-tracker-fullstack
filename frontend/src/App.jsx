import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000/api";


const CATEGORY_COLOR_MAP = {
  Food: "#22c55e",
  Groceries: "#22c55e",
  Travel: "#3b82f6",
  Transport: "#0ea5e9",
  Shopping: "#a855f7",
  Bills: "#f97316",
  Rent: "#ef4444",
  Salary: "#22c55e",
  Other: "#64748b",
};

function generatePalette(n) {
  const colors = [];
  const goldenAngle = 137.508;
  for (let i = 0; i < n; i++) {
    const hue = (i * goldenAngle) % 360;
    colors.push(`hsl(${hue} 70% 45%)`);
  }
  return colors;
}


function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } else {
      alert(data.error || "Register failed");
    }
  }

  return (
    <div className="app-root">
      <div className="app-shell auth-layout">
        <div className="card auth-card">
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
            Create account
          </h2>
          <p className="section-subtitle">
            Track your expenses with a clean, simple dashboard.
          </p>
          <form
            onSubmit={submit}
            className="form-grid"
            style={{ marginTop: 14 }}
          >
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn" style={{ marginTop: 4 }}>
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devToken, setDevToken] = useState("");

  async function submitLogin(e) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } else {
      alert(data.error || "Login failed");
    }
  }

  async function submitForgot(e) {
    e.preventDefault();
    const useEmail = resetEmail || email;
    if (!useEmail) {
      alert("Enter your email first");
      return;
    }
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: useEmail }),
    });
    const data = await res.json();
    if (data.ok) {
      if (data.token) {
        setDevToken(data.token);
        setResetToken(data.token);
      }
      alert("If this email exists, a reset token has been generated.");
    } else {
      alert(data.error || "Could not request reset");
    }
  }

  async function submitReset(e) {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      alert("Enter token and new password");
      return;
    }
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, newPassword }),
    });
    const data = await res.json();
    if (data.ok) {
      alert("Password reset successful. You can login with the new password.");
      setShowForgot(false);
      setPassword("");
      setNewPassword("");
      setResetToken("");
      setDevToken("");
    } else {
      alert(data.error || "Reset failed");
    }
  }

  if (showForgot) {
    return (
      <div className="app-root">
        <div className="app-shell auth-layout">
          <div className="card auth-card">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
              Forgot password
            </h2>
            <p className="section-subtitle">
              Request a reset token and set a new password.
            </p>

            <form
              onSubmit={submitForgot}
              className="form-grid"
              style={{ marginTop: 14, marginBottom: 16 }}
            >
              <input
                placeholder="Email"
                value={resetEmail || email}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button className="btn">Send reset token</button>
            </form>

            <form
              onSubmit={submitReset}
              className="form-grid"
              style={{ marginBottom: 16 }}
            >
              <input
                placeholder="Reset token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
              <input
                placeholder="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="btn">Reset password</button>
            </form>

            {devToken ? (
              <div
                style={{
                  fontSize: 12,
                  background: "#f3f4f6",
                  padding: 8,
                  borderRadius: 10,
                  wordBreak: "break-all",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Dev token (for testing):
                </div>
                <code>{devToken}</code>
              </div>
            ) : null}

            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForgot(false)}
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="app-shell auth-layout">
        <div className="card auth-card">
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
            Login
          </h2>
          <p className="section-subtitle">
            Sign in to view your expense dashboard.
          </p>

          <form
            onSubmit={submitLogin}
            className="form-grid"
            style={{ marginTop: 14 }}
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="form-row"
              style={{ justifyContent: "space-between", marginTop: 2 }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="btn">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={switchToRegister}
                >
                  Register
                </button>
              </div>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


function CategoryManager({ onClose }) {
  const token = localStorage.getItem("token");
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch(`${API}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCats(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return alert("Enter name");
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (res.status === 201) {
      setName("");
      load();
    } else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Create failed");
    }
  }

  async function rename(id) {
    const newName = prompt("New name");
    if (!newName) return;
    const res = await fetch(`${API}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) load();
    else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Rename failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete category? This will remove it from transactions."))
      return;
    const res = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) load();
    else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Delete failed");
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div className="section-title">Categories</div>
      <p className="section-subtitle">
        Manage your custom categories for transactions.
      </p>

      <div className="form-row" style={{ marginTop: 8 }}>
        <input
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn" onClick={create}>
          Add
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onClose}
          style={{ marginLeft: "auto" }}
        >
          Close
        </button>
      </div>

      <div className="cat-list">
        {cats.map((c) => (
          <div key={c.id} className="cat-item">
            <span>{c.name}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-secondary"
                onClick={() => rename(c.id)}
              >
                Rename
              </button>
              <button
                className="btn btn-danger"
                onClick={() => remove(c.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function CategoryPie({ from, to }) {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const qs = new URLSearchParams();
      if (from) qs.set("from", from);
      if (to) qs.set("to", to);
      const res = await fetch(
        `${API}/analytics/sum-by-category?${qs.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const arr = await res.json();
      arr.sort((a, b) => (b.total || 0) - (a.total || 0));
      const labels = arr.map((a) => a.category);
      const values = arr.map((a) => Number(a.total || 0));

      const palette = generatePalette(labels.length);
      const colors = labels.map((label, idx) => {
        const key = label || "Other";
        return CATEGORY_COLOR_MAP[key] || palette[idx];
      });
      setData({ labels, values, colors });
    }
    load();
  }, [from, to]);

  if (!data) return <div>Loading category chart...</div>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Amount",
        data: data.values,
        backgroundColor: data.colors,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Spending by category" },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-card">
      <div className="pie-wrapper">
        <Pie data={chartData} options={options} />
      </div>
      <div className="legend-row">
        {data.labels.map((label, i) => (
          <div key={label + i} className="legend-chip">
            <div
              className="legend-dot"
              style={{ backgroundColor: data.colors[i] }}
            />
            <span>
              {label || "Uncategorized"} — ₹{data.values[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyBar({ year }) {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${API}/analytics/monthly-summary?year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const arr = await res.json();
      const labels = arr.map(
        (a) =>
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][a.month - 1]
      );
      const values = arr.map((a) => a.total);
      setData({ labels, values });
    }
    load();
  }, [year]);

  if (!data) return <div>Loading monthly summary...</div>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: `Total (${year})`,
        data: data.values,
        backgroundColor: "rgba(59,130,246,0.85)",
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: `Monthly totals — ${year}`,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-card">
      <div style={{ height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}


function ChangePasswordForm({ onSubmit, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentPassword || !nextPassword) {
      alert("Please fill all fields");
      return;
    }
    if (nextPassword !== confirm) {
      alert("New password and confirm do not match");
      return;
    }
    onSubmit(currentPassword, nextPassword);
  }

  return (
    <div
      style={{
        marginTop: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
      }}
    >
      <div className="section-title">Change password</div>
      <form
        onSubmit={handleSubmit}
        className="form-grid"
        style={{ maxWidth: 360, marginTop: 6 }}
      >
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={nextPassword}
          onChange={(e) => setNextPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <div className="form-row">
          <button type="submit" className="btn">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


function Dashboard() {
  const token = localStorage.getItem("token");
  const [txs, setTxs] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [showCats, setShowCats] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function load() {
    const res = await fetch(`${API}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      alert("Unauthorized — please login again");
      return;
    }
    const data = await res.json();
    setTxs(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    const res = await fetch(`${API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        type,
        transactionDate: date,
        categoryName: category,
      }),
    });

    if (res.status === 201) {
      setAmount("");
      setCategory("");
      load();
    } else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Error creating transaction");
    }
  }

  async function removeTx(id) {
    if (!confirm("Delete this transaction?")) return;
    const res = await fetch(`${API}/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) load();
    else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Delete failed");
    }
  }

  async function editTx(tx) {
    const newAmount = prompt("Amount", tx.amount);
    if (newAmount === null) return;
    const newType = prompt("Type (expense/income)", tx.type) || tx.type;
    const newDate =
      prompt("Date (YYYY-MM-DD)", tx.transactionDate.slice(0, 10)) ||
      tx.transactionDate.slice(0, 10);
    const newCategory = prompt(
      "Category (leave empty for none)",
      tx.category?.name || ""
    );
    const newNote = prompt("Note (optional)", tx.note || "");

    const payload = {
      amount: newAmount,
      type: newType,
      transactionDate: newDate,
      categoryName: newCategory || null,
      note: newNote,
    };

    const res = await fetch(`${API}/transactions/${tx.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) load();
    else {
      const d = await res.json().catch(() => null);
      alert(d?.error || "Update failed");
    }
  }

  async function handleChangePassword(currentPassword, newPassword) {
    const res = await fetch(`${API}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const d = await res.json().catch(() => null);
    if (d?.ok) {
      alert("Password changed");
      setShowChangePass(false);
    } else {
      alert(d?.error || "Change password failed");
    }
  }

  return (
    <div className="app-root">
      <div className="app-shell">
        <div className="card">
          <div className="dashboard-header">
            <div>
              <div className="dashboard-title">Expense Tracker</div>
              <div className="section-subtitle">
                Quickly add expenses, manage categories, and view trends.
              </div>
            </div>
            <div className="toolbar">
              <button className="btn btn-secondary" onClick={load}>
                Refresh
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCats(true);
                  setShowAnalytics(false);
                }}
              >
                Categories
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAnalytics((s) => !s);
                  setShowCats(false);
                }}
              >
                {showAnalytics ? "Hide analytics" : "Analytics"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowChangePass((s) => !s)}
              >
                {showChangePass ? "Close password" : "Change password"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  localStorage.removeItem("token");
                  location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {showChangePass && (
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              onCancel={() => setShowChangePass(false)}
            />
          )}

          {showAnalytics ? (
            <>
              <div
                className="form-row"
                style={{ marginTop: 10, marginBottom: 12, flexWrap: "wrap" }}
              >
                <span className="pill">Analytics</span>
                <label style={{ fontSize: 13 }}>
                  Year:&nbsp;
                  <input
                    type="number"
                    style={{ width: 80 }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </label>
                <label style={{ fontSize: 13 }}>
                  From:&nbsp;
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </label>
                <label style={{ fontSize: 13 }}>
                  To:&nbsp;
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </label>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setShowAnalytics(false);
                    setTimeout(() => setShowAnalytics(true), 40);
                  }}
                >
                  Refresh
                </button>
              </div>
              <div className="charts-layout">
                <CategoryPie from={from} to={to} />
                <MonthlyBar year={year} />
              </div>
            </>
          ) : showCats ? (
            <CategoryManager onClose={() => setShowCats(false)} />
          ) : (
            <>
              <div style={{ marginTop: 12 }}>
                <div className="section-title">Add transaction</div>
                <form
                  onSubmit={add}
                  className="form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0,120px) minmax(0,120px) minmax(0,150px) minmax(0,1fr) minmax(0,90px)",
                    gap: 8,
                    alignItems: "stretch",
                    marginTop: 6,
                  }}
                >
                  <input
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <button className="btn">Add</button>
                </form>
              </div>

              <div className="tx-list">
                {txs.map((t) => (
                  <div key={t.id} className="tx-item">
                    <div>
                      <div className="tx-main">
                        <strong>{t.transactionDate.slice(0, 10)}</strong> —{" "}
                        {t.type} — ₹{t.amount}
                      </div>
                      <div className="tx-meta">
                        {t.category?.name || "-"}
                        {t.note ? <> · {t.note}</> : null}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => editTx(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeTx(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return showRegister ? (
      <Register onLogin={setUser} />
    ) : (
      <Login onLogin={setUser} switchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
}
