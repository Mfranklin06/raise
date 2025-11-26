"use client"

import { UnidadeAC } from "@/lib/data"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"

interface ParameterOption {
    value: string | null
    label: string
}

interface InteractiveParameterControlProps {
    label: string
    value: string | number | null
    unit?: string
    min?: number
    max?: number
    step?: number
    options?: ParameterOption[]
    onChangeAction: (value: number | string) => void
    disabled?: boolean
    unidades?: UnidadeAC[]
}

export function InteractiveParameterControl({
    label,
    value,
    unit,
    min = 17,
    max = 25,
    step = 1,
    options,
    onChangeAction,
    disabled = false
}: InteractiveParameterControlProps) {

    // For numeric controls (like temperature)
    if (!options) {
        const numericValue = typeof value === "number" ? value : 22

        return (
            <div className={`space-y-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => onChangeAction(Math.max(min, numericValue - step))}
                            disabled={numericValue <= min || disabled}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Diminuir"
                        >
                            <Minus className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground tabular-nums">
                                {numericValue}
                                <span className="text-lg text-muted-foreground ml-1">{unit}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onChangeAction(Math.min(max, numericValue + step))}
                            disabled={numericValue >= max || disabled}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Aumentar"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Custom Range Slider */}
                    <div className="relative w-full h-6 flex items-center">
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={numericValue}
                            onChange={(e) => onChangeAction(Number(e.target.value))}
                            disabled={disabled}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{min}{unit}</span>
                        <span>{max}{unit}</span>
                    </div>
                </div>
            </div>
        )
    }

    // For option-based controls (like mode selection)
    const currentIndex = options.findIndex((opt) => opt.value === value) !== -1
        ? options.findIndex((opt) => opt.value === value)
        : 0; // Default to first option if not found

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onChangeAction(options[currentIndex - 1].value ?? "")
        }
    }

    const handleNext = () => {
        if (currentIndex < options.length - 1) {
            onChangeAction(options[currentIndex + 1].value ?? "")
        }
    }

    return (
        <div className={`space-y-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 || disabled}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="text-center flex-1 min-w-0">
                        <div className="text-lg font-semibold text-foreground truncate px-2">
                            {options[currentIndex]?.label || "Selecione"}
                        </div>
                        <div className="flex justify-center mt-2 space-x-1.5">
                            {options.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "bg-primary w-4"
                                            : "bg-muted-foreground/30"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === options.length - 1 || disabled}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
