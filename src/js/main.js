const sections = document.querySelectorAll('.section');
const $currentSectionBar = document.querySelector('.current-section');
const $currentScrollBar = document.querySelector('.current-scroll');
const $navBar = document.querySelector('header nav');
let currentSection = 0;
let isScrolling = false;
let scrollDelta = 0; // Acumula el desplazamiento



// Umbral para detectar un cambio de sección
const scrollThreshold = 600;

// Función para mostrar una sección específica
function showSection(index) {
    sections.forEach((section, i) => {
        if (i === index) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Función para manejar el scroll
function handleSectionsScroll(deltaY) {
    if (isScrolling) return; // Previene scroll hasta que termine la animación
    // if(event.deltaY > 0 && currentSection === sections.length - 1) return;
    // Acumula el desplazamiento
    // scrollDelta += event.deltaY;
    scrollDelta += deltaY;

    // Si se supera el umbral, cambia de sección
    if (scrollDelta > scrollThreshold && currentSection < sections.length - 1) {
        // currentSection++;
        scrollToSection(++currentSection);
    } else if (scrollDelta < -scrollThreshold && currentSection > 0) {
        // currentSection--;
        scrollToSection(--currentSection);
    } else if (scrollDelta > scrollThreshold && currentSection === sections.length - 1) {
        // currentSection = 0;
        scrollToSection(0);
    } else if (scrollDelta < -scrollThreshold && currentSection === 0) {
        // currentSection = sections.length - 1;
        scrollToSection(sections.length - 1);
    }

    $currentSectionBar.style.width = `${((currentSection + 1) / (sections.length)) * 100}%`;
    $currentScrollBar.style.width = `${50 + (scrollDelta / (2 * scrollThreshold)) * 100}%`;
    // $currentScrollBar.style.width = `${Math.abs(scrollDelta) / (scrollThreshold) * 100}%`;
}

// Función para manejar la animación y bloquear el scroll
function scrollToSection(section = null) {
    if(section !== null) currentSection = section

    scrollDelta = 0;
    $currentScrollBar.style.transition = 'width 0.4s';
    setTimeout(() => {
        $currentScrollBar.style.removeProperty('transition');
    }, 400);

    $currentSectionBar.style.width = `${((currentSection + 1) / (sections.length)) * 100}%`;
    $currentScrollBar.style.width = `${50 + (scrollDelta / (2 * scrollThreshold)) * 100}%`;

    isScrolling = true;


    showSection(section ?? currentSection);

    // Desbloquea el scroll después de la animación
    setTimeout(() => {
        isScrolling = false;
    }, 600); // Duración de la animación en CSS
}

function handleWhenScrollable(target, deltaY = 0){
    if(typeof deltaY == 'function')
        deltaY = deltaY()

    if(!target.closest('.scrollable'))
        handleSectionsScroll(deltaY)
}

// Escucha el evento de scroll
window.addEventListener('wheel', e =>
    handleWhenScrollable(e.target, () => Math.min(25, Math.max(-25, e.deltaY)))
);

let lastTouchY = 0;

window.addEventListener('touchstart', e => {
    lastTouchY = e.touches[0].clientY;
});

window.addEventListener('touchmove', e => {
    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY;
    handleWhenScrollable(e.target, deltaY);
    lastTouchY = currentTouchY;
});

$navBar.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        if(event.target.id == 'print'){
            event.preventDefault();
            window.print();
            return
        }
        scrollToSection(getSectionIdByName(event.target.id));
    }
})

function getSectionIdByName(name){
    let sectionIndex = 0;
    switch (name) {
        case 'about':
            sectionIndex = 0;
            break;
        case 'projects':
            sectionIndex = 1;
            break;
        case 'skills':
            sectionIndex = 2;
            break;
        case 'contact':
            sectionIndex = 3;
            break;
    }
    return sectionIndex;
}


$currentSectionBar.style.width = `${((currentSection + 1) / (sections.length)) * 100}%`;
$currentScrollBar.style.width = `${50 + (scrollDelta / (2 * scrollThreshold)) * 100}%`;

if(window.location.hash){
    currentSection = getSectionIdByName(window.location.hash.substring(1));
}

// Inicializa la primera sección como activa
setTimeout(() => {
scrollToSection(currentSection);
}, 100);


const scrollables = document.querySelectorAll('.scrollable');

function handleScrollables() {
    scrollables.forEach(scrollable => {
        const containerHeight = scrollable.clientHeight;
        const contentHeight = scrollable.scrollHeight;
    
        if (contentHeight > containerHeight) {
            scrollable.classList.add('scrolling');
        } else {
            scrollable.classList.remove('scrolling');
        }
    })
}
window.addEventListener('resize', handleScrollables);
handleScrollables();
setTimeout(() => {
    handleScrollables();
}, 610);



// const resizeObserver = new ResizeObserver(handleScrollables);
// scrollables.forEach(scrollable => {
//     resizeObserver.observe(scrollable);
// });

// function handleScrollables(entries) {
//     entries.forEach(entry => {
//         const containerHeight = entry.target.clientHeight;
//         const contentHeight = entry.target.scrollHeight;

//         if (contentHeight > containerHeight) {
//             entry.target.classList.add('scrolling');
//         } else {
//             entry.target.classList.remove('scrolling');
//         }
//     });
// }


 
// Evita que se arrastren imágenes
document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});



let aboutContainerIndex = 0

const $aboutSection = document.querySelector('#section-about')
const $aboutContainer = $aboutSection.querySelector('.container')
const $aboutSectionArrow = $aboutSection.querySelector('.container-arrow')

function handleAboutContainer(newIndex){
    aboutContainerIndex = newIndex

    $aboutSectionArrow.classList.remove(aboutContainerIndex === 0 ? 'left-arrow' : 'right-arrow')
    $aboutSectionArrow.classList.add(aboutContainerIndex === 0 ? 'right-arrow' : 'left-arrow')
    $aboutContainer.style.left = aboutContainerIndex === 0 ? 0 : -85 + 'vw'
}



$aboutSectionArrow.addEventListener('click', (event) => {
    

    handleAboutContainer(aboutContainerIndex === 0 ? 1 : 0)
})

handleAboutContainer(0)