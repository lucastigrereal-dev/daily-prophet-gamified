export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} é obrigatório`
  }
  return null
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Email inválido'
  }
  return null
}

export function validateUrl(url: string): string | null {
  try {
    new URL(url)
    return null
  } catch {
    return 'URL inválida'
  }
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value.length < min) {
    return `${fieldName} deve ter no mínimo ${min} caracteres`
  }
  return null
}

export function validateChecklist(checklist: any[]): string | null {
  if (!Array.isArray(checklist) || checklist.length === 0) {
    return 'Checklist não pode estar vazio'
  }

  const allDone = checklist.every(item => item.done === true)
  if (!allDone) {
    return 'Complete todos os itens do checklist antes de avançar'
  }

  return null
}
