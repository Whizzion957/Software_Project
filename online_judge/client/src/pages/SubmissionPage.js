import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SubmissionPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [inputProblemId, setInputProblemId] = useState('');

  const query = useQuery();
  const problemId = query.get('problem_id');
  const navigate = useNavigate();

  // Fetch problem details when ID is present
  useEffect(() => {
    if (!problemId) return;

    axios.get(`http://127.0.0.1:8000/api/problems/${problemId}/`)
      .then(res => {
        setProblemTitle(res.data.title);
        setProblemDescription(res.data.description);
      })
      .catch(error => {
        console.error("Error fetching problem details:", error);
        toast.error("Failed to load problem details");
      });
  }, [problemId]);

  const handleSubmit = async () => {
    if (!problemId) {
      toast.error("Problem ID not selected!");
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/submit/', {
        user: 1,
        problem: parseInt(problemId),
        language,
        code,
      });

      const subId = res?.data?.submission?.id;
      if (!subId) {
        toast.error("Submission ID not returned!");
        return;
      }

      toast.info('Submitted! Waiting for verdict...');

      const interval = setInterval(async () => {
        try {
          const verdictRes = await axios.get(`http://127.0.0.1:8000/api/status/${subId}/`);
          const status = verdictRes?.data?.status;

          if (status && status !== 'PENDING') {
            clearInterval(interval);
            if (status === 'ACCEPTED') toast.success(`Verdict: ${status}`);
            else toast.error(`Verdict: ${status}`);
          }
        } catch (err) {
          console.error("Error while checking status:", err);
          clearInterval(interval);
          toast.error("Error checking verdict!");
        }
      }, 2000);

    } catch (error) {
      toast.error('Submission Failed');
      console.error("Submission error:", error);
    }
  };

  const handleProblemIdSubmit = () => {
    if (inputProblemId) {
      navigate(`/submit?problem_id=${inputProblemId}`);
    } else {
      toast.error("Please enter a valid Problem ID");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Online Judge</h2>

      {!problemId ? (
        <>
          <label><strong>Enter Problem ID:</strong></label><br />
          <input
            type="number"
            placeholder="e.g., 1"
            value={inputProblemId}
            onChange={(e) => setInputProblemId(e.target.value)}
          />
          <button onClick={handleProblemIdSubmit} style={{ marginLeft: 10 }}>Go</button>
        </>
      ) : (
        <>
          <p><strong>Problem ID:</strong> {problemId}</p>
          <h3>{problemTitle}</h3>
          <p>{problemDescription}</p>

          <textarea
            rows={10}
            cols={60}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// write your code here"
          />
          <br />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
}

export default SubmissionPage;
