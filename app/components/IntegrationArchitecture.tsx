'use client'

import { useState } from 'react'

interface Integration {
  name: string
  category: string
  status: 'connected' | 'available' | 'coming'
  dataFlow: string[]
  apiEndpoints?: string[]
}

export default function IntegrationArchitecture() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDataFlow, setShowDataFlow] = useState(false)
  
  const integrations: Integration[] = [
    {
      name: 'Salesforce',
      category: 'CRM',
      status: 'connected',
      dataFlow: ['Leads', 'Opportunities', 'Activities', 'Custom Objects'],
      apiEndpoints: ['/api/sf/leads', '/api/sf/opportunities', '/api/sf/activities']
    },
    {
      name: 'Secondary CRM',
      category: 'CRM',
      status: 'available',
      dataFlow: ['Contacts', 'Deals', 'Companies', 'Engagements'],
      apiEndpoints: ['/api/crm/contacts', '/api/crm/deals']
    },
    {
      name: 'Call Intelligence',
      category: 'Call Analytics',
      status: 'connected',
      dataFlow: ['Call Recordings', 'Transcripts', 'Analytics', 'Coaching Insights'],
      apiEndpoints: ['/api/calls/recordings', '/api/calls/insights']
    },
    {
      name: 'Sales Engagement',
      category: 'Sales Engagement',
      status: 'connected',
      dataFlow: ['Sequences', 'Tasks', 'Emails', 'Call Logs'],
      apiEndpoints: ['/api/engagement/sequences', '/api/engagement/activities']
    },
    {
      name: 'Lusha',
      category: 'Data Enrichment',
      status: 'connected',
      dataFlow: ['Contact Info', 'Company Data', 'Email Validation', 'Phone Numbers'],
      apiEndpoints: ['/api/lusha/enrich']
    },
    {
      name: 'Team Chat',
      category: 'Communication',
      status: 'connected',
      dataFlow: ['Notifications', 'Alerts', 'Reports', 'Approvals'],
      apiEndpoints: ['/api/chat/notify']
    },
    {
      name: 'Meeting Scheduler',
      category: 'Scheduling',
      status: 'available',
      dataFlow: ['Meeting Links', 'Availability', 'Bookings', 'Reminders'],
      apiEndpoints: ['/api/calendar/schedule']
    },
    {
      name: 'Data Enrichment',
      category: 'Data Enrichment',
      status: 'available',
      dataFlow: ['B2B Data', 'Org Charts', 'Intent Data', 'Company Updates'],
      apiEndpoints: ['/api/enrichment/search']
    },
    {
      name: 'Call Dialer',
      category: 'Communication',
      status: 'connected',
      dataFlow: ['Call APIs', 'SMS', 'Voice Analytics', 'Call Routing'],
      apiEndpoints: ['/api/dialer/call', '/api/dialer/sms']
    },
    {
      name: 'AI Platform',
      category: 'AI/ML',
      status: 'connected',
      dataFlow: ['Text Generation', 'Analysis', 'Summarization', 'Classification'],
      apiEndpoints: ['/api/ai/analyze', '/api/ai/generate']
    }
  ]
  
  const categories = ['all', 'CRM', 'Call Analytics', 'Sales Engagement', 'Data Enrichment', 'Communication', 'Scheduling', 'AI/ML']
  
  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory)
  
  const dataFlowDiagram = {
    input: ['Phone Calls', 'Emails', 'Web Forms', 'Chat'],
    processing: ['AI Analysis', 'Lead Scoring', 'Routing Logic', 'Enrichment'],
    output: ['CRM Updates', 'Task Creation', 'Notifications', 'Analytics']
  }
  
  return (
    <div className="console-panel">
      <h2 className="section-header mb-4">
        INTEGRATION ARCHITECTURE
      </h2>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1 border transition-all ${
              selectedCategory === cat
                ? 'border-console-accent bg-console-accent bg-opacity-20 text-console-accent'
                : 'border-console-gray text-console-gray hover:border-console-light'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.name}
            className={`p-3 border ${
              integration.status === 'connected' 
                ? 'border-green-400 bg-green-400 bg-opacity-5'
                : integration.status === 'available'
                ? 'border-console-light'
                : 'border-console-gray border-dashed'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-medium text-console-light">
                  {integration.name}
                </div>
                <div className="text-xs text-console-gray">
                  {integration.category}
                </div>
              </div>
              <div className={`text-xs px-2 py-1 border ${
                integration.status === 'connected'
                  ? 'border-green-400 text-green-400'
                  : integration.status === 'available'
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-console-gray text-console-gray'
              }`}>
                {integration.status === 'connected' ? 'LIVE' : 
                 integration.status === 'available' ? 'READY' : 'SOON'}
              </div>
            </div>
            
            <div className="text-xs text-console-gray mt-2">
              {integration.dataFlow.slice(0, 2).join(' • ')}
              {integration.dataFlow.length > 2 && ` +${integration.dataFlow.length - 2}`}
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => setShowDataFlow(!showDataFlow)}
        className="console-button w-full mb-4 text-xs"
      >
        {showDataFlow ? 'HIDE' : 'SHOW'} DATA FLOW ARCHITECTURE
      </button>
      
      {showDataFlow && (
        <div className="p-4 border border-console-light bg-console-light bg-opacity-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs uppercase text-console-gray mb-3">Data Sources</div>
              {dataFlowDiagram.input.map((item, i) => (
                <div key={i} className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-console-accent mr-2" />
                  <span className="text-sm text-console-light">{item}</span>
                </div>
              ))}
            </div>
            
            <div>
              <div className="text-xs uppercase text-console-gray mb-3">Processing Layer</div>
              {dataFlowDiagram.processing.map((item, i) => (
                <div key={i} className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-yellow-400 mr-2" />
                  <span className="text-sm text-console-light">{item}</span>
                </div>
              ))}
            </div>
            
            <div>
              <div className="text-xs uppercase text-console-gray mb-3">Actions & Outputs</div>
              {dataFlowDiagram.output.map((item, i) => (
                <div key={i} className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-400 mr-2" />
                  <span className="text-sm text-console-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-console-gray">
            <div className="text-xs text-console-gray mb-2">API Architecture</div>
            <div className="font-mono text-xs text-console-light">
              <div>POST /api/webhook/incoming → Process → Route → Update CRM</div>
              <div className="mt-1">GET /api/analytics/performance → Dashboard</div>
              <div className="mt-1">POST /api/automation/trigger → Execute Workflow</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-500 bg-opacity-10 border border-blue-500">
          <div className="text-2xl font-bold text-blue-400 mb-1">XX+</div>
          <div className="text-xs text-console-light">Active Integrations</div>
        </div>
        <div className="p-3 bg-green-500 bg-opacity-10 border border-green-500">
          <div className="text-2xl font-bold text-green-400 mb-1">XXXk+</div>
          <div className="text-xs text-console-light">API Calls/Month</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-console-gray italic">
        * All integrations use OAuth 2.0, webhook listeners, and real-time data sync.
        Built for enterprise scale with high uptime SLA.
      </div>
    </div>
  )
}