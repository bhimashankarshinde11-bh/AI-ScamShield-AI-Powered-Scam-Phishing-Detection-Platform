function checkScam() {
    let text = document.getElementById("inputText").value.toLowerCase();
    let score = 0; let reasons = [];
    if (text.includes("http") && (text.includes(".xyz") || text.includes(".tk") || text.includes("bit.ly"))) { score += 40; reasons.push("Suspicious short/scam domain"); }
    if (text.includes("kyc") || text.includes("account blocked") || text.includes("urgent") || text.includes("verify now")) { score += 30; reasons.push("Urgent KYC/Block language - common scam"); }
    if (text.includes("lottery") || text.includes("won") || text.includes("prize") || text.includes("upi")) { score += 25; reasons.push("Lottery/UPI fraud keyword detected"); }
    if (text.includes("sbi") || text.includes("hdfc") || text.includes("icici") && text.includes("http")) { score += 30; reasons.push("Bank name with fake link"); }
    displayResult(score, reasons);
}

function displayResult(score, reasons) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    if (score >= 70) { resultDiv.className = "danger"; resultDiv.innerHTML = `<h2>DANGER: ${score}% Risk</h2><p>${reasons.join("<br>")}</p><p>Do NOT click or pay!</p>` }
    else if (score >= 30) { resultDiv.className = "warn"; resultDiv.innerHTML = `<h2>WARNING: ${score}% Risk</h2><p>${reasons.join("<br>")}</p><p>Be careful, verify with bank.</p>` }
    else { resultDiv.className = "safe"; resultDiv.innerHTML = `<h2>SAFE: ${score}% Risk</h2><p>No scam pattern found.</p>` }
}

function startVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser.");
        return;
    }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = document.getElementById("langSelect").value;
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("inputText").value = transcript;
        checkScam();
    };
    recognition.start();
}

document.getElementById('qrInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('qrCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                const qrText = code.data.toLowerCase();
                let score = 0; let reasons = [];
                reasons.push("QR Code content detected.");
                
                if (qrText.includes("upi://pay") || qrText.includes("upi://collect")) {
                    if (qrText.includes("collect") || qrText.includes("request")) {
                        score += 50; reasons.push("Suspicious UPI Request (Collect) format");
                    }
                    if (/@okaxis/.test(qrText) && !qrText.includes("name=")) {
                        score += 30; reasons.push("Suspicious @okaxis without clear merchant name");
                    }
                    if (/\d{8,}/.test(qrText)) {
                        score += 20; reasons.push("Contains random long numbers often used in scam UPIs");
                    }
                    if (score === 0) {
                        reasons.push("Standard UPI payment link.");
                    }
                } else if (qrText.includes("http")) {
                    document.getElementById("inputText").value = qrText;
                    checkScam();
                    return;
                } else {
                    reasons.push("Text: " + qrText);
                }
                displayResult(score, reasons);
            } else {
                alert("No QR code found in image.");
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});