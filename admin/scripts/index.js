let toastCount = 0;

document.addEventListener("DOMContentLoaded", async function () {
    await loadToastsFromBackend();
});

document.getElementById('createToast').addEventListener('click', function () {
    const message = document.getElementById('toastMessage').value;
    const header = document.getElementById('toastHeader').value;
    const date = document.getElementById('toastDate').value;

    if (message && header && date) {
        createToast(header, message, date);
        toggleToastActions();
    }
});

function createToast(header, message, time) {
    const toastContainer = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.classList.add('toast');

    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
    toastHeader.innerHTML = `
        <strong>${header}</strong>
        <small>${time}</small>
        <button class="toast-close" onclick="removeToast(this)">&times;</button>
    `;

    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = message;

    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    toastContainer.appendChild(toast);
}

function removeToast(button) {
    button.closest('.toast').remove();
}

function toggleToastActions() {
    const toastContainer = document.getElementById('toastContainer');
    const toastActions = document.getElementById('toastActions');
    if (toastContainer.childElementCount > 0) {
        toastActions.style.display = 'block';
    } else {
        toastActions.style.display = 'none';
    }
}

document.getElementById('deleteToasts').addEventListener('click', async function () {
    await deleteAllToasts();
    const toastContainer = document.getElementById('toastContainer');
    toastContainer.innerHTML = '';
    toastCount = 0;
    toggleToastActions();
});

document.getElementById('saveToasts').addEventListener('click', async function () {
    const toasts = [];
    document.querySelectorAll('#toastContainer .toast').forEach(toast => {
        const header = toast.querySelector('.toast-header strong').innerText;
        const message = toast.querySelector('.toast-body').innerText;
        const date = toast.querySelector('.toast-header small').innerText;
        toasts.push({ header, message, date });
    });

    await saveToastsToBackend(toasts);
});

async function loadToastsFromBackend() {
    try {
        const response = await fetch('https://web-lr-6-backend-production.up.railway.app/api/getAll');
        const data = await response.json();

        console.log('Toasts loaded successfully:', data);
        data.forEach(toast => {
            const formattedDate = new Date(toast.date).toLocaleDateString();
            createToast(toast.header, toast.content, formattedDate);
        });
        toggleToastActions();
    } catch (error) {
        console.error('Error loading toasts:', error);
    }
}

async function saveToastsToBackend(toasts) {
    try {
        await deleteAllToasts();
        const body = JSON.stringify(toasts);
        const response = await fetch('https://web-lr-6-backend-production.up.railway.app/api/saveMultiple', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        const data = await response.json();
        console.log('Toasts saved successfully:', data);
    } catch (error) {
        console.error('Error saving toasts:', error);
    }
}

async function deleteAllToasts() {
    try {
        const response = await fetch('https://web-lr-6-backend-production.up.railway.app/api/deleteAll', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        const data = await response.json();
        console.log('All toasts deleted:', data);
    } catch (error) {
        console.error('Error deleting toasts:', error);
    }
}
