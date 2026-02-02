(function () {
    const KEY_CONFIRMED = 'ab_v2_disabled_confirmed';
    const INITIAL_DELAY = 1500;
    const POLL_INTERVAL = 2000;
    const MONITOR_INTERVAL = 4000;

    const AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

    function safeSetItem(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
    function safeRemoveItem(k) { try { localStorage.removeItem(k); } catch (e) { } }
    function isConfirmed() { try { return localStorage.getItem(KEY_CONFIRMED) === '1'; } catch (e) { return false; } }

    function checkDNSBlocking() {
        return new Promise((resolve) => {
            const uniqueParam = Date.now() + '_' + Math.floor(Math.random() * 1000000);
            const bustCacheUrl = AD_URL + '?cb=' + uniqueParam;

            fetch(bustCacheUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            })
                .then(() => {
                    resolve(false);
                })
                .catch(() => {
                    resolve(true);
                });
        });
    }

    function checkCSSBait() {
        let blocked = false;
        const baitClasses = ['adsbox', 'adunit', 'adsbygoogle', 'textads', 'banner_ads', 'ad-zone'];
        const baits = [];
        try {
            for (let c of baitClasses) {
                const d = document.createElement('div');
                d.className = c;
                d.style.cssText = 'width:1px;height:1px;position:fixed;left:-9999px;top:-9999px;pointer-events:none;opacity:0;z-index:-1';
                document.body.appendChild(d);
                baits.push(d);
            }

            for (let d of baits) {
                const s = window.getComputedStyle(d);
                if (!s || s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.width) === 0) {
                    blocked = true;
                    break;
                }
            }
        } catch (e) { blocked = true; }

        for (let el of baits) try { el.remove(); } catch (e) { }

        return blocked;
    }

    function detectAdblockOnce() {
        return new Promise(async (resolve) => {
            let isBlocked = false;

            isBlocked = checkCSSBait();
            if (isBlocked) {
                resolve(true);
                return;
            }

            if (!isBlocked) {
                const dnsBlocked = await checkDNSBlocking();
                if (dnsBlocked) {
                    isBlocked = true;
                }
            }

            resolve(isBlocked);
        });
    }

    let monitorIntervalId = null;

    function showForcedModal() {
        if (document.getElementById('ab-forced-overlay')) return;

        if (monitorIntervalId) { clearInterval(monitorIntervalId); monitorIntervalId = null; }

        const css = `
      :root{--bg:rgba(6,8,12,.96);--card:#041428;--muted:#9fb6cf;--border:rgba(255,255,255,.05)}
      #ab-forced-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg);z-index:2147483647;padding:18px;backdrop-filter:blur(4px)}
      #ab-forced-card{width:100%;max-width:600px;border-radius:12px;padding:28px;background:linear-gradient(180deg,var(--card),#021024);color:#eaf3ff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid var(--border);box-shadow:0 40px 120px rgba(0,0,0,.8)}
      #ab-forced-head{display:flex;align-items:flex-start;gap:16px}
      #ab-icon-wrap{min-width:44px;height:44px;background:rgba(255,50,50,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center}
      #ab-forced-title{font-size:20px;font-weight:700;color:white;margin-bottom:8px}
      #ab-forced-body{color:var(--muted);line-height:1.6;font-size:15px}
      .ab-status{margin-top:20px;padding-top:15px;border-top:1px solid var(--border);font-size:13px;color:#566a85;display:flex;align-items:center;gap:8px}
      .ab-spinner{width:10px;height:10px;border:2px solid #3b82f6;border-radius:50%;border-top-color:transparent;animation:ab-spin 1s linear infinite}
      @keyframes ab-spin{to{transform:rotate(360deg)}}
      @media(max-width:520px){#ab-forced-card{padding:20px}#ab-forced-title{font-size:18px}#ab-forced-head{flex-direction:column;align-items:center;text-align:center}}
    `;

        const html = `
      <style id="ab-forced-style">${css}</style>
      <div id="ab-forced-overlay">
        <div id="ab-forced-card">
          <div id="ab-forced-head">
            <div id="ab-icon-wrap">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div>
              <div id="ab-forced-title">تم اكتشاف مانع الإعلانات</div>
              <div id="ab-forced-body">
                <p>عذراً، لا يمكن متابعة التصفح أثناء تفعيل <strong>Private DNS</strong> أو مانع الإعلانات.</p>
                <p>الموقع يعتمد على الإعلانات للاستمرار. يرجى تعطيل الحجب وسيقوم الموقع بالعمل تلقائياً.</p>
              </div>
            </div>
          </div>
          <div class="ab-status">
            <div class="ab-spinner"></div> جاري التحقق من الاتصال تلقائياً...
          </div>
        </div>
      </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const pollLoop = () => {
            detectAdblockOnce().then(blocked => {
                if (!blocked) {
                    safeSetItem(KEY_CONFIRMED, '1');
                    location.reload();
                } else {
                    if (document.getElementById('ab-forced-overlay')) {
                        setTimeout(pollLoop, POLL_INTERVAL);
                    }
                }
            });
        };
        setTimeout(pollLoop, 1000);
    }

    function startBackgroundMonitor() {
        if (monitorIntervalId) clearInterval(monitorIntervalId);
        monitorIntervalId = setInterval(() => {
            detectAdblockOnce().then(blocked => {
                if (blocked) {
                    safeRemoveItem(KEY_CONFIRMED);
                    showForcedModal();
                }
            });
        }, MONITOR_INTERVAL);
    }

    function init() {
        setTimeout(() => {
            detectAdblockOnce().then(blocked => {
                if (blocked) {
                    safeRemoveItem(KEY_CONFIRMED);
                    showForcedModal();
                } else {
                    startBackgroundMonitor();
                }
            });
        }, INITIAL_DELAY);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
