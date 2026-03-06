import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = "https://ai-hiring-companion-backend-production.up.railway.app";

const TestPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/assessment/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAssessment(data);
      })
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;
  if (!assessment) return <div className="p-10 text-white">Loading Questions...</div>;

  return (
    <div className="max-w-3xl mx-auto p-10 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 border-b border-slate-700 pb-4">
        {assessment.jobs?.parsed_data?.role} Test
      </h1>
      
      {assessment.questions?.map((item, index) => (
        <div key={index} className="mb-8 p-6 bg-slate-800 rounded-lg">
          <p className="text-xl mb-4">{index + 1}. {item.q_text}</p>
          {item.options && (
            <div className="space-y-3">
              {item.options.map((opt, i) => (
                <label key={i} className="block p-3 bg-slate-700 rounded hover:bg-blue-600 cursor-pointer">
                  <input type="radio" name={item.id} className="mr-3" /> {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TestPage;