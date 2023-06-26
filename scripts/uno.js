//DOM Element
const computerCardField = document.querySelector("#computerCard");
const openDeckField = document.querySelector("#openDeck");
const closeDeckField = document.querySelector("#closeDeck");
const playerCardField = document.querySelector("#playerCard");
const colorModalSection = document.querySelector("#modalSection");
const scoreModalSection = document.querySelector("#scoreModalSection");
const colorIndicationField = document.querySelector('#colorIndicator');
const drawButton = document.querySelector('#draw');
const passButton = document.querySelector('#pass');
const unoButton = document.querySelector('#uno');
const timerField = document.querySelector('#timer');
const computerScore = document.querySelector('#computerScore');
const playerScore = document.querySelector('#playerScore');
const winner = document.querySelector('#winner');
const computerUno = document.querySelector('.computerUno');
const playerUno = document.querySelector('.playerUno');
const spinner = document.querySelector('.spinner');

//Constants
const cardNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const cardColor = ["bgRed", "bgYellow", "bgBlue", "bgGreen"];
const cardSpacial = ["skip", "reverse", "draw2"];
const cardWild = ["wild", "draw4"];
const skipUnicode = "\uf05e";
const reverseUnicode = "\uf021";
const skipIcon = `<i class="fa-solid fa-ban"></i>`;
const reverseIcon = `<i class="fa-solid fa-arrows-rotate"></i>`;
const drawTwoCardIcon = `<span></span><span></span>`;

//Global variables
let unoDeck = [], playerDeck = [], computerDeck = [], openDeck = [], colorIndication, timerStatus = playerStatus = unoStatus = wildStatus = true, delayTimer;

const gameStart = () => {
    spinner.style.visibility = 'visible';
    setTimeout(() => {
        spinner.style.visibility = 'hidden';
        clearInterval(delayTimer);
        timerStatus = playerStatus = true;
        timerField.innerText = '05:00';
        scoreModalSection.style.display = colorModalSection.style.display = 'none';
        playerCardField.innerHTML = computerCardField.innerHTML = openDeckField.innerHTML = '';
        unoDeck.length = playerDeck.length = computerDeck.length = openDeck.length = 0;
        drawButton.style.visibility = passButton.style.visibility = unoButton.style.visibility = colorIndicationField.style.visibility = 'hidden';
        unoDeck = shuffleDeck(buildDeck());
        dealCard();
        let openCard = unoDeck.pop();
        while (openCard.type != 'number') {
            unoDeck.unshift(openCard);
            openCard = unoDeck.pop();
        }
        openDeck.push(openCard);
        colorIndication = openCard.color;
        createCardElement(openDeckField, openDeck);
        createCardElement(computerCardField, computerDeck);
        createCardElement(playerCardField, playerDeck);
        pointerAction();
    }, 1500);
}

const startTimer = () => {
    let timer = 300, minutes, seconds;
    delayTimer = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerField.innerText = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(delayTimer);
            colorModalSection.style.display = 'none';
            scoreBoard();
        }
    }, 1000);
}

const buildDeck = () => {
    let deckCards = [], cardObject, temp;
    cardColor.map((color) => {
        cardNumber.map((cardValue) => {
            cardObject = { type: "number", color: color, value: cardValue, point: cardValue };
            deckCards.push(cardObject);
            if (cardValue != 0) {
                indexValue = { type: "number", color: color, value: cardValue, point: cardValue };
                deckCards.push(cardObject);
            }
        });
        cardSpacial.map((cardValue) => {
            temp = 2;
            while (temp >= 1) {
                cardObject = { type: "special", color: color, value: cardValue, point: 20 };
                deckCards.push(cardObject);
                temp--;
            }
        });
    });
    cardWild.map((cardValue) => {
        temp = 4;
        while (temp >= 1) {
            cardObject = { type: "wild", value: cardValue, point: 50 };
            deckCards.push(cardObject);
            temp--;
        }
    });
    return deckCards;
};

const shuffleDeck = (shuffleArray) => {
    return shuffleArray.sort(() => Math.random() - 0.5)
};

const dealCard = () => {
    for (let index = 0; index < 14; index++)
        if (index % 2 == 0)
            computerDeck.push(unoDeck.pop());
        else
            playerDeck.push(unoDeck.pop());
};

const createCardElement = (divElement, cardArray) => {
    cardArray.map((cardValue) => {
        let cardSection = document.createElement("div");
        let para = document.createElement("p");
        let span = document.createElement("span");
        cardSection.className = "card";
        cardSection.setAttribute("data-name", JSON.stringify(cardValue));
        if (divElement.id === "computerCard") {
            para.className = `backCard bgBlack`;
            span.className = "unoCard";
            para.appendChild(span);
            cardSection.appendChild(para);
        }
        else {
            span.className = "mark";
            para.className = `innerCard ${cardValue.color}`;

            cardSection.addEventListener("click", (event) => {
                playingCard(event.target.closest(".card").dataset.name);
            });

            if (cardValue.type == "number" || cardValue.type == "special") {
                if (cardValue.value == "skip") {
                    para.setAttribute("data-set", `${skipUnicode}`);
                    span.innerHTML = skipIcon;
                }
                else if (cardValue.value == "reverse") {
                    para.setAttribute("data-set", `${reverseUnicode}`);
                    span.innerHTML = reverseIcon;
                }
                else if (cardValue.value == "draw2") {
                    span.classList.add("drawTwoCard");
                    para.setAttribute("data-set", "+2");
                    span.innerHTML = drawTwoCardIcon;
                }
                else {
                    para.setAttribute("data-set", `${cardValue.value}`);
                    span.innerText = cardValue.value;
                }
                para.appendChild(span);
                cardSection.appendChild(para);
            }
            else if (cardValue.value == "wild") {
                let img = document.createElement("img");
                img.setAttribute("src", `/images/wild.webp`);
                cardSection.appendChild(img);
            }
            else if (cardValue.value == "draw4") {
                let img = document.createElement("img");
                img.setAttribute("src", `/images/wild4.webp`);
                cardSection.appendChild(img);
            }
        }
        divElement.appendChild(cardSection);
    });
};

const pointerEventHide = () => {
    playerCardField.style.pointerEvents = "none";
    closeDeckField.style.pointerEvents = "none";
}

const scoreBoard = () => {
    let playerPoint = playerDeck.reduce((acc, index) => acc + index.point, 0);
    let computerPoint = computerDeck.reduce((acc, index) => acc + index.point, 0);
    scoreModalSection.style.display = 'block';
    computerScore.innerText = playerPoint;
    playerScore.innerText = computerPoint;
    winner.innerText = playerPoint < computerPoint ? "player won" : "computer won";
}

const currentColor = (bgColor) => {
    colorIndication = bgColor;
    colorModalSection.style.display = "none";
    if (wildStatus) {
        setTimeout(computerHand, 1000);
    }
    else {
        pointerAction();
    }
    if (playerDeck.length == 1)
        unoShow();
};

const getOneCard = () => {
    if (unoDeck.length == 0) {
        unoDeck = shuffleDeck(openDeck);
        openDeck = [];
    }
    return unoDeck.pop()
}

const pointerAction = () => {
    playerStatus = true;
    let pointerFlag = false;
    for (let iterator of playerDeck)
        if (iterator.color == colorIndication || iterator.value == openDeck[openDeck.length - 1].value || iterator.type == "wild") {
            pointerFlag = true;
            break;
        }
    if (pointerFlag) {
        playerCardField.style.pointerEvents = "auto";
        closeDeckField.style.pointerEvents = "none";
    } else {
        playerCardField.style.pointerEvents = "none";
        closeDeckField.style.pointerEvents = "auto";
    }
};

const computerHand = () => {
    playerStatus = false;
    let possibleCard = computerDeck.filter((index) => {
        if (index.color == colorIndication || index.value == openDeck[openDeck.length - 1].value || index.type == 'wild')
            return index;
    });
    if (possibleCard.length != 0) {
        playingCard(JSON.stringify(possibleCard[Math.floor(Math.random() * possibleCard.length)]));
    }
    else {
        getCloseCard('computer');
    }
};

const getCloseCard = (player) => {
    pointerEventHide();
    let closeCard = getOneCard();
    if ((closeCard.color == colorIndication || closeCard.value == openDeck[openDeck.length - 1].value || closeCard.type == 'wild') && (player == 'computer')) {
        computerDeck.push(closeCard);
        createCardElement(computerCardField, [closeCard]);
        playerStatus = false;
        playingCard(JSON.stringify(closeCard));
    }
    else if ((closeCard.color == colorIndication || closeCard.value == openDeck[openDeck.length - 1].value || closeCard.type == 'wild') && (player == 'player')) {
        playerDeck.push(closeCard);
        createCardElement(playerCardField, [closeCard]);
        drawButton.style.visibility = 'visible';
        passButton.style.visibility = 'visible';
        drawButton.addEventListener('click', () => {
            playerStatus = true;
            playingCard(JSON.stringify(playerDeck[playerDeck.length - 1]));
        })
        passButton.addEventListener('click', () => {
            drawButton.style.visibility = 'hidden';
            passButton.style.visibility = 'hidden';
            setTimeout(computerHand, 1000);
        });

    }
    else if (player == 'computer') {
        computerDeck.push(closeCard);
        createCardElement(computerCardField, [closeCard]);
        pointerAction();
    }
    else if (player == 'player') {
        playerDeck.push(closeCard);
        createCardElement(playerCardField, [closeCard]);
        setTimeout(computerHand, 1000);
    }
}

const playingCard = (cardValue) => {
    let selectedCard = JSON.parse(cardValue);
    let openCard = openDeck[openDeck.length - 1];
    let spliceIndex, cardArray, parentDiv;
    drawButton.style.visibility = 'hidden';
    passButton.style.visibility = 'hidden';
    unoButton.style.visibility = 'hidden';
    colorIndicationField.style.visibility = 'hidden';
    if (timerStatus) {
        timerStatus = false;
        startTimer();
    }
    if (playerStatus) {
        parentDiv = playerCardField;
        spliceIndex = playerDeck.findIndex((item) => item.type == selectedCard.type && item.color == selectedCard.color && item.value == selectedCard.value);
        cardArray = playerDeck;
    }
    else {
        parentDiv = computerCardField;
        spliceIndex = computerDeck.findIndex((item) => item.type == selectedCard.type && item.color == selectedCard.color && item.value == selectedCard.value);
        cardArray = computerDeck;
    }
    if ((selectedCard.value == openCard.value || selectedCard.color == colorIndication) && selectedCard.type == "number") {
        openDeck.push(selectedCard);
        colorIndication = selectedCard.color;
        cardArray.splice(spliceIndex, 1);
        removeCardElement(parentDiv, selectedCard, cardArray);
        if (parentDiv.id == "playerCard") {
            pointerEventHide();
            setTimeout(computerHand, 1000);
        }
        else {
            pointerAction();
        }

    }
    else if ((selectedCard.value == openCard.value || selectedCard.color == colorIndication) && selectedCard.type == "special" && (selectedCard.value == "reverse" || selectedCard.value == "skip")) {
        openDeck.push(selectedCard);
        colorIndication = selectedCard.color;
        cardArray.splice(spliceIndex, 1);
        removeCardElement(parentDiv, selectedCard, cardArray);
        if (parentDiv.id == "computerCard") {
            pointerEventHide();
            setTimeout(computerHand, 1000);
        }
        else {
            pointerAction();
        }
    }
    else if ((selectedCard.value == openCard.value || selectedCard.color == colorIndication) && selectedCard.type == "special" && selectedCard.value == "draw2") {
        openDeck.push(selectedCard);
        colorIndication = selectedCard.color;
        cardArray.splice(spliceIndex, 1);
        removeCardElement(parentDiv, selectedCard, cardArray);
        let drawTwoArray = [getOneCard(), getOneCard()];
        if (parentDiv.id == "playerCard") {
            computerDeck = [...computerDeck, ...drawTwoArray];
            createCardElement(computerCardField, drawTwoArray);
            pointerAction();
        }
        else {
            playerDeck = [...playerDeck, ...drawTwoArray];
            createCardElement(playerCardField, drawTwoArray);
            pointerEventHide();
            setTimeout(computerHand, 1000);
        }
    }
    else if (selectedCard.type == "wild" && selectedCard.value == "draw4") {
        openDeck.push(selectedCard);
        cardArray.splice(spliceIndex, 1);
        removeCardElement(parentDiv, selectedCard, cardArray);
        let drawFourArray = [getOneCard(), getOneCard(), getOneCard(), getOneCard()];
        if (parentDiv.id == "playerCard") {
            wildStatus = false;
            computerDeck = [...computerDeck, ...drawFourArray];
            createCardElement(computerCardField, drawFourArray);
            colorModalSection.style.display = "block";
        }
        else {
            playerDeck = [...playerDeck, ...drawFourArray];
            createCardElement(playerCardField, drawFourArray);
            colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
            colorIndicationField.className = colorIndication;
            colorIndicationField.style.visibility = 'visible';
            setTimeout(computerHand, 1000);
        }
    }
    else if (selectedCard.type == "wild" && selectedCard.value == "wild") {
        openDeck.push(selectedCard);
        cardArray.splice(spliceIndex, 1);
        removeCardElement(parentDiv, selectedCard, cardArray);
        if (parentDiv.id == "playerCard") {
            wildStatus = true;
            colorModalSection.style.display = "block";
            pointerEventHide();
        }
        else {
            colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
            colorIndicationField.className = colorIndication;
            colorIndicationField.style.visibility = 'visible';
            pointerAction();
        }
    }
};

const removeCardElement = (parentDiv, selectedCard, cardArray) => {
    parentDiv.querySelector(`[data-name = '${JSON.stringify(selectedCard)}']`).remove();
    openDeckField.innerHTML = "";
    createCardElement(openDeckField, [selectedCard]);
    if (cardArray.length == 0) {
        scoreBoard();
    }
    else if (parentDiv.id == 'computerCard' && cardArray.length == 1) {
        computerUno.style.display = 'block';
        setTimeout(() => {
            computerUno.style.display = 'none';
        }, 1500);
    }
    else if (parentDiv.id == 'playerCard' && cardArray.length == 1 && selectedCard.type != 'wild') {
        unoShow();
    }
};

const unoShow = () => {
    unoButton.style.visibility = 'visible';
    let unoStatus = true;
    unoButton.addEventListener('click', () => {
        unoStatus = false;
        unoButton.style.visibility = 'hidden';
        playerUno.style.display = 'block';
        setTimeout(() => {
            playerUno.style.display = 'none';
        }, 1500);
    });
    setTimeout(() => {
        if (unoStatus) {
            unoButton.style.visibility = 'hidden';
            let penaltyCard = [getOneCard(), getOneCard()];
            playerDeck = [...playerDeck, ...penaltyCard];
            createCardElement(playerCardField, penaltyCard);
        }
    }, 2500);
}
