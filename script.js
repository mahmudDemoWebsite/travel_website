/* =========================================
   ELEMENTS
========================================= */

const body = document.body;

const themeBtn =
    document.getElementById("themeBtn");

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const destinationGrid =
    document.getElementById("destinationGrid");

const emptyState =
    document.getElementById("emptyState");

const bookingForm =
    document.getElementById("bookingForm");

const contactForm =
    document.getElementById("contactForm");

const toast =
    document.getElementById("toast");

const year =
    document.getElementById("year");


/* =========================================
   CURRENT YEAR
========================================= */

year.textContent =
    new Date().getFullYear();


/* =========================================
   THEME
========================================= */

const savedTheme =
    localStorage.getItem("wanderlustTheme");


if (savedTheme === "dark") {

    body.classList.add("dark");

    themeBtn.textContent = "☀️";

} else {

    themeBtn.textContent = "🌙";

}


themeBtn.addEventListener("click", () => {

    body.classList.toggle("dark");

    const isDark =
        body.classList.contains("dark");


    if (isDark) {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "wanderlustTheme",
            "dark"
        );

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "wanderlustTheme",
            "light"
        );

    }

});


/* =========================================
   MOBILE MENU
========================================= */

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});


navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

    });

});


/* =========================================
   FAVORITES
========================================= */

document
    .querySelectorAll(".favorite-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("active");


            if (button.classList.contains("active")) {

                button.textContent = "♥";

                showToast(
                    "❤️ Added to your favorites."
                );

            } else {

                button.textContent = "♡";

                showToast(
                    "Removed from favorites."
                );

            }

        });

    });


/* =========================================
   SEARCH DESTINATIONS
========================================= */

function filterDestinations() {

    const value =
        searchInput.value
        .trim()
        .toLowerCase();


    const cards =
        destinationGrid
        .querySelectorAll(".destination-card");


    let visibleCount = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();


        if (
            !value ||
            name.includes(value)
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCount === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    document
        .getElementById("destinations")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


searchBtn.addEventListener(
    "click",
    filterDestinations
);


searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        filterDestinations();

    }

});


/* =========================================
   DATE - DISABLE PAST DATES
========================================= */

const travelDate =
    document.getElementById("travelDate");

const today =
    new Date().toISOString().split("T")[0];

travelDate.min = today;


/* =========================================
   HERO SEARCH
========================================= */

searchBtn.addEventListener("click", () => {

    const destination =
        searchInput.value.trim();

    const travelers =
        document.getElementById(
            "travelers"
        ).value;

    if (!destination) {

        showToast(
            "📍 Please enter a destination."
        );

        return;

    }

    showToast(
        `Searching trips to ${destination} for ${travelers} traveler(s)...`
    );

});


/* =========================================
   BOOKING FORM
========================================= */

bookingForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const destination =
            document.getElementById("destination").value;

        const travelers =
            document.getElementById("bookingTravelers").value;


        showToast(
            `✅ Thanks ${name}! Your ${destination} booking request for ${travelers} traveler(s) has been received.`
        );


        bookingForm.reset();

        document.getElementById(
            "bookingTravelers"
        ).value = 2;

    }
);


/* =========================================
   CONTACT FORM
========================================= */

contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        showToast(
            "✅ Your message has been sent successfully!"
        );

        contactForm.reset();

    }
);


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3200);

}


/* =========================================
   NAVBAR SHADOW
========================================= */

window.addEventListener("scroll", () => {

    const navbar =
        document.getElementById("navbar");


    if (window.scrollY > 30) {

        navbar.style.boxShadow =
            "0 8px 25px rgba(0,0,0,0.08)";

    } else {

        navbar.style.boxShadow =
            "none";

    }

});


/* =========================================
   ACTIVE NAV LINK
========================================= */

const sections =
    document.querySelectorAll("section[id]");


const navAnchors =
    document.querySelectorAll(
        ".nav-links a"
    );


window.addEventListener("scroll", () => {

    const scrollPosition =
        window.scrollY + 150;


    sections.forEach(section => {

        const top =
            section.offsetTop;

        const height =
            section.offsetHeight;

        const id =
            section.getAttribute("id");


        if (
            scrollPosition >= top &&
            scrollPosition < top + height
        ) {

            navAnchors.forEach(anchor => {

                anchor.classList.remove(
                    "active"
                );


                if (
                    anchor.getAttribute("href") ===
                    `#${id}`
                ) {

                    anchor.classList.add(
                        "active"
                    );

                }

            });

        }

    });

});

/* =========================================
   HERO CAROUSEL
========================================= */

const heroSlides =
    document.querySelectorAll(".hero-slide");

const heroDots =
    document.querySelectorAll(".carousel-dot");

const prevButton =
    document.getElementById("carouselPrev");

const nextButton =
    document.getElementById("carouselNext");


let currentSlide = 0;

let carouselTimer;


/* =========================================
   SHOW SLIDE
========================================= */

function showSlide(index) {

    if (index >= heroSlides.length) {

        currentSlide = 0;

    }

    else if (index < 0) {

        currentSlide =
            heroSlides.length - 1;

    }

    else {

        currentSlide = index;

    }


    heroSlides.forEach((slide, i) => {

        slide.classList.toggle(
            "active",
            i === currentSlide
        );

    });


    heroDots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });

}


/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide() {

    showSlide(currentSlide + 1);

    resetCarousel();

}


/* =========================================
   PREVIOUS SLIDE
========================================= */

function previousSlide() {

    showSlide(currentSlide - 1);

    resetCarousel();

}


/* =========================================
   BUTTON EVENTS
========================================= */

nextButton.addEventListener(
    "click",
    nextSlide
);


prevButton.addEventListener(
    "click",
    previousSlide
);


/* =========================================
   DOT EVENTS
========================================= */

heroDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        resetCarousel();

    });

});


/* =========================================
   AUTO PLAY
========================================= */

function startCarousel() {

    carouselTimer =
        setInterval(() => {

            showSlide(currentSlide + 1);

        }, 5000);

}


function resetCarousel() {

    clearInterval(carouselTimer);

    startCarousel();

}


/* =========================================
   PAUSE ON HOVER
========================================= */

const heroSection =
    document.querySelector(".hero");


heroSection.addEventListener(
    "mouseenter",
    () => {

        clearInterval(carouselTimer);

    }
);


heroSection.addEventListener(
    "mouseleave",
    () => {

        startCarousel();

    }
);


/* =========================================
   START
========================================= */

showSlide(0);

startCarousel();