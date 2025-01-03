class PathPuzzle {
    constructor(size = 10) {
        this.size = size;
        this.grid = Array(size).fill().map(() => Array(size).fill(0));
        this.moves = [
            [-3, 0],  // up 3
            [3, 0],   // down 3
            [0, -3],  // left 3
            [0, 3],   // right 3
            [-2, -2], // diagonal up-left 2
            [-2, 2],  // diagonal up-right 2
            [2, -2],  // diagonal down-left 2
            [2, 2]    // diagonal down-right 2
        ];
        this.currentNumber = 1;
        this.lastRow = null;
        this.lastCol = null;
        this.highScores = this.loadHighScores();
        this.startTime = null;
        this.timerInterval = null;
        this.modal = document.getElementById('game-over-modal');
        if (!this.modal) {
            console.error('Game over modal not found in the DOM');
        }
        this.initializeUI();
        this.updateHighScores();
    }

    loadHighScores() {
        const scores = localStorage.getItem('pathPuzzleHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    saveHighScore(newScore) {
        const playerName = document.getElementById('player-name').value.trim() || 'Anonymous';
        const timeTaken = this.getTimeTaken();
        
        // Get achievement level based on score
        const achievement = this.getAchievementLevel(newScore);
        
        // Add new score
        const scoreEntry = {
            name: playerName,
            score: newScore,
            time: timeTaken,
            date: new Date().toLocaleDateString(),
            achievement: achievement
        };

        // Find correct position to insert new score
        const insertIndex = this.highScores.findIndex(score => newScore > score.score);
        if (insertIndex === -1) {
            // Add to end if lower than all existing scores
            this.highScores.push(scoreEntry);
        } else {
            // Insert at correct position
            this.highScores.splice(insertIndex, 0, scoreEntry);
        }
        
        // Keep only top 5 scores
        this.highScores = this.highScores.slice(0, 5);
        
        // Save to localStorage
        localStorage.setItem('pathPuzzleHighScores', JSON.stringify(this.highScores));
    }

    getAchievementLevel(score) {
        if (score <= 10) return "Potato";
        if (score <= 20) return "Stupid";
        if (score <= 30) return "Clueless";
        if (score <= 40) return "Below Avg";
        if (score <= 50) return "Average";
        if (score <= 60) return "Bright";
        if (score <= 70) return "Smarty";
        if (score <= 80) return "Brainiac";
        if (score <= 90) return "Genius";
        if (score <= 94) return "Overlord";
        if (score === 95) return "Almost Genius";
        if (score === 96) return "Einstein";
        if (score === 97) return "Mastermind";
        if (score === 98) return "Legendary";
        if (score === 99) return "Immortal";
        return "Omniscient";
    }

    updateHighScores() {
        const highScoresList = document.getElementById('high-scores-list');
        
        if (this.highScores.length === 0) {
            highScoresList.innerHTML = '<li class="no-scores">No high scores yet</li>';
        } else {
            highScoresList.innerHTML = this.highScores.map((score, index) => {
                const isNewTopScore = index === 0;
                
                return `
                    <li ${isNewTopScore ? 'class="new-score"' : ''}>
                        <span class="score-rank">#${index + 1}</span>
                        <span class="score-name">${score.name}</span>
                        <span class="score-value">${score.score}</span>
                        <span class="score-achievement">${score.achievement || this.getAchievementLevel(score.score)}</span>
                        <span class="score-time">${this.formatTime(score.time)}</span>
                        <span class="score-date">${score.date}</span>
                    </li>
                `;
            }).join('');

            // Only animate if it's actually a new top score
            const firstItem = highScoresList.firstChild;
            if (firstItem && firstItem.classList.contains('new-score')) {
                this.animateScore(firstItem, 'high-score-animate', 800);
            }
        }
    }

    showGameOverModal(score, time) {
        // Ensure modal exists
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }

        // Update modal content
        const finalScore = document.getElementById('final-score');
        const finalTime = document.getElementById('final-time');
        
        if (finalScore) finalScore.textContent = `Final Score: ${score}`;
        if (finalTime) finalTime.textContent = `Time: ${this.formatTime(time)}`;

        // Show modal
        this.modal.classList.add('show');
        console.log('Showing game over modal');
    }

    handleGameOver() {
        // Stop the timer first
        this.stopTimer();
        const score = this.currentNumber - 1;
        const time = this.getTimeTaken();

        // Clear any remaining valid move indicators
        document.querySelectorAll('.cell.valid-move').forEach(cell => {
            cell.classList.remove('valid-move');
        });

        // Get message and GIF based on score
        let message, gifUrl;
        if (score <= 10) {
            message = "Potato IQ: You've achieved the intellectual capacity of a couch potato. Better luck next time!";
            gifUrl = "/assets/gifs/potato.gif";
        } else if (score <= 20) {
            message = "Stupid: Did you play this game blindfolded? Maybe give it another try with open eyes.";
            gifUrl = "/assets/gifs/stupid.gif";
        } else if (score <= 30) {
            message = "Clueless: You're not quite there yet, but hey, at least you showed up!";
            gifUrl = "/assets/gifs/clueless.gif";
        } else if (score <= 40) {
            message = "Below Average: There's potential, but it's still hiding somewhere.";
            gifUrl = "/assets/gifs/belowaverage.gif";
        } else if (score <= 50) {
            message = "Average Joe/Jane: You're on par with society's expectations—nothing more, nothing less.";
            gifUrl = "/assets/gifs/average.gif";
        } else if (score <= 60) {
            message = "Bright Spark: There's a flicker of brilliance. Keep it up!";
            gifUrl = "/assets/gifs/brightspark.gif";
        } else if (score <= 70) {
            message = "Smarty Pants: You've got some moves! A little more effort, and you'll shine.";
            gifUrl = "/assets/gifs/smartypants.gif";
        } else if (score <= 80) {
            message = "Brainiac-in-Training: Your neurons are firing! You're almost there.";
            gifUrl = "/assets/gifs/brainiac.gif";
        } else if (score <= 90) {
            message = "Genius Material: Einstein is clapping from the beyond!";
            gifUrl = "/assets/gifs/genius.gif";
        } else if (score <= 94) {
            message = "Supreme Overlord of Intelligence: You've transcended mere mortals. The world bows to your brilliance!";
            gifUrl = "/assets/gifs/overlord.gif";
        } else if (score === 95) {
            message = "Almost Genius: You can feel the brilliance just within reach. A little more effort, and you're ready to patent something absurdly useful!";
            gifUrl = "/assets/gifs/almostgenius.gif";
        } else if (score === 96) {
            message = "Borderline Einstein: Your brain is officially in overdrive, but there's still a smidgen of room for improvement. Maybe read a quantum physics paper for fun?";
            gifUrl = "/assets/gifs/einstein.gif";
        } else if (score === 97) {
            message = "Mastermind in Progress: You've cracked the code of intelligence! People might start asking for your advice on life… and math.";
            gifUrl = "/assets/gifs/mastermind.gif";
        } else if (score === 98) {
            message = "Legendary Thinker: Your IQ is a whisper away from mythical status. Don't be surprised if you start dreaming in algorithms.";
            gifUrl = "/assets/gifs/legendary.gif";
        } else if (score === 99) {
            message = "Immortal Intellect: Your brain now functions like a supercomputer. Be careful not to outwit yourself!";
            gifUrl = "/assets/gifs/immortal.gif";
        } else {
            message = "Omniscient Overlord: Congratulations, you've ascended to a divine level of intelligence. Time to rule the universe—responsibly, of course.";
            gifUrl = "/assets/gifs/omniscient.gif";
        }

        // First update the modal content
        const finalScore = document.getElementById('final-score');
        const finalTime = document.getElementById('final-time');
        const scoreMessage = document.getElementById('score-message');
        const scoreGif = document.getElementById('score-gif');

        if (finalScore) finalScore.textContent = `Final Score: ${score}`;
        if (finalTime) finalTime.textContent = `Time: ${this.formatTime(time)}`;
        if (scoreMessage) scoreMessage.textContent = message;
        if (scoreGif) {
            scoreGif.innerHTML = '';
            scoreGif.classList.add('loading');
            const img = new Image();
            
            img.onerror = () => {
                console.error(`Failed to load GIF: ${gifUrl}`);
                scoreGif.classList.remove('loading');
                scoreGif.innerHTML = '<span style="color: var(--text-secondary);">Image not available</span>';
            };
            
            img.onload = () => {
                scoreGif.classList.remove('loading');
                scoreGif.innerHTML = '';
                scoreGif.appendChild(img);
            };
            
            img.src = gifUrl;
            img.alt = "Score animation";
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
        }

        // Show modal first
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.modal.style.opacity = '0';
            
            // Force reflow
            void this.modal.offsetWidth;
            
            // Show modal
            this.modal.style.opacity = '1';
            this.modal.classList.add('show');
        } else {
            console.error('Modal element not found!');
        }

        // Then save high score if applicable
        if (this.highScores.length < 5 || score > this.highScores[this.highScores.length - 1].score) {
            this.saveHighScore(score);
            this.updateHighScores();
        }

        // Show game over message in game area
        this.showMessage(`Game Over! Score: ${score}`);
    }

    initializeUI() {
        this.gridElement = document.getElementById('grid');
        this.currentNumberElement = document.getElementById('current-number');
        this.messageElement = document.getElementById('message');
        
        // Create grid cells
        this.gridElement.innerHTML = '';
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add both click and touch handlers
                const handleInteraction = () => this.handleCellClick(row, col);
                cell.addEventListener('click', handleInteraction);
                cell.addEventListener('touchend', (e) => {
                    e.preventDefault(); // Prevent zoom and other default behaviors
                    handleInteraction();
                });
                
                this.gridElement.appendChild(cell);
            }
        }

        // New game button with touch support
        const newGameBtn = document.getElementById('new-game');
        newGameBtn.addEventListener('click', () => this.resetGame());
        newGameBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.resetGame();
        });

        // Add rules toggle functionality
        const rulesElement = document.querySelector('.rules');
        const toggleButton = document.getElementById('toggle-rules');
        
        const toggleRules = () => {
            rulesElement.classList.toggle('collapsed');
            toggleButton.textContent = rulesElement.classList.contains('collapsed') 
                ? 'Show Rules' 
                : 'Hide Rules';
        };

        toggleButton.addEventListener('click', toggleRules);
        toggleButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleRules();
        });

        // Optional: Add transition end listener to ensure proper height
        rulesElement.addEventListener('transitionend', () => {
            if (!rulesElement.classList.contains('collapsed')) {
                rulesElement.style.maxHeight = 'none';
            }
        });

        // Add play again button handler
        document.getElementById('play-again').addEventListener('click', () => {
            // Hide modal first
            this.modal.classList.remove('show');
            this.modal.style.display = 'none';
            
            // Reset game state
            this.resetGame();
            
            // Clear any remaining messages
            if (this.messageElement) {
                this.messageElement.textContent = '';
            }
            
            // Reset timer display
            document.getElementById('timer').textContent = '00:00';
            
            // Reset current number display
            this.currentNumber = 1;
            this.currentNumberElement.textContent = '1';
            
            // Clear grid
            this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
            Array.from(this.gridElement.children).forEach(cell => {
                cell.textContent = '';
                cell.className = 'cell';
            });
            
            // Reset position tracking
            this.lastRow = null;
            this.lastCol = null;
        });

        // Allow clicking outside modal to close it
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';
                this.resetGame();
            }
        });

        // Add test score buttons in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const testScores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 94, 95, 96, 97, 98, 99, 100];
            const testContainer = document.createElement('div');
            testContainer.style.cssText = 'margin: 10px; display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;';
            
            testScores.forEach(score => {
                const button = document.createElement('button');
                button.textContent = score;
                button.style.cssText = 'padding: 8px 12px; margin: 0; min-width: 45px;';
                button.addEventListener('click', () => {
                    this.stopTimer();
                    this.currentNumber = score + 1;
                    this.handleGameOver();
                });
                testContainer.appendChild(button);
            });

            const highScoresSection = document.querySelector('.high-scores');
            if (highScoresSection) {
                highScoresSection.parentNode.insertBefore(testContainer, highScoresSection.nextSibling);
            }
        }
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // First move can be anywhere
        if (fromRow === null || fromCol === null) return true;
        
        // Check if the move matches one of the allowed patterns
        const diffRow = toRow - fromRow;
        const diffCol = toCol - fromCol;
        
        return this.moves.some(([moveRow, moveCol]) => 
            moveRow === diffRow && moveCol === diffCol);
    }

    hasValidMoves() {
        if (this.lastRow === null || this.lastCol === null) return true;

        // Simply check if any of the possible moves are available
        for (const [moveRow, moveCol] of this.moves) {
            const newRow = this.lastRow + moveRow;
            const newCol = this.lastCol + moveCol;
            
            // Check if move is within bounds and cell is empty
            if (newRow >= 0 && newRow < this.size && 
                newCol >= 0 && newCol < this.size && 
                this.grid[newRow][newCol] === 0) {
                return true;
            }
        }
        
        // No valid moves found
        return false;
    }

    showValidMoves() {
        if (this.lastRow === null || this.lastCol === null) return;

        // Remove previous valid move indicators
        document.querySelectorAll('.cell.valid-move').forEach(cell => {
            cell.classList.remove('valid-move');
        });

        // Show new valid moves
        for (const [moveRow, moveCol] of this.moves) {
            const newRow = this.lastRow + moveRow;
            const newCol = this.lastCol + moveCol;
            
            // Check if move is within bounds and cell is empty
            if (newRow >= 0 && newRow < this.size && 
                newCol >= 0 && newCol < this.size && 
                this.grid[newRow][newCol] === 0) {
                const cell = this.gridElement.children[newRow * this.size + newCol];
                cell.classList.add('valid-move');
            }
        }
    }

    handleCellClick(row, col) {
        // Start timer on first move
        if (this.currentNumber === 1) {
            this.startTimer();
        }

        if (this.grid[row][col] !== 0) {
            this.showMessage('Cell already occupied!');
            return;
        }

        if (this.currentNumber === 1 || 
            this.isValidMove(this.lastRow, this.lastCol, row, col)) {
            
            // Place number
            this.grid[row][col] = this.currentNumber;
            const cell = this.gridElement.children[row * this.size + col];
            cell.classList.add('number-placed');
            this.updateCell(row, col);
            
            // Update last position
            if (this.lastRow !== null && this.lastCol !== null) {
                this.updateCell(this.lastRow, this.lastCol, false);
            }
            
            this.lastRow = row;
            this.lastCol = col;
            this.updateCell(row, col, true);
            
            // Increment current number
            this.currentNumber++;
            this.currentNumberElement.textContent = this.currentNumber;
            this.animateScore(this.currentNumberElement, 'score-animate');

            // Check for valid moves immediately
            if (!this.hasValidMoves()) {
                // End game immediately
                this.handleGameOver();
            } else {
                this.showValidMoves();
            }
        } else {
            this.showMessage('Invalid move!');
        }
    }

    updateCell(row, col, isLast = false) {
        const cell = this.gridElement.children[row * this.size + col];
        // Wrap the number in a span for better positioning
        cell.innerHTML = this.grid[row][col] ? `<span>${this.grid[row][col]}</span>` : '';
        cell.className = 'cell' + (isLast ? ' last' : '');
    }

    showMessage(message) {
        if (this.messageElement) {
            this.messageElement.textContent = message;
            // Keep game over message visible longer
            if (message.includes('Game Over')) {
                setTimeout(() => {
                    this.messageElement.textContent = '';
                }, 5000); // Show for 5 seconds
            } else {
                setTimeout(() => {
                    this.messageElement.textContent = '';
                }, 3000);
            }
        }
    }

    resetGame() {
        // Reset all game state
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.currentNumber = 1;
        this.lastRow = null;
        this.lastCol = null;
        this.currentNumberElement.textContent = '1';
        this.messageElement.textContent = '';
        
        // Reset all cells
        Array.from(this.gridElement.children).forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        // Remove all animations
        document.querySelectorAll('.cell.valid-move, .cell.number-placed, .move-line').forEach(el => {
            if (el.classList.contains('move-line')) {
                el.remove();
            } else {
                el.classList.remove('valid-move', 'number-placed');
            }
        });

        // Reset timer
        this.startTime = null;
        this.stopTimer();
        document.getElementById('timer').textContent = '00:00';
        
        // Hide modal
        this.modal.classList.remove('show');
        this.modal.style.display = 'none';
    }

    animateScore(element, className, duration = 300) {
        element.classList.add(className);
        setTimeout(() => element.classList.remove(className), duration);
    }

    startTimer() {
        if (this.startTime === null) {
            this.startTime = new Date();
            this.updateTimer();
            this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const now = new Date();
        const diff = Math.floor((now - this.startTime) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }

    getTimeTaken() {
        if (!this.startTime) return 0;
        return Math.floor((new Date() - this.startTime) / 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    getScoreMessage(score) {
        const messages = [
            { max: 10, message: "Potato IQ: You've achieved the intellectual capacity of a couch potato. Better luck next time!", gif: "potato.gif" },
            { max: 20, message: "Stupid: Did you play this game blindfolded? Maybe give it another try with open eyes.", gif: "stupid.gif" },
            { max: 30, message: "Clueless: You're not quite there yet, but hey, at least you showed up!", gif: "clueless.gif" },
            { max: 40, message: "Below Average: There's potential, but it's still hiding somewhere.", gif: "below-average.gif" },
            { max: 50, message: "Average Joe/Jane: You're on par with society's expectations—nothing more, nothing less.", gif: "average.gif" },
            { max: 60, message: "Bright Spark: There's a flicker of brilliance. Keep it up!", gif: "bright-spark.gif" },
            { max: 70, message: "Smarty Pants: You've got some moves! A little more effort, and you'll shine.", gif: "smarty-pants.gif" },
            { max: 80, message: "Brainiac-in-Training: Your neurons are firing! You're almost there.", gif: "brainiac.gif" },
            { max: 90, message: "Genius Material: Einstein is clapping from the beyond!", gif: "genius.gif" },
            { max: 94, message: "Supreme Overlord of Intelligence: You've transcended mere mortals!", gif: "overlord.gif" },
            { max: 95, message: "Almost Genius: You can feel the brilliance just within reach!", gif: "almost-genius.gif" },
            { max: 96, message: "Borderline Einstein: Your brain is officially in overdrive!", gif: "einstein.gif" },
            { max: 97, message: "Mastermind in Progress: You've cracked the code of intelligence!", gif: "mastermind.gif" },
            { max: 98, message: "Legendary Thinker: Your IQ is a whisper away from mythical status.", gif: "legendary.gif" },
            { max: 99, message: "Immortal Intellect: Your brain now functions like a supercomputer!", gif: "immortal.gif" },
            { max: 100, message: "Omniscient Overlord: Congratulations, you've ascended to divine intelligence!", gif: "omniscient.gif" }
        ];

        return messages.find(m => score <= m.max) || messages[messages.length - 1];
    }
};

// Start game when page loads
window.addEventListener('load', () => {
    new PathPuzzle();
}); 