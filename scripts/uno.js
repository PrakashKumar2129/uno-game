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
const drawTwoCardIcon = `<cardInnerValue></cardInnerValue><cardInnerValue></cardInnerValue>`;

//Global variables
let unoDeck = [];
let playerDeck = [];
let computerDeck = [];
let openDeck = [];
let colorIndication, timerDelay;
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
    drawButton.style.visibility =
      passButton.style.visibility =
      unoButton.style.visibility =
      colorIndicationField.style.visibility =
        "hidden";
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
    if (
      iterator.color == colorIndication ||
      iterator.value == openDeck[openDeck.length - 1].value ||
      iterator.type == "wild"
    ) {
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
  let possibleCard = computerDeck.filter((index) => {
    if (
      index.color == colorIndication ||
      index.value == openDeck[openDeck.length - 1].value ||
      index.type == "wild"
    )
      return index;
  });
  if (possibleCard.length != 0)
    playingCard(possibleCard[Math.floor(Math.random() * possibleCard.length)]);
  else getCloseCard("computer");
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
  }, 2500);
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
  let drawFourArray = getCard(range);
  addDeck = [...addDeck, ...drawFourArray];
  createCardElement(addElement, drawFourArray);
};

const chooseColor = () => {
  colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
  colorIndicationField.className = colorIndication;
  colorIndicationField.style.visibility = "visible";
};
