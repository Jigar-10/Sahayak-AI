import { useEffect, useRef, useState } from 'react'
import { Circle, Pause, Play, RotateCcw, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void
  onUseText: () => void
}

const fallbackTranscript =
  'Voice interaction recorded for the demonstration. The person described feeling unsafe, anxious, and in need of support after the incident.'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function VoiceRecorder({ onTranscriptReady, onUseText }: VoiceRecorderProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused' | 'stopped' | 'error'>(
    'idle',
  )
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (status !== 'recording') return undefined

    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    },
    [],
  )

  const startRecording = async () => {
    setError('')

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus('error')
      setError('Unable to process audio. Please try again or continue using text.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      recorderRef.current = new MediaRecorder(stream)
      recorderRef.current.start()
      setSeconds(0)
      setStatus('recording')
    } catch {
      setStatus('error')
      setError('Unable to process audio. Please try again or continue using text.')
    }
  }

  const pauseRecording = () => {
    recorderRef.current?.pause()
    setStatus('paused')
  }

  const resumeRecording = () => {
    recorderRef.current?.resume()
    setStatus('recording')
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStatus('stopped')
    onTranscriptReady(fallbackTranscript)
  }

  const resetRecording = () => {
    recorderRef.current = null
    setSeconds(0)
    setStatus('idle')
    setError('')
  }

  const bars = Array.from({ length: 28 }, (_, index) => {
    const height = status === 'recording' ? 18 + ((index * 13 + seconds * 7) % 42) : 14
    return height
  })

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Voice Recording</p>
          <p className="text-sm text-muted-foreground">
            {status === 'error'
              ? error
              : 'Audio is used only for this mocked prototype flow.'}
          </p>
        </div>
        <div className="text-2xl font-semibold tabular-nums" aria-live="polite">
          {formatTime(seconds)}
        </div>
      </div>

      <div
        className="mt-5 flex h-20 items-center gap-1 rounded-md bg-surface-muted px-3"
        aria-label="Voice waveform visualization"
        role="img"
      >
        {bars.map((height, index) => (
          <span
            key={index}
            className={cn(
              'w-full max-w-2 rounded-full transition-all',
              status === 'recording' ? 'bg-primary' : 'bg-border',
            )}
            style={{ height }}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {status === 'idle' && (
          <Button onClick={startRecording}>
            <Circle className="h-4 w-4" aria-hidden="true" />
            Record
          </Button>
        )}
        {status === 'recording' && (
          <>
            <Button onClick={pauseRecording} variant="outline">
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </Button>
            <Button onClick={stopRecording}>
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop
            </Button>
          </>
        )}
        {status === 'paused' && (
          <>
            <Button onClick={resumeRecording}>
              <Play className="h-4 w-4" aria-hidden="true" />
              Resume
            </Button>
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop
            </Button>
          </>
        )}
        {status === 'stopped' && (
          <>
            <Button onClick={resetRecording} variant="outline">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Replay
            </Button>
            <Button onClick={() => onTranscriptReady(fallbackTranscript)}>
              Continue with Voice
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <Button onClick={startRecording} variant="outline">Try Again</Button>
            <Button onClick={onUseText}>Continue Using Text</Button>
          </>
        )}
      </div>
    </div>
  )
}
