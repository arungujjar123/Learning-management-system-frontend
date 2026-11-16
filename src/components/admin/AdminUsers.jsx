import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaTrashAlt,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState({ students: [], teachers: [] });
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    studentId: null,
    studentName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && data.data) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (studentId, studentName) => {
    setDeleteModal({ show: true, studentId, studentName });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(
        `${backendUrl}/admin/students/${deleteModal.studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          students: prevUsers.students.filter(
            (student) => student._id !== deleteModal.studentId
          ),
        }));
        alert("Student deleted successfully!");
      } else {
        alert("Error deleting student: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    } finally {
      setDeleteModal({ show: false, studentId: null, studentName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, studentId: null, studentName: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading user accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor and manage enrolled students and verified instructors
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
              <FaExclamationTriangle />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Student Account</h3>
              <p className="text-sm text-slate-600">
                Are you sure you want to permanently delete{" "}
                <strong className="text-slate-900">{deleteModal.studentName}</strong>?
              </p>
              <p className="text-xs text-red-600 font-medium pt-1">
                This action is irreversible. All enrolled course progress and quiz history will be erased.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-sm">
              <FaUserGraduate />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Students ({users.students.length})
            </h2>
          </div>
        </div>

        {users.students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">{student.name}</h4>
                  <p className="text-xs text-slate-500">{student.email}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700">
                    Student
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteClick(student._id, student.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaTrashAlt size={11} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No students found in the database.
          </div>
        )}
      </div>

      {/* Teachers Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
              <FaChalkboardTeacher />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Teachers ({users.teachers.length})
            </h2>
          </div>
        </div>

        {users.teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-900">{teacher.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        teacher.verificationStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : teacher.verificationStatus === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {teacher.verificationStatus || "Unverified"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{teacher.email}</p>
                  <p className="text-xs text-slate-600 pt-1">
                    Published Courses: <strong className="text-slate-900">{teacher.courses?.length || 0}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => navigate(`/admin/teachers/${teacher._id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <FaEye size={12} />
                    <span>Review Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No instructors found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

