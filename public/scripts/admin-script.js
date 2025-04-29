// Global variables
let currentContributors = [];
let currentContributorId = null;
let contributorModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modal
    contributorModal = new bootstrap.Modal(document.getElementById('contributorModal'));
    
    // Load contributors
    fetchContributors();
    
    // Setup event listeners
    document.getElementById('approveBtn').addEventListener('click', () => updateContributorStatus('approved'));
    document.getElementById('rejectBtn').addEventListener('click', () => updateContributorStatus('rejected'));
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            const filter = this.getAttribute('data-filter');
            renderContributors(filter);
        });
    });
});

// Fetch all contributors from API
async function fetchContributors() {
    try {
        const response = await fetch('/api/contributors');
        if (!response.ok) {
            throw new Error('Failed to fetch contributors');
        }
        
        currentContributors = await response.json();
        updateCounts();
        renderContributors('all'); // Show all by default
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contributorsList').innerHTML = `
            <div class="col-12 console.log console.log-danger">
                Failed to load contributors. Please try again later.
            </div>
        `;
    }
}

// Update counts for each category
function updateCounts() {
    const all = currentContributors.length;
    const pending = currentContributors.filter(c => c.status === 'pending').length;
    const approved = currentContributors.filter(c => c.status === 'approved').length;
    const rejected = currentContributors.filter(c => c.status === 'rejected').length;
    
    document.getElementById('allCount').textContent = all;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
}

// Render contributors based on filter
function renderContributors(filter) {
    const contributorsListEl = document.getElementById('contributorsList');
    contributorsListEl.innerHTML = '';
    
    let filteredContributors = currentContributors;
    
    if (filter !== 'all') {
        filteredContributors = currentContributors.filter(c => c.status === filter);
    }
    
    if (filteredContributors.length === 0) {
        contributorsListEl.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="mt-2">No ${filter === 'all' ? '' : filter} contributors found.</p>
            </div>
        `;
        return;
    }
    
    filteredContributors.forEach(contributor => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        
        let statusClass, statusBadge;
        switch (contributor.status) {
            case 'pending':
                statusClass = 'card-header-pending';
                statusBadge = '<span class="badge bg-warning">Pending</span>';
                break;
            case 'approved':
                statusClass = 'card-header-approved';
                statusBadge = '<span class="badge bg-success">Approved</span>';
                break;
            case 'rejected':
                statusClass = 'card-header-rejected';
                statusBadge = '<span class="badge bg-danger">Rejected</span>';
                break;
        }
        
        // Format date
        const submittedDate = new Date(contributor.createdAt).toLocaleDateString();
        
        card.innerHTML = `
            <div class="card contributor-card">
                <div class="card-header ${statusClass} d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${contributor.name}</h5>
                    ${statusBadge}
                </div>
                <div class="card-body">
                    <p class="card-text text-truncate">${contributor.bio}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Submitted: ${submittedDate}</small>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary view-details" data-id="${contributor._id}">
                                <i class="bi bi-eye"></i> View
                            </button>
                            <button class="btn btn-sm btn-danger delete-contributor" data-id="${contributor._id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contributorsListEl.appendChild(card);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showContributorDetails(id);
        });
    });
    
    document.querySelectorAll('.delete-contributor').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteContributor(id);
        });
    });
}

// Show contributor details in modal
function showContributorDetails(id) {
    const contributor = currentContributors.find(c => c._id === id);
    if (!contributor) return;
    
    currentContributorId = id;
    
    const modalBody = document.getElementById('contributorModalBody');
    
    // Format the submitted date
    const submittedDate = new Date(contributor.createdAt).toLocaleString();
    
    modalBody.innerHTML = `
        <div class="row mb-3">
            <div class="col-md-3 fw-bold">Name:</div>
            <div class="col-md-9">${contributor.name}</div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3 fw-bold">Email:</div>
            <div class="col-md-9">${contributor.email}</div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3 fw-bold">Website:</div>
            <div class="col-md-9">
                ${contributor.website ? `<a href="${contributor.website}" target="_blank">${contributor.website}</a>` : 'Not provided'}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3 fw-bold">Bio:</div>
            <div class="col-md-9">${contributor.bio}</div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3 fw-bold">Status:</div>
            <div class="col-md-9">
                ${getStatusBadge(contributor.status)}
            </div>
        </div>
        <div class="row">
            <div class="col-md-3 fw-bold">Submitted:</div>
            <div class="col-md-9">${submittedDate}</div>
        </div>
    `;
    
    // Show/hide appropriate buttons based on current status
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    
    if (contributor.status === 'approved') {
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'block';
    } else if (contributor.status === 'rejected') {
        approveBtn.style.display = 'block';
        rejectBtn.style.display = 'none';
    } else {
        approveBtn.style.display = 'block';
        rejectBtn.style.display = 'block';
    }
    
    contributorModal.show();
}

// Helper function to generate status badge HTML
function getStatusBadge(status) {
    switch (status) {
        case 'pending':
            return '<span class="badge bg-warning">Pending Review</span>';
        case 'approved':
            return '<span class="badge bg-success">Approved</span>';
        case 'rejected':
            return '<span class="badge bg-danger">Rejected</span>';
        default:
            return '<span class="badge bg-secondary">Unknown</span>';
    }
}

// Update contributor status
async function updateContributorStatus(status) {
    if (!currentContributorId) return;
    
    try {
        const response = await fetch(`/api/contributors/${currentContributorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update contributor status');
        }
        
        // Update local data
        const index = currentContributors.findIndex(c => c._id === currentContributorId);
        if (index !== -1) {
            currentContributors[index].status = status;
        }
        
        // Refresh the view
        updateCounts();
        renderContributors(document.querySelector('[data-filter].active').getAttribute('data-filter'));
        
        // Hide modal
        contributorModal.hide();
        
        // Show success message
        console.log(`Contributor ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
        console.error('Error:', error);
        console.log('Failed to update contributor status. Please try again.');
    }
}

// Delete contributor
async function deleteContributor(id) {
    if (!confirm('Are you sure you want to delete this contributor?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/contributors/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete contributor');
        }
        
        // Remove from local data
        currentContributors = currentContributors.filter(c => c._id !== id);
        
        // Refresh the view
        updateCounts();
        renderContributors(document.querySelector('[data-filter].active').getAttribute('data-filter'));
        
        // Show success message
        console.log('Contributor deleted successfully!');
    } catch (error) {
        console.error('Error:', error);
        console.log('Failed to delete contributor. Please try again.');
    }
}
;


