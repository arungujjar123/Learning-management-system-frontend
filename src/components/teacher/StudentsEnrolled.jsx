import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

const StudentsEnrolled = () => {
  const [students, setStudents] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher/students`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Enrolled Students</h2>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs overflow-hidden">
          {!students || students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-base text-slate-500 font-medium">No students enrolled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="px-4 py-4 font-semibold rounded-tl-xl">Student Name</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold rounded-tr-xl">Courses Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr 
                      key={s.id || index} 
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-slate-900 font-bold">{s.name}</td>
                      <td className="px-4 py-4 text-slate-500">{s.email}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {s.courses.map((course, i) => (
                            <span 
                              key={i} 
                              className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
