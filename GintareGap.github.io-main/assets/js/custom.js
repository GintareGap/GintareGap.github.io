document.addEventListener("DOMContentLoaded", function () {
    // Sukuriam pop-up elementą
    const popup = document.createElement("div");
    popup.id = "success-popup";
    popup.textContent = "Duomenys pateikti sėkmingai!";
    document.body.appendChild(popup);

    // Funkcija pop-up parodyti
    function showSuccessPopup() {
    popup.classList.add("show");

    // paslėpti po 3 sek.
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
    }

  // Randame contact sekciją pagal ID="contact"
  const contactsSection = document.getElementById("contact");
  if (!contactsSection) return;

  // Randame esamą formą arba sukuriame naują
  let form = contactsSection.querySelector("form");
  if (!form) {
    form = document.createElement("form");
    contactsSection.appendChild(form);
  }

  // Išvalome seną formos turinį
  form.innerHTML = "";

    // === Pagalbinės funkcijos validacijai ===
  function showError(input, message) {
    input.classList.add("is-invalid");
    let error = input.parentElement.querySelector(".error-message");

    if (!error) {
      error = document.createElement("div");
      error.className = "error-message";
      input.parentElement.appendChild(error);
    }

    error.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    const error = input.parentElement.querySelector(".error-message");
    if (error) {
      error.textContent = "";
    }
  }

  function validateField(input) {
    const id = input.id;
    const value = input.value.trim();
    let message = "";

    // tuščių laukų aptikimas (required)
    const isRequired = input.required;

    if (isRequired && value === "") {
      message = "Šis laukas yra privalomas.";
    } else {
      // papildomi tikrinimai pagal lauką
      if (id === "vardas" || id === "pavarde") {
        // tik raidės (leidžiam LT raides, tarpą, brūkšnelį, apostrofą)
        const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s'-]+$/;
        if (value !== "" && !nameRegex.test(value)) {
          message = "Lauke gali būti tik raidės.";
        }
      }

      if (id === "el_pastas") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value !== "" && !emailRegex.test(value)) {
          message = "Neteisingas el. pašto formatas.";
        }
      }

      if (id === "adresas") {
        // adresas kaip tekstas – jei jau įvestas, tegu būna bent keli simboliai
        if (value !== "" && value.length < 3) {
          message = "Adresas per trumpas.";
        }
      }
    }

    if (message) {
      showError(input, message);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }


  // Pagalbinė funkcija tekstiniams / email / tel laukams
    function createInputGroup(labelText, id, type = "text", required = true) {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;
    if (required) input.required = true;
    input.className = "form-control";

    // === TELEFONO VALIDACIJA (tavo iš 2 užduoties) ===
    if (id === "telefonas") {
        input.value = "+370 ";

        input.addEventListener("input", function () {
        let value = input.value;

        if (!value.startsWith("+370 ")) {
            value = "+370 ";
        }

        let numberPart = value.substring(5);
        numberPart = numberPart.replace(/\D/g, "");
        numberPart = numberPart.substring(0, 8);

        input.value = "+370 " + numberPart;
        });
    } 
    else {
        // === REAL-TIME VALIDACIJA VISIEMS KITIEMS LAUKAMS ===
        input.addEventListener("input", function () {
        validateField(input);
        });

        input.addEventListener("blur", function () {
        validateField(input);
        });
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    return wrapper;
    }


  // Pagalbinė funkcija vertinimo (1–10) slankikliui
  function createRangeGroup(questionText, id, min = 1, max = 10) {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = questionText;

    const valueSpan = document.createElement("span");
    valueSpan.id = id + "-value";
    valueSpan.style.marginLeft = "8px";

    const input = document.createElement("input");
    input.type = "range";
    input.id = id;
    input.name = id;
    input.min = String(min);
    input.max = String(max);
    input.value = String(Math.round((min + max) / 2));
    input.className = "form-range";

    valueSpan.textContent = input.value;

    input.addEventListener("input", function () {
      valueSpan.textContent = this.value;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(valueSpan);

    return wrapper;
  }

  // 1. Vardas
  form.appendChild(createInputGroup("Vardas", "vardas", "text", true));

  // 2. Pavardė
  form.appendChild(createInputGroup("Pavardė", "pavarde", "text", true));

  // 3. El. paštas
  form.appendChild(createInputGroup("El. paštas", "el_pastas", "email", true));

  // 4. Telefono numeris
  form.appendChild(createInputGroup("Telefono numeris", "telefonas", "tel", true));

  // 5. Adresas
  form.appendChild(createInputGroup("Adresas", "adresas", "text", false));

  // 6–8. 3 klausimai vertinimui (1–10)
  form.appendChild(
    createRangeGroup("Kaip vertinate mūsų paslaugų kokybę? (1–10)", "klausimas1")
  );
  form.appendChild(
    createRangeGroup("Kaip vertinate aptarnavimą? (1–10)", "klausimas2")
  );
  form.appendChild(
    createRangeGroup(
      "Kiek tikėtina, kad rekomenduosite mus kitiems? (1–10)",
      "klausimas3"
    )
  );

  // Submit mygtukas
  const submitWrapper = document.createElement("div");
  submitWrapper.className = "form-group mt-3";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Submit";
  submitBtn.className = "btn btn-primary";

  submitWrapper.appendChild(submitBtn);
  form.appendChild(submitWrapper);

  // Vietą rezultatams sukuriame PO forma
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "form-results";
  resultsContainer.className = "mt-4";
  contactsSection.appendChild(resultsContainer);

  // Submit logika
form.addEventListener("submit", function (e) {
  e.preventDefault(); // sustabdom numatytą persikrovimą

  // ✅ 1. Patikrinam visus reikalingus laukus (išskyrus telefoną)
  const fieldsToValidate = ["vardas", "pavarde", "el_pastas", "adresas"];
  let isValid = true;
  let firstInvalid = null;

  fieldsToValidate.forEach((id) => {
    const input = form.elements[id];
    if (input && !validateField(input)) {
      isValid = false;
      if (!firstInvalid) {
        firstInvalid = input;
      }
    }
  });

  // jei yra bent viena klaida – NELEIDŽIAM submit'int
  if (!isValid) {
    if (firstInvalid) {
      firstInvalid.focus(); // patogu vartotojui – nuveda prie klaidingo lauko
    }
    return; // ⛔ sustabdom submit logiką čia
  }

  // ✅ 2. Jei čia atėjom – duomenys geri, galima tęsti

  // Surenkame visas reikšmes į objektą
  const formData = {
    vardas: form.elements["vardas"].value.trim(),
    pavarde: form.elements["pavarde"].value.trim(),
    el_pastas: form.elements["el_pastas"].value.trim(),
    telefonas: form.elements["telefonas"].value.trim(),
    adresas: form.elements["adresas"].value.trim(),
    klausimas1: form.elements["klausimas1"].value,
    klausimas2: form.elements["klausimas2"].value,
    klausimas3: form.elements["klausimas3"].value,
  };

  // i. išvedame objektą konsolėje
  console.log("Formos duomenys:", formData);

  // ii. atvaizduojame tas pačias reikšmes formos apačioje
  resultsContainer.innerHTML = ""; // išvalom senesnį tekstą

  const heading = document.createElement("h4");
  heading.textContent = "Jūsų įvesti duomenys:";
  resultsContainer.appendChild(heading);

  const list = document.createElement("div");

  const lines = [
    `Vardas: ${formData.vardas}`,
    `Pavardė: ${formData.pavarde}`,
    `El. paštas: ${formData.el_pastas}`,
    `Tel. numeris: ${formData.telefonas}`,
    `Adresas: ${formData.adresas || "-"}`,
  ];

  const avg =
    (Number(formData.klausimas1) +
      Number(formData.klausimas2) +
      Number(formData.klausimas3)) /
    3;

  const avgRounded = avg.toFixed(1);

  lines.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    list.appendChild(p);
  });

  resultsContainer.appendChild(list);

  // Vidurkio atvaizdavimas po rezultatais
  const avgElement = document.createElement("p");
  avgElement.style.fontWeight = "bold";
  avgElement.textContent = `${formData.vardas} ${formData.pavarde}: ${avgRounded}`;
  resultsContainer.appendChild(avgElement);

  // Sėkmės pranešimas
  showSuccessPopup();
});

});




// === MANO ŽAIDIMAS su localStorage + laikmačiu ===
document.addEventListener("DOMContentLoaded", function () {
    const difficultySelect = document.getElementById("sudetingumas");
    const board = document.getElementById("zaidimo-lenta");
    const movesSpan = document.getElementById("ejimu-skaicius");
    const pairsSpan = document.getElementById("poru-skaicius");
    const startBtn = document.getElementById("startGame");
    const resetBtn = document.getElementById("resetGame");
    const winMessage = document.getElementById("winMessage");

    // laikmatis
    const timerSpan = document.getElementById("laikmatis");

    // geriausi rezultatai (HTML elementai)
    const bestEasySpan = document.getElementById("best-easy");
    const bestHardSpan = document.getElementById("best-hard");

    // 2. Duomenų rinkinys kortelėms (mažiausiai 6 unikalūs elementai)
    const symbols = ["🍎","🍌","🍇","🍒","🍉","🍓","🥝","🍍","🥑","🍑","🍋","🥥"];

    // Būsena
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let currentDifficulty = "easy";
    let gameStarted = false; // nauja: žaidimas aktyvus tik po Start

    // Laikmačio būsena
    let timerInterval = null;
    let secondsElapsed = 0;

    // --- localStorage raktai ---
    const BEST_EASY_KEY = "memoryBest_easy";
    const BEST_HARD_KEY = "memoryBest_hard";

    // ===== Laikmatis =====
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const mm = m.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");
        return `${mm}:${ss}`;
    }

    function updateTimerDisplay() {
        if (!timerSpan) return; // apsauga, jei HTML dar nėra
        timerSpan.textContent = formatTime(secondsElapsed);
    }

    function startTimer() {
        // visada paleidžiam nuo nulio naujam žaidimui
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        secondsElapsed = 0;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // ===== localStorage – geriausi rezultatai =====
    function loadBestScores() {
        const bestEasy = localStorage.getItem(BEST_EASY_KEY);
        const bestHard = localStorage.getItem(BEST_HARD_KEY);

        if (bestEasySpan) {
            bestEasySpan.textContent = bestEasy ? bestEasy + " ėjimai" : "-";
        }
        if (bestHardSpan) {
            bestHardSpan.textContent = bestHard ? bestHard + " ėjimai" : "-";
        }
    }

    function updateBestScoreIfNeeded() {
        // kviečiam tik kai žaidimas laimėtas
        const key = currentDifficulty === "easy" ? BEST_EASY_KEY : BEST_HARD_KEY;
        const bestSpan = currentDifficulty === "easy" ? bestEasySpan : bestHardSpan;

        const stored = localStorage.getItem(key);
        if (!stored || moves < parseInt(stored, 10)) {
            // dabartinis rezultatas geresnis -> atnaujinam
            localStorage.setItem(key, moves.toString());
            if (bestSpan) {
                bestSpan.textContent = moves + " ėjimai";
            }
        }
    }

    // 3. Sudėtingumo nustatymai (Lengvas 4×3, Sunkus 6×4)
    function getSettingsByDifficulty(value) {
        switch (value) {
            case "easy":
                // 4 × 3 = 12 kortelių = 6 porų
                return { pairs: 6, columns: 4 };
            case "hard":
                // 6 × 4 = 24 kortelės = 12 porų
                return { pairs: 12, columns: 6 };
            default:
                return { pairs: 6, columns: 4 };
        }
    }

    // Bendra funkcija žaidimui sukurti / atnaujinti
    function initGame() {
        currentDifficulty = difficultySelect.value;

        const settings = getSettingsByDifficulty(currentDifficulty);

        // pradinė būsena
        board.innerHTML = "";
        if (winMessage) winMessage.textContent = "";
        moves = 0;
        matchedPairs = 0;
        totalPairs = settings.pairs;
        movesSpan.textContent = "0";
        pairsSpan.textContent = "0";
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        gameStarted = false; // kol nepaspaustas Start – nežaidžiam

        // laikmatį išvalom, bet nepaleidžiam (paleis startNewGame)
        stopTimer();
        secondsElapsed = 0;
        updateTimerDisplay();

        // nustatom stulpelius
        board.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;

        // 2a, 2b – duomenų rinkinys ir poros:
        const chosenSymbols = symbols.slice(0, settings.pairs); // imame tiek, kiek reikia porų
        cards = [...chosenSymbols, ...chosenSymbols]            // po du kiekvieno
            .map((symbol, index) => ({
                id: index,
                symbol: symbol
            }))
            .sort(() => Math.random() - 0.5);                   // sumaišome korteles

        // Sukuriame korteles dinamiškai (2c)
        cards.forEach(cardData => {
            const cardEl = document.createElement("div");
            cardEl.classList.add("card");
            cardEl.dataset.id = cardData.id;
            cardEl.textContent = cardData.symbol;

            // 4. Kortelių apvertimo logika
            cardEl.addEventListener("click", () => handleCardClick(cardEl, cardData));

            board.appendChild(cardEl);
        });
    }

    // funkcija naujam žaidimui: lenta + laikmatis
    function startNewGame() {
        initGame();
        gameStarted = true; // dabar jau galima spausti korteles
        startTimer();       // laikmatis startuoja tik čia
    }

    // 4. Kortelės paspaudimas
    function handleCardClick(cardEl, cardData) {
        if (!gameStarted) return; // NELEIDŽIAM iki Start
        if (lockBoard) return; // neleidžiam spausti kai tikriname porą
        if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

        cardEl.classList.add("flipped"); // 4a – apsiverčia ir parodo turinį

        if (!firstCard) {
            firstCard = { el: cardEl, data: cardData };
            return;
        }

        if (!secondCard) {
            secondCard = { el: cardEl, data: cardData };
            lockBoard = true; // neleisti atversti daugiau nei 2 kortelių (4b)

            moves++; // 6a – didinam ėjimus
            movesSpan.textContent = moves.toString();

            checkForMatch();
        }
    }

    // 5. Kortelių sutapimo taisyklės
    function checkForMatch() {
        if (firstCard.data.symbol === secondCard.data.symbol) {
            // 5a – jei sutampa, paliekam atverstas ir neaktyvias
            firstCard.el.classList.add("matched");
            secondCard.el.classList.add("matched");

            matchedPairs++;                // 6b
            pairsSpan.textContent = matchedPairs.toString();

            resetSelectedCards();
            checkWin();
        } else {
            // 5b – jei nesutampa, po ~1s apverčiam atgal
            setTimeout(() => {
                firstCard.el.classList.remove("flipped");
                secondCard.el.classList.remove("flipped");
                resetSelectedCards();
            }, 1000);
        }
    }

    function resetSelectedCards() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    // 7. Laimėjimo pranešimas + localStorage + laikmatis stop
    function checkWin() {
        if (matchedPairs === totalPairs) {
            if (winMessage) {
                winMessage.textContent = "Laimėjote! 🎉";
            }
            stopTimer();             // laikmatis sustoja
            gameStarted = false;
            updateBestScoreIfNeeded(); // palyginam ir atnaujinam geriausią rezultatą
        }
    }

    // 8. Start – pradeda pasirinktą sudėtingumą ir paleidžia laikmatį
    startBtn.addEventListener("click", function (e) {
        e.preventDefault();   // jei kartais mygtukas formoje
        startNewGame();
    });

    // 9. Atnaujinti – naujas žaidimas ir naujas laikmatis
    resetBtn.addEventListener("click", function (e) {
        e.preventDefault();
        startNewGame();
    });

    // 3b. Pasikeitus sudėtingumui – lenta perkurta, statistika 0, laikmatis į 00:00
    // (čia žaidimą paruošiam, bet NEpradedam laikmačio; jis startuos paspaudus Start)
    difficultySelect.addEventListener("change", function () {
        initGame();
    });

    // 1a. Įkėlus puslapį – nuskaityti geriausius rezultatus ir atvaizduoti
    loadBestScores();

    // Pradiniam vaizdui paruošiam lentą, bet laikmatis kol kas nestartuoja
    initGame();
});
