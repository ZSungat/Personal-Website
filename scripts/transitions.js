let transitionInProgress = false;

function handleProjectsTransition(show = true) {
    if (transitionInProgress) return;
    transitionInProgress = true;

    const originalSpeed = window.GalaxyStars.getConfig().speed;
    const contentDiv = document.querySelector('.content');
    const containerDiv = document.querySelector('.container');
    const existingProjectsContainer = document.querySelector('.projects-container');

    if (show) {
        window.GalaxyStars.setSpeed(8);
        contentDiv.classList.add('zoom-out');

        fetch('projects/main.html')
            .then(response => response.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;

                const projectsContainer = temp.querySelector('.projects-container');
                const projectsContent = projectsContainer.innerHTML;

                if (!existingProjectsContainer) {
                    const newProjectsContainer = document.createElement('div');
                    newProjectsContainer.className = 'projects-container';
                    newProjectsContainer.innerHTML = projectsContent;

                    document.body.insertBefore(newProjectsContainer, containerDiv);

                    const scripts = temp.getElementsByTagName('script');
                    for (let script of scripts) {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.body.appendChild(newScript);
                    }
                }

                setTimeout(() => {
                    const newProjectsContainer = document.querySelector('.projects-container');
                    newProjectsContainer.classList.add('visible');
                    contentDiv.style.display = 'none';

                    setTimeout(() => {
                        window.GalaxyStars.setSpeed(originalSpeed);
                        transitionInProgress = false;
                    }, 500);
                }, 500);
            })
            .catch(error => {
                console.error('Error loading projects page:', error);
                contentDiv.classList.remove('zoom-out');
                window.GalaxyStars.setSpeed(originalSpeed);
                transitionInProgress = false;
            });
    } else {
        window.GalaxyStars.setSpeed(8);

        if (existingProjectsContainer) {
            existingProjectsContainer.classList.remove('visible');
            contentDiv.style.display = 'block';

            setTimeout(() => {
                existingProjectsContainer.remove();
                transitionInProgress = false;
                contentDiv.classList.remove('zoom-out');
                setTimeout(() => {
                    window.GalaxyStars.setSpeed(originalSpeed);
                }, 1100);
            }, 150);

        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const projectsLink = document.getElementById('Projects');
    if (projectsLink) {
        projectsLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleProjectsTransition(true);
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.back-button')) {
            e.preventDefault();
            handleProjectsTransition(false);
        }
    });

    const toggleButton = document.createElement('img');
    toggleButton.src = '../images/Dance.avif';
    toggleButton.alt = 'Toggle dance mode';
    toggleButton.className = 'toggle-button';

    toggleButton.addEventListener('click', () => {
        const isColorMode = window.GalaxyStars.toggleColorMode();
        toggleButton.classList.toggle('active', isColorMode);
    });

    document.body.appendChild(toggleButton);
});