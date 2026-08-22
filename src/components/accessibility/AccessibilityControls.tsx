import { useEffect, useState } from 'react'
import { Accessibility, Type, Contrast } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const FONT_SIZES = [100, 112, 125] as const

export function AccessibilityControls() {
  const [fontIndex, setFontIndex] = useState(0)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZES[fontIndex]}%`
  }, [fontIndex])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open accessibility options">
          <Accessibility className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accessibility Options</DialogTitle>
          <DialogDescription>
            Adjust display settings. Full accessibility menu polish is planned for Phase 3.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Text Size</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFontIndex((i) => Math.max(0, i - 1))}
                disabled={fontIndex === 0}
                aria-label="Decrease text size"
              >
                A−
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFontIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                disabled={fontIndex === FONT_SIZES.length - 1}
                aria-label="Increase text size"
              >
                A+
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Contrast className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">High Contrast</span>
            </div>
            <Button
              variant={highContrast ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setHighContrast((v) => !v)}
              aria-pressed={highContrast}
            >
              {highContrast ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
