import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Copy, 
  CheckCircle, 
  Palette, 
  Settings, 
  Eye,
  FileText,
  Image,
  Code2,
  Sliders
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import './App.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarGraphGenerator = () => {
  const [agentData, setAgentData] = useState({
    title: 'Social Media Content Agent',
    useCase: 'Automates social media posting and engagement',
    autonomy: 4,
    toolUse: 5,
    reliability: 4,
    costEffectiveness: 3,
    creativity: 4,
    customMetric: '',
    customLabels: ['Autonomy', 'Tool Use', 'Reliability', 'Cost-Effectiveness', 'Creativity']
  });

  const [styling, setStyling] = useState({
    primaryColor: '#04EAFD',
    secondaryColor: '#6AF66A',
    backgroundColor: '#FFFFFF',
    textColor: '#2E2E32',
    borderRadius: '12',
    cardWidth: '600',
    cardHeight: '800',
    fontSize: '16',
    fontFamily: 'Inter'
  });

  const [chartOptions, setChartOptions] = useState({
    showGrid: true,
    showLabels: true,
    showLegend: false,
    animationDuration: 1200,
    pointRadius: 6,
    borderWidth: 2.5,
    fillOpacity: 0.15
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const chartRef = useRef(null);
  const cardRef = useRef(null);

  // Calculate derived values
  const scores = [
    agentData.autonomy,
    agentData.toolUse,
    agentData.reliability,
    agentData.costEffectiveness,
    agentData.creativity
  ];
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / 5;
  const automationLevel = Math.round((totalScore / 25) * 100);

  const getStatus = () => {
    if (averageScore >= 4.0) return 'ACTIVE';
    if (averageScore >= 3.0) return 'MONITORING';
    return 'REVIEW';
  };

  const keyMetric = agentData.customMetric || `${automationLevel}% Automation`;
  const status = getStatus();

  // Chart data configuration
  const chartData = {
    labels: agentData.customLabels,
    datasets: [
      {
        data: scores,
        backgroundColor: `${styling.primaryColor}${Math.round(chartOptions.fillOpacity * 255).toString(16).padStart(2, '0')}`,
        borderColor: styling.primaryColor,
        borderWidth: chartOptions.borderWidth,
        pointBackgroundColor: styling.primaryColor,
        pointBorderColor: styling.backgroundColor,
        pointBorderWidth: 2,
        pointRadius: chartOptions.pointRadius,
      },
    ],
  };

  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartOptions.animationDuration,
    },
    plugins: {
      legend: {
        display: chartOptions.showLegend,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: styling.primaryColor,
        borderWidth: 1,
        titleColor: styling.textColor,
        bodyColor: styling.textColor,
        callbacks: {
          label: (context) => `Score: ${context.raw}/5`,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        angleLines: {
          display: chartOptions.showGrid,
          color: `${styling.textColor}26`,
        },
        grid: {
          display: chartOptions.showGrid,
          color: `${styling.textColor}1A`,
        },
        pointLabels: {
          display: chartOptions.showLabels,
          font: {
            family: styling.fontFamily,
            size: parseInt(styling.fontSize) - 3,
            weight: '600',
          },
          color: styling.textColor,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  // Generate complete HTML code
  const generateHTML = () => {
    const gradientStops = `
      <stop offset="0%" style="stop-color:${styling.primaryColor}"/>
      <stop offset="100%" style="stop-color:${styling.secondaryColor}"/>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoodHelpAI Agent Evaluation - ${agentData.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=${styling.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: '${styling.fontFamily}', sans-serif; 
            background: transparent; 
            color: ${styling.textColor}; 
            line-height: 1.6; 
            margin: 0; 
            padding: 0; 
            font-size: ${styling.fontSize}px;
        }
        .goodhelp-container { 
            width: 100%; 
            max-width: ${styling.cardWidth}px; 
            margin: 0 auto; 
            padding: 1rem; 
        }
        .agent-card {
            background: ${styling.backgroundColor}; 
            border-radius: ${styling.borderRadius}px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(46, 46, 50, 0.08); 
            padding: 2rem;
            height: ${styling.cardHeight}px;
            display: flex; 
            flex-direction: column; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            overflow: hidden;
        }
        .agent-card:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
        }
        .card-header { 
            display: flex; 
            align-items: flex-start; 
            justify-content: space-between; 
            margin-bottom: 1.75rem; 
            gap: 1rem; 
        }
        .status-badge {
            background: linear-gradient(135deg, ${styling.primaryColor}, ${styling.secondaryColor}); 
            color: ${styling.backgroundColor};
            font-size: 0.875rem; 
            font-weight: 700; 
            padding: 0.5rem 1rem; 
            border-radius: ${Math.round(parseInt(styling.borderRadius) * 0.5)}px;
            text-transform: uppercase; 
            letter-spacing: 0.025em; 
            white-space: nowrap; 
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        .agent-title { 
            font-size: 1.5rem; 
            font-weight: 700; 
            color: ${styling.textColor}; 
            line-height: 1.3; 
            margin: 0; 
        }
        .chart-section { 
            flex-grow: 1; 
            position: relative; 
            min-height: 0; 
            margin-bottom: 1.5rem; 
        }
        .chart-container { 
            position: relative; 
            height: 100%; 
            width: 100%; 
        }
        .metrics-footer {
            background: linear-gradient(135deg, ${styling.primaryColor}0D, ${styling.secondaryColor}0D);
            border-radius: ${Math.round(parseInt(styling.borderRadius) * 0.75)}px; 
            padding: 1.5rem; 
            text-align: center;
            border: 1px solid ${styling.primaryColor}1A;
        }
        .metric-label {
            font-size: 0.875rem; 
            font-weight: 500; 
            color: ${styling.textColor}B3;
            text-transform: uppercase; 
            letter-spacing: 0.025em; 
            margin-bottom: 0.5rem;
        }
        .metric-value {
            font-size: 2rem; 
            font-weight: 800; 
            background: linear-gradient(135deg, ${styling.primaryColor}, ${styling.secondaryColor});
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text; 
            line-height: 1.2;
        }
        @media (max-width: 768px) {
            .goodhelp-container { max-width: 100%; padding: 0.75rem; }
            .agent-card { padding: 1.5rem; }
            .agent-title { font-size: 1.25rem; }
            .metric-value { font-size: 1.75rem; }
            .status-badge { font-size: 0.75rem; padding: 0.375rem 0.75rem; }
        }
    </style>
</head>
<body>
    <div class="goodhelp-container">
        <div class="agent-card">
            <header class="card-header">
                <div><h3 class="agent-title">${agentData.title}</h3></div>
                <div class="status-badge">${status}</div>
            </header>
            <section class="chart-section">
                <div class="chart-container">
                    <canvas id="radarChart" width="400" height="400"></canvas>
                </div>
            </section>
            <footer class="metrics-footer">
                <div class="metric-label">${agentData.customMetric ? 'Key Metric' : 'Automation Level'}</div>
                <div class="metric-value">${keyMetric}</div>
            </footer>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script>
        (function() {
            const agentData = {
                scores: [${scores.join(', ')}],
                labels: ${JSON.stringify(agentData.customLabels)}
            };
            
            function initializeChart() {
                try {
                    const canvas = document.getElementById('radarChart');
                    if (!canvas || typeof Chart === 'undefined') return;
                    
                    new Chart(canvas.getContext('2d'), {
                        type: 'radar',
                        data: {
                            labels: agentData.labels,
                            datasets: [{
                                data: agentData.scores,
                                backgroundColor: '${styling.primaryColor}${Math.round(chartOptions.fillOpacity * 255).toString(16).padStart(2, '0')}',
                                borderColor: '${styling.primaryColor}',
                                borderWidth: ${chartOptions.borderWidth},
                                pointBackgroundColor: '${styling.primaryColor}',
                                pointBorderColor: '${styling.backgroundColor}',
                                pointBorderWidth: 2,
                                pointRadius: ${chartOptions.pointRadius}
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: { duration: ${chartOptions.animationDuration} },
                            plugins: {
                                legend: { display: ${chartOptions.showLegend} },
                                tooltip: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderColor: '${styling.primaryColor}',
                                    borderWidth: 1,
                                    titleColor: '${styling.textColor}',
                                    bodyColor: '${styling.textColor}',
                                    callbacks: { label: ctx => 'Score: ' + ctx.raw + '/5' }
                                }
                            },
                            scales: {
                                r: {
                                    beginAtZero: true, min: 0, max: 5,
                                    angleLines: { 
                                        display: ${chartOptions.showGrid},
                                        color: '${styling.textColor}26' 
                                    },
                                    grid: { 
                                        display: ${chartOptions.showGrid},
                                        color: '${styling.textColor}1A' 
                                    },
                                    pointLabels: { 
                                        display: ${chartOptions.showLabels},
                                        font: { 
                                            family: '${styling.fontFamily}', 
                                            size: ${parseInt(styling.fontSize) - 3}, 
                                            weight: '600' 
                                        }, 
                                        color: '${styling.textColor}' 
                                    },
                                    ticks: { display: false }
                                }
                            }
                        }
                    });
                } catch (error) {
                    console.error('Chart initialization failed:', error);
                }
            }
            
            if (document.readyState === 'complete') setTimeout(initializeChart, 100);
            document.addEventListener('DOMContentLoaded', () => setTimeout(initializeChart, 200));
            window.addEventListener('load', () => setTimeout(initializeChart, 300));
        })();
    </script>
</body>
</html>`;
  };

  // Generate SVG
  const generateSVG = () => {
    const size = 400;
    const center = size / 2;
    const radius = 160;
    const angleStep = (2 * Math.PI) / 5;
    const startAngle = -Math.PI / 2;

    const dataPoints = scores.map((score, index) => {
      const angle = startAngle + (index * angleStep);
      const distance = (score / 5) * radius;
      return {
        x: center + Math.cos(angle) * distance,
        y: center + Math.sin(angle) * distance
      };
    });

    const labelPoints = agentData.customLabels.map((label, index) => {
      const angle = startAngle + (index * angleStep);
      const labelDistance = radius + 30;
      return {
        x: center + Math.cos(angle) * labelDistance,
        y: center + Math.sin(angle) * labelDistance,
        label
      };
    });

    const gridCircles = [1, 2, 3, 4, 5].map(level => {
      const r = (level / 5) * radius;
      return `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="${styling.textColor}1A" stroke-width="1"/>`;
    }).join('');

    const gridLines = labelPoints.map((point, index) => {
      const angle = startAngle + (index * angleStep);
      const endX = center + Math.cos(angle) * radius;
      const endY = center + Math.sin(angle) * radius;
      return `<line x1="${center}" y1="${center}" x2="${endX}" y2="${endY}" stroke="${styling.textColor}26" stroke-width="1"/>`;
    }).join('');

    const dataPath = dataPoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    const dataPointsMarkup = dataPoints.map(point => 
      `<circle cx="${point.x}" cy="${point.y}" r="${chartOptions.pointRadius}" fill="${styling.primaryColor}" stroke="${styling.backgroundColor}" stroke-width="2"/>`
    ).join('');

    const labelsMarkup = labelPoints.map(point => {
      const textAnchor = point.x < center - 5 ? 'end' : point.x > center + 5 ? 'start' : 'middle';
      const dy = point.y < center - 5 ? '-5' : point.y > center + 5 ? '15' : '5';
      return `<text x="${point.x}" y="${point.y}" text-anchor="${textAnchor}" dy="${dy}" font-family="${styling.fontFamily}" font-size="12" font-weight="600" fill="${styling.textColor}">${point.label}</text>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="statusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${styling.primaryColor}"/>
      <stop offset="100%" style="stop-color:${styling.secondaryColor}"/>
    </linearGradient>
  </defs>
  
  <rect width="100%" height="100%" fill="${styling.backgroundColor}"/>
  <text x="200" y="30" font-family="${styling.fontFamily}" font-size="18" font-weight="700" fill="${styling.textColor}" text-anchor="middle">${agentData.title}</text>
  <rect x="320" y="40" width="60" height="20" rx="10" fill="url(#statusGradient)"/>
  <text x="350" y="52" font-family="${styling.fontFamily}" font-size="10" font-weight="700" fill="${styling.backgroundColor}" text-anchor="middle">${status}</text>
  
  ${chartOptions.showGrid ? gridCircles : ''}
  ${chartOptions.showGrid ? gridLines : ''}
  
  <path d="${dataPath}" fill="${styling.primaryColor}${Math.round(chartOptions.fillOpacity * 255).toString(16).padStart(2, '0')}" stroke="${styling.primaryColor}" stroke-width="${chartOptions.borderWidth}"/>
  ${dataPointsMarkup}
  ${chartOptions.showLabels ? labelsMarkup : ''}
  
  <rect x="150" y="350" width="100" height="40" rx="8" fill="${styling.primaryColor}0D" stroke="${styling.primaryColor}1A"/>
  <text x="200" y="365" font-family="${styling.fontFamily}" font-size="11" fill="${styling.textColor}B3" text-anchor="middle">${agentData.customMetric ? 'KEY METRIC' : 'AUTOMATION LEVEL'}</text>
  <text x="200" y="380" font-family="${styling.fontFamily}" font-size="16" font-weight="800" fill="${styling.primaryColor}" text-anchor="middle">${keyMetric}</text>
  <text x="200" y="395" font-family="${styling.fontFamily}" font-size="8" fill="${styling.textColor}99" text-anchor="middle">GoodHelpAI Agent Evaluation</text>
</svg>`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download functions
  const downloadHTML = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentData.title.replace(/\s+/g, '_').toLowerCase()}_radar_chart.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSVG = () => {
    const svgContent = generateSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentData.title.replace(/\s+/g, '_').toLowerCase()}_radar_chart.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        });
        
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${agentData.title.replace(/\s+/g, '_').toLowerCase()}_radar_chart.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Failed to generate PNG:', error);
      }
    }
  };

  // Update handlers
  const handleDataChange = (field, value) => {
    setAgentData(prev => ({
      ...prev,
      [field]: field.includes('autonomy') || field.includes('toolUse') || field.includes('reliability') || field.includes('costEffectiveness') || field.includes('creativity') 
        ? Math.max(1, Math.min(5, parseInt(value) || 1))
        : value
    }));
  };

  const handleStylingChange = (field, value) => {
    setStyling(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChartOptionsChange = (field, value) => {
    setChartOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomLabelsChange = (index, value) => {
    const newLabels = [...agentData.customLabels];
    newLabels[index] = value;
    setAgentData(prev => ({
      ...prev,
      customLabels: newLabels
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Radar Graph Generator</h1>
          <p className="text-slate-600">Create beautiful, customizable radar charts for your data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="data" className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Data
                    </TabsTrigger>
                    <TabsTrigger value="styling" className="flex items-center gap-1">
                      <Palette className="w-4 h-4" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center gap-1">
                      <Sliders className="w-4 h-4" />
                      Chart
                    </TabsTrigger>
                    <TabsTrigger value="export" className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Export
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="data" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={agentData.title}
                          onChange={(e) => handleDataChange('title', e.target.value)}
                          placeholder="Enter chart title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="useCase">Use Case</Label>
                        <Textarea
                          id="useCase"
                          value={agentData.useCase}
                          onChange={(e) => handleDataChange('useCase', e.target.value)}
                          placeholder="Describe the use case"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="customMetric">Custom Metric (optional)</Label>
                        <Input
                          id="customMetric"
                          value={agentData.customMetric}
                          onChange={(e) => handleDataChange('customMetric', e.target.value)}
                          placeholder="e.g., 95% Accuracy"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Data Points</h4>
                        
                        {agentData.customLabels.map((label, index) => {
                          const fieldNames = ['autonomy', 'toolUse', 'reliability', 'costEffectiveness', 'creativity'];
                          const fieldName = fieldNames[index];
                          const value = agentData[fieldName];
                          
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Input
                                  value={label}
                                  onChange={(e) => handleCustomLabelsChange(index, e.target.value)}
                                  className="flex-1 mr-2"
                                  placeholder={`Label ${index + 1}`}
                                />
                                <Badge variant="outline">{value}/5</Badge>
                              </div>
                              <Slider
                                value={[value]}
                                onValueChange={(newValue) => handleDataChange(fieldName, newValue[0])}
                                max={5}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="styling" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={styling.primaryColor}
                            onChange={(e) => handleStylingChange('primaryColor', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={styling.primaryColor}
                            onChange={(e) => handleStylingChange('primaryColor', e.target.value)}
                            placeholder="#04EAFD"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={styling.secondaryColor}
                            onChange={(e) => handleStylingChange('secondaryColor', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={styling.secondaryColor}
                            onChange={(e) => handleStylingChange('secondaryColor', e.target.value)}
                            placeholder="#6AF66A"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={styling.backgroundColor}
                            onChange={(e) => handleStylingChange('backgroundColor', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={styling.backgroundColor}
                            onChange={(e) => handleStylingChange('backgroundColor', e.target.value)}
                            placeholder="#FFFFFF"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="textColor"
                            type="color"
                            value={styling.textColor}
                            onChange={(e) => handleStylingChange('textColor', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={styling.textColor}
                            onChange={(e) => handleStylingChange('textColor', e.target.value)}
                            placeholder="#2E2E32"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select value={styling.fontFamily} onValueChange={(value) => handleStylingChange('fontFamily', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Input
                          id="fontSize"
                          type="number"
                          value={styling.fontSize}
                          onChange={(e) => handleStylingChange('fontSize', e.target.value)}
                          min="12"
                          max="24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="borderRadius">Border Radius</Label>
                        <Input
                          id="borderRadius"
                          type="number"
                          value={styling.borderRadius}
                          onChange={(e) => handleStylingChange('borderRadius', e.target.value)}
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardWidth">Card Width (px)</Label>
                        <Input
                          id="cardWidth"
                          type="number"
                          value={styling.cardWidth}
                          onChange={(e) => handleStylingChange('cardWidth', e.target.value)}
                          min="300"
                          max="1000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardHeight">Card Height (px)</Label>
                        <Input
                          id="cardHeight"
                          type="number"
                          value={styling.cardHeight}
                          onChange={(e) => handleStylingChange('cardHeight', e.target.value)}
                          min="400"
                          max="1200"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showGrid">Show Grid</Label>
                        <input
                          id="showGrid"
                          type="checkbox"
                          checked={chartOptions.showGrid}
                          onChange={(e) => handleChartOptionsChange('showGrid', e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showLabels">Show Labels</Label>
                        <input
                          id="showLabels"
                          type="checkbox"
                          checked={chartOptions.showLabels}
                          onChange={(e) => handleChartOptionsChange('showLabels', e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showLegend">Show Legend</Label>
                        <input
                          id="showLegend"
                          type="checkbox"
                          checked={chartOptions.showLegend}
                          onChange={(e) => handleChartOptionsChange('showLegend', e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <Separator />

                      <div>
                        <Label htmlFor="pointRadius">Point Radius: {chartOptions.pointRadius}px</Label>
                        <Slider
                          value={[chartOptions.pointRadius]}
                          onValueChange={(value) => handleChartOptionsChange('pointRadius', value[0])}
                          max={12}
                          min={2}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="borderWidth">Border Width: {chartOptions.borderWidth}px</Label>
                        <Slider
                          value={[chartOptions.borderWidth]}
                          onValueChange={(value) => handleChartOptionsChange('borderWidth', value[0])}
                          max={5}
                          min={1}
                          step={0.5}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fillOpacity">Fill Opacity: {Math.round(chartOptions.fillOpacity * 100)}%</Label>
                        <Slider
                          value={[chartOptions.fillOpacity]}
                          onValueChange={(value) => handleChartOptionsChange('fillOpacity', value[0])}
                          max={1}
                          min={0}
                          step={0.05}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="animationDuration">Animation Duration: {chartOptions.animationDuration}ms</Label>
                        <Slider
                          value={[chartOptions.animationDuration]}
                          onValueChange={(value) => handleChartOptionsChange('animationDuration', value[0])}
                          max={3000}
                          min={0}
                          step={100}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Export Options</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          Download your radar chart in different formats for various use cases.
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <Button onClick={downloadHTML} className="w-full justify-start" variant="outline">
                          <Code2 className="w-4 h-4 mr-2" />
                          Download HTML
                          <span className="ml-auto text-xs text-slate-500">Embeddable</span>
                        </Button>

                        <Button onClick={downloadPNG} className="w-full justify-start" variant="outline">
                          <Image className="w-4 h-4 mr-2" />
                          Download PNG
                          <span className="ml-auto text-xs text-slate-500">High Quality</span>
                        </Button>

                        <Button onClick={downloadSVG} className="w-full justify-start" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Download SVG
                          <span className="ml-auto text-xs text-slate-500">Vector</span>
                        </Button>

                        <Separator />

                        <Button onClick={copyToClipboard} className="w-full justify-start" variant="outline">
                          {copied ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          {copied ? 'Copied!' : 'Copy HTML Code'}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div 
                    ref={cardRef}
                    className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-8 transition-all duration-300"
                    style={{
                      width: `${Math.min(parseInt(styling.cardWidth), 500)}px`,
                      height: `${Math.min(parseInt(styling.cardHeight), 600)}px`,
                      backgroundColor: styling.backgroundColor,
                      borderRadius: `${styling.borderRadius}px`,
                      color: styling.textColor,
                      fontFamily: styling.fontFamily,
                      fontSize: `${styling.fontSize}px`
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-xl font-bold leading-tight" style={{ color: styling.textColor }}>
                        {agentData.title}
                      </h3>
                      <div 
                        className="px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide text-white"
                        style={{
                          background: `linear-gradient(135deg, ${styling.primaryColor}, ${styling.secondaryColor})`,
                          borderRadius: `${Math.round(parseInt(styling.borderRadius) * 0.5)}px`
                        }}
                      >
                        {status}
                      </div>
                    </div>

                    <div className="flex-1 relative mb-6" style={{ height: '300px' }}>
                      <Radar ref={chartRef} data={chartData} options={chartConfig} />
                    </div>

                    <div 
                      className="text-center p-6 rounded-lg border"
                      style={{
                        background: `linear-gradient(135deg, ${styling.primaryColor}0D, ${styling.secondaryColor}0D)`,
                        borderColor: `${styling.primaryColor}1A`,
                        borderRadius: `${Math.round(parseInt(styling.borderRadius) * 0.75)}px`
                      }}
                    >
                      <div 
                        className="text-sm font-medium uppercase tracking-wide mb-2"
                        style={{ color: `${styling.textColor}B3` }}
                      >
                        {agentData.customMetric ? 'Key Metric' : 'Automation Level'}
                      </div>
                      <div 
                        className="text-2xl font-extrabold"
                        style={{
                          background: `linear-gradient(135deg, ${styling.primaryColor}, ${styling.secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {keyMetric}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600">Total Score</div>
                    <div className="font-semibold">{totalScore}/25</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Average Score</div>
                    <div className="font-semibold">{averageScore.toFixed(1)}/5</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Status</div>
                    <Badge variant={status === 'ACTIVE' ? 'default' : status === 'MONITORING' ? 'secondary' : 'destructive'}>
                      {status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-slate-600">Automation Level</div>
                    <div className="font-semibold">{automationLevel}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarGraphGenerator;

