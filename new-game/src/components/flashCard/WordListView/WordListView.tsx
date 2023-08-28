import MarkedTypeIcon from "./MarkedTypeIcon";
import MemorizedTypeIcon from "./MemorizedTypeIcon";
import NewTypeIcon from "./NewTypeIcon";
import UnMemorizedTypeIcon from "./UnMemorizedTypeIcon";
import WordTypeDetailBox from "./WordTypeDetailBox";
import "./wordListView.scss";
import WordTypeBox from "./WordTypeBox";
import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { flashCardTrans as _flashCardTrans } from "../FlashCardOverview";
import { useGameSelector } from "../../../hooks";

const wordTypeListObject = {
    "new": {
        icon: <NewTypeIcon />,
        color: "#FFB800",
        backgroundColor: "#FFF6E2",
        wordList: [],
    },
    "memorized": {
        icon: <MemorizedTypeIcon />,
        color: "#4CAF50",
        backgroundColor: "#EAF4EB",
        wordList: [],
    },
    "unmemorized": {
        icon: <UnMemorizedTypeIcon />,
        color: "#FF5252",
        backgroundColor: "#FDF0F0",
        wordList: [],
    },
    "marked": {
        icon: <MarkedTypeIcon />,
        color: "#02C2E8",
        backgroundColor: "#E1FAFE",
        wordList: [],
    }
}

function WordListView() {
    const gameObjects = useGameSelector(state => state.gameState.gameObjects)
    const flashCardView = useGameSelector(state => state.gameState.flashCardView)
    const language = useGameSelector(state => state.gameState?.gameSetting?.language ?? "en");
    const flashCardTrans = useMemo(() => _flashCardTrans[language], [language]);

    useMemo(() => {
        wordTypeListObject["new"].wordList = []
        wordTypeListObject["memorized"].wordList = []
        wordTypeListObject["unmemorized"].wordList = []
        wordTypeListObject["marked"].wordList = []

        gameObjects.forEach((gameObject) => {
            if (gameObject.status === 0) {
                wordTypeListObject["new"].wordList.push(gameObject)
            } else if (gameObject.status === 1 && gameObject.isCorrect) {
                wordTypeListObject["memorized"].wordList.push(gameObject)
            } else if (gameObject.status === 1 && !gameObject.isCorrect) {
                wordTypeListObject["unmemorized"].wordList.push(gameObject)
            }
            if (gameObject.bookmark) {
                wordTypeListObject["marked"].wordList.push(gameObject)
            }
        })
    }, [gameObjects.length, flashCardView])

    return (
        <div className="word-list-view-wrapper">
            <header className="word-list-view-header">
                <span>{flashCardTrans.wordList}</span>
            </header>

            <div className="word-list-view-type-list">
                <Grid container spacing={1.25}>
                    {Object.keys(wordTypeListObject).map(key => (
                        <Grid key={key} item xs={12} sm={6} xl={3} >
                            <WordTypeBox
                                wordTypeList={wordTypeListObject[key].wordList}
                                type={flashCardTrans[key]}
                                color={wordTypeListObject[key].color}
                                icon={wordTypeListObject[key].icon}
                                backgroundColor={wordTypeListObject[key].backgroundColor}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>

            <div className="word-type-list-detail">
                {Object.keys(wordTypeListObject).map(key => (
                    <div className="word-type-detail-wrapper" key={key}>
                        <WordTypeDetailBox
                            nameType={flashCardTrans[key]}
                            color={wordTypeListObject[key].color}
                            wordList={wordTypeListObject[key].wordList}
                            itemsToShow={2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WordListView;