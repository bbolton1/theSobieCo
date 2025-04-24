document.addEventListener('DOMContentLoaded', function () {
    // Fetch approved contributors
    fetchApprovedContributors();
});

async function fetchApprovedContributors() {
    try {
        const response = await fetch('/api/contributors/approved');
        if (!response.ok) {
            throw new Error('Failed to fetch contributors');
        }

        const contributors = await response.json();
        renderContributors(contributors);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contributorsGrid').innerHTML = `
                    <div class="col-12 alert alert-danger">
                        Failed to load contributors. Please try again later.
                    </div>
                `;
    }
}

function renderContributors(contributors) {
    const contributorsGrid = document.getElementById('contributorsGrid');
    contributorsGrid.innerHTML = '';

    if (contributors.length === 0) {
        contributorsGrid.innerHTML = `
                    <div class="col-12 no-contributors">
                        <i class="bi bi-people fs-1 text-muted"></i>
                        <h3 class="mt-3">No contributors yet</h3>
                        <p class="text-muted">Be the first to join our team!</p>
                    </div>
                `;
        return;
    }

    contributors.forEach(contributor => {
        const initials = getInitials(contributor.name);

        const contributorCard = document.createElement('div');
        contributorCard.className = 'col-md-6 col-lg-4';
        contributorCard.innerHTML = `
                    <div class="card contributor-card">
                        <div class="contributor-img">
                            ${initials}
                        </div>
                        <div class="card-body text-center">
                            <h5 class="contributor-name">${contributor.name}</h5>
                            <p class="contributor-bio">${truncateBio(contributor.bio, 150)}</p>
                            ${contributor.website ? `
                                <div class="contributor-links">
                                    <a href="${contributor.website}" target="_blank" class="website-link">
                                        <i class="bi bi-globe2"></i> My Website
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;

        contributorsGrid.appendChild(contributorCard);
    });
}

// Helper function to get initials from name
function getInitials(name) {
    if (!name) return '?';

    const names = name.split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Helper function to truncate bio text
function truncateBio(bio, maxLength) {
    if (!bio) return '';

    if (bio.length <= maxLength) {
        return bio;
    }

    return bio.substring(0, maxLength) + '...';
}