window.onerror = function(e) {
    alert(e);
}

var stateObject = {
    genre: "",
    theme: "",
    coreMechanics: "",
    extra: "",
    _prefix: "",
    _bridge: "",
    _postfix: "",
    get name() {
        return stateObject._prefix + stateObject._bridge + stateObject._postfix
    }
};

Object.prototype.map = function(transfn) {
    var k = Object.keys(this);
    var out = {};
    for (var i = 0; i < k.length; i++) {
        out[k[i]] = transfn(this[k[i]]);
    }
    return out;
};

var possibilities = {
    genre: ["Business", "Stealth", "Sandbox", "Racing", "Sports", "Maze", "MOBA", "Fighting", "Action", "Platformer", "FPS", "RTS", "Turn based", "Simulation", "Toilet-game", "Role playing"],
    theme: ["Ghost", "Cat", "Dogs", "Pixies", "Apocalypse", "Dragon", "Horror", "Time travel", "World war", "Ninjas", "Pirates", "Aliens", "Business", "Superheroes", "Animals", "Zombies", "Middle ages", "Tech", "Hell", "Ponycorn", "Kids", "Old people", "Sexy"],
    coreMechanics: ["Button smashing", "Serenity", "Risk and reward", "Worker placement", "Pointless", "Waiting", "Cards", "Capture/eliminate", "Tap-tap", "Timed interaction", "Micro management", "Run around", "Explosions", "Agility", "WASD"],
    extra: ["Audio", "RPG elements", "BLOOD", "2d", "3d", "Explosions", "Action elements", "Ponies"],
    _prefix: ["Journey", "Terror", "Dream", "Raiders", "Killers", "6 feet", "Omiguzu", "Brothers", "Blood", "Heroes", "Zombies", "Mommy", "Anger", "Money"],
    _bridge: [" of ", " ", "'s ", "-", " and ", ", Money, ", " without ", " of the ", " against ", " who love ", " vs. ", " for ", " and the ", " to the "],
    _postfix: ["Iwagashi", "Pidgeons", "Void", "Love", "Dirt", "Seven seas", "Monkey bees", "Dogs", "Unlimited", "Stars", "Universe", "Death", "Demons", "Money"]
}

window.pick = function(choiceKey) {
    var traits = Object.keys(stateObject);

    if (choiceKey) {
        var choice = {};
        choiceKey.split("").map(function(letter, traitId) {
            var idx = letter.charCodeAt(0) - "a".charCodeAt(0);
            choice[traits[traitId]] = possibilities[traits[traitId]][idx];
        });
    } else {
        var code = "";
        var choice = possibilities.map(function(trait) {
            var r = Math.floor(Math.random() * trait.length);
            code += String.fromCharCode(r + 'a'.charCodeAt(0));
            return trait[r];
        });
        window.location.hash = code;
    }

    traits.forEach(function(k) {
        stateObject[k] = choice[k];
        var el = document.getElementById(k + "Label");
        el && (el.textContent = stateObject[k]);
    });
}

window.onpopstate = function() {
    if (window.location.hash) {
        pick(window.location.hash.substring(1));
    }
}

window.save = function() {
    if (!localStorage) alert("You don't have local storage, so write this on a piece of paper:\n" + window.location.href);
    else {
        var saved = localStorage["gig-history"] && JSON.parse(localStorage["gig-history"]) || {};
        if (!saved[window.location.hash.substring(1)]) {
            saved[window.location.hash.substring(1)] = stateObject["name"];
            localStorage['gig-history'] = JSON.stringify(saved);
            window.addSavedItem(stateObject['name'], window.location.hash.substring(1));
        }
    }
}

window.addSavedItem = function(name, item) {
    var host = document.getElementById("history");
    var link = document.createElement("a");
    link.textContent = name;
    link.href = '#' + item;
    link.classList.add("gameLink");
    host.appendChild(link);
}


if (localStorage) {
    var saved = localStorage["gig-history"] && JSON.parse(localStorage["gig-history"]) || {};
    Object.keys(saved).forEach(function(key) {
        window.addSavedItem(saved[key], key);
    });
}
pick(window.location.hash.substring(1));