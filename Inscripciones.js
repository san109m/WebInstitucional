// ============================================================
//  INSCRIPCIONES.JS — Formulario multi-paso + validación
// ============================================================

const TOTAL_STEPS = 3

// ── Avanzar al siguiente paso ──
function nextStep(currentStep) {
  if (!validateStep(currentStep)) return

  const currentPanel = document.getElementById(`panel-${currentStep}`)
  const nextPanel    = document.getElementById(`panel-${currentStep + 1}`)

  currentPanel.classList.remove('active')
  nextPanel.classList.add('active')

  updateStepIndicator(currentStep + 1, currentStep)
}

// ── Volver al paso anterior ──
function prevStep(currentStep) {
  const currentPanel = document.getElementById(`panel-${currentStep}`)
  const prevPanel    = document.getElementById(`panel-${currentStep - 1}`)

  currentPanel.classList.remove('active')
  prevPanel.classList.add('active')

  updateStepIndicator(currentStep - 1, null)
}

// ── Actualizar indicador visual de pasos ──
function updateStepIndicator(activeStep, completedStep) {
  document.querySelectorAll('.form-step').forEach(step => {
    const n = parseInt(step.dataset.step)
    step.classList.remove('active', 'completed')
    if (n === activeStep) step.classList.add('active')
    if (n < activeStep)  step.classList.add('completed')
  })

  // Colorear líneas entre pasos
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('completed', i + 1 < activeStep)
  })
}

// ── Validar campos del paso actual ──
function validateStep(step) {
  const panel    = document.getElementById(`panel-${step}`)
  const required = panel.querySelectorAll('[required]')
  let valid      = true

  required.forEach(field => {
    const group = field.closest('.form-group') || field.closest('.form-check')
    const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim()

    if (isEmpty) {
      group.classList.add('show-error')
      field.classList.add('error')
      valid = false
    } else {
      group.classList.remove('show-error')
      field.classList.remove('error')
    }

    // Validación extra: email
    if (field.type === 'email' && field.value) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
      if (!emailOk) {
        group.classList.add('show-error')
        field.classList.add('error')
        valid = false
      }
    }
  })

  // Scroll al primer error
  if (!valid) {
    const firstError = panel.querySelector('.error')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return valid
}

// ── Limpiar error al escribir ──
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group') || field.closest('.form-check')
      if (field.value.trim() || (field.type === 'checkbox' && field.checked)) {
        group?.classList.remove('show-error')
        field.classList.remove('error')
      }
    })
  })

  // ── Envío del formulario ──
  const form      = document.getElementById('formInscripcion')
  const btnSubmit = document.getElementById('btnSubmit')
  const btnText   = btnSubmit?.querySelector('.btn-text')
  const btnLoad   = btnSubmit?.querySelector('.btn-loading')
  const success   = document.getElementById('formSuccess')

  form?.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!validateStep(3)) return

    // Estado de carga
    btnText.style.display = 'none'
    btnLoad.style.display = 'inline'
    btnSubmit.disabled    = true

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })

      if (res.ok) {
        // Ocultar todos los paneles y mostrar éxito
        document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'))
        document.querySelector('.form-steps').style.display = 'none'
        success.style.display = 'flex'
        success.style.flexDirection = 'column'
        success.style.alignItems = 'center'
      } else {
        throw new Error('Error al enviar')
      }
    } catch {
      alert('Hubo un problema al enviar el formulario. Por favor intentá de nuevo o comunicate por teléfono.')
      btnText.style.display = 'inline'
      btnLoad.style.display = 'none'
      btnSubmit.disabled    = false
    }
  })
})