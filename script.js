function updateClock() {
    const clockElement = document.getElementById('clock-display');
    if (clockElement) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateString = `${day}/${month}/${year}`;
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        clockElement.innerHTML = `${dateString}<br>${timeString}`;
    }
}

function initLoaderAndContent() {
    const loaderContainer = document.getElementById('loader-container');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.getElementById('loader-text');
    const mainContent = document.getElementById('main-content');
    const body = document.body;

    let progress = 0;
    const duration = 1500;
    const startTime = Date.now();

    function updateLoader() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(100, Math.floor((elapsed / duration) * 100));

        loaderBar.style.width = `${progress}%`;
        loaderText.textContent = `${progress}%`;

        if (progress < 100) {
            requestAnimationFrame(updateLoader);
        } else {
            setTimeout(() => {
                loaderContainer.style.opacity = '0';
                loaderContainer.addEventListener('transitionend', () => {
                    loaderContainer.style.display = 'none';
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                    }, 50);
                }, { once: true });
            }, 300);
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    updateLoader();

    const btnShowProjects = document.getElementById('btn-show-projects');
    const projectsContainer = document.getElementById('projects-container');

    btnShowProjects.addEventListener('click', () => {
        if (projectsContainer.style.display === 'none' || projectsContainer.style.display === '') {
            projectsContainer.style.display = 'grid';
            btnShowProjects.innerHTML = '<i class="fas fa-folder-minus mr-2"></i> OCULTAR PROYECTOS';
        } else {
            projectsContainer.style.display = 'none';
            btnShowProjects.innerHTML = '<i class="fas fa-folder-open mr-2"></i> INICIAR PROYECTOS';
        }
    });

    const btnShowCerts = document.getElementById('btn-show-certs');
    const certsContainer = document.getElementById('certs-container');

    if (btnShowCerts && certsContainer) {
        btnShowCerts.addEventListener('click', () => {
            if (certsContainer.style.display === 'none' || certsContainer.style.display === '') {
                certsContainer.style.display = 'grid';
                btnShowCerts.innerHTML = '<i class="fas fa-certificate mr-2"></i> OCULTAR CERTIFICADOS';
            } else {
                certsContainer.style.display = 'none';
                btnShowCerts.innerHTML = '<i class="fas fa-certificate mr-2"></i> ABRIR CERTIFICADOS';
            }
        });
    }

    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-certificate-img');
    const certButtons = document.querySelectorAll('.view-cert-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openModal(imgSrc, title) {
        modalImg.src = imgSrc;
        modalImg.alt = title;

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');

        void modal.offsetWidth;
        modal.classList.add('opacity-100');

        body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('opacity-100');
        body.classList.remove('modal-open');

        modal.addEventListener('transitionend', function handler() {
            modal.classList.remove('flex', 'items-center', 'justify-center');
            modal.classList.add('hidden');
            modal.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    certButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const title = e.currentTarget.getAttribute('data-title');
            const imgSrc = e.currentTarget.getAttribute('data-img-src');

            let finalImgSrc;

            if (imgSrc) {
                finalImgSrc = imgSrc;
            } else {
                finalImgSrc = `https://placehold.co/800x600/000/ccff00?text=${encodeURIComponent(title)} - SIN IMAGEN`;
            }

            openModal(finalImgSrc, title);
        });
    });

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('flex')) {
                closeModal();
            }
        });
    }

}

window.onload = initLoaderAndContent;

let lastParticleTime = 0;
const particleInterval = 30;

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle';

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0.5)';
        particle.style.left = `${x + (Math.random() - 0.5) * 50}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 50}px`;
    }, 10);

    setTimeout(() => {
        particle.remove();
    }, 600);
}

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (!document.getElementById('certificate-modal').classList.contains('flex') && currentTime - lastParticleTime > particleInterval) {
        lastParticleTime = currentTime;
        createParticle(e.clientX, e.clientY);
    }
});