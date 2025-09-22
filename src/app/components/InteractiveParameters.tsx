"use client"

import { UnidadeAC } from "@/lib/data"
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon } from "@heroicons/react/24/solid"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Button, Slider } from "@mui/material"

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
}: InteractiveParameterControlProps) {

    if (!options) {
        const numericValue = typeof value === "number" ? value : 22

        return (
            <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="interactive-control bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onChangeAction(Math.max(min, numericValue - step))}
                            disabled={numericValue == min}
                            className="h-8 w-8 p-0"
                            sx={{
                                borderColor: "var(--card)",
                                color: "var(--primary)",
                                "&:hover": {
                                    backgroundColor: "var(--primary)",
                                    borderColor: "var(--primary)",
                                    color: "var(--card)"
                                }
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" >
                                <MinusIcon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            </svg>
                        </Button>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {numericValue}
                                {unit}
                            </div>
                        </div>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onChangeAction(Math.min(max, numericValue + step))}
                            disabled={numericValue == max}
                            className="h-8 w-8 p-0"
                            sx={{
                                borderColor: "var(--card)",
                                color: "var(--primary)",
                                "&:hover": {
                                    backgroundColor: "var(--primary)",
                                    borderColor: "var(--primary)",
                                    color: "var(--card)"
                                }
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" >
                                <PlusIcon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            </svg>
                        </Button>
                    </div>

                    <Slider
                        value={numericValue}
                        onChange={(_, newValue) => onChangeAction(newValue as number)}
                        aria-label={label}
                        valueLabelDisplay="auto"
                        step={step}
                        marks
                        min={min}
                        max={max}
                        className="parameter-slider"
                        sx={{ color: "var(--primary)" }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>
                            {min}
                            {unit}
                        </span>
                        <span>
                            {max}
                            {unit}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // For option-based controls (like mode selection)
    const currentIndex = options.findIndex((opt) => opt.value === value) !== -1
        ? options.findIndex((opt) => opt.value === value)
        : 3;


    // For option-based controls (like mode selection)
    if (options) {

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
            <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="interactive-control bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="h-8 w-8 p-0 border"
                            sx={{
                                borderColor: "var(--card)",
                                color: "var(--primary)",
                                "&:hover": {
                                    backgroundColor: "var(--primary)",
                                    borderColor: "var(--primary)",
                                    color: "var(--card)"
                                }
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" >
                                <ChevronLeftIcon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            </svg>
                        </Button>

                        <div className="text-center flex-1">
                            <div className="text-lg font-semibold text-foreground">{options[currentIndex]?.label || "N/A"}</div>
                            <div className="flex justify-center mt-2 space-x-1">
                                {options.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted border border-primary"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleNext}
                            disabled={currentIndex === 3}
                            className="h-8 w-8 p-0"
                            sx={{
                                borderColor: "var(--card)",
                                color: "var(--primary)",
                                "&:hover": {
                                    backgroundColor: "var(--primary)",
                                    borderColor: "var(--primary)",
                                    color: "var(--card)"
                                }
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" >
                                <ChevronRightIcon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // For numeric controls (like temperature, ventilation)
}
