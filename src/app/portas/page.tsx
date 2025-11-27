'use client'
import React, { useState } from "react";
import connectToMqttBroker from "../components/MqttConectionPorta";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, DoorOpen, DoorClosed, ShieldCheck, AlertCircle } from "lucide-react";

export default function Portas() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const toggleDoor = async () => {
        if (isPending) return;

        setIsPending(true);
        // Simulate network delay for better UX feel
        await new Promise(resolve => setTimeout(resolve, 600));

        const newState = !isOpen;
        setIsOpen(newState);
        connectToMqttBroker(newState ? 'aberta' : 'fechada');
        setIsPending(false);
    }

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
                            onClick={toggleDoor}
                            disabled={isPending}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen
                                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                                    : "bg-red-500/10 border-red-500/30 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]"
                                } border-2 cursor-pointer group`}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="open"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <DoorOpen className="w-20 h-20 text-emerald-500" />
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
                                {isOpen ? "Porta Aberta" : "Porta Fechada"}
                            </motion.h2>
                            <p className="text-sm text-muted-foreground">
                                {isOpen
                                    ? "Acesso liberado para entrada"
                                    : "Acesso bloqueado por segurança"}
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={toggleDoor}
                            disabled={isPending}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isOpen
                                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isPending ? (
                                <span className="animate-pulse">Processando...</span>
                            ) : (
                                <>
                                    {isOpen ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                    {isOpen ? "Trancar Porta" : "Destrancar Porta"}
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
