export default function SalasLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            {/* --- BACKGROUND TECH --- */}
            {/* Grid Pattern sutil */}
            <div
                className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Vignette (sombra nas bordas) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem] relative z-10">
                {children}
            </div>
        </main>
    )
}
