import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function ProblemDetail() {
    const {id} = useParams();
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/problems/${id}/`);
                setProblem(res.data);
            }
            catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [id]);

    if(!problem) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{problem.title}</h2>
      <p><strong>Description:</strong></p>
      <p>{problem.description}</p>
      <p><strong>Tags:</strong> {problem.tags}</p>
      <p><strong>Rating:</strong> {problem.rating}</p>
      <p><strong>Time Limit:</strong> {problem.time_limit} sec</p>
      <p><strong>Memory Limit:</strong> {problem.memory_limit} MB</p>
      <button onClick={() => alert("Show code editor here!")}>
        Submit Code
      </button>
    </div>
  );
}
