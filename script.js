let currentPrize = ""; // Global prize tracker

let theWheel = new Winwheel({
    canvasId: 'wheelCanvas',
    numSegments: 8,
    segments: [
        { fillStyle: '#eae56f', text: 'Free Coffee' },
        { fillStyle: '#89f26e', text: 'Snack Voucher' },
        { fillStyle: '#7de6ef', text: 'Room Upgrade' },
        { fillStyle: '#e7706f', text: 'Late Checkout' },
        { fillStyle: '#eae56f', text: '5% Off Next Stay' },
        { fillStyle: '#89f26e', text: 'Free Drink' },
        { fillStyle: '#7de6ef', text: 'Mystery Prize' },
        { fillStyle: '#e7706f', text: 'No Prize 😢' }
    ],
    animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 8,
        callbackFinished: alertPrize
    }
});

let spinSound = document.getElementById("spinSound");
let winSound = document.getElementById("winSound");

function alertPrize(indicatedSegment) {
    currentPrize = indicatedSegment.text;
    document.getElementById("resultText").innerText = "You won: " + currentPrize + "!";

    // Sounds + Confetti
    spinSound.pause();
    spinSound.currentTime = 0;
    winSound.currentTime = 0;
    winSound.play();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    // Show modal for user to claim
    document.getElementById("claimModal").style.display = "block";
}

function generatePrizeCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

document.getElementById("spinButton").addEventListener("click", function () {
    spinSound.currentTime = 0;
    spinSound.play();
    theWheel.startAnimation();
});

function submitClaim() {
    const name = document.getElementById("guestName").value.trim();
    const contact = document.getElementById("guestContact").value.trim();

    if (!contact) {
        alert("Please enter your email or phone number.");
        return;
    }

    document.getElementById("claimModal").style.display = "none";

    console.log("Submitting to Google Sheets...", name, contact, currentPrize);

    fetch("https://script.google.com/macros/s/AKfycbxmIja2qOkb3rpxJ5Gn9Y2MOTFUnadWK1g7md0FTgy3qdfPqz9LWZd5W7Zk8wjUq2QkZg/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name || "Anonymous",
            contact: contact,
            prize: currentPrize,
            code: generatePrizeCode()
        })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Server response:", data);
        alert("Prize claimed successfully!");
    })
    .catch(err => {
        console.error("Submission error:", err);
        alert("There was a problem submitting your prize claim.");
    });
}
fetch("https://script.google.com/macros/s/AKfycbxmIja2qOkb3rpxJ5Gn9Y2MOTFUnadWK1g7md0FTgy3qdfPqz9LWZd5W7Zk8wjUq2QkZg/exec", {
    method: "POST",
    mode: "cors",  // <-- CORS mode
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: name || "Anonymous",
        contact: contact,
        prize: currentPrize,
        code: generatePrizeCode()
    })
})

