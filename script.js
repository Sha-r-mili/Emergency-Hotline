/* Small helpers */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* Toast */
const toast = $('#toast');
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2600);
}

/* Logo auto-switch for dark mode */
const brandLogo = $('#brandLogo');
const mql = window.matchMedia('(prefers-color-scheme: dark)');
const updateLogo = (mq) => brandLogo.src = mq.matches ? 'assets/logo-dark.png' : 'assets/logo.png';
updateLogo(mql);
mql.addEventListener?.('change', updateLogo);

/* Counters in nav */
const favCountEl = $('#favCount');
const callCountEl = $('#callCount');

/* Favorite buttons */
function refreshFavCount(){
  const count = $$('.fav-btn i.fa-solid').length;
  favCountEl.textContent = count;
}
$$('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    icon.style.color = icon.classList.contains('fa-solid') ? 'crimson' : '';
    refreshFavCount();
    showToast(icon.classList.contains('fa-solid') ? 'Added to favorites' : 'Removed from favorites');
  });
});

/* Copy number - clipboard */
$$('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const card = e.target.closest('.card');
    const number = $('.card-number', card).textContent.trim();
    try {
      await navigator.clipboard.writeText(number);
      showToast(`Copied: ${number}`);
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = number; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      showToast(`Copied: ${number}`);
    }
  });
});

/* Call simulation (add history + update calls) */
let calls = 0;
function addHistoryItem(service, number){
  const ul = $('#historyList');
  const li = document.createElement('li');
  const left = document.createElement('div');
  left.className = 'h-item-left';
  const title = document.createElement('div');
  title.className = 'h-title';
  title.textContent = service;
  const sub = document.createElement('div');
  sub.className = 'h-sub';
  const now = new Date();
  sub.textContent = `${number} • ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  left.appendChild(title);
  left.appendChild(sub);

  const right = document.createElement('div');
  right.className = 'h-sub';
  right.textContent = '';

  li.appendChild(left);
  li.appendChild(right);
  ul.prepend(li);
}

$$('.btn-call').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    const title = $('.card-title', card).textContent.trim();
    const number = $('.card-number', card).textContent.trim();
    calls++;
    callCountEl.textContent = calls;
    addHistoryItem(title, number);
    showToast(`Calling ${title} — ${number}`);
  });
});

/* Clear history */
$('#clearHistory').addEventListener('click', () => {
  $('#historyList').innerHTML = '';
  calls = 0;
  callCountEl.textContent = 0;
  showToast('Call history cleared');
});

/* Initialize counts on load (in case some hearts already toggled) */
refreshFavCount();
