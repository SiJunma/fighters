class Fighter {
    constructor({ name, damage, hp, strength, agility, wins, losses, purse, maxHp, level, experience, expToNextLevel, avatar }) {
        let _name = name;
        let _damage = damage;
        let _maxHp = maxHp || hp;
        let _currentHp = hp;
        let _strength = strength;
        let _agility = agility;
        let _wins = wins || 0;
        let _losses = losses || 0;
        const _id = Math.random().toString(36).slice(2);
        let _purse = (purse || purse === 0) ? purse : 100;
        let _avatar = avatar || 'images/' + avsMap[Math.floor(Math.random() * avsMap.length)];

        this._level = level || 1;
        this._experience = experience || 0;
        this._expToNextLevel = expToNextLevel || 100;

        this.getLevel = () => this._level;
        this.getExperience = () => this._experience;
        this.getExpToNextLevel = () => this._expToNextLevel;

        this.getName = () => _name.trim();
        this.getDamage = () => _damage;
        this.setDamage = (value) => _damage = value;
        this.getStrength = () => _strength;
        this.setStrength = (value) => _strength = value;
        this.getAgility = () => _agility;
        this.setAgility = (value) => _agility = value;
        this.getHealth = () => _currentHp;
        this.getMaxHp = () => _maxHp;
        this.getId = () => _id;
        this.getWins = () => _wins;
        this.getLosses = () => _losses;
        this.getPurse = () => _purse;
        this.addToPurse = (value) => _purse += value;

        this.setPurse = (value) => _purse = value;
        this.setMaxHp = (value) => _maxHp = value;

        this.getAvatar = () => _avatar;
        this.setAvatar = (value) => _avatar = value;

        this.logCombatHistory = () => console.log(`Name: ${_name}, Wins: ${_wins}, Losses: ${_losses}`);
        this.heal = (value) => {
            if (value > 0) {
                let hp = this.getHealth();
                hp + value <= _maxHp ? hp += value : hp = _maxHp;
                _currentHp = hp;
            }
        };
        this.attack = (opponent) => {
            const opponentName = opponent.getName();

            const attackerAgility = this.getAgility();
            const defenderAgility = opponent.getAgility();

            // Базовая вероятность попадания
            let hitChance = 0.5; // 50%

            // Корректировка на основе разницы ловкости
            if (attackerAgility > defenderAgility) {
                hitChance += (attackerAgility - defenderAgility) * 0.01; // +1% за каждое преимущество в ловкости
            } else {
                hitChance -= (defenderAgility - attackerAgility) * 0.01; // -1% за каждое преимущество противника
            };

            // Учитываем критический шанс
            const isCriticalHit = Math.random() < 0.15;

            if (isCriticalHit) {
                opponent.dealDamage(this.getDamage() * 2);
                return `${this.getName()} makes a <span class="fw-bold">critical hit</span> and deals ${this.getDamage() * 2} damage to ${opponentName}. ${opponentName}'s hp now is ${opponent.getHealth()}/${opponent.getMaxHp()}`;
            } else if (Math.random() < hitChance) {
                const variableDamage = Math.round(this.getDamage() * (0.8 + Math.random() * 0.4));
                opponent.dealDamage(variableDamage);
                return `${this.getName()} makes ${variableDamage} damage to ${opponentName}. ${opponentName}'s hp now is ${opponent.getHealth()}/${opponent.getMaxHp()}`;
            } else {
                return `${this.getName()}'s attack <span class="text-warning-emphasis fw-bold">missed</span>`;
            };
        };
        this.dealDamage = (value) => {
            if (value > 0) {
                let hp = this.getHealth();
                hp -= value;
                if (hp < 0) { hp = 0; } // Устанавливаем здоровье в 0, если оно опускается ниже
                _currentHp = hp;
            };
        };
        this.addWin = () => {
            _wins += 1;
        };
        this.addLoss = () => {
            _losses += 1;
        };

        this.addExperience = function(exp) {
            this._experience += exp;
            if (this._experience >= this._expToNextLevel) {
                this.levelUp();
            };
        };

        this.levelUp = function() {
            this._level += 1;
            this._experience -= this.getExpToNextLevel();
            this._expToNextLevel = Math.round(this._expToNextLevel * 1.5); // Увеличение опыта для следующего уровня
            
            // Повышение характеристик с каждым уровнем
            this._damage = this.setDamage(Math.floor(this.getDamage() * 1.1) + 1);
            this._maxHp = this.setMaxHp(Math.floor(this.getMaxHp() * 1.1) + 1);
            this._strength = this.setStrength(Math.floor(this.getStrength() * 1.1) + 1);
            this._agility = this.setAgility(Math.floor(this.getAgility() * 1.1) + 1);
            this._currentHp = this.heal(this.getMaxHp() - this.getHealth()); // Восстановление HP при повышении уровня

            msgModal.find('.modal-body').append(`<p>${this.getName()} has reached <span class="fw-bold">${this._level}</span> and fully regenerates health!</p>`);
        };
    }
};

const battle = (fighter1, fighter2) => {
    if (fighter1.getHealth() && fighter2.getHealth()) {
        const modalBody = msgModal.find('.modal-body');
        modalBody.html(`<h4 class="mb-4">${fighter1.getName()} and ${fighter2.getName()} are fighting!</h3>`);
        msgModal.modal('show');

        let round = 1;
        let battleEnded = false;
        function battleEnd(roundHtml) {
            battleEnded = true;
            modalBody.append(roundHtml);
        };

        while (fighter1.getHealth() && fighter2.getHealth() && !battleEnded) {
            const random = Math.round(Math.random());
            const roundHtml = $('<div class="round-container"></div>');

            roundHtml.append(`<h6 class="card-subtitle mb-2 text-muted">Round ${round++}</h6>`);

            if (random) {
                roundHtml.append(`<p class="mb-0">${fighter1.attack(fighter2)}</p>`);
                if (fighter2.getHealth() <= 0) {
                    battleEnd(roundHtml);
                    break;
                };

                roundHtml.append(`<p>${fighter2.attack(fighter1)}</p>`);
                if (fighter1.getHealth() <= 0) {
                    battleEnd(roundHtml);
                    break;
                };
            } else {                
                roundHtml.append(`<p class="mb-0">${fighter2.attack(fighter1)}</p>`);
                if (fighter1.getHealth() <= 0) {
                    battleEnd(roundHtml);
                    break;
                };

                roundHtml.append(`<p>${fighter1.attack(fighter2)}</p>`);
                if (fighter2.getHealth() <= 0) {
                    battleEnd(roundHtml);
                    break;
                };
            };
            
            modalBody.append(roundHtml);
        };

        let winner = fighter1.getHealth() ? fighter1 : fighter2;
        let looser = fighter1.getHealth() ? fighter2 : fighter1;
        const winnerLevel = winner.getLevel();
        const looserLevel = looser.getLevel();

        // Опыт для победителя
        const calculateExperience = () => {
          const baseExperience = 50;
          if (looserLevel < winnerLevel) {
            return Math.max(1, baseExperience * (looserLevel / winnerLevel));
          }
          return baseExperience;
        };

        // Разница характеристик проигравшего и победителя
        const levelDifference = Math.max(looserLevel - winnerLevel, 0);
        const strengthDifference = Math.max(looser.getStrength() - winner.getStrength(), 0);
        const agilityDifference = Math.max(looser.getAgility() - winner.getAgility(), 0);

        const experienceBonus = Math.round(
            (levelDifference * 10) + (strengthDifference * 0.5) + (agilityDifference * 0.3)
        );

        const totalExperience = Math.round(calculateExperience() + experienceBonus);

        // Базовая награда + награда за разницу характеристик
        const baseAward = 10;
        const award = Math.round(
            baseAward + (levelDifference * 10) + (strengthDifference * 0.5) + (agilityDifference * 0.3)
        );

        modalBody.append(`<p>${winner.getName()} has <span class="text-success fw-bold">won</span> and received ${award} coins and ${totalExperience} experience!</p>`);

        winner.addWin();
        winner.addToPurse(award);
        looser.addLoss();
        winner.addExperience(totalExperience);
        looser.addExperience(20);

        modalBody.append(`<p>${looser.getName()} has <span class="text-danger fw-bold">lost</span> and guild master heals him for ${Math.floor(looser.getMaxHp() / 3)} HP points as a consolation gift.</p>`);
        looser.heal(Math.floor(looser.getMaxHp() / 3));

        setToStorage();

        // Флаг для отслеживания бойцов, которые нужно обновить после закрытия модального окна
        const winnerId = winner.getId();
        const looserId = looser.getId();

        // Обработчик обновления карточек при закрытии модального окна
        msgModal.on('hidden.bs.modal', function () {
            $('.card[data-id="' + looserId + '"]').parent().replaceWith(createCard(looser));
            $('.card[data-id="' + winnerId + '"]').parent().replaceWith(createCard(winner));
            msgModal.off('hidden.bs.modal'); // Удаляем обработчик, чтобы он срабатывал только один раз
            showMsgBtn.removeClass('d-none');
        });

        return true;
    } else {
        console.log(`${fighter1.getHealth() ? fighter2.getName() : fighter1.getName()} is dead and can't fight.`);
        return false;
    };
};

const getHealingCostPerPoint = function(level = 1) {
    return 0.01 + level * 0.1;
};

const showMsgBtn = $('#showLastEvent');
const firghersList = $('#firghersList');
const createFighterBtn = $('#createFighter');
const fighterForm = $('#fighterForm');
const cancelSubmitting = $('#cancelSubmitting');
const submitFighter = $('#submitFighter');
const sentToBattle = $('#sentToBattle');
const msgModal = $('#msgModal');
const avsMap = Array.from({length: 16}, (_, i) => `av-${i + 1}.png`);
const typesMap = {
    1: {
        damage: 12,
        hp: 100,
        strength: 12,
        agility: 5
    }, // Strong
    2: {
        damage: 10,
        hp: 100,
        strength: 10,
        agility: 15
    }, // Sneaky
    3: {
        damage: 10,
        hp: 125,
        strength: 10,
        agility: 5
    }, // Tank
};
const fighters = getFromStorage() || [];

if (fighters.length) {
    fighters.forEach(fighter => firghersList.append(createCard(fighter)));
};

showMsgBtn.on('click', () => {
    msgModal.modal('show');
});

submitFighter.on('click', () => {
    const name = $('#fighterName').val();
    const type = $('#fighterType').val();
    const avatar = $('#selectedAvatar').attr('src');

    const newFighter = new Fighter({
        name: name,
        damage: typesMap[type].damage,
        hp: typesMap[type].hp,
        strength: typesMap[type].strength,
        agility: typesMap[type].agility,
        avatar: avatar
    });
    fighters.push(newFighter);

    firghersList.append(createCard(newFighter));
    createFighterBtn.removeClass('d-none');
    fighterForm.addClass('d-none');

    $('#fighterName').val('');
    $('#fighterType').val(1);

    setToStorage();
});

$('#fighterName').on('input', () => {
    submitFighter.prop('disabled', !$('#fighterName').val());
});

$(document).on('change', '.selectToBattle', function () {
    const amountSelected = $('.selectToBattle:checked').length;
    if (amountSelected === 2) {
        sentToBattle.removeClass('d-none');
        $('.selectToBattle:not(:checked)').prop('disabled', true);
    } else {
        sentToBattle.addClass('d-none');
        $('.selectToBattle:not(:checked)').prop('disabled', false);
    };
});

$(document).on('click', '.deleteFighterBtn', function () {
    const id = $(this).closest('.card').data('id');
    const index = fighters.findIndex(fighter => fighter.getId() === id);
    fighters.splice(index, 1);
    $(this).closest('.card').parent().remove();
    setToStorage(); 
});

$(document).on('click', '.healBtn', function () {
    const id = $(this).closest('.card').data('id');
    const fighter = getFighterById(id);
    const maxHp = fighter.getMaxHp();
    const currentHp = fighter.getHealth();
    const purse = fighter.getPurse();
    const name = fighter.getName();
    const healingCostPerPoint = getHealingCostPerPoint(fighter.getLevel());

    const healthToRestore = maxHp - currentHp;
    const fullHealingCost = Math.round(healthToRestore * healingCostPerPoint);
    const affordableHealing = Math.min(healthToRestore, Math.floor(purse / healingCostPerPoint));
    const partialHealingCost = Math.round(affordableHealing * healingCostPerPoint);

    if (purse >= fullHealingCost) {
        fighter.heal(healthToRestore);
        fighter.setPurse(purse - fullHealingCost);
    } else if (affordableHealing > 0) {
        fighter.heal(affordableHealing);
        fighter.setPurse(purse - partialHealingCost);
    } else {
        msgModal.find('.modal-body').html(`<p>${name} doesn't have enough coins to heal!</p>`);
        msgModal.modal('show');
        return;
    };

    $('.card[data-id="' + id + '"]').parent().replaceWith(createCard(fighter));
    setToStorage();
});

$(document).on('click', '.js-selectAv', function () {
    const src = $(this).data('src');
    pickAvatar(src);
    $('#avatarsLibraryModal').modal('hide');
});

sentToBattle.on('click', () => {
    const selected = $('.selectToBattle:checked');
    const id1 = selected[0].value;
    const id2 = selected[1].value;
    const f1 = getFighterById(id1);
    const f2 = getFighterById(id2);
    const result = battle(f1, f2);

    if (result) {
        selected.prop('checked', false);
        sentToBattle.addClass('d-none');
        $('.selectToBattle:not(:checked)').prop('disabled', false);
    } else {
        msgModal.find('.modal-body').text(`The ${f1.getHealth() ? f2.getName() : f1.getName()} is seriously damaged and can't fight. You should heal him first!`);
        msgModal.modal('show');
    };
});

createFighterBtn.on('click', () => {
    createFighterBtn.addClass('d-none');
    fighterForm.removeClass('d-none');

    // Select a random img from avsMap and pickAvatar(src)
    const randomAvatarSrc = avsMap[Math.floor(Math.random() * avsMap.length)];
    pickAvatar(randomAvatarSrc);
});

cancelSubmitting.on('click', () => {
    createFighterBtn.removeClass('d-none');
    fighterForm.addClass('d-none');
});

function pickAvatar(src) {
    const container = $('#avatarContainer');
    $('#selectedAvatar').remove();
    container.prepend(`<img src="images/${src}" title="avatar" class="d-block rounded-circle object-fit-cover" id="selectedAvatar" width="120" height="120">`);
};

function createCard(fighter) {
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
    const avatarSrc = fighter.getAvatar();

    const healingCostPerPoint = getHealingCostPerPoint(level);

    const healthToRestore = maxHp - hp;
    const fullHealingCost = Math.round(healthToRestore * healingCostPerPoint);

    // Если денег не хватает на полное лечение, рассчитываем доступное восстановление
    const affordableHealing = Math.min(healthToRestore, Math.floor(purse / healingCostPerPoint));
    const partialHealingCost = Math.round(affordableHealing * healingCostPerPoint);

    const currentExp = fighter.getExperience();
    const expToNextLevel = fighter.getExpToNextLevel();

    const card = `<div class="col-md-4 mb-4">
        <div class="card" data-id="${id}">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="d-flex">
                        <div class="me-2 rounded-circle mb-auto card-avatar">
                            <img src="${avatarSrc}" class="rounded-circle object-fit-cover" alt="Avatar" width="70" height="70">
                            <div class="card-avatar-level">${level}</div>
                        </div>
                        
                        <div class="flex-grow-1 d-flex flex-column align-items-end">
                            ${name}
                            <div class="list-group-item px-0 d-flex align-items-center my-1">
                                <img src="images/heart.png" class="me-2" alt="Health" width="20" height="20">

                                <div class="fs-6">
                                    <span ${hp < maxHp / 2 ? 'class="text-danger fw-bold"' : ''}>${hp}</span>/${maxHp}   </div> 
                            </div>

                            <div class="w-100 d-flex align-items-center">
                                <div class="fs-6 me-2">XP:</div>
                                <div class="progress w-100" role="progressbar" aria-label="Experience" aria-valuenow="${currentExp / expToNextLevel * 100}" aria-valuemin="0" aria-valuemax="${expToNextLevel}">
                                  <div class="progress-bar overflow-visible text-dark" style="width: ${currentExp / expToNextLevel * 100}%">
                                  </div>
                                  <div class="progress-bar-label">${currentExp}/${expToNextLevel}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </h5>

                <div class="${!purse ? 'd-none' : ''}">
                    ${hp < maxHp ? `<button class="btn btn-warning btn-sm healBtn w-100" data-full-healing-cost="${fullHealingCost}" data-partial-healing="${affordableHealing}" data-partial-cost="${partialHealingCost}">Heal for ${purse >= fullHealingCost ? fullHealingCost + ' coins' : partialHealingCost + ' coins (' + affordableHealing + ' HP)'}</button>` : ''}
                </div>

                <ul class="list-group list-group-flush">
                    <li class="list-group-item px-0 d-none">Level: ${fighter.getLevel()}</li>
                    <li class="list-group-item px-0">Damage: ${damage}</li>
                    <li class="list-group-item px-0">Strength: ${strength}</li>
                    <li class="list-group-item px-0">Agility: ${agility}</li>
                </ul>

                <h6 class="card-subtitle mb-2 text-muted mt-3">Statistics</h6>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Wins: ${wins}</li>
                    <li class="list-group-item">Losses: ${losses}</li>
                    <li class="list-group-item">Purse: ${purse} coins</li>
                </ul>
            </div>
            <div class="card-footer">
                <div class="d-flex justify-content-between">
                    <div class="form-check">
                        <input class="form-check-input selectToBattle" type="checkbox" value="${id}" id="select_${id}">
                        <label class="form-check-label" for="select_${id}">
                            Select
                        </label>
                    </div>

                    <button class="btn btn-danger btn-sm deleteFighterBtn ${hp ? 'd-none' : ''}">Utilize</button>
                </div>
            </div>
        </div>
    </div>`;

    return card;
};

function getFighterById(id) {
    return fighters.find(fighter => fighter.getId() === id);
};

function setToStorage() {
    const fightersJson = [];

    fighters.forEach(fighter => {
        fightersJson.push({
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
        });
    });

    localStorage.setItem('fighters', JSON.stringify(fightersJson));
};

function getFromStorage() {
    const fightersStr = localStorage.getItem('fighters');

    const newFighters = [];

    if (fightersStr) {
        const fightersArr = JSON.parse(fightersStr);
        fightersArr.forEach(fighter => {
            const newFighter = new Fighter({
                name: fighter.name,
                damage: fighter.damage,
                hp: fighter.hp,
                strength: fighter.strength,
                agility: fighter.agility,
                wins: fighter.wins,
                losses: fighter.losses,
                purse: fighter.purse,
                maxHp: fighter.maxHp,
                level: fighter.level,
                experience: fighter.experience,
                avatar: fighter.avatar
            });

            newFighters.push(newFighter);
        });

        return newFighters;
    } else {
        return [];
    };
};

function generateAvsGrid() {
    const container = $('#avsGridBox');
    container.empty();

    avsMap.forEach((image, i) => {
        container.append(`<div class="d-flex flex-column gap-1 avCard">
            <img src="images/${image}" title="avatar" class="d-block rounded-circle object-fit-cover" width="120" height="120">
            <button type="button" class="btn btn-primary btn-sm js-selectAv" data-src="${image}">Select</button>
        </div>`);
    });
};

$( document ).ready(function() {
    generateAvsGrid();
});

