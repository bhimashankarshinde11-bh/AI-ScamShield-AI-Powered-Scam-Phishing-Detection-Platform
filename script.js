function checkScam() {
    let input = document.getElementById("input");
    if (!input) input = document.getElementById("inputText");
    let text = input.value.toLowerCase();
    let score = 0;
    let reasons = [];

    if (text.includes("http") && (text.includes(".xyz") || text.includes(".tk") || text.includes("bit.ly"))) {
        score += 40; reasons.push("Suspicious link");
    }
    if (text.includes("kyc") || text.includes("account blocked") || text.includes("urgent")) {
        score += 35; reasons.push("KYC/Urgent fraud pattern");
    }
    if (text.includes("lottery") || text.includes("won") || text.includes("prize") || text.includes("upi")) {
        score += 25; reasons.push("Lottery/UPI scam");
    }
    if (text.includes("sbi") || text.includes("hdfc") || text.includes("icici")) {
        score += 20; reasons.push("Bank name used");
    }

    let resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    if (score >= 70) {
        resultDiv.className = "danger";
        resultDiv.innerHTML = "<h2>DANGER: " + score + "%</h2>" + reasons.join("<br>");
    } else if (score >= 30) {
        resultDiv.className = "warn";
        resultDiv.innerHTML = "<h2>SUSPICIOUS: " + score + "%</h2>" + reasons.join("<br>");
    } else {
        resultDiv.className = "safe";
        resultDiv.innerHTML = "<h2>SAFE: " + score + "%</h2>No scam found";
    }
}

function startVoice(lang) {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = lang || 'mr-IN';
    rec.onresult = (e) => {
        let input = document.getElementById("input") || document.getElementById("inputText");
        input.value = e.results[0][0].transcript;
        checkScam();
    };
    rec.start();
}