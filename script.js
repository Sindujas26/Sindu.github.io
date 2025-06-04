// Check if we're in edit mode based on URL parameter
function isEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('edit') === 'true';
}

// Initialize the page based on edit mode
function initializePage() {
    const editMode = isEditMode();
    document.querySelector('.edit-toggle').classList.toggle('hidden', !editMode);
    document.querySelector('.edit-mode-indicator').classList.toggle('hidden', !editMode);
    document.querySelector('.url-info').classList.toggle('hidden', !editMode);

    // Update URL info
    const currentUrl = window.location.href.split('?')[0];
    document.getElementById('edit-url').textContent = `${currentUrl}?edit=true`;
    document.getElementById('view-url').textContent = currentUrl;

    if (editMode) {
        loadSavedData();
    }

    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('show');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Add touch support for edit panel
    const editPanel = document.getElementById('editPanel');
    if (editPanel) {
        editPanel.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleEditPanel();
        });
    }

    // Handle window resize for edit panel
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            editPanel.classList.remove('open');
        }
    });
}

// Toggle edit panel
function toggleEditPanel() {
    const panel = document.getElementById('editPanel');
    if (panel) {
        panel.classList.toggle('open');
        
        // Close mobile menu if open
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
        }
        
        // Add touch support for closing
        if (panel.classList.contains('open')) {
            document.addEventListener('touchstart', handleTouchOutside, { once: true });
        } else {
            document.removeEventListener('touchstart', handleTouchOutside);
        }
    }
}

// Handle touch outside the edit panel
function handleTouchOutside(e) {
    const panel = document.getElementById('editPanel');
    if (panel && !panel.contains(e.target)) {
        toggleEditPanel();
    }
}

// Save changes to GitHub repository
async function saveChanges() {
    const data = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        industry: document.getElementById('edit-industry').value,
        specialty: document.getElementById('edit-specialty').value,
        role: document.getElementById('edit-role').value,
        experience: document.getElementById('edit-experience').value,
        field: document.getElementById('edit-field').value,
        specialization: document.getElementById('edit-specialization').value,
        companies: document.getElementById('edit-companies').value,
        interest: document.getElementById('edit-interest').value,
        skills: [
            {
                name: document.getElementById('edit-skill1-name').value,
                desc: document.getElementById('edit-skill1-desc').value
            },
            {
                name: document.getElementById('edit-skill2-name').value,
                desc: document.getElementById('edit-skill2-desc').value
            },
            {
                name: document.getElementById('edit-skill3-name').value,
                desc: document.getElementById('edit-skill3-desc').value
            },
            {
                name: document.getElementById('edit-skill4-name').value,
                desc: document.getElementById('edit-skill4-desc').value
            }
        ],
        projects: [
            {
                name: document.getElementById('edit-project1-name').value,
                desc: document.getElementById('edit-project1-desc').value,
                link: document.getElementById('edit-project1-link').value
            },
            {
                name: document.getElementById('edit-project2-name').value,
                desc: document.getElementById('edit-project2-desc').value,
                link: document.getElementById('edit-project2-link').value
            },
            {
                name: document.getElementById('edit-project3-name').value,
                desc: document.getElementById('edit-project3-desc').value,
                link: document.getElementById('edit-project3-link').value
            }
        ],
        contact: {
            email: document.getElementById('edit-email').value,
            linkedin: document.getElementById('edit-linkedin').value,
            github: document.getElementById('edit-github').value
        }
    };

    try {
        // Convert data to JSON string
        const jsonData = JSON.stringify(data, null, 2);
        
        // Create a new blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a temporary anchor element to download the file
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'portfolio-data.json';
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        
        // Show success message
        showSuccessMessage();
        
        // Update content immediately
        updateContent(data);
        
        // Instructions for the user
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = `
            <p style="color: #6366f1; margin-top: 1rem;">
                ✨ Your changes have been saved! To make them live:
            </p>
            <ol style="margin-left: 1rem; color: #6366f1;">
                <li>Upload the downloaded <code>portfolio-data.json</code> file to your GitHub repository</li>
                <li>Commit and push the changes</li>
                <li>Wait a few minutes for GitHub Pages to update</li>
            </ol>
        `;
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
    }
}

// Update content on the page
function updateContent(data) {
    // Update page title
    document.getElementById('page-title').textContent = `${data.name} - Professional Portfolio`;

    // Update navigation and hero section
    document.getElementById('nav-name').textContent = data.name;
    document.getElementById('hero-name').textContent = data.name;
    document.getElementById('hero-subtitle').textContent = 
        `${data.title} | ${data.industry} Expert | ${data.specialty}`;

    // Update about section
    document.getElementById('about-p1').textContent = 
        `Welcome to my professional portfolio. I'm a passionate ${data.role} with ${data.experience} years of experience in ${data.field}. I specialize in ${data.specialization} and have a proven track record of delivering innovative solutions that drive business growth.`;
    document.getElementById('about-p2').textContent =
        `Throughout my career, I've worked with ${data.companies}, always focusing on creating value through strategic thinking and technical excellence.`;
    document.getElementById('about-p3').textContent = 
        `When I'm not working, you'll find me ${data.interest} or exploring new technologies that can make a positive impact on businesses and communities.`;

    // Update skills
    data.skills.forEach((skill, index) => {
        document.getElementById(`skill${index + 1}-name`).textContent = skill.name;
        document.getElementById(`skill${index + 1}-desc`).textContent = skill.desc;
    });

    // Update projects
    data.projects.forEach((project, index) => {
        document.getElementById(`project${index + 1}-name`).textContent = project.name;
        document.getElementById(`project${index + 1}-desc`).textContent = project.desc;
        const link = document.getElementById(`project${index + 1}-link`);
        link.href = project.link;
        link.textContent = 'View Details →';
    });
}

// Load saved data from JSON file
async function loadSavedData() {
    try {
        const response = await fetch('portfolio-data.json');
        const data = await response.json();

        // Fill in edit form
        document.getElementById('edit-name').value = data.name || '';
        document.getElementById('edit-title').value = data.title || '';
        document.getElementById('edit-industry').value = data.industry || '';
        document.getElementById('edit-specialty').value = data.specialty || '';
        document.getElementById('edit-role').value = data.role || '';
        document.getElementById('edit-experience').value = data.experience || '';
        document.getElementById('edit-field').value = data.field || '';
        document.getElementById('edit-specialization').value = data.specialization || '';
        document.getElementById('edit-companies').value = data.companies || '';
        document.getElementById('edit-interest').value = data.interest || '';

        // Fill in skills
        data.skills.forEach((skill, index) => {
            document.getElementById(`edit-skill${index + 1}-name`).value = skill.name || '';
            document.getElementById(`edit-skill${index + 1}-desc`).value = skill.desc || '';
        });

        // Fill in projects
        data.projects.forEach((project, index) => {
            document.getElementById(`edit-project${index + 1}-name`).value = project.name || '';
            document.getElementById(`edit-project${index + 1}-desc`).value = project.desc || '';
            document.getElementById(`edit-project${index + 1}-link`).value = project.link || '';
        });

        // Fill in contact
        document.getElementById('edit-email').value = data.contact.email || '';
        document.getElementById('edit-linkedin').value = data.contact.linkedin || '';
        document.getElementById('edit-github').value = data.contact.github || '';

        // Update the page content
        updateContent(data);
    } catch (error) {
        console.error('Error loading data:', error);
        // If data file doesn't exist yet, use default values
        const defaultData = {
            name: '',
            title: '',
            industry: '',
            specialty: '',
            role: '',
            experience: '',
            field: '',
            specialization: '',
            companies: '',
            interest: '',
            skills: [{ name: '', desc: '' }, { name: '', desc: '' }, { name: '', desc: '' }, { name: '', desc: '' }],
            projects: [{ name: '', desc: '', link: '' }, { name: '', desc: '', link: '' }, { name: '', desc: '', link: '' }],
            contact: { email: '', linkedin: '', github: '' }
        };
        updateContent(defaultData);
    }
}

// Show success message
function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

// Export data
function exportData() {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(savedData);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "portfolio_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

// Reset to defaults
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
        localStorage.removeItem('portfolioData');
        window.location.reload();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializePage();
});

// Debug log to verify script loading
console.log('Script loaded successfully');

// Add error handling
window.onerror = function(msg, url, line, col, error) {
    console.error('Error:', msg, 'URL:', url, 'Line:', line, 'Col:', col, 'Error:', error);
    return false;
};

// Add event listener for errors
window.addEventListener('error', function(e) {
    console.error('Error event:', e);
}, true);
