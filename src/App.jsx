import React from 'react';
import { useState } from 'react';
import './App.css'; 
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [playerNames, setPlayerNames] = useState(Array(22).fill(''));
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [teamsPerPage, setTeamsPerPage] = useState(10);

  const handleInputChange = (index, value) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);
  };

  const generateCombinations = (arr, teamSize, currentCombination, start, result) => {
    if (currentCombination.length === teamSize) {
      result.push([...currentCombination]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      currentCombination.push(arr[i]);
      generateCombinations(arr, teamSize, currentCombination, i + 1, result);
      currentCombination.pop();
    }
  };

  const generateTeams = () => {
    const validPlayerNames = playerNames.filter((name) => name.trim() !== '');
  
    if (validPlayerNames.length < 11) {
      toast.error('Not enough players to generate teams.');
      return;
    }
  
    // Shuffle the array of players
    const shuffledPlayers = validPlayerNames.sort(() => Math.random() - 0.5);
  
    const allTeams = [];
    generateCombinations(shuffledPlayers, 11, [], 0, allTeams);
  
    // Create teams with titles
    const teamsWithTitles = allTeams.map((team) => {
      const captainIndex = Math.floor(Math.random() * team.length);
      let viceCaptainIndex;
  
      do {
        viceCaptainIndex = Math.floor(Math.random() * team.length);
      } while (viceCaptainIndex === captainIndex);
  
      // Assign titles to players
      const teamWithTitles = team.map((player, index) => ({
        name: player,
        title: index === captainIndex ? 'C' : index === viceCaptainIndex ? 'V' : '',
      }));
  
      return teamWithTitles;
    });
  
    // Shuffle the array of teams
    const shuffledTeams = teamsWithTitles.sort(() => Math.random() - 0.5);
  
    setTeams(shuffledTeams);
  };

  const nextSetOfTeams = () => {
    setCurrentTeamIndex((prevIndex) => prevIndex + teamsPerPage);
  };

  const currentTeams = teams.slice(
    currentTeamIndex,
    currentTeamIndex + teamsPerPage
  );

  return (
    <div className="app-container">
      <h1>Team Maker</h1>

      <div className="player-input-container">
        <div className="player-column">
          {playerNames.slice(0, 11).map((name, index) => (
            <div key={index} className="input-row">
              <input
                type="text"
                placeholder={`Player ${index + 1}`}
                value={name}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="player-column">
          {playerNames.slice(11, 22).map((name, index) => (
            <div key={index + 11} className="input-row">
              <input
                type="text"
                placeholder={`Player ${index + 12}`}
                value={name}
                onChange={(e) => handleInputChange(index + 11, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="generate-button" onClick={generateTeams}>
        Generate
      </button>

      <div className="teams-container">
        {currentTeams.map((team, index) => (
          <div key={index} className="team">
            <h2>Team {currentTeamIndex + index + 1}</h2>
            <table>
              <tbody>
                {team.map((player, i) => (
                  <tr key={i}>
                    <td>{player.name}</td>
                    <td>{player.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {teams.length > teamsPerPage && (
          <button className="next-button" onClick={nextSetOfTeams}>
            Next Set of Teams
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;