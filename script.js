/* =========================================================
   WANDERLUST TRAVEL WEBSITE
   COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE = {
    USERS: "wanderlust_users",
    SESSION: "wanderlust_session",
    BOOKINGS: "wanderlust_bookings",
    FAVORITES: "wanderlust_favorites",
    THEME: "wanderlust_theme",
    PENDING: "wanderlust_pending_action"
};


/* =========================================================
   GLOBAL STATE
========================================================= */

let pendingAction = null;

let destinationState = {
    all: [],
    filtered: [],
    currentPage: 1,
    perPage: 6
};

let currentSlide = 0;
let carouselTimer = null;


/* =========================================================
   REVIEW CAROUSEL STATE
========================================================= */

const reviewState = {
    reviews: [],
    currentPage: 0,
    visible: 3,
    timer: null
};


/* =========================================================
   DOM REFERENCES
========================================================= */

const root = document.documentElement;

const siteHeader =
    document.getElementById("siteHeader");

const navMenu =
    document.getElementById("navMenu");

const menuToggle =
    document.getElementById("menuToggle");

const themeToggle =
    document.getElementById("themeToggle");

const userNav =
    document.getElementById("userNav");

const landingPage =
    document.getElementById("landingPage");

const dashboardPage =
    document.getElementById("dashboard");

const adminPage =
    document.getElementById("admin");

const authModal =
    document.getElementById("authModal");

const closeAuthModal =
    document.getElementById("closeAuthModal");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const bookingForm =
    document.getElementById("bookingForm");

const contactForm =
    document.getElementById("contactForm");

const newsletterForm =
    document.getElementById("newsletterForm");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const backToTop =
    document.getElementById("backToTop");


/* =========================================================
   STORAGE HELPERS
========================================================= */

function readStorage(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Storage read error:",
            key,
            error
        );

        return fallback;
    }
}


function writeStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Storage write error:",
            key,
            error
        );

        return false;
    }
}


/* =========================================================
   USERS
========================================================= */

function getUsers() {

    const users =
        readStorage(
            STORAGE.USERS,
            []
        );

    return Array.isArray(users)
        ? users
        : [];
}


function saveUsers(users) {

    writeStorage(
        STORAGE.USERS,
        users
    );
}


/* =========================================================
   BOOKINGS
========================================================= */

function getBookings() {

    const bookings =
        readStorage(
            STORAGE.BOOKINGS,
            []
        );

    return Array.isArray(bookings)
        ? bookings
        : [];
}


function saveBookings(bookings) {

    writeStorage(
        STORAGE.BOOKINGS,
        bookings
    );
}


/* =========================================================
   SESSION
========================================================= */

function getSession() {

    return readStorage(
        STORAGE.SESSION,
        null
    );
}


function saveSession(session) {

    writeStorage(
        STORAGE.SESSION,
        session
    );
}


function clearSession() {

    localStorage.removeItem(
        STORAGE.SESSION
    );
}


/* =========================================================
   PENDING ACTION
========================================================= */

function setPendingAction(action) {

    pendingAction =
        action || null;

    if (pendingAction) {

        writeStorage(
            STORAGE.PENDING,
            pendingAction
        );

    } else {

        localStorage.removeItem(
            STORAGE.PENDING
        );
    }
}


function loadPendingAction() {

    if (pendingAction) {
        return pendingAction;
    }

    pendingAction =
        readStorage(
            STORAGE.PENDING,
            null
        );

    return pendingAction;
}


function clearPendingAction() {

    pendingAction = null;

    localStorage.removeItem(
        STORAGE.PENDING
    );
}


/* =========================================================
   DEMO ADMIN
========================================================= */

function ensureDemoAdmin() {

    const users =
        getUsers();

    const adminEmail =
        "admin@wanderlust.com";


    let admin =
        users.find(
            user =>
                String(
                    user.email || ""
                )
                .toLowerCase()
                === adminEmail
        );


    if (!admin) {

        users.push({

            id: "admin-demo",

            name: "Wanderlust Admin",

            email: adminEmail,

            phone: "+8801000000000",

            password: "Admin123",

            role: "admin",

            createdAt:
                new Date().toISOString()

        });


        saveUsers(users);

        return;
    }


    let changed =
        false;


    if (admin.role !== "admin") {

        admin.role =
            "admin";

        changed = true;
    }


    if (!admin.name) {

        admin.name =
            "Wanderlust Admin";

        changed = true;
    }


    if (!admin.phone) {

        admin.phone =
            "+8801000000000";

        changed = true;
    }


    if (!admin.password) {

        admin.password =
            "Admin123";

        changed = true;
    }


    if (changed) {

        saveUsers(users);
    }
}


/* =========================================================
   USER ROLE
========================================================= */

function normalizeUser(user) {

    if (!user) {
        return null;
    }

    return {

        ...user,

        role:
            user.role === "admin"
                ? "admin"
                : "user"

    };
}


/* =========================================================
   ROUTING
========================================================= */

function goTo(route) {

    if (!route) {

        route =
            "#home";
    }


    if (
        !route.startsWith("#")
    ) {

        route =
            "#" + route;
    }


    if (
        window.location.hash === route
    ) {

        renderRoute();

    } else {

        window.location.hash =
            route;
    }


    navMenu?.classList.remove(
        "open"
    );


    menuToggle?.setAttribute(
        "aria-expanded",
        "false"
    );
}


function showLanding() {

    landingPage?.classList.remove(
        "hidden"
    );

    dashboardPage?.classList.add(
        "hidden"
    );

    adminPage?.classList.add(
        "hidden"
    );
}


function showDashboard() {

    landingPage?.classList.add(
        "hidden"
    );

    dashboardPage?.classList.remove(
        "hidden"
    );

    adminPage?.classList.add(
        "hidden"
    );


    renderUserDashboard();
}


function showAdminDashboard() {

    landingPage?.classList.add(
        "hidden"
    );

    dashboardPage?.classList.add(
        "hidden"
    );

    adminPage?.classList.remove(
        "hidden"
    );


    renderAdminDashboard();
}


function renderRoute() {

    const route =
        window.location.hash
        || "#home";


    /* -------------------------------------
       USER DASHBOARD
    ------------------------------------- */

    if (
        route === "#dashboard"
    ) {

        const session =
            getSession();


        if (!session) {

            setPendingAction({
                type: "dashboard"
            });


            window.history.replaceState(
                {},
                "",
                "#home"
            );


            showLanding();

            openLogin();

            return;
        }


        if (
            session.role === "admin"
        ) {

            goTo("#admin");

            return;
        }


        showDashboard();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        return;
    }


    /* -------------------------------------
       ADMIN DASHBOARD
    ------------------------------------- */

    if (
        route === "#admin"
    ) {

        const session =
            getSession();


        if (!session) {

            setPendingAction({
                type: "admin"
            });


            window.history.replaceState(
                {},
                "",
                "#home"
            );


            showLanding();

            openLogin();

            return;
        }


        if (
            session.role !== "admin"
        ) {

            showToast(
                "⛔ Admin access required."
            );


            goTo("#dashboard");

            return;
        }


        showAdminDashboard();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        return;
    }


    /* -------------------------------------
       NORMAL LANDING
    ------------------------------------- */

    showLanding();


    const target =
        route.replace(
            "#",
            ""
        );


    if (
        target &&
        target !== "home"
    ) {

        setTimeout(
            () => {

                const section =
                    document.getElementById(
                        target
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            },
            80
        );

    } else {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    updateNavActive(
        target || "home"
    );
}


/* =========================================================
   ACTIVE NAV
========================================================= */

function updateNavActive(
    current
) {

    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link => {

                const route =
                    link.dataset.route;


                link.classList.toggle(
                    "active",
                    route === current
                );

            }
        );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    message
) {

    if (
        !toast ||
        !toastMessage
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   AUTH MODAL
========================================================= */

function openAuthModal() {

    authModal?.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function closeAuthModalBox() {

    authModal?.classList.add(
        "hidden"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


function setLoginMode() {

    const title =
        document.getElementById(
            "authModalTitle"
        );

    const subtitle =
        document.getElementById(
            "authModalSubtitle"
        );


    loginForm?.classList.remove(
        "hidden"
    );


    registerForm?.classList.add(
        "hidden"
    );


    if (title) {

        title.textContent =
            "Welcome Back";
    }


    if (subtitle) {

        subtitle.textContent =
            "Login to continue your journey.";
    }
}


function setRegisterMode() {

    const title =
        document.getElementById(
            "authModalTitle"
        );

    const subtitle =
        document.getElementById(
            "authModalSubtitle"
        );


    loginForm?.classList.add(
        "hidden"
    );


    registerForm?.classList.remove(
        "hidden"
    );


    if (title) {

        title.textContent =
            "Create Your Account";
    }


    if (subtitle) {

        subtitle.textContent =
            "Register now and start planning your next trip.";
    }
}


function openLogin() {

    setLoginMode();

    openAuthModal();
}


function openRegister(
    prefillEmail = ""
) {

    setRegisterMode();

    openAuthModal();


    const input =
        document.getElementById(
            "registerEmail"
        );


    if (
        input &&
        prefillEmail
    ) {

        input.value =
            prefillEmail;
    }
}


/* =========================================================
   CONTINUE PENDING ACTION
========================================================= */

function continuePendingAction() {

    const action =
        loadPendingAction();


    clearPendingAction();


    if (!action) {

        goTo("#home");

        return;
    }


    if (
        action.type === "dashboard"
    ) {

        goTo("#dashboard");

        return;
    }


    if (
        action.type === "admin"
    ) {

        goTo("#admin");

        return;
    }


    if (
        action.type === "booking"
    ) {

        goTo("#booking");


        setTimeout(
            () => {

                selectBookingDestination(
                    action.destination
                );

            },
            250
        );


        return;
    }


    if (
        action.type === "favorite"
    ) {

        goTo("#destinations");


        setTimeout(
            () => {

                toggleFavorite(
                    action.destination
                );

            },
            250
        );


        return;
    }


    goTo("#home");
}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById(
                "loginEmail"
            )
            ?.value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            ?.value;


    if (
        !email ||
        !password
    ) {

        showToast(
            "⚠️ Please enter email and password."
        );

        return;
    }


    const users =
        getUsers();


    const user =
        users.find(
            item =>

                String(
                    item.email || ""
                )
                .toLowerCase()
                === email

                &&

                String(
                    item.password || ""
                )
                === password
        );


    if (!user) {

        const existingUser =
            users.find(
                item =>
                    String(
                        item.email || ""
                    )
                    .toLowerCase()
                    === email
            );


        if (!existingUser) {

            showToast(
                "ℹ️ Account not found. Please create an account."
            );


            openRegister(
                email
            );


            return;
        }


        showToast(
            "❌ Incorrect password."
        );


        return;
    }


    const normalizedUser =
        normalizeUser(
            user
        );


    const session = {

        id:
            normalizedUser.id,

        name:
            normalizedUser.name,

        email:
            normalizedUser.email,

        phone:
            normalizedUser.phone || "",

        role:
            normalizedUser.role

    };


    saveSession(
        session
    );


    updateUserUI();

    updateBookingFields();

    updateFavoriteButtons();

    closeAuthModalBox();


    loginForm?.reset();


    showToast(
        `✅ Welcome back, ${session.name}!`
    );


    const action =
        loadPendingAction();


    if (
        session.role === "admin"
    ) {

        if (
            action &&
            action.type === "admin"
        ) {

            continuePendingAction();

        } else {

            goTo("#admin");
        }


        return;
    }


    if (action) {

        continuePendingAction();

    } else {

        goTo("#home");
    }
}


/* =========================================================
   REGISTER
========================================================= */

function handleRegister(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "registerName"
            )
            ?.value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            ?.value
            .trim()
            .toLowerCase();


    const phone =
        document
            .getElementById(
                "registerPhone"
            )
            ?.value
            .trim();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            ?.value;


    const confirmPassword =
        document
            .getElementById(
                "registerConfirmPassword"
            )
            ?.value;


    if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
    ) {

        showToast(
            "⚠️ Please complete all required fields."
        );


        return;
    }


    if (
        password.length < 6
    ) {

        showToast(
            "⚠️ Password must be at least 6 characters."
        );


        return;
    }


    if (
        password !==
        confirmPassword
    ) {

        showToast(
            "❌ Passwords do not match."
        );


        return;
    }


    const users =
        getUsers();


    const existingUser =
        users.find(
            user =>
                String(
                    user.email || ""
                )
                .toLowerCase()
                === email
        );


    if (existingUser) {

        showToast(
            "⚠️ An account with this email already exists."
        );


        setLoginMode();


        const loginEmail =
            document.getElementById(
                "loginEmail"
            );


        if (loginEmail) {

            loginEmail.value =
                email;
        }


        return;
    }


    const newUser = {

        id:
            "user-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8),

        name,

        email,

        phone,

        password,

        role: "user",

        createdAt:
            new Date().toISOString()

    };


    users.push(
        newUser
    );


    saveUsers(
        users
    );


    const session = {

        id:
            newUser.id,

        name:
            newUser.name,

        email:
            newUser.email,

        phone:
            newUser.phone,

        role:
            "user"
    };


    saveSession(
        session
    );


    updateUserUI();

    updateBookingFields();

    updateFavoriteButtons();

    closeAuthModalBox();


    registerForm?.reset();


    showToast(
        `🎉 Account created successfully, ${name}!`
    );


    continuePendingAction();
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    clearSession();

    clearPendingAction();


    updateUserUI();

    updateBookingFields();

    updateFavoriteButtons();


    goTo("#home");


    showToast(
        "✅ You have been logged out successfully."
    );
}


/* =========================================================
   UPDATE USER NAV
========================================================= */

function updateUserUI() {

    if (!userNav) {
        return;
    }


    const session =
        getSession();


    if (!session) {

        userNav.innerHTML = `
            <button
                type="button"
                class="login-nav-btn"
                id="loginNavBtn"
            >
                <i class="fa-solid fa-user"></i>
                Login
            </button>
        `;


        document
            .getElementById(
                "loginNavBtn"
            )
            ?.addEventListener(
                "click",
                openLogin
            );


        return;
    }


    const initial =
        String(
            session.name || "U"
        )
        .charAt(0)
        .toUpperCase();


    const isAdmin =
        session.role === "admin";


    userNav.innerHTML = `
        <div class="profile-nav">

            <button
                type="button"
                class="profile-btn"
                aria-label="Open profile menu"
            >

                <span class="profile-avatar">
                    ${escapeHTML(initial)}
                </span>

                <span class="profile-name">
                    ${escapeHTML(
                        isAdmin
                            ? "Admin"
                            : session.name
                    )}
                </span>

                <span class="profile-chevron">
                    <i class="fa-solid fa-chevron-down"></i>
                </span>

            </button>


            <div class="profile-dropdown">

                ${
                    isAdmin
                        ? `
                            <a href="#admin">
                                <i class="fa-solid fa-gauge-high"></i>
                                Admin Dashboard
                            </a>
                        `
                        : `
                            <a href="#dashboard">
                                <i class="fa-solid fa-user"></i>
                                My Dashboard
                            </a>

                            <a href="#booking">
                                <i class="fa-solid fa-calendar-check"></i>
                                My Booking
                            </a>
                        `
                }


                <button
                    type="button"
                    class="logout-item"
                    id="logoutNavBtn"
                >
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>

            </div>

        </div>
    `;


    /* Mobile profile click */

    const profileNav =
        userNav.querySelector(
            ".profile-nav"
        );


    const profileBtn =
        userNav.querySelector(
            ".profile-btn"
        );


    if (
        profileNav &&
        profileBtn
    ) {

        profileBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                profileNav.classList.toggle(
                    "open"
                );
            }
        );
    }


    /* Logout */

    document
        .getElementById(
            "logoutNavBtn"
        )
        ?.addEventListener(
            "click",
            logout
        );
}


/* =========================================================
   CLOSE PROFILE MENU OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    event => {

        document
            .querySelectorAll(
                ".profile-nav.open"
            )
            .forEach(
                profile => {

                    if (
                        !profile.contains(
                            event.target
                        )
                    ) {

                        profile.classList.remove(
                            "open"
                        );
                    }
                }
            );
    }
);


/* =========================================================
   BOOKING FIELD AUTO FILL
========================================================= */

function updateBookingFields() {

    const session =
        getSession();


    const nameInput =
        document.getElementById(
            "bookingName"
        );


    const emailInput =
        document.getElementById(
            "bookingEmail"
        );


    const phoneInput =
        document.getElementById(
            "bookingPhone"
        );


    if (!session) {

        if (nameInput) {
            nameInput.value = "";
        }

        if (emailInput) {
            emailInput.value = "";
        }

        if (phoneInput) {
            phoneInput.value = "";
        }

        return;
    }


    if (nameInput) {

        nameInput.value =
            session.name || "";
    }


    if (emailInput) {

        emailInput.value =
            session.email || "";
    }


    if (phoneInput) {

        phoneInput.value =
            session.phone || "";
    }
}


/* =========================================================
   BOOKING SUBMIT
========================================================= */

function handleBookingSubmit(
    event
) {

    event.preventDefault();


    const session =
        getSession();


    if (!session) {

        setPendingAction({
            type: "booking"
        });


        openLogin();

        return;
    }


    if (
        session.role === "admin"
    ) {

        showToast(
            "ℹ️ Admin accounts manage bookings from the Admin Dashboard."
        );

        return;
    }


    const formData =
        new FormData(
            bookingForm
        );


    const booking = {

        id:
            "booking-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8),

        userId:
            session.id,

        name:
            String(
                formData.get(
                    "name"
                ) || ""
            ).trim(),

        email:
            String(
                formData.get(
                    "email"
                ) || ""
            ).trim(),

        phone:
            String(
                formData.get(
                    "phone"
                ) || ""
            ).trim(),

        destination:
            String(
                formData.get(
                    "destination"
                ) || ""
            ).trim(),

        date:
            String(
                formData.get(
                    "date"
                ) || ""
            ).trim(),

        travelers:
            String(
                formData.get(
                    "travelers"
                ) || ""
            ).trim(),

        message:
            String(
                formData.get(
                    "message"
                ) || ""
            ).trim(),

        status:
            "Pending",

        createdAt:
            new Date().toISOString()
    };


    if (
        !booking.destination ||
        !booking.date ||
        !booking.travelers
    ) {

        showToast(
            "⚠️ Please complete the booking form."
        );

        return;
    }


    const bookings =
        getBookings();


    bookings.unshift(
        booking
    );


    saveBookings(
        bookings
    );


    bookingForm.reset();


    updateBookingFields();

    renderUserDashboard();

    renderAdminDashboard();


    showToast(
        "🎉 Booking submitted successfully! Status: Pending."
    );


    setTimeout(
        () => {

            goTo("#dashboard");

        },
        400
    );
}


/* =========================================================
   BOOK DESTINATION
========================================================= */

function bookDestination(
    destination
) {

    const session =
        getSession();


    if (!session) {

        setPendingAction({

            type: "booking",

            destination

        });


        openLogin();

        return;
    }


    if (
        session.role === "admin"
    ) {

        showToast(
            "ℹ️ Admin cannot create a customer booking."
        );

        return;
    }


    goTo("#booking");


    setTimeout(
        () => {

            selectBookingDestination(
                destination
            );

        },
        250
    );
}


/* =========================================================
   SELECT BOOKING DESTINATION
========================================================= */

function selectBookingDestination(
    destination
) {

    const select =
        document.getElementById(
            "bookingDestination"
        );


    if (
        !select ||
        !destination
    ) {
        return;
    }


    const target =
        String(
            destination
        )
        .trim()
        .toLowerCase();


    let option =
        [
            ...select.options
        ].find(
            item =>

                item.value
                    .trim()
                    .toLowerCase()
                    === target

                ||

                item.text
                    .trim()
                    .toLowerCase()
                    === target
        );


    if (!option) {

        option =
            [
                ...select.options
            ].find(
                item =>

                    item.value
                        .trim()
                        .toLowerCase()
                        .includes(target)

                    ||

                    item.text
                        .trim()
                        .toLowerCase()
                        .includes(target)
            );
    }


    if (option) {

        select.value =
            option.value;

    } else {

        const newOption =
            document.createElement(
                "option"
            );


        newOption.value =
            destination;


        newOption.textContent =
            destination;


        select.appendChild(
            newOption
        );


        select.value =
            destination;
    }


    select.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );
}


/* =========================================================
   FAVORITES
========================================================= */

function getFavoritesStore() {

    const data =
        readStorage(
            STORAGE.FAVORITES,
            {}
        );


    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        return {};
    }


    return data;
}


function saveFavoritesStore(
    store
) {

    writeStorage(
        STORAGE.FAVORITES,
        store
    );
}


function getUserFavorites(
    email
) {

    if (!email) {
        return [];
    }


    const store =
        getFavoritesStore();


    return Array.isArray(
        store[email]
    )
        ? store[email]
        : [];
}


function isFavorite(
    destination
) {

    const session =
        getSession();


    if (!session) {
        return false;
    }


    return getUserFavorites(
        session.email
    ).includes(
        destination
    );
}


function toggleFavorite(
    destination
) {

    const session =
        getSession();


    if (!session) {

        setPendingAction({

            type: "favorite",

            destination

        });


        openLogin();

        return;
    }


    if (
        session.role === "admin"
    ) {

        showToast(
            "ℹ️ Admin accounts do not use customer favorites."
        );

        return;
    }


    const store =
        getFavoritesStore();


    if (
        !Array.isArray(
            store[session.email]
        )
    ) {

        store[session.email] =
            [];
    }


    const favorites =
        store[session.email];


    const index =
        favorites.indexOf(
            destination
        );


    if (index === -1) {

        favorites.push(
            destination
        );


        showToast(
            `❤️ ${destination} added to favorites.`
        );

    } else {

        favorites.splice(
            index,
            1
        );


        showToast(
            `♡ ${destination} removed from favorites.`
        );
    }


    saveFavoritesStore(
        store
    );


    updateFavoriteButtons();

    renderDestinations();

    renderUserDashboard();
}


function updateFavoriteButtons() {

    document
        .querySelectorAll(
            ".favorite-btn"
        )
        .forEach(
            button => {

                const name =
                    button.dataset.destination;


                const active =
                    isFavorite(
                        name
                    );


                button.classList.toggle(
                    "active",
                    active
                );


                button.textContent =
                    active
                        ? "♥"
                        : "♡";
            }
        );
}


/* =========================================================
   DESTINATIONS JSON
========================================================= */

async function loadDestinations() {

    const grid =
        document.getElementById(
            "destinationGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = `
        <div class="destination-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Loading destinations...
            </span>

        </div>
    `;


    try {

        const response =
            await fetch(
                "destinations.json"
            );


        if (!response.ok) {

            throw new Error(
                "destinations.json could not be loaded."
            );
        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Destination JSON format is invalid."
            );
        }


        destinationState.all =
            data;


        destinationState.filtered =
            [
                ...data
            ];


        destinationState.currentPage =
            1;


        renderDestinations();


    } catch (error) {

        console.error(
            "Destination loading error:",
            error
        );


        grid.innerHTML = `
            <div class="destination-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to load destinations
                </h3>

                <p>
                    Make sure
                    <strong>destinations.json</strong>
                    is in the same folder as index.html.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   CREATE DESTINATION CARD
========================================================= */

function createDestinationCard(
    destination
) {

    const favorite =
        isFavorite(
            destination.name
        );


    return `
        <article
            class="destination-card"
            data-name="${escapeHTML(
                destination.name
            )}"
        >

            <div class="card-image">

                <img
                    src="${escapeAttribute(
                        destination.image
                    )}"
                    alt="${escapeHTML(
                        destination.name
                    )}"
                    loading="lazy"
                >


                <button
                    type="button"
                    class="favorite-btn ${
                        favorite
                            ? "active"
                            : ""
                    }"
                    data-destination="${escapeAttribute(
                        destination.name
                    )}"
                    aria-label="Favorite ${
                        escapeAttribute(
                            destination.name
                        )
                    }"
                >
                    ${
                        favorite
                            ? "♥"
                            : "♡"
                    }
                </button>


                <span class="image-tag">
                    ${escapeHTML(
                        destination.tag ||
                        "Destination"
                    )}
                </span>

            </div>


            <div class="card-content">

                <div class="card-location">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHTML(
                        destination.location
                    )}
                </div>


                <h3>
                    ${escapeHTML(
                        destination.name
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        destination.description
                    )}
                </p>


                <div class="card-bottom">

                    <span class="price">

                        From

                        <strong>
                            ৳${Number(
                                destination.price || 0
                            ).toLocaleString(
                                "en-BD"
                            )}
                        </strong>

                    </span>


                    <button
                        type="button"
                        class="book-destination-btn"
                        data-destination="${escapeAttribute(
                            destination.name
                        )}"
                    >
                        Book →
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER DESTINATIONS
========================================================= */

function renderDestinations() {

    const grid =
        document.getElementById(
            "destinationGrid"
        );


    if (!grid) {
        return;
    }


    const start =
        (
            destinationState.currentPage -
            1
        )
        *
        destinationState.perPage;


    const end =
        start +
        destinationState.perPage;


    const pageItems =
        destinationState.filtered.slice(
            start,
            end
        );


    if (
        pageItems.length === 0
    ) {

        grid.innerHTML = `
            <div class="destination-empty">

                <i class="fa-solid fa-location-dot"></i>

                <h3>
                    No destinations found
                </h3>

                <p>
                    Try another destination name.
                </p>

            </div>
        `;


        renderDestinationPagination();

        return;
    }


    grid.innerHTML =
        pageItems
            .map(
                createDestinationCard
            )
            .join("");


    renderDestinationPagination();

    updateFavoriteButtons();
}


/* =========================================================
   DESTINATION PAGINATION
========================================================= */

function renderDestinationPagination() {

    const pagination =
        document.getElementById(
            "destinationPagination"
        );


    if (!pagination) {
        return;
    }


    const totalPages =
        Math.ceil(
            destinationState.filtered.length /
            destinationState.perPage
        );


    if (
        totalPages <= 1
    ) {

        pagination.innerHTML =
            "";

        return;
    }


    let html = "";


    html += `
        <button
            type="button"
            class="pagination-btn prev-btn"
            onclick="changeDestinationPage(${
                destinationState.currentPage -
                1
            })"
            ${
                destinationState.currentPage === 1
                    ? "disabled"
                    : ""
            }
        >
            ← Prev
        </button>
    `;


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `
            <button
                type="button"
                class="pagination-btn page-number ${
                    page ===
                    destinationState.currentPage
                        ? "active"
                        : ""
                }"
                onclick="changeDestinationPage(${page})"
            >
                ${page}
            </button>
        `;
    }


    html += `
        <button
            type="button"
            class="pagination-btn next-btn"
            onclick="changeDestinationPage(${
                destinationState.currentPage +
                1
            })"
            ${
                destinationState.currentPage ===
                totalPages
                    ? "disabled"
                    : ""
            }
        >
            Next →
        </button>
    `;


    pagination.innerHTML =
        html;
}


function changeDestinationPage(
    page
) {

    const totalPages =
        Math.ceil(
            destinationState.filtered.length /
            destinationState.perPage
        );


    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }


    destinationState.currentPage =
        page;


    renderDestinations();


    const section =
        document.getElementById(
            "destinations"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   DESTINATION SEARCH
========================================================= */

function filterDestinations(
    keyword
) {

    const query =
        String(
            keyword || ""
        )
        .trim()
        .toLowerCase();


    destinationState.filtered =
        destinationState.all.filter(
            destination => {

                const name =
                    String(
                        destination.name || ""
                    )
                    .toLowerCase();


                const location =
                    String(
                        destination.location || ""
                    )
                    .toLowerCase();


                const tag =
                    String(
                        destination.tag || ""
                    )
                    .toLowerCase();


                const description =
                    String(
                        destination.description || ""
                    )
                    .toLowerCase();


                return (
                    name.includes(query) ||
                    location.includes(query) ||
                    tag.includes(query) ||
                    description.includes(query)
                );
            }
        );


    destinationState.currentPage =
        1;


    renderDestinations();
}


function setupDestinationSearch() {

    const inputs = [

        document.getElementById(
            "destinationSearch"
        ),

        document.getElementById(
            "searchDestination"
        )

    ].filter(Boolean);


    inputs.forEach(
        input => {

            input.addEventListener(
                "input",
                event => {

                    const value =
                        event.target.value;


                    inputs.forEach(
                        other => {

                            if (
                                other !==
                                event.target
                            ) {

                                other.value =
                                    value;
                            }
                        }
                    );


                    filterDestinations(
                        value
                    );
                }
            );


            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();


                        goTo(
                            "#destinations"
                        );
                    }
                }
            );
        }
    );
}


/* =========================================================
   DESTINATION ACTIONS
========================================================= */

function setupDestinationActions() {

    const grid =
        document.getElementById(
            "destinationGrid"
        );


    if (!grid) {
        return;
    }


    grid.addEventListener(
        "click",
        event => {

            const favoriteButton =
                event.target.closest(
                    ".favorite-btn"
                );


            if (favoriteButton) {

                event.preventDefault();


                toggleFavorite(
                    favoriteButton.dataset
                        .destination
                );


                return;
            }


            const bookButton =
                event.target.closest(
                    ".book-destination-btn"
                );


            if (bookButton) {

                event.preventDefault();


                bookDestination(
                    bookButton.dataset
                        .destination
                );
            }
        }
    );
}


/* =========================================================
   PACKAGE ACTIONS
========================================================= */

function setupPackageActions() {

    document
        .querySelectorAll(
            ".package-book-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        bookDestination(
                            button.dataset
                                .destination
                        );
                    }
                );
            }
        );
}


/* =========================================================
   USER DASHBOARD
========================================================= */

function renderUserDashboard() {

    const session =
        getSession();


    if (
        !session ||
        session.role === "admin"
    ) {
        return;
    }


    const bookings =
        getBookings();


    const userBookings =
        bookings.filter(
            booking =>

                booking.userId ===
                    session.id

                ||

                (
                    booking.email &&
                    String(
                        booking.email
                    )
                    .toLowerCase()
                    ===
                    String(
                        session.email
                    )
                    .toLowerCase()
                )
        );


    const favorites =
        getUserFavorites(
            session.email
        );


    /* Name */

    const dashboardUserName =
        document.getElementById(
            "dashboardUserName"
        );


    if (dashboardUserName) {

        dashboardUserName.textContent =
            session.name;
    }


    /* Profile */

    const profileName =
        document.getElementById(
            "dashboardProfileName"
        );


    const profileEmail =
        document.getElementById(
            "dashboardProfileEmail"
        );


    const profilePhone =
        document.getElementById(
            "dashboardProfilePhone"
        );


    const avatar =
        document.getElementById(
            "dashboardAvatar"
        );


    if (profileName) {

        profileName.textContent =
            session.name;
    }


    if (profileEmail) {

        profileEmail.textContent =
            session.email;
    }


    if (profilePhone) {

        profilePhone.textContent =
            session.phone ||
            "Phone not added";
    }


    if (avatar) {

        avatar.textContent =
            String(
                session.name || "U"
            )
            .charAt(0)
            .toUpperCase();
    }


    /* Total bookings */

    const bookingCount =
        document.getElementById(
            "dashboardBookingCount"
        );


    if (bookingCount) {

        bookingCount.textContent =
            userBookings.length;
    }


    /* Favorites */

    const favoriteCount =
        document.getElementById(
            "dashboardFavoriteCount"
        );


    if (favoriteCount) {

        favoriteCount.textContent =
            favorites.length;
    }


    /* Pending */

    const pendingCount =
        userBookings.filter(
            booking =>
                normalizeStatus(
                    booking.status
                ).className ===
                "pending"
        ).length;


    const pendingElement =
        document.getElementById(
            "dashboardPendingCount"
        );


    if (pendingElement) {

        pendingElement.textContent =
            pendingCount;
    }


    /* Confirmed */

    const confirmedCount =
        userBookings.filter(
            booking =>
                normalizeStatus(
                    booking.status
                ).className ===
                "confirmed"
        ).length;


    const confirmedElement =
        document.getElementById(
            "dashboardConfirmedCount"
        );


    if (confirmedElement) {

        confirmedElement.textContent =
            confirmedCount;
    }


    renderDashboardBookings(
        userBookings
    );


    renderDashboardFavorites(
        favorites
    );
}


/* =========================================================
   DASHBOARD BOOKINGS
========================================================= */

function renderDashboardBookings(
    bookings
) {

    const container =
        document.getElementById(
            "dashboardBookingsList"
        );


    if (!container) {
        return;
    }


    if (
        !bookings.length
    ) {

        container.innerHTML = `
            <div class="destination-empty">

                <i class="fa-regular fa-calendar"></i>

                <h3>
                    No bookings yet
                </h3>

                <p>
                    Start planning your next adventure.
                </p>

            </div>
        `;


        return;
    }


    container.innerHTML =
        bookings
            .slice(0, 10)
            .map(
                booking => {

                    const status =
                        normalizeStatus(
                            booking.status
                        );


                    return `
                        <div
                            class="dashboard-booking-item"
                        >

                            <div>

                                <h4>
                                    ${escapeHTML(
                                        booking.destination ||
                                        "Travel"
                                    )}
                                </h4>

                                <p>
                                    Date:
                                    ${escapeHTML(
                                        formatDate(
                                            booking.date
                                        )
                                    )}
                                </p>

                                <p>
                                    Travelers:
                                    ${escapeHTML(
                                        booking.travelers
                                    )}
                                </p>

                            </div>


                            <span
                                class="booking-status ${status.className}"
                            >
                                ${escapeHTML(
                                    booking.status ||
                                    "Pending"
                                )}
                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   DASHBOARD FAVORITES
========================================================= */

function renderDashboardFavorites(
    favorites
) {

    const container =
        document.getElementById(
            "dashboardFavoritesList"
        );


    if (!container) {
        return;
    }


    if (
        !favorites.length
    ) {

        container.innerHTML = `
            <div class="destination-empty">

                <i class="fa-regular fa-heart"></i>

                <h3>
                    No favorite destinations
                </h3>

                <p>
                    Save destinations you would like to visit.
                </p>

            </div>
        `;


        return;
    }


    const favoriteDestinations =
        favorites
            .map(
                name =>
                    destinationState.all.find(
                        destination =>
                            String(
                                destination.name
                            )
                            .toLowerCase()
                            ===
                            String(name)
                                .toLowerCase()
                    )
            )
            .filter(Boolean);


    if (
        !favoriteDestinations.length
    ) {

        container.innerHTML = `
            <div class="destination-empty">

                <i class="fa-regular fa-heart"></i>

                <h3>
                    No saved destinations found
                </h3>

            </div>
        `;


        return;
    }


    container.innerHTML =
        favoriteDestinations
            .map(
                destination => `
                    <div
                        class="dashboard-favorite-item"
                    >

                        <img
                            src="${escapeAttribute(
                                destination.image
                            )}"
                            alt="${escapeHTML(
                                destination.name
                            )}"
                            loading="lazy"
                        >

                        <div
                            class="dashboard-favorite-overlay"
                        >

                            <strong>
                                ${escapeHTML(
                                    destination.name
                                )}
                            </strong>

                        </div>

                    </div>
                `
            )
            .join("");
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function renderAdminDashboard() {

    const session =
        getSession();


    if (
        !session ||
        session.role !== "admin"
    ) {
        return;
    }


    const users =
        getUsers();


    const bookings =
        getBookings();


    /* Total users */

    const totalUsers =
        document.getElementById(
            "adminTotalUsers"
        );


    if (totalUsers) {

        totalUsers.textContent =
            users.filter(
                user =>
                    user.role !== "admin"
            ).length;
    }


    /* Total bookings */

    const totalBookings =
        document.getElementById(
            "adminTotalBookings"
        );


    if (totalBookings) {

        totalBookings.textContent =
            bookings.length;
    }


    /* Pending */

    const pendingBookings =
        document.getElementById(
            "adminPendingBookings"
        );


    if (pendingBookings) {

        pendingBookings.textContent =
            bookings.filter(
                booking =>
                    normalizeStatus(
                        booking.status
                    ).className ===
                    "pending"
            ).length;
    }


    /* Confirmed */

    const confirmedBookings =
        document.getElementById(
            "adminConfirmedBookings"
        );


    if (confirmedBookings) {

        confirmedBookings.textContent =
            bookings.filter(
                booking =>
                    normalizeStatus(
                        booking.status
                    ).className ===
                    "confirmed"
            ).length;
    }


    renderAdminBookings(
        bookings
    );


    renderAdminUsers(
        users
    );
}


/* =========================================================
   ADMIN BOOKINGS
========================================================= */

function renderAdminBookings(
    bookings
) {

    const table =
        document.getElementById(
            "adminBookingsTable"
        );


    if (!table) {
        return;
    }


    if (
        !bookings.length
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:35px;"
                >
                    No bookings found.
                </td>

            </tr>
        `;


        return;
    }


    table.innerHTML =
        bookings
            .map(
                booking => {

                    const status =
                        normalizeStatus(
                            booking.status
                        );


                    return `
                        <tr>

                            <td>

                                <strong>
                                    ${escapeHTML(
                                        booking.name ||
                                        "Customer"
                                    )}
                                </strong>

                                <br>

                                <small>
                                    ${escapeHTML(
                                        booking.email ||
                                        ""
                                    )}
                                </small>

                            </td>


                            <td>
                                ${escapeHTML(
                                    booking.destination ||
                                    "-"
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    formatDate(
                                        booking.date
                                    )
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    booking.travelers ||
                                    "-"
                                )}
                            </td>


                            <td>

                                <span
                                    class="booking-status ${status.className}"
                                >
                                    ${escapeHTML(
                                        booking.status ||
                                        "Pending"
                                    )}
                                </span>

                            </td>


                            <td>

                                <select
                                    class="admin-status-select"
                                    onchange="updateBookingStatus('${escapeAttribute(
                                        booking.id
                                    )}', this.value)"
                                >

                                    <option
                                        value="Pending"
                                        ${
                                            booking.status ===
                                            "Pending"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Pending
                                    </option>

                                    <option
                                        value="Confirmed"
                                        ${
                                            booking.status ===
                                            "Confirmed"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Confirmed
                                    </option>

                                    <option
                                        value="Cancelled"
                                        ${
                                            booking.status ===
                                            "Cancelled"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Cancelled
                                    </option>

                                </select>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

function updateBookingStatus(
    bookingId,
    newStatus
) {

    const session =
        getSession();


    if (
        !session ||
        session.role !== "admin"
    ) {

        showToast(
            "⛔ Admin access required."
        );


        return;
    }


    const bookings =
        getBookings();


    const booking =
        bookings.find(
            item =>
                String(
                    item.id
                )
                ===
                String(
                    bookingId
                )
        );


    if (!booking) {

        showToast(
            "❌ Booking not found."
        );


        return;
    }


    booking.status =
        newStatus;


    booking.updatedAt =
        new Date().toISOString();


    saveBookings(
        bookings
    );


    renderAdminDashboard();


    showToast(
        `✅ Booking status changed to ${newStatus}.`
    );
}


/* =========================================================
   ADMIN USERS
========================================================= */

function renderAdminUsers(
    users
) {

    const table =
        document.getElementById(
            "adminUsersTable"
        );


    if (!table) {
        return;
    }


    if (
        !users.length
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="4"
                    style="text-align:center;padding:35px;"
                >
                    No users found.
                </td>

            </tr>
        `;


        return;
    }


    table.innerHTML =
        users
            .map(
                user => {

                    const isAdmin =
                        user.role ===
                        "admin";


                    return `
                        <tr>

                            <td>
                                ${escapeHTML(
                                    user.name ||
                                    "-"
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    user.email ||
                                    "-"
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    user.phone ||
                                    "-"
                                )}
                            </td>


                            <td>

                                <span
                                    class="admin-role ${
                                        isAdmin
                                            ? "admin"
                                            : ""
                                    }"
                                >
                                    ${
                                        isAdmin
                                            ? "Admin"
                                            : "User"
                                    }
                                </span>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   STATUS HELPER
========================================================= */

function normalizeStatus(
    status
) {

    const value =
        String(
            status ||
            "Pending"
        )
        .trim()
        .toLowerCase();


    if (
        value ===
        "confirmed"
    ) {

        return {

            className:
                "confirmed",

            label:
                "Confirmed"

        };
    }


    if (
        value === "cancelled" ||
        value === "canceled"
    ) {

        return {

            className:
                "cancelled",

            label:
                "Cancelled"

        };
    }


    return {

        className:
            "pending",

        label:
            "Pending"

    };
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const hasOnlyDate =
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                String(value)
            );


    const date =
        new Date(
            hasOnlyDate
                ? `${value}T00:00:00`
                : value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    return date.toLocaleDateString(
        "en-BD",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   THEME
========================================================= */

function applyTheme(
    theme
) {

    const finalTheme =
        theme === "dark"
            ? "dark"
            : "light";


    root.dataset.theme =
        finalTheme;


    localStorage.setItem(
        STORAGE.THEME,
        finalTheme
    );


    updateThemeIcon();
}


function updateThemeIcon() {

    if (!themeToggle) {
        return;
    }


    const isDark =
        root.dataset.theme ===
        "dark";


    themeToggle.innerHTML =
        isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';


    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
    );
}


function setupTheme() {

    const savedTheme =
        localStorage.getItem(
            STORAGE.THEME
        );


    applyTheme(
        savedTheme || "light"
    );


    themeToggle?.addEventListener(
        "click",
        () => {

            applyTheme(
                root.dataset.theme ===
                    "dark"
                    ? "light"
                    : "dark"
            );
        }
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    menuToggle?.addEventListener(
        "click",
        () => {

            const isOpen =
                navMenu?.classList.toggle(
                    "open"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );
        }
    );


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        navMenu?.classList.remove(
                            "open"
                        );


                        menuToggle?.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   SCROLL EVENTS
========================================================= */

function setupScrollEvents() {

    window.addEventListener(
        "scroll",
        () => {

            const y =
                window.scrollY;


            siteHeader?.classList.toggle(
                "scrolled",
                y > 15
            );


            backToTop?.classList.toggle(
                "show",
                y > 600
            );


            updateActiveSection();
        },
        {
            passive: true
        }
    );
}


/* =========================================================
   ACTIVE SECTION
========================================================= */

function updateActiveSection() {

    if (
        !landingPage ||
        landingPage.classList.contains(
            "hidden"
        )
    ) {

        return;
    }


    const sections =
        [
            ...document.querySelectorAll(
                "#landingPage section[id]"
            )
        ];


    let current =
        "home";


    for (
        const section
        of sections
    ) {

        const rect =
            section.getBoundingClientRect();


        if (
            rect.top <= 130 &&
            rect.bottom >= 130
        ) {

            current =
                section.id;

            break;
        }
    }


    updateNavActive(
        current
    );
}


/* =========================================================
   BACK TO TOP
========================================================= */

function setupBackToTop() {

    backToTop?.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* =========================================================
   HERO CAROUSEL
========================================================= */

function setupCarousel() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    const dots =
        document.querySelectorAll(
            ".carousel-dot"
        );


    const previous =
        document.getElementById(
            "carouselPrev"
        );


    const next =
        document.getElementById(
            "carouselNext"
        );


    const carousel =
        document.getElementById(
            "heroCarousel"
        );


    if (
        !slides.length
    ) {
        return;
    }


    function showSlide(
        index
    ) {

        currentSlide =
            (
                index +
                slides.length
            )
            %
            slides.length;


        slides.forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );
            }
        );


        dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentSlide
                );
            }
        );
    }


    function goNext() {

        showSlide(
            currentSlide + 1
        );
    }


    function goPrevious() {

        showSlide(
            currentSlide - 1
        );
    }


    function start() {

        clearInterval(
            carouselTimer
        );


        carouselTimer =
            setInterval(
                goNext,
                5000
            );
    }


    function stop() {

        clearInterval(
            carouselTimer
        );
    }


    previous?.addEventListener(
        "click",
        () => {

            goPrevious();

            start();
        }
    );


    next?.addEventListener(
        "click",
        () => {

            goNext();

            start();
        }
    );


    dots.forEach(
        dot => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(
                        Number(
                            dot.dataset.slide
                        )
                    );


                    start();
                }
            );
        }
    );


    carousel?.addEventListener(
        "mouseenter",
        stop
    );


    carousel?.addEventListener(
        "mouseleave",
        start
    );


    showSlide(
        0
    );


    start();
}


/* =========================================================
   CONTACT FORM
========================================================= */

function setupContactForm() {

    contactForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            showToast(
                "✅ Thank you! Your message has been received."
            );


            contactForm.reset();
        }
    );
}


/* =========================================================
   NEWSLETTER
========================================================= */

function setupNewsletter() {

    newsletterForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            showToast(
                "🎉 Thanks for subscribing to Wanderlust!"
            );


            newsletterForm.reset();
        }
    );
}


/* =========================================================
   AUTH EVENTS
========================================================= */

function setupAuthEvents() {

    showRegisterBtn?.addEventListener(
        "click",
        () => {

            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    ?.value
                    .trim();


            openRegister(
                email || ""
            );
        }
    );


    showLoginBtn?.addEventListener(
        "click",
        setLoginMode
    );


    closeAuthModal?.addEventListener(
        "click",
        closeAuthModalBox
    );


    authModal?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                authModal
            ) {

                closeAuthModalBox();
            }
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeAuthModalBox();
            }
        }
    );


    loginForm?.addEventListener(
        "submit",
        handleLogin
    );


    registerForm?.addEventListener(
        "submit",
        handleRegister
    );
}


/* =========================================================
   BOOKING EVENTS
========================================================= */

function setupBooking() {

    bookingForm?.addEventListener(
        "submit",
        handleBookingSubmit
    );


    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    if (dateInput) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        dateInput.min =
            today;
    }
}


/* =========================================================
   DASHBOARD EVENTS
========================================================= */

function setupDashboardActions() {

    document
        .getElementById(
            "dashboardLogoutBtn"
        )
        ?.addEventListener(
            "click",
            logout
        );


    document
        .getElementById(
            "adminLogoutBtn"
        )
        ?.addEventListener(
            "click",
            logout
        );
}


/* =========================================================
   TRAVELER REVIEW CAROUSEL
========================================================= */


/* -----------------------------------------
   Visible cards
----------------------------------------- */

function getReviewVisibleCount() {

    if (
        window.innerWidth <= 620
    ) {

        return 1;
    }


    if (
        window.innerWidth <= 900
    ) {

        return 2;
    }


    return 3;
}


/* -----------------------------------------
   Load Review JSON
----------------------------------------- */

async function loadTravelerReviews() {

    const track =
        document.getElementById(
            "reviewsTrack"
        );


    if (!track) {
        return;
    }


    track.innerHTML = `
        <div class="review-page">

            <div class="reviews-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading traveler reviews...
                </span>

            </div>

        </div>
    `;


    try {

        const response =
            await fetch(
                "traveler-reviews.json"
            );


        if (!response.ok) {

            throw new Error(
                "traveler-reviews.json could not be loaded."
            );
        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Review JSON format is invalid."
            );
        }


        reviewState.reviews =
            data;


        reviewState.currentPage =
            0;


        reviewState.visible =
            getReviewVisibleCount();


        renderReviewCarousel();


    } catch (error) {

        console.error(
            "Review loading error:",
            error
        );


        track.innerHTML = `
            <div class="review-page">

                <div class="reviews-loading">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <span>
                        Unable to load traveler reviews.
                        Check traveler-reviews.json.
                    </span>

                </div>

            </div>
        `;
    }
}


/* -----------------------------------------
   Create Review Card
----------------------------------------- */

function createReviewCard(
    review
) {

    const rating =
        Math.max(
            0,
            Math.min(
                5,
                Number(
                    review.rating || 5
                )
            )
        );


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rating
                ? '<i class="fa-solid fa-star"></i>'
                : '<i class="fa-regular fa-star"></i>';
    }


    const initial =
        review.avatar ||
        String(
            review.name ||
            "T"
        )
        .charAt(0)
        .toUpperCase();


    return `
        <article class="review-card">

            <div class="review-stars">

                ${stars}

                <span class="review-rating-text">
                    ${rating}.0 / 5
                </span>

            </div>


            <p class="review-text">
                “${escapeHTML(
                    review.review ||
                    ""
                )}”
            </p>


            <div class="review-user">

                <div class="review-avatar">
                    ${escapeHTML(
                        initial
                    )}
                </div>


                <div class="review-user-info">

                    <strong>
                        ${escapeHTML(
                            review.name ||
                            "Traveler"
                        )}
                    </strong>


                    <span>

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(
                            review.location ||
                            ""
                        )}

                    </span>

                </div>

            </div>

        </article>
    `;
}


/* -----------------------------------------
   Render Review Pages
----------------------------------------- */

function renderReviewCarousel() {

    const track =
        document.getElementById(
            "reviewsTrack"
        );


    const dotsContainer =
        document.getElementById(
            "reviewDots"
        );


    if (
        !track ||
        !dotsContainer
    ) {
        return;
    }


    reviewState.visible =
        getReviewVisibleCount();


    const visible =
        reviewState.visible;


    const totalPages =
        Math.ceil(
            reviewState.reviews.length /
            visible
        );


    if (
        totalPages <= 0
    ) {

        return;
    }


    if (
        reviewState.currentPage >=
        totalPages
    ) {

        reviewState.currentPage =
            totalPages - 1;
    }


    let pagesHTML =
        "";


    for (
        let i = 0;
        i < reviewState.reviews.length;
        i += visible
    ) {

        const group =
            reviewState.reviews.slice(
                i,
                i + visible
            );


        pagesHTML += `
            <div class="review-page">

                ${group
                    .map(
                        createReviewCard
                    )
                    .join("")}

            </div>
        `;
    }


    track.innerHTML =
        pagesHTML;


    dotsContainer.innerHTML =
        Array.from(
            {
                length:
                    totalPages
            },
            (_, index) => `

                <button
                    type="button"
                    class="review-dot ${
                        index ===
                        reviewState.currentPage
                            ? "active"
                            : ""
                    }"
                    data-review-page="${index}"
                    aria-label="Go to review page ${
                        index + 1
                    }"
                ></button>

            `
        )
        .join("");


    updateReviewCarousel(
        false
    );


    dotsContainer
        .querySelectorAll(
            ".review-dot"
        )
        .forEach(
            dot => {

                dot.addEventListener(
                    "click",
                    () => {

                        reviewState.currentPage =
                            Number(
                                dot.dataset
                                    .reviewPage
                            );


                        updateReviewCarousel(
                            true
                        );


                        restartReviewAutoplay();
                    }
                );
            }
        );
}


/* -----------------------------------------
   Update Carousel
----------------------------------------- */

function updateReviewCarousel(
    animate = true
) {

    const track =
        document.getElementById(
            "reviewsTrack"
        );


    const dots =
        document.querySelectorAll(
            ".review-dot"
        );


    if (!track) {
        return;
    }


    track.style.transition =
        animate
            ? "transform 0.65s cubic-bezier(.22,1,.36,1)"
            : "none";


    track.style.transform =
        `translateX(-${
            reviewState.currentPage *
            100
        }%)`;


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index ===
                reviewState.currentPage
            );
        }
    );


    if (!animate) {

        requestAnimationFrame(
            () => {

                track.style.transition =
                    "transform 0.65s cubic-bezier(.22,1,.36,1)";
            }
        );
    }
}


/* -----------------------------------------
   Next Review
----------------------------------------- */

function nextReviewPage() {

    const totalPages =
        Math.ceil(
            reviewState.reviews.length /
            reviewState.visible
        );


    if (
        totalPages <= 1
    ) {

        return;
    }


    reviewState.currentPage =
        (
            reviewState.currentPage +
            1
        )
        %
        totalPages;


    updateReviewCarousel(
        true
    );
}


/* -----------------------------------------
   Previous Review
----------------------------------------- */

function previousReviewPage() {

    const totalPages =
        Math.ceil(
            reviewState.reviews.length /
            reviewState.visible
        );


    if (
        totalPages <= 1
    ) {

        return;
    }


    reviewState.currentPage =
        (
            reviewState.currentPage -
            1 +
            totalPages
        )
        %
        totalPages;


    updateReviewCarousel(
        true
    );
}


/* -----------------------------------------
   Review Autoplay
----------------------------------------- */

function startReviewAutoplay() {

    stopReviewAutoplay();


    reviewState.timer =
        setInterval(
            () => {

                nextReviewPage();

            },
            4500
        );
}


function stopReviewAutoplay() {

    if (
        reviewState.timer
    ) {

        clearInterval(
            reviewState.timer
        );


        reviewState.timer =
            null;
    }
}


function restartReviewAutoplay() {

    startReviewAutoplay();
}


/* -----------------------------------------
   Setup Review Carousel
----------------------------------------- */

function setupReviewCarousel() {

    const carousel =
        document.getElementById(
            "reviewsCarousel"
        );


    const previous =
        document.getElementById(
            "reviewPrev"
        );


    const next =
        document.getElementById(
            "reviewNext"
        );


    if (!carousel) {
        return;
    }


    previous?.addEventListener(
        "click",
        () => {

            previousReviewPage();

            restartReviewAutoplay();
        }
    );


    next?.addEventListener(
        "click",
        () => {

            nextReviewPage();

            restartReviewAutoplay();
        }
    );


    /* Desktop hover pause */

    carousel.addEventListener(
        "mouseenter",
        stopReviewAutoplay
    );


    carousel.addEventListener(
        "mouseleave",
        startReviewAutoplay
    );


    /* Mobile touch */

    carousel.addEventListener(
        "touchstart",
        stopReviewAutoplay,
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        () => {

            setTimeout(
                startReviewAutoplay,
                1000
            );

        },
        {
            passive: true
        }
    );


    startReviewAutoplay();
}


/* -----------------------------------------
   Review Responsive
----------------------------------------- */

let reviewResizeTimer =
    null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            reviewResizeTimer
        );


        reviewResizeTimer =
            setTimeout(
                () => {

                    const newVisible =
                        getReviewVisibleCount();


                    if (
                        newVisible !==
                        reviewState.visible
                    ) {

                        reviewState.visible =
                            newVisible;


                        reviewState.currentPage =
                            0;


                        renderReviewCarousel();
                    }

                },
                200
            );
    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );
}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.goTo =
    goTo;

window.bookDestination =
    bookDestination;

window.toggleFavorite =
    toggleFavorite;

window.changeDestinationPage =
    changeDestinationPage;

window.updateBookingStatus =
    updateBookingStatus;


/* =========================================================
   HASH CHANGE
========================================================= */

window.addEventListener(
    "hashchange",
    renderRoute
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* ---------------------------------
           Admin
        --------------------------------- */

        ensureDemoAdmin();


        /* ---------------------------------
           Theme
        --------------------------------- */

        setupTheme();


        /* ---------------------------------
           Mobile Nav
        --------------------------------- */

        setupMobileMenu();


        /* ---------------------------------
           Scroll
        --------------------------------- */

        setupScrollEvents();


        /* ---------------------------------
           Back Top
        --------------------------------- */

        setupBackToTop();


        /* ---------------------------------
           Authentication
        --------------------------------- */

        setupAuthEvents();


        /* ---------------------------------
           Booking
        --------------------------------- */

        setupBooking();


        /* ---------------------------------
           Dashboard
        --------------------------------- */

        setupDashboardActions();


        /* ---------------------------------
           Contact
        --------------------------------- */

        setupContactForm();


        /* ---------------------------------
           Newsletter
        --------------------------------- */

        setupNewsletter();


        /* ---------------------------------
           Packages
        --------------------------------- */

        setupPackageActions();


        /* ---------------------------------
           Destinations
        --------------------------------- */

        setupDestinationActions();

        setupDestinationSearch();


        /* ---------------------------------
           Load Destination JSON
        --------------------------------- */

        await loadDestinations();


        /* ---------------------------------
           Load Review JSON
        --------------------------------- */

        await loadTravelerReviews();


        /* ---------------------------------
           Review Carousel
        --------------------------------- */

        setupReviewCarousel();


        /* ---------------------------------
           User UI
        --------------------------------- */

        updateUserUI();


        /* ---------------------------------
           Booking Fields
        --------------------------------- */

        updateBookingFields();


        /* ---------------------------------
           Hero Carousel
        --------------------------------- */

        setupCarousel();


        /* ---------------------------------
           Route
        --------------------------------- */

        renderRoute();


        /* ---------------------------------
           User Dashboard
        --------------------------------- */

        renderUserDashboard();


        /* ---------------------------------
           Admin Dashboard
        --------------------------------- */

        renderAdminDashboard();


        /* ---------------------------------
           Favorites
        --------------------------------- */

        updateFavoriteButtons();

    }
);