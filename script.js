document.addEventListener('DOMContentLoaded', () => {
    
    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    // Dodajemy .logo-img do triggerów, aby kursor reagował na logo
    const triggers = document.querySelectorAll('.hover-trigger, a, .btn, .logo-img');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        trigger.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // --- ZMIANA KOLORU KURSORA NA CIEMNYM TLE (HERO) ---
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        // Kiedy myszka wjeżdża na sekcję Hero -> kursor staje się biały
        heroSection.addEventListener('mouseenter', () => {
            cursor.classList.add('white-theme');
        });
        
        // Kiedy myszka zjeżdża z sekcji Hero -> kursor wraca do złota
        heroSection.addEventListener('mouseleave', () => {
            cursor.classList.remove('white-theme');
        });
    }

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});

// --- GALERIA PRZED/PO (SLIDER) ---
    const comparisonContainers = document.querySelectorAll('.comparison-container');

    comparisonContainers.forEach(container => {
        const slider = container.querySelector('.img-after');
        const handle = container.querySelector('.slider-handle');
        const imgAfterInside = slider.querySelector('img');
        
        // 1. Ustawienie szerokości wewnętrznego obrazka na sztywno,
        // żeby nie skalował się podczas zwężania diva .img-after
        // Ustawiamy go na szerokość całego kontenera
        imgAfterInside.style.width = container.offsetWidth + 'px';

        // Funkcja aktualizująca szerokość obrazka przy zmianie rozmiaru okna
        window.addEventListener('resize', () => {
             imgAfterInside.style.width = container.offsetWidth + 'px';
        });

        // Funkcja poruszania
        const moveSlider = (e) => {
            // Pobierz pozycję myszki/dotyku
            const containerRect = container.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - containerRect.left;

            // Ograniczenia (żeby nie wyjechać poza ramkę)
            if (x < 0) x = 0;
            if (x > containerRect.width) x = containerRect.width;

            // Ustawienie szerokości zdjęcia PO
            slider.style.width = x + 'px';
            
            // Ustawienie pozycji uchwytu
            handle.style.left = x + 'px';
        };

        // Nasłuchiwanie zdarzeń
        container.addEventListener('mousemove', moveSlider);
        container.addEventListener('touchmove', moveSlider);
    });


// --- SLIDESHOW HERO ---
 //   const slides = document.querySelectorAll('.slide');
   // let currentSlide = 0;
    //const slideInterval = 30000; // Czas zmiany slajdu (5000ms = 5 sekund)

    //function nextSlide() {
        // 1. Zabierz klasę .active z obecnego zdjęcia
      //  slides[currentSlide].classList.remove('active');
        
        // 2. Oblicz indeks następnego zdjęcia (modulo sprawia, że wraca do 0 po ostatnim)
        //currentSlide = (currentSlide + 1) % slides.length;
        
        // 3. Dodaj klasę .active do nowego zdjęcia
        //slides[currentSlide].classList.add('active');
    //}

    // Uruchom interwał
   // setInterval(nextSlide, slideInterval);

   // --- MOBILNE MENU (HAMBURGER) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        // Otwieranie/Zamykanie po kliknięciu w hamburgera
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Automatyczne zamykanie menu po kliknięciu w dowolny link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }