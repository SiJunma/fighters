function FighterList({ fighters, handleSelectFighter, selectedFighters }) {
  return (
    <div>
      {fighters.map(fighter => (
        <FighterCard
          key={fighter.getId()}
          fighter={fighter}
          onSelect={handleSelectFighter}
          isSelected={selectedFighters.some(f => f.getId() === fighter.getId())}
        />
      ))}
    </div>
  );
};

export default FighterList;