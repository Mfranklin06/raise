export default function LoadingRooms() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/20 h-80 rounded-lg" aria-label="Loading room data">
                    <div className="h-full flex items-center justify-center">
                        <div className="text-muted-foreground">Carregando sala...</div>
                    </div>
                </div>
            ))}
        </div>
    )
}