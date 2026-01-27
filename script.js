document.addEventListener("DOMContentLoaded", () => {
    let currentPage = window.location.pathname.split("/").pop();

    // Handle root URL correctly
    if (!currentPage || currentPage.trim() === "") {
        currentPage = "index.html";
    }

    document.querySelectorAll(".navbar a").forEach(link => {
        let linkPage = link.getAttribute("href");

        // Extract only file name from link href
        let linkFile = linkPage.split("/").pop();

        if (linkFile === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");  // ensures Home doesn't stay active
        }
    });
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// const backToTop1 = document.getElementById("backToTop1");

// window.addEventListener("scroll", () => {
//   if (window.scrollY > 10) {
//     backToTop1.style.display = "block";
//   } else {
//     backToTop1.style.display = "none";
//   }
// });

// backToTop1.addEventListener("click", () => {
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth"
//   });
// });