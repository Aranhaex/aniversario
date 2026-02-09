// Variáveis globais
var slideIndex = 1;
var modal = document.getElementById("meuModal");
var audio = document.getElementById("musicaFundo");
var efeitoMagico = document.getElementById("efeito-magico");
var temporizador;

// --- NOVA FUNÇÃO PRINCIPAL ---
// Esta é a função que o botão chama agora.
function ativarMagia() {
    // 1. Adiciona a classe que faz a animação CSS rodar
    efeitoMagico.classList.add("magia-ativa");

    // 2. Espera o tempo da animação (800ms = 0.8s) antes de abrir o slideshow
    setTimeout(function() {
        // Remove a classe para poder usar de novo se quiser
        efeitoMagico.classList.remove("magia-ativa");
        
        // Chama a função original que abre o modal e toca música
        abrirSlideshow();
    }, 800); // Esse número deve bater com o tempo no CSS (0.8s)
}


// Função para abrir o modal, tocar música e INICIAR o automático
function abrirSlideshow() {
    modal.style.display = "block";
    mostrarSlides(slideIndex);
    
    audio.play().catch(function(error) {
        console.log("Erro ao reproduzir áudio: ", error);
    });

    temporizador = setInterval(function() {
        mudarSlide(1);
    }, 5000);
}

// Função para fechar, pausar música e PARAR o automático
function fecharSlideshow() {
    modal.style.display = "none";
    audio.pause();
    audio.currentTime = 0; 
    clearInterval(temporizador);
}

// Controles manuais
function mudarSlide(n) {
    mostrarSlides(slideIndex += n);
    clearInterval(temporizador);
    temporizador = setInterval(function() {
        mudarSlide(1);
    }, 5000);
}

// Lógica de exibição
function mostrarSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slides[slideIndex-1].style.display = "block";
}

function mudarVolume(valor) {
    audio.volume = valor;
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color, speed, angle, isHeart) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.isHeart = isHeart;
        this.friction = 0.95;
        this.gravity = 0.05;
        this.opacity = 1;
        // Velocidade baseada na direção da explosão
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.speed *= this.friction;
        this.vy += this.gravity;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.01; // Fade out
    }
}

function createHeartParticles(x, y) {
    const particleCount = 100;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    for (let i = 0; i < particleCount; i++) {
        // Fórmula matemática do coração
        let t = Math.random() * Math.PI * 2;
        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        // Define a velocidade final baseada no formato
        particles.push(new Particle(x, y, color, 1, Math.atan2(hy, hx), true));
        // Ajusta a posição inicial para expandir a partir do centro
        particles[particles.length - 1].speed = Math.random() * 3 + 1;
    }
}

function animate() {
    requestAnimationFrame(animate);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    particles.forEach((particle, index) => {
        if (particle.opacity > 0) {
            particle.update();
            particle.draw();
        } else {
            particles.splice(index, 1);
        }
    });

    if (Math.random() < 0.03) {
        createHeartParticles(Math.random() * canvas.width, Math.random() * canvas.height / 2);
    }
}

animate();
