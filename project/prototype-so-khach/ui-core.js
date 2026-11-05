(function () {
'use strict';
var S = window.SK, U = S.util;
var DB = S.build(), BY = {}, EV = {};
DB.forEach(function (c) { BY[c.id] = c; });
function reval(c) { EV[c.id] = S.evaluate(c); }
DB.forEach(reval);

var state = { levels: {}, cats: {}, tiers: {}, sort: { key: 'status', dir: 1 }, tab: {}, revealed: {}, tl: { ch: '', res: '' } };
var view = document.getElementById('view');
var drawer = document.getElementById('drawer');
var toastEl = document.getElementById('toast');

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
function pill(lv, text) { return '<span class="pill lv' + lv + '">' + esc(text || S.LEVELS[lv]) + '</span>'; }
function dueText(due) {
  if (!due) return '';
  var d = U.dayDiff(S.TODAY, due.date);
  if (d < 0) return 'Đã quá ' + (-d) + ' ngày';
  if (d === 0) return 'Hôm nay' + (due.time ? ' ' + due.time : '');
  if (d === 1) return 'Ngày mai';
  return U.ddmm(due.date);
}
function dueHtml(due) {
  if (!due) return '<span class="faint">—</span>';
  var d = U.dayDiff(S.TODAY, due.date);
  return '<span class="num' + (d <= 0 ? ' due-red' : '') + '">' + esc(dueText(due)) + '</span>';
}
function mask(p) { return p ? p.slice(0, 3) + '••••' + p.slice(-3) : '—'; }
function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
function daysAgo(at) { var d = U.dayDiff(at, S.TODAY); return d === 0 ? 'Hôm nay' : d === 1 ? 'Hôm qua' : d + ' ngày trước'; }
function nowHM() { var t = new Date(); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); }
function toast(msg) {
  toastEl.textContent = msg; toastEl.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(function () { toastEl.hidden = true; }, 3800);
}
function tierHtml(t) { return '<span class="tier' + (t === 'VIP' ? ' vip' : '') + '">' + esc(t) + '</span>'; }
function ratioCls(r) { return r == null ? '' : r < S.TH.call ? 'ratio-k' : r < S.TH.warn1 ? 'ratio-c' : r < S.TH.safe ? 'ratio-y' : ''; }

function passes(c, ignoreLevel) {
  var e = EV[c.id];
  if (!ignoreLevel && Object.keys(state.levels).length && !state.levels[e.status]) return false;
  if (Object.keys(state.cats).length && !e.issues.some(function (i) { return state.cats[i.cat]; })) return false;
  if (Object.keys(state.tiers).length && !state.tiers[c.tier]) return false;
  return true;
}
function sorter(a, b) {
  var ea = EV[a.id], eb = EV[b.id], k = state.sort.key, dir = state.sort.dir;
  if (k === 'nav') return dir * (eb.m.nav - ea.m.nav);
  if (k === 'ratio') { var ra = ea.m.ratio == null ? 999 : ea.m.ratio, rb = eb.m.ratio == null ? 999 : eb.m.ratio; return dir * (ra - rb); }
  if (k === 'contact') {
    var la = S.lastContact(a), lb = S.lastContact(b);
    var da = la ? U.dayDiff(la.at, S.TODAY) : 9999, db = lb ? U.dayDiff(lb.at, S.TODAY) : 9999;
    return dir * (db - da);
  }
  var x = ea.status - eb.status; if (x) return x;
  var ka = ea.top && ea.top.due ? ea.top.due.date : '9999', kb = eb.top && eb.top.due ? eb.top.due.date : '9999';
  if (ka !== kb) return ka < kb ? -1 : 1;
  return eb.m.nav - ea.m.nav;
}

function renderList() {
  var base = DB.filter(function (c) { return passes(c, true); });
  var counts = [0, 0, 0, 0, 0]; base.forEach(function (c) { counts[EV[c.id].status]++; });
  var rows = DB.filter(function (c) { return passes(c, false); }).sort(sorter);
  var anyFilter = Object.keys(state.levels).length + Object.keys(state.cats).length + Object.keys(state.tiers).length > 0;
  var h = '';
  h += '<div class="proto-bar"><span class="proto-tag">Bản mẫu · số liệu giả · coi hôm nay là Thứ Tư 04/11/2026</span>' +
    '<div class="samples"><button class="btn sm" data-act="samples" aria-expanded="false">13 khách mẫu để thử ▾</button><div class="samples-pop" id="samples-pop" hidden>' +
    DB.filter(function (c) { return c.special; }).map(function (c) {
      return '<button data-open="' + c.id + '"><span><b>' + esc(c.name) + '</b></span>' + pill(EV[c.id].status) + '<small>' + esc(S.SAMPLE_NOTES[c.id]) + '</small></button>';
    }).join('') + '</div></div></div>';
  h += '<div class="counts" role="group" aria-label="Lọc theo mức">' + S.LEVELS.map(function (l, i) {
    return '<button class="count lv' + i + '" data-level="' + i + '" aria-pressed="' + (!!state.levels[i]) + '"><b>' + counts[i] + '</b><span>' + esc(l) + '</span></button>';
  }).join('') + '</div>';
  h += '<div class="filters"><span class="lbl">Nhóm vấn đề:</span>' + [1, 2, 3, 4, 5].map(function (k) {
    return '<button class="fchip" data-cat="' + k + '" aria-pressed="' + (!!state.cats[k]) + '" title="' + esc(S.CATS[k].q) + '">' + k + '. ' + esc(S.CATS[k].short) + '</button>';
  }).join('') + '<span class="sep"></span><span class="lbl">Hạng:</span>' + ['VIP', 'Thân thiết', 'Phổ thông'].map(function (t) {
    return '<button class="fchip" data-tier="' + t + '" aria-pressed="' + (!!state.tiers[t]) + '">' + t + '</button>';
  }).join('') + (anyFilter ? '<button class="btn ghost sm" data-act="clear">Xoá lọc</button>' : '') + '</div>';
  h += '<div class="list-meta"><span>Hiện ' + rows.length + ' / ' + DB.length + ' khách · bấm một dòng để mở trang khách</span><span>Kiểm tra lúc 07:30 hôm nay · số liệu tài khoản lúc 08:00</span></div>';
  function th(key, label, cls) {
    var arrow = state.sort.key === key ? (state.sort.dir === 1 ? ' ↓' : ' ↑') : '';
    return '<th class="' + (cls || '') + '"><button data-sort="' + key + '">' + label + arrow + '</button></th>';
  }
  h += '<div class="tablewrap"><table class="list"><thead><tr>' + '<th>Khách</th>' + th('nav', 'NAV', 'r') + th('ratio', 'Tỷ lệ ký quỹ', 'r') + th('contact', 'Liên hệ gần nhất') +
    th('status', 'Trạng thái') + '<th>Nguyên nhân</th><th>Hạn</th>' + '</tr></thead><tbody>';
  if (!rows.length) h += '<tr><td colspan="7" class="muted" style="padding:20px;text-align:center">Không có khách nào khớp bộ lọc.</td></tr>';
  rows.forEach(function (c) {
    var e = EV[c.id], lc = S.lastContact(c), r = e.m.ratio;
    var reason = e.top ? esc(e.top.short) + '<small>Nhóm ' + e.top.cat + ' · ' + esc(S.CATS[e.top.cat].short) + '</small>'
      : e.noData.length ? esc('Thiếu số liệu: ' + e.noData[0].reason) : '<span class="faint">Không có chuyện cần xử lý</span>';
    h += '<tr class="row" data-open="' + c.id + '" tabindex="0"><td><div class="cname">' + esc(c.name) + '</div><div class="csub"><span class="mono">' + esc(c.acc) + '</span>' + tierHtml(c.tier) + '</div></td>' +
      '<td class="r num">' + U.money(e.m.nav) + '</td>' +
      '<td class="r num ' + ratioCls(r) + '">' + (c.margin ? (c.margin.dataMissing ? '<span class="faint">chưa có</span>' : U.pct(r, 0)) : '<span class="faint">—</span>') + '</td>' +
      '<td>' + (lc ? esc(daysAgo(lc.at)) + '<div class="csub">' + esc(lc.channel) + '</div>' : '<span class="faint">Chưa có</span>') + '</td>' +
      '<td>' + pill(e.status) + (e.issues.length > 1 ? '<div class="csub">còn ' + (e.issues.length - 1) + ' việc khác</div>' : '') + '</td>' +
      '<td class="reason">' + reason + '</td><td>' + dueHtml(e.top && e.top.due) + '</td></tr>';
  });
  h += '</tbody></table></div>';
  view.innerHTML = h;
}

var searchInput = document.getElementById('q'), resultsEl = document.getElementById('results'), active = -1, lastHits = [];
function searchRun() {
  var q = searchInput.value.trim();
  if (q.length < 3) { resultsEl.hidden = true; return; }
  var digits = q.replace(/[\s.\-]/g, ''), isDigits = /^\d+$/.test(digits), hits = [], note = '';
  if (isDigits && digits.length === 10) {
    DB.forEach(function (c) {
      if (c.phone === digits) hits.push({ c: c, rel: '<b>Chủ tài khoản</b>' });
      c.authorized.forEach(function (a) { if (a.phone === digits) hits.push({ c: c, rel: '<b>Người được uỷ quyền:</b> ' + esc(a.name) + ' (' + esc(a.rel) + ') · ' + esc(a.scope) }); });
    });
    if (!hits.length) note = '<b>Số lạ</b> — số ' + esc(mask(digits)) + ' không thuộc khách nào trong sổ của bạn. Không trao đổi thông tin tài khoản.';
  } else if (isDigits) {
    note = 'Gõ đủ 10 số để tìm theo số điện thoại. Đang tìm theo số tài khoản.';
    DB.forEach(function (c) { if (c.acc.indexOf(digits) >= 0) hits.push({ c: c }); });
  } else {
    var nq = norm(q);
    DB.forEach(function (c) { if (norm(c.name).indexOf(nq) >= 0 || c.acc.toLowerCase().indexOf(q.toLowerCase()) >= 0) hits.push({ c: c }); });
    hits.sort(function (a, b) { return EV[a.c.id].status - EV[b.c.id].status; });
    if (!hits.length) note = 'Không có khách nào khớp.';
  }
  lastHits = hits.slice(0, 8); active = lastHits.length ? 0 : -1;
  var h = note ? '<div class="res-note">' + note + '</div>' : '';
  h += lastHits.map(function (x, i) {
    return '<button class="res-item' + (i === active ? ' active' : '') + '" data-open="' + x.c.id + '"><span><b>' + esc(x.c.name) + '</b> <span class="mono faint">' + esc(x.c.acc) + '</span> ' + tierHtml(x.c.tier) + '</span>' +
      pill(EV[x.c.id].status) + (x.rel ? '<span class="rel-line rel">' + x.rel + '</span>' : '') + '</button>';
  }).join('');
  if (hits.length > 8) h += '<div class="res-note">Còn ' + (hits.length - 8) + ' khách khác, gõ thêm để thu hẹp.</div>';
  h += '<div class="verify"><span aria-hidden="true">!</span><span>Chưa xác minh người gọi. Hãy hỏi 2 thông tin cá nhân trước khi nói về tài khoản.</span></div>';
  resultsEl.innerHTML = h; resultsEl.hidden = false;
}
searchInput.addEventListener('input', searchRun);
searchInput.addEventListener('focus', searchRun);
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { resultsEl.hidden = true; searchInput.blur(); return; }
  if (!lastHits.length) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + lastHits.length) % lastHits.length;
    Array.prototype.forEach.call(resultsEl.querySelectorAll('.res-item'), function (el, i) { el.classList.toggle('active', i === active); });
  }
  if (e.key === 'Enter' && active >= 0) { openCustomer(lastHits[active].c.id); }
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('#search')) resultsEl.hidden = true;
  var pop = document.getElementById('samples-pop');
  if (pop && !e.target.closest('.samples')) pop.hidden = true;
});
document.addEventListener('keydown', function (e) {
  var tag = (e.target.tagName || '').toLowerCase();
  if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape' && drawer.classList.contains('open')) window.SKUI.closeDrawer();
});
resultsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (b) openCustomer(b.getAttribute('data-open')); });

function openCustomer(id) {
  resultsEl.hidden = true; searchInput.value = ''; searchInput.blur();
  if (location.hash === '#khach-' + id) route(); else location.hash = 'khach-' + id;
}

view.addEventListener('click', function (e) {
  var t = e.target.closest('[data-level],[data-cat],[data-tier],[data-sort],[data-act],[data-open]');
  if (!t || !view.contains(t)) return;
  if (t.hasAttribute('data-level')) { var l = t.getAttribute('data-level'); if (state.levels[l]) delete state.levels[l]; else state.levels[l] = 1; renderList(); return; }
  if (t.hasAttribute('data-cat')) { var k = t.getAttribute('data-cat'); if (state.cats[k]) delete state.cats[k]; else state.cats[k] = 1; renderList(); return; }
  if (t.hasAttribute('data-tier')) { var tr = t.getAttribute('data-tier'); if (state.tiers[tr]) delete state.tiers[tr]; else state.tiers[tr] = 1; renderList(); return; }
  if (t.hasAttribute('data-sort')) { var s = t.getAttribute('data-sort'); if (state.sort.key === s) state.sort.dir *= -1; else state.sort = { key: s, dir: 1 }; renderList(); return; }
  var act = t.getAttribute('data-act');
  if (act === 'clear') { state.levels = {}; state.cats = {}; state.tiers = {}; renderList(); return; }
  if (act === 'samples') { var p = document.getElementById('samples-pop'); p.hidden = !p.hidden; t.setAttribute('aria-expanded', String(!p.hidden)); return; }
  if (t.hasAttribute('data-open') && !act) { openCustomer(t.getAttribute('data-open')); return; }
  if (window.SKUI.onDetailClick) window.SKUI.onDetailClick(e, t);
});
view.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.matches('tr.row')) openCustomer(e.target.getAttribute('data-open'));
});

function route() {
  var h = location.hash.slice(1);
  window.SKUI.closeDrawer();
  if (h.indexOf('khach-') === 0 && BY[h.slice(6)]) { state.revealed = {}; window.SKUI.renderDetail(BY[h.slice(6)]); }
  else renderList();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

window.SKUI = {
  S: S, U: U, DB: DB, BY: BY, EV: EV, state: state, view: view, drawer: drawer,
  reval: reval, esc: esc, pill: pill, dueText: dueText, dueHtml: dueHtml, mask: mask, daysAgo: daysAgo, nowHM: nowHM, toast: toast,
  tierHtml: tierHtml, ratioCls: ratioCls, renderList: renderList, route: route, openCustomer: openCustomer
};
})();
