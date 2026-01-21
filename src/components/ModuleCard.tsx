import { motion } from 'framer-motion'
import { SecurityModule } from '@/lib/types'
import { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
    module: SecurityModule
    icon: LucideIcon
    onClick: (module: SecurityModule) => void
    index: number
}

export function ModuleCard({ module, icon: Icon, onClick, index }: ModuleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onClick(module)}
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

                    <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground font-mono">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Active Challenge
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
