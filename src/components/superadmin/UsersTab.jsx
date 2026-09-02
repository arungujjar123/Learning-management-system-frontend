import React, { useState, useEffect } from "react";
import { useSuperAdmin } from "../../contexts/SuperAdminContext";
import { Users, GraduationCap, UserCheck, ShieldCheck, Search, RefreshCw } from "lucide-react";

const UsersTab = () => {
  const { fetchAllUsers } = useSuperAdmin();
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers(false);
      setUsersData(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading user roster...</p>
        </div>
      </div>
    );
  }

  if (!usersData) return null;

  const { stats, students, teachers, admins } = usersData;

  const getFilteredUsers = () => {
    let users = [];

    if (filter === "all" || filter === "students") {
      users = [...users, ...students.map((u) => ({ ...u, type: "Student" }))];
    }
    if (filter === "all" || filter === "teachers") {
      users = [...users, ...teachers.map((u) => ({ ...u, type: "Teacher" }))];
    }
    if (filter === "all" || filter === "admins") {
      users = [...users, ...admins.map((u) => ({ ...u, type: "Admin" }))];
    }

    if (searchTerm) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return users;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6 font-sans">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="text-xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</span>
            <div className="text-xl font-extrabold text-slate-900">{stats?.students || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teachers</span>
            <div className="text-xl font-extrabold text-slate-900">{stats?.teachers || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins</span>
            <div className="text-xl font-extrabold text-slate-900">{stats?.admins || 0}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Roles</option>
          <option value="students">Students Only</option>
          <option value="teachers">Teachers Only</option>
          <option value="admins">Admins Only</option>
        </select>

        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          />
        </div>

        <button
          onClick={loadUsers}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Activity / Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{user.name}</td>
                  <td className="p-4 text-slate-600">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.type === "Student"
                          ? "bg-cyan-50 text-cyan-800 border border-cyan-200"
                          : user.type === "Teacher"
                          ? "bg-teal-50 text-teal-800 border border-teal-200"
                          : "bg-purple-50 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.type === "Teacher" ? (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.verificationStatus === "Verified"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : user.verificationStatus === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : user.verificationStatus === "Rejected"
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.verificationStatus || "Not Submitted"}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {user.type === "Student" && `${user.enrolledCourses?.length || 0} enrolled course(s)`}
                    {user.type === "Teacher" && `${user.courses?.length || 0} created course(s)`}
                    {user.type === "Admin" && `Role: ${user.role}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center p-8 text-slate-400 font-medium">
            No users match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
