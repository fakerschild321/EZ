/**
 * Auction-specific JavaScript functionality for PeriphTrade
 * Handles auction timers, bidding, and real-time updates
 */

// Global auction state
let auctionTimers = new Map();
let bidHistory = new Map();

/**
 * Initialize all auction functionality
 */
function initializeAuctionTimers() {
    // Initialize timers for auction listing page
    const auctionItems = document.querySelectorAll('.auction-item');
    auctionItems.forEach(item => {
        const endTime = item.dataset.endTime;
        if (endTime) {
            startListingTimer(item, new Date(endTime).getTime());
        }
    });
    
    // Initialize timer badges
    const timerBadges = document.querySelectorAll('.auction-timer-badge');
    timerBadges.forEach(badge => {
        const endTime = badge.dataset.endTime;
        if (endTime) {
            startBadgeTimer(badge, new Date(endTime).getTime());
        }
    });
}

/**
 * Start auction timer for single auction page
 */
function startAuctionTimer(endTime) {
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            updateTimerDisplay(timeLeft);
        } else {
            clearInterval(timerInterval);
            handleAuctionEnd();
        }
    }, 1000);
    
    // Store interval for cleanup
    auctionTimers.set('main-timer', timerInterval);
    
    // Initial update
    const now = new Date().getTime();
    const timeLeft = endTime - now;
    if (timeLeft > 0) {
        updateTimerDisplay(timeLeft);
    }
}

/**
 * Start timer for auction listing items
 */
function startListingTimer(item, endTime) {
    const badge = item.querySelector('.auction-timer-badge .time-left');
    if (!badge) return;
    
    const timerId = 'timer-' + Math.random().toString(36).substr(2, 9);
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            badge.textContent = formatTimeLeft(timeLeft);
            
            // Add urgency styling for items ending soon
            if (timeLeft < 3600000) { // Less than 1 hour
                badge.parentElement.classList.add('bg-danger');
                badge.parentElement.classList.remove('bg-dark');
            } else if (timeLeft < 86400000) { // Less than 24 hours
                badge.parentElement.classList.add('bg-warning');
                badge.parentElement.classList.remove('bg-dark');
            }
        } else {
            clearInterval(timerInterval);
            badge.textContent = 'ENDED';
            badge.parentElement.classList.add('bg-secondary');
            item.style.opacity = '0.6';
        }
    }, 1000);
    
    auctionTimers.set(timerId, timerInterval);
}

/**
 * Start timer for auction badge
 */
function startBadgeTimer(badge, endTime) {
    const timeLeftSpan = badge.querySelector('.time-left');
    if (!timeLeftSpan) return;
    
    const timerId = 'badge-' + Math.random().toString(36).substr(2, 9);
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            timeLeftSpan.textContent = formatTimeLeft(timeLeft);
        } else {
            clearInterval(timerInterval);
            timeLeftSpan.textContent = 'ENDED';
        }
    }, 1000);
    
    auctionTimers.set(timerId, timerInterval);
}

/**
 * Update timer display for single auction page
 */
function updateTimerDisplay(timeLeft) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    
    // Add urgency effects
    const timerContainer = document.querySelector('.auction-timer');
    if (timerContainer) {
        if (timeLeft < 3600000) { // Less than 1 hour
            timerContainer.classList.add('bg-danger');
            timerContainer.classList.remove('bg-dark');
        } else if (timeLeft < 86400000) { // Less than 24 hours
            timerContainer.classList.add('bg-warning', 'text-dark');
            timerContainer.classList.remove('bg-dark', 'text-white');
        }
    }
}

/**
 * Format time left for badges and listings
 */
function formatTimeLeft(timeLeft) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

/**
 * Handle auction end
 */
function handleAuctionEnd() {
    const timerContainer = document.querySelector('.auction-timer');
    if (timerContainer) {
        timerContainer.innerHTML = `
            <div class="text-center">
                <h4 class="text-danger">AUCTION ENDED</h4>
                <p class="mb-0">This auction has concluded</p>
            </div>
        `;
    }
    
    // Disable bidding form
    const bidForm = document.getElementById('bidForm');
    if (bidForm) {
        bidForm.style.display = 'none';
    }
    
    // Show ended message
    const endedAlert = document.createElement('div');
    endedAlert.className = 'alert alert-warning text-center';
    endedAlert.innerHTML = `
        <i class="fas fa-info-circle me-2"></i>
        This auction has ended. Thank you for your participation!
    `;
    
    const auctionContainer = document.querySelector('.container');
    if (auctionContainer) {
        auctionContainer.insertBefore(endedAlert, auctionContainer.firstChild);
    }
}

/**
 * Place a bid
 */
function placeBid(event) {
    event.preventDefault();
    
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
    const currentBid = parseFloat(document.getElementById('currentBid').textContent.replace('$', ''));
    
    // Validation
    if (!bidAmount || bidAmount <= currentBid) {
        showBidError('Bid amount must be higher than current bid');
        return;
    }
    
    // Get auction ID from URL or data attribute
    const auctionId = getAuctionId();
    if (!auctionId) {
        showBidError('Unable to identify auction');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Placing Bid...';
    submitButton.disabled = true;
    
    // Simulate API call (in real app, this would be actual API call)
    setTimeout(() => {
        // Simulate successful bid
        updateBidDisplay(bidAmount);
        addBidToHistory(bidAmount);
        showBidSuccess('Bid placed successfully!');
        
        // Reset form
        document.getElementById('bidAmount').value = '';
        document.getElementById('bidAmount').min = bidAmount + 1;
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Update quick bid buttons
        updateQuickBidButtons(bidAmount);
        
    }, 1000);
}

/**
 * Quick bid functionality
 */
function quickBid(increment) {
    const currentBid = parseFloat(document.getElementById('currentBid').textContent.replace('$', ''));
    const newBid = currentBid + increment;
    
    document.getElementById('bidAmount').value = newBid;
    
    // Trigger the bid submission
    const bidForm = document.getElementById('bidForm');
    if (bidForm) {
        placeBid({ preventDefault: () => {}, target: bidForm });
    }
}

/**
 * Update bid display
 */
function updateBidDisplay(newBid) {
    const currentBidElement = document.getElementById('currentBid');
    if (currentBidElement) {
        // Animate the change
        currentBidElement.style.transform = 'scale(1.1)';
        currentBidElement.style.color = 'var(--bs-success)';
        
        setTimeout(() => {
            currentBidElement.textContent = `$${newBid.toFixed(2)}`;
            
            setTimeout(() => {
                currentBidElement.style.transform = 'scale(1)';
            }, 200);
        }, 100);
    }
    
    // Update bid count
    const bidCountElement = document.getElementById('bidCount');
    if (bidCountElement) {
        const currentCount = parseInt(bidCountElement.textContent) || 0;
        bidCountElement.textContent = currentCount + 1;
    }
}

/**
 * Update quick bid buttons
 */
function updateQuickBidButtons(currentBid) {
    const quickBidButtons = document.querySelectorAll('[onclick^="quickBid"]');
    quickBidButtons.forEach(button => {
        const increment = parseInt(button.textContent.replace('+$', ''));
        button.onclick = () => quickBid(increment);
    });
}

/**
 * Add bid to history
 */
function addBidToHistory(bidAmount) {
    const auctionId = getAuctionId();
    const userName = 'You'; // In real app, get from session
    const timestamp = new Date();
    
    const bid = {
        amount: bidAmount,
        bidder: userName,
        timestamp: timestamp
    };
    
    if (!bidHistory.has(auctionId)) {
        bidHistory.set(auctionId, []);
    }
    
    bidHistory.get(auctionId).unshift(bid);
    
    // Update bid history display
    updateBidHistoryDisplay(auctionId);
}

/**
 * Load bid history
 */
function loadBidHistory(auctionId) {
    // In a real app, this would fetch from API
    const mockBids = [];
    
    bidHistory.set(auctionId, mockBids);
    updateBidHistoryDisplay(auctionId);
}

/**
 * Update bid history display
 */
function updateBidHistoryDisplay(auctionId) {
    const historyContainer = document.getElementById('bidHistory');
    if (!historyContainer) return;
    
    const bids = bidHistory.get(auctionId) || [];
    
    if (bids.length === 0) {
        historyContainer.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-history fa-2x mb-2"></i>
                <p>No bids yet. Be the first to bid!</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = bids.map(bid => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
                <strong>${bid.bidder}</strong>
                <small class="text-muted d-block">${formatBidTime(bid.timestamp)}</small>
            </div>
            <div class="text-success fw-bold">
                $${bid.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
    
    historyContainer.innerHTML = historyHTML;
}

/**
 * Format bid timestamp
 */
function formatBidTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 24 hours
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return timestamp.toLocaleDateString();
    }
}

/**
 * Show bid error
 */
function showBidError(message) {
    if (window.PeriphTrade && window.PeriphTrade.showToast) {
        window.PeriphTrade.showToast(message, 'danger');
    } else {
        alert(message);
    }
}

/**
 * Show bid success
 */
function showBidSuccess(message) {
    if (window.PeriphTrade && window.PeriphTrade.showToast) {
        window.PeriphTrade.showToast(message, 'success');
    } else {
        alert(message);
    }
}

/**
 * Get auction ID from current page
 */
function getAuctionId() {
    // Try to get from URL path
    const pathParts = window.location.pathname.split('/');
    const auctionIndex = pathParts.indexOf('auction');
    
    if (auctionIndex !== -1 && pathParts[auctionIndex + 1]) {
        return parseInt(pathParts[auctionIndex + 1]);
    }
    
    // Try to get from data attribute
    const auctionElement = document.querySelector('[data-auction-id]');
    if (auctionElement) {
        return parseInt(auctionElement.dataset.auctionId);
    }
    
    return null;
}

/**
 * Auto-refresh auction data
 */
function startAutoRefresh(auctionId, interval = 30000) {
    setInterval(() => {
        // In a real app, this would fetch updated auction data
        console.log('Auto-refreshing auction data for auction', auctionId);
    }, interval);
}

/**
 * Watch for bid updates
 */
function watchBidUpdates(auctionId) {
    // In a real app, this would use WebSockets or Server-Sent Events
    // for real-time bid updates
    console.log('Watching for bid updates on auction', auctionId);
}

/**
 * Cleanup timers when leaving page
 */
function cleanupTimers() {
    auctionTimers.forEach((timer, id) => {
        clearInterval(timer);
    });
    auctionTimers.clear();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupTimers);

// Export functions for global use
window.AuctionManager = {
    initializeAuctionTimers,
    startAuctionTimer,
    placeBid,
    quickBid,
    loadBidHistory,
    startAutoRefresh,
    watchBidUpdates,
    cleanupTimers
};
