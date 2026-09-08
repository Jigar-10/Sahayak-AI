import type { LucideIcon } from 'lucide-react'
import { Baby, HeartHandshake, HeartPulse, MonitorSmartphone, Scale, Shield, Siren } from 'lucide-react'

export type EmergencyCategory = 'Emergency' | 'Women & Child Support' | 'SC/ST Support' | 'Cyber Crime'

export interface EmergencyNumber {
  id: string
  name: string
  number: string
  description: string
  category: EmergencyCategory
  icon: LucideIcon
  isEmergency: boolean
  isPrimary?: boolean
  availability?: string
}

export const emergencyNumbers: EmergencyNumber[] = [
  { id: '112', name: 'Emergency Response Support System', number: '112', description: 'Police, fire, medical and other urgent emergency response across India.', category: 'Emergency', icon: Siren, isEmergency: true, isPrimary: true, availability: 'Available 24/7 across India' },
  { id: '108', name: 'Ambulance / Emergency Medical Services', number: '108', description: 'Ambulance and urgent medical assistance where the service is available.', category: 'Emergency', icon: HeartPulse, isEmergency: true, availability: 'Availability may vary by state; call 112 for unified emergency response' },
  { id: '181', name: 'Women Helpline', number: '181', description: 'Support and referrals for women experiencing violence, distress or harassment.', category: 'Women & Child Support', icon: HeartHandshake, isEmergency: false, availability: '24/7 in participating states and Union Territories' },
  { id: '1091', name: 'Women Police Helpline', number: '1091', description: 'Police assistance for women facing immediate safety concerns or violence.', category: 'Women & Child Support', icon: Shield, isEmergency: false },
  { id: '1098', name: 'Child Helpline', number: '1098', description: 'Help for children in distress, at risk or in need of protection.', category: 'Women & Child Support', icon: Baby, isEmergency: false, availability: 'Available 24/7' },
  { id: '14566', name: 'National Helpline Against Atrocities', number: '14566', description: 'Information, complaint registration and support related to atrocities against SC/ST communities.', category: 'SC/ST Support', icon: Scale, isEmergency: false, availability: 'Available round the clock across India' },
  { id: '1930', name: 'Cyber Crime Helpline', number: '1930', description: 'Report cybercrime and financial fraud for prompt assistance and complaint registration.', category: 'Cyber Crime', icon: MonitorSmartphone, isEmergency: false },
]
