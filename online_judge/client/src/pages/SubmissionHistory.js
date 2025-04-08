import React, { useEffect, useState } from 'react'
import axios from 'axios';

function SubmissionHistory({userId}) {
    const [submissions, setSubmissions] = useState([]);
    useEffect(() => {
      const fetchSubmissions = async () => {
        try {
            const res=await axios.get(`http://127.0.0.1:8000/api/history/${userId}/`);
            setSubmissions(res.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
      };
      fetchSubmissions();  
    }, [userId]);

    return (
        <div>
            <h3>Submission History</h3>
            <table border="1" cellPadding="8">
                <thead>
                <tr>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Memory</th>
                    <th>Submitted At</th>
                </tr>
                </thead>
                <tbody>
                {submissions.map((sub) => (
                    <tr key={sub.id}>
                    <td>{sub.problem}</td>
                    <td>{sub.language}</td>
                    <td>{sub.status}</td>
                    <td>{sub.submission_time} ms</td>
                    <td>{sub.submission_memory} KB</td>
                    <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default SubmissionHistory;
