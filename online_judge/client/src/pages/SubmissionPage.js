import React, { useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SubmissionPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/submit/', {
        user: 1,
        problem: 1,
        language,
        code,
      });

      console.log("Submission response:", res.data);

      const subId = res?.data?.submission?.id;
      if (!subId) {
        toast.error("Submission ID not returned!");
        return;
      }
      toast.info('Submitted! Waiting for verdict...');
      const interval = setInterval(async () => {
        try {
          console.log(`Checking verdict for submission ${subId}`);
          const verdictRes = await axios.get(`http://127.0.0.1:8000/api/status/${subId}/`);

          console.log("Verdict response:", verdictRes.data);

          const status = verdictRes?.data?.status;

          console.log("Polled status:", status);

          if (status && status !== 'PENDING') {
            clearInterval(interval);
            if (status === 'ACCEPTED') {
              toast.success(`Verdict: ${status}`);
            } else {
              toast.error(`Verdict: ${status}`);
            }
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Online Judge</h2>
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
    </div>
  );
}

export default SubmissionPage;
