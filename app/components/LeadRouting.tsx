'use client'

import { useState } from 'react'

interface SDR {
  id: string
  name: string
  specialty: string
  capacity: number
  currentLoad: number
  successRate: number
  territories: string[]
}

interface Lead {
  id: string
  company: string
  industry: string
  score: number
  location: string
  dealSize: string
  assignedTo?: string
  reason?: string
}

export default function LeadRouting() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [showSimulation, setShowSimulation] = useState(false)
  const [isRouting, setIsRouting] = useState(false)
  
  const sdrs: SDR[] = [
    {
      id: '1',
      name: 'SDR A',
      specialty: 'Enterprise',
      capacity: 50,
      currentLoad: 42,
      successRate: 28,
      territories: ['West', 'Southwest']
    },
    {
      id: '2',
      name: 'SDR B',
      specialty: 'Mid-Market',
      capacity: 60,
      currentLoad: 35,
      successRate: 22,
      territories: ['Northeast', 'Midwest']
    },
    {
      id: '3',
      name: 'SDR C',
      specialty: 'Government',
      capacity: 45,
      currentLoad: 30,
      successRate: 31,
      territories: ['Southeast', 'Central']
    },
    {
      id: '4',
      name: 'SDR D',
      specialty: 'Technology',
      capacity: 55,
      currentLoad: 48,
      successRate: 25,
      territories: ['Pacific', 'Mountain']
    }
  ]
  
  const incomingLeads: Lead[] = [
    {
      id: 'L001',
      company: 'Tech Company',
      industry: 'Technology',
      score: 92,
      location: 'West Coast',
      dealSize: '$XXXk+'
    },
    {
      id: 'L002',
      company: 'University',
      industry: 'Education',
      score: 78,
      location: 'Southeast',
      dealSize: '$XXk'
    },
    {
      id: 'L003',
      company: 'Financial Corp',
      industry: 'Financial',
      score: 85,
      location: 'Northeast',
      dealSize: '$XXXk+'
    },
    {
      id: 'L004',
      company: 'Manufacturing Co',
      industry: 'Industrial',
      score: 71,
      location: 'Midwest',
      dealSize: '$XXk'
    },
    {
      id: 'L005',
      company: 'Healthcare Org',
      industry: 'Healthcare',
      score: 88,
      location: 'Southwest',
      dealSize: '$XXXk'
    }
  ]
  
  const routeLead = (lead: Lead): { assignedTo: string; reason: string } => {
    let bestSDR = sdrs[0]
    let bestScore = 0
    let reason = ''
    
    for (const sdr of sdrs) {
      let score = 0
      let factors = []
      
      if (lead.industry === 'Technology' && sdr.specialty === 'Technology') {
        score += 30
        factors.push('specialty match')
      } else if (lead.industry === 'Education' && sdr.specialty === 'Government') {
        score += 30
        factors.push('specialty match')
      } else if (lead.dealSize.includes('XXXk') && sdr.specialty === 'Enterprise') {
        score += 25
        factors.push('enterprise expertise')
      }
      
      const loadPercentage = (sdr.currentLoad / sdr.capacity) * 100
      if (loadPercentage < 70) {
        score += 20
        factors.push('available capacity')
      }
      
      score += sdr.successRate * 0.5
      
      if (score > bestScore) {
        bestScore = score
        bestSDR = sdr
        reason = factors.join(', ')
      }
    }
    
    return {
      assignedTo: bestSDR.name,
      reason: reason || 'best available match'
    }
  }
  
  const simulateRouting = () => {
    setIsRouting(true)
    setShowSimulation(true)
    
    let index = 0
    const interval = setInterval(() => {
      if (index < incomingLeads.length) {
        const lead = incomingLeads[index]
        const routing = routeLead(lead)
        
        setLeads(prev => [...prev, {
          ...lead,
          assignedTo: routing.assignedTo,
          reason: routing.reason
        }])
        
        index++
      } else {
        clearInterval(interval)
        setIsRouting(false)
      }
    }, 800)
  }
  
  const resetSimulation = () => {
    setLeads([])
    setShowSimulation(false)
    setIsRouting(false)
  }
  
  return (
    <div className="console-panel">
      <h2 className="section-header mb-4">
        INTELLIGENT LEAD ROUTING ENGINE
      </h2>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {sdrs.map((sdr) => {
          const loadPercentage = (sdr.currentLoad / sdr.capacity) * 100
          const assignedLeads = leads.filter(l => l.assignedTo === sdr.name).length
          
          return (
            <div key={sdr.id} className="p-3 border border-console-gray">
              <div className="text-sm font-medium text-console-light mb-1">
                {sdr.name}
              </div>
              <div className="text-xs text-console-gray mb-2">
                {sdr.specialty}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-console-gray">Load:</span>
                  <span className={loadPercentage > 80 ? 'text-red-400' : 'text-green-400'}>
                    XX/XX
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-console-gray">Success:</span>
                  <span className="text-console-light">XX%</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-console-dark border border-console-gray">
                <div 
                  className={`h-full transition-all duration-500 ${
                    loadPercentage > 80 ? 'bg-red-400' : loadPercentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min(100, loadPercentage + (assignedLeads * 2))}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {!showSimulation ? (
        <div className="text-center py-8">
          <div className="text-sm text-console-gray mb-4">
            Simulate how AI routes leads based on SDR expertise, capacity, and performance
          </div>
          <button
            onClick={simulateRouting}
            className="console-button px-6 py-3"
          >
            START ROUTING SIMULATION
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-console-gray">
              {isRouting ? 'Routing in progress...' : 'Routing complete'}
            </div>
            {!isRouting && (
              <button onClick={resetSimulation} className="console-button text-xs">
                RESET
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {leads.map((lead, index) => (
              <div 
                key={lead.id}
                className="p-3 border border-console-light bg-console-light bg-opacity-5"
                style={{
                  animation: 'fadeIn 0.5s ease-in',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-console-light">
                      {lead.company}
                    </div>
                    <div className="text-xs text-console-gray mt-1">
                      {lead.industry} • {lead.location} • {lead.dealSize}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xs text-console-accent font-medium">
                      → {lead.assignedTo}
                    </div>
                    <div className="text-xs text-console-gray mt-1">
                      {lead.reason}
                    </div>
                  </div>
                  <div className={`ml-3 px-2 py-1 text-xs border ${
                    lead.score >= 85 ? 'border-green-400 text-green-400' : 
                    lead.score >= 75 ? 'border-yellow-400 text-yellow-400' : 
                    'border-console-gray text-console-gray'
                  }`}>
                    Score: XX
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {!isRouting && leads.length > 0 && (
            <div className="mt-4 p-3 bg-green-500 bg-opacity-10 border border-green-500 text-xs">
              <div className="font-bold text-green-400 mb-1">ROUTING COMPLETE</div>
              <div className="text-console-light">
                X leads routed optimally based on SDR expertise, capacity, and historical performance.
                Intelligent routing increases conversion rates significantly.
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}