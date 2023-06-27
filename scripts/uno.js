//DOM Element
const computerCardField = document.querySelector("#computerCard");
const openDeckField = document.querySelector("#openDeck");
const closeDeckField = document.querySelector("#closeDeck");
const playerCardField = document.querySelector("#playerCard");
const colorModalSection = document.querySelector("#modalSection");
const scoreModalSection = document.querySelector("#scoreModalSection");
const colorIndicationField = document.querySelector("#colorIndicator");
const drawButton = document.querySelector("#draw");
const passButton = document.querySelector("#pass");
const unoButton = document.querySelector("#uno");
const timerField = document.querySelector("#timer");
const computerScore = document.querySelector("#computerScore");
const playerScore = document.querySelector("#playerScore");
const winner = document.querySelector("#winner");
const computerUno = document.querySelector(".computerUno");
const playerUno = document.querySelector(".playerUno");
const spinner = document.querySelector(".spinner");
const playerName = document.querySelectorAll(".playerName");

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
let unoDeck = [];
let playerDeck = [];
let computerDeck = [];
let openDeck = [];
let colorIndication, timerDelay, parentDiv, spliceIndex;
let timerStatus = (playerStatus = wildStatus = unoStatus = true);

const gameStart = () => {
  spinner.style.visibility = "visible";
  setTimeout(() => {
    spinner.style.visibility = "hidden";
    clearInterval(timerDelay);
    timerStatus = playerStatus = wildStatus = true;
    timerField.innerText = "05:00";
    scoreModalSection.style.display = colorModalSection.style.display = "none";
    playerCardField.innerHTML =
      computerCardField.innerHTML =
      openDeckField.innerHTML =
        "";
    unoDeck.length =
      playerDeck.length =
      computerDeck.length =
      openDeck.length =
        0;
    buttonHide();
    unoDeck = shuffleDeck(buildDeck());
    dealCard();
    let openCard = unoDeck.pop();
    while (openCard.type != "number") {
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
};

const startTimer = () => {
  let timer = 300;
  let minutes, seconds;
  timerDelay = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerField.innerText = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(timerDelay);
      colorModalSection.style.display = "none";
      scoreBoard();
    }
  }, 1000);
};

const scoreBoard = () => {
  let playerPoint = playerDeck.reduce((acc, index) => acc + index.point, 0);
  let computerPoint = computerDeck.reduce((acc, index) => acc + index.point, 0);
  scoreModalSection.style.display = "block";
  computerScore.innerText = playerPoint;
  playerScore.innerText = computerPoint;
  winner.innerText =
    playerPoint == computerPoint
      ? "Draw"
      : playerPoint < computerPoint
      ? "player won"
      : "computer won";
};

const buildDeck = () => {
  let deckCards = [];
  let cardObject, temp;
  cardColor.map((color) => {
    cardNumber.map((cardValue) => {
      cardObject = {
        type: "number",
        color: color,
        value: cardValue,
        point: cardValue,
      };
      deckCards.push(cardObject);
      if (cardValue != 0) {
        indexValue = {
          type: "number",
          color: color,
          value: cardValue,
          point: cardValue,
        };
        deckCards.push(cardObject);
      }
    });
    cardSpacial.map((cardValue) => {
      temp = 2;
      while (temp >= 1) {
        cardObject = {
          type: "special",
          color: color,
          value: cardValue,
          point: 20,
        };
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

const shuffleDeck = (shuffle) => {
  return shuffle.sort(() => Math.random() - 0.5);
};

const dealCard = () => {
  for (let index = 0; index < 14; index++)
    if (index % 2 == 0) computerDeck.push(unoDeck.pop());
    else playerDeck.push(unoDeck.pop());
};

const setDataSet = (cardEdgeValue, cardCenterValue, cardValue, setValue) => {
  cardEdgeValue.setAttribute("data-set", `${cardValue}`);
  cardCenterValue.innerHTML = setValue;
  cardEdgeValue.appendChild(cardCenterValue);
  return cardEdgeValue;
};

const buttonHide = () => {
  drawButton.style.visibility = "hidden";
  passButton.style.visibility = "hidden";
  unoButton.style.visibility = "hidden";
  colorIndicationField.style.visibility = "hidden";
};

const createCardElement = (card, cardGroup) => {
  cardGroup.map((cardValue) => {
    let cardSection = document.createElement("div");
    let cardEdgeValue = document.createElement("p");
    let cardCenterValue = document.createElement("cardInnerValue");
    let image = document.createElement("img");
    cardSection.className = "card";
    if (card.id === "computerCard") {
      cardEdgeValue.className = `backCard bgBlack`;
      cardCenterValue.className = "unoCard";
      cardEdgeValue.appendChild(cardCenterValue);
      cardSection.appendChild(cardEdgeValue);
    } else {
      cardCenterValue.className = "mark";
      cardEdgeValue.className = `innerCard ${cardValue.color}`;
      cardSection.addEventListener("click", () => {
        playingCard(cardValue);
      });
      if (cardValue.value == "skip")
        cardSection.appendChild(
          setDataSet(cardEdgeValue, cardCenterValue, `${skipUnicode}`, skipIcon)
        );
      else if (cardValue.value == "reverse")
        cardSection.appendChild(
          setDataSet(
            cardEdgeValue,
            cardCenterValue,
            `${reverseUnicode}`,
            reverseIcon
          )
        );
      else if (cardValue.value == "draw2") {
        cardEdgeValue.classList.add("drawTwoCard");
        cardSection.appendChild(
          setDataSet(cardEdgeValue, cardCenterValue, "+2", drawTwoCardIcon)
        );
      } else if (cardValue.value == "wild") {
        image.src = `images/${cardValue.value}.webp`;
        cardSection.append(image);
      } else if (cardValue.value == "draw4") {
        image.src = `images/${cardValue.value}.webp`;
        cardSection.append(image);
      } else
        cardSection.appendChild(
          setDataSet(
            cardEdgeValue,
            cardCenterValue,
            cardValue.value,
            cardValue.value
          )
        );
    }
    card.appendChild(cardSection);
  });
};

const pointerEventHide = () => {
  playerCardField.style.pointerEvents = "none";
  closeDeckField.style.pointerEvents = "none";
};

const pointerAction = () => {
  playerStatus = true;
  let pointerFlag = false;
  for (let iterator = 0; iterator < playerDeck.length; iterator++) {
    if (wildCardValidate(playerDeck[iterator])) {
      pointerFlag = true;
      break;
    }
  }
  if (pointerFlag) {
    playerCardField.style.pointerEvents = "auto";
    closeDeckField.style.pointerEvents = "none";
  } else {
    playerCardField.style.pointerEvents = "none";
    closeDeckField.style.pointerEvents = "auto";
  }
};

const wildCardValidate = (closeCard) => {
  return (
    closeCard.color == colorIndication ||
    closeCard.value == openDeck[openDeck.length - 1].value ||
    closeCard.type == "wild"
  );
};

const getCard = (cardRange) => {
  let getCardGroup = [];
  if (unoDeck.length == 0) {
    unoDeck = shuffleDeck(openDeck);
    openDeck = [];
  } else
    for (let index = 0; index < cardRange; index++)
      getCardGroup.push(unoDeck.pop());
  return getCardGroup;
};

const computerPlay = () => {
  playerStatus = false;
  let possibleCard = computerDeck.filter((item) => {
    if (wildCardValidate(item)) return item;
  });
  if (possibleCard.length != 0) {
    playingCard(possibleCard[Math.floor(Math.random() * possibleCard.length)]);
  } else getCloseCard("computer");
};

const unoShow = () => {
  unoButton.style.visibility = "visible";
  unoButton.addEventListener("click", () => {
    unoStatus = false;
    unoButton.style.visibility = "hidden";
    playerUno.style.display = "block";
    setTimeout(() => {
      playerUno.style.display = "none";
    }, 1500);
  });
  setTimeout(() => {
    if (unoStatus) {
      unoButton.style.visibility = "hidden";
      let penaltyCard = getCard(2);
      playerDeck = [...playerDeck, ...penaltyCard];
      createCardElement(playerCardField, penaltyCard);
    }
  }, 2000);
};

const getCloseCard = (player) => {
  pointerEventHide();
  let closeCard = getCard(1)[0];
  if (wildCardValidate(closeCard) && player == "computer") {
    setPlayerCard(computerDeck, closeCard, computerCardField);
    playerStatus = false;
    playingCard(closeCard);
  } else if (wildCardValidate(closeCard) && player == "player") {
    setPlayerCard(playerDeck, closeCard, playerCardField);
    drawButton.style.visibility = "visible";
    passButton.style.visibility = "visible";

    drawButton.addEventListener("click", () => {
      buttonHide();
      playerStatus = true;
      playingCard(playerDeck[playerDeck.length - 1]);
    });

    passButton.addEventListener("click", () => {
      buttonHide();
      callComputer();
    });
  } else if (player == "computer") {
    setPlayerCard(computerDeck, closeCard, computerCardField);
    pointerAction();
  } else if (player == "player") {
    setPlayerCard(playerDeck, closeCard, playerCardField);
    callComputer();
  }
};

const setPlayerCard = (cardGroup, closeCard, addElement) => {
  cardGroup.push(closeCard);
  createCardElement(addElement, [closeCard]);
};

const callComputer = () => {
  pointerEventHide();
  if (!unoStatus) setTimeout(computerPlay, 2000);
  else setTimeout(computerPlay, 1000);
};

const removeCardElement = (parentDiv, selectedCard, cardGroup, spliceIndex) => {
  openDeckField.innerHTML = "";
  parentDiv.childNodes[spliceIndex].remove();
  createCardElement(openDeckField, [selectedCard]);
  if (cardGroup.length == 0) scoreBoard();
  else if (parentDiv.id == "computerCard" && cardGroup.length == 1) {
    computerUno.style.display = "block";
    setTimeout(() => {
      computerUno.style.display = "none";
    }, 1500);
  } else if (
    parentDiv.id == "playerCard" &&
    cardGroup.length == 1 &&
    selectedCard.type != "wild"
  )
    unoShow();
};

const setCardGroup = (cardDeck, playerField, selectedCard) => {
  parentDiv = playerField;
  spliceIndex = cardDeck.findIndex(
    (item) =>
      item.type == selectedCard.type &&
      item.color == selectedCard.color &&
      item.value == selectedCard.value
  );
};

const chooseColor = () => {
  colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
  colorIndicationField.className = colorIndication;
  colorIndicationField.style.visibility = "visible";
};

const currentColor = (bgColor) => {
  colorIndication = bgColor;
  colorModalSection.style.display = "none";
  if (wildStatus) callComputer();
  else pointerAction();
  if (playerDeck.length == 1) unoShow();
};

const drawAction = (range, addGroup, addElement) => {
  let drawCard = getCard(range);
  addGroup.push(...drawCard);
  createCardElement(addElement, drawCard);
};

const drawFourValidate = (parentDiv, cardValue, spliceIndex) => {
  if (parentDiv.id == "playerCard") {
    wildStatus = false;
    numberAction(parentDiv, cardValue, playerDeck, spliceIndex);
    drawAction(4, computerDeck, computerCardField);
    pointerAction();
    colorModalSection.style.display = "block";
  } else {
    numberAction(parentDiv, cardValue, computerDeck, spliceIndex);
    chooseColor();
    drawAction(4, playerDeck, playerCardField);
    callComputer();
  }
};

const wildValidate = (parentDiv, cardValue, spliceIndex) => {
  if (parentDiv.id == "playerCard") {
    numberAction(parentDiv, cardValue, playerDeck, spliceIndex);
    wildStatus = true;
    colorModalSection.style.display = "block";
  } else {
    numberAction(parentDiv, cardValue, computerDeck, spliceIndex);
    chooseColor();
    pointerAction();
  }
};

const drawValidate = (parentDiv, cardValue, spliceIndex) => {
  if (parentDiv.id == "playerCard") {
    numberAction(parentDiv, cardValue, playerDeck, spliceIndex);
    drawAction(2, computerDeck, computerCardField);
    pointerAction();
  } else {
    numberAction(parentDiv, cardValue, computerDeck, spliceIndex);
    drawAction(2, playerDeck, playerCardField);
    callComputer();
  }
};

const numberAction = (parentDiv, cardValue, cardValues, spliceIndex) => {
  cardValues.splice(spliceIndex, 1);
  openDeck.push(cardValue);
  colorIndication = cardValue.color;
  removeCardElement(parentDiv, cardValue, cardValues, spliceIndex);
};

const numberValidate = (parentDiv, cardValue, spliceIndex) => {
  if (parentDiv.id == "playerCard") {
    numberAction(parentDiv, cardValue, playerDeck, spliceIndex);
    callComputer();
  } else {
    numberAction(parentDiv, cardValue, computerDeck, spliceIndex);
    pointerAction();
  }
};

const skipValidate = (parentDiv, cardValue, spliceIndex) => {
  if ((parentDiv.id = "computerCard")) {
    numberAction(parentDiv, cardValue, computerDeck, spliceIndex);
    callComputer();
  } else {
    numberAction(parentDiv, cardValue, playerDeck, spliceIndex);
    pointerAction();
  }
};

const playingCard = (cardValue) => {
  let openCard = openDeck[openDeck.length - 1];
  buttonHide();
  if (timerStatus) {
    timerStatus = false;
    startTimer();
  }
  if (playerStatus) setCardGroup(playerDeck, playerCardField, cardValue);
  else setCardGroup(computerDeck, computerCardField, cardValue);

  if (
    (cardValue.value == openCard.value || cardValue.color == colorIndication) &&
    cardValue.type == "number"
  )
    numberValidate(parentDiv, cardValue, spliceIndex);
  else if (
    (cardValue.value == openCard.value || cardValue.color == colorIndication) &&
    (cardValue.value == "skip" || cardValue.value == "reverse")
  )
    skipValidate(parentDiv, cardValue, spliceIndex);
  else if (
    (cardValue.value == openCard.value || cardValue.color == colorIndication) &&
    cardValue.value == "draw2"
  )
    drawValidate(parentDiv, cardValue, spliceIndex, openCard);
  else if (cardValue.value == "draw4")
    drawFourValidate(parentDiv, cardValue, spliceIndex);
  else if (cardValue.value == "wild")
    wildValidate(parentDiv, cardValue, spliceIndex);
};