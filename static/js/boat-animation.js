// Boat badge scroll animation with dynamic height calculation
document.addEventListener('DOMContentLoaded', function() {
    // Wait for React components to render
    function initializeBoatAnimation() {
        const boat = document.querySelector('.boat');
        const waveWrapper = document.querySelector('.wave-wrapper');

        // Try multiple selectors for the first content block
        let firstContentBlock = document.querySelector('.home-intro') ||
                               document.querySelector('.content-block.home-intro') ||
                               document.querySelector('.content-block:first-child');

        if (!firstContentBlock) {
            // Retry after React components have rendered
            setTimeout(initializeBoatAnimation, 100);
            return;
        }

        function updateContentHeight() {
            if (!firstContentBlock) return 0;

            const vh = window.innerHeight;
            const navbarHeight = 80; // 5rem = 80px
            const additionalOffset = 80; // Additional spacing offset
            const contentHeight = vh - navbarHeight - additionalOffset;

            // Set content block height to fill available space (waves positioned via CSS)
            const blockHeight = contentHeight;
            firstContentBlock.style.height = `${blockHeight}px`;
            firstContentBlock.style.minHeight = `${blockHeight}px`;
            firstContentBlock.style.maxHeight = `${blockHeight}px`;

            console.log('Height calculation:', { vh, navbarHeight, additionalOffset, blockHeight });
            return blockHeight; // Return trigger height for boat animation
        }

        function handleScroll() {
            if (!boat || !waveWrapper || !firstContentBlock) return;

            const scrollY = window.scrollY;
            const navbarHeight = 80; // 5rem = 80px (fixed navbar height)

            // Calculate wave wrapper height from CSS clamp: clamp(4rem, 10vh, 6rem)
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const waveHeightVh = vh * 0.1; // 10vh
            const waveHeightMin = 4 * remInPx; // 4rem
            const waveHeightMax = 6 * remInPx; // 6rem
            const waveHeight = Math.max(waveHeightMin, Math.min(waveHeightVh, waveHeightMax));

            // Calculate boat height based on viewport width for precise trigger
            // Known values: boat SVG is 409px wide × 316px high (ratio: 0.773)
            let boatHeight;

            if (vw <= 400) {
                // At 400px viewport or smaller: boat is 50px high
                boatHeight = 50;
            } else if (vw >= 1600) {
                // At 1600px viewport or larger: boat is 180px high
                boatHeight = 180;
            } else {
                // Smooth interpolation between 400px→1600px viewport (50px→180px boat height)
                const progress = (vw - 400) / (1600 - 400); // 0 to 1
                boatHeight = 50 + (progress * (180 - 50)); // 50px to 180px
            }

            // Get the content block height
            const contentBlockHeight = updateContentHeight();

            // Calculate trigger point so boat's TOP hits navbar bottom
            // Base trigger works for max width, adjust for smaller boats
            const baseTriggerPoint = contentBlockHeight - waveHeight - navbarHeight;
            const boatHeightAdjustment = 180 - boatHeight; // Difference from max height
            const triggerPoint = baseTriggerPoint + boatHeightAdjustment;

            if (scrollY > triggerPoint) {
                boat.classList.add('boat-badge');
                if (waveWrapper) waveWrapper.classList.add('wave-badge');
            } else {
                boat.classList.remove('boat-badge');
                if (waveWrapper) waveWrapper.classList.remove('wave-badge');
            }
        }

        // Throttle scroll events for better performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(() => ticking = false, 16);
            }
        }

        // Update on resize (orientation change, window resize)
        function handleResize() {
            // Force immediate recalculation without waiting for scroll
            updateContentHeight();
            handleScroll();
        }

        window.addEventListener('scroll', requestTick);
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            // Small delay for orientation change to complete
            setTimeout(handleResize, 100);
        });

        // iOS Safari specific events
        window.addEventListener('pageshow', handleResize);
        window.addEventListener('load', () => {
            // Extra delay for iOS Safari viewport stabilization
            setTimeout(handleResize, 200);
        });

        // Initial setup with multiple attempts for iOS Safari
        updateContentHeight(); // Immediate calculation
        handleScroll();

        // Delayed recalculation for iOS Safari
        setTimeout(() => {
            updateContentHeight();
            handleScroll();
        }, 100);

        // Final fallback calculation
        setTimeout(() => {
            updateContentHeight();
            handleScroll();
        }, 500);
    }

    // Start initialization
    initializeBoatAnimation();
});