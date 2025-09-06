// script.js - Fixed version: Thumbnail + modal system

// function to pause all videos
function pauseAllVideos() {
    document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.currentTime = 0; // Reset to beginning
    });
}

// function to create flash effect
function createFlash(color, duration, zIndex) {
    const flash = document.createElement('div');
    flash.className = `flash flash-${color}`;
    flash.style.animation = `flash-animation ${duration}ms forwards`;
    flash.style.zIndex = zIndex;
    document.getElementById('flash-container').appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, duration);
}

// function for portal page
function initPortal() {
    if (document.querySelector('.portal-page')) {
        const portal = document.getElementById('portal');
        const vortex = document.getElementById('vortex');
        
        // add random glitch effect
        const glitchInterval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 100);
        
        portal.addEventListener('click', function() {
            // Clear the glitch interval
            clearInterval(glitchInterval);
            
            // PURPLE and white flash effects - NO GREEN!
            createFlash('white', 100, 11);
            setTimeout(() => createFlash('purple', 100, 11), 50);
            setTimeout(() => createFlash('white', 100, 11), 100);
            setTimeout(() => createFlash('purple', 150, 11), 150);
            
            // Purple matrix effect (0s and 1s falling)
            createPurpleMatrixEffect();
            
            // vortex effect
            vortex.style.animation = "vortex 1s forwards";
            vortex.style.opacity = "1";
            
            // distort entire site - NO GREEN EFFECTS!
            document.body.style.transform = 'scale(1.2)';
            document.body.style.filter = 'blur(3px)';
            
            // redirect after short delay
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 900);
        });
        
        function createPurpleMatrixEffect() {
            const chars = '01010101010101010101';
            const container = document.getElementById('flash-container');
            
            // create multiple falling characters
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const char = document.createElement('div');
                    char.className = 'matrix-char';
                    char.textContent = chars[Math.floor(Math.random() * chars.length)];
                    char.style.left = `${Math.random() * 100}%`;
                    char.style.animationDuration = `${Math.random() * 2 + 1}s`;
                    container.appendChild(char);
                    
                    // remove after animation
                    setTimeout(() => {
                        if (char.parentNode) {
                            char.parentNode.removeChild(char);
                        }
                    }, 3000);
                }, i * 50);
            }
        }
    }
}

// function for main page
function initMain() {
    if (document.querySelector('.main-page')) {
        // media data (memes 1-10 and videos 1-10)
        const mediaData = [];
        
        // add memes
        for (let i = 1; i <= 10; i++) {
            mediaData.push({ 
                type: 'image', 
                src: `memes/meme${i}.png`,
                id: `meme-${i}`
            });
        }
        
        // add videos
        for (let i = 1; i <= 10; i++) {
            mediaData.push({ 
                type: 'video', 
                src: `videos/vid${i}.mp4`,
                id: `vid-${i}`
            });
        }

        const container = document.getElementById('media-container');
        const modal = document.getElementById('media-modal');
        const closeBtn = document.querySelector('.close');
        const flashOverlay = document.getElementById('flash-overlay');
        const bgVideo = document.getElementById('bg-video');
        
        // Make sure background video keeps playing
        if (bgVideo) {
            bgVideo.play().catch(e => console.log('Background video play failed:', e));
        }
        
        // start global flashes
        let flashInterval = setInterval(() => {
            // sequence of 2 flashes
            setTimeout(() => {
                flashOverlay.style.opacity = '0.7';
                setTimeout(() => {
                    flashOverlay.style.opacity = '0';
                    setTimeout(() => {
                        flashOverlay.style.opacity = '0.7';
                        setTimeout(() => {
                            flashOverlay.style.opacity = '0';
                        }, 50);
                    }, 100);
                }, 50);
            }, Math.random() * 1000);
        }, 3200);
        
        // create and add memes/videos to page
        mediaData.forEach((media, index) => {
            const mediaElement = document.createElement('div');
            mediaElement.className = 'media-item';
            mediaElement.id = media.id;
            
            // load image/video
            const loadMedia = () => {
                return new Promise((resolve) => {
                    if (media.type === 'image') {
                        const img = new Image();
                        img.onload = function() {
                            // calculate proportional dimensions
                            const maxSize = 200;
                            let width, height;
                            
                            if (this.width > this.height) {
                                width = maxSize;
                                height = (this.height / this.width) * maxSize;
                            } else {
                                height = maxSize;
                                width = (this.width / this.height) * maxSize;
                            }
                            
                            mediaElement.style.width = `${width}px`;
                            mediaElement.style.height = `${height}px`;
                            
                            const imgElement = document.createElement('img');
                            imgElement.src = media.src;
                            imgElement.alt = '';
                            mediaElement.appendChild(imgElement);
                            
                            resolve();
                        };
                        img.onerror = function() {
                            // fallback for broken image
                            mediaElement.style.width = '200px';
                            mediaElement.style.height = '200px';
                            mediaElement.style.backgroundColor = '#333';
                            mediaElement.style.display = 'flex';
                            mediaElement.style.alignItems = 'center';
                            mediaElement.style.justifyContent = 'center';
                            mediaElement.innerHTML = '🖼️';
                            resolve();
                        };
                        img.src = media.src;
                    } else {
                        // VIDEO: Create thumbnail + play icon (NO AUTOPLAY)
                        const maxSize = 200;
                        mediaElement.style.width = '200px';
                        mediaElement.style.height = '200px';
                        
                        // Create thumbnail container
                        const thumbnailContainer = document.createElement('div');
                        thumbnailContainer.className = 'video-thumbnail';
                        thumbnailContainer.style.width = '100%';
                        thumbnailContainer.style.height = '100%';
                        thumbnailContainer.style.position = 'relative';
                        thumbnailContainer.style.background = '#111';
                        thumbnailContainer.style.display = 'flex';
                        thumbnailContainer.style.alignItems = 'center';
                        thumbnailContainer.style.justifyContent = 'center';
                        
                        // Create video element for thumbnail generation ONLY
                        const videoForThumb = document.createElement('video');
                        videoForThumb.src = media.src;
                        videoForThumb.muted = true;
                        videoForThumb.preload = 'metadata';
                        
                        // Try to capture first frame for thumbnail
                        videoForThumb.addEventListener('loadeddata', function() {
                            if (this.readyState >= 2) { // HAVE_CURRENT_DATA or more
                                try {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = this.videoWidth;
                                    canvas.height = this.videoHeight;
                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                                    
                                    const thumbnailImg = document.createElement('img');
                                    thumbnailImg.src = canvas.toDataURL();
                                    thumbnailImg.style.width = '100%';
                                    thumbnailImg.style.height = '100%';
                                    thumbnailImg.style.objectFit = 'cover';
                                    
                                    thumbnailContainer.appendChild(thumbnailImg);
                                } catch (e) {
                                    console.log('Thumbnail generation failed, using fallback');
                                    // Fallback if thumbnail generation fails
                                    thumbnailContainer.innerHTML = '🎬 VIDEO';
                                    thumbnailContainer.style.fontSize = '24px';
                                }
                            }
                        });
                        
                        videoForThumb.addEventListener('error', function() {
                            // Fallback for video error
                            thumbnailContainer.innerHTML = '🎬 VIDEO';
                            thumbnailContainer.style.fontSize = '24px';
                        });
                        
                        // Add play icon overlay
                        const playIcon = document.createElement('div');
                        playIcon.className = 'video-play-icon';
                        playIcon.innerHTML = '▶';
                        playIcon.style.position = 'absolute';
                        playIcon.style.top = '50%';
                        playIcon.style.left = '50%';
                        playIcon.style.transform = 'translate(-50%, -50%)';
                        playIcon.style.fontSize = '40px';
                        playIcon.style.color = 'white';
                        playIcon.style.textShadow = '0 0 10px rgba(0,0,0,0.7)';
                        playIcon.style.zIndex = '10';
                        
                        thumbnailContainer.appendChild(playIcon);
                        mediaElement.appendChild(thumbnailContainer);
                        
                        resolve();
                    }
                });
            };
            
            // random initial position
            mediaElement.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
            mediaElement.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
            
            // add click event to open modal
            mediaElement.addEventListener('click', function() {
                openModal(media);
            });
            
            // load media and then add to container
            loadMedia().then(() => {
                container.appendChild(mediaElement);
                
                // start animation immediately with increased speed for some items
                startBounceAnimation(mediaElement, index);
            });
        });
        
        // close modal when clicking X
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
        
        // close modal when clicking outside content
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // add random glitch effects to page
        setInterval(() => {
            // shake effect
            document.body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 200);
        
        // function to close modal
        function closeModal() {
            modal.style.display = 'none';
            // pause video if playing
            const video = document.querySelector('#modal-media video');
            if (video) {
                video.pause();
                video.currentTime = 0; // Reset to beginning
            }
            // resume background video
            if (bgVideo) {
                bgVideo.play().catch(e => console.log('BG video play error:', e));
            }
        }
        
        // function to open modal with media
        function openModal(media) {
            // pause all videos on page first (except background)
            pauseAllVideos();
            
            const mediaContainer = document.getElementById('modal-media');
            mediaContainer.innerHTML = '';
            
            if (media.type === 'image') {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = '';
                
                // preload image to get dimensions
                const tempImg = new Image();
                tempImg.onload = function() {
                    // calculate proportional dimensions with max 500px
                    const maxSize = 500;
                    let width, height;
                    
                    if (this.width > this.height) {
                        // horizontal image
                        width = maxSize;
                        height = (this.height / this.width) * maxSize;
                    } else {
                        // vertical or square image
                        height = maxSize;
                        width = (this.width / this.height) * maxSize;
                    }
                    
                    img.style.width = `${width}px`;
                    img.style.height = `${height}px`;
                };
                tempImg.onerror = function() {
                    img.style.maxWidth = '500px';
                    img.style.maxHeight = '500px';
                };
                tempImg.src = media.src;
                
                mediaContainer.appendChild(img);
            } else {
                // For videos: create video with controls (no autoplay)
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true;
                video.playsInline = true;
                video.style.maxWidth = '500px';
                video.style.maxHeight = '500px';
                
                mediaContainer.appendChild(video);
            }
            
            modal.style.display = 'block';
            
            // pause background video when modal is open
            if (bgVideo) {
                bgVideo.pause();
            }
        }
        
        // function to animate elements bouncing around screen with increased speed
        function startBounceAnimation(element, index) {
            // random velocity - increased speed for some items
            let baseSpeed = 2;
            // Make 3 random items faster
            if (index % 5 === 0 || index % 5 === 0 || index % 5 === 0) {
                baseSpeed = 2; // Increased speed for slower items
            }
            
            let speedX = (Math.random() - 0.5) * baseSpeed;
            let speedY = (Math.random() - 0.5) * baseSpeed;
            
            function animate() {
                if (!element.parentNode) return; // stop if element was removed
                
                const rect = element.getBoundingClientRect();
                let newX = parseFloat(element.style.left) + speedX;
                let newY = parseFloat(element.style.top) + speedY;
                
                // check collision with edges
                if (newX <= 0 || newX >= window.innerWidth - rect.width) {
                    speedX = -speedX;
                    // flash effect on collision
                    element.style.filter = 'brightness(500%)';
                    setTimeout(() => {
                        element.style.filter = '';
                    }, 50);
                }
                
                if (newY <= 0 || newY >= window.innerHeight - rect.height) {
                    speedY = -speedY;
                    // flash effect on collision
                    element.style.filter = 'brightness(500%)';
                    setTimeout(() => {
                        element.style.filter = '';
                    }, 50);
                }
                
                // apply new position
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                
                // continue animation
                requestAnimationFrame(animate);
            }
            
            // start animation
            animate();
        }
        
        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(flashInterval);
        });
    }
}

// initialize appropriate page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortal();
    initMain();
});
