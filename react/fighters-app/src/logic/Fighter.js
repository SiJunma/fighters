export class Fighter {
  constructor({ id, name, damage, hp, strength, agility, wins, losses, purse, maxHp, level, experience, expToNextLevel, avatar }) {
    let _name = name;
    let _damage = damage;
    let _maxHp = maxHp || hp;
    let _currentHp = hp;
    let _strength = strength;
    let _agility = agility;
    let _wins = wins || 0;
    let _losses = losses || 0;
    const _id = id || Math.random().toString(36).slice(2);
    let _purse = (purse || purse === 0) ? purse : 100;
    let _avatar = avatar;

    let _level = level || 1;
    let _experience = experience || 0;
    let _expToNextLevel = expToNextLevel || 100;

    this.battleLog = [];

    this.getId = () => _id;

    this.getAvatar = () => _avatar;
    this.setAvatar = (value) => _avatar = value;

    this.getPurse = () => _purse;
    this.addToPurse = (value) => _purse += value;
    this.removeFromPurse = (value) => _purse -= value;

    this.getName = () => _name;
    this.setName = (value) => _name = value.trim();

    this.getDamage = () => _damage;
    this.setDamage = (value) => _damage = value;

    this.getStrength = () => _strength;
    this.setStrength = (value) => _strength = value;

    this.getAgility = () => _agility;
    this.setAgility = (value) => _agility = value;

    this.getHealth = () => _currentHp;
    this.heal = (value) => {
      if (value > 0) {
          let hp = this.getHealth();
          hp + value <= _maxHp ? hp += value : hp = _maxHp;
          _currentHp = hp;
      };
    };
    this.dealDamage = value => _currentHp = Math.max(0, this.getHealth() - value);

    this.getMaxHp = () => _maxHp;
    this.setMaxHp = (value) => _maxHp = value;

    this.getWins = () => _wins;
    this.addWin = () => _wins++;

    this.getLosses = () => _losses;
    this.addLoss = () => _losses++;

    this.getLevel = () => _level; 

    this.getExperience = () => _experience;
    this.addExperience = exp => {
      _experience += exp;
      if (_experience >= _expToNextLevel) {
        return this.levelUp();
      };
    };

    this.levelUp = () => {
      _level++;
      _experience -= _expToNextLevel;
      _expToNextLevel = Math.round(_expToNextLevel * 1.5);
      _damage = Math.floor(_damage * 1.1) + 1;
      _maxHp = Math.floor(_maxHp * 1.1) + 1;
      _strength = Math.floor(_strength * 1.1) + 1;
      _agility = Math.floor(_agility * 1.1) + 1;
      _currentHp = _maxHp;

      return`<p>${this.getName()} has reached <span class="fw-bold">level ${this.getLevel()}</span>! ${this.getName()}'s health is fully restored.</p>`;
    };

    this.getExpToNextLevel = () => _expToNextLevel;
  }

  attack(opponent) {
    const opponentName = opponent.getName();

    const attackerAgility = this.getAgility();
    const defenderAgility = opponent.getAgility();
    const hitChance = 0.5 + (attackerAgility - defenderAgility) * 0.01;
    const isCriticalHit = Math.random() < 0.15;
    const damage = Math.floor(this.getDamage() * (isCriticalHit ? 2 : 1 + Math.random() * 0.4));

    if (Math.random() < hitChance) {
      opponent.dealDamage(damage);
      return `${this.getName()} makes ${damage} damage to ${opponentName}. ${opponentName}'s hp now is ${opponent.getHealth()}/${opponent.getMaxHp()}`;
    } else {
      return `${this.getName()}'s attack <span class="text-warning-emphasis fw-bold">missed</span>`;
    };
  };

  fight(opponent) {
    this.battleLog = [];

    if (this.getHealth() > 0 && opponent.getHealth() > 0) {
      let round = 1;
      let battleEnded = false;

      while (!battleEnded && round <= 1000) {
        let roundHtml = `<div class="round-container"><h6 class="card-subtitle mb-2 text-muted">Round ${round}</h6>`;
        
        if (Math.random() > 0.5) {
          roundHtml += `<p class="mb-0">${this.attack(opponent)}</p>`;
          if (opponent.getHealth() <= 0) {
            battleEnded = true;
          } else {
            roundHtml += `<p>${opponent.attack(this)}</p>`;
          };
        } else {
          roundHtml += `<p class="mb-0">${opponent.attack(this)}</p>`;
          if (this.getHealth() <= 0) {
            battleEnded = true;
          } else {
            roundHtml += `<p>${this.attack(opponent)}</p>`;
          };
        };
        this.battleLog.push(roundHtml);
        round++;
      };

      const winner = this.getHealth() > 0 ? this : opponent;
      const loser = this.getHealth() > 0 ? opponent : this;

      return this.reward(winner, loser);
    } else {
      // Один из бойцов мертв и не может сражаться.
      const dead = this.getHealth() > 0 ? this : opponent;
      return `${dead.getName()} has is dead and cannot fight.`;
    }; 
  };

  reward(winner, loser) {
    const winnerLevel = winner.getLevel();
    const looserLevel = loser.getLevel();
    const winnerStrength = winner.getStrength();
    const looserStrength = loser.getStrength();
    const winnerAgility = winner.getAgility();
    const looserAgility = loser.getAgility();
    const winnerName = winner.getName();
    const looserName = loser.getName();
    const winnerMaxHp = winner.getMaxHp();
    const looserMaxHp = loser.getMaxHp();

    // Опыт для победителя
    const totalExperience = Math.round(Math.max(
      1,
      50 + (looserLevel - winnerLevel) * 10 + (looserStrength - winnerStrength) * 0.5 + (looserAgility - winnerAgility) * 0.3
    ));

    // Награда за победу
    const award = Math.round(10 + Math.max(0, (looserLevel - winnerLevel)) * 10 + Math.max(0, (looserStrength - winnerStrength) * 0.5) + Math.max(0, (looserAgility - winnerAgility) * 0.3));

    const isLowHp = winner.getHealth() < winnerMaxHp / 2;
    if(isLowHp) {
      winner.heal(Math.round(winnerMaxHp / 2 - winner.getHealth()));
    };
    //Сообщение о победе
    this.battleLog.push(`<p>${winnerName} has <span class="text-success fw-bold">won</span>! ${winnerName} has received ${award} coins and ${totalExperience} experience! ${isLowHp ? `Guild master promised to heal ${winnerName} up to a half of ${winnerName}'s max HP. Now ` : ''} ${winnerName} has ${winner.getHealth()}/${winnerMaxHp} HP.</p>`);

    loser.heal(Math.round(looserMaxHp / 3));
    // сообщение о поражении
    this.battleLog.push(`<p>${looserName} has <span class="text-danger fw-bold">lost</span> and guild master heals him for ${Math.round(looserMaxHp / 3)} HP points as a consolation gift. ${looserName} has now ${loser.getHealth()}/${looserMaxHp} HP and got 10 exp.</p>`);

    // Остальные призования
    winner.addWin();
    loser.addLoss();

    winner.addToPurse(award);

    const winnerMsg = winner.addExperience(totalExperience);
    if (winnerMsg) {
      this.battleLog.push(winnerMsg);
    };

    const loserMsg = loser.addExperience(10);
    if (loserMsg) {
      this.battleLog.push(loserMsg);
    };

    return this.battleLog;
  };
};