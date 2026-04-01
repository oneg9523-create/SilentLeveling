// SIMPLE SCROLL ANIMATION
window.addEventListener("scroll", () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (cardTop < screenHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});

function showLanding() {
    location.href = "index.html";
}

function showFeatures() {
    location.href = "index.html";
}

function showSignIn() {
    location.href = "signin.html";
}

function showSignUp() {
    location.href = "signup.html";
}

function Start() {
    location.href = "signup.html";
}