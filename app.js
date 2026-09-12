/* ============================================
   APP.JS — Sidebar toggle, nav highlight, user, logout
   ============================================ */
(function () {
  /* --- Sidebar toggle (mobile) --- */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');

  window.toggleSidebar = function () {
    if (!sidebar) return;
    var isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show', isOpen);
  };

  if (overlay) {
    overlay.addEventListener('click', function () {
      window.toggleSidebar();
    });
  }

  /* --- Auto-highlight active nav --- */
  var page = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.sidebar .nav-item');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href && href.indexOf(page) > -1) {
      links[i].classList.add('active');
      break;
    }
  }

  /* --- Set user name --- */
  var nameEl = document.getElementById('userName');
  if (nameEl) {
    nameEl.textContent = localStorage.getItem('adminName') || 'Admin';
  }

  /* --- Logout --- */
  window.logout = function () {
    localStorage.removeItem('adminLogin');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    location.href = 'login.html';
  };
})();
