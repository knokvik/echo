import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface InfiniteTriggerScrollProps {
    canLoadMore :boolean,
    isLoadingMore : boolean,
    onLoadMore : () => void,
    loadMoreText? : string,
    noMoreText? : string,
    classname? : string,
    ref? : React.Ref<HTMLDivElement>
}

export const InfiniteScrollTrigger = ({
    canLoadMore,
    isLoadingMore,
    onLoadMore,
    loadMoreText = "Load More",
    noMoreText = "No more items",
    classname,
    ref,
} : InfiniteTriggerScrollProps ) => {
    let text = "Load more text";
    if( isLoadingMore ) {
        text = "Loading..."
    } else if (!canLoadMore) {
        text = "No more text"
    }

    return (
        <div className={cn("flex w-full justify-center py-2" , classname)} ref={ref}>
            <Button
            disabled={!canLoadMore || !isLoadingMore}
            onClick={onLoadMore}
            size="sm"
            variant="ghost">
                {text}
            </Button>
        </div>
    )
}