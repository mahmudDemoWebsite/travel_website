/* =========================================================
   WANDERLUST - CLEAN FINAL SCRIPT
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const USERS_KEY = "wanderlust_users";
const SESSION_KEY = "wanderlust_session";
const BOOKINGS_KEY = "wanderlust_bookings";
const FAVORITES_KEY = "wanderlust_favorites";
const THEME_KEY = "wanderlust_theme";


/* =========================================================
   DOM
========================================================= */

const landingPage =
  document.getElementById("landingPage");

const dashboardPage =
  document.getElementById("dashboard");

const userNav =
  document.getElementById("userNav");

const authModal =
  document.getElementById("authModal");

const authClose =
  document.getElementById("authClose");

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

const themeBtn =
  document.getElementById("themeBtn");

const navLinks =
  document.getElementById("navLinks");

const menuBtn =
  document.getElementById("menuBtn");

const searchInput =
  document.getElementById("searchInput");

const searchBtn =
  document.getElementById("searchBtn");

const destinationCards =
  document.querySelectorAll(".destination-card");

const emptyState =
  document.getElementById("emptyState");

const toast =
  document.getElementById("toast");


/* =========================================================
   STATE
========================================================= */

let pendingAction = null;

let currentSlide = 0;

let carouselTimer = null;


/* =========================================================
   STORAGE FUNCTIONS
========================================================= */

function getUsers() {

  try {

    return JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

  } catch {

    return [];

  }
}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

}


function getSession() {

  try {

    return JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null"
    );

  } catch {

    return null;

  }
}


function setSession(user) {

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );

}


function clearSession() {

  localStorage.removeItem(
    SESSION_KEY
  );

}


function getBookings() {

  try {

    return JSON.parse(
      localStorage.getItem(BOOKINGS_KEY) || "[]"
    );

  } catch {

    return [];

  }
}


function saveBookings(bookings) {

  localStorage.setItem(
    BOOKINGS_KEY,
    JSON.stringify(bookings)
  );

}


function getFavorites() {

  try {

    return JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "{}"
    );

  } catch {

    return {};

  }
}


function saveFavorites(favorites) {

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  );

}


/* =========================================================
   UTILITY
========================================================= */

function escapeHtml(value) {

  return String(value)

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function showToast(message) {

  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 3000);

}


/* =========================================================
   ROUTING
========================================================= */

function goTo(route) {

  if (!route.startsWith("#")) {

    route =
      "#" + route;

  }


  if (
    window.location.hash ===
    route
  ) {

    renderRoute();

  } else {

    window.location.hash =
      route;

  }

}


function renderRoute() {

  const route =
    window.location.hash || "#home";


  /* -------------------------
     DASHBOARD ROUTE
  ------------------------- */

  if (
    route === "#dashboard"
  ) {

    const session =
      getSession();


    if (!session) {

      pendingAction = {
        type: "dashboard"
      };


      /*
          Change route back to home
          while login modal is shown.
      */

      window.history.replaceState(
        {},
        "",
        "#home"
      );


      showLanding();

      openLogin();

      return;

    }


    showDashboard();

    return;

  }


  /* -------------------------
     ALL OTHER ROUTES
  ------------------------- */

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

    setTimeout(() => {

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

    }, 60);

  } else {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}


function showLanding() {

  if (landingPage) {

    landingPage.classList.remove(
      "hidden"
    );

  }


  if (dashboardPage) {

    dashboardPage.classList.add(
      "hidden"
    );

  }


  updateNavActiveState();

}


function showDashboard() {

  if (landingPage) {

    landingPage.classList.add(
      "hidden"
    );

  }


  if (dashboardPage) {

    dashboardPage.classList.remove(
      "hidden"
    );

  }


  renderDashboard();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function navigateHome() {

  goTo("#home");

}


/* Browser Back / Forward */

window.addEventListener(
  "hashchange",
  renderRoute
);


/* =========================================================
   NAVIGATION
========================================================= */

navLinks
  .querySelectorAll("a")
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();

        const href =
          link.getAttribute(
            "href"
          );


        navLinks.classList.remove(
          "show"
        );


        goTo(href);

      }
    );

  });


/* =========================================================
   ACTIVE NAV
========================================================= */

function updateNavActiveState() {

  const route =
    window.location.hash || "#home";


  navLinks
    .querySelectorAll("a")
    .forEach(link => {

      link.classList.toggle(
        "active",
        link.getAttribute(
          "href"
        ) === route
      );

    });

}


window.addEventListener(
  "scroll",
  updateNavActiveState
);


/* =========================================================
   AUTH MODAL
========================================================= */

function openLogin(action = null) {

  pendingAction =
    action;


  loginForm.classList.remove(
    "hidden"
  );


  registerForm.classList.add(
    "hidden"
  );


  authModal.classList.add(
    "show"
  );


  document.body.classList.add(
    "modal-open"
  );


  setTimeout(() => {

    const email =
      document.getElementById(
        "loginEmail"
      );

    if (email) {

      email.focus();

    }

  }, 100);

}


function openRegister(prefillEmail = "") {

  loginForm.classList.add(
    "hidden"
  );


  registerForm.classList.remove(
    "hidden"
  );


  authModal.classList.add(
    "show"
  );


  document.body.classList.add(
    "modal-open"
  );


  if (prefillEmail) {

    document.getElementById(
      "registerEmail"
    ).value =
      prefillEmail;

  }

}


function closeAuth() {

  authModal.classList.remove(
    "show"
  );


  document.body.classList.remove(
    "modal-open"
  );

}


authClose.addEventListener(
  "click",
  closeAuth
);


authModal.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      authModal
    ) {

      closeAuth();

    }

  }
);


showRegisterBtn.addEventListener(
  "click",
  () => {

    const email =
      document.getElementById(
        "loginEmail"
      ).value.trim();


    openRegister(
      email
    );

  }
);


showLoginBtn.addEventListener(
  "click",
  () => {

    loginForm.classList.remove(
      "hidden"
    );

    registerForm.classList.add(
      "hidden"
    );

  }
);


/* =========================================================
   REGISTER
========================================================= */

registerForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      document.getElementById(
        "registerName"
      ).value.trim();


    const email =
      document.getElementById(
        "registerEmail"
      ).value.trim().toLowerCase();


    const phone =
      document.getElementById(
        "registerPhone"
      ).value.trim();


    const password =
      document.getElementById(
        "registerPassword"
      ).value;


    const confirmPassword =
      document.getElementById(
        "registerConfirmPassword"
      ).value;


    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {

      showToast(
        "❌ Please fill in all fields."
      );

      return;

    }


    if (
      password.length < 6
    ) {

      showToast(
        "❌ Password must be at least 6 characters."
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


    const exists =
      users.some(
        user =>
          user.email === email
      );


    if (exists) {

      showToast(
        "⚠️ Account already exists. Please login."
      );


      openLogin(
        pendingAction
      );


      document.getElementById(
        "loginEmail"
      ).value =
        email;


      return;

    }


    const newUser = {

      id:
        Date.now(),

      name,

      email,

      phone,

      password

    };


    users.push(
      newUser
    );


    saveUsers(
      users
    );


    /*
        AUTO LOGIN
    */

    setSession({

      id:
        newUser.id,

      name:
        newUser.name,

      email:
        newUser.email,

      phone:
        newUser.phone

    });


    registerForm.reset();

    closeAuth();


    updateUserUI();

    updateBookingFields();

    updateFavoriteButtons();


    showToast(
      `✅ Welcome to Wanderlust, ${newUser.name}!`
    );


    setTimeout(() => {

      continuePendingAction();

    }, 250);

  }
);


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const email =
      document.getElementById(
        "loginEmail"
      ).value.trim().toLowerCase();


    const password =
      document.getElementById(
        "loginPassword"
      ).value;


    if (
      !email ||
      !password
    ) {

      showToast(
        "❌ Enter email and password."
      );

      return;

    }


    const users =
      getUsers();


    const user =
      users.find(
        item =>
          item.email ===
          email
      );


    /*
        No account
        → Register
    */

    if (!user) {

      showToast(
        "⚠️ Account not found. Create an account first."
      );


      setTimeout(() => {

        openRegister(
          email
        );

      }, 450);


      return;

    }


    /*
        Wrong password
    */

    if (
      user.password !==
      password
    ) {

      showToast(
        "❌ Incorrect password."
      );

      return;

    }


    /*
        SAVE SESSION
    */

    setSession({

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      phone:
        user.phone

    });


    loginForm.reset();

    closeAuth();


    updateUserUI();

    updateBookingFields();

    updateFavoriteButtons();


    showToast(
      `✅ Welcome back, ${user.name}!`
    );


    setTimeout(() => {

      continuePendingAction();

    }, 250);

  }
);


/* =========================================================
   CONTINUE AFTER AUTH
========================================================= */

function continuePendingAction() {

  const action =
    pendingAction;


  pendingAction =
    null;


  /*
      Nothing pending
      → just stay on current page
  */

  if (!action) {

    updateBookingFields();

    return;

  }


  /* -------------------------
     BOOKING
  ------------------------- */

  if (
    action.type ===
    "booking"
  ) {

    const select =
      document.getElementById(
        "bookingDestination"
      );


    if (
      select &&
      action.destination
    ) {

      select.value =
        action.destination;

    }


    goTo("#booking");

    return;

  }


  /* -------------------------
     DASHBOARD
  ------------------------- */

  if (
    action.type ===
    "dashboard"
  ) {

    goTo("#dashboard");

    return;

  }


  /* -------------------------
     FAVORITE
  ------------------------- */

  if (
    action.type ===
    "favorite"
  ) {

    saveFavorite(
      action.destination
    );

  }

}


/* =========================================================
   NAVBAR USER UI
========================================================= */

function updateUserUI() {

  const session =
    getSession();


  /*
      LOGGED OUT
  */

  if (!session) {

    userNav.innerHTML = `

            <button
                type="button"
                class="login-nav-btn"
                id="loginNavButton"
            >
                Login
            </button>

        `;


    document
      .getElementById(
        "loginNavButton"
      )
      .addEventListener(
        "click",
        () => {

          openLogin();

        }
      );


    updateBookingFields();

    return;

  }


  /*
      LOGGED IN
  */

  const initial =
    session.name
      .trim()
      .charAt(0)
      .toUpperCase();


  userNav.innerHTML = `

        <div class="user-profile">

            <button
                type="button"
                class="profile-btn"
                id="profileBtn"
            >

                <span class="profile-avatar-small">
                    ${escapeHtml(initial)}
                </span>

                <span>
                    ${escapeHtml(
    session.name.split(" ")[0]
  )}
                </span>

                <span class="profile-arrow">
                    ▾
                </span>

            </button>


            <div
                class="profile-dropdown"
                id="profileDropdown"
            >

                <div
                    class="profile-dropdown-header"
                >

                    <strong>
                        ${escapeHtml(
    session.name
  )}
                    </strong>

                    <span>
                        ${escapeHtml(
    session.email
  )}
                    </span>

                </div>


                <button
                    type="button"
                    id="dashboardMenuBtn"
                >
                    📊 My Dashboard
                </button>


                <button
                    type="button"
                    id="bookingMenuBtn"
                >
                    ✈️ My Booking
                </button>


                <button
                    type="button"
                    id="logoutMenuBtn"
                >
                    🚪 Logout
                </button>

            </div>

        </div>

    `;


  const profileBtn =
    document.getElementById(
      "profileBtn"
    );


  const profileDropdown =
    document.getElementById(
      "profileDropdown"
    );


  profileBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      profileDropdown.classList.toggle(
        "show"
      );

    }
  );


  document
    .getElementById(
      "dashboardMenuBtn"
    )
    .addEventListener(
      "click",
      () => {

        profileDropdown.classList.remove(
          "show"
        );

        goTo("#dashboard");

      }
    );


  document
    .getElementById(
      "bookingMenuBtn"
    )
    .addEventListener(
      "click",
      () => {

        profileDropdown.classList.remove(
          "show"
        );

        goTo("#booking");

      }
    );


  document
    .getElementById(
      "logoutMenuBtn"
    )
    .addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        logout();

      }
    );


  updateBookingFields();

}


document.addEventListener(
  "click",
  event => {

    const dropdown =
      document.getElementById(
        "profileDropdown"
      );


    if (
      dropdown &&
      !event.target.closest(
        ".user-profile"
      )
    ) {

      dropdown.classList.remove(
        "show"
      );

    }

  }
);


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  /*
      Remove session
  */

  clearSession();


  /*
      Clear pending action
  */

  pendingAction =
    null;


  /*
      Update UI
  */

  updateUserUI();

  updateBookingFields();

  updateFavoriteButtons();


  /*
      Return to home
  */

  goTo("#home");


  showToast(
    "✅ You have been logged out successfully."
  );

}


/* =========================================================
   BOOKING USER DETAILS
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


  const submitButton =
    document.getElementById(
      "bookingSubmitBtn"
    );


  const note =
    document.getElementById(
      "loginRequiredNote"
    );


  if (
    !nameInput ||
    !emailInput ||
    !phoneInput ||
    !submitButton ||
    !note
  ) {

    return;

  }


  if (!session) {

    nameInput.value =
      "";

    emailInput.value =
      "";

    phoneInput.value =
      "";

    nameInput.placeholder =
      "Login required";

    emailInput.placeholder =
      "Login required";

    phoneInput.placeholder =
      "Login required";

    submitButton.textContent =
      "Login To Book 🔐";

    note.style.display =
      "block";

    return;

  }


  nameInput.value =
    session.name;

  emailInput.value =
    session.email;

  phoneInput.value =
    session.phone;

  submitButton.textContent =
    "Confirm Booking ✈️";

  note.style.display =
    "none";

}


/* =========================================================
   BOOKING SUBMIT
========================================================= */

bookingForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const session =
      getSession();


    /*
        USER NOT LOGGED IN
    */

    if (!session) {

      const selectedDestination =
        document
          .getElementById(
            "bookingDestination"
          )
          .value;


      pendingAction = {

        type:
          "booking",

        destination:
          selectedDestination

      };


      openLogin();

      return;

    }


    const destination =
      document
        .getElementById(
          "bookingDestination"
        )
        .value;


    const date =
      document
        .getElementById(
          "bookingDate"
        )
        .value;


    const travelers =
      document
        .getElementById(
          "bookingTravelers"
        )
        .value;


    const message =
      document
        .getElementById(
          "bookingMessage"
        )
        .value
        .trim();


    if (!destination) {

      showToast(
        "📍 Please select a destination."
      );

      return;

    }


    if (!date) {

      showToast(
        "📅 Please select travel date."
      );

      return;

    }


    const booking = {

      id:
        "WL-" +
        Date.now(),

      userId:
        session.id,

      name:
        session.name,

      email:
        session.email,

      phone:
        session.phone,

      destination,

      date,

      travelers,

      message,

      status:
        "Pending",

      createdAt:
        new Date().toISOString()

    };


    const bookings =
      getBookings();


    bookings.push(
      booking
    );


    saveBookings(
      bookings
    );


    /*
        Reset
    */

    document
      .getElementById(
        "bookingDestination"
      )
      .value =
      "";


    document
      .getElementById(
        "bookingDate"
      )
      .value =
      "";


    document
      .getElementById(
        "bookingTravelers"
      )
      .value =
      "2";


    document
      .getElementById(
        "bookingMessage"
      )
      .value =
      "";


    showToast(
      "✅ Booking submitted successfully!"
    );


    /*
        Dashboard
    */

    setTimeout(
      () => {

        goTo(
          "#dashboard"
        );

      },
      500
    );

  }
);


/* =========================================================
   DESTINATION BOOK BUTTONS
========================================================= */

document
  .querySelectorAll(
    ".book-destination-btn"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const destination =
          button.dataset
            .destination;


        const session =
          getSession();


        if (!session) {

          pendingAction = {

            type:
              "booking",

            destination

          };


          openLogin();

          return;

        }


        document
          .getElementById(
            "bookingDestination"
          )
          .value =
          destination;


        goTo("#booking");

      }
    );

  });


/* =========================================================
   PACKAGE BOOK BUTTONS
========================================================= */

document
  .querySelectorAll(
    ".package-book-btn"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const destination =
          button.dataset
            .destination;


        const session =
          getSession();


        if (!session) {

          pendingAction = {

            type:
              "booking",

            destination

          };


          openLogin();

          return;

        }


        document
          .getElementById(
            "bookingDestination"
          )
          .value =
          destination;


        goTo("#booking");

      }
    );

  });


/* =========================================================
   FAVORITES
========================================================= */

function getUserFavorites(userId) {

  const all =
    getFavorites();


  return all[userId] || [];

}


function saveFavorite(destination) {

  const session =
    getSession();


  if (!session) {

    pendingAction = {

      type:
        "favorite",

      destination

    };


    openLogin();

    return;

  }


  const favorites =
    getFavorites();


  const list =
    favorites[session.id] ||
    [];


  if (
    list.includes(
      destination
    )
  ) {

    return;

  }


  list.push(
    destination
  );


  favorites[session.id] =
    list;


  saveFavorites(
    favorites
  );


  updateFavoriteButtons();

  showToast(
    "❤️ Added to favorites."
  );

}


function toggleFavorite(destination) {

  const session =
    getSession();


  if (!session) {

    pendingAction = {

      type:
        "favorite",

      destination

    };


    openLogin();

    return;

  }


  const favorites =
    getFavorites();


  const list =
    favorites[session.id] ||
    [];


  const index =
    list.indexOf(
      destination
    );


  if (index === -1) {

    list.push(
      destination
    );

    showToast(
      "❤️ Added to favorites."
    );

  } else {

    list.splice(
      index,
      1
    );

    showToast(
      "Removed from favorites."
    );

  }


  favorites[session.id] =
    list;


  saveFavorites(
    favorites
  );


  updateFavoriteButtons();


  if (
    window.location.hash ===
    "#dashboard"
  ) {

    renderDashboard();

  }

}


document
  .querySelectorAll(
    ".favorite-btn"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        toggleFavorite(
          button.dataset
            .destination
        );

      }
    );

  });


function updateFavoriteButtons() {

  const session =
    getSession();


  const favorites =
    session
      ? getUserFavorites(
        session.id
      )
      : [];


  document
    .querySelectorAll(
      ".favorite-btn"
    )
    .forEach(button => {

      const destination =
        button.dataset
          .destination;


      const active =
        favorites.includes(
          destination
        );


      button.classList.toggle(
        "active",
        active
      );


      button.textContent =
        active
          ? "♥"
          : "♡";

    });

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  const session =
    getSession();


  if (!session) {
    return;
  }


  document
    .getElementById(
      "dashboardName"
    )
    .textContent =
    session.name;


  document
    .getElementById(
      "profileName"
    )
    .textContent =
    session.name;


  document
    .getElementById(
      "profileEmail"
    )
    .textContent =
    session.email;


  document
    .getElementById(
      "profilePhone"
    )
    .textContent =
    session.phone;


  document
    .getElementById(
      "profileInitial"
    )
    .textContent =
    session.name
      .charAt(0)
      .toUpperCase();


  const bookings =
    getBookings().filter(
      booking =>
        Number(
          booking.userId
        ) ===
        Number(
          session.id
        )
    );


  const favorites =
    getUserFavorites(
      session.id
    );


  document
    .getElementById(
      "totalBookings"
    )
    .textContent =
    bookings.length;


  document
    .getElementById(
      "totalFavorites"
    )
    .textContent =
    favorites.length;


  renderBookings(
    bookings
  );


  renderFavorites(
    favorites
  );

}


function renderBookings(bookings) {

  const list =
    document.getElementById(
      "bookingList"
    );


  if (!bookings.length) {

    list.innerHTML = `

            <p
                style="
                    color:var(--text-soft);
                    font-size:13px;
                "
            >
                No bookings yet.
                Start planning your next trip.
            </p>

        `;

    return;

  }


  list.innerHTML =
    bookings
      .slice()
      .reverse()
      .map(
        booking => `

                    <div
                        class="booking-item"
                    >

                        <div>

                            <strong>
                                ${escapeHtml(
          booking.destination
        )}
                            </strong>

                            <small>
                                📅
                                ${escapeHtml(
          booking.date
        )}
                            </small>

                            <br>

                            <small>
                                👥
                                ${escapeHtml(
          booking.travelers
        )}
                                traveler(s)
                            </small>

                            <br>

                            <small>
                                ID:
                                ${escapeHtml(
          booking.id
        )}
                            </small>

                        </div>


                        <span class="status">
                            ${escapeHtml(
          booking.status
        )}
                        </span>

                    </div>

                `
      )
      .join("");

}


function renderFavorites(favorites) {

  const list =
    document.getElementById(
      "favoriteList"
    );


  if (!favorites.length) {

    list.innerHTML = `

            <span
                style="
                    color:var(--text-soft);
                    font-size:13px;
                "
            >
                No favorite destinations yet.
            </span>

        `;

    return;

  }


  list.innerHTML =
    favorites
      .map(
        destination => `

                    <span
                        class="favorite-chip"
                    >
                        ❤️
                        ${escapeHtml(
          destination
        )}
                    </span>

                `
      )
      .join("");

}


/* =========================================================
   DASHBOARD BUTTONS
========================================================= */

document
  .getElementById(
    "dashboardLogout"
  )
  .addEventListener(
    "click",
    logout
  );


document
  .getElementById(
    "newBookingBtn"
  )
  .addEventListener(
    "click",
    () => {

      goTo(
        "#booking"
      );

    }
  );


/* =========================================================
   SEARCH
========================================================= */

function searchDestinations() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  let count =
    0;


  destinationCards.forEach(card => {

    const name =
      card.dataset.name
        .toLowerCase();


    if (
      !query ||
      name.includes(query)
    ) {

      card.style.display =
        "";

      count++;

    } else {

      card.style.display =
        "none";

    }

  });


  emptyState.style.display =
    count === 0
      ? "block"
      : "none";


  goTo("#destinations");

}


searchBtn.addEventListener(
  "click",
  searchDestinations
);


searchInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      searchDestinations();

    }

  }
);


/* =========================================================
   CONTACT FORM
========================================================= */

document
  .getElementById(
    "contactForm"
  )
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      showToast(
        "✅ Message sent successfully!"
      );

      event.target.reset();

    }
  );


/* =========================================================
   THEME
========================================================= */

const savedTheme =
  localStorage.getItem(
    THEME_KEY
  );


if (
  savedTheme ===
  "dark"
) {

  document.body.classList.add(
    "dark"
  );

  themeBtn.textContent =
    "☀️";

} else {

  themeBtn.textContent =
    "🌙";

}


themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const isDark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      THEME_KEY,
      isDark
        ? "dark"
        : "light"
    );


    themeBtn.textContent =
      isDark
        ? "☀️"
        : "🌙";

  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

menuBtn.addEventListener(
  "click",
  () => {

    navLinks.classList.toggle(
      "show"
    );

  }
);


/* =========================================================
   DATE
========================================================= */

const today =
  new Date()
    .toISOString()
    .split("T")[0];


document.getElementById(
  "travelDate"
).min =
  today;


document.getElementById(
  "bookingDate"
).min =
  today;


/* =========================================================
   CAROUSEL
========================================================= */

const slides =
  document.querySelectorAll(
    ".hero-slide"
  );


const dots =
  document.querySelectorAll(
    ".carousel-dot"
  );


const prevBtn =
  document.getElementById(
    "carouselPrev"
  );


const nextBtn =
  document.getElementById(
    "carouselNext"
  );


function showSlide(index) {

  if (!slides.length) {
    return;
  }


  if (
    index >=
    slides.length
  ) {

    index =
      0;

  }


  if (
    index < 0
  ) {

    index =
      slides.length -
      1;

  }


  currentSlide =
    index;


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


function startCarousel() {

  clearInterval(
    carouselTimer
  );


  carouselTimer =
    setInterval(
      () => {

        showSlide(
          currentSlide + 1
        );

      },
      5000
    );

}


function resetCarousel() {

  startCarousel();

}


nextBtn.addEventListener(
  "click",
  () => {

    showSlide(
      currentSlide + 1
    );

    resetCarousel();

  }
);


prevBtn.addEventListener(
  "click",
  () => {

    showSlide(
      currentSlide - 1
    );

    resetCarousel();

  }
);


dots.forEach(
  (dot, index) => {

    dot.addEventListener(
      "click",
      () => {

        showSlide(index);

        resetCarousel();

      }
    );

  }
);


const hero =
  document.querySelector(
    ".hero"
  );


if (hero) {

  hero.addEventListener(
    "mouseenter",
    () => {

      clearInterval(
        carouselTimer
      );

    }
  );


  hero.addEventListener(
    "mouseleave",
    () => {

      startCarousel();

    }
  );

}


showSlide(0);

startCarousel();


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeAuth();

      const dropdown =
        document.getElementById(
          "profileDropdown"
        );


      if (dropdown) {

        dropdown.classList.remove(
          "show"
        );

      }

    }

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateUserUI();

updateBookingFields();

updateFavoriteButtons();

updateNavActiveState();

renderRoute();