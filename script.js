const API_KEY = "AIzaSyClnslf14xln1KMJ9khD8WCj7eIeB2Um1M"; 

const analyzeBtn = document.getElementById('analyzeBtn');
const userInput = document.getElementById('userInput');
const output = document.getElementById('output');
const loader = document.getElementById('loader');

async function getTravelInsights() {
    const city = userInput.value.trim();
    if (!city) return;

    analyzeBtn.disabled = true;
    loader.style.display = "block";
    output.style.opacity = "0.3";

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

   const promptText = `Ти — досвідчений мандрівник-дослідник. Напиши звіт для міста: ${city}. 

МОВА: Українська. 
СТИЛЬ: Надихаючий, живий, з використанням емодзі.

ВАЖЛИВО: Починай ВІДРАЗУ з контенту. НЕ ПИШИ вступних фраз на кшталт "Згідно з вашим запитом", "Ось звіт" або "Я підготував...". Тільки чиста інформація за структурою.

СТРУКТУРА:
1. 🏙 **Атмосфера міста**: 2-3 речення про його характер.
2. 💎 **ТОП-3 безкоштовні локації**: 
   * **Назва** — Суть. 
   * *Порада від профі:* (секретна деталь).
3. 🥨 **Гастро-знахідка**: Один продукт/страва з супермаркету, щоб відчути смак регіону.
4. 💡 **Економічний лайфхак**: Як реально зберегти кошти саме тут.

Використовуй тільки Markdown для оформлення.`;

    try {
        console.log("Запит надіслано..."); // Побачиш у консолі (F12)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        console.log("Відповідь отримана:", data); // ТУТ ми побачимо все

        if (data.error) {
            output.innerHTML = `Помилка API: ${data.error.message} (Код: ${data.error.code})`;
            return;
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const rawText = data.candidates[0].content.parts[0].text;
            
            // Перевірка чи є бібліотека marked
            if (typeof marked !== 'undefined') {
                output.innerHTML = marked.parse(rawText);
            } else {
                output.innerHTML = rawText.replace(/\n/g, '<br>'); // Вивід як текст, якщо marked не підключено
            }
        } else {
            output.innerHTML = "API повернуло неочікувану структуру. Перевір консоль (F12).";
        }

    } catch (e) {
        console.error("Критична помилка:", e);
        output.innerHTML = `Критична помилка: ${e.message}`;
    }
     finally {
        analyzeBtn.disabled = false;
        loader.style.display = "none";
        output.style.opacity = "1";
    }
}

analyzeBtn.addEventListener('click', getTravelInsights);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') getTravelInsights(); });