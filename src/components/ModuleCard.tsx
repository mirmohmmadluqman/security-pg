import { motion } from 'framer-motion'
import { SecurityModule } from '@/lib/types'
import { LucideIcon, Bug, Zap, Lock, Shield, Cpu, ExternalLink, DollarSign, Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { useDirectionalHover } from '@/hooks/useDirectionalHover'

interface ModuleCardProps {
    module: SecurityModule
    icon?: LucideIcon
    onClick?: (module: SecurityModule) => void
    index: number
    completedChallenges?: number
    totalChallenges?: number
}

// Helper function to get default icon based on module id
function getDefaultIcon(id: string, isRealWorld?: boolean): LucideIcon {
    if (isRealWorld) return ExternalLink
    if (id.includes('reentrancy')) return Zap
    if (id.includes('access')) return Lock
    if (id.includes('overflow')) return Cpu
    if (id.includes('dos')) return Shield
    return Bug
}

export function ModuleCard({ module, icon, onClick, index, completedChallenges = 0, totalChallenges = 3 }: ModuleCardProps) {
    const Icon = icon || getDefaultIcon(module.id, module.isRealWorld)
    const cardRef = useRef<HTMLDivElement>(null)
    const { isHovered, direction, swooshAngle, handleMouseEnter, handleMouseLeave } = useDirectionalHover(cardRef)

    const isCompleted = completedChallenges === totalChallenges && totalChallenges > 0
    const hasProgress = completedChallenges > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onClick?.(module)}
            className="group relative cursor-pointer"
        >
            <div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ "--swoosh-angle": `${swooshAngle}deg` } as React.CSSProperties}
                className={cn(
                    "relative h-full animate-card-swoosh p-1 transition-all duration-500",
                    isHovered && `swoosh-${direction}`,
                    "bg-muted/50 border border-border"
                )}
            >
                <div className="relative h-full bg-card p-6 flex flex-col shadow-sm">
                    {/* Header: Icon & Difficulty */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-none">
                            <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className={cn(
                            "capitalize font-mono text-[10px] tracking-widest border-primary/20 rounded-none",
                            module.difficulty === 'beginner' && "text-green-500 dark:text-green-400",
                            module.difficulty === 'intermediate' && "text-yellow-600 dark:text-yellow-400",
                            module.difficulty === 'advanced' && "text-red-500 dark:text-red-400"
                        )}>
                            {module.difficulty}
                        </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                        {module.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                        {module.description}
                    </p>

                    {/* Progress / Stats Area */}
                    <div className="mt-auto">
                        <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground mb-4 py-2 border-y border-border/50">
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-primary" />
                                <span>~2 HRS</span>
                            </div>
                            <div className="w-1 h-1 bg-border" />
                            <div className="flex items-center gap-1.5">
                                <Bug size={12} className="text-primary" />
                                <span>{totalChallenges} UNITS</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between group/btn relative">
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-widest transition-colors",
                                isCompleted ? "text-green-600 dark:text-green-400" : "text-primary"
                            )}>
                                {isCompleted ? "Completed" : hasProgress ? "Continue Path" : "Start Path"}
                            </span>

                            <div className="flex items-center gap-2">
                                <div className="w-12 h-1 bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_hsl(var(--primary))]"
                                        style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    {completedChallenges}/{totalChallenges}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Border effect */}
                <div className="absolute inset-0 border border-border group-hover:border-primary/30 transition-colors pointer-events-none" />
            </div>
        </motion.div>
    )
}

