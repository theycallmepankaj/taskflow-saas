import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  const handleSelect = (val) => {
    if (disabled) return
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-left text-sm text-white outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-zinc-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-zinc-300' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0c0c14] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl outline-none"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 outline-none ${
                    opt.value === value
                      ? 'bg-cyan-500/10 text-cyan-300 font-medium'
                      : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </button>
              </li>
            ))}
            {options.length === 0 && (
              <li className="py-2.5 text-center text-xs text-zinc-500">No options available</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
