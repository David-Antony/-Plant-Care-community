/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== QUESTIONS ACCORDION ===============*/
const accordionItems = document.querySelectorAll('.questions__item')

accordionItems.forEach((item) =>{
    const accordionHeader = item.querySelector('.questions__header')

    accordionHeader.addEventListener('click', () =>{
        const openItem = document.querySelector('.accordion-open')

        toggleItem(item)

        if(openItem && openItem!== item){
            toggleItem(openItem)
        }
    })
})

const toggleItem = (item) =>{
    const accordionContent = item.querySelector('.questions__content')

    if(item.classList.contains('accordion-open')){
        accordionContent.removeAttribute('style')
        item.classList.remove('accordion-open')
    }else{
        accordionContent.style.height = accordionContent.scrollHeight + 'px'
        item.classList.add('accordion-open')
    }

}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 400 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 400) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home__data`)
sr.reveal(`.home__img`, {delay: 500})
sr.reveal(`.home__social`, {delay: 600})
sr.reveal(`.about__img, .contact__box`,{origin: 'left'})
sr.reveal(`.about__data, .contact__form`,{origin: 'right'})
sr.reveal(`.steps__card, .product__card, .questions__group, .footer`,{interval: 100})
/*=============== AJAX CONTACT FORM ===============*/
const contactForm = document.getElementById('contact-form'),
      contactSuccess = document.getElementById('contact-success'),
      sendAnotherBtn = document.getElementById('send-another');

if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new URLSearchParams(new FormData(contactForm));
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="ri-loader-4-line ri-spin"></i>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if(response.ok) {
                contactForm.style.opacity = 0;
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    contactSuccess.style.display = 'block';
                    setTimeout(() => { contactSuccess.style.opacity = 1; }, 50);
                    contactForm.reset();
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 400);
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

/*=============== PRODUCT MODAL ===============*/
const modal = document.getElementById('product-modal'),
      modalTitle = document.getElementById('modal-title'),
      modalDesc = document.getElementById('modal-description'),
      modalWater = document.getElementById('modal-water'),
      modalOrigin = document.getElementById('modal-origin'),
      modalBenefit = document.getElementById('modal-benefit'),
      modalBgImg = document.getElementById('modal-bg-img'),
      modalClose = document.getElementById('modal-close'),
      infoBtns = document.querySelectorAll('.info__button');

if(infoBtns) {
    infoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalTitle.textContent = btn.dataset.name;
            modalDesc.textContent = btn.dataset.desc;
            modalWater.textContent = btn.dataset.water;
            modalOrigin.textContent = btn.dataset.origin;
            modalBenefit.textContent = btn.dataset.benefit;
            modalBgImg.src = btn.dataset.img;
            modal.classList.add('active-modal');
        });
    });
}

if(modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active-modal');
    });
}

/*=============== SUBSCRIBE FORM ===============*/
const subscribeForm = document.getElementById('subscribe-form'),
      subscribeSuccess = document.getElementById('subscribe-success');

if(subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = subscribeForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = subscribeForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const loadingBar = document.getElementById('subscribe-loading-bar');
        
        submitBtn.innerHTML = 'Subscribing... <i class="ri-loader-4-line ri-spin"></i>';
        submitBtn.disabled = true;
        
        // Show and animate loading bar
        loadingBar.style.display = 'block';
        setTimeout(() => { loadingBar.style.width = '100%'; }, 50);

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if(response.ok && data.success) {
                // Wait for the bar animation to finish
                setTimeout(() => {
                    subscribeForm.style.display = 'none';
                    subscribeSuccess.style.display = 'block';
                }, 1500);
            } else {
                alert(data.message || 'Something went wrong. Please try again.');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                loadingBar.style.width = '0%';
                setTimeout(() => { loadingBar.style.display = 'none'; }, 1500);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server connection error. Please try again later.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            loadingBar.style.width = '0%';
            setTimeout(() => { loadingBar.style.display = 'none'; }, 1500);
        }
    });
}
if(sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
        contactSuccess.style.opacity = 0;
        setTimeout(() => {
            contactSuccess.style.display = 'none';
            contactForm.style.display = 'grid';
            setTimeout(() => { contactForm.style.opacity = 1; }, 50);
        }, 400);
    });
}
