document.addEventListener("DOMContentLoaded", async function () {
    await loadToastsFromBackend();
    setInterval(loadToastsFromBackend, 50000);
});

async function createToast(header, message, time) {
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

async function loadToastsFromBackend() {
    removeAllToasts();

    try {
        const response = await fetch('https://web-lr-6-backend-production.up.railway.app/api/getAll');
        const data = await response.json();
        console.log('Toasts loaded successfully:', data);

        data.forEach(toast => {
            const formattedDate = new Date(toast.date).toLocaleDateString();
            createToast(toast.header, toast.content, formattedDate);
        });
    } catch (error) {
        console.error('Error loading toasts:', error);
    }
}


function removeAllToasts() {
    const toastContainer = document.getElementById('toastContainer');
    toastContainer.innerHTML = '';
}

function removeToast(button) {
    button.closest('.toast').remove();
}