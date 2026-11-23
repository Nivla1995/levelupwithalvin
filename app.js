(function () {
  "use strict";

  const lessons = window.SPEAK_LESSONS || [];
  const main = document.getElementById("main");
  const progressKey = "speak-better-with-alvin-completed-v1";
  document.getElementById("year").textContent = String(new Date().getFullYear());

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function getCompleted() {
    try {
      const value = JSON.parse(localStorage.getItem(progressKey) || "[]");
      return Array.isArray(value) ? value.filter(n => Number.isInteger(n) && n >= 1 && n <= lessons.length) : [];
    } catch (_) { return []; }
  }

  function saveCompleted(completed) {
    try { localStorage.setItem(progressKey, JSON.stringify(completed)); } catch (_) { /* Progress is optional. */ }
  }

  function lessonUrl(id) { return `#lesson-${String(id).padStart(2, "0")}`; }

  function lessonCards() {
    const completed = new Set(getCompleted());
    return lessons.map(lesson => `
      <a class="lesson-card ${lesson.id === 1 ? "featured" : ""}" href="${lessonUrl(lesson.id)}" aria-label="Lesson ${lesson.id}: ${escapeHtml(lesson.title)}">
        <span class="lesson-number">Lesson ${lesson.id} · ${lesson.minutes} min</span>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.category)}</p>
        <span class="status ${completed.has(lesson.id) ? "done" : ""}">${completed.has(lesson.id) ? "✓ Completed" : "Open lesson"}</span>
      </a>`).join("");
  }

  function home() {
    main.innerHTML = `
      <section class="shell hero" id="home">
        <div>
          <span class="eyebrow">A Level Up with Alvin learning guide</span>
          <h1>Speak better English, one conversation at a time.</h1>
          <p>Short lessons, real situations, and small speaking challenges. Start with the words you already know, and practice at your own pace.</p>
          <div class="hero-actions"><a class="button" href="${lessonUrl(1)}">Start lesson 1</a><span class="hero-note">Free · No account · About 5 minutes per lesson</span></div>
        </div>
        <div class="conversation-preview" aria-label="Example conversation"><div class="preview-top"><span>Practice preview</span><span>Lesson 3</span></div><div class="bubble">How was your weekend?</div><div class="bubble reply">It was good! I visited my family. How about yours?</div><div class="preview-bottom">A small follow-up keeps the conversation moving.</div></div>
      </section>
      <section class="section section-tint" id="lessons"><div class="shell"><div class="section-heading"><div><span class="eyebrow">Your learning path</span><h2>Start with a conversation.</h2></div><p>Fourteen original lessons. Begin anywhere and return whenever you like.</p></div><div class="lesson-grid">${lessonCards()}</div><p class="path-note">The first seven lessons build the basics. The next seven help you use them in longer, real-life conversations.</p></div></section>
      <section class="section"><div class="shell"><div class="section-heading"><div><span class="eyebrow">How it works</span><h2>Learn it. Say it. Make it yours.</h2></div></div><div class="how-grid"><div class="how-item"><span>01 / Read</span><h3>See a real situation</h3><p>Start with a short, original dialogue and one clear idea to try.</p></div><div class="how-item"><span>02 / Speak</span><h3>Answer out loud</h3><p>Use the prompt to speak with the words you have right now.</p></div><div class="how-item"><span>03 / Repeat</span><h3>Try it your way</h3><p>Say it again with your own details. Clarity grows through practice.</p></div></div></div></section>
      <section class="section section-tint"><div class="shell practice-strip"><div><span class="eyebrow">A quick taste</span><h2>Your voice is the practice.</h2><p class="muted">There is no test to pass. Use a simple sentence, pause if you need to, and finish your thought.</p><a class="text-link" href="${lessonUrl(1)}">Try your first lesson</a></div><div class="practice-card"><strong>Try this out loud</strong><blockquote>Tell someone one thing you enjoyed this week, then ask about theirs.</blockquote><small>No perfect answer needed. Just start speaking.</small></div></div></section>
      <section class="section"><div class="shell"><div class="section-heading"><div><span class="eyebrow">More support</span><h2>Words for the moments you get stuck.</h2></div><p>Keep a few useful phrases nearby when you practice.</p></div><a class="button secondary" href="#phrases">Explore useful phrases</a></div></section>`;
  }

  function renderLesson(lesson) {
    const completed = new Set(getCompleted());
    const percent = Math.round(completed.size / lessons.length * 100);
    const previous = lessons[lesson.id - 2];
    const next = lessons[lesson.id];
    main.innerHTML = `
      <div class="shell page-intro"><span class="eyebrow">${escapeHtml(lesson.category)} · Lesson ${lesson.id} of ${lessons.length}</span><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.promise)}</p></div>
      <div class="shell lesson-layout"><article class="lesson-article">
        <h2>The situation</h2><p class="lead">${escapeHtml(lesson.situation)}</p>
        <h2>Read the exchange</h2><div class="dialogue">${lesson.dialogue.map(([speaker, line]) => `<div class="dialogue-line"><span class="speaker">${escapeHtml(speaker)}</span><span>${escapeHtml(line)}</span></div>`).join("")}</div>
        <h2>The speaking idea</h2><div class="callout">${escapeHtml(lesson.idea)}</div>
        <h2>Useful phrases</h2><ul class="phrase-list">${lesson.phrases.map(phrase => `<li>${escapeHtml(phrase)}</li>`).join("")}</ul>
        <h2>Practice in three steps</h2><ol class="steps-list">${lesson.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h2>Your turn</h2><div class="prompt-card"><strong>Say this aloud</strong><p>${escapeHtml(lesson.prompt)}</p></div>
        <h2>One possible answer</h2><p class="muted">Try your own answer before reading this. Yours does not need to sound the same.</p><div class="example-answer">“${escapeHtml(lesson.example)}”</div>
        <h2>Check your message</h2><ul class="check-list">${lesson.check.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="completion"><h3>Done practicing?</h3><p>Mark this lesson complete on this device. You can always come back and practice again.</p><button class="button ${completed.has(lesson.id) ? "secondary" : "dark"}" id="complete-button" type="button" aria-pressed="${completed.has(lesson.id)}">${completed.has(lesson.id) ? "Completed ✓" : "Mark lesson complete"}</button>${next ? `<a class="text-link" href="${lessonUrl(next.id)}">Next lesson: ${escapeHtml(next.title)}</a>` : `<a class="text-link" href="#lessons">Browse all lessons</a>`}</div>
      </article><aside class="lesson-sidebar" aria-label="Lesson progress"><h3>Your progress</h3><p id="progress-copy">${completed.size} of ${lessons.length} lessons completed</p><div class="mini-progress" role="progressbar" aria-label="Lessons completed" aria-valuenow="${completed.size}" aria-valuemin="0" aria-valuemax="${lessons.length}"><span style="width:${percent}%"></span></div><p>Saved only in this browser. No sign-in or upload.</p><div class="sidebar-links"><a href="#lessons">All lessons</a>${previous ? `<a href="${lessonUrl(previous.id)}">Previous lesson</a>` : ""}${next ? `<a href="${lessonUrl(next.id)}">Next lesson</a>` : ""}</div></aside></div>`;
    document.getElementById("complete-button").addEventListener("click", () => {
      const state = new Set(getCompleted());
      if (state.has(lesson.id)) state.delete(lesson.id); else state.add(lesson.id);
      saveCompleted([...state].sort((a,b) => a-b));
      renderLesson(lesson);
      document.getElementById("complete-button").focus();
    });
  }

  const phraseGroups = [
    ["Starting a conversation", "Open with something relevant to the moment.", ["How did you hear about this?", "What do you enjoy doing on weekends?", "What made you interested in this?"]],
    ["Keeping it going", "Give a detail, then invite the other person back in.", ["That sounds interesting. What happened next?", "I've tried something similar. How was it for you?", "The best part was ___. How about you?"]],
    ["Finding your words", "Keep your thought moving when a word is missing.", ["It's the thing you use to ___.", "I mean the one that ___.", "Let me say that another way."]],
    ["Asking for clarity", "Check the part you missed.", ["Could you say that last part again?", "What do you mean by ___?", "Let me check if I understood: ___."]],
    ["Sharing a view", "Say what you think and why.", ["I think ___ because ___.", "In my experience, ___.", "One example is ___."]],
    ["Disagreeing kindly", "Keep the conversation open while sharing a concern.", ["I see why you think that.", "I'm concerned that ___.", "Could we try ___ instead?"]],
    ["Fixing a misunderstanding", "Restate the exact detail that needs changing.", ["Sorry, I wasn't clear.", "What I meant was ___.", "Just to confirm, ___."]],
    ["Ending a conversation", "Finish naturally and warmly.", ["It was nice talking with you.", "Thanks for explaining that.", "Let's catch up again soon."]]
  ];

  function renderPhrases() {
    main.innerHTML = `<div class="shell page-intro"><span class="eyebrow">Useful phrases</span><h1>Small phrases, more confident conversations.</h1><p>Use these as starting points. Change the words so they fit your situation and sound like you.</p></div><div class="shell phrase-groups">${phraseGroups.map(([title, description, phrases]) => `<section class="phrase-group"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p><ul>${phrases.map(phrase => `<li>${escapeHtml(phrase)}</li>`).join("")}</ul></section>`).join("")}</div>`;
  }

  function renderCoffee() {
    main.innerHTML = `<div class="shell page-intro"><span class="eyebrow">Support the guide</span><h1>Buy me a coffee.</h1><p>If these lessons help you speak with more confidence, you can support the next ones.</p></div><div class="shell coffee-layout"><div class="coffee-copy"><h2>Help me keep useful lessons free.</h2><p>I create Speak Better with Alvin so more people can practice English in a way that feels practical, welcoming, and possible after a busy day. Every lesson takes time to plan, write, design, and share.</p><p>If this guide has helped you, a small coffee through GCash is one way to support the work. It helps me keep creating meaningful lessons, examples, and videos that anyone can access for free.</p><p>Support is completely optional. You are welcome to use every lesson whether you donate or not. Thank you for learning with me and sharing the guide with someone who may need it.</p><div class="callout"><strong>How to send:</strong> Scan the QR code with GCash, or save the image and upload it in the GCash app. Please check the recipient shown in your app before confirming. Transfer fees may apply.</div><a class="button secondary" href="#lessons">Keep learning</a></div><div class="coffee-qr"><div class="qr-focus"><img src="assets/gcash-qr.jpg" width="1024" height="2032" alt="GCash personal payment QR for supporting Speak Better with Alvin. Confirm the recipient in your GCash app before sending."></div><a href="assets/gcash-qr.jpg" download="speak-better-with-alvin-gcash-qr.jpg">Save the full GCash QR image</a><small>Payments are handled in GCash. This website does not collect payment information.</small></div></div>`;
  }

  function route() {
    const hash = decodeURIComponent(location.hash.slice(1) || "home");
    const match = /^lesson-(\d{1,2})$/.exec(hash);
    let pageTitle = "Speak Better with Alvin";
    if (match) {
      const lesson = lessons.find(item => item.id === Number(match[1]));
      if (lesson) { renderLesson(lesson); pageTitle = lesson.title; } else renderNotFound();
    } else if (hash === "home" || hash === "lessons") {
      home();
    } else if (hash === "phrases") {
      renderPhrases();
      pageTitle = "Useful phrases";
    } else if (hash === "coffee") {
      renderCoffee();
      pageTitle = "Buy me a coffee";
    } else {
      renderNotFound();
      pageTitle = "Page not found";
    }
    document.title = `${pageTitle} | Level Up with Alvin`;
    if (hash === "lessons") document.getElementById("lessons")?.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  function renderNotFound() {
    main.innerHTML = `<div class="shell not-found"><h1>Page not found</h1><p>That page is not part of the guide.</p><a class="button" href="#home">Go to home</a></div>`;
  }

  window.addEventListener("hashchange", route);
  route();
})();
