'use client'

import { useState } from 'react'

interface WorkflowStep {
  trigger: string
  condition: string
  action: string
  tools: string[]
  impact: string
}

export default function WorkflowAutomation() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(0)
  
  const workflows: WorkflowStep[] = [
    {
      trigger: 'High Budget Score Detected',
      condition: 'Prospect mentions specific budget or current spend',
      action: 'Auto-create opportunity, assign to AE, schedule demo',
      tools: ['CRM API', 'Meeting Scheduler', 'Team Chat'],
      impact: 'Reduces opportunity creation time to zero'
    },
    {
      trigger: 'Decision Maker Identified',
      condition: 'Title contains key decision maker indicators',
      action: 'Enrich contact data, add to executive nurture sequence',
      tools: ['Data Enrichment', 'Sales Engagement', 'CRM'],
      impact: 'Increases decision maker engagement'
    },
    {
      trigger: 'Pain Point Detected',
      condition: 'Mentions specific pain points or challenges',
      action: 'Send ROI calculator, case study, schedule technical demo',
      tools: ['Marketing Automation', 'Content Platform', 'Meeting Scheduler'],
      impact: 'Improves demo show rate'
    },
    {
      trigger: 'Competition Mentioned',
      condition: 'References competitor or existing solution',
      action: 'Deploy battlecard, send comparison guide, flag for review',
      tools: ['Competitive Intel', 'Content Management', 'Analytics'],
      impact: 'Increases competitive win rate'
    },
    {
      trigger: 'Low Engagement Score',
      condition: 'Engagement metrics below threshold',
      action: 'Flag for coaching, suggest different approach, reassign if needed',
      tools: ['Call Analytics', 'Sales Platform', 'Lead Routing'],
      impact: 'Reduces dead opportunities'
    }
  ]
  
  const recommendedAutomations = [
    {
      name: 'Smart Lead Routing',
      description: 'Route leads based on multiple factors',
      effort: 'Low',
      impact: 'High'
    },
    {
      name: 'AI Email Personalization',
      description: 'Generate personalized follow-ups',
      effort: 'Medium',
      impact: 'High'
    },
    {
      name: 'Automated Data Enrichment',
      description: 'Auto-populate CRM with company data',
      effort: 'Low',
      impact: 'Medium'
    },
    {
      name: 'Intelligent Call Scheduling',
      description: 'AI suggests optimal call times',
      effort: 'High',
      impact: 'Medium'
    }
  ]
  
  return (
    <div className="console-panel">
      <h2 className="section-header mb-4">
        WORKFLOW AUTOMATION ENGINE
      </h2>
      
      <div className="mb-6">
        <div className="text-xs uppercase text-console-gray mb-3">Active Automation Triggers</div>
        <div className="space-y-2">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              onClick={() => setSelectedWorkflow(index)}
              className={`p-3 border cursor-pointer transition-all ${
                selectedWorkflow === index 
                  ? 'border-console-accent bg-console-accent bg-opacity-10' 
                  : 'border-console-gray hover:border-console-light'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-console-light mb-1">
                    {workflow.trigger}
                  </div>
                  <div className="text-xs text-console-gray">
                    IF: {workflow.condition}
                  </div>
                  <div className="text-xs text-console-accent mt-1">
                    THEN: {workflow.action}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 border ${
                  index === 0 ? 'border-green-400 text-green-400' : 'border-console-gray text-console-gray'
                }`}>
                  {index === 0 ? 'TRIGGERED' : 'STANDBY'}
                </div>
              </div>
              
              {selectedWorkflow === index && (
                <div className="mt-3 pt-3 border-t border-console-gray">
                  <div className="flex gap-2 mb-2">
                    {workflow.tools.map((tool, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-console-dark border border-console-light">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-green-400">
                    Impact: {workflow.impact}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-console-gray pt-4">
        <div className="text-xs uppercase text-console-gray mb-3">Recommended Automations</div>
        <div className="grid grid-cols-2 gap-3">
          {recommendedAutomations.map((automation, index) => (
            <div key={index} className="p-3 border border-console-gray">
              <div className="text-sm font-medium text-console-light mb-1">
                {automation.name}
              </div>
              <div className="text-xs text-console-gray mb-2">
                {automation.description}
              </div>
              <div className="flex justify-between text-xs">
                <span className={`${
                  automation.impact === 'High' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  Impact: {automation.impact}
                </span>
                <span className="text-console-gray">
                  Effort: {automation.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 text-xs">
        <div className="font-bold text-blue-400 mb-1">INTEGRATION READY</div>
        <div className="text-console-light">
          All workflows integrate with major sales tools via webhooks and APIs.
        </div>
      </div>
    </div>
  )
}