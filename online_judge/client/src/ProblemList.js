import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ProblemList = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
         try {
            const res = await axios.get('http://127.0.0.1:8000/api/problems/');
            setProblems(res.data);
         }
         catch (error) {
            console.error('Error fetching problems:', error);
         }
        };
        fetchProblems();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>All Problems</h2>
            <table border="1" cellPadding={10}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Rating</th>
                    <th>Total Submissions</th>
                    <th>Correct Submissions</th>
                </tr>
                </thead>
                <tbody>
                {problems.map(p => (
                    <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.tags}</td>
                    <td>{p.rating}</td>
                    <td>{p.total_submissions}</td>
                    <td>{p.correct_submissions}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProblemList;
