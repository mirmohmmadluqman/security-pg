'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageZoomContextType {
    openImage: (src: string, alt?: string) => void
}

const ImageZoomContext = createContext<ImageZoomContextType | undefined>(undefined)

export function useImageZoom() {
    const context = useContext(ImageZoomContext)
    if (!context) {
        throw new Error('useImageZoom must be used within an ImageZoomProvider')
    }
    return context
}

export function ImageZoomProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState<{ src: string, alt?: string } | null>(null)
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const openImage = useCallback((src: string, alt?: string) => {
        setCurrentImage({ src, alt })
        setIsOpen(true)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
    }, [])

    const closeImage = useCallback(() => {
        setIsOpen(false)
        setTimeout(() => setCurrentImage(null), 300)
    }, [])

    const handleWheel = (e: React.WheelEvent) => {
        if (!isOpen) return
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 5))
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1) return
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Lock body scroll and handle escape
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            // Prevent default scroll behavior on wheel when zoom modal is open
            const preventDefault = (e: WheelEvent) => {
                if (isOpen) e.preventDefault()
            }
            window.addEventListener('wheel', preventDefault, { passive: false })
            return () => {
                window.removeEventListener('wheel', preventDefault)
                document.body.style.overflow = 'unset'
            }
        } else {
            document.body.style.overflow = 'unset'
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeImage()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, closeImage])

    return (
        <ImageZoomContext.Provider value={{ openImage }}>
            {children}
            <AnimatePresence>
                {isOpen && currentImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-300"
                        onClick={closeImage}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            onWheel={handleWheel}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4 rounded-3xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.img
                                    src={currentImage.src}
                                    alt={currentImage.alt || 'Zoomed view'}
                                    style={{
                                        scale: zoom,
                                        x: position.x,
                                        y: position.y,
                                        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                    }}
                                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-2xl shadow-2xl pointer-events-auto transition-transform duration-100 ease-out"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    draggable={false}
                                />

                                {/* Controls */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full glass border border-white/10 shadow-2xl scale-110">
                                    <button
                                        onClick={() => setZoom(prev => Math.max(prev - 0.5, 0.5))}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <ZoomOut size={20} />
                                    </button>
                                    <span className="text-xs font-bold min-w-[3rem] text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <button
                                        onClick={() => setZoom(prev => Math.min(prev + 0.5, 5))}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                    <button
                                        onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }) }}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <Maximize2 size={20} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Close Button */}
                            <button
                                onClick={closeImage}
                                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-md transition-all group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ImageZoomContext.Provider>
    )
}

export function ZoomableImage({
    src,
    alt,
    className,
    style
}: {
    src: string,
    alt?: string,
    className?: string,
    style?: React.CSSProperties
}) {
    const { openImage } = useImageZoom()

    return (
        <div
            className={cn("relative cursor-zoom-in group overflow-hidden", className)}
            onClick={() => openImage(src, alt)}
            style={style}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={20} className="text-white" />
                </div>
            </div>
        </div>
    )
}
