// ============================================================
//  CONTACTO.JS — Validación y envío del formulario
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const form      = document.getElementById('formContacto')
  const btnEnviar = document.getElementById('btnEnviar')
  const btnText   = btnEnviar?.querySelector('.btn-text')
  const btnLoad   = btnEnviar?.querySelector('.btn-loading')
  const success   = document.getElementById('formSuccess')

  // ── Limpiar error al escribir ──
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group')
      if (field.value.trim()) {
        group?.classList.remove('show-error')
        field.classList.remove('error')
      }
    })
  })

  // ── Validar todos los campos requeridos ──
  function validateForm() {
    const required = form.querySelectorAll('[required]')
    let valid = true

    required.forEach(field => {
      const group   = field.closest('.form-group')
      const isEmpty = !field.value.trim()

      if (isEmpty) {
        group.classList.add('show-error')
        field.classList.add('error')
        valid = false
      } else {
        group.classList.remove('show-error')
        field.classList.remove('error')
      }

      // Email
      if (field.type === 'email' && field.value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
        if (!ok) {
          group.classList.add('show-error')
          field.classList.add('error')
          valid = false
        }
      }
    })

    if (!valid) {
      const firstError = form.querySelector('.error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return valid
  }

  // ── Envío ──
  form?.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    btnText.style.display  = 'none'
    btnLoad.style.display  = 'inline'
    btnEnviar.disabled     = true

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      })

      if (res.ok) {
        form.querySelectorAll('.form-row, .form-group, .btn-enviar').forEach(el => {
          el.style.display = 'none'
        })
        success.style.display       = 'flex'
        success.style.flexDirection = 'column'
        success.style.alignItems    = 'center'
      } else {
        throw new Error('Error')
      }
    } catch {
      alert('Hubo un problema al enviar el mensaje. Por favor intentá de nuevo o comunicate por teléfono.')
      btnText.style.display = 'inline'
      btnLoad.style.display = 'none'
      btnEnviar.disabled    = false
    }
  })
})