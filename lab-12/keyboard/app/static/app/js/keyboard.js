const keys = document.querySelectorAll('.key');
const status = document.querySelector('#status');

function markKey(event, pressed) {
    const key = document.querySelector(`[data-code="${event.code}"]`);

    if (!key) {
        status.textContent = `Tecla no identificada: ${event.key}`;
        return;
    }

    if (pressed) {
        key.classList.add('is-validated');
    }
    key.classList.toggle('is-pressed', pressed);
    if (pressed) {
        status.textContent = `Tecla detectada: ${event.key}`;
    }
}

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    markKey(event, true);
});

document.addEventListener('keyup', (event) => {
    event.preventDefault();
    markKey(event, false);
});