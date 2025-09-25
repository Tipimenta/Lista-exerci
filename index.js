/**
 * Script para interatividade do portfólio
 */
document.addEventListener("DOMContentLoaded", () => {
 const header = document.querySelector(".header");
 const menuToggle = document.querySelector(".menu-toggle");
 const navMenu = document.querySelector(".nav-menu");
 const backToTopButton = document.querySelector(".back-to-top");
 const animatedElements = document.querySelectorAll(".animate-on-scroll");
 const contactForm = document.getElementById("contact-form");
 const formStatus = document.getElementById("form-status");
 const accordionHeaders = document.querySelectorAll(".accordion-header");

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
 accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
   const content = header.nextElementSibling;
   header.classList.toggle("active");
   if (content.style.maxHeight) {
    content.style.maxHeight = null;
   } else {
    content.style.maxHeight = content.scrollHeight + "px";
   }
  });
 });

 // --- LÓGICA DO CARROSSEL DE DEPOIMENTOS AUTOMÁTICO ---
 const track = document.querySelector(".carousel-track");
 if (track) {
  const slides = Array.from(track.children);
  // Clona os slides para criar o efeito de loop infinito
  slides.forEach((slide) => {
   const clone = slide.cloneNode(true);
   track.appendChild(clone);
  });
 }

 // --- LÓGICA DAS ABAS (TABS) COM ROTAÇÃO AUTOMÁTICA E ÍCONES ---

 // MUDANÇA 1: Selecionar o elemento do ícone, não da imagem.
 const tabButtons = document.querySelectorAll(".tab-button");
 const tabContents = document.querySelectorAll(".tab-content");
 const purposeIcon = document.getElementById("purpose-icon"); // Alterado de "purpose-image" para "purpose-icon"
 let tabInterval;
 let currentTabIndex = 0;

 // MUDANÇA 2: Criar um objeto com as classes dos ícones, em vez de URLs de imagens.
 const icons = {
  1: "fas fa-bullseye fa-5x", // Ícone para Missão
  2: "fas fa-eye fa-5x", // Ícone para Visão
  3: "fas fa-handshake fa-5x", // Ícone para Valores
 };

 function switchTab(index) {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  const button = tabButtons[index];
  button.classList.add("active");
  document.getElementById("tab-" + button.dataset.tab).classList.add("active");

  currentTabIndex = index;

  // MUDANÇA 3: Lógica para trocar a classe do ícone com efeito de fade.
  const targetTab = button.getAttribute("data-tab");
  if (purposeIcon && icons[targetTab]) {
   purposeIcon.style.opacity = 0; // Deixa o ícone atual transparente
   setTimeout(() => {
    purposeIcon.className = icons[targetTab]; // Troca a classe do ícone
    purposeIcon.style.opacity = 1; // Torna o novo ícone visível
   }, 300); // Espera 0.3s para a transição
  }
 }

 // O restante do código permanece exatamente o mesmo, pois a lógica de rotação é perfeita!
 function startTabRotation() {
  clearInterval(tabInterval);
  tabInterval = setInterval(() => {
   let nextIndex = (currentTabIndex + 1) % tabButtons.length;
   switchTab(nextIndex);
  }, 10000); // 10 segundos
 }

 tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
   switchTab(index);
   startTabRotation(); // Reinicia o timer ao clicar
  });
 });

 startTabRotation();

 // --- LÓGICA DE ENVIO DO FORMULÁRIO DE CONTATO ---
 if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
   event.preventDefault();

   const form = event.target;
   const formData = new FormData(form);
   const action = "https://formsubmit.co/proeng.seg@gmail.com";

   formStatus.innerHTML = "";
   formStatus.className = "";
   formStatus.classList.remove("visible");

   try {
    const response = await fetch(action, {
     method: "POST",
     body: formData,
     headers: { Accept: "application/json" },
    });

    if (response.ok) {
     formStatus.innerHTML = "Mensagem enviada com sucesso! Obrigado.";
     formStatus.classList.add("success", "visible");
     form.reset();
    } else {
     throw new Error("Falha no envio da resposta da rede.");
    }
   } catch (error) {
    console.error("Erro ao enviar formulário:", error);
    formStatus.innerHTML =
     "Ocorreu um erro. Por favor, tente novamente mais tarde.";
    formStatus.classList.add("error", "visible");
   }
  });
 }
});
