const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function menuToggleHandler() {
    sideDrawer.classList.toggle('open');
    backdrop.classList.toggle('open');
}

function backdropClickHandler() {
    sideDrawer.classList.remove('open');
    backdrop.classList.remove('open');
}

if (backdrop) {
    backdrop.addEventListener('click', backdropClickHandler);
}

if (menuToggle) {
    menuToggle.addEventListener('click', menuToggleHandler);
}
