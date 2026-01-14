// Event Details Popup Functionality
document.addEventListener('DOMContentLoaded', () => {
  const registerButtons = document.querySelectorAll('.register-btn');
  const popupCloseButtons = document.querySelectorAll('.popup-close');

  // Open popup when register button is clicked
  registerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventId = btn.getAttribute('data-event-id');
      const popupId = `popup-${eventId}`;
      const popup = document.getElementById(popupId);
      
      if (popup) {
        openEventPopup(popup);
      }
    });
  });

  // Close popup when close button is clicked
  popupCloseButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const popup = closeBtn.closest('.event-popup');
      if (popup) {
        closeEventPopup(popup);
      }
    });
  });

  // Close popup when clicking outside the panel
  document.querySelectorAll('.event-popup').forEach(popup => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closeEventPopup(popup);
      }
    });

    // Close popup on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('open')) {
        closeEventPopup(popup);
      }
    });
  });

  function openEventPopup(popup) {
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');

    // Animate panel with GSAP if available
    if (typeof gsap !== 'undefined') {
      const panel = popup.querySelector('.menu-panel');
      gsap.fromTo(panel,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' }
      );
    }
  }

  function closeEventPopup(popup) {
    if (typeof gsap !== 'undefined') {
      const panel = popup.querySelector('.menu-panel');
      gsap.to(panel, {
        scale: 0.88,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          popup.classList.remove('open');
          popup.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('menu-open');
        }
      });
    } else {
      popup.classList.remove('open');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  }
});
