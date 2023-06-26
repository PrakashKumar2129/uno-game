const currentColor = (bgColor) => {
  colorIndication = bgColor;
  colorModalSection.style.display = "none";
  if (wildStatus) {
    setTimeout(computerPlay, 2000);
  } else {
    pointerAction();
  }
  if (playerDeck.length == 1) unoShow();
};

const getCloseCard = (player) => {
  pointerEventHide();
  let closeCard = getCard(1);
  if (wildCardValidate(closeCard) && player == "computer") {
    computerDeck.push(closeCard);
    createCardElement(computerCardField, [closeCard]);
    playerStatus = false;
    playingCard(JSON.stringify(closeCard));
  } else if (wildCardValidate(closeCard) && player == "player") {
    playerDeck.push(closeCard);
    createCardElement(playerCardField, [closeCard]);
    drawButton.style.visibility = "visible";
    passButton.style.visibility = "visible";
    drawButton.addEventListener("click", () => {
      playerStatus = true;
      playingCard(JSON.stringify(playerDeck[playerDeck.length - 1]));
    });
    passButton.addEventListener("click", () => {
      drawButton.style.visibility = "hidden";
      passButton.style.visibility = "hidden";
      setTimeout(computerPlay, 1000);
    });
  } else if (player == "computer") {
    computerDeck.push(closeCard);
    createCardElement(computerCardField, [closeCard]);
    pointerAction();
  } else if (player == "player") {
    playerDeck.push(closeCard);
    createCardElement(playerCardField, [closeCard]);
    setTimeout(computerPlay, 1000);
  }
};

const playingCard = (cardValue) => {
  let selectedCard = JSON.parse(cardValue);
  let openCard = openDeck[openDeck.length - 1];
  let spliceIndex, cardGroup, parentDiv;
  drawButton.style.visibility = "hidden";
  passButton.style.visibility = "hidden";
  unoButton.style.visibility = "hidden";
  colorIndicationField.style.visibility = "hidden";
  if (timerStatus) {
    timerStatus = false;
    startTimer();
  }
  if (playerStatus) {
    parentDiv = playerCardField;
    spliceIndex = playerDeck.findIndex(
      (item) =>
        item.type == selectedCard.type &&
        item.color == selectedCard.color &&
        item.value == selectedCard.value
    );
    cardGroup = playerDeck;
  } else {
    parentDiv = computerCardField;
    spliceIndex = computerDeck.findIndex(
      (item) =>
        item.type == selectedCard.type &&
        item.color == selectedCard.color &&
        item.value == selectedCard.value
    );
    cardGroup = computerDeck;
  }
  if (
    valueAndColorValidate(selectedCard, openCard) &&
    selectedCard.type == "number"
  ) {
    openCardAdd(selectedCard, spliceIndex, cardGroup);
    //   removeCardElement(parentDiv, selectedCard, cardArray);
    if (parentDiv.id == "playerCard") callComputer();
    else pointerAction();
  } else if (
    valueAndColorValidate(selectedCard, openCard) &&
    selectedCard.type == "special" &&
    (selectedCard.value == "reverse" || selectedCard.value == "skip")
  ) {
    openCardAdd(selectedCard, spliceIndex, cardGroup);
    // removeCardElement(parentDiv, selectedCard, cardGroup);
    if (parentDiv.id == "computerCard") callComputer();
    else pointerAction();
  } else if (
    valueAndColorValidate(selectedCard, openCard) &&
    selectedCard.type == "special" &&
    selectedCard.value == "draw2"
  ) {
    openCardAdd(selectedCard, spliceIndex, cardGroup);
    removeCardElement(parentDiv, selectedCard, cardGroup);
    if (parentDiv.id == "playerCard") {
      addCard(2, playerDeck, playerCardField);
      pointerAction();
    } else {
    }
  } else if (selectedCard.type == "wild" && selectedCard.value == "draw4") {
    openCardAdd(selectedCard, spliceIndex, cardGroup);
    removeCardElement(parentDiv, selectedCard, cardGroup);
    if (parentDiv.id == "playerCard") {
      wildStatus = false;
      addCard(2, playerDeck, playerCardField);
      colorModalSection.style.display = "block";
    } else {
      setTimeout(computerPlay, 1000);
    }
  } else if (selectedCard.type == "wild" && selectedCard.value == "wild") {
    openDeck.push(selectedCard);
    cardGroup.splice(spliceIndex, 1);
    removeCardElement(parentDiv, selectedCard, cardGroup);
    if (parentDiv.id == "playerCard") {
      wildStatus = true;
      colorModalSection.style.display = "block";
      pointerEventHide();
    } else {
      colorIndication = cardColor[Math.floor(Math.random() * cardColor.length)];
      colorIndicationField.className = colorIndication;
      colorIndicationField.style.visibility = "visible";
      pointerAction();
    }
  }
};

const removeCardElement = (parentDiv, selectedCard, cardGroup) => {
  parentDiv
    .querySelector(`[data-name = '${JSON.stringify(selectedCard)}']`)
    .remove();
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
