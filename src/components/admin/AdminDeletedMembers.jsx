import React, { useEffect, useState } from "react";
import { User, Trash2, Calendar, Mail, BookOpen, FileCheck, Loader2 } from "lucide-react";

const AdminDeletedMembers = () => {
  const [deletedMembers, setDeletedMembers] = useState({
    students: [],
    teachers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeletedMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/admin/deleted-members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setDeletedMembers(data.data);
        } else {
          console.error("Error fetching deleted members:", data.message);
        }
      } catch (error) {
        console.error("Error fetching deleted members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedMembers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading deleted members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-extrabold text-slate-900">Deleted Members</h2>
          </div>
          <p className="text-slate-500 font-medium ml-11">
            View previously deleted students and teachers archive
          </p>
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80">
            <User className="w-5 h-5 text-cyan-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Deleted Students ({deletedMembers.students.length})
            </h3>
          </div>
          
          {deletedMembers.students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deletedMembers.students.map((student) => (
                <div key={student._id} className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden group shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all">
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-slate-900 font-bold text-lg">{student.name}</h4>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider bg-cyan-50 text-cyan-800 border border-cyan-200">Student</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Enrolled Courses: {student.enrolledCourses?.length || 0}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-bold">Deleted: {formatDate(student.deletedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-xs">
              <User className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No deleted students found in the archive.</p>
            </div>
          )}
        </div>

        {/* Teachers Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Deleted Teachers ({deletedMembers.teachers.length})
            </h3>
          </div>
          
          {deletedMembers.teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deletedMembers.teachers.map((teacher) => (
                <div key={teacher._id} className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden group shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all">
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-slate-900 font-bold text-lg">{teacher.name}</h4>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">Teacher</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <FileCheck className="w-4 h-4 text-slate-400" />
                        <span>Verification: </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          teacher.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          teacher.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                          teacher.verificationStatus === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {teacher.verificationStatus || "Not Submitted"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Courses Created: {teacher.courses?.length || 0}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-bold">Deleted: {formatDate(teacher.deletedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-xs">
              <User className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No deleted teachers found in the archive.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDeletedMembers;
