/**
 * Normalize FastAPI / Axios error payloads into a user-facing string.
 */
export function formatApiError(error) {
  const detail = error?.response?.data?.detail ?? error?.message

  if (!detail) {
    return 'Something went wrong. Please try again.'
  }

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        return item?.msg ?? item?.message ?? 'Validation error'
      })
      .join('. ')
  }

  return 'Something went wrong. Please try again.'
}
