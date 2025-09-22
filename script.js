document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('enrollModal');
  const titleEl = document.getElementById('enrollModalLabel');
  const form = document.getElementById('enrollForm');

  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', ev => {
      const trigger = ev.relatedTarget;
      const w = trigger && trigger.getAttribute('data-workshop');
      titleEl.textContent = w ? 'Enroll: ' + w : 'Enroll';
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // simple demo submit handler
      form.reset();
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance && modalInstance.hide();
    });
  }
});