import "./css/index.css"
import IMask from "imask"

const ccBgcolor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")

const ccBgcolor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    default: ["black", "grey"],
    visa: ["#315881", "#DFA43B"],
    mastercard: ["#FF5F00", "#EB001B"],
    amex: ["#7CB0C0", "#5474EB"],
    cielo: ["#A99E46", "#D32E48"],
    hipercard: ["#822124", "#A1585B"],
  }

  ccBgcolor01.setAttribute("fill", colors[type][0])
  ccBgcolor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4[0-9]{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^((5(([1-2]|[4-5])[0-9]{0,8}|0((1|6)([0-9]{0,7}))|3(0(4((0|[2-9])[0-9]{0,5})|([0-3]|[5-9])[0-9]{0,6})|[1-9][0-9]{0,7})))|((508116)\\d{0,10})|((502121)\\d{0,10})|((589916)\\d{0,10})|(2[0-9]{0,15})|(67[0-9]{0,14})|(506387)\\d{0,10})/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{0,2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardtype: "cielo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{0,13}/,
      cardtype: "amex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^606282|^3841(?:[0|4|6]{0,1})0/,
      cardtype: "hipercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const cardInfo = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )

    return cardInfo
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Função de clique do botão

const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  if (
    (cardNumberMasked.value === "") |
    (securityCodeMasked.value === "") |
    (expirationDateMasked.value === "") |
    (cardHolder.value === "")
  ) {
    alert("Favor preencher todos os dados do cartão.")
  } else {
    alert("Cartão adicionado com sucesso!")
    cardNumberMasked.value = ""
    securityCodeMasked.value = ""
    expirationDateMasked.value = ""
    cardHolder.value = ""
  }
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//Preenchimento auto do cvc

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? 123 : code
}

//Preenchimento do número do cartão

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//Preenchimento da data de expiração

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}