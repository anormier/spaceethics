export function initializeYearSlider(viz) {
    const yearSlider = document.getElementById("year-slider");
    yearSlider.addEventListener("input", (event) => {
      const selectedYear = parseInt(event.target.value);
      viz.setDate(new Date(`${selectedYear}-01-01`));
    });
  }