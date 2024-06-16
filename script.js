document.addEventListener('DOMContentLoaded', function() {
    const clickElement = document.getElementById('click');
    const catlickElement = document.getElementById('catlick');
    const youveBeenCatlickedElement = document.getElementById('youve-been-catlicked');
    const memeElement = document.getElementById('meme');
    const cat = document.getElementById('cat');
    const angry = document.getElementById('angry');
    const catSound = document.getElementById('catSound');
    const angrySound = document.getElementById('angrySound');
    const copyableTextElement = document.getElementById('copyable-text');
    let mouseDownTimeout;
    let catAnimationTimeout;
    let cursorEvent;
    let catlickedCount = 0;

    cat.style.display = 'none'; // Ensure the cat image is hidden initially

    const moveImage = (event, element) => {
        const touch = event.touches ? event.touches[0] : event;
        const imageWidth = element.offsetWidth;
        const imageHeight = element.offsetHeight;

        // Position the image directly under the cursor, adjusted by 2px to the left and 5px down
        const left = touch.clientX - imageWidth / 2 - 2;
        const top = touch.clientY - imageHeight / 2 + 5;

        // Apply the calculated position
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    };

    const stopCatSound = () => {
        console.log("Stopping cat sound");
        catSound.pause();
        catSound.currentTime = 0; // Reset sound to the beginning
    };

    const showAngry = () => {
        console.log("Showing angry image and playing angry sound");
        stopCatSound();
        cat.style.display = 'none';
        angry.style.display = 'block';
        angrySound.volume = 1.0; // Ensure maximum volume
        angrySound.play();

        // Move the angry image to the initial cursor position
        moveImage(cursorEvent, angry);

        // Add mousemove event listener to follow the cursor
        document.addEventListener('mousemove', moveAngry);
        document.addEventListener('touchmove', moveAngry);
    };

    const hideAngry = () => {
        console.log("Hiding angry image");
        angry.style.display = 'none';
        catlickElement.style.display = 'none';
        youveBeenCatlickedElement.style.display = 'block';

        catlickedCount += 1;

        // Remove mousemove event listener for the angry image
        document.removeEventListener('mousemove', moveAngry);
        document.removeEventListener('touchmove', moveAngry);

        // Show "you've been catlicked" for 3 seconds
        setTimeout(() => {
            youveBeenCatlickedElement.style.display = 'none';

            if (catlickedCount === 2) {
                // Show "that's it, that's the meme" for 5 seconds after the second time
                memeElement.style.display = 'block';
                setTimeout(() => {
                    memeElement.style.display = 'none';
                    catlickElement.style.display = 'block';
                    catlickedCount = 0; // Reset the count
                }, 5000);
            } else {
                catlickElement.style.display = 'block';
            }
        }, 3000);
    };

    const moveCat = (event) => moveImage(event, cat);
    const moveAngry = (event) => moveImage(event, angry);

    const resetState = () => {
        clickElement.style.display = 'block';
        catlickElement.style.display = 'none';
        youveBeenCatlickedElement.style.display = 'none';
        memeElement.style.display = 'none';
    };

    clickElement.addEventListener('click', function(event) {
        console.log('Clicked on "click" element');
        event.stopPropagation(); // Stop the event from bubbling up
        clickElement.style.display = 'none';
        catlickElement.style.display = 'block';
    });

    const handleMouseDown = (event) => {
        console.log('Mouse down on "catlick" element');
        event.stopPropagation(); // Stop the event from bubbling up

        // Store the cursor event for later use
        cursorEvent = event.touches ? event.touches[0] : event;

        // Change the cursor to pointer
        document.body.style.cursor = 'pointer';

        // Play and loop the cat sound
        catSound.loop = true;
        catSound.play();

        // Show the cat image
        cat.style.display = 'block';

        // Move the cat to the initial cursor position
        moveCat(event);

        // Add mousemove event listener to follow the cursor
        document.addEventListener('mousemove', moveCat);
        document.addEventListener('touchmove', moveCat);

        // Set timeout to hide cat image and show angry image after 5 seconds
        catAnimationTimeout = setTimeout(() => {
            cat.style.display = 'none';
            stopCatSound();
            showAngry();
        }, 5000);
    };

    catlickElement.addEventListener('mousedown', handleMouseDown);
    catlickElement.addEventListener('touchstart', handleMouseDown);

    document.addEventListener('mouseup', function() {
        console.log("Mouse up");
        // Hide the cat image if angry is not displayed
        if (angry.style.display !== 'block') {
            cat.style.display = 'none';
        }

        // Reset the cursor to default
        document.body.style.cursor = 'default';

        // Stop the cat sound
        stopCatSound();

        // Remove mousemove event listener for the cat image
        document.removeEventListener('mousemove', moveCat);
        document.removeEventListener('touchmove', moveCat);

        // Clear the mouse down timeout
        clearTimeout(mouseDownTimeout);
        clearTimeout(catAnimationTimeout);
    });

    document.addEventListener('touchend', function() {
        console.log("Touch end");
        // Hide the cat image if angry is not displayed
        if (angry.style.display !== 'block') {
            cat.style.display = 'none';
        }

        // Reset the cursor to default
        document.body.style.cursor = 'default';

        // Stop the cat sound
        stopCatSound();

        // Remove touchmove event listener for the cat image
        document.removeEventListener('touchmove', moveCat);
        document.removeEventListener('mousemove', moveCat);

        // Clear the mouse down timeout
        clearTimeout(mouseDownTimeout);
        clearTimeout(catAnimationTimeout);
    });

    // Hide the angry image when the angry sound ends
    angrySound.addEventListener('ended', hideAngry);

    // Handle clicks on the background
    document.addEventListener('click', function(event) {
        if (event.target === document.body || event.target === document.getElementById('container')) {
            console.log('Clicked on background or container');
            clickElement.style.display = 'none';
            catlickElement.style.display = 'block';
        }
    });

    // Function to copy text to clipboard
    window.copyText = function() {
        const copyText = copyableTextElement.innerText;
        navigator.clipboard.writeText(copyText).then(() => {
            console.log("Text copied to clipboard: " + copyText);
            copyableTextElement.classList.add('copied');
            setTimeout(() => {
                copyableTextElement.classList.remove('copied');
            }, 2000); // Remove the copied message after 2 seconds
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    };

    // Initial state
    resetState();
});
