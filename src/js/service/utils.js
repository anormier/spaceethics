//This is: The file utils.JS


export function updateVisibility(point, date, distanceToSunInAU, distVisFrom, distVisTo, viz) {
    const pointShouldAppear = checkIfVisible(point, date);
  
    if (distanceToSunInAU < distVisFrom || distanceToSunInAU > distVisTo || !pointShouldAppear) {
      if (point.visible) {
        point.visible = false;
        viz.removeObject(point.newObject);
      }
    } else if (!point.visible && distanceToSunInAU >= distVisFrom && distanceToSunInAU <= distVisTo) {
      point.visible = true;
      point.newObject = viz.createObject(point.name, point.characteristics);
    }
  }

export function checkIfVisible(object, currentDate) {
  return currentDate > object.visibleFrom && currentDate < object.visibleUntil;
}

export function radecToXYZ(ra, dec, r) {
  // Convert degrees to radians
  let raRad = (Math.PI / 180) * ra;
  let decRad = (Math.PI / 180) * dec;

  let x = r * Math.cos(decRad) * Math.cos(raRad);
  let y = r * Math.cos(decRad) * Math.sin(raRad);
  let z = r * Math.sin(decRad);

  return [x, y, z];
} 

export function isDesktop() {
  // Check for touch events which are typically available on phones and tablets
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Check for screen width, considering that many tablets have widths above 800 pixels
  const minWidth = 1024;

  // If there are no touch events and the screen width is above the threshold, it's probably a desktop
  return !hasTouch && window.innerWidth >= minWidth;
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


export function toggleFullscreen() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const infoText = "Fullscreen is not available on cellphones. Please connect with a laptop.";
updateInfoBox(infoText);
  } else {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
      }
  } else {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
  }
}
}

export function updateInfoBox(infoText) {
  document.getElementById('info-box').innerHTML = infoText;
  document.getElementById('nav-info').innerHTML = infoText;
}
