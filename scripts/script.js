let developers = [];
let editingId = null;

function renderDevelopers() {
    const list = document.getElementById('devList');
    list.innerHTML = developers.map(dev => `
                <div class="dev-card" id="dev-${dev.id}">
                    <h3>${dev.name}</h3>
                    <p>${dev.bio}</p>
                    <div class="links">
                        ${dev.links.map(link => `
                            <a href="${link.url}" target="_blank">${link.name}</a>
                        `).join('')}
                    </div>
                    <button onclick="editDeveloper('${dev.id}')">Edit</button>
                    <button class="delete" onclick="deleteDeveloper('${dev.id}')">Delete</button>
                </div>
            `).join('');
}

function showAddForm() {
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Developer';
    document.getElementById('devId').value = '';
    document.getElementById('devName').value = '';
    document.getElementById('devBio').value = '';
    editingId = null;
}

function editDeveloper(id) {
    const dev = developers.find(d => d.id === id);
    if (!dev) return;

    document.getElementById('editForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Edit Developer';
    document.getElementById('devId').value = dev.id;
    document.getElementById('devName').value = dev.name;
    document.getElementById('devBio').value = dev.bio;
    editingId = id;

    const linkFields = document.getElementById('linkFields');
    linkFields.innerHTML = '';
    dev.links.forEach(link => {
        addLinkField(link.name, link.url);
    });
}

function saveDeveloper() {
    const id = document.getElementById('devId').value || Date.now().toString();
    const name = document.getElementById('devName').value;
    const bio = document.getElementById('devBio').value;

    const links = [];
    document.querySelectorAll('.link-name').forEach((nameField, index) => {
        const urlField = document.querySelectorAll('.link-url')[index];
        if (nameField.value && urlField.value) {
            links.push({
                name: nameField.value,
                url: urlField.value
            });
        }
    });

    const newDev = { id, name, bio, links };

    if (editingId) {
        const index = developers.findIndex(d => d.id === editingId);
        developers[index] = newDev;
    } else {
        developers.push(newDev);
    }

    renderDevelopers();
    cancelEdit();
}

function deleteDeveloper(id) {
    developers = developers.filter(d => d.id !== id);
    renderDevelopers();
}

function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
}

function addLinkField(name = '', url = '') {
    const linkFields = document.getElementById('linkFields');
    const newField = document.createElement('div');
    newField.innerHTML = `
                <input type="text" class="link-name" placeholder="Link name" value="${name}">
                <input type="url" class="link-url" placeholder="https://example.com" value="${url}">
            `;
    linkFields.appendChild(newField);
}

renderDevelopers();