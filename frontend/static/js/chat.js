document.addEventListener('DOMContentLoaded', function() {
    // === Все элементы интерфейса ===
    const chat = document.getElementById('chat');
    const centeredInput = document.getElementById('centeredInput');
    const bottomInput = document.getElementById('bottomInput');
    const promptCentered = document.getElementById('promptCentered');
    const promptBottom = document.getElementById('promptBottom');
    const sendBtnCentered = document.getElementById('sendBtnCentered');
    const sendBtnBottom = document.getElementById('sendBtnBottom');

    const MAX_LENGTH = 280;
    let isFlashActive = false;

    // === API запрос ===
    async function sendToAPI(text) {
        const response = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        return response.json();
    }

    // Проверка на английский через сервер
    async function isEnglish(text) {
        const response = await fetch("/api/check_english", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        if (!data.valid) {
            showError(data.error);
        }
        return data.valid;
    }

    // Строгая серверная проверка нижнего input
    async function checkInput(promptEl, promptBottom, text) {
        if (promptEl === promptBottom) {
            if (!(await isEnglish(text))) {
                return false;
            }
            if (text.length > MAX_LENGTH) {
                showError(`Text too long. Max ${MAX_LENGTH} characters allowed.`);
                return false;
            }
        }
        return true;
    }

    // ========= Авто-рост textarea =========
    function adjustHeight(el) {
        el.style.height = 'auto';
        const newHeight = Math.min(el.scrollHeight, 200);
        el.style.height = newHeight + 'px';

        const wrapper = el.closest('.input-wrapper');
        if (wrapper) {
            wrapper.style.minHeight = Math.max(56, newHeight + 16) + 'px';
        }
    }

    function updateSendButton(promptEl, sendBtn) {
        // Верхний input - без валидации
        if (promptEl === promptCentered) {
            sendBtn.disabled = promptEl.value.trim() === '';
        }
        // Нижний input - disabled по flash, иначе всегда активна
        else {
            sendBtn.disabled = isFlashActive || promptEl.value.trim() === '';
        }
    }

    // ========= FLASH-СООБЩЕНИЯ =========
    function showError(message) {
        let container = document.querySelector('.flash-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'flash-container';
            document.body.appendChild(container);
        }

        const flash = document.createElement('div');
        flash.className = 'flash-message flash-error';
        flash.textContent = message;

        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        flash.appendChild(closeBtn);

        container.appendChild(flash);
        isFlashActive = true;
        sendBtnBottom.disabled = true;

        closeBtn.addEventListener('click', () => {
            flash.remove();
            isFlashActive = false;
            updateSendButton(promptBottom, sendBtnBottom);
        });

        setTimeout(() => {
            flash.style.opacity = "0";
            setTimeout(() => {
                flash.remove();
                isFlashActive = false;
                updateSendButton(promptBottom, sendBtnBottom);
            }, 300);
        }, 5000);
    }

    // ========= Ввод и авторост, с валидацией =========
    [promptCentered].forEach(p => {
        p.addEventListener('input', () => {
            adjustHeight(p);
            updateSendButton(p, sendBtnCentered);
        });
        adjustHeight(p);
    });

    promptBottom.addEventListener('input', () => {
        adjustHeight(promptBottom);
        updateSendButton(promptBottom, sendBtnBottom);
    });
    adjustHeight(promptBottom);
    updateSendButton(promptBottom, sendBtnBottom);

    // ========= ОТПРАВКА СООБЩЕНИЯ =========
    async function sendMessage(promptEl, sendBtn) {
        const text = promptEl.value.trim();
        if (!text) return;

        // Вся проверка — через checkInput
        const valid = await checkInput(promptEl, promptBottom, text);
        if (promptEl === promptBottom && !valid) {
            // showError уже показан внутри checkInput
            return;
        }

        addMessage(text, promptEl === promptCentered ? 'user' : 'user');
        promptEl.value = '';
        adjustHeight(promptEl);
        updateSendButton(promptEl, sendBtn);

        document.body.classList.add('has-messages');
        promptBottom.focus();

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chat.appendChild(typingIndicator);
        scrollToBottom();

        // === реальный запрос ===
        try {
            const result = await sendToAPI(text);
            typingIndicator.remove();

            if (result.error) {
                showError(result.error);
                return;
            }

            const answer =
                `🧠 Sentiment: ${result.sentiment}\n` +
                `🎯 Confidence: ${result.confidence.toFixed(3)}`;

            addMessage(answer, 'ai');
            scrollToBottom();
        } catch(e) {
            typingIndicator.remove();
            showError("Network error");
        }
    }

    // ===== Обработчики enter для отправки =====
    promptCentered.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(promptCentered, sendBtnCentered);
        }
    });
    promptBottom.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(promptBottom, sendBtnBottom);
        }
    });

    sendBtnCentered.addEventListener('click', () => sendMessage(promptCentered, sendBtnCentered));
    sendBtnBottom.addEventListener('click', () => sendMessage(promptBottom, sendBtnBottom));

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        chat.appendChild(div);
        document.body.classList.add('has-messages');
        scrollToBottom();
    }

    function scrollToBottom() {
        chat.scrollTop = chat.scrollHeight;
    }

    window.addEventListener('load', () => {
        promptCentered.focus();
    });

    window.addEventListener('resize', () => {
        [promptCentered, promptBottom].forEach(p => adjustHeight(p));
    });
});