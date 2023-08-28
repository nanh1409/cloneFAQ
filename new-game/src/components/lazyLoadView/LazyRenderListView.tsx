import { memo, useEffect, useState } from 'react';
import LoadingGameIcon from '../LoadingGameIcon';

const DEFAULT_NUM_ITEM_PER_SEC = 10;
function LazyRenderListView(props: { items: Array<JSX.Element>, numItemPerSec?: number }) {
    const { items, numItemPerSec: numItems = DEFAULT_NUM_ITEM_PER_SEC } = props;
    const [renderIndex, setRenderIndex] = useState(numItems);

    useEffect(() => {
        let timeoutId: any;
        if (renderIndex < items.length)
            timeoutId = setTimeout(() => {
                if (renderIndex < items.length) {
                    setRenderIndex(renderIndex + numItems);
                }
            }, 1000);
        else if (timeoutId) clearTimeout(timeoutId);
        return () => {
            if (timeoutId)
                clearTimeout(timeoutId);
        }
    }, [renderIndex, items.length, numItems]);

    return (<>
        {items?.map((ViewItem: JSX.Element, index) => {
            if (index < renderIndex)
                return <div key={index}>{ViewItem}</div>
            return <div key={index}></div>
        })}
        {items.length > renderIndex && <LoadingGameIcon />}
    </>)
}

export default memo(LazyRenderListView);
