import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import { FileText, LogOut, MapPin, Trash2, Wrench } from "lucide-react";

interface Report {
  id: string;
  image: string;
  type: string;
  location: string;
  status: string;
  description?: string;
  priority: "Important" | "Normal" | "Low";
}

const AdminPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/");
    }

    const storedReports = localStorage.getItem("reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, [navigate]);

  const handleStatusToggle = (id: string, newStatus: string) => {
    const updatedReports = reports.map((report) =>
      report.id === id ? { ...report, status: newStatus } : report
    );
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleDelete = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const priority = (priority: string) => {
    if (priority === "Important") {
      return "important-priority";
    } else if (priority === "Normal") {
      return "normal-priority";
    } else {
      return "low-priority";
    }
  };

  return (
    <div className="admin-container">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">SchoolFix-ADMIN</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="px-3 py-2 rounded-2xl cursor-pointer bg-red-700 flex items-center space-x-2">
                  <span onClick={handleLogout} className="text-white text-sm">
                    Admin Logout{" "}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-1 text-gray-300 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {reports.length === 0 ? (
        <div className="mt-10 bg-slate-800/50 backdrop-blur-sm mx-auto rounded-xl p-12 w-280  border-slate-700/50 text-center">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No reports found
          </h3>
        </div>
      ) : (
        <div className=" admin-report-card max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
            {reports.map((report) => (
              <div key={report.id} className="mt-5 w-full">
                <div className="flex flex-col bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border-slate-700/50 hover:border-slate-600/50 transition-colors w-full h-full shadow-md">
                  <div className="relative">
                    <span
                      className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium z-10 ${priority(
                        report.priority
                      )}`}
                    >
                      {report.priority}
                    </span>
                    <img
                      src={report.image}
                      alt="Report"
                      className="w-full h-40 object-cover rounded-md bg-gray-200"
                    />
                  </div>
                  <h4 className="text-center pt-3">{report.type}</h4>
                  <div className="flex-1 flex flex-col justify-between">
                    <p className="text-gray-300 line-clamp-3">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 text-white-500 font-medium text-1xl mb-3">
                      <MapPin className="h-5 w-5" />
                      <span className="truncate">{report.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-200 text-s">Status -</label>
                      <select
                        value={report.status}
                        onChange={(e) =>
                          handleStatusToggle(report.id, e.target.value)
                        }
                        className={`text-xs border rounded-md px-2 py-1 focus:outline-none focus:ring-2 w-fit
                ${
                  report.status === "Reviewing"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-400"
                    : report.status === "Reviewed"
                    ? "bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-400"
                    : report.status === "Gone to Work"
                    ? "bg-purple-100 text-purple-800 border-purple-300 focus:ring-purple-400"
                    : "bg-green-100 text-green-800 border-green-300 focus:ring-green-400"
                }
                `}
                      >
                        {["Reviewing", "Reviewed", "Gone to Work", "Done"].map(
                          (statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div
                      className="cursor-pointer p-2 bg-red-500 text-white rounded-sm border-red-600 shadow-md self-start sm:self-center"
                      onClick={() => handleDelete(report.id)}
                      aria-label="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
