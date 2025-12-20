'use client'
// Logic update verified
import React, { useState, useEffect, useCallback } from "react";
import { useMqtt } from "@/context/mqtt-context";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, DoorOpen, DoorClosed, ShieldCheck, AlertCircle, Timer } from "lucide-react";

export default function Portas() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const { publish } = useMqtt();

    const handleAutoClose = useCallback(() => {
        setIsOpen(false);
        setCountdown(null);
        publish("porta/lab_pesquisa", "fechada");
    }, [publish]);

    // Effect for countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isOpen && countdown !== null && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (isOpen && countdown === 0) {
            // Auto close when countdown hits 0
            handleAutoClose();
        }

        return () => clearInterval(interval);
    }, [isOpen, countdown, handleAutoClose]);

    const handleOpenDoor = async () => {
        if (isPending || isOpen) return; // Prevent if already open or pending

        try {
            setIsPending(true);
            // Simulate network delay for better UX feel
            await new Promise(resolve => setTimeout(resolve, 600));

            setIsOpen(true);
            setCountdown(5); // Start 5s countdown
            publish("porta/lab_pesquisa", "aberta");

        } catch (error) {
            console.error('Erro ao abrir porta:', error);
            setIsOpen(false);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-6">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

            {/* Ambient Glow */}
            <motion.div
                animate={{
                    background: isOpen
                        ? "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)" // Green glow
                        : "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)" // Red glow
                }}
                className="absolute inset-0 z-0 transition-colors duration-1000"
            />

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-4">
                        <ShieldCheck className="w-4 h-4 text-primary-strong" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Controle de Acesso Seguro</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Gerenciamento de Portas</h1>
                    <p className="text-muted-foreground">Controle o acesso físico remotamente</p>
                </motion.div>

                {/* Main Control Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Status Indicator Line */}
                    <motion.div
                        animate={{ backgroundColor: isOpen ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)" }}
                        className="absolute top-0 left-0 w-full h-1"
                    />

                    <div className="flex flex-col items-center gap-8">

                        {/* Icon Container */}
                        <motion.button
                            onClick={handleOpenDoor}
                            disabled={isPending || isOpen}
                            whileHover={{ scale: isOpen ? 1 : 1.05 }}
                            whileTap={{ scale: isOpen ? 1 : 0.95 }}
                            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen
                                ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] cursor-default"
                                : "bg-red-500/10 border-red-500/30 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] cursor-pointer hover:bg-red-500/20"
                                } border-2 group`}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="open"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative"
                                    >
                                        <DoorOpen className="w-20 h-20 text-emerald-500" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                                        >
                                            {countdown}
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="closed"
                                        initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <DoorClosed className="w-20 h-20 text-red-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Pulse Effect */}
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </motion.button>

                        {/* Status Text */}
                        <div className="text-center space-y-2">
                            <motion.h2
                                layout
                                className="text-2xl font-semibold"
                            >
                                {isOpen ? (
                                    <span className="flex items-center justify-center gap-2">
                                        Aberta <span className="text-emerald-500 text-sm font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">Fechando em {countdown}s</span>
                                    </span>
                                ) : "Porta Fechada"}
                            </motion.h2>
                            <p className="text-sm text-muted-foreground">
                                {isOpen
                                    ? "Passagem liberada temporariamente"
                                    : "Toque abaixo para liberar o acesso"}
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleOpenDoor}
                            disabled={isPending || isOpen}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isOpen
                                ? "bg-muted/50 text-muted-foreground cursor-default shadow-none border border-border" // Disabled look
                                : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isPending ? (
                                <span className="animate-pulse">Processando...</span>
                            ) : isOpen ? (
                                <>
                                    <Timer className="w-5 h-5 animate-spin-slow" />
                                    Fechamento Automático...
                                </>
                            ) : (
                                <>
                                    <Unlock className="w-5 h-5" />
                                    Abrir Porta
                                </>
                            )}
                        </button>

                    </div>
                </motion.div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground/60"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>Conexão MQTT Segura Ativa</span>
                </motion.div>
            </div>
        </main>
    );
}
