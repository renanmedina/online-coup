import React from "react";
import uniqid from "uniqid";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkullCrossbones, faCrown, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "./Player.scss";

const Player = ({ G, ctx, playerID, moves, i }) => {
  const player = G.players[i];
  const gameOver = G.winner.id !== "-1";

  const hand = [];
  player.hand.forEach((card) => {
    let revealCard = false;
    // image loading optimization: prepare to reveal a card
    if (ctx.activePlayers[i] === "revealCard") {
      revealCard = G.turnLog.challenge.revealedCard.length !== 0 && card.id === G.turnLog.challenge.revealedCard.id;
      G.players[i].hand.forEach((card) => {
        const img = new Image();
        img.src = card.front;
      });
    }
    hand.push(
      <img
        key={uniqid()}
        className={classNames(
          "character-card",
          { "character-card-discarded": card.discarded },
          { "character-card-reveal": revealCard }
        )}
        src={card.discarded ? "//:0" : gameOver || revealCard ? card.front : "/images/back.PNG"}
        alt={card.discarded ? "" : "card"}
      />
    );
  });

  const isCurrentPlayer = i === parseInt(ctx.currentPlayer);
  const isYourTurn = playerID === ctx.currentPlayer;
  const playerTargetedActions = ["coup", "assassinate", "steal"];
  const canSelectPlayer =
    playerTargetedActions.includes(G.turnLog.action) &&
    isYourTurn &&
    Object.keys(G.turnLog.target).length === 0 &&
    !player.isOut;
  const targeted = i === parseInt(G.turnLog.target.id);

  const setTarget = () => {
    if (canSelectPlayer) {
      const { name, id } = player;
      moves.setTarget({ name, id });
    }
  };

  /* css */

  let animate = "";
  if (player.isOut) {
    animate = "player-out";
  } else if (gameOver) {
    animate = "player-winner";
  } else if (isCurrentPlayer) {
    if (G.turnLog.action !== "") {
      animate = "player-entered";
    } else {
      animate = "player-enter";
    }
  } else if (isYourTurn) {
    if (canSelectPlayer) {
      animate = "player-select";
    } else if (targeted) {
      animate = "player-selected";
    }
  }

  let iconColor = "";
  if (G.turnLog.responses[i] === "allow") {
    iconColor = "#008000";
  } else if (G.turnLog.responses[i] === "block") {
    iconColor = "#8b0000";
  } else if (G.turnLog.responses[i] === "challenge") {
    iconColor = "#42526C";
  }

  return (
    <div className={`player ${animate}`} onClick={setTarget}>
      <div className="player-body">
        <div className="player-name">{player.name}</div>
        <div className="no-gutters d-flex" style={{ height: "60%" }}>
          {hand}
        </div>
        {player.isOut || gameOver ? (
          <div className="exiled-text">
            {player.isOut ? (
              <>
                <FontAwesomeIcon icon={faSkullCrossbones} />
                &nbsp;(exiled)&nbsp;
                <FontAwesomeIcon icon={faSkullCrossbones} />
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCrown} />
                &nbsp;winner&nbsp;
                <FontAwesomeIcon icon={faCrown} />
              </>
            )}
          </div>
        ) : (
          <div className="coin-row no-gutters">
            <div className="w-50 h-100 d-flex justify-content-end" style={{ paddingRight: "1%" }}>
              <img draggable={false} className="img-fluid h-100" src="/images/coin.png" alt="coins" />
            </div>
            <div className="w-50 d-flex align-items-center" style={{ paddingLeft: "1%" }}>
              {player.coins}
              <div className="response-icon" style={{ color: `${iconColor}` }}>
                {G.turnLog.responses[i] !== "" ? (
                  G.turnLog.responses[i] === "allow" ? (
                    <FontAwesomeIcon icon={faThumbsUp} />
                  ) : (
                    <FontAwesomeIcon icon={faThumbsDown} />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;