class Fighter {
    constructor({ name, damage, hp, strength, agility, wins, losses, purse, maxHp }) {
        let _name = name;
        let _damage = damage;
        let _maxHp = maxHp || hp;
        let _currentHp = hp;
        let _strength = strength;
        let _agility = agility;
        let _wins = wins || 0;
        let _losses = losses || 0;
        const _id = Math.random().toString(36).slice(2);
        let _purse = purse || 100;

        this.getName = () => _name.trim();
        this.getDamage = () => _damage;
        this.getStrength = () => _strength;
        this.getStrength = () => _strength;
        this.getAgility = () => _agility;
        this.getHealth = () => _currentHp;
        this.getMaxHp = () => _maxHp;
        this.getId = () => _id;
        this.getWins = () => _wins;
        this.getLosses = () => _losses;
        this.getPurse = () => _purse;
        this.addToPurse = (value) => _purse += value;

        this.setPurse = (value) => _purse = value;
        this.setMaxHp = (value) => _maxHp = value;

        this.logCombatHistory = () => console.log(`Name: ${_name}, Wins: ${_wins}, Losses: ${_losses}`);
        this.heal = (value) => {
            if (value > 0) {
                let hp = this.getHealth();
                hp + value <= _maxHp ? hp += value : hp = _maxHp;
                _currentHp = hp;
            }
        };
        this.attack = (opponent) => {
            const def = opponent.getAgility() + opponent.getStrength();
            const random = Math.round(Math.random() * '100');
            const opponentName = opponent.getName();

            if (random >= def) {
                opponent.dealDamage(_damage);
                return `${_name} makes ${_damage} damage to ${opponentName}. ${opponentName}'s hp now is ${_currentHp}/${_maxHp}`;
            } else {
                return `${_name}'s attack <span class="text-danger fw-bold">missed<span>`;
            };
        };
        this.dealDamage = (value) => {
            if (value > 0) {
                let hp = this.getHealth();
                hp - value >= 0 ? hp -= value : hp = 0;
                _currentHp = hp;
            }
        };
        this.addWin = () => {
            _wins += 1;
        };
        this.addLoss = () => {
            _losses += 1;
        };
    }
};

const battle = (fighter1, fighter2) => {
    if (fighter1.getHealth() && fighter2.getHealth()) {
        const modalBody = msgModal.find('.modal-body');
        modalBody.html(`<h4 class="mb-4">${fighter1.getName()} and ${fighter2.getName()} are fighting!</h3>`);
        msgModal.modal('show');

        let round = 1;

        while (fighter1.getHealth() && fighter2.getHealth()) {
            const random = Math.round(Math.random() * '1');
            const roundHtml = $('<div class="round-container"></div>');

            roundHtml.append(`<h6 class="card-subtitle mb-2 text-muted">Round ${round++}</h6>`);

            if (random) {
                roundHtml.append(`<p class="mb-0">${fighter1.attack(fighter2)}</p>`);
                roundHtml.append(`<p>${fighter2.attack(fighter1)}</p>`);
            } else {                
                roundHtml.append(`<p class="mb-0">${fighter2.attack(fighter1)}</p>`);
                roundHtml.append(`<p>${fighter1.attack(fighter2)}</p>`);
            };

            modalBody.append(roundHtml);
        };
        let winner = fighter1.getHealth() ? fighter1 : fighter2;
        let looser = fighter1.getHealth() ? fighter2 : fighter1;

        const coefficient = (looser.getWins() * 0.2 || 0.01) / (looser.getLosses() || 1);
        const award = Math.round(10 + 10 * coefficient);

        modalBody.append(`<p>${winner.getName()} has <span class="text-success fw-bold">won</span> and received ${award} coins!</p>`);

        winner.addWin();
        winner.addToPurse(award);
        looser.addLoss();

        //find card of the looser and the winner and rerender them
        $('.card[data-id="' + looser.getId() + '"]').parent().replaceWith(createCard(looser));
        $('.card[data-id="' + winner.getId() + '"]').parent().replaceWith(createCard(winner));

        setToStorage();
        return true;
    } else {
        console.log(`${fighter1.getHealth() ? fighter2.getName() : fighter1.getName()} is dead and can't fight.`);
        return false;
    };
};

const firghersList = $('#firghersList');
const createFighterBtn = $('#createFighter');
const fighterForm = $('#fighterForm');
const cancelSubmitting = $('#cancelSubmitting');
const submitFighter = $('#submitFighter');
const sentToBattle = $('#sentToBattle');
const msgModal = $('#msgModal');
const typesMap = {
    1: {
        damage: 12,
        hp: 100,
        strength: 12,
        agility: 5
    }, // Strong
    2: {
        damage: 8,
        hp: 80,
        strength: 10,
        agility: 15
    }, // Sneaky
    3: {
        damage: 10,
        hp: 120,
        strength: 10,
        agility: 5
    }, // Tank
};
const fighters = getFromStorage() || [];

if (fighters.length) {
    fighters.forEach(fighter => firghersList.append(createCard(fighter)));
};

submitFighter.on('click', () => {
    const name = $('#fighterName').val();
    const type = $('#fighterType').val();

    const newFighter = new Fighter({
        name: name,
        damage: typesMap[type].damage,
        hp: typesMap[type].hp,
        strength: typesMap[type].strength,
        agility: typesMap[type].agility
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
    const Purse = fighter.getPurse();
    const name = fighter.getName();

    if (Purse < 10) {
        msgModal.find('.modal-body').html(`<p>${name} doesn't have enough coins to heal!</p><p><i>We will add a a possibility to donate coins for real money in the future >:)</i></p>`);
        msgModal.modal('show');
        return;
    };

    fighter.heal(maxHp - currentHp);
    fighter.setPurse(Purse - 10);

    $('.card[data-id="' + id + '"]').parent().replaceWith(createCard(fighter));
    setToStorage();
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
});

cancelSubmitting.on('click', () => {
    createFighterBtn.removeClass('d-none');
    fighterForm.addClass('d-none');
});

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

    const card = `<div class="col-md-4 mb-4">
        <div class="card" data-id="${id}">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item px-0">Damage: ${damage}</li>
                    <li class="list-group-item px-0"><div class="d-flex justify-content-between align-items-center"><div>Health: <span ${hp < maxHp / 2 ? 'class="text-danger fw-bold"' : ''}>${hp}</span>/${maxHp}</div> ${hp < maxHp ? '<button class="btn btn-warning btn-sm healBtn">Heal for 10 coins</button>' : ''}</div></li>
                    <li class="list-group-item px-0">Strength: ${strength}</li>
                    <li class="list-group-item px-0">Agility: ${agility}</li>
                </ul>

                <h6 class="card-subtitle mb-2 text-muted mt-3">Statistics</h6>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Wins: ${wins}</li>
                    <li class="list-group-item">Losses: ${losses}</li>
                    <li class="list-group-item">Purse: ${fighter.getPurse()} coins</li>
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
            maxHp: fighter.getMaxHp()
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
                maxHp: fighter.maxHp
            });

            newFighters.push(newFighter);
        });

        return newFighters;
    } else {
        return [];
    };
};