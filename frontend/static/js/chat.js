document.addEventListener('DOMContentLoaded', function() {
    // === Все элементы интерфейса ===
    const chat = document.getElementById('chat');
    const centeredInput = document.getElementById('centeredInput');
    const bottomInput = document.getElementById('bottomInput');
    const promptCentered = document.getElementById('promptCentered');
    const promptBottom = document.getElementById('promptBottom');
    const sendBtnCentered = document.getElementById('sendBtnCentered');
    const sendBtnBottom = document.getElementById('sendBtnBottom');
    const counterCentered = document.getElementById('counterCentered');
    const counterBottom = document.getElementById('counterBottom');

    // MAX_LENGTH должен быть передан из шаблона:
    const MAX_LENGTH = (typeof window.MAX_LENGTH !== 'undefined') ? Number(window.MAX_LENGTH) : 280;

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

    // Проверка на английский через сервер (если у вас локальная проверка — замените)
    async function isEnglish(text) {
        try {
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
        } catch (e) {
            showError("Network error");
            return false;
        }
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

    // ====== ФУНКЦИЯ: updateCounter ======
    function updateCounter(textarea, counterEl) {
        if (!counterEl) return;
        const chars = textarea.value.length;
        counterEl.innerHTML = `<span class="${chars > MAX_LENGTH ? 'over' : ''}">${chars}</span>/${MAX_LENGTH}`;

        // Только для нижнего инпута — делаем класс warning при превышении
        if (textarea === promptBottom) {
            counterEl.classList.toggle('warning', chars > MAX_LENGTH);
        } else {
            counterEl.classList.remove('warning');
        }
    }

    function updateSendButton(promptEl, sendBtn) {
        // Верхний input — без валидации длины
        if (promptEl === promptCentered) {
            sendBtn.disabled = promptEl.value.trim() === '';
        }
        // Нижний input — отключаем кнопку при пустоте или превышении длины
        else {
            const text = promptEl.value.trim();
            const tooLong = promptEl.value.length > MAX_LENGTH;
            sendBtn.disabled = isFlashActive || text === '' || tooLong;
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
            updateCounter(promptBottom, counterBottom);
        });

        setTimeout(() => {
            flash.style.opacity = "0";
            setTimeout(() => {
                flash.remove();
                isFlashActive = false;
                updateSendButton(promptBottom, sendBtnBottom);
                updateCounter(promptBottom, counterBottom);
            }, 300);
        }, 5000);
    }

    // ========= Ввод и авто-рост, с обновлением счётчиков =========
    promptCentered.addEventListener('input', () => {
        adjustHeight(promptCentered);
        updateSendButton(promptCentered, sendBtnCentered);
        updateCounter(promptCentered, counterCentered);
    });

    promptBottom.addEventListener('input', () => {
        adjustHeight(promptBottom);
        updateSendButton(promptBottom, sendBtnBottom);
        updateCounter(promptBottom, counterBottom);
    });

    // Инициализация высот/кнопок/счётчиков
    adjustHeight(promptCentered);
    adjustHeight(promptBottom);
    updateSendButton(promptCentered, sendBtnCentered);
    updateSendButton(promptBottom, sendBtnBottom);

    // ========= ОТПРАВКА СООБЩЕНИЯ =========
    async function sendMessage(promptEl, sendBtn) {
        const text = promptEl.value.trim();
        if (!text) return;

        // Для нижнего input — проверяем на сервере (isEnglish) и длину
        if (promptEl === promptBottom) {
            const okEnglish = await isEnglish(text);
            if (!okEnglish) return;
            if (text.length > MAX_LENGTH) {
                showError(`Text too long. Max ${MAX_LENGTH} characters allowed.`);
                return;
            }
        }

        addMessage(text, 'user');
        promptEl.value = '';
        adjustHeight(promptEl);
        updateSendButton(promptEl, sendBtn);
        updateCounter(promptEl, promptEl === promptCentered ? counterCentered : counterBottom);

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

    updateCounter(promptCentered, counterCentered);
    updateCounter(promptBottom, counterBottom);
});