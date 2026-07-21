/* ===========================================
   ELEGANT LUXURY MODERN WEDDING INVITATION
   Main JavaScript
   =========================================== */

(function () {
  'use strict';

  /* ========================================
     DOM REFERENCES
     ======================================== */
  const $loadingScreen = document.getElementById('loading-screen');
  const $openingScreen = document.getElementById('opening-screen');
  const $btnOpen = document.getElementById('btn-open-invitation');
  const $mainContent = document.getElementById('main-content');
  const $btnMusic = document.getElementById('btn-music');
  const $musicControl = document.getElementById('music-control');
  const $btnBackToTop = document.getElementById('btn-back-to-top');
  const $guestbookForm = document.getElementById('guestbook-form');
  const $guestbookList = document.getElementById('guestbook-list');
  const $guestbookEmpty = document.getElementById('guestbook-empty');
  const $lightbox = document.getElementById('lightbox');
  const $lightboxCounter = document.getElementById('lightbox-counter');
  const $lightboxImg = document.getElementById('lightbox-img');
  const $galleryItems = document.querySelectorAll('.gallery-item');

  /* ========================================
     GUEST NAME FROM URL
     ======================================== */
  var urlParams = new URLSearchParams(window.location.search);
  var guestName = urlParams.get('to');
  if (guestName) {
    var $salamGuest = document.getElementById('salamGuest');
    var $guestNameDisplay = document.getElementById('guestNameDisplay');
    if ($salamGuest && $guestNameDisplay) {
      $salamGuest.style.display = 'block';
      $guestNameDisplay.textContent = guestName;
    }
    var $openingGuest = document.getElementById('openingGuest');
    var $openingGuestName = document.getElementById('openingGuestName');
    if ($openingGuest && $openingGuestName) {
      $openingGuest.style.display = 'block';
      $openingGuestName.textContent = guestName;
    }
    document.title = 'Undangan untuk ' + guestName + ' - Sarina & Yakman';
  }

  /* ========================================
     LOADING SCREEN
     ======================================== */
  function hideLoadingScreen() {
    $loadingScreen.classList.add('hidden');
    setTimeout(function () {
      $loadingScreen.style.display = 'none';
    }, 300);
  }

  window.addEventListener('load', function () {
    setTimeout(hideLoadingScreen, 200);
  });

  /* ========================================
     YOUTUBE MUSIC PLAYER (lazy-load)
     ======================================== */
  var ytPlayer = null;
  var ytApiLoaded = false;
  var ytApiLoading = false;
  var musicStarted = false;
  var isPlaying = false;

  function loadYtApi(callback) {
    if (ytApiLoaded) { callback(); return; }
    if (ytApiLoading) { return; }
    ytApiLoading = true;
    window.onYouTubeIframeAPIReady = function () {
      ytApiLoaded = true;
      ytPlayer = new YT.Player('yt-music-player', {
        videoId: 'mpineoNP23I',
        playerVars: {
          autoplay: 0, loop: 1, playlist: 'mpineoNP23I',
          controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          modestbranding: 1, rel: 0, showinfo: 0, start: 0
        },
        events: {
          onReady: function () { ytPlayer.setVolume(80); callback(); },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.ENDED) { ytPlayer.playVideo(); }
          }
        }
      });
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  function playMusic() {
    if (ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
      updateMusicUI(true);
    } else {
      loadYtApi(function () {
        ytPlayer.playVideo();
        updateMusicUI(true);
      });
    }
  }

  function pauseMusic() {
    if (ytPlayer && ytPlayer.pauseVideo) {
      ytPlayer.pauseVideo();
      updateMusicUI(false);
    }
  }

  /* ========================================
     OPENING SCREEN
     ======================================== */
  function openInvitation() {
    $openingScreen.classList.add('hidden');
    $mainContent.style.display = 'block';
    $musicControl.classList.add('visible');
    document.body.style.overflow = 'auto';

    // Start music
    if (!musicStarted) {
      playMusic();
      musicStarted = true;
    }

    // Trigger AOS for visible elements
    setTimeout(runAOS, 100);
  }

  // Prevent scroll when opening screen is visible
  document.body.style.overflow = 'hidden';

  $btnOpen.addEventListener('click', openInvitation);

  /* ========================================
     MUSIC CONTROL UI
     ======================================== */
  function updateMusicUI(playing) {
    isPlaying = playing;
    var iconPlay = $btnMusic.querySelector('.icon-play');
    var iconPause = $btnMusic.querySelector('.icon-pause');
    var bars = $musicControl.querySelector('.music-bars');

    if (playing) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      bars.classList.add('playing');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      bars.classList.remove('playing');
    }
  }

  $btnMusic.addEventListener('click', function () {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  /* ========================================
     AOS (Animate On Scroll) - IntersectionObserver
     ======================================== */
  function runAOS() {
    var aosElements = document.querySelectorAll('.aos');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      aosElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      aosElements.forEach(function (el) {
        el.classList.add('aos-animate');
      });
    }
  }

  /* ========================================
     COUNTDOWN TIMER
     ======================================== */
  var countdownTarget = new Date('2026-08-10T00:00:00').getTime();

  function updateCountdown() {
    var now = new Date().getTime();
    var diff = countdownTarget - now;

    if (diff <= 0) {
      document.getElementById('countdown-days').textContent = '0';
      document.getElementById('countdown-hours').textContent = '0';
      document.getElementById('countdown-minutes').textContent = '0';
      document.getElementById('countdown-seconds').textContent = '0';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = days;
    document.getElementById('countdown-hours').textContent = hours;
    document.getElementById('countdown-minutes').textContent = minutes;
    document.getElementById('countdown-seconds').textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================================
     GALLERY LIGHTBOX
     ======================================== */
  var currentLightboxIndex = 0;
  var totalGalleryItems = $galleryItems.length;
  var galleryImages = [];

  // Collect all gallery image sources
  $galleryItems.forEach(function (item) {
    var img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
    }
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    $lightboxImg.src = galleryImages[index];
    $lightboxCounter.textContent = (index + 1) + '/' + galleryImages.length;
    $lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    $lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
    $lightboxImg.src = galleryImages[currentLightboxIndex];
    $lightboxCounter.textContent = (currentLightboxIndex + 1) + '/' + galleryImages.length;
  }

  $galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var index = parseInt(item.getAttribute('data-index'));
      openLightbox(index);
    });
  });

  $lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  $lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { navigateLightbox(-1); });
  $lightbox.querySelector('.lightbox-next').addEventListener('click', function () { navigateLightbox(1); });

  $lightbox.addEventListener('click', function (e) {
    if (e.target === $lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!$lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ========================================
     GUEST BOOK (Local Storage)
     ======================================== */
  var GUESTBOOK_KEY = 'wedding_guestbook';

  function getGuestbookData() {
    try {
      var data = localStorage.getItem(GUESTBOOK_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveGuestbookData(data) {
    try {
      localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(data));
    } catch (e) {
      // Storage full or unavailable
    }
  }

  function formatTime(timestamp) {
    var d = new Date(timestamp);
    var day = d.getDate();
    var month = d.toLocaleString('id-ID', { month: 'long' });
    var year = d.getFullYear();
    var hours = String(d.getHours()).padStart(2, '0');
    var minutes = String(d.getMinutes()).padStart(2, '0');
    return day + ' ' + month + ' ' + year + ', ' + hours + ':' + minutes;
  }

  function renderGuestbook() {
    var data = getGuestbookData();

    // Clear list
    $guestbookList.innerHTML = '';

    if (data.length === 0) {
      var emptyMsg = document.createElement('p');
      emptyMsg.className = 'guestbook-empty';
      emptyMsg.textContent = 'Belum ada ucapan. Jadilah yang pertama!';
      $guestbookList.appendChild(emptyMsg);
      return;
    }

    // Render in reverse (newest first)
    var reversed = data.slice().reverse();
    reversed.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'guestbook-item';
      div.innerHTML =
        '<p class="guestbook-name">' + escapeHtml(item.name) + '</p>' +
        '<p class="guestbook-time">' + formatTime(item.timestamp) + '</p>' +
        '<p class="guestbook-message">' + escapeHtml(item.message) + '</p>';
      $guestbookList.appendChild(div);
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function handleGuestbookSubmit(e) {
    e.preventDefault();

    var nameInput = document.getElementById('guest-name');
    var messageInput = document.getElementById('guest-message');

    var name = nameInput.value.trim();
    var message = messageInput.value.trim();

    if (!name || !message) return;

    var data = getGuestbookData();
    data.push({
      name: name,
      message: message,
      timestamp: Date.now()
    });

    saveGuestbookData(data);
    renderGuestbook();

    nameInput.value = '';
    messageInput.value = '';
  }

  $guestbookForm.addEventListener('submit', handleGuestbookSubmit);
  renderGuestbook();

  /* ========================================
     BACK TO TOP
     ======================================== */
  function handleBackToTopVisibility() {
    if (window.scrollY > 400) {
      $btnBackToTop.classList.add('visible');
    } else {
      $btnBackToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility);

  $btnBackToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========================================
     PARALLAX EFFECT (Hero)
     ======================================== */
  var $heroParallax = document.querySelector('.hero-parallax');

  function handleParallax() {
    if (!$heroParallax) return;
    var scrolled = window.scrollY;
    if (scrolled < window.innerHeight * 1.5) {
      $heroParallax.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
    }
  }

  window.addEventListener('scroll', handleParallax);

  /* ========================================
     COPY TO CLIPBOARD (Gift Section)
     ======================================== */
  document.querySelectorAll('.btn-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(function () {
          showCopied(btn);
        }).catch(function () {
          fallbackCopy(textToCopy, btn);
        });
      } else {
        fallbackCopy(textToCopy, btn);
      }
    });
  });

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {}
    document.body.removeChild(textarea);
  }

  function showCopied(btn) {
    var span = btn.querySelector('span');
    var originalText = span.textContent;
    span.textContent = 'Tersalin!';
    btn.classList.add('copied');
    setTimeout(function () {
      span.textContent = originalText;
      btn.classList.remove('copied');
    }, 2000);
  }

  /* ========================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offsetTop = target.offsetTop - 60;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

})();