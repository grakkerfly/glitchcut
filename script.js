// script.js - Versão com velocidade aumentada

// function to pause all videos
function pauseAllVideos() {
    document.querySelectorAll('video').forEach(video => {
        video.pause();
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
                            const maxSize = 500;
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
                        // FOR VIDEOS: create video element directly
                        const maxSize = 500;
                        mediaElement.style.width = '200px';
                        mediaElement.style.height = '200px';
                        
                        const videoElement = document.createElement('video');
                        videoElement.src = media.src;
                        videoElement.muted = true;
                        videoElement.loop = true;
                        videoElement.autoplay = true;
                        videoElement.playsInline = true;
                        
                        // adjust proportions when video loads
                        videoElement.addEventListener('loadedmetadata', function() {
                            if (this.videoWidth > this.videoHeight) {
                                mediaElement.style.width = `${maxSize}px`;
                                mediaElement.style.height = `${(this.videoHeight / this.videoWidth) * maxSize}px`;
                            } else {
                                mediaElement.style.height = `${maxSize}px`;
                                mediaElement.style.width = `${(this.videoWidth / this.videoHeight) * maxSize}px`;
                            }
                        });
                        
                        videoElement.addEventListener('error', function() {
                            // fallback for video error
                            mediaElement.style.width = '200px';
                            mediaElement.style.height = '200px';
                            mediaElement.style.backgroundColor = '#333';
                            mediaElement.style.display = 'flex';
                            mediaElement.style.alignItems = 'center';
                            mediaElement.style.justifyContent = 'center';
                            mediaElement.innerHTML = '🎬';
                        });
                        
                        mediaElement.appendChild(videoElement);
                        
                        // add video indicator
                        const videoIndicator = document.createElement('div');
                        videoIndicator.className = 'video-indicator';
                        mediaElement.appendChild(videoIndicator);
                        
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
            }
            // resume background video
            if (bgVideo) {
                bgVideo.play().catch(e => console.log('BG video play error:', e));
            }
        }
        
        // function to open modal with media
        function openModal(media) {
            // pause all videos on page first (except background)
            document.querySelectorAll('video').forEach(video => {
                if (video !== bgVideo) {
                    video.pause();
                }
            });
            
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
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                
                // set size for videos in modal
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
            let baseSpeed = 4;
            // Make 3 random items faster
            if (index % 2 === 0 || index % 2 === 0 || index % 2 === 0) {
                baseSpeed = 3; // Increased speed for slower items
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
