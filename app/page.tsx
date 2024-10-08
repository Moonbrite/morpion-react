"use client";
import React, {useState} from 'react';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
    value: SquareValue;
    onSquareClick: () => void;
}

function Square({value, onSquareClick}: SquareProps) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

interface BoardProps {
    squares: SquareValue[];
    onPlay: (nextSquares: SquareValue[]) => void;
}

function iaPlay(nextSquares: SquareValue[]) {
    // Vérifie si l'IA peut gagner
    const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Lignes verticales
        [0, 4, 8], [2, 4, 6],            // Diagonales
    ];

    const checkWinningMove = (player: SquareValue) => {
        for (let i = 0; i < winLines.length; i++) {
            const [a, b, c] = winLines[i];
            if (nextSquares[a] === player && nextSquares[b] === player && nextSquares[c] === null) {
                return c; // Compléter la ligne
            }
            if (nextSquares[a] === player && nextSquares[b] === null && nextSquares[c] === player) {
                return b;
            }
            if (nextSquares[a] === null && nextSquares[b] === player && nextSquares[c] === player) {
                return a;
            }
        }
        return null;
    };

    // Étape 1: Vérifier si l'IA peut gagner
    let move = checkWinningMove('O');
    if (move !== null) {
        nextSquares[move] = 'O';
        return nextSquares;
    }

    // Étape 2: Vérifier si l'adversaire peut gagner et le bloquer
    move = checkWinningMove('X');
    if (move !== null) {
        nextSquares[move] = 'O';
        return nextSquares;
    }

    // Étape 3: Jouer dans une position stratégique (coin, centre)
    const strategicMoves = [4, 0, 2, 6, 8]; // Centre et coins
    for (let i = 0; i < strategicMoves.length; i++) {
        if (nextSquares[strategicMoves[i]] === null) {
            nextSquares[strategicMoves[i]] = 'O';
            return nextSquares;
        }
    }

    // Si aucune position stratégique n'est disponible, jouer une case vide au hasard
    for (let i = 0; i < nextSquares.length; i++) {
        if (nextSquares[i] === null) {
            nextSquares[i] = 'O';
            return nextSquares;
        }
    }

    return nextSquares;
}

function Board({squares, onPlay}: BoardProps) {

    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();

        nextSquares[i] = 'X';

        iaPlay(nextSquares);

        onPlay(nextSquares);

    }


    const winner = calculateWinner(squares);
    let status ="";
    if (winner) {
        status = 'Gagnant: ' + winner;
    } else if (!squares.slice().includes(null)) {
        status = 'Egalité';
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState<number>(0);
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: SquareValue[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }


    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description: string;
        if (move > 0) {
            description = 'Aller au coup #' + move;
        } else {
            description = 'Recommencer';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <>
            <h2>Le Tic-Tac-Toe de Ouf</h2>
            <div className="game">
                <div className="game-board">
                    <Board squares={currentSquares} onPlay={handlePlay}/>
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        </>
    );
}

function calculateWinner(squares: SquareValue[]): SquareValue {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}