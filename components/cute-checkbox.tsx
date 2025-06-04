"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface CuteCheckboxProps {
  checked: boolean
  onChange: () => void
}

export function CuteCheckbox({ checked, onChange }: CuteCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
        checked ? "bg-green-500" : "border-2 border-gray-300 bg-white"
      }`}
      onClick={onChange}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {checked && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </motion.svg>
      )}
      {!checked && isHovered && (
        <motion.div
          className="w-3 h-3 bg-gray-300 rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}
