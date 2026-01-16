'use client'

import { useEffect } from 'react'

export type DomToolFilterProps = {
  inputId: string
  listId: string
  emptyId: string
  /**
   * 可选：清空按钮 id（点击会清空输入框并重新过滤）
   */
  clearButtonId?: string
  /**
   * 可选：同步 query 到 URL（不刷新）
   * - 例如首页用 q
   */
  syncQueryParamKey?: string
  /**
   * 可选：在页面任意处按 / 聚焦输入框（避开正在输入的 input/textarea）
   */
  enableSlashFocus?: boolean
}

function isTypingInInput(): boolean {
  const el = document.activeElement
  if (!el) return false
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return true
  if (el instanceof HTMLElement && el.closest('input, textarea')) return true
  return false
}

export default function DomToolFilter({
  inputId,
  listId,
  emptyId,
  clearButtonId,
  syncQueryParamKey,
  enableSlashFocus,
}: DomToolFilterProps) {
  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null
    const list = document.getElementById(listId)
    const empty = document.getElementById(emptyId)
    const clearBtn = clearButtonId ? document.getElementById(clearButtonId) as HTMLButtonElement | null : null

    if (!input || !list || !empty) return

    const norm = (s: string | null) => (s || '').toLowerCase()

    const apply = () => {
      const q = norm(input.value).trim()
      const items = list.querySelectorAll<HTMLElement>('.tool-item')
      let visible = 0

      items.forEach((el) => {
        const t = norm(el.getAttribute('data-title'))
        const d = norm(el.getAttribute('data-description'))
        const hit = !q || t.includes(q) || d.includes(q)
        if (hit) {
          el.classList.remove('hidden')
          visible += 1
        } else {
          el.classList.add('hidden')
        }
      })

      if (visible === 0) empty.classList.remove('hidden')
      else empty.classList.add('hidden')

      if (syncQueryParamKey) {
        try {
          const url = new URL(window.location.href)
          if (q) url.searchParams.set(syncQueryParamKey, input.value)
          else url.searchParams.delete(syncQueryParamKey)
          window.history.replaceState({}, '', url.toString())
        } catch {
          // ignore
        }
      }
    }

    const onInput = () => apply()
    input.addEventListener('input', onInput)

    const onClear = () => {
      input.value = ''
      apply()
      input.focus()
    }
    if (clearBtn) clearBtn.addEventListener('click', onClear)

    const onKeyDown = (e: KeyboardEvent) => {
      if (!enableSlashFocus) return
      if (e.key !== '/' || e.defaultPrevented) return
      if (isTypingInInput()) return
      e.preventDefault()
      input.focus()
    }
    if (enableSlashFocus) window.addEventListener('keydown', onKeyDown)

    // 初次挂载：让 SSR 的 defaultValue / URL 参数立刻生效
    apply()

    return () => {
      input.removeEventListener('input', onInput)
      if (clearBtn) clearBtn.removeEventListener('click', onClear)
      if (enableSlashFocus) window.removeEventListener('keydown', onKeyDown)
    }
  }, [clearButtonId, emptyId, enableSlashFocus, inputId, listId, syncQueryParamKey])

  return null
}

