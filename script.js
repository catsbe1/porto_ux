document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('enrollModal');
  const titleEl = document.getElementById('enrollModalLabel');
  const form = document.getElementById('enrollForm');
  const contextInput = document.getElementById('enrollContext');
  const descEl = document.getElementById('enrollDescription');
  const successBox = document.getElementById('enrollSuccess');
  const submitBtn = document.getElementById('enrollSubmit');

  function formatDesc(raw) {
    if (!raw) return '';
    // Turn literal \n into real line breaks
    raw = raw.replace(/\\n/g, '\n');
    const lines = raw.split('\n').map(l => l.trim());
    let html = '';
    let list = [];
    lines.forEach(line => {
      if (!line) return;
      if (/^–\s+/.test(line)) {
        list.push(line.replace(/^–\s*/, ''));
        return;
      }
      // Close any open list before a normal paragraph
      if (list.length) {
        html += '<ul class="mb-3 ps-4">' +
          list.map(li => '<li>' + li + '</li>').join('') +
          '</ul>';
        list = [];
      }
      if (/what’s included:/i.test(line)) {
        html += '<p class="fw-semibold mb-2">' + line + '</p>';
      } else {
        html += '<p class="mb-3">' + line + '</p>';
      }
    });
    if (list.length) {
      html += '<ul class="mb-3 ps-4">' +
        list.map(li => '<li>' + li + '</li>').join('') +
        '</ul>';
    }
    return html;
  }

  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', ev => {
      const trigger = ev.relatedTarget;
      let titleText = trigger && trigger.getAttribute('data-workshop');
      const d = trigger && trigger.getAttribute('data-desc');
      if (titleEl) titleEl.textContent = titleText || '';
      if (contextInput) contextInput.value = titleText || '';
      if (descEl) descEl.innerHTML = d ? formatDesc(d) : '';
    });
  }

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);
      // Netlify requires form-name present
      if (!formData.get('form-name')) formData.set('form-name', 'enroll');

      try {
        await fetch('/', {
          method: 'POST',
            body: formData
        });

        form.classList.add('d-none');
        if (successBox) successBox.classList.remove('d-none');

      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enroll';
        }
        alert('There was a problem sending the form. Please try again.');
      }
    });
  }

  // Reset modal state each time it opens
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', () => {
      if (successBox) successBox.classList.add('d-none');
      if (form) form.classList.remove('d-none');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
      form && form.reset();
    });
  }

  // ...existing code (height sync etc)...
});