
document.querySelectorAll('.see-more-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        const grid = card.closest('.projects-grid');

        card.classList.add('expanded');
        grid.classList.add('has-expanded');

        const details = card.querySelector('.project-details');
        details.style.display = 'grid';

        setTimeout(() => {
            details.style.transform = 'translateX(0)';
        }, 50);
    });
});

document.querySelectorAll('.close-details').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        const details = card.querySelector('.project-details');
        const iframeContainer = details.querySelector('.iframe-container');
        const content = details.querySelector('.details-content');
        const images = details.querySelector('.details-images');

        if (iframeContainer && iframeContainer.style.display === 'block') {
            iframeContainer.classList.remove('visible');
            setTimeout(() => {
                iframeContainer.style.display = 'none';
                content.classList.remove('hidden');
                images.classList.remove('hidden');
            }, 500);
        } else {
            details.style.transform = 'translateX(100%)';
            setTimeout(() => {
                card.classList.remove('expanded');
                card.closest('.projects-grid').classList.remove('has-expanded');
                details.style.display = 'none';
                
                if (iframeContainer) {
                    iframeContainer.style.display = 'none';
                    iframeContainer.classList.remove('visible');
                    content.classList.remove('hidden');
                    images.classList.remove('hidden');
                }
            }, 500);
        }
    });
});

document.querySelectorAll('.demo-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = e.target.closest('.project-card');
        const details = card.querySelector('.project-details');
        const content = details.querySelector('.details-content');
        const images = details.querySelector('.details-images');
        
        let iframeContainer = details.querySelector('.iframe-container');
        if (!iframeContainer) {
            iframeContainer = document.createElement('div');
            iframeContainer.className = 'iframe-container';
            const iframe = document.createElement('iframe');
            iframe.src = 'https://zsungat.github.io/WebGL-Game/';
            iframeContainer.appendChild(iframe);
            details.appendChild(iframeContainer);
        }

        content.classList.add('hidden');
        images.classList.add('hidden');

        setTimeout(() => {
            iframeContainer.style.display = 'block';
            setTimeout(() => {
                iframeContainer.classList.add('visible');
            }, 50);
        }, 500);
    });
});