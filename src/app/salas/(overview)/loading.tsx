export default function LoadingRooms() {
    return (
        <div className="space-y-6">
            <span className="sr-only">Carregando...</span>
            {/* Search Bar Skeleton */}
            <div className="w-full max-w-md mx-auto mb-8">
                <div className="h-12 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-6 animate-pulse"
                    >
                        {/* Header Skeleton */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-6 w-32 bg-muted/20 rounded-md" />
                                <div className="h-4 w-24 bg-muted/10 rounded-md" />
                            </div>
                            <div className="h-6 w-16 bg-muted/20 rounded-full" />
                        </div>

                        {/* Controls Skeleton */}
                        <div className="space-y-4">
                            {/* Temp Control */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-20 bg-muted/10 rounded-md" />
                                    <div className="h-4 w-8 bg-muted/10 rounded-md" />
                                </div>
                                <div className="h-10 w-full bg-muted/10 rounded-lg" />
                            </div>

                            {/* Mode Control */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-16 bg-muted/10 rounded-md" />
                                    <div className="h-4 w-12 bg-muted/10 rounded-md" />
                                </div>
                                <div className="h-10 w-full bg-muted/10 rounded-lg" />
                            </div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                            <div className="h-8 w-24 bg-muted/10 rounded-lg" />
                            <div className="h-4 w-32 bg-muted/10 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}