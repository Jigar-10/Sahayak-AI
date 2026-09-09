import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeText } from '@/services/mockAssessmentService'
import { useAssessmentStore } from '@/store/assessmentStore'
import { StepIndicator } from '@/components/assessment/StepIndicator'
import { BasicContextStep } from '@/components/assessment/BasicContextStep'
import { NarrativeStep } from '@/components/assessment/NarrativeStep'
import { AnalysisStep } from '@/components/assessment/AnalysisStep'
import { ResultStep } from '@/components/assessment/ResultStep'
import { RecommendationsStep } from '@/components/assessment/RecommendationsStep'
import { ImmediateDangerScreen } from '@/components/assessment/ImmediateDangerScreen'

export function AssessmentWizard() {
  const navigate = useNavigate()
  const [showDangerScreen, setShowDangerScreen] = useState(false)
  const [dangerAcknowledged, setDangerAcknowledged] = useState(false)

  const {
    step,
    context,
    narrative,
    channel,
    result,
    demoPersonaId,
    setStep,
    setContext,
    setNarrative,
    setChannel,
    setResult,
  } = useAssessmentStore()

  const runAnalysis = useCallback(() => {
    const analysisResult = analyzeText({
      narrative,
      context,
      forcedPersona: demoPersonaId,
    })
    setResult(analysisResult)
  }, [narrative, context, demoPersonaId, setResult])

  const handleContextNext = () => {
    if (context.immediateDanger && !dangerAcknowledged) {
      setShowDangerScreen(true)
      return
    }
    setStep('narrative')
  }

  const handleDangerContinue = () => {
    setDangerAcknowledged(true)
    setShowDangerScreen(false)
    setStep('narrative')
  }

  const handleNarrativeNext = () => {
    setStep('analysis')
  }

  const handleAnalysisComplete = useCallback(() => {
    runAnalysis()
    setStep('result')
  }, [runAnalysis, setStep])


  if (showDangerScreen) {
    return (
      <ImmediateDangerScreen
        onContinue={handleDangerContinue}
        onExit={() => navigate('/')}
      />
    )
  }

  return (
    <>
      <StepIndicator currentStep={step} />

      {step === 'context' && (
        <BasicContextStep
          context={context}
          onChange={setContext}
          onNext={handleContextNext}
        />
      )}

      {step === 'narrative' && (
        <NarrativeStep
          narrative={narrative}
          channel={channel}
          onChannelChange={setChannel}
          onChange={setNarrative}
          onNext={handleNarrativeNext}
          onBack={() => setStep('context')}
        />
      )}

      {step === 'analysis' && (
        <AnalysisStep onComplete={handleAnalysisComplete} />
      )}

      {step === 'result' && result && <ResultStep result={result} onNext={() => setStep('recommendations')} />}

      {step === 'recommendations' && result && <RecommendationsStep result={result} />}

    </>
  )
}
