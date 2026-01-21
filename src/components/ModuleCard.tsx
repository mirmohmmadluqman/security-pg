import { motion } from 'framer-motion'
import { SecurityModule } from '@/lib/types'
import { LucideIcon, Bug, Zap, Lock, Shield, Cpu, ExternalLink, DollarSign, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
    module: SecurityModule
    icon?: LucideIcon
    onClick?: (module: SecurityModule) => void
    index: number
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

export function ModuleCard({ module, icon, onClick, index }: ModuleCardProps) {
    const Icon = icon || getDefaultIcon(module.id, module.isRealWorld)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onClick?.(module)}
            className="group relative cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
            <div className="relative h-full glass-card p-6 rounded-xl border border-white/10 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6" />
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

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {module.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {module.description}
                    </p>

                    {module.isRealWorld ? (
                        <div className="mt-auto pt-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center text-red-400">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    Loss: {module.loss}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {module.date}
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-blue-400 font-mono">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                                Case Study
                            </div>
                        </div>
                    ) : (
                        <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground font-mono">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            Active Challenge
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
