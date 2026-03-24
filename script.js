// ============================================
//  PROJECT URVI — SCRIPTS
// ============================================

// --- Nav dropdowns (handles multiple) ---
document.querySelectorAll('.nav-dropdown').forEach(function (dropdownWrap) {
    const dropdownToggle = dropdownWrap.querySelector('.nav-dropdown-toggle');
    const dropdownMenu   = dropdownWrap.querySelector('.nav-dropdown-menu');
    if (!dropdownToggle || !dropdownMenu) return;

    // Toggle on click
    dropdownToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const open = dropdownWrap.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', open);
    });

    // Close when a menu item is clicked
    dropdownMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            dropdownWrap.classList.remove('open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Hover behaviour on desktop
    const mq = window.matchMedia('(min-width: 861px)');
    let closeTimer = null;

    dropdownWrap.addEventListener('mouseenter', function () {
        if (mq.matches) {
            clearTimeout(closeTimer);
            dropdownWrap.classList.add('open');
            dropdownToggle.setAttribute('aria-expanded', 'true');
        }
    });
    dropdownWrap.addEventListener('mouseleave', function () {
        if (mq.matches) {
            closeTimer = setTimeout(function () {
                dropdownWrap.classList.remove('open');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }, 180);
        }
    });
    dropdownMenu.addEventListener('mouseenter', function () {
        if (mq.matches) clearTimeout(closeTimer);
    });
});

// Close all dropdowns on outside click
document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-dropdown').forEach(function (wrap) {
        if (!wrap.contains(e.target)) {
            wrap.classList.remove('open');
            const t = wrap.querySelector('.nav-dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });
});

// --- Mobile nav toggle ---
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const open = siteNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open);
    });

    // Close nav when a link is clicked
    siteNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal, .article-viz');
if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// --- Contact form (Web3Forms - free 250/month, no account needed) ---
// Setup:
//   1. Go to https://web3forms.com
//   2. Enter your email address and click "Create Access Key"
//   3. Copy the key from the email they send you
//   4. Replace YOUR_ACCESS_KEY in the hidden input inside #contactForm in index.html
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        var submitBtn = contactForm.querySelector('[type="submit"]');
        var original  = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        try {
            var res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key:   contactForm.querySelector('[name="access_key"]').value,
                    subject:      'New enquiry from Project Urvi website',
                    from_name:    'Project Urvi Website',
                    name:         contactForm.querySelector('#name').value.trim(),
                    email:        contactForm.querySelector('#email').value.trim(),
                    organisation: contactForm.querySelector('#organisation').value.trim() || 'Not provided',
                    interest:     contactForm.querySelector('#interest').value.trim(),
                    message:      contactForm.querySelector('#message').value.trim()
                })
            });
            var data = await res.json();
            if (data.success) {
                contactForm.reset();
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    setTimeout(function () { formSuccess.style.display = 'none'; }, 6000);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Web3Forms error:', err);
            alert('Something went wrong. Please email us directly at urvi.initiative@gmail.com');
        } finally {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
        }
    });
}

// --- Newsletter subscribe form ---
const nlForm    = document.getElementById('nlForm');
const nlSuccess = document.getElementById('nlSuccess');

if (nlForm) {
    nlForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        var submitBtn = nlForm.querySelector('[type="submit"]');
        var original  = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing…';
        submitBtn.disabled = true;

        try {
            var res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: nlForm.querySelector('[name="access_key"]').value,
                    subject:    'New newsletter subscriber - Project Urvi',
                    from_name:  'Project Urvi Website',
                    email:      nlForm.querySelector('input[type="email"]').value.trim(),
                    message:    'New newsletter subscription request.'
                })
            });
            var data = await res.json();
            if (data.success) {
                nlForm.reset();
                if (nlSuccess) {
                    nlSuccess.style.display = 'block';
                    setTimeout(function () { nlSuccess.style.display = 'none'; }, 6000);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Newsletter error:', err);
            alert('Something went wrong. Please try again later.');
        } finally {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
        }
    });
}

// --- Events modal ---
var eventsModal = document.getElementById('eventsModal');
var eventsModalClose = document.getElementById('eventsModalClose');

function openEventsModal(e) {
    e.preventDefault();
    eventsModal.classList.add('open');
    eventsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closeEventsModal() {
    eventsModal.classList.remove('open');
    eventsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.events-modal-trigger').forEach(function (el) {
    el.addEventListener('click', openEventsModal);
});
if (eventsModalClose) eventsModalClose.addEventListener('click', closeEventsModal);
if (eventsModal) {
    eventsModal.addEventListener('click', function (e) {
        if (e.target === eventsModal) closeEventsModal();
    });
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && eventsModal && eventsModal.classList.contains('open')) closeEventsModal();
});

// --- Lucide icons ---
if (typeof lucide !== 'undefined') lucide.createIcons();
