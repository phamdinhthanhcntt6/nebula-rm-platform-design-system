(function () {
'use strict';
var X = window.SKUI, S = X.S, U = X.U, esc = X.esc, pill = X.pill, state = X.state, view = X.view, drawer = X.drawer;
var cur = null;

function relMap(e, tab) {
  var m = {};
  e.issues.forEach(function (i) { i.evidence.forEach(function (v) { if (v.tab === tab) { m[v.row] = m[v.row] || []; if (m[v.row].indexOf(i) < 0) m[v.row].push(i); } }); });
  return m;
}
function relTags(map, key) {
  return (map[key] || []).map(function (i) { return '<button class="rel lv' + i.level + '" data-d="issue" data-id="' + i.id + '" title="Mở vấn đề này">Liên quan: ' + esc(i.title) + '</button>'; }).join('');
}

function renderDetail(c) {
  cur = c;
  var e = X.EV[c.id], m = e.m;
  if (!state.tab[c.id]) state.tab[c.id] = 'overview';
  var tab = state.tab[c.id];
  var openTasks = c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < S.TODAY; }).length;
  var h = '<a class="back" href="#so-khach">← Tổng quan khách hàng</a>';
  h += '<div class="chead"><div><h1>' + esc(c.name) + ' ' + X.tierHtml(c.tier) + ' ' + pill(e.status) + '</h1>' +
    '<div class="cmeta"><span class="mono">' + esc(c.acc) + '</span><span>Khách từ ' + c.since + '</span><span>Phụ trách: Chị Lan</span>' +
    '<span>ĐT: <span class="mono">' + (state.revealed[c.id] ? esc(c.phone) : esc(X.mask(c.phone))) + '</span> ' +
    (state.revealed[c.id] ? '' : '<button class="btn ghost sm" data-d="reveal">Hiện</button>') + '</span>' +
    (c.labels.length ? '<span class="labels">' + c.labels.map(function (l) { return '<span class="tag">' + esc(l) + '</span>'; }).join('') + '</span>' : '') +
    '</div></div><div class="cactions"><button class="btn primary" data-d="log">+ Tạo sự kiện</button></div></div>';
  h += strip(c, m);
  h += '<div class="tabs" role="tablist">' +
    tabBtn('overview', 'Tổng quan', '') +
    tabBtn('issues', 'Vấn đề', e.issues.length ? '<span class="badge lv' + e.status + '">' + e.issues.length + '</span>' : (e.noData.length ? '<span class="badge lv3">thiếu số liệu</span>' : '')) +
    tabBtn('history', 'Lịch sử trao đổi', openTasks ? '<span class="badge lv1">' + openTasks + ' quá hạn</span>' : '') + '</div>';
  h += '<div id="tabbody">' + (tab === 'issues' ? tabIssues(c, e) : tab === 'overview' ? tabOverview(c, e) : tabHistory(c, e)) + '</div>';
  view.innerHTML = h;
  function tabBtn(k, label, extra) { return '<button class="tab" role="tab" data-d="tab" data-tab="' + k + '" aria-selected="' + (tab === k) + '">' + label + extra + '</button>'; }
}

function strip(c, m) {
  var r = m.ratio, bar;
  if (!c.margin) bar = '<div class="v" style="font-size:14px;font-weight:500">Không vay ký quỹ</div>';
  else if (c.margin.dataMissing) bar = '<div class="v" style="font-size:14px;color:var(--n)">Chưa có số liệu hôm nay</div>';
  else {
    var color = r < S.TH.call ? 'var(--k)' : r < S.TH.warn1 ? 'var(--c)' : r < S.TH.safe ? 'var(--y)' : 'var(--o)';
    var w = function (x) { return Math.min(100, x / 80 * 100); };
    bar = '<div class="v ' + X.ratioCls(r) + '">' + U.pct(r, 0) + (m.proj != null && m.proj < S.TH.call ? ' <span style="font-size:12px;font-weight:500">→ ' + U.pct(m.proj, 0) + ' từ ' + U.ddmm(m.projDate) + '</span>' : '') + '</div>' +
      '<div class="rbar"><span class="fill" style="width:' + w(r) + '%;background:' + color + '"></span>' +
      '<span class="mark" style="left:' + w(S.TH.force) + '%"></span><span class="mk-lbl mk-l" style="left:' + w(S.TH.force) + '%">bán ' + S.TH.force + '%</span>' +
      '<span class="mark" style="left:' + w(S.TH.call) + '%"></span><span class="mk-lbl mk-r" style="left:' + w(S.TH.call) + '%">call ' + S.TH.call + '%</span></div><div style="height:12px"></div>';
  }
  return '<div class="strip">' +
    '<div><div class="k">NAV (tài sản ròng)</div><div class="v">' + U.money(m.nav) + '</div></div>' +
    '<div><div class="k">Tiền mặt</div><div class="v">' + U.money(c.cash) + '</div></div>' +
    '<div><div class="k">Sức mua</div><div class="v">' + U.money(m.buying) + '</div></div>' +
    '<div><div class="k">Đang nợ</div><div class="v">' + (c.margin ? U.money(m.debt) : '—') + '</div></div>' +
    '<div><div class="k">Số liệu lúc</div><div class="v" style="font-size:14px">08:00 · 04/11</div></div>' +
    '<div><div class="k">Tỷ lệ ký quỹ</div>' + bar + '</div></div>';
}

function tabIssues(c, e) {
  var h = '<div class="checked">Đánh giá lúc 07:30 hôm nay, tính lại mỗi khi bạn lưu một sự kiện. Vấn đề xếp từ gấp nhất tới nhẹ nhất.</div>';
  if (!e.issues.length) h += '<div class="empty">Không có vấn đề cần xử lý.</div>';
  e.issues.forEach(function (i, idx) { h += issueCard(i, idx === 0, c, e); });
  var nd = {}; e.noData.forEach(function (n) { nd[n.cat] = n; });
  var okCats = [1, 2, 3, 4, 5].filter(function (k) { return !e.issues.some(function (i) { return i.cat === k; }) && !nd[k]; });
  if (okCats.length) h += '<div class="okline"><b>Ổn:</b> ' + okCats.map(function (k) { return esc(S.CATS[k].ok); }).join(' · ') + '</div>';
  e.noData.forEach(function (n) { h += '<div class="ndline"><b>Chưa đủ dữ liệu — ' + esc(S.CATS[n.cat].short) + ':</b> ' + esc(n.reason) + ' Chưa thể nói là ổn.</div>'; });
  e.blocks.filter(function (b) { return b.state === 'grey'; }).forEach(function (b) { h += '<div class="ndline"><b>Ghi chú:</b> ' + esc(b.what) + ' — ' + esc(b.note) + '.</div>'; });
  return h;
}
function issueCard(i, isFirst, c, e) {
  var blocks = e.blocks.filter(function (b) { return b.code === i.code && b.state !== 'grey'; });
  var h = '<article class="issue' + (isFirst ? ' first' : '') + '" id="is-' + i.id + '">' +
    (isFirst ? '<div class="eyebrow">Cần xử lý trước</div>' : '') +
    '<div class="issue-head"><h4>' + esc(i.title) + '</h4>' + pill(i.level) + (i.due ? '<span class="tag">Hạn: ' + esc(X.dueText(i.due)) + '</span>' : '') + '<span class="tag">' + esc(S.CATS[i.cat].short) + '</span></div>';
  if (blocks.length) h += '<div class="blk">' + blocks.map(function (b) { return '<span class="bitem ' + b.state + '">' + (b.state === 'now' ? 'Đang bị chặn: ' : b.state === 'will' ? 'Sẽ bị xử lý: ' : 'Sắp bị chặn: ') + esc(b.what) + '</span>'; }).join('') + '</div>';
  if (isFirst) h += '<div class="opener"><span><span class="muted" style="font-size:12px;display:block">Câu mở đầu gợi ý</span><q id="opener">' + esc(i.opener) + '</q></span><button class="btn sm" data-d="copy">Chép</button></div>' +
    ((c.labels.length || c.pref) ? '<div class="opener-note">Cách nói chuyện: ' + esc(c.labels.join(' · ') || '—') + (c.pref ? ' · Ưu tiên liên hệ: ' + esc(c.pref) : '') + '</div>' : '');
  h += '<dl><dt>Vì sao</dt><dd>' + esc(i.why) + '</dd><dt>Hậu quả nếu không xử lý</dt><dd>' + esc(i.then) + '</dd><dt>Cách gỡ</dt><dd>' + esc(i.fix) + '</dd>' +
    '<dt>Bằng chứng</dt><dd class="evs">' + i.evidence.map(function (v) { return '<button class="ev" data-d="ev" data-tab="' + v.tab + '" data-row="' + v.row + '">' + esc(v.label) + ' ↗</button>'; }).join('') + '</dd></dl>' +
    '<div class="issue-actions"><button class="btn' + (isFirst ? ' primary' : '') + '" data-d="sol" data-id="' + i.id + '">Xem giải pháp</button></div></article>';
  return h;
}

function tabOverview(c, e) {
  var m = e.m, rm = relMap(e, 'overview'), h = '';
  if (e.status <= 1 && e.top) h += '<div class="alert lv' + e.status + '"><span><b>' + esc(S.LEVELS[e.status]) + ':</b> ' + esc(e.top.title) + '</span><button class="btn sm" data-d="tab" data-tab="issues">Xem tab Vấn đề</button></div>';
  var sExp = c.survey ? U.addDays(c.survey, S.TH.surveyDays) : null, sd = sExp ? U.dayDiff(S.TODAY, sExp) : -1;
  var idd = U.dayDiff(S.TODAY, c.idExpiry);
  function row(id, k, v) { return '<div class="kvr hl" id="r-' + id + '"><span>' + k + '</span><span>' + v + '</span></div>'; }
  h += '<div class="grid2"><section class="block"><h3>1. Hồ sơ khách <span class="stamp">Hồ sơ mở tài khoản, phiếu khảo sát</span></h3><div class="kvl">' +
    row('p-acc', 'Số tài khoản', '<span class="mono">' + esc(c.acc) + '</span>') +
    row('p-tier', 'Hạng · khách từ', esc(c.tier) + ' · ' + c.since) +
    row('p-job', 'Nghề nghiệp', c.job ? esc(c.job) : '<span class="faint">chưa có</span>') +
    row('p-app', 'Khẩu vị', esc(c.appetite)) +
    row('p-goal', 'Mục tiêu', esc(c.goal) + ' · ' + esc(c.horizon)) +
    row('p-loss', 'Chịu lỗ tối đa', c.maxLoss + '% danh mục') +
    row('prof-survey', 'Ngày khảo sát', (c.survey ? U.ddmmyyyy(c.survey) : 'Chưa làm') + (sd < 0 ? '<span class="bad-tag">Quá hạn</span>' : sd <= S.TH.surveySoon ? '<span class="warn-tag">Sắp quá hạn</span>' : '') + relTags(rm, 'prof-survey')) +
    row('prof-id', 'CCCD', '<span class="mono">0' + c.acc.slice(-2) + '•••••••' + c.phone.slice(-3) + '</span> · hết hạn ' + U.ddmmyyyy(c.idExpiry) + (idd < 0 ? '<span class="bad-tag">Đã hết hạn</span>' : idd <= S.TH.idSoon ? '<span class="warn-tag">Còn ' + idd + ' ngày</span>' : '') + relTags(rm, 'prof-id')) +
    row('p-auth', 'Người được uỷ quyền', c.authorized.length ? c.authorized.map(function (a) { return esc(a.name) + ' (' + esc(a.rel) + ') — ' + esc(a.scope); }).join('<br>') : '<span class="faint">Không có</span>') +
    '</div></section>';
  h += '<div><section class="block"><h3>2. Về khách này <span class="stamp">Broker nhập khi tạo sự kiện (US 3.2)</span></h3>' +
    '<div class="kvl">' + row('p-lbl', 'Nhãn giao tiếp', c.labels.length ? c.labels.map(function (l) { return '<span class="tag">' + esc(l) + '</span>'; }).join(' ') : '<span class="faint">Chưa có — thêm khi tạo sự kiện</span>') +
    row('p-pref', 'Ưu tiên liên hệ', c.pref ? esc(c.pref) : '<span class="faint">Chưa có</span>') + '</div></section>';
  var must = [['CCCD còn hạn', idd >= 0], ['Khảo sát còn hạn', sd >= 0], ['Số điện thoại', !!c.phone]];
  var should = [['Mục tiêu đầu tư', !!c.goal], ['Mức lỗ tối đa', !!c.maxLoss], ['Giờ nên liên hệ', !!c.pref]];
  var nice = [['Nhãn giao tiếp', c.labels.length > 0], ['Nghề nghiệp', !!c.job]];
  function lvl(name, arr) {
    var ok = arr.filter(function (x) { return x[1]; }).length, miss = arr.filter(function (x) { return !x[1]; });
    return '<div><b>' + name + ' · ' + ok + '/' + arr.length + '</b><div class="meter"><i style="width:' + (ok / arr.length * 100) + '%"></i></div>' +
      (miss.length ? '<ul>' + miss.map(function (x) { return '<li>Thiếu: ' + esc(x[0]) + '</li>'; }).join('') + '</ul>' : '<span class="muted" style="font-size:12.5px">Đủ</span>') + '</div>';
  }
  h += '<section class="block"><h3>3. Hồ sơ còn thiếu gì</h3><div class="miss">' + lvl('Bắt buộc', must) + lvl('Cần có', should) + lvl('Bổ sung', nice) + '</div></section></div></div>';
  function metric(id, k, v) { return '<div class="metric hl" id="r-' + id + '"><div class="k">' + k + '</div><div class="v">' + v + '</div>' + relTags(rm, id) + '</div>'; }
  h += '<section class="block"><h3>4. Chỉ số tài khoản <span class="stamp">Phần mềm giao dịch · 08:00 04/11</span></h3><div class="metrics">' +
    metric('acct-nav', 'NAV', U.money(m.nav)) + metric('acct-cash', 'Tiền mặt', U.money(c.cash)) + metric('acct-buy', 'Sức mua', U.money(m.buying)) +
    metric('acct-debt', 'Đang nợ', c.margin ? U.money(m.debt) : '—') +
    metric('acct-ratio', 'Tỷ lệ ký quỹ', !c.margin ? '—' : c.margin.dataMissing ? 'chưa có' : '<span class="' + X.ratioCls(m.ratio) + '">' + U.pct(m.ratio, 0) + '</span>') + '</div>' +
    (c.margin && !c.margin.dataMissing ? '<p class="muted" style="font-size:12.5px;margin:8px 0 0">Mức bị call ' + S.TH.call + '% · mức bị bán giải chấp ' + S.TH.force + '% · dưới ' + S.TH.safe + '% không được vay thêm.</p>' : '') + '</section>';
  var tot = m.A, secs = {};
  c.holdings.forEach(function (x) { var s = U.sectorOf(x.t); secs[s] = (secs[s] || 0) + U.val(x); });
  h += '<section class="block"><h3>5. Danh mục <span class="stamp">Giá cuối phiên 03/11</span></h3><div style="overflow-x:auto"><table class="mini"><thead><tr><th>Mã</th><th>Ngành</th><th class="r">Số lượng</th><th class="r">Tỷ trọng</th><th class="r">Giá mua</th><th class="r">Giá nay</th><th class="r">Lãi/lỗ</th></tr></thead><tbody>' +
    c.holdings.slice().sort(function (a, b) { return U.val(b) - U.val(a); }).map(function (x) {
      var p = U.priceOf(x), pl = (p - x.cost) / x.cost * 100;
      return '<tr class="hl" id="r-h-' + x.t + '"><td><b>' + x.t + '</b>' + (x.loan ? '<div class="csub warn-tag" style="margin:2px 0 0">Tỷ lệ cho vay ' + x.loan.from + '% → ' + x.loan.to + '% từ ' + U.ddmm(x.loan.date) + '</div>' : '') + relTags(rm, 'h-' + x.t) + '</td><td>' + esc(U.sectorOf(x.t)) + '</td><td class="r num">' + U.fmt(x.qty) + '</td>' +
        '<td class="r num">' + U.pct(U.val(x) / tot * 100, 0) + '</td><td class="r num">' + U.fmt(x.cost) + '</td><td class="r num">' + U.fmt(p) + '</td><td class="r num ' + (pl >= 0 ? 'up' : 'down') + '">' + (pl >= 0 ? '+' : '') + U.pct(pl) + '</td></tr>';
    }).join('') + '</tbody></table></div><div class="sub">Theo ngành</div>' +
    Object.keys(secs).sort(function (a, b) { return secs[b] - secs[a]; }).map(function (s) {
      var p = secs[s] / tot * 100;
      return '<div class="sector hl' + (p > S.TH.sector ? ' over' : '') + '" id="r-sec-' + s + '"><span>' + esc(s) + relTags(rm, 'sec-' + s) + '</span><span class="bar"><i style="width:' + p + '%"></i></span><span class="num" style="text-align:right">' + U.pct(p, 0) + '</span></div>';
    }).join('') + '<p class="muted" style="font-size:12px;margin:6px 0 0">Ngành vượt ' + S.TH.sector + '% được tô vàng.</p></section>';
  var navBefore = function (t) { return m.nav + t.amt; };
  var recent = c.txns.filter(function (t) { return t.status !== 'Chờ khớp' && U.dayDiff(t.date, S.TODAY) <= 7; });
  var pend = c.txns.filter(function (t) { return t.status === 'Chờ khớp'; });
  var nIn = recent.filter(function (t) { return t.type === 'Nạp tiền'; }).reduce(function (s, t) { return s + t.amt; }, 0);
  var nOut = recent.filter(function (t) { return t.type === 'Rút tiền'; }).reduce(function (s, t) { return s + t.amt; }, 0);
  var nOrd = recent.filter(function (t) { return t.type === 'Mua' || t.type === 'Bán'; }).length;
  var cev = c.holdings.filter(function (x) { var ev = S.CORP[x.t]; return ev && U.dayDiff(S.TODAY, ev.date) >= 0 && U.dayDiff(S.TODAY, ev.date) <= 30; });
  h += '<section class="block"><h3>6. Giao dịch gần đây <span class="stamp">7 ngày qua</span></h3>' +
    '<div class="sumrow hl" id="r-tx-summary"><span>Lệnh đã khớp: <b>' + nOrd + '</b></span><span>Nạp: <b>' + U.money(nIn) + '</b></span><span>Rút: <b>' + U.money(nOut) + '</b></span><span class="muted">30 ngày: ' + c.trades30 + ' lệnh</span>' + relTags(rm, 'tx-summary') + '</div>' +
    (recent.length ? '<div style="overflow-x:auto"><table class="mini"><tbody>' + recent.map(function (t) {
      var big = (t.type === 'Rút tiền' || t.type === 'Nạp tiền') && t.amt / navBefore(t) * 100 >= S.TH.bigMove;
      return '<tr class="hl' + (big ? ' big' : '') + '" id="r-tx-' + t.id + '"><td class="num">' + U.ddmm(t.date) + '</td><td>' + esc(t.type) + (t.t ? ' ' + t.t + ' · ' + U.fmt(t.qty) + ' × ' + U.fmt(t.price) : '') + relTags(rm, 'tx-' + t.id) + '</td><td class="r num">' + U.money(t.amt) + (big ? ' <b>(' + U.pct(t.amt / navBefore(t) * 100, 0) + ' tài sản)</b>' : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>' : '<p class="muted" style="margin:0">Không có giao dịch trong 7 ngày.</p>') +
    '<div class="sub">Lệnh đang chờ khớp</div>' + (pend.length ? pend.map(function (t) { return '<div class="hl" id="r-tx-' + t.id + '">' + esc(t.type) + ' ' + t.t + ' · ' + U.fmt(t.qty) + ' × ' + U.fmt(t.price) + ' · đặt ' + U.ddmm(t.date) + ' <span class="tag">Chờ khớp</span></div>'; }).join('') : '<span class="muted">Không có</span>') +
    '<div class="sub">Sự kiện sắp tới của mã đang giữ</div>' + (cev.length ? cev.map(function (x) { var ev = S.CORP[x.t]; return '<div class="hl" id="r-cev-' + x.t + '"><b>' + x.t + '</b> · ' + U.ddmm(ev.date) + ' · ' + esc(ev.text) + relTags(rm, 'cev-' + x.t) + '</div>'; }).join('') : '<span class="muted">Không có trong 30 ngày tới</span>') +
    '</section>';
  return h;
}

function tabHistory(c, e) {
  var rm = relMap(e, 'history'), h = '';
  var lc = S.lastContact(c);
  h += '<div class="lastline">' + (lc ? '<b>Lần trước (' + U.ddmm(lc.at) + ', ' + esc(lc.channel.toLowerCase()) + ', ' + esc(lc.broker) + '):</b> ' + esc(lc.note) : 'Chưa có lần liên hệ nào được ghi.') + '</div>';
  h += '<div class="grid2"><section class="block"><h3>Cam kết đang hiệu lực</h3>';
  var cms = c.commitments.slice().sort(function (a, b) { return a.status === b.status ? 0 : a.status === 'active' ? -1 : 1; });
  if (!cms.length) h += '<p class="muted" style="margin:0">Chưa có cam kết nào (điểm cắt lỗ, giá mục tiêu, điều kiện xem lại).</p>';
  cms.forEach(function (cm) {
    if (cm.type === 'review') {
      var rd = U.dayDiff(S.TODAY, cm.reviewDate);
      h += '<div class="cm hl' + (cm.status !== 'active' ? ' replaced' : '') + '" id="r-cm-' + cm.id + '"><div><b>Điều kiện xem lại: ' + esc(cm.cond) + '</b><div class="muted" style="font-size:12.5px">Hẹn ngày ' + U.ddmmyyyy(cm.date) + ' · ' + esc(cm.by) + '</div>' + relTags(rm, 'cm-' + cm.id) + '</div><div style="font-size:13px;text-align:right">' + (rd < 0 ? 'Đã quá hẹn ' + (-rd) + ' ngày' : 'Xem lại ngày ' + U.ddmm(cm.reviewDate) + ' (còn ' + rd + ' ngày)') + (rd >= 0 && rd <= S.TH.cutNear ? ' <span class="pill lv2">Sắp chạm</span>' : '') + '</div></div>';
      return;
    }
    var x = c.holdings.filter(function (y) { return y.t === cm.t; })[0], p = x ? U.priceOf(x) : null;
    var line = '', track = '';
    if (p != null && cm.status === 'active') {
      var lo, hi, near = false;
      if (cm.type === 'cutloss') { lo = cm.level; hi = Math.max(x.cost, p * 1.05); var d = (p - cm.level) / p * 100; near = d <= S.TH.cutNear; line = d <= 0 ? 'Đã chạm mức cắt lỗ' : 'Còn ' + U.pct(d) + ' tới mức cắt lỗ'; }
      else { lo = x.cost; hi = Math.max(cm.level, p); var d2 = (cm.level - p) / p * 100; near = d2 <= S.TH.cutNear; line = d2 <= 0 ? 'Đã chạm giá mục tiêu' : 'Còn ' + U.pct(d2) + ' tới giá mục tiêu'; }
      var pos = Math.max(0, Math.min(100, (p - lo) / (hi - lo) * 100));
      track = '<div class="track"><i style="width:' + pos + '%"></i><span class="pt" style="left:' + pos + '%"></span>' +
        '<span class="l" style="left:0">' + (cm.type === 'cutloss' ? 'Cắt lỗ ' + U.fmt(cm.level) : 'Giá mua ' + U.fmt(lo)) + '</span>' +
        '<span class="l" style="left:' + Math.min(pos, 70) + '%;transform:translateX(-30%);top:-18px">Giá nay ' + U.fmt(p) + '</span>' +
        '<span class="l" style="right:0">' + (cm.type === 'cutloss' ? 'Giá mua ' + U.fmt(x.cost) : 'Mục tiêu ' + U.fmt(cm.level)) + '</span></div>';
      line = esc(line) + (near ? ' <span class="pill lv2">Sắp chạm</span>' : '');
    }
    h += '<div class="cm hl' + (cm.status !== 'active' ? ' replaced' : '') + '" id="r-cm-' + cm.id + '"><div><b>' + (cm.type === 'cutloss' ? 'Điểm cắt lỗ ' : 'Giá mục tiêu ') + cm.t + ': ' + U.fmt(cm.level) + '</b>' + (cm.status !== 'active' ? ' <span class="tag">Đã thay bằng cam kết mới</span>' : '') +
      '<div class="muted" style="font-size:12.5px">Hẹn ngày ' + U.ddmmyyyy(cm.date) + ' · ' + esc(cm.by) + (cm.note ? ' · ' + esc(cm.note) : '') + '</div>' + relTags(rm, 'cm-' + cm.id) + '</div><div style="font-size:13px;text-align:right">' + line + '</div>' + track + '</div>';
  });
  h += '</section><section class="block"><h3>Việc đang mở</h3>';
  var tasks = c.tasks.filter(function (t) { return !t.done || (t.doneAt && U.dayDiff(t.doneAt, S.TODAY) <= 7); });
  if (!tasks.length) h += '<p class="muted" style="margin:0">Không có sự kiện đã lên lịch hay việc đã hứa nào đang mở.</p>';
  tasks.sort(function (a, b) { return a.due < b.due ? -1 : 1; }).forEach(function (t) {
    var od = U.dayDiff(t.due, S.TODAY), over = !t.done && t.due.slice(0, 10) < S.TODAY;
    h += '<div class="task hl' + (over ? ' over' : '') + (t.done ? ' done' : '') + '" id="r-task-' + t.id + '"><div><div class="t">' + esc(t.title) + '</div><div class="when muted" style="font-size:12.5px">' +
      (t.done ? 'Đã xong ' + U.ddmm(t.doneAt) : over ? 'Quá hạn ' + od + ' ngày (hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due) + ')' : 'Hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due)) + ' · ' + esc(t.channel) + '</div>' + relTags(rm, 'task-' + t.id) + '</div>' +
      (t.done ? '' : '<button class="btn sm" data-d="logtask" data-id="' + t.id + '">Ghi nhận</button>') + '</div>';
  });
  h += '</section></div>';
  var items = [];
  c.events.forEach(function (ev) { items.push({ at: ev.at, kind: 'ev', ev: ev }); });
  c.acct.forEach(function (a) { items.push({ at: a.at, kind: 'acct', a: a }); });
  c.unlogged.forEach(function (u) { items.push({ at: u.at, kind: 'un', u: u }); });
  items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  var f = state.tl;
  var shown = items.filter(function (it) {
    if (it.kind === 'acct') return !f.ch && !f.res;
    if (it.kind === 'un') return (!f.ch || f.ch === it.u.dir) && !f.res;
    return (!f.ch || it.ev.channel === f.ch) && (!f.res || it.ev.result === f.res);
  });
  var n90 = c.events.filter(function (ev) { return U.dayDiff(ev.at, S.TODAY) <= 90 && ev.result !== 'Đã lên lịch'; }).length;
  function opt(v, cur2) { return '<option' + (v === cur2 ? ' selected' : '') + ' value="' + v + '">' + (v || 'Tất cả') + '</option>'; }
  h += '<section class="block"><h3>Dòng thời gian <span class="stamp">90 ngày qua: ' + n90 + ' lần liên hệ</span></h3>' +
    '<div class="tlfilters"><label>Kênh <select id="tl-ch">' + ['', 'Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp'].map(function (v) { return opt(v, f.ch); }).join('') + '</select></label>' +
    '<label>Trạng thái <select id="tl-res">' + ['', 'Đã lên lịch', 'Hoàn thành', 'Không liên lạc được', 'Dời lịch', 'Hủy'].map(function (v) { return opt(v, f.res); }).join('') + '</select></label></div><ul class="tl">';
  if (!shown.length) h += '<li><span></span><span class="muted">Không có mục nào.</span></li>';
  shown.forEach(function (it) {
    var when = U.ddmmyyyy(it.at) + '<br>' + U.hhmm(it.at);
    if (it.kind === 'acct') h += '<li><span class="when">' + when + '</span><div class="acct"><b>Tài khoản:</b> ' + esc(it.a.text) + '</div></li>';
    else if (it.kind === 'un') h += '<li><span class="when">' + when + '</span><div class="unlogged"><span>' + esc(it.u.dir) + ' · ' + esc(it.u.dur) + ' · ghi âm ' + esc(it.u.rec) + ' — <b>Chưa ghi nhận nội dung</b></span><button class="btn sm" data-d="logun" data-id="' + it.u.id + '">Ghi nhận</button></div></li>';
    else {
      var ev = it.ev, cls = ev.result === 'Hoàn thành' ? 'ok' : ev.result === 'Đã lên lịch' ? 'sch' : ev.result === 'Dời lịch' ? '' : 'bad';
      h += '<li class="hl" id="r-ev-' + ev.id + '"><span class="when">' + when + '</span><div><div class="line1"><span class="tag">' + esc(ev.channel) + '</span><b>' + esc(ev.broker) + '</b><span class="muted">' + esc(ev.purpose) + '</span><span class="res-x ' + cls + '">' + esc(ev.result) + '</span>' + relTags(rm, 'ev-' + ev.id) + '</div>' +
        (ev.note ? '<div>' + esc(ev.note) + '</div>' : '') +
        (ev.outcome && ev.outcome !== ev.note ? '<div class="muted">Kết quả: ' + esc(ev.outcome) + '</div>' : '') +
        (ev.decision ? '<div class="muted">Kết quả: ' + esc(ev.decision) + '</div>' : '') +
        (ev.reason ? '<div class="muted">Lí do: ' + esc(ev.reason) + (ev.attempts ? ' · gọi ' + ev.attempts + ' lần' : '') + '</div>' : '') +
        (ev.issueTitle ? '<div class="muted">Xử lý vấn đề: ' + esc(ev.issueTitle) + (ev.option ? ' · phương án khách chọn: ' + esc(ev.option) : '') + '</div>' : '') +
        (ev.rec ? '<div class="muted">Mã ghi âm: <span class="mono">' + esc(ev.rec) + '</span>' + (ev.risk ? ' · đã cảnh báo rủi ro' : '') + '</div>' : '') + '</div></li>';
    }
  });
  h += '</ul></section>';
  return h;
}

function jump(tab, row) {
  state.tab[cur.id] = tab; renderDetail(cur);
  var el = document.getElementById('r-' + row) || document.getElementById(row);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  var target = el.tagName === 'TR' ? el : el;
  target.classList.remove('flash'); void target.offsetWidth;
  if (el.tagName === 'TR') { el.classList.add('flashrow'); setTimeout(function () { el.classList.remove('flashrow'); }, 1700); }
  else target.classList.add('flash');
}
function jumpIssue(id) {
  state.tab[cur.id] = 'issues'; renderDetail(cur);
  var el = document.getElementById('is-' + id); if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}

function findIssue(id) { return X.EV[cur.id].issues.filter(function (i) { return i.id === id; })[0]; }

view.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-d]'); if (!t || !cur || !view.contains(t)) return;
  var d = t.getAttribute('data-d'), id = t.getAttribute('data-id');
  if (d === 'tab') { state.tab[cur.id] = t.getAttribute('data-tab'); renderDetail(cur); }
  else if (d === 'reveal') { state.revealed[cur.id] = true; renderDetail(cur); X.toast('Đã ghi nhật ký: Chị Lan xem số điện thoại của ' + cur.name + ' lúc ' + X.nowHM() + '.'); }
  else if (d === 'ev') jump(t.getAttribute('data-tab'), t.getAttribute('data-row'));
  else if (d === 'issue' && id) jumpIssue(id);
  else if (d === 'sol') openSolutions(findIssue(id));
  else if (d === 'log') openLog({ issueId: id || null });
  else if (d === 'logtask') openLog({ taskId: id });
  else if (d === 'logun') openLog({ unloggedId: id });
  else if (d === 'copy') {
    var txt = document.getElementById('opener').textContent;
    var done = function () { X.toast('Đã chép câu mở đầu.'); };
    try { navigator.clipboard.writeText(txt).then(done, function () { selectText(); }); } catch (e) { selectText(); }
  }
});
function selectText() { var r = document.createRange(); r.selectNodeContents(document.getElementById('opener')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); X.toast('Đã chọn sẵn câu, bấm Ctrl/⌘ + C để chép.'); }
view.addEventListener('change', function (ev) {
  if (ev.target.id === 'tl-ch') { state.tl.ch = ev.target.value; renderDetail(cur); }
  if (ev.target.id === 'tl-res') { state.tl.res = ev.target.value; renderDetail(cur); }
});

function openDrawer(html) { drawer.innerHTML = html; drawer.classList.add('open'); document.body.classList.add('has-drawer'); drawer.setAttribute('aria-hidden', 'false'); var f = drawer.querySelector('.x'); if (f) f.focus(); }
function closeDrawer() { drawer.classList.remove('open'); document.body.classList.remove('has-drawer'); drawer.setAttribute('aria-hidden', 'true'); }

var solCtx = null;
var LETTERS = ['A', 'B', 'C'];
function openSolutions(issue) {
  if (!issue) return;
  var c = cur, e = X.EV[c.id], m = e.m, res = S.solutions(c, issue, e);
  var picks = res.options.filter(function (o) { return o.kind === 'choose' || o.kind === 'order' || o.kind === 'action'; }).slice(0, 3);
  var locked = res.options.filter(function (o) { return o.kind === 'locked'; });
  var nothing = res.options.filter(function (o) { return o.kind === 'nothing'; })[0];
  solCtx = { issue: issue, res: res, picks: picks };
  var h = '<div class="dhead"><div><div class="muted" style="font-size:12px">Giải pháp · ' + esc(c.name) + '</div><h2>' + esc(issue.title) + '</h2></div><button class="x" data-dd="close" aria-label="Đóng">×</button></div><div class="dbody"><form id="solf" novalidate>';
  h += '<div class="can"><span class="y">Được làm</span><span>' + esc(res.can.join(' · ') || '—') + '</span><span class="no">Bị chặn</span><span>' + esc(res.cannot.join(' · ') || 'Không có') + '</span></div>';
  if (res.ask) h += '<div class="box"><b style="font-size:13px">Câu nên hỏi khách</b><ol class="qs">' + res.ask.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol></div>';
  h += '<div class="field" id="fw-pick"><span class="flabel">Phương án khách chọn <span class="req">*</span></span>';
  picks.forEach(function (o, i) {
    h += '<label class="opt pick' + (o.unblock ? ' unblock' : '') + '"><h4><input type="radio" name="solpick" value="' + i + '"><span class="letter">' + LETTERS[i] + '</span>' + (o.unblock ? '<span class="pill lv1">Gỡ chặn trước</span>' : '') + esc(o.title) + (o.fit ? '<span class="fit' + (o.fit.ok ? '' : ' off') + '">' + esc(o.fit.text) + '</span>' : '') + '</h4>' +
      '<div class="rows">' + (o.rows || []).map(function (r) { return '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>'; }).join('') + '</div>' +
      (o.kind === 'order' ? '<div class="faint" style="font-size:12px">Có đặt lệnh: cần mã ghi âm và cảnh báo rủi ro trước khi Submit.</div>' : '') + '</label>';
  });
  h += '<label class="opt pick"><h4><input type="radio" name="solpick" value="custom"><span class="letter">' + String.fromCharCode(65 + picks.length) + '</span>Phương án khác (broker tự ghi)</h4>' +
    '<textarea id="sol-custom" rows="2" placeholder="Ghi lại điều đã chốt với khách"></textarea></label></div>';
  h += '<div class="box" id="sol-order" hidden><div class="field" id="fw-solrec"><label for="sol-rec">Mã ghi âm hoặc tin nhắn khách xác nhận <span class="req">*</span></label><input id="sol-rec" type="text" style="width:100%" placeholder="vd GA-20261104-0812"></div>' +
    '<div class="field" id="fw-solrisk" style="margin-bottom:0"><label class="check"><input type="checkbox" id="sol-risk"><span>Đã cảnh báo rủi ro <span class="req">*</span></span></label></div></div>';
  if (locked.length) h += '<div class="flabel" style="margin:4px 0 6px">Bị chặn (không chọn được)</div>' + locked.map(function (o) { return '<div class="opt locked"><h4>' + esc(o.title) + '</h4><div class="lockwhy">' + esc(o.lockReason) + '</div></div>'; }).join('');
  if (nothing) h += '<div class="opt locked"><h4>' + esc(nothing.title) + '</h4><div class="rows">' + nothing.rows.map(function (r) { return '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>'; }).join('') + '</div></div>';
  h += '<p class="faint" style="font-size:12px">Con số ước tính theo giá lúc 08:00 04/11, chỉ để minh hoạ. Broker quyết định và chịu trách nhiệm; khách tự chọn.</p></form></div>';
  h += '<div class="dfoot"><span class="formerr" id="formerr"></span><button class="btn" data-dd="close">Đóng</button><button class="btn primary" data-dd="solsubmit">Submit</button></div>';
  openDrawer(h);
}
function solPicked() { var r = drawer.querySelector('input[name=solpick]:checked'); return r ? r.value : ''; }
function syncSol() {
  var v = solPicked(), o = v && v !== 'custom' ? solCtx.picks[+v] : null;
  drawer.querySelector('#sol-order').hidden = !(o && o.kind === 'order');
}
function submitSolution() {
  clearErr();
  var c = cur, v = solPicked(), errs = [], text = '';
  function need(fid, ok) { if (!ok) { errs.push(fid); var w = drawer.querySelector('#fw-' + fid); if (w) w.classList.add('err'); } }
  need('pick', !!v);
  var o = v && v !== 'custom' ? solCtx.picks[+v] : null;
  if (v === 'custom') { text = drawer.querySelector('#sol-custom').value.trim(); need('pick', !!text); }
  else if (o) text = o.title;
  var isOrder = o && o.kind === 'order';
  if (isOrder) { need('solrec', !!drawer.querySelector('#sol-rec').value.trim()); need('solrisk', drawer.querySelector('#sol-risk').checked); }
  if (errs.length) { drawer.querySelector('#formerr').textContent = v === 'custom' && !text ? 'Hãy ghi điều đã chốt với khách.' : !v ? 'Hãy chọn một phương án.' : 'Còn thiếu ô bắt buộc (tô đỏ).'; return; }
  var before = X.EV[c.id].status, id = 'n' + Date.now();
  var evt = { id: id, at: S.TODAY + 'T' + X.nowHM(), channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Xử lý vấn đề', result: 'Hoàn thành', decision: 'Đồng ý',
    note: 'Khách chọn: ' + text, issueTitle: solCtx.issue.title, option: '' };
  if (isOrder) { evt.rec = drawer.querySelector('#sol-rec').value.trim(); evt.risk = true; }
  c.events.push(evt);
  X.reval(c);
  var after = X.EV[c.id].status;
  closeDrawer();
  state.tab[c.id] = 'history'; renderDetail(c);
  X.toast('Đã lưu phương án vào Lịch sử trao đổi.' + (after !== before ? ' Trạng thái khách đổi từ ' + S.LEVELS[before] + ' sang ' + S.LEVELS[after] + '.' : ''));
}

var logCtx = null;
var REASONS = {
  'Không liên lạc được': ['Không nghe máy', 'Máy bận', 'Thuê bao không liên lạc được', 'Sai số', 'Khác'],
  'Từ chối': ['Muốn chờ giá hồi', 'Không có tiền nộp thêm', 'Không đồng ý với phương án', 'Đã tự xử lý', 'Khác']
};
function openLog(o) {
  var c = cur, e = X.EV[c.id];
  logCtx = o || {};
  var task = o.taskId ? c.tasks.filter(function (t) { return t.id === o.taskId; })[0] : null;
  var un = o.unloggedId ? c.unlogged.filter(function (u) { return u.id === o.unloggedId; })[0] : null;
  logCtx.task = task; logCtx.un = un;
  var hm = X.nowHM();
  logCtx.autoRec = un ? un.rec : 'GA-' + S.TODAY.replace(/-/g, '') + '-' + hm.replace(':', '');
  var status = (o.option || task || un) ? 'Hoàn thành' : 'Đã lên lịch';
  var content = o.option ? 'Khách chọn: ' + o.option : task ? task.title : un ? un.dir + ' (' + un.dur + ')' : '';
  var issueId = o.issueId || (task && task.issueId) || '';
  function sel(id, vals, cur2, ph) { return '<select id="' + id + '" style="width:100%">' + (ph ? '<option value="">' + ph + '</option>' : '') + vals.map(function (v) { return '<option' + (v === cur2 ? ' selected' : '') + '>' + v + '</option>'; }).join('') + '</select>'; }
  var openMore = !!(o.order || o.issueId);
  var h = '<div class="dhead"><div><div class="muted" style="font-size:12px">Sự kiện hẹn và hỗ trợ khách · ' + esc(c.name) + '</div><h2>' + (task ? 'Ghi nhận: ' + esc(task.title) : un ? 'Ghi nhận cuộc gọi đến' : 'Tạo sự kiện') + '</h2></div><button class="x" data-dd="close" aria-label="Đóng">×</button></div><div class="dbody"><form id="logf" novalidate>';
  h += '<div class="field" id="fw-content"><label for="f-content">Nội dung <span class="req">*</span></label><textarea id="f-content" rows="2" placeholder="vd Gọi báo tài khoản bị call, khách chọn nộp thêm tiền">' + esc(content) + '</textarea></div>';
  h += '<div class="field" id="fw-time"><span class="flabel">Thời gian <span class="req">*</span></span><div class="row2"><input type="date" id="f-date" aria-label="Ngày"><input type="time" id="f-time" aria-label="Giờ"></div><div class="faint" id="f-timehint" style="font-size:12px;margin-top:3px"></div></div>';
  h += '<div class="row2"><div class="field" id="fw-status"><label for="f-status">Trạng thái <span class="req">*</span></label>' + sel('f-status', ['Đã lên lịch', 'Hoàn thành', 'Dời lịch', 'Hủy'], status) + '</div>' +
    '<div class="field" id="fw-result"><label for="f-result">Kết quả <span class="req" id="f-resreq">*</span></label>' + sel('f-result', ['Đồng ý', 'Cần suy nghĩ', 'Từ chối', 'Không liên lạc được'], o.option ? 'Đồng ý' : '', 'Chọn kết quả') + '</div></div>';
  h += '<div class="field" id="fw-reason" hidden><label for="f-reason">Lí do <span class="req">*</span></label><select id="f-reason" style="width:100%"></select><input id="f-reasonother" type="text" style="width:100%;margin-top:6px" placeholder="Ghi rõ lí do" hidden></div>';
  h += '<details class="box" id="f-more"' + (openMore ? ' open' : '') + '><summary style="cursor:pointer;font-size:13px;font-weight:600">Thêm chi tiết (không bắt buộc)</summary><div style="margin-top:10px">' +
    '<div class="row2"><div class="field"><label for="f-purpose">Mục đích sự kiện</label>' + sel('f-purpose', ['Xử lý vấn đề', 'Chăm sóc định kỳ', 'Trả lời yêu cầu của khách', 'Gửi thông tin đã hứa', 'Khác'], issueId ? 'Xử lý vấn đề' : task && task.channel === 'Zalo' ? 'Gửi thông tin đã hứa' : un ? 'Trả lời yêu cầu của khách' : 'Chăm sóc định kỳ') + '</div>' +
    '<div class="field"><label for="f-ch">Kênh</label>' + sel('f-ch', ['Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp'], un ? un.dir : task ? task.channel : 'Gọi đi') + '</div></div>' +
    (e.issues.length ? '<div class="field"><label for="f-issue">Vấn đề liên quan</label><select id="f-issue" style="width:100%"><option value="">Không gắn vấn đề</option>' + e.issues.map(function (i) { return '<option value="' + i.id + '"' + (i.id === issueId ? ' selected' : '') + '>' + esc(i.title) + '</option>'; }).join('') + '</select></div>' : '') +
    '<div class="field"><label class="check"><input type="checkbox" id="f-order"' + (o.order ? ' checked' : '') + '><span>Có khuyến nghị hoặc đặt lệnh</span></label><div id="f-orderwrap"' + (o.order ? '' : ' hidden') + ' style="margin-top:8px">' +
    '<div class="field" id="fw-rec"><label for="f-rec">Mã ghi âm hoặc tin nhắn khách xác nhận <span class="req">*</span></label><input id="f-rec" type="text" style="width:100%" value="' + esc(o.rec || logCtx.autoRec) + '"></div>' +
    '<div class="field" id="fw-risk" style="margin-bottom:0"><label class="check"><input type="checkbox" id="f-risk"><span>Đã cảnh báo rủi ro <span class="req">*</span></span></label></div></div></div>' +
    '<div class="field"><label class="check"><input type="checkbox" id="f-cm"><span>Khách đổi điểm cắt lỗ hoặc giá mục tiêu (ghi cam kết mới)</span></label><div id="f-cmwrap" hidden style="margin-top:8px"><div class="row2">' +
    '<select id="f-cmt" aria-label="Mã">' + c.holdings.map(function (x) { return '<option>' + x.t + '</option>'; }).join('') + '</select><select id="f-cmtype" aria-label="Loại"><option value="cutloss">Điểm cắt lỗ</option><option value="target">Giá mục tiêu</option></select></div>' +
    '<div class="field" id="fw-cmlevel" style="margin:6px 0 0"><input id="f-cmlevel" type="number" min="0" step="100" style="width:100%" placeholder="Mức giá mới, vd 105000"></div></div></div>' +
    '<div class="field"><label for="f-labels">Nhãn giao tiếp</label><input id="f-labels" type="text" style="width:100%" value="' + esc(c.labels.join(', ')) + '" placeholder="Mô tả cách nói chuyện, không chê con người">' +
    '<div class="sugg">' + ['Thích nghe số cụ thể', 'Ngắn gọn, đi thẳng vào việc', 'Thích gặp trực tiếp', 'Cần thời gian suy nghĩ'].map(function (s) { return '<button type="button" data-dd="sugg">' + s + '</button>'; }).join('') + '</div></div>' +
    '<div class="field" style="margin-bottom:0"><label for="f-pref">Ưu tiên liên hệ (kênh, giờ)</label><input id="f-pref" type="text" style="width:100%" value="' + esc(c.pref) + '"></div>' +
    '</div></details>';
  h += '<div class="auto">Tự điền từ tổng đài: kênh, giờ gọi, mã ghi âm (<span class="mono">' + esc(logCtx.autoRec) + '</span>)' + (o.option ? ' · phương án khách chọn: ' + esc(o.option) : '') + '</div>';
  h += '</form></div><div class="dfoot"><span class="formerr" id="formerr"></span><button class="btn" data-dd="close">Hủy</button><button class="btn primary" data-dd="save">Lưu</button></div>';
  openDrawer(h);
  logCtx.timeTouched = false;
  if (un) { drawer.querySelector('#f-date').value = un.at.slice(0, 10); drawer.querySelector('#f-time').value = un.at.slice(11, 16); logCtx.timeTouched = true; }
  syncForm();
}

function syncForm() {
  var st = drawer.querySelector('#f-status').value, resEl = drawer.querySelector('#f-result'), res = resEl.value;
  var done = st === 'Hoàn thành';
  resEl.disabled = !done; if (!done) { resEl.value = ''; res = ''; }
  drawer.querySelector('#f-resreq').hidden = !done;
  drawer.querySelector('#fw-result').title = done ? '' : 'Chỉ chọn kết quả khi trạng thái là Hoàn thành';
  var hint = { 'Đã lên lịch': 'Giờ hẹn liên hệ khách', 'Hoàn thành': 'Giờ đã liên hệ', 'Dời lịch': 'Giờ hẹn mới', 'Hủy': 'Giờ huỷ' }[st];
  drawer.querySelector('#f-timehint').textContent = hint;
  if (!logCtx.timeTouched) {
    var future = st === 'Đã lên lịch' || st === 'Dời lịch';
    drawer.querySelector('#f-date').value = future ? U.addDays(S.TODAY, 1) : S.TODAY;
    drawer.querySelector('#f-time').value = future ? '09:00' : X.nowHM();
  }
  var fail = REASONS[res];
  var wrap = drawer.querySelector('#fw-reason'), rs = drawer.querySelector('#f-reason');
  if (fail) {
    if (wrap.hidden || rs.getAttribute('data-for') !== res) {
      rs.innerHTML = '<option value="">Chọn lí do</option>' + fail.map(function (v) { return '<option>' + v + '</option>'; }).join('');
      rs.setAttribute('data-for', res);
      drawer.querySelector('#f-reasonother').hidden = true;
    }
    wrap.hidden = false;
  } else { wrap.hidden = true; }
}

drawer.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.name === 'solpick') { clearErr(); syncSol(); }
  if (t.id === 'f-status' || t.id === 'f-result') { clearErr(); syncForm(); }
  if (t.id === 'f-date' || t.id === 'f-time') logCtx.timeTouched = true;
  if (t.id === 'f-reason') drawer.querySelector('#f-reasonother').hidden = t.value !== 'Khác';
  if (t.id === 'f-order') drawer.querySelector('#f-orderwrap').hidden = !t.checked;
  if (t.id === 'f-cm') drawer.querySelector('#f-cmwrap').hidden = !t.checked;
});
drawer.addEventListener('input', function (ev) {
  var i = ev.target.getAttribute('data-rec');
  if (i != null) drawer.querySelector('[data-dd=order][data-i="' + i + '"]').disabled = !ev.target.value.trim();
});
drawer.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-dd]'); if (!t) return;
  var d = t.getAttribute('data-dd');
  if (d === 'close') closeDrawer();
  else if (d === 'logfrom') openLog({ issueId: solCtx.issue.id });
  else if (d === 'choose') {
    var o = solCtx.res.options[+t.getAttribute('data-i')];
    if (o.kind === 'action') X.toast('Bản mẫu: không gửi thật. Hãy lưu sự kiện.');
    openLog({ issueId: solCtx.issue.id, option: o.title });
  } else if (d === 'order') {
    var i = +t.getAttribute('data-i'), o2 = solCtx.res.options[i];
    openLog({ issueId: solCtx.issue.id, option: o2.title, order: true, rec: drawer.querySelector('#rec-' + i).value.trim() });
  } else if (d === 'sugg') {
    var inp = drawer.querySelector('#f-labels'), v = inp.value.trim();
    if (v.split(/\s*,\s*/).indexOf(t.textContent) < 0) inp.value = v ? v + ', ' + t.textContent : t.textContent;
  } else if (d === 'save') save();
  else if (d === 'solsubmit') submitSolution();
});

function clearErr() { Array.prototype.forEach.call(drawer.querySelectorAll('.field.err'), function (f) { f.classList.remove('err'); }); var fe = drawer.querySelector('#formerr'); if (fe) fe.textContent = ''; }
function save() {
  clearErr();
  var c = cur, errs = [];
  function val(id) { var el = drawer.querySelector('#' + id); return el ? el.value.trim() : ''; }
  function need(fid, ok) { if (!ok) { errs.push(fid); var w = drawer.querySelector('#fw-' + fid); if (w) w.classList.add('err'); } }
  var st = val('f-status'), res = val('f-result');
  need('content', !!val('f-content')); need('time', val('f-date') && val('f-time')); need('status', !!st);
  if (st === 'Hoàn thành') need('result', !!res);
  var reason = '';
  if (REASONS[res]) { reason = val('f-reason') === 'Khác' ? val('f-reasonother') : val('f-reason'); need('reason', !!reason); }
  var order = drawer.querySelector('#f-order'), cmBox = drawer.querySelector('#f-cm');
  if (order.checked) { need('rec', !!val('f-rec')); need('risk', drawer.querySelector('#f-risk').checked); }
  if (cmBox.checked) need('cmlevel', +val('f-cmlevel') > 0);
  if (errs.length) {
    if (errs.some(function (f) { return ['rec', 'risk', 'cmlevel'].indexOf(f) >= 0; })) drawer.querySelector('#f-more').open = true;
    drawer.querySelector('#formerr').textContent = 'Còn thiếu ' + errs.length + ' ô bắt buộc (tô đỏ).'; return;
  }
  var e0 = X.EV[c.id], before = e0.status, id = 'n' + Date.now(), ch = val('f-ch');
  var at = val('f-date') + 'T' + val('f-time');
  var issue = e0.issues.filter(function (i) { return i.id === val('f-issue'); })[0];
  var result = st === 'Hoàn thành' && res === 'Không liên lạc được' ? 'Không liên lạc được' : st;
  var evt = { id: id, at: st === 'Đã lên lịch' || st === 'Dời lịch' ? S.TODAY + 'T' + X.nowHM() : at, channel: ch, broker: 'Chị Lan', purpose: val('f-purpose'), result: result, note: val('f-content'),
    issueTitle: issue ? issue.title : '', option: logCtx.option || '' };
  if (st === 'Hoàn thành' && res !== 'Không liên lạc được') evt.decision = res;
  if (reason) evt.reason = reason;
  if (order.checked) { evt.rec = val('f-rec'); evt.risk = true; }
  if (st === 'Đã lên lịch') evt.note = evt.note + ' — hẹn ' + U.hhmm(at) + ' ' + U.ddmm(at);
  if (st === 'Dời lịch') evt.note = evt.note + ' — dời sang ' + U.hhmm(at) + ' ' + U.ddmm(at);
  c.events.push(evt);
  var task = logCtx.task;
  if (st === 'Đã lên lịch') c.tasks.push({ id: 't' + id, title: val('f-content'), due: at, channel: ch, done: false });
  if (st === 'Dời lịch') { if (task) task.due = at; else c.tasks.push({ id: 't' + id, title: val('f-content'), due: at, channel: ch, done: false }); }
  if (task && (st === 'Hủy' || (st === 'Hoàn thành' && res !== 'Không liên lạc được'))) { task.done = true; task.doneAt = S.TODAY; }
  if (logCtx.un) c.unlogged = c.unlogged.filter(function (u) { return u !== logCtx.un; });
  if (cmBox.checked) {
    var tk = val('f-cmt'), ty = val('f-cmtype');
    c.commitments.forEach(function (x) { if (x.t === tk && x.type === ty && x.status === 'active') x.status = 'replaced'; });
    c.commitments.push({ id: 'cm' + id, type: ty, t: tk, level: +val('f-cmlevel'), date: S.TODAY, by: 'Chị Lan', status: 'active', note: val('f-content') });
  }
  c.labels = val('f-labels') ? val('f-labels').split(/\s*,\s*/).filter(Boolean) : [];
  c.pref = val('f-pref');
  X.reval(c);
  var after = X.EV[c.id].status;
  closeDrawer();
  state.tab[c.id] = 'history'; renderDetail(c);
  X.toast('Đã lưu sự kiện vào Lịch sử trao đổi.' + (after !== before ? ' Trạng thái khách đổi từ ' + S.LEVELS[before] + ' sang ' + S.LEVELS[after] + '.' : ' Trạng thái khách: ' + S.LEVELS[after] + '.'));
}

X.renderDetail = renderDetail;
X.closeDrawer = closeDrawer;
X.route();
})();
