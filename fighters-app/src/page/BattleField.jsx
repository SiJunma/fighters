import React, { useState, useEffect } from 'react';
import CreateFighterForm from '../components/CreateFighterForm.jsx';
import FighterCard from '../components/FighterCard.jsx';
import BattleModal from '../components/BattleModal.jsx';
import { useTranslation } from 'react-i18next';

function BattleField({
  showCreateFighterBtn,
  setShowCreateFighterBtn,
  startBattle,
  selectedFighters,
  fighters,
  handleSelectFighter,
  setFighters,
  healFighter,
  isModalOpen,
  battleLog,
  setIsModalOpen,
  createFighter,
  showForm,
  setShowForm
}) {
  const { t } = useTranslation();

  return (
    <section id="battleField">
      <div className="container mt-3">
        <div className="mb-3 d-flex gap-3">
          {showCreateFighterBtn && (
            <button
              id="createFighter"
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setShowForm(true);
                setShowCreateFighterBtn(false);
              }}
            >
              {t('createFighterBtn')}
            </button>
          )}

          <button
            id="sentToBattle"
            type="button"
            className="btn btn-danger"
            onClick={startBattle}
            disabled={selectedFighters.length !== 2}
            style={{ display: showCreateFighterBtn ? 'initial' : 'none' }}
          >
            {t('battleBtn')}
          </button>
        </div>

        {showForm && (
          <CreateFighterForm
            onCreate={createFighter}
            onCancel={() => {
              setShowCreateFighterBtn(true);
              setShowForm(false);
            }}
          />
        )}

        <div className="row" id="firghersList">
          {fighters.map((fighter) => (
            <FighterCard
              key={fighter.getId()}
              fighter={fighter}
              onSelect={() => handleSelectFighter(fighter)}
              isSelected={selectedFighters.includes(fighter)}
              onDelete={() => setFighters(fighters.filter((f) => f !== fighter))}
              isDisabledSelect={selectedFighters.length === 2}
              onFighterHeal={(fullHealingCost, partialHealingCost, affordableHealing) =>
                healFighter(fighter, fullHealingCost, partialHealingCost, affordableHealing)
              }
            />
          ))}
        </div>

        {isModalOpen && <BattleModal log={battleLog} onClose={() => setIsModalOpen(false)} />}
      </div>
    </section>
  );
}

export default BattleField;
