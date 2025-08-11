'use client'

import { useState } from 'react'

export default function ROICalculator() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  return (
    <div className="console-panel">
      <h2 className="section-header mb-4">
        AUTOMATION ROI CALCULATOR
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border border-console-gray">
          <div className="text-xs uppercase text-console-gray mb-3">Manual Process</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Calls/Month:</span>
              <span className="text-console-light font-mono">X,XXX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Meetings:</span>
              <span className="text-console-light font-mono">XX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Pipeline:</span>
              <span className="text-console-light font-mono">$X.XM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Cost/Meeting:</span>
              <span className="text-red-400 font-mono">$XXX</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-2 border-console-accent">
          <div className="text-xs uppercase text-console-accent mb-3">With Automation</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Calls/Month:</span>
              <span className="text-console-accent font-mono font-bold">XX,XXX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Meetings:</span>
              <span className="text-console-accent font-mono font-bold">XXX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Pipeline:</span>
              <span className="text-console-accent font-mono font-bold">$XX.XM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-console-gray">Cost/Meeting:</span>
              <span className="text-green-400 font-mono">$XX</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-green-500 bg-opacity-10 border border-green-500 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              +$XM
            </div>
            <div className="text-xs text-console-gray uppercase mt-1">
              Additional Pipeline/Month
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              XXX%
            </div>
            <div className="text-xs text-console-gray uppercase mt-1">
              ROI First Year
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              X mo
            </div>
            <div className="text-xs text-console-gray uppercase mt-1">
              Payback Period
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="console-button w-full text-xs mb-4"
      >
        {showAdvanced ? 'HIDE' : 'SHOW'} ASSUMPTIONS
      </button>
      
      {showAdvanced && (
        <div className="p-4 border border-console-gray text-xs text-console-gray">
          <div className="mb-2">• Based on industry standard metrics</div>
          <div className="mb-2">• Assumes Xx productivity gain through automation</div>
          <div className="mb-2">• Includes tool costs and implementation</div>
          <div>• Conservative conversion rate estimates</div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-console-gray italic">
        * Calculations based on AI-powered lead enrichment, automated follow-ups, 
        and intelligent call prioritization
      </div>
    </div>
  )
}