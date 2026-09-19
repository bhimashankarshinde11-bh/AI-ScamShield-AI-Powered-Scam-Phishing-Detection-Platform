function checkScam() {
    let text = document.getElementById("input").value.toLowerCase();
    let score = 0; let reasons = [];
    if (text.includes("http") && (text.includes(".xyz") || text.includes(".tk") || text.includes("bit.ly"))) { score += 40; reasons.push("Suspicious short/scam domain"); }
    if (text.includes("kyc") || text.includes("account blocked") || text.includes("urgent") || text.includes("verify now")) { score += 30; reasons.push("Urgent KYC/Block language - common scam"); }
    if (text.includes("lottery") || text.includes("won") || text.includes("prize") || text.includes("upi")) { score += 25; reasons.push("Lottery/UPI fraud keyword detected"); }
    if (text.includes("sbi") || text.includes("hdfc") || text.includes("icici") && text.includes("http")) { score += 30; reasons.push("Bank name with fake link"); }
    if (score >= 70) { document.getElementById("result").className = "danger"; document.getElementById("result").innerHTML = `<h2>DANGER: ${score}% Risk</h2><p>${reasons.join("<br>")}</p><p>Do NOT click or pay!</p>` }
    else if (score >= 30) { document.getElementById("result").className = "warn"; document.getElementById("result").innerHTML = `<h2>WARNING: ${score}% Risk</h2><p>${reasons.join("<br>")}</p><p>Be careful, verify with bank.</p>` }
    else { document.getElementById("result").className = "safe"; document.getElementById("result").innerHTML = `<h2>SAFE: ${score}% Risk</h2><p>No scam pattern found.</p>` }
}