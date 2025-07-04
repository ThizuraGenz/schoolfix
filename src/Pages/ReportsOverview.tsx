import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportsOverview.css";
import { LogIn, Plus, Wrench, MapPin } from "lucide-react";

interface Report {
  id: string;
  image: string;
  type: string;
  location: string;
  status: string;
  priority: "Important" | "Normal" | "Low";
}

const ReportsOverview = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);

  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLogin]);

  const priority = (priority: string) => {
    if (priority === "Important") {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (priority === "Normal") {
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    const storedReports = localStorage.getItem("reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Thisu" && password === "tip365") {
      localStorage.setItem("isAdmin", "true");
      setShowLogin(false);
      navigate("/admin");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="page-wrapper admin-container">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-10 w-10 text-blue-400" />
                <span className="text-4xl font-bold text-white">SchoolFix</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ">
              {reports.length !== 0 && (
                <div
                  onClick={() => navigate("/report")}
                  className="flex items-center space-x-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl font-semibold transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Report an Issue</span>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="px-3 py-2 rounded-2xl cursor-pointer bg-red-700 flex items-center space-x-2">
                  <span
                    onClick={() => setShowLogin(true)}
                    className="text-white text-sm"
                  >
                    Admin Login{" "}
                  </span>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="p-1 text-gray-300 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {reports.length === 0 && (
        <div className="mt-5 bg-gradient-to-r glass-container rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to SchoolFix!</h1>
          <p className="text-blue-100 mb-6">
            Report maintenance issues quickly and track their progress in
            real-time.
          </p>
          <div
            onClick={() => navigate("/report")}
            className="cursor-pointer px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 mt-4
    bg-gradient-to-r from-white via-blue-100 to-blue-200
    text-blue-900 hover:text-blue-950 hover:scale-[1.04]
    border border-blue-300 shadow-sm hover:shadow-md
    transition-all duration-300 ease-in-out"
          >
            <Plus className="h-5 w-5 text-blue-800" />
            <span>Report an Issue</span>
          </div>
        </div>
      )}
      {/* Glass container */}
      {reports.length !== 0 && (
        <div className="glass-container mt-5 ">
          <div className="reports-grid">
            {reports.map((report) => (
              <div
                className="report-card justify-betweenreport-card flex flex-col justify-between p-4"
                key={report.id}
              >
                {/* Priority Badge */}
                <span
                  className={`absolute top-3 left-2 px-3 py-1 rounded-full text-xs border font-medium z-10 ${priority(
                    report.priority
                  )}`}
                >
                  {report.priority}
                </span>
                <img src={report.image} alt="report" className="report-image" />
                <div className="report-details text-center space-y-4">
                  <h4 className="text-lg font-semibold">{report.type}</h4>

                  <div className="flex items-center justify-center gap-2 text-gray-300 font-medium text-1xl mb-2">
                    <MapPin className="h-5 w-5" />
                    <span>{report.location}</span>
                  </div>

                  <p className="text-sm text-gray-400">
                    Description is send to admins
                  </p>

                  <span
                    className={`badge ${report.status
                      .toLowerCase()
                      .replace(/\s/g, "")}`}
                  >
                    {report.status === "Reviewing" && "🕵️‍♂️ "}
                    {report.status === "Reviewed" && "✅ "}
                    {report.status === "Gone to Work" && "🔧 "}
                    {report.status === "Done" && "✔️ "}
                    {report.status}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(report.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-backdrop">
          <div className="modal-content-glass">
            <h4 className="mb-3">Admin Login</h4>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                className="form-control mb-2"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                className="form-control mb-2"
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError && <p className="text-danger">{loginError}</p>}
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="submit" className="btn btn-success">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsOverview;
