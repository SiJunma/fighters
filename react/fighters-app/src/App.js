import React, { useState, useEffect } from 'react';
import FighterCard from './components/FighterCard';
import CreateFighterForm from './components/CreateFighterForm';
import BattleModal from './components/BattleModal';
import { Fighter } from './logic/Fighter.js';
import './styles/styles.min.css';

function App() {
  const serializeFighters = (fighters) => {
    return JSON.stringify(fighters.map((fighter) => ({ 
      id: fighter.getId(),
      name: fighter.getName(),
      damage: fighter.getDamage(),
      hp: fighter.getHealth(),
      strength: fighter.getStrength(),
      agility: fighter.getAgility(),
      wins: fighter.getWins(),
      losses: fighter.getLosses(),
      purse: fighter.getPurse(),
      maxHp: fighter.getMaxHp(),
      level: fighter.getLevel(),
      experience: fighter.getExperience(),
      expToNextLevel: fighter.getExpToNextLevel(),
      avatar: fighter.getAvatar()
     })));
  };
  
  const deserializeFighters = (json) => {
    return JSON.parse(json).map((fighterData) => new Fighter(fighterData));
  };

  const [fighters, setFighters] = useState(() => {
    const storedFighters = localStorage.getItem('fighters');
    return storedFighters ? deserializeFighters(storedFighters) : [];
  });
  const [selectedFighters, setSelectedFighters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [battleLog, setBattleLog] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showCreateFighterBtn, setShowCreateFighterBtn] = useState(true);
  
  //saving data to local storage
  useEffect(() => {
    if (!isModalOpen) {
      const serializedFighters = serializeFighters(fighters);
      localStorage.setItem('fighters', serializedFighters);
    };
  }, [fighters, isModalOpen]);

  const createFighter = (name, type, avatar) => {
    const typesMap = {
      strong: {
          damage: 12,
          hp: 100,
          strength: 12,
          agility: 5
      }, // Strong
      sneaky: {
          damage: 10,
          hp: 100,
          strength: 10,
          agility: 15
      }, // Sneaky
      tank: {
          damage: 10,
          hp: 125,
          strength: 10,
          agility: 5
      }, // Tank
    };
    console.log('type', type);
    const fighter = new Fighter({
      name: name, 
      damage: typesMap[type].damage, 
      hp: typesMap[type].hp, 
      strength: typesMap[type].strength, 
      agility: typesMap[type].agility, 
      avatar: avatar
    });
    setFighters([...fighters, fighter]);
    setShowForm(false);
    setShowCreateFighterBtn(true);
  };

  const handleSelectFighter = (fighter) => {
    const isSelected = selectedFighters.includes(fighter);
    setSelectedFighters(isSelected ? selectedFighters.filter(f => f !== fighter) : [...selectedFighters, fighter]);
  };

  const startBattle = () => {
    if (selectedFighters.length === 2) {
      const [fighter1, fighter2] = selectedFighters;
      const battleLog = fighter1.fight(fighter2);
      battleLog.unshift(`<h4 class="mb-4">Battle between ${fighter1.getName()} and ${fighter2.getName()}</h4>`);
      
      setBattleLog(battleLog.join(''));
      setIsModalOpen(true);
    }
  };

  const healFighter = (fighter, fullHealingCost, partialHealingCost, affordableHealing) => {
    if (fighter.getPurse() >= fullHealingCost) {
      fighter.heal(fighter.getMaxHp() - fighter.getHealth());
      fighter.removeFromPurse(fullHealingCost);
    } else if (affordableHealing > 0) {
      fighter.heal(affordableHealing);
      fighter.removeFromPurse(partialHealingCost);
    };
    setFighters(fighters.map(f => f.getId() === fighter.getId() ? fighter : f));
  };

  return (
    <div className="container mt-3">
      <div className="mb-3 d-flex gap-3">
        {showCreateFighterBtn && 
          <button id="createFighter" className="btn btn-primary" type="button" onClick={() => {setShowForm(true); setShowCreateFighterBtn(false)}}>Create a new fighter</button>
        }
        
        <button 
          id="sentToBattle"
          type="button"
          className="btn btn-danger" 
          onClick={startBattle} 
          disabled={selectedFighters.length !== 2}
          style={{display: showForm ? 'none' : 'initial'}}
        >
          Battle
        </button>
      </div>

      {showForm && <CreateFighterForm onCreate={createFighter} onCancel={() => {setShowForm(false); setShowCreateFighterBtn(true)}} />}

      <div className="row" id="firghersList">
        {fighters.map(fighter => (
          <FighterCard 
            key={fighter.getId()} 
            fighter={fighter} 
            onSelect={() => handleSelectFighter(fighter)}
            isSelected={selectedFighters.includes(fighter)}
            onDelete={() => setFighters(fighters.filter(f => f !== fighter))}
            isDisabledSelect={selectedFighters.length === 2}
            onFighterHeal={(fullHealingCost, partialHealingCost, affordableHealing) => healFighter(fighter, fullHealingCost, partialHealingCost, affordableHealing)}
          />
        ))}
      </div>

      {isModalOpen && (
        <BattleModal log={battleLog} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
