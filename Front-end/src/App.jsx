import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logoFootball from './logo/logoFootball.png';

function App() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [totalResults, setTotalResults] = useState(0); // Track total results
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    try {
      const sanitizedSearchTerm = encodeURIComponent(searchTerm);
      const response = await axios.get(`http://localhost:5555/api/search?query=${sanitizedSearchTerm}`);
      console.log("Search :", searchTerm);
      
      // Update total results and teams
      setTotalResults(response.data.totalResults);
      setTeams(response.data.data);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert('Failed to fetch search results. Please try again.');
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTeams = teams.slice(startIndex,endIndex);


  const handleRowClick = (team) => {
    setSelectedTeam(team);
  };

  const handleClose = () => {
    setSelectedTeam(null);
  };

  // Next and Previous page handlers
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < totalResults) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <div className="heading">
        <img src={logoFootball} alt="Football Logo" height="150px" />
        <div className="heading-text">
          <h1>FOOTBALL TEAMS</h1>
          <h1 className="highlighted">in top 6 leagues of Europe</h1>
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {/* Show total results */}
        <div className="result-count">
          {totalResults > 0 ? `${totalResults} result(s) found` : 'No results found'}
        </div>
      </div>

      <table className="teams-table">
      <thead>
        <tr>
          <th> </th>
          <th>Club</th>
          <th>League</th>
          <th>Squad</th>
          <th>Foreigners</th>
        </tr>
      </thead>
      <tbody>
        {paginatedTeams.map((team) => (
          <tr key={team.club} onClick={() => handleRowClick(team)}>
            <td>
              <img
                src={team.logo || logoFootball}
                alt={`${team.club} logo`}
                height="50px"
                onError={(e) => (e.target.src = logoFootball)}
              />
            </td>
            <td>{team.club}</td>
            <td>{team.league}</td>
            <td>{team.squad}</td>
            <td>{team.foreigners}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="pagination-controls">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Back
      </button>
      <button
        onClick={handleNextPage}
        disabled={currentPage * itemsPerPage >= teams.length}>
        Next
      </button>
    </div>

      {selectedTeam && (
        <div className="team-info-window">
          <div className="team-info-content">
            <button className="close-btn" onClick={handleClose}>X</button>
            <div className="team-info-columns">
              <div className="team-stats">
                <h2>{selectedTeam.club} Stats</h2>
                <img src={selectedTeam.logo || logoFootball} alt={selectedTeam.club} height="100px" />
                <p><strong>League:</strong> {selectedTeam.league}</p>
                <p><strong>Squad Size:</strong> {selectedTeam.squad}</p>
                <p><strong>Foreign Players:</strong> {selectedTeam.foreigners}</p>
                {selectedTeam.age && <p><strong>Average Age:</strong> {selectedTeam.age}</p>}
                {selectedTeam.marketValue && <p><strong>Market Value:</strong> {selectedTeam.marketValue}</p>}
                {selectedTeam.totalMarketValue && <p><strong>Total Market Value:</strong> {selectedTeam.totalMarketValue}</p>}
              </div>
              <div className="team-history">
                <h2>Club History</h2>
                <div className="team-description">
                  <p>{selectedTeam.description}</p>
                  <a href={selectedTeam.url} target="_blank" rel="noopener noreferrer">More details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
