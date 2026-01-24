'use client'

import { SecurityModule } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Shield, Zap, BookOpen, ExternalLink, Target, Info, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { ZoomableImage } from '@/components/ImageZoom'
import { cn } from '@/lib/utils'

interface InfoPanelProps {
  module: SecurityModule
}

export function InfoPanel({ module }: InfoPanelProps) {
  return (
    <div className="p-6 space-y-6 text-slate-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white tracking-wide">
              {module.title}
            </h3>
          </div>
          <Badge variant="outline" className={cn(
            "capitalize border-white/10",
            module.difficulty === 'beginner' && "text-green-400 bg-green-400/10",
            module.difficulty === 'intermediate' && "text-yellow-400 bg-yellow-400/10",
            module.difficulty === 'advanced' && "text-red-400 bg-red-400/10"
          )}>
            {module.difficulty}
          </Badge>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-primary/30 pl-4 whitespace-pre-wrap">
          {module.description}
        </p>
      </div>

      <div className="relative group">
        <Tabs defaultValue="vulnerability" className="w-full">
          <TabsList
            id="info-tabs-list"
            className="w-full flex h-auto bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto no-scrollbar justify-start relative px-6 snap-x"
          >
            <TabsTrigger value="vulnerability" className="flex-1 min-w-fit text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary whitespace-nowrap px-4 snap-center"
              onClick={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}>
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Bug
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex-1 min-w-fit text-xs py-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 whitespace-nowrap px-4 snap-center"
              onClick={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}>
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Impact
            </TabsTrigger>
            <TabsTrigger value="prevention" className="flex-1 min-w-fit text-xs py-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 whitespace-nowrap px-4 snap-center"
              onClick={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}>
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              fix
            </TabsTrigger>
            {module.images && module.images.length > 0 && (
              <TabsTrigger value="evidence" className="flex-1 min-w-fit text-xs py-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 whitespace-nowrap px-4 snap-center"
                onClick={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}>
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                Evidence
              </TabsTrigger>
            )}
            <TabsTrigger value="references" className="flex-1 min-w-fit text-xs py-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 whitespace-nowrap px-4 snap-center"
              onClick={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}>
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Learn
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="vulnerability" className="space-y-4 m-0">
              <Card className="glass-card border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-orange-400">
                    <AlertTriangle className="w-4 h-4" />
                    The Vulnerability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {module.vulnerability}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                    <Info className="w-4 h-4" />
                    Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {module.explanation}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="m-0">
              <Card className="glass-card border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                    <Zap className="w-4 h-4" />
                    Critical Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {module.impact}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prevention" className="m-0">
              <Card className="glass-card border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-400">
                    <Shield className="w-4 h-4" />
                    Remediation Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {module.prevention}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {module.images && module.images.length > 0 && (
              <TabsContent value="evidence" className="m-0">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-400">
                      <ImageIcon className="w-4 h-4" />
                      Vulnerability Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {module.images.map((img, index) => (
                        <ZoomableImage
                          key={index}
                          src={img}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-48 rounded-xl border border-white/5 overflow-hidden shadow-lg bg-white/5"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="references" className="m-0">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-purple-400">
                    <BookOpen className="w-4 h-4" />
                    Further Reading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {module.references.map((reference, index) => (
                    <a
                      key={index}
                      href={reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group p-2 rounded-md hover:bg-white/5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>{reference.split('/').pop()?.replace(/[-_]/g, ' ') || 'Documentation'}</span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            Mission Objectives
          </h4>
          <div className="space-y-3">
            {[
              "Analyze the vulnerable contract logic",
              "Deploy the exploit contract",
              "Drain funds or manipulate state",
              "Patch the code to prevent attack"
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm group">
                <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  {i + 1}
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
