import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function FighterCard({ fighter, onSelect, isSelected, onDelete, isDisabledSelect, onFighterHeal }) {
  const name = fighter.getName();
  const damage = fighter.getDamage();
  const hp = fighter.getHealth();
  const maxHp = fighter.getMaxHp();
  const strength = fighter.getStrength();
  const agility = fighter.getAgility();
  const id = fighter.getId();
  const wins = fighter.getWins();
  const losses = fighter.getLosses();
  const level = fighter.getLevel();
  const purse = fighter.getPurse();
  const avatarSrc = fighter.getAvatar().replace('images/', '');
  const currentExp = fighter.getExperience();
  const expToNextLevel = fighter.getExpToNextLevel();

  const { t } = useTranslation();

  const getHealingCostPerPoint = function(level) {
    return 0.01 + level * 0.1;
  };

  const healthToRestore = maxHp - hp;
  const healingCostPerPoint = getHealingCostPerPoint(level);

  const [isHealing, setIsHealing] = useState(false);
  const fullHealingCost = Math.round(healthToRestore * healingCostPerPoint);
  const affordableHealing =Math.min(healthToRestore, Math.floor(purse / healingCostPerPoint));
  const partialHealingCost = Math.round(affordableHealing * healingCostPerPoint);

  const handleHeal = () => {
    if (isHealing) {
      setIsHealing(false);
    } else {
      setIsHealing(true);
      onFighterHeal(fullHealingCost, partialHealingCost, affordableHealing);
    }
  };

  return (
    <div className="col-md-4 mb-4">
        <div className="card" data-id={id}>
            <div className="card-body">
                <h5 className="card-title">
                    <div className="d-flex">
                        <div className="me-2 rounded-circle mb-auto card-avatar">
                            <Image src={'images/' + avatarSrc} className="rounded-circle object-fit-cover" alt="Avatar" width="70" height="70" />
                            <div className="card-avatar-level">{level}</div>
                        </div>
                        
                        <div className="flex-grow-1 d-flex flex-column align-items-end">
                            {name}
                            <div className="list-group-item px-0 d-flex align-items-center my-1">
                              <Image src="images/heart.png" className="me-2" alt="Damage" width="20" height="20" />

                                <div className="fs-6">
                                  <span className={hp < maxHp / 2 ? "text-danger fw-bold" : ""}>{hp}</span>/{maxHp}   
                                </div> 
                            </div>

                            <div className="w-100 d-flex align-items-center">
                                <div className="fs-6 me-2">XP:</div>
                                <div className="progress w-100" role="progressbar" aria-label="Experience" aria-valuenow={currentExp / expToNextLevel * 100} aria-valuemin="0" aria-valuemax={expToNextLevel}>
                                  <div className="progress-bar overflow-visible text-dark" style={{width: currentExp / expToNextLevel * 100 + '%'}}>
                                  </div>
                                  <div className="progress-bar-label">{currentExp}/{expToNextLevel}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </h5>

                {(purse && hp < maxHp) ? <div>
                    <button className="btn btn-warning btn-sm healBtn w-100" onClick={handleHeal}>
                        Heal for {purse >= fullHealingCost ? `${fullHealingCost} coins` : `${partialHealingCost} coins (${affordableHealing} HP)`}
                    </button>
                </div> : ''}

                <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">{t('damage')}: {damage}</li>
                    <li className="list-group-item px-0">{t('strength')}: {strength}</li>
                    <li className="list-group-item px-0">{t('agility')}: {agility}</li>
                </ul>

                <h6 className="card-subtitle mb-2 text-muted mt-3">{t('statistics')}</h6>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{t('wins')}: {wins}</li>
                    <li className="list-group-item">{t('losses')}: {losses}</li>
                    <li className="list-group-item">{t('purse')}: {t('coins', { count: purse })}</li>
                </ul>
            </div>
            <div className="card-footer">
                <div className="d-flex justify-content-between">
                  <button disabled={isDisabledSelect && !isSelected} className={`btn ${isSelected ? 'btn-dark' : 'btn-outline-dark'}`} onClick={onSelect}>
                    {isSelected ? t('fighterSelected') : t('selectFighterBtn')}
                  </button>

                  {!hp && <button className="btn btn-danger btn-sm deleteFighterBtn" onClick={onDelete}>Utilize</button>}
                </div>
            </div>
        </div>
    </div>
  );
}

export default FighterCard;
