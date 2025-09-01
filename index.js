 const state = { hearts: 0, coins: 100, copies: 0, history: [] };

    const heartCountEl = document.getElementById('heartCount');
    const coinCountEl = document.getElementById('coinCount');
    const copyCountEl = document.getElementById('copyCount');
    const historyListEl = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    function renderState() {
      heartCountEl.textContent = state.hearts;
      coinCountEl.textContent = state.coins;
      copyCountEl.textContent = state.copies;
      renderHistory();
    }

    function renderHistory() {
      historyListEl.innerHTML = '';
      if (state.history.length === 0) {
        historyListEl.innerHTML = '<div class="text-gray-400">কোনো কল ইতিহাস নেই</div>';
        return;
      }
      state.history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'p-2 rounded border bg-gray-50';
        div.innerHTML = `
          <div class="font-medium">${item.name}</div>
          <div class="text-xs text-gray-600">${item.number} — <span class="text-xs text-gray-500">${item.time}</span></div>
        `;
        historyListEl.appendChild(div);
      });
    }
    document.querySelectorAll('.card-heart').forEach(el => {
      el.addEventListener('click', () => {
        state.hearts += 1;
        renderState();
        el.classList.add('scale-110');
        setTimeout(() => el.classList.remove('scale-110'), 160);
      });
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const card = btn.closest('article');
        const number = card?.dataset?.number ?? '';
        let copied = false;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          try {
            await navigator.clipboard.writeText(number);
            copied = true;
          } catch (err) {

            console.warn('navigator.clipboard.writeText failed, will try legacy fallback:', err);
          }
        }


        if (!copied) {
          try {
            const ta = document.createElement('textarea');
            ta.value = number;
            ta.setAttribute('readonly', '');
            // place off-screen
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(ta);
            if (successful) copied = true;
          } catch (err) {
            console.error('Legacy clipboard fallback failed:', err);
          }
        }

        if (copied) {
          state.copies += 1;
          renderState();
          alert(`কপি করা হয়েছে: ${number}`);
        } else {

          alert('কপি করতে ব্যর্থ হয়েছে — আপনার পরিবেশ ক্লিপবোর্ড অ্যাক্সেস অনুমোদন করে না। অনুগ্রহ করে ম্যানুয়ালি নম্বরটি সিলেক্ট করে কপি করুন।');
        }
      });
    });

    document.querySelectorAll('.call-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('article');
        const name = card?.dataset?.name ?? 'Service';
        const number = card?.dataset?.number ?? '';

        // check coins
        if (state.coins < 20) {
          alert('আপনার কাছে পর্যাপ্ত কয়েন নেই। (প্রতিটি কল 20 কয়েন)');
          return;
        }

        state.coins -= 20;
        renderState();

        // show alert
        alert(`Calling ${name} — ${number}`);

        // add to history with exact current local time (human readable)
        const time = new Date().toLocaleString();
        state.history.unshift({ name, number, time });
        if (state.history.length > 50) state.history.pop();
        renderState();
      });
    });

    // clear history
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (!confirm('আপনি কি নিশ্চিত যে কল ইতিহাস মুছে ফেলতে চান?')) return;
        state.history = [];
        renderState();
      });
    }
    renderState();

    window.addEventListener('resize', handleResize);