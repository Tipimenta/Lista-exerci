/**
 * Script para interatividade do portfólio PRO-ENG (Versão Final Unificada)
 */
document.addEventListener("DOMContentLoaded", () => {
 // --- 1. EFEITO 3D TILT + BORDA ILUMINADA ---

 // A. Rastreador GLOBAL do mouse para o brilho na borda.
 document.documentElement.addEventListener("pointermove", (e) => {
  document.documentElement.style.setProperty("--x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--y", `${e.clientY}px`);
 });

 // B. Lógica de INCLINAÇÃO para cada card individualmente.
 const tiltCards = document.querySelectorAll(".diferencial-card-final");
 if (tiltCards.length > 0) {
  const maxTilt = 15;

  tiltCards.forEach((card) => {
   card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 992) return; // Não executa em mobile

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = card.offsetWidth / 2;
    const centerY = card.offsetHeight / 2;

    const rotateY = maxTilt * ((x - centerX) / centerX);
    const rotateX = -maxTilt * ((y - centerY) / centerY);

    card.style.transition = "transform 0.1s ease";
    card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
   });

   card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    card.style.transform =
     "perspective(1500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
   });
  });
 }

 // --- SELETORES E OUTRAS FUNCIONALIDADES DO SITE ---
 const header = document.querySelector(".header");
 const menuToggle = document.querySelector(".menu-toggle");
 const navMenu = document.querySelector(".nav-menu");
 const backToTopButton = document.querySelector(".back-to-top");
 const animatedElements = document.querySelectorAll(".animate-on-scroll");
 const contactForm = document.getElementById("contact-form");
 const formStatus = document.getElementById("form-status");
 const accordionHeaders = document.querySelectorAll(".accordion-header");
 const tabButtons = document.querySelectorAll(".tab-button");
 const tabContents = document.querySelectorAll(".tab-content");
 const purposeIcon = document.getElementById("purpose-icon");
 const track = document.querySelector(".carousel-track");

 // --- LÓGICA DO MENU MOBILE ---
 if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
   navMenu.classList.toggle("active");
   menuToggle.classList.toggle("active");
   menuToggle.setAttribute(
    "aria-expanded",
    navMenu.classList.contains("active")
   );
  });
  document.querySelectorAll(".nav-list a").forEach((link) => {
   link.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
     navMenu.classList.remove("active");
     menuToggle.classList.remove("active");
     menuToggle.setAttribute("aria-expanded", "false");
    }
   });
  });
 }

 // --- LÓGICA DE ANIMAÇÃO AO ROLAR ---
 if (animatedElements.length > 0) {
  const observer = new IntersectionObserver(
   (entries) => {
    entries.forEach((entry) => {
     if (entry.isIntersecting) {
      entry.target.classList.add("visible");
     }
    });
   },
   { threshold: 0.15 }
  );
  animatedElements.forEach((el) => observer.observe(el));
 }

 // --- LÓGICA DO CABEÇALHO E BOTÃO "VOLTAR AO TOPO" ---
 const handleScroll = () => {
  const scrollPosition = window.scrollY;
  if (header) {
   header.classList.toggle("scrolled", scrollPosition > 50);
  }
  if (backToTopButton) {
   backToTopButton.classList.toggle("visible", scrollPosition > 300);
  }
 };
 window.addEventListener("scroll", handleScroll);

 // --- LÓGICA DO ACCORDION (FAQ) ---
 if (accordionHeaders.length > 0) {
  accordionHeaders.forEach((header) => {
   header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const item = header.parentElement;
    item.classList.toggle("active");
    if (content.style.maxHeight) {
     content.style.maxHeight = null;
    } else {
     content.style.maxHeight = content.scrollHeight + "px";
    }
   });
  });
 }

 // --- LÓGICA DO CARROSSEL DE DEPOIMENTOS ---
 if (track) {
  const slides = Array.from(track.children);
  slides.forEach((slide) => {
   const clone = slide.cloneNode(true);
   track.appendChild(clone);
  });
 }

 // --- LÓGICA DAS ABAS (TABS) ---
 if (tabButtons.length > 0) {
  let tabInterval;
  let currentTabIndex = 0;
  const icons = {
   1: "fas fa-bullseye fa-5x",
   2: "fas fa-eye fa-5x",
   3: "fas fa-handshake fa-5x",
  };

  function switchTab(index) {
   tabButtons.forEach((btn) => btn.classList.remove("active"));
   tabContents.forEach((content) => content.classList.remove("active"));
   const button = tabButtons[index];
   button.classList.add("active");
   document.getElementById("tab-" + button.dataset.tab).classList.add("active");
   currentTabIndex = index;
   const targetTab = button.getAttribute("data-tab");
   if (purposeIcon && icons[targetTab]) {
    purposeIcon.style.opacity = 0;
    setTimeout(() => {
     purposeIcon.className = icons[targetTab];
     purposeIcon.style.opacity = 1;
    }, 300);
   }
  }

  function startTabRotation() {
   clearInterval(tabInterval);
   tabInterval = setInterval(() => {
    let nextIndex = (currentTabIndex + 1) % tabButtons.length;
    switchTab(nextIndex);
   }, 10000);
  }

  tabButtons.forEach((button, index) => {
   button.addEventListener("click", () => {
    switchTab(index);
    startTabRotation();
   });
  });
  startTabRotation();
 }

 // --- LÓGICA DO FORMULÁRIO DE CONTATO ---
 if (contactForm) {
  contactForm.action = "https://formsubmit.co/proeng.seg@gmail.com";
  contactForm.method = "POST";
  contactForm.addEventListener("submit", function (event) {
   event.preventDefault();
   const formData = new FormData(contactForm);
   const button = contactForm.querySelector('button[type="submit"]');
   formStatus.innerHTML = "Enviando sua mensagem...";
   formStatus.className = "status-sending";
   button.disabled = true;
   fetch(contactForm.action, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
   })
    .then((response) => {
     if (response.ok) {
      formStatus.innerHTML = "Obrigado! Sua mensagem foi enviada com sucesso.";
      formStatus.className = "status-success";
      contactForm.reset();
     } else {
      response.json().then((data) => {
       formStatus.innerHTML =
        data.error || "Ocorreu um erro. Por favor, tente novamente.";
       formStatus.className = "status-error";
      });
     }
    })
    .catch((error) => {
     formStatus.innerHTML =
      "Ocorreu um erro de conexão. Por favor, tente novamente.";
     formStatus.className = "status-error";
    })
    .finally(() => {
     button.disabled = false;
    });
  });
 }
}); // FIM DO DOMCONTENTLOADED PRINCIPAL
