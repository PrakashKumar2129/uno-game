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
let colorIndication, timerDelay, spliceIndex, cardGroup, parentDiv;
let timerStatus = (playerStatus = unoStatus = wildStatus = true);

const gameStart = () => {
  spinner.style.visibility = "visible";
  setTimeout(() => {
    spinner.style.visibility = "hidden";
    clearInterval(timerDelay);
    timerStatus = playerStatus = unoStatus = wildStatus = true;
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

const createCardElement = (card, cardGroup) => {
  cardGroup.map((cardValue) => {
    let cardSection = document.createElement("div");
    let cardEdgeValue = document.createElement("p");
    let cardCenterValue = document.createElement("cardInnerValue");
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
      } else if (cardValue.value == "wild")
        cardSection.appendChild(setImage("/images/wild.webp"));
      else if (cardValue.value == "draw4")
        cardSection.appendChild(setImage("/images/wild4.webp"));
      else
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

const setImage = (imageSource) => {
  let img = document.createElement("img");
  img.setAttribute("src", `${imageSource}`);
  return img;
};

const setDataSet = (cardEdgeValue, cardCenterValue, cardValue, setValue) => {
  cardEdgeValue.setAttribute("data-set", `${cardValue}`);
  cardCenterValue.innerHTML = setValue;
  cardEdgeValue.appendChild(cardCenterValue);
  return cardEdgeValue;
};

const pointerEventHide = () => {
  playerCardField.style.pointerEvents = "none";
  closeDeckField.style.pointerEvents = "none";
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

const pointerAction = () => {
  playerStatus = true;
  let pointerFlag = false;
  for (let iterator of playerDeck)
    if (wildCardValidate(iterator)) {
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

const computerPlay = () => {
  playerStatus = false;
  let possibleCard = computerDeck.filter((item) => {
    if (wildCardValidate(item)) return item;
  });
  if (possibleCard.length != 0)
    playingCard(possibleCard[Math.floor(Math.random() * possibleCard.length)]);
  else getCloseCard("computer");
};

const buttonHide = () => {
  drawButton.style.visibility = "hidden";
  passButton.style.visibility = "hidden";
  unoButton.style.visibility = "hidden";
  colorIndicationField.style.visibility = "hidden";
};

const unoShow = () => {
  unoButton.style.visibility = "visible";
  let unoStatus = true;
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
  }, 3000);
};

const wildCardValidate = (closeCard) => {
  return (
    closeCard.color == colorIndication ||
    closeCard.value == openDeck[openDeck.length - 1].value ||
    closeCard.type == "wild"
  );
};

const valueAndColorValidate = (selectedCard, openCard) => {
  return (
    selectedCard.value == openCard.value ||
    selectedCard.color == colorIndication
  );
};

const openCardAdd = (selectedCard, spliceIndex, cardGroup) => {
  openDeck.push(selectedCard);
  colorIndication = selectedCard.color;
  cardGroup.splice(spliceIndex, 1);
};

const callComputer = () => {
  pointerEventHide();
  setTimeout(computerPlay, 2000);
};

const addCard = (range, addDeck, addElement) => {
  let drawCard = getCard(range);
  addDeck = [...addDeck, ...drawCard];
  createCardElement(addElement, drawCard);
};

const chooseColor = () => {
  colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
  colorIndicationField.className = colorIndication;
  colorIndicationField.style.visibility = "visible";
};

const currentColor = (bgColor) => {
  colorIndication = bgColor;
  colorModalSection.style.display = "none";
  if (wildStatus) {
    callComputer();
  } else {
    pointerAction();
  }
  if (playerDeck.length == 1) unoShow();
};

const setCardGroup = (cardDeck, playerField, selectedCard) => {
  parentDiv = playerField;
  spliceIndex = cardDeck.findIndex(
    (item) =>
      item.type == selectedCard.type &&
      item.color == selectedCard.color &&
      item.value == selectedCard.value
  );
  cardGroup = cardDeck;
};

const setPlayerCard = (cardGroup, closeCard, addElement) => {
  cardGroup.push(closeCard);
  createCardElement(addElement, [closeCard]);
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
    valueAndColorValidate(cardValue, openCard) &&
    cardValue.type == "number"
  ) {
    openCardAdd(cardValue, spliceIndex, cardGroup);
    removeCardElement(parentDiv, cardValue, cardGroup, spliceIndex);
    if (parentDiv.id == "playerCard") callComputer();
    else pointerAction();
  } else if (
    valueAndColorValidate(cardValue, openCard) &&
    (cardValue.value == "reverse" || cardValue.value == "skip")
  ) {
    openCardAdd(cardValue, spliceIndex, cardGroup);
    removeCardElement(parentDiv, cardValue, cardGroup, spliceIndex);
    if (parentDiv.id == "computerCard") callComputer();
    else pointerAction();
  } else if (
    valueAndColorValidate(cardValue, openCard) &&
    cardValue.value == "draw2"
  ) {
    openCardAdd(cardValue, spliceIndex, cardGroup);
    removeCardElement(parentDiv, cardValue, cardGroup, spliceIndex);
    if (parentDiv.id == "playerCard") {
      addCard(2, computerDeck, computerCardField);
      pointerAction();
    } else {
      addCard(2, playerDeck, playerCardField);
      callComputer();
    }
  } else if (cardValue.value == "draw4") {
    openCardAdd(cardValue, spliceIndex, cardGroup);
    removeCardElement(parentDiv, cardValue, cardGroup, spliceIndex);
    if (parentDiv.id == "playerCard") {
      wildStatus = false;
      addCard(4, computerDeck, computerCardField);
      colorModalSection.style.display = "block";
    } else {
      addCard(4, playerDeck, playerCardField);
      chooseColor();
      callComputer();
    }
  } else if (cardValue.value == "wild") {
    openCardAdd(cardValue, spliceIndex, cardGroup);
    removeCardElement(parentDiv, cardValue, cardGroup, spliceIndex);
    if (parentDiv.id == "playerCard") {
      wildStatus = true;
      colorModalSection.style.display = "block";
    } else {
      chooseColor();
      pointerAction();
    }
  }
};

const getCloseCard = (player) => {
  pointerEventHide();
  let closeCard = openDeck[openDeck.length - 1];
  if (wildCardValidate(closeCard) && player == "computer") {
    setPlayerCard(computerDeck, closeCard, computerCardField);
    playerStatus = false;
    playingCard(closeCard);
  } else if (wildCardValidate(closeCard) && player == "player") {
    setPlayerCard(playerDeck, closeCard, playerCardField);
    drawButton.style.visibility = "visible";
    passButton.style.visibility = "visible";
    drawButton.addEventListener("click", () => {
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

const removeCardElement = (parentDiv, selectedCard, cardGroup, spliceIndex) => {
  parentDiv.childNodes[spliceIndex].remove();
  openDeckField.innerHTML = "";
  createCardElement(openDeckField, [selectedCard]);
  if (cardGroup.length == 0) {
    scoreBoard();
  } else if (parentDiv.id == "computerCard" && cardGroup.length == 1) {
    computerUno.style.display = "block";
    setTimeout(() => {
      computerUno.style.display = "none";
    }, 1500);
  } else if (
    parentDiv.id == "playerCard" &&
    cardGroup.length == 1 &&
    selectedCard.type != "wild"
  ) {
    unoShow();
  }
};
