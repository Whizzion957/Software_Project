import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [sortKeys, setSortKeys] = useState([{ key: null, direction: 'asc' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/problems/');
        setProblems(res.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);

  const handleSort = (key) => {
    setSortKeys((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (existing) {
        const direction = existing.direction === 'asc' ? 'desc' : 'asc';
        return [{ key, direction }, ...prev.filter((s) => s.key !== key)];
      } else {
        return [{ key, direction: 'asc' }, ...prev];
      }
    });
  };

  const resetSort = () => setSortKeys([{ key: null, direction: 'asc' }]);

  const getArrow = (key) => {
    const sortObj = sortKeys.find((s) => s.key === key);
    if (sortObj) return sortObj.direction === 'asc' ? '▲' : '▼';
    return '';
  };

  const filteredProblems = problems.filter((p) => {
    const matchesTitleOrTag =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      (minRating === '' || p.rating >= parseInt(minRating)) &&
      (maxRating === '' || p.rating <= parseInt(maxRating));

    const requiredTags = tagFilter
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const matchesTags =
      requiredTags.length === 0 ||
      requiredTags.every((tag) => p.tags.toLowerCase().includes(tag));

    return matchesTitleOrTag && matchesRating && matchesTags;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    for (let { key, direction } of sortKeys) {
      if (!key) continue;
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLast = currentPage * problemsPerPage;
  const indexOfFirst = indexOfLast - problemsPerPage;
  const currentProblems = sortedProblems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProblems.length / problemsPerPage);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Problems</h2>

      {/* 🔎 Filters */}
      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          style={{ width: 100, marginRight: 5 }}
        />
        <input
          type="number"
          placeholder="Max Rating"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
          style={{ width: 100, marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Filter by tags (comma separated)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{ width: 250, marginRight: 10 }}
        />
        <button onClick={resetSort}>Reset Sort</button>
      </div>

      <table border="1" cellPadding={10}>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
              ID {getArrow('id')}
            </th>
            <th>Title</th>
            <th>Tags</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('rating')}>
              Rating {getArrow('rating')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('total_submissions')}>
              Total Submissions {getArrow('total_submissions')}
            </th>
            <th>Correct Submissions</th>
          </tr>
        </thead>
        <tbody>
          {currentProblems.map((p) => (
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

      {/* 🔁 Pagination */}
      <div style={{ marginTop: 10 }}>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            style={{
              marginRight: 5,
              padding: '4px 8px',
              fontWeight: currentPage === idx + 1 ? 'bold' : 'normal',
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
