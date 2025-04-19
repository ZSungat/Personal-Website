const TRANSITION_SPEED = 8;
const ORIGINAL_SPEED_DELAY = 1000;
const PROJECTS_CONTAINER_VISIBLE_DELAY = 750;
const PROJECTS_CONTAINER_REMOVE_DELAY = 200;

let transitionInProgress = false;

const originalSpeed = window.GalaxyStars.getConfig().speed;

function handleProjectsTransition(show = true) {
    if (transitionInProgress) return;
    transitionInProgress = true;

    const contentDiv = document.querySelector('.content');
    const containerDiv = document.querySelector('.container');
    const existingProjectsContainer = document.querySelector('.projects-container');

    if (show) {
        window.GalaxyStars.setSpeed(TRANSITION_SPEED);
        contentDiv.classList.add('zoom-out');

        fetch('projects/main.html')
            .then(response => response.text())
            .then(html => {
                setTimeout(() => {
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

                    const newProjectsContainer = document.querySelector('.projects-container');
                    newProjectsContainer.classList.add('zoom-in');
                    contentDiv.style.display = 'none';

                }, PROJECTS_CONTAINER_VISIBLE_DELAY);
                setTimeout(() => {
                    window.GalaxyStars.setSpeed(originalSpeed);
                    transitionInProgress = false;

                }, ORIGINAL_SPEED_DELAY);
            })
            .catch(error => {
                console.error('Error loading projects page:', error);
                contentDiv.classList.remove('zoom-out');
                window.GalaxyStars.setSpeed(originalSpeed);
                transitionInProgress = false;
            });
    } else {
        window.GalaxyStars.setSpeed(TRANSITION_SPEED);

        if (existingProjectsContainer) {
            existingProjectsContainer.classList.remove('zoom-in');
            existingProjectsContainer.classList.add('zoom-out');
            contentDiv.style.display = 'block';

            setTimeout(() => {
                transitionInProgress = false;
                contentDiv.classList.remove('zoom-out');
                existingProjectsContainer.remove();
                setTimeout(() => {
                    window.GalaxyStars.setSpeed(originalSpeed);
                }, ORIGINAL_SPEED_DELAY);
            }, PROJECTS_CONTAINER_REMOVE_DELAY);
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
        if( isColorMode) {
            window.GalaxyStars.setSpeed(TRANSITION_SPEED);
        }
        else {
            window.GalaxyStars.setSpeed(originalSpeed);
        }
        
    });
    document.body.appendChild(toggleButton);
});