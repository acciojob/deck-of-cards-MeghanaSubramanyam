//your code here
// script.js
const deck = document.getElementById("deck");
const cardHolders = document.querySelectorAll(".typesOfCards .placed");
const wonBox = document.getElementById("won");
const resetBtn = document.getElementById("reset");
const shuffleBtn = document.getElementById("shuffle");

let cards = Array.from(document.querySelectorAll(".whitebox2"));

function getCardType(cardUrl) {
  const fileName = cardUrl.split("/").pop();
  const suit = fileName[fileName.length - 5]; // e.g. 2S.jpg => 'S'
  if (suit === "S") return "spade";
  if (suit === "D") return "diamond";
  if (suit === "C") return "club";
  if (suit === "H") return "heart";
  return null;
}

function getHolderType(holderImgUrl) {
  if (holderImgUrl.includes("spade")) return "spade";
  if (holderImgUrl.includes("diamond")) return "diamond";
  if (holderImgUrl.includes("club")) return "club";
  if (holderImgUrl.includes("heart")) return "heart";
  return null;
}

function saveProgress() {
  const placedCards = cards.filter(card => card.parentElement.classList.contains("placed"));
  const placedIds = placedCards.map(card => card.id);
  localStorage.setItem("placedCards", JSON.stringify(placedIds));
}

function restoreProgress() {
  const placedIds = JSON.parse(localStorage.getItem("placedCards") || "[]");
  placedIds.forEach(id => {
    const card = document.getElementById(id);
    const img = card.querySelector("img");
    const suit = getCardType(img.src);
    cardHolders.forEach(holder => {
      const holderType = getHolderType(holder.querySelector("img").src);
      if (holderType === suit) {
        holder.appendChild(card);
      }
    });
  });
  checkWin();
}

function checkWin() {
  let totalPlaced = 0;
  cardHolders.forEach(holder => {
    totalPlaced += holder.querySelectorAll(".whitebox2").length;
  });
  if (totalPlaced === 5) {
    wonBox.style.display = "flex";
  }
}

cards.forEach(card => {
  card.addEventListener("dragstart", e => {
    e.dataTransfer.setData("card-id", card.id);
  });
});

cardHolders.forEach(holder => {
  holder.addEventListener("dragover", e => {
    e.preventDefault();
  });

  holder.addEventListener("drop", e => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("card-id");
    const card = document.getElementById(cardId);
    const cardType = getCardType(card.querySelector("img").src);
    const holderType = getHolderType(holder.querySelector("img").src);
    if (cardType === holderType) {
      holder.appendChild(card);
      saveProgress();
      checkWin();
    }
  });
});

resetBtn.addEventListener("click", () => {
  wonBox.style.display = "none";
  localStorage.removeItem("placedCards");
  shuffle();
});

shuffleBtn.addEventListener("click", () => {
  shuffle();
});

function shuffle() {
  const remainingCards = cards.filter(card => !card.parentElement.classList.contains("placed"));
  remainingCards.sort(() => Math.random() - 0.5);
  remainingCards.forEach(card => {
    deck.appendChild(card);
  });
}

window.onload = restoreProgress;

