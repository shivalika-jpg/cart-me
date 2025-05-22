function goToPage(url) {
  const card = event.currentTarget;
  card.classList.add("clicked");

  setTimeout(() => {
    window.location.href = url;
  }, 200); // Slight delay for animation
}

// Add some animation class on click (optional effect)
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("mousedown", () => {
    card.style.transform = "scale(0.97)";
  });
  card.addEventListener("mouseup", () => {
    card.style.transform = "scale(1)";
  });
});
