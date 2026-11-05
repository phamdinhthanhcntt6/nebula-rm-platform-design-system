(function (root) {
'use strict';

var TODAY = '2026-11-04';
var TH = {
  force: 30, call: 35, warn1: 40, safe: 45,
  cutNear: 3, sector: 40, eventDays: 7, longLossPct: 20, longLossDays: 30,
  idSoon: 30, idUrgent: 3, surveyDays: 365, surveySoon: 30,
  bigMove: 10, moveDays: 7, idlePct: 30, idleDays: 14, tradeDrop: 50,
  contact: { 'VIP': 14, 'Thân thiết': 30, 'Phổ thông': 45 }, overdueHigh: 2
};
var LEVELS = ['Khẩn', 'Cao', 'Cần chú ý', 'Chưa đủ dữ liệu', 'Ổn'];
var CATS = {
  1: { q: 'Tài khoản có an toàn không?', ok: 'Tài khoản an toàn', short: 'Tài khoản' },
  2: { q: 'Danh mục có đi đúng điều đã thống nhất không?', ok: 'Danh mục đúng cam kết', short: 'Danh mục' },
  3: { q: 'Khách có đang hoặc sắp bị chặn việc gì không?', ok: 'Hồ sơ còn hạn', short: 'Hồ sơ' },
  4: { q: 'Khách có thay đổi bất thường không?', ok: 'Dòng tiền bình thường', short: 'Dòng tiền' },
  5: { q: 'Mình có đang bỏ quên khách không?', ok: 'Liên hệ đều đặn', short: 'Liên hệ' }
};

var TK = {
  VPB: { s: 'Ngân hàng', p: 19500 }, ACB: { s: 'Ngân hàng', p: 24000 }, VCB: { s: 'Ngân hàng', p: 61000 },
  TCB: { s: 'Ngân hàng', p: 23500 }, MBB: { s: 'Ngân hàng', p: 22800 },
  HPG: { s: 'Thép', p: 26500 }, HSG: { s: 'Thép', p: 17200 },
  FPT: { s: 'Công nghệ', p: 110500 }, MWG: { s: 'Bán lẻ', p: 62000 }, PNJ: { s: 'Bán lẻ', p: 88000 },
  VHM: { s: 'Bất động sản', p: 40000 }, KDH: { s: 'Bất động sản', p: 31000 },
  GAS: { s: 'Dầu khí', p: 68000 }, PVS: { s: 'Dầu khí', p: 33500 },
  VNM: { s: 'Thực phẩm', p: 62500 }, MSN: { s: 'Thực phẩm', p: 74000 },
  SSI: { s: 'Chứng khoán', p: 25800 }, VND: { s: 'Chứng khoán', p: 15600 },
  DGC: { s: 'Hoá chất', p: 98000 }, REE: { s: 'Điện', p: 64000 }, POW: { s: 'Điện', p: 12300 },
  GMD: { s: 'Cảng biển', p: 52000 }, VJC: { s: 'Hàng không', p: 98500 }
};
var CYCLE = { 'Ngân hàng': 'Tài chính', 'Chứng khoán': 'Tài chính', 'Thép': 'Nguyên vật liệu', 'Hoá chất': 'Nguyên vật liệu', 'Dầu khí': 'Năng lượng', 'Điện': 'Năng lượng' };
var CORP = {
  HPG: { date: '2026-11-08', text: 'Chốt quyền nhận cổ tức tiền mặt 1.000 đ/cổ phiếu' },
  FPT: { date: '2026-11-15', text: 'Chốt quyền nhận cổ tức tiền mặt 2.000 đ/cổ phiếu' },
  VNM: { date: '2026-11-20', text: 'Họp cổ đông bất thường' }
};

function toUTC(s) { var a = s.slice(0, 10).split('-'); return Date.UTC(+a[0], +a[1] - 1, +a[2]); }
function dayDiff(a, b) { return Math.round((toUTC(b) - toUTC(a)) / 864e5); }
function addDays(s, n) { return new Date(toUTC(s) + n * 864e5).toISOString().slice(0, 10); }
function ddmm(s) { return s.slice(8, 10) + '/' + s.slice(5, 7); }
function ddmmyyyy(s) { return ddmm(s) + '/' + s.slice(0, 4); }
function hhmm(s) { return s && s.length > 10 ? s.slice(11, 16) : ''; }
function fmt(n, d) { return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d || 0, minimumFractionDigits: 0 }).format(n); }
function money(tr) {
  if (tr == null || isNaN(tr)) return '—';
  return Math.abs(tr) >= 1000 ? fmt(tr / 1000, 2) + ' tỷ' : fmt(Math.round(tr)) + ' tr';
}
function moneyLong(tr) {
  return Math.abs(tr) >= 1000 ? fmt(tr / 1000, 2) + ' tỷ đồng' : fmt(Math.round(tr)) + ' triệu đồng';
}
function pct(x, d) { return fmt(x, d == null ? 1 : d) + '%'; }
function priceOf(h) { return h.price === undefined ? TK[h.t].p : h.price; }
function val(h) { var p = priceOf(h); return p == null ? 0 : h.qty * p / 1e6; }
function sectorOf(t) { return TK[t] ? TK[t].s : 'Khác'; }

function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function metrics(c) {
  var A = 0, Aproj = 0, hasProj = false, projDate = null, projTicker = null;
  c.holdings.forEach(function (h) {
    var v = val(h); A += v;
    if (h.loan && dayDiff(TODAY, h.loan.date) >= 0) {
      Aproj += v * h.loan.to / h.loan.from; hasProj = true; projDate = h.loan.date; projTicker = h;
    } else Aproj += v;
  });
  var debt = c.margin ? c.margin.debt : 0;
  var nav = c.cash + A - debt;
  var ratio = c.margin && !c.margin.dataMissing ? (A - debt) / A * 100 : null;
  var proj = c.margin && !c.margin.dataMissing && hasProj ? (Aproj - debt) / Aproj * 100 : null;
  var buying = c.margin ? Math.max(0, c.cash + (ratio != null && ratio > TH.safe ? (A * (1 - TH.safe / 100) - debt) : 0)) : c.cash;
  return { A: A, Aproj: Aproj, debt: debt, nav: nav, ratio: ratio, proj: proj, projDate: projDate, projTicker: projTicker, buying: buying };
}

function lastContact(c) {
  var best = null;
  c.events.forEach(function (e) { if (e.result === 'Hoàn thành' && (!best || e.at > best.at)) best = e; });
  return best;
}
function address(c) { return c.addr || (c.g === 'f' ? 'chị' : 'anh'); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function shortName(c) { var p = c.name.split(' '); return p[p.length - 1]; }
function callName(c) { return cap(address(c)) + ' ' + shortName(c); }

function evaluate(c) {
  var m = metrics(c), out = [], noData = [], blocks = [];
  var a = address(c), N = callName(c);
  function add(o) { o.id = c.id + '-' + o.code + (o.key ? '-' + o.key : ''); out.push(o); return o; }

  if (c.margin) {
    if (c.margin.dataMissing) {
      noData.push({ cat: 1, reason: 'Khách có vay ký quỹ nhưng hôm nay chưa nhận được số liệu ký quỹ (lần cuối nhận: ' + ddmm(c.margin.lastData) + ').' });
    } else {
      var r = m.ratio, ev = [{ label: 'Tỷ lệ ký quỹ ' + pct(r), tab: 'overview', row: 'acct-ratio' }, { label: 'Tiền đang nợ ' + money(m.debt), tab: 'overview', row: 'acct-debt' }];
      var big = c.holdings.slice().sort(function (x, y) { return val(y) - val(x); })[0];
      if (big) ev.push({ label: big.t + ' chiếm ' + pct(val(big) / m.A * 100, 0), tab: 'overview', row: 'h-' + big.t });
      if (r < TH.force) {
        add({ cat: 1, code: 'V-11', level: 0, title: 'Sắp bị bán giải chấp', short: 'Tỷ lệ ký quỹ ' + pct(r) + ', dưới mức bán giải chấp ' + TH.force + '%',
          due: { date: TODAY, time: '14:30' }, why: 'Tỷ lệ ký quỹ đang ' + pct(r) + ', đã xuống dưới mức ' + TH.force + '%. Theo quy định, công ty sẽ tự bán cổ phiếu của khách để thu nợ.',
          then: 'Sau 14:30 hôm nay công ty tự bán cổ phiếu, thường ở giá xấu. Khách mất quyền chọn bán mã nào.',
          fix: 'Nộp thêm tiền hoặc bán bớt cổ phiếu ngay để đưa tỷ lệ về trên ' + TH.call + '%, tốt nhất là ' + TH.safe + '%.', evidence: ev, sol: 'margin',
          opener: N + ', tỷ lệ ký quỹ của ' + a + ' đang ' + pct(r) + ', dưới mức bán giải chấp ' + TH.force + '%. Sau 14:30 hôm nay công ty sẽ tự bán. Em đã tính sẵn cách để xử lý ngay.' });
        blocks.push({ state: 'now', what: 'Mua thêm, vay thêm', code: 'V-11' }); blocks.push({ state: 'will', what: 'Bán giải chấp sau 14:30 hôm nay', code: 'V-11' });
      } else if (r < TH.call) {
        var due = c.margin.callDate ? addDays(c.margin.callDate, 2) : addDays(TODAY, 2);
        add({ cat: 1, code: 'V-12', level: 0, title: 'Đang bị call ký quỹ', short: 'Tỷ lệ ký quỹ ' + pct(r, 0) + ', đang bị call',
          due: { date: due }, why: 'Tỷ lệ ký quỹ đang ' + pct(r, 0) + ', dưới mức call ' + TH.call + '%. Khách phải nộp thêm tiền hoặc bán bớt trước hạn.',
          then: 'Hết ngày ' + ddmm(due) + ' chưa đưa tỷ lệ lên trên ' + TH.call + '% thì công ty bán giải chấp. Trong lúc bị call, khách không được mua thêm.',
          fix: 'Nộp thêm tiền hoặc bán bớt cổ phiếu để tỷ lệ về ' + TH.safe + '%.', evidence: ev, sol: 'margin',
          opener: N + ', tỷ lệ ký quỹ của ' + a + ' đang ' + pct(r, 0) + ', dưới mức call ' + TH.call + '%. Hạn nộp bù là ' + ddmm(due) + '. Em đã tính sẵn hai cách để đưa về ' + TH.safe + '%.' });
        blocks.push({ state: 'now', what: 'Mua thêm, vay thêm', code: 'V-12' }); blocks.push({ state: 'will', what: 'Bán giải chấp nếu tới ' + ddmm(due) + ' chưa nộp đủ', code: 'V-12' });
      } else if (m.proj != null && m.proj < TH.call) {
        var h = m.projTicker;
        ev.unshift({ label: h.t + ': tỷ lệ cho vay ' + h.loan.from + '% → ' + h.loan.to + '% từ ' + ddmm(h.loan.date), tab: 'overview', row: 'h-' + h.t });
        add({ cat: 1, code: 'V-13', level: 0, title: 'Sắp bị call từ ' + ddmm(m.projDate), short: 'Dự kiến tỷ lệ ' + pct(m.proj, 0) + ' từ ' + ddmm(m.projDate) + ' (' + h.t + ' bị hạ tỷ lệ cho vay)',
          due: { date: m.projDate }, why: 'Tỷ lệ hiện ' + pct(r, 0) + '. ' + h.t + ' chiếm ' + pct(val(h) / m.A * 100, 0) + ' tài sản và từ ' + ddmm(h.loan.date) + ' chỉ được vay ' + h.loan.to + '% thay vì ' + h.loan.from + '%, nên tỷ lệ dự kiến còn ' + pct(m.proj, 0) + '.',
          then: 'Từ ' + ddmm(m.projDate) + ' tài khoản bị call; nếu không xử lý kịp có thể bị bán giải chấp.',
          fix: 'Trước ' + ddmm(m.projDate) + ': nộp thêm tiền hoặc bán bớt để tỷ lệ dự kiến về ' + TH.safe + '%.', evidence: ev, sol: 'margin', projected: true,
          opener: N + ' ơi, từ ' + ddmm(m.projDate) + ' công ty hạ tỷ lệ cho vay ' + h.t + ', tài khoản của ' + a + ' sẽ xuống khoảng ' + pct(m.proj, 0) + ', dưới mức call. Em gọi để mình xử lý trước.' });
        blocks.push({ state: 'will', what: 'Bị call từ ' + ddmm(m.projDate) + ', có thể bị giải chấp', code: 'V-13' }); blocks.push({ state: 'soon', what: 'Mua thêm (từ ' + ddmm(m.projDate) + ')', code: 'V-13' });
        blocks.push({ state: 'now', what: 'Vay thêm', code: 'V-13' });
      } else if (r < TH.safe) {
        var drop = (1 - m.debt / ((1 - TH.call / 100) * m.A)) * 100;
        add({ cat: 1, code: r < TH.warn1 ? 'V-14' : 'V-15', level: r < TH.warn1 ? 1 : 2, title: r < TH.warn1 ? 'Sát mức call' : 'Tỷ lệ ký quỹ thấp',
          short: 'Tỷ lệ ký quỹ ' + pct(r, 0) + ', giá giảm thêm ' + pct(drop, 0) + ' là bị call', due: null,
          why: 'Tỷ lệ đang ' + pct(r, 0) + '. Nếu giá danh mục giảm thêm khoảng ' + pct(drop, 0) + ' thì xuống dưới ' + TH.call + '%.',
          then: 'Giá giảm tiếp thì bị call. Đang dưới ' + TH.safe + '% nên không được vay thêm.',
          fix: 'Cân nhắc nộp thêm hoặc bán bớt để về ' + TH.safe + '%.', evidence: ev, sol: 'margin',
          opener: N + ', tỷ lệ ký quỹ của ' + a + ' đang ' + pct(r, 0) + ', giá giảm thêm khoảng ' + pct(drop, 0) + ' là bị call. Mình bàn cách giữ an toàn nhé.' });
        blocks.push({ state: 'now', what: 'Vay thêm', code: r < TH.warn1 ? 'V-14' : 'V-15' });
      }
    }
  }

  var missingPrice = c.holdings.filter(function (h) { return priceOf(h) == null; });
  if (missingPrice.length) noData.push({ cat: 2, reason: 'Chưa có giá hôm nay của ' + missingPrice.map(function (h) { return h.t; }).join(', ') + '.' });
  else {
    c.commitments.filter(function (x) { return x.status === 'active'; }).forEach(function (cm) {
      var h = c.holdings.filter(function (x) { return x.t === cm.t; })[0]; if (!h && cm.type !== 'review') return; if (!h) h = c.holdings[0];
      var p = priceOf(h), evc = [{ label: 'Cam kết ngày ' + ddmm(cm.date), tab: 'history', row: 'cm-' + cm.id }, { label: cm.t + ' giá ' + fmt(p), tab: 'overview', row: 'h-' + cm.t }];
      if (cm.type === 'cutloss') {
        if (p <= cm.level) add({ cat: 2, code: 'V-21', key: cm.t, level: 1, title: cm.t + ' đã xuống tới điểm cắt lỗ đã hẹn', short: cm.t + ' ' + fmt(p) + ', đã chạm điểm cắt lỗ ' + fmt(cm.level),
          due: { date: TODAY }, why: 'Ngày ' + ddmm(cm.date) + ' hai bên hẹn bán ' + cm.t + ' nếu giá xuống ' + fmt(cm.level) + '. Giá hiện tại ' + fmt(p) + '.',
          then: 'Khách lỗ thêm nếu giá tiếp tục giảm, và thấy broker không giữ cam kết.', fix: 'Gọi khách, làm đúng như đã hẹn hoặc hẹn lại mức mới.', evidence: evc, sol: 'cutloss', cm: cm,
          opener: N + ', ' + cm.t + ' đã xuống dưới mức ' + fmt(cm.level) + ' mà mình thống nhất ngày ' + ddmm(cm.date) + '. Em gọi để mình làm đúng như đã hẹn.' });
        else {
          var d = (p - cm.level) / p * 100;
          if (d <= TH.cutNear) add({ cat: 2, code: 'V-22', key: cm.t, level: 2, title: cm.t + ' sắp tới điểm cắt lỗ', short: cm.t + ' còn ' + pct(d) + ' tới điểm cắt lỗ ' + fmt(cm.level),
            due: null, why: 'Ngày ' + ddmm(cm.date) + ' hai bên hẹn bán ' + cm.t + ' nếu giá xuống ' + fmt(cm.level) + '. Giá hiện tại ' + fmt(p) + ', chỉ còn cách ' + pct(d) + '.',
            then: 'Giá giảm thêm một phiên là chạm mức đã hẹn; nếu không chuẩn bị trước thì dễ lỡ.', fix: 'Gọi khách xác nhận lại: vẫn bán ở ' + fmt(cm.level) + ' hay hẹn mức mới.', evidence: evc, sol: 'cutloss', cm: cm,
            opener: N + ', ' + cm.t + ' đang ' + fmt(p) + ', còn khoảng ' + pct(d) + ' nữa là chạm mức ' + fmt(cm.level) + ' mình thống nhất ngày ' + ddmm(cm.date) + '. Em gọi để mình chuẩn bị trước.' });
        }
      } else if (cm.type === 'review') {
        var rd = dayDiff(TODAY, cm.reviewDate);
        if (rd <= TH.cutNear) add({ cat: 2, code: 'V-27', key: cm.id, level: rd < 0 ? 1 : 2, title: 'Đến hẹn xem lại: ' + cm.cond.toLowerCase(), short: (rd < 0 ? 'Quá hẹn xem lại ' + (-rd) + ' ngày: ' : 'Sắp tới hẹn xem lại (' + ddmm(cm.reviewDate) + '): ') + cm.cond.toLowerCase(),
          due: { date: cm.reviewDate }, why: 'Ngày ' + ddmm(cm.date) + ' hai bên hẹn: ' + cm.cond.toLowerCase() + ' vào ngày ' + ddmm(cm.reviewDate) + '.',
          then: 'Khách chờ broker gọi như đã hẹn; lỡ hẹn là thất hứa.', fix: 'Gọi khách xem lại như đã hẹn và ghi cam kết mới nếu có.', evidence: evc.slice(0, 1), sol: 'ask', ask: [cap(a) + ' muốn giữ nguyên hay điều chỉnh danh mục sau khi xem lại?'],
          opener: N + ', như đã hẹn ngày ' + ddmm(cm.date) + ', em gọi để mình ' + cm.cond.toLowerCase() + '.' });
      } else if (cm.type === 'target' && p >= cm.level) {
        add({ cat: 2, code: 'V-23', key: cm.t, level: 2, title: cm.t + ' đã lên tới giá mục tiêu', short: cm.t + ' ' + fmt(p) + ', đã chạm giá mục tiêu ' + fmt(cm.level),
          due: null, why: 'Khách đặt mục tiêu bán ' + cm.t + ' ở ' + fmt(cm.level) + ' (ngày ' + ddmm(cm.date) + '). Giá hiện tại ' + fmt(p) + '.',
          then: 'Giá có thể quay đầu; khách lỡ dịp chốt lãi như đã định.', fix: 'Hỏi khách muốn chốt lãi, chốt một phần hay đặt mục tiêu mới.', evidence: evc, sol: 'target', cm: cm,
          opener: N + ', ' + cm.t + ' đã lên ' + fmt(p) + ', đúng mức mục tiêu ' + a + ' đặt. ' + cap(a) + ' muốn chốt lãi hay giữ tiếp?' });
      }
    });
    var secs = {}; c.holdings.forEach(function (h) { secs[sectorOf(h.t)] = (secs[sectorOf(h.t)] || 0) + val(h); });
    var topS = Object.keys(secs).sort(function (x, y) { return secs[y] - secs[x]; })[0];
    var grp = {}; Object.keys(secs).forEach(function (s) { var gname = CYCLE[s]; if (gname) grp[gname] = (grp[gname] || 0) + secs[s]; });
    var topG = Object.keys(grp).sort(function (x, y) { return grp[y] - grp[x]; })[0];
    if (topS && m.A > 0 && secs[topS] / m.A * 100 <= TH.sector && topG && grp[topG] / m.A * 100 > TH.sector) {
      var gp = grp[topG] / m.A * 100, members = Object.keys(secs).filter(function (s) { return CYCLE[s] === topG; });
      add({ cat: 2, code: 'V-24', level: 2, title: 'Dồn nhiều tiền vào nhóm ngành ' + topG.toLowerCase(), short: 'Nhóm ' + topG.toLowerCase() + ' (' + members.join(', ').toLowerCase() + ') chiếm ' + pct(gp, 0) + ' danh mục',
        due: null, why: 'Các ngành ' + members.join(', ').toLowerCase() + ' thường lên xuống cùng nhau (cùng chu kỳ). Cộng lại chiếm ' + pct(gp, 0) + ' danh mục, vượt mức ' + TH.sector + '%.',
        then: 'Nhóm này giảm thì cả danh mục giảm theo mạnh.', fix: 'Bàn với khách giảm nhóm này về dưới ' + TH.sector + '%, hoặc ghi lại là khách chấp nhận rủi ro.',
        evidence: members.map(function (s) { return { label: 'Tỷ trọng ngành ' + s.toLowerCase(), tab: 'overview', row: 'sec-' + s }; }), sol: 'sector', sector: 'nhóm ' + topG, sectorValue: grp[topG],
        opener: N + ', các ngành ' + members.join(', ').toLowerCase() + ' đang chiếm ' + pct(gp, 0) + ' danh mục và thường lên xuống cùng nhau. Em muốn cùng ' + a + ' xem lại cho cân hơn.' });
    }
    if (topS && m.A > 0 && secs[topS] / m.A * 100 > TH.sector) {
      var sp = secs[topS] / m.A * 100;
      add({ cat: 2, code: 'V-24', level: 2, title: 'Dồn nhiều tiền vào ngành ' + topS.toLowerCase(), short: 'Ngành ' + topS.toLowerCase() + ' chiếm ' + pct(sp, 0) + ' danh mục',
        due: null, why: 'Ngành ' + topS.toLowerCase() + ' chiếm ' + pct(sp, 0) + ' giá trị danh mục, vượt mức ' + TH.sector + '%.',
        then: 'Ngành này giảm thì cả danh mục giảm theo mạnh.', fix: 'Bàn với khách giảm ngành này về dưới ' + TH.sector + '%, hoặc ghi lại là khách chấp nhận rủi ro.',
        evidence: [{ label: 'Tỷ trọng ngành ' + topS.toLowerCase(), tab: 'overview', row: 'sec-' + topS }], sol: 'sector', sector: topS, sectorValue: secs[topS],
        opener: N + ', ngành ' + topS.toLowerCase() + ' đang chiếm ' + pct(sp, 0) + ' danh mục. Em muốn cùng ' + a + ' xem lại cho cân hơn.' });
    }
    c.holdings.forEach(function (h) {
      var e = CORP[h.t]; if (!e) return; var dd = dayDiff(TODAY, e.date);
      if (dd >= 0 && dd <= TH.eventDays) add({ cat: 2, code: 'V-25', key: h.t, level: 2, title: h.t + ': ' + e.text.toLowerCase(), short: h.t + ' ' + e.text.toLowerCase() + ' ngày ' + ddmm(e.date),
        due: { date: e.date }, why: 'Khách đang giữ ' + fmt(h.qty) + ' cổ phiếu ' + h.t + '. Ngày ' + ddmm(e.date) + ': ' + e.text.toLowerCase() + '.',
        then: 'Khách không biết trước thì có thể bán nhầm trước ngày chốt quyền, hoặc bất ngờ khi giá điều chỉnh.', fix: 'Báo khách trước ngày ' + ddmm(e.date) + '.',
        evidence: [{ label: 'Sự kiện ' + h.t, tab: 'overview', row: 'cev-' + h.t }], sol: 'ask', ask: ['Anh/chị có định giữ ' + h.t + ' qua ngày chốt quyền không?', 'Anh/chị muốn nhận cổ tức bằng tiền về tài khoản này như mọi lần chứ?'],
        opener: N + ', ' + h.t + ' ' + e.text.toLowerCase() + ' ngày ' + ddmm(e.date) + '. Em gọi báo để ' + a + ' nắm trước.' });
    });
    c.holdings.forEach(function (h) {
      var p = priceOf(h), loss = (p - h.cost) / h.cost * 100;
      var hasCut = c.commitments.some(function (x) { return x.status === 'active' && x.t === h.t && x.type === 'cutloss'; });
      if (loss <= -TH.longLossPct && (h.lossDays || 0) > TH.longLossDays && !hasCut)
        add({ cat: 2, code: 'V-26', key: h.t, level: 2, title: h.t + ' lỗ ' + pct(-loss, 0) + ' đã hơn ' + h.lossDays + ' ngày', short: h.t + ' lỗ ' + pct(-loss, 0) + ', chưa hẹn điểm cắt lỗ',
          due: null, why: h.t + ' đang lỗ ' + pct(-loss, 0) + ' so với giá mua, kéo dài ' + h.lossDays + ' ngày, và chưa có điểm cắt lỗ nào được hẹn.',
          then: 'Khoản lỗ có thể lớn thêm mà không ai chủ động.', fix: 'Hẹn với khách một điểm cắt lỗ, hoặc quyết bán.', evidence: [{ label: h.t + ' lỗ ' + pct(-loss, 0), tab: 'overview', row: 'h-' + h.t }], sol: 'ask',
          ask: ['Anh/chị muốn giữ ' + h.t + ' tới mức nào thì bán?', 'Mình đặt một điểm cắt lỗ để chủ động nhé?'],
          opener: N + ', ' + h.t + ' đang lỗ ' + pct(-loss, 0) + ' đã hơn ' + h.lossDays + ' ngày. Mình đặt một mức cắt lỗ để chủ động nhé?' });
    });
  }

  var idd = dayDiff(TODAY, c.idExpiry);
  var evId = [{ label: 'CCCD hết hạn ' + ddmmyyyy(c.idExpiry), tab: 'overview', row: 'prof-id' }];
  if (idd < 0) {
    add({ cat: 3, code: 'V-31', level: 1, title: 'CCCD đã hết hạn, tài khoản bị chặn', short: 'CCCD hết hạn từ ' + ddmm(c.idExpiry) + ', đang bị chặn giao dịch',
      due: { date: c.idExpiry }, why: 'CCCD hết hạn ngày ' + ddmmyyyy(c.idExpiry) + '.', then: 'Khách đang không mua bán được gì cho tới khi cập nhật CCCD.',
      fix: 'Hướng dẫn khách cập nhật CCCD trên ứng dụng, hoặc hẹn ra quầy.', evidence: evId, sol: 'profile', unblock: 'id',
      opener: N + ', CCCD của ' + a + ' đã hết hạn nên tài khoản đang bị chặn giao dịch. Em hướng dẫn cập nhật trên ứng dụng, chỉ mất vài phút.' });
    blocks.push({ state: 'now', what: 'Mọi giao dịch', code: 'V-31' });
  } else if (idd <= TH.idSoon) {
    add({ cat: 3, code: 'V-32', level: idd <= TH.idUrgent ? 1 : 2, title: 'CCCD sắp hết hạn', short: 'CCCD còn ' + idd + ' ngày nữa hết hạn (' + ddmm(c.idExpiry) + ')',
      due: { date: c.idExpiry }, why: 'CCCD hết hạn ngày ' + ddmmyyyy(c.idExpiry) + ', còn ' + idd + ' ngày.', then: 'Từ ' + ddmm(addDays(c.idExpiry, 1)) + ' tài khoản bị chặn, khách không mua bán được.',
      fix: 'Nhắc khách cập nhật CCCD trên ứng dụng trước ngày ' + ddmm(c.idExpiry) + '.', evidence: evId, sol: 'profile', unblock: 'id',
      opener: N + ', CCCD của ' + a + ' hết hạn ngày ' + ddmm(c.idExpiry) + '. ' + cap(a) + ' cập nhật trước để không bị chặn giao dịch nhé.' });
    blocks.push({ state: 'soon', what: 'Mọi giao dịch (từ ' + ddmm(addDays(c.idExpiry, 1)) + ')', code: 'V-32' });
  }
  var sExp = c.survey ? addDays(c.survey, TH.surveyDays) : null, sd = sExp ? dayDiff(TODAY, sExp) : -1;
  var evS = [{ label: c.survey ? 'Khảo sát ngày ' + ddmmyyyy(c.survey) : 'Chưa có khảo sát', tab: 'overview', row: 'prof-survey' }];
  if (sd < 0) {
    add({ cat: 3, code: 'V-33', level: 1, title: 'Khảo sát khẩu vị đã quá hạn', short: c.survey ? 'Khảo sát quá hạn từ ' + ddmm(sExp) + ', đang bị chặn tư vấn mua' : 'Chưa làm khảo sát, đang bị chặn tư vấn mua',
      due: { date: sExp || TODAY }, why: c.survey ? 'Khảo sát làm ngày ' + ddmmyyyy(c.survey) + ', đã quá 12 tháng.' : 'Khách chưa làm khảo sát khẩu vị.',
      then: 'Broker không được tư vấn mua cho khách, kể cả khi khách hỏi.', fix: 'Gửi khách link làm lại khảo sát (khoảng 5 phút).', evidence: evS, sol: 'profile', unblock: 'survey',
      opener: N + ', phiếu khảo sát khẩu vị của ' + a + ' đã quá hạn, nên em tạm chưa tư vấn mua được. Em gửi link làm lại, khoảng 5 phút.' });
    blocks.push({ state: 'now', what: 'Tư vấn mua', code: 'V-33' });
  } else if (sd <= TH.surveySoon) {
    add({ cat: 3, code: 'V-34', level: 2, title: 'Khảo sát khẩu vị sắp quá hạn', short: 'Khảo sát quá hạn sau ' + sd + ' ngày (' + ddmm(sExp) + ')',
      due: { date: sExp }, why: 'Khảo sát làm ngày ' + ddmmyyyy(c.survey) + ', sẽ quá 12 tháng vào ' + ddmm(sExp) + '.', then: 'Từ ' + ddmm(addDays(sExp, 1)) + ' broker không được tư vấn mua cho khách.',
      fix: 'Gửi khách link làm lại khảo sát trước ' + ddmm(sExp) + '.', evidence: evS, sol: 'profile', unblock: 'survey',
      opener: N + ', phiếu khảo sát khẩu vị của ' + a + ' sắp hết hạn ngày ' + ddmm(sExp) + '. Em gửi link làm lại để không bị gián đoạn.' });
    blocks.push({ state: 'soon', what: 'Tư vấn mua (từ ' + ddmm(addDays(sExp, 1)) + ')', code: 'V-34' });
  }
  if (c.derivatives === false) blocks.push({ state: 'grey', what: 'Giao dịch phái sinh', note: 'chưa ký hợp đồng; khách không giao dịch phái sinh nên không phải vấn đề' });

  var outs = c.txns.filter(function (t) { return (t.type === 'Rút tiền' || t.type === 'Chuyển cổ phiếu đi') && t.status !== 'Chờ khớp' && dayDiff(t.date, TODAY) <= TH.moveDays; });
  var outSum = outs.reduce(function (s, t) { return s + t.amt; }, 0);
  if (outSum > 0 && outSum / (m.nav + outSum) * 100 >= TH.bigMove) {
    var share = outSum / (m.nav + outSum) * 100, t0 = outs[0];
    add({ cat: 4, code: 'V-41', level: 1, title: 'Vừa rút một khoản lớn', short: 'Rút ' + money(outSum) + ' (' + pct(share, 0) + ' tài sản) ngày ' + ddmm(t0.date),
      due: null, why: 'Ngày ' + ddmm(t0.date) + ' khách rút ' + moneyLong(outSum) + ', bằng ' + pct(share, 0) + ' tài sản trước khi rút.',
      then: 'Có thể khách cần tiền gấp, hoặc đang chuyển tiền sang nơi khác. Hỏi sớm thì còn kịp giữ khách.', fix: 'Gọi hỏi thăm nhu cầu của khách.',
      evidence: outs.map(function (t) { return { label: t.type + ' ' + money(t.amt) + ' ngày ' + ddmm(t.date), tab: 'overview', row: 'tx-' + t.id }; }), sol: 'ask',
      ask: ['Khoản rút này để ' + a + ' làm gì, em có hỗ trợ được không?', cap(a) + ' có định rút thêm trong thời gian tới không?', 'Danh mục còn lại có cần cân lại cho hợp không?'],
      opener: N + ', em thấy ngày ' + ddmm(t0.date) + ' ' + a + ' rút ' + moneyLong(outSum) + '. Em gọi hỏi xem ' + a + ' có kế hoạch gì để em hỗ trợ.' });
  }
  if (m.nav > 0 && c.cash / m.nav * 100 > TH.idlePct && (c.idleDays || 0) >= TH.idleDays)
    add({ cat: 4, code: 'V-42', level: 2, title: 'Tiền mặt nằm im lâu', short: money(c.cash) + ' tiền mặt nằm im ' + c.idleDays + ' ngày',
      due: null, why: 'Tài khoản có ' + moneyLong(c.cash) + ' tiền mặt (' + pct(c.cash / m.nav * 100, 0) + ' tài sản), không dùng ' + c.idleDays + ' ngày.',
      then: 'Khách có thể đang chờ cơ hội, hoặc đang nghĩ tới việc rút đi.', fix: 'Hỏi khách định dùng khoản này thế nào.',
      evidence: [{ label: 'Tiền mặt ' + money(c.cash), tab: 'overview', row: 'acct-cash' }], sol: 'ask', ask: [cap(a) + ' đang để tiền chờ cơ hội nào không?', 'Khoản tiền này ' + a + ' định dùng trong bao lâu?'],
      opener: N + ', tài khoản đang có ' + moneyLong(c.cash) + ' tiền mặt chưa dùng. Em gọi hỏi ' + a + ' định dùng khoản này thế nào.' });
  if (c.trades30 != null && c.tradesAvg > 0 && c.trades30 <= c.tradesAvg * (1 - TH.tradeDrop / 100))
    add({ cat: 4, code: 'V-43', level: 2, title: 'Giao dịch thưa dần', short: c.trades30 + ' lệnh/30 ngày, trước đây khoảng ' + c.tradesAvg,
      due: null, why: '30 ngày qua khách đặt ' + c.trades30 + ' lệnh, trong khi trung bình 3 tháng trước là ' + c.tradesAvg + ' lệnh/tháng.',
      then: 'Khách có thể đang chán hoặc chuyển sang nơi khác.', fix: 'Hỏi thăm khách.', evidence: [{ label: 'Giao dịch 30 ngày', tab: 'overview', row: 'tx-summary' }], sol: 'ask',
      ask: ['Dạo này ' + a + ' ít giao dịch, ' + a + ' đang chờ cơ hội hay có điều gì chưa ưng ý?'],
      opener: N + ', dạo này ' + a + ' ít giao dịch hơn. ' + cap(a) + ' đang chờ cơ hội hay có điều gì chưa ưng ý?' });

  var lc = lastContact(c);
  if (!lc && !c.events.length) noData.push({ cat: 5, reason: 'Chưa có lần liên hệ nào được ghi' + (c.movedIn ? ' (khách chuyển về từ ' + ddmm(c.movedIn) + ')' : '') + '.' });
  else if (lc) {
    var th = TH.contact[c.tier], gap = dayDiff(lc.at, TODAY);
    if (gap > th) add({ cat: 5, code: 'V-51', level: gap > 2 * th ? 1 : 2, title: gap + ' ngày chưa liên hệ', short: gap + ' ngày chưa liên hệ (' + c.tier + ' nên gọi mỗi ' + th + ' ngày)',
      due: { date: addDays(lc.at, th) }, why: 'Lần cuối nói chuyện được với khách là ngày ' + ddmm(lc.at) + ', cách đây ' + gap + ' ngày. Khách ' + c.tier + ' nên được liên hệ ít nhất ' + th + ' ngày một lần.',
      then: 'Khách thấy bị bỏ quên, dễ chuyển sang broker khác.', fix: 'Gọi hỏi thăm, cập nhật tình hình tài khoản.',
      evidence: [{ label: 'Lần liên hệ ' + ddmm(lc.at), tab: 'history', row: 'ev-' + lc.id }], sol: 'ask',
      ask: ['Dạo này ' + a + ' có kế hoạch gì mới với tài khoản không?', 'Có điều gì em chưa hỗ trợ tốt không?'],
      opener: N + ', lâu rồi em chưa gọi hỏi thăm. Em gọi cập nhật tình hình tài khoản và nghe ' + a + ' cần gì thêm.' });
  }
  c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; }).forEach(function (t) {
    var od = dayDiff(t.due, TODAY);
    add({ cat: 5, code: 'V-52', key: t.id, level: od > TH.overdueHigh ? 1 : 2, title: 'Lỡ hẹn: ' + t.title.toLowerCase(), short: 'Lỡ hẹn ' + od + ' ngày: ' + t.title.toLowerCase(),
      due: { date: t.due.slice(0, 10) }, why: 'Đã hẹn ' + t.title.toLowerCase() + ' lúc ' + hhmm(t.due) + ' ngày ' + ddmm(t.due) + ', tới nay chưa ghi kết quả.',
      then: 'Khách chờ mà không thấy broker liên hệ, coi là thất hứa.', fix: 'Liên hệ khách ngay và ghi kết quả.',
      evidence: [{ label: 'Lịch hẹn ' + ddmm(t.due), tab: 'history', row: 'task-' + t.id }], sol: 'ask', task: t,
      ask: ['Xin lỗi ' + a + ' vì em liên hệ muộn so với lời hẹn.', cap(a) + ' còn quan tâm tới ' + t.title.toLowerCase().replace(/^gọi lại /, '') + ' không?'],
      opener: N + ', hôm ' + ddmm(t.due) + ' em hẹn ' + t.title.toLowerCase() + '. Em xin lỗi vì liên hệ muộn.' });
  });

  out.sort(function (x, y) { return x.level - y.level || dueKey(x) - dueKey(y); });
  var status = out.length ? out[0].level : (noData.length ? 3 : 4);
  return { issues: out, noData: noData, blocks: blocks, status: status, top: out[0] || null, m: m };
}
function dueKey(i) { return i.due ? toUTC(i.due.date) : 9e15; }

function solutions(c, issue, ev) {
  var m = ev.m, a = address(c), res = { can: [], cannot: [], options: [], ask: issue.ask || null };
  var appetite = c.appetite;
  var unblockFirst = [];
  ev.issues.forEach(function (i) {
    if (i.unblock && i !== issue && unblockFirst.indexOf(i.unblock) < 0 && (i.code === 'V-31' || i.code === 'V-33')) unblockFirst.push(i.unblock);
  });
  if (issue.unblock) unblockFirst.unshift(issue.unblock);
  unblockFirst.forEach(function (u) {
    if (u === 'survey') res.options.push({ kind: 'action', unblock: true, title: 'Gửi link làm lại khảo sát khẩu vị', rows: [['Làm gì', 'Gửi link qua Zalo/SMS, khách tự làm khoảng 5 phút'], ['Sau đó', 'Hết bị chặn tư vấn mua mới']], fit: null });
    if (u === 'id') res.options.push({ kind: 'action', unblock: true, title: 'Hướng dẫn cập nhật CCCD trên ứng dụng', rows: [['Làm gì', 'Chỉ khách vào Tài khoản → Cập nhật giấy tờ, chụp 2 mặt CCCD'], ['Sau đó', 'Tài khoản không bị chặn']], fit: null });
  });
  var surveyBlocked = ev.issues.some(function (i) { return i.code === 'V-33'; });

  if (issue.sol === 'margin') {
    var A = issue.projected ? m.Aproj : m.A, D = m.debt, t = TH.safe / 100;
    var cur = (A - D) / A * 100;
    var X = Math.max(0, D - A * (1 - t));
    var S = Math.max(0, A - (A - D) / t);
    res.can = ['Nộp thêm tiền', 'Bán bớt cổ phiếu']; res.cannot = ['Mua thêm', 'Vay thêm'];
    res.options.push({ kind: 'choose', title: 'Nộp thêm ' + moneyLong(Math.ceil(X)), rows: [['Làm gì', 'Chuyển tiền vào tài khoản chứng khoán'], ['Bao nhiêu', moneyLong(Math.ceil(X))], ['Sau đó', 'Tỷ lệ ' + (issue.projected ? 'dự kiến ' : '') + 'từ ' + pct(cur, 0) + ' về ' + TH.safe + '%']], fit: { ok: true, text: 'Hợp khẩu vị (' + appetite + ')' } });
    c.holdings.slice().sort(function (x, y) { return val(y) - val(x); }).slice(0, 2).forEach(function (h) {
      var p = priceOf(h), need = Math.ceil(S * 1e6 / p / 100) * 100, enough = need <= h.qty, q = Math.min(need, h.qty), amount = q * p / 1e6;
      var after = (A - amount - (D - amount)) / (A - amount) * 100;
      res.options.push({ kind: 'order', side: 'Bán', t: h.t, qty: q, title: 'Bán ' + fmt(q) + ' cổ phiếu ' + h.t, rows: [['Làm gì', 'Bán ' + h.t + ', tiền bán dùng trả nợ'], ['Bao nhiêu', fmt(q) + ' cổ phiếu × ' + fmt(p) + ' ≈ ' + moneyLong(amount)], ['Sau đó', 'Tỷ lệ về ' + pct(after, 0) + (enough ? '' : ' (bán hết ' + h.t + ' vẫn chưa đủ, cần bán thêm mã khác)')], ['Lãi/lỗ khi bán', ((p - h.cost) / h.cost * 100 >= 0 ? 'Lãi ' : 'Lỗ ') + pct(Math.abs((p - h.cost) / h.cost * 100), 0) + ' trên phần bán']], fit: { ok: true, text: 'Hợp — giảm rủi ro' } });
    });
    res.options.push({ kind: 'locked', title: 'Mua thêm để hạ giá vốn', lockReason: 'Bị chặn: tỷ lệ ký quỹ dưới ' + TH.safe + '% thì không được vay thêm (điều 7). Mua thêm còn làm tỷ lệ thấp hơn.' });
  } else if (issue.sol === 'cutloss' || issue.sol === 'target') {
    var h2 = c.holdings.filter(function (x) { return x.t === issue.cm.t; })[0], p2 = priceOf(h2), pl = (p2 - h2.cost) * h2.qty / 1e6;
    var half = Math.floor(h2.qty / 200) * 100;
    var word = pl >= 0 ? 'Lãi' : 'Lỗ';
    res.can = ['Bán', 'Giữ và hẹn mức mới']; res.cannot = surveyBlocked ? ['Tư vấn mua thêm'] : [];
    res.options.push({ kind: 'order', side: 'Bán', t: h2.t, qty: h2.qty, title: (issue.sol === 'cutloss' ? 'Bán hết như đã hẹn: ' : 'Chốt lãi hết: ') + fmt(h2.qty) + ' ' + h2.t,
      rows: [['Bao nhiêu', fmt(h2.qty) + ' cổ phiếu × ' + fmt(p2) + ' ≈ ' + moneyLong(h2.qty * p2 / 1e6)], [word + ' khi bán', moneyLong(Math.abs(pl)) + ' (' + pct(Math.abs((p2 - h2.cost) / h2.cost * 100), 1) + ')'], ['Sau đó', 'Không còn ' + h2.t + ' trong danh mục']], fit: { ok: true, text: 'Đúng cam kết' } });
    res.options.push({ kind: 'order', side: 'Bán', t: h2.t, qty: half, title: 'Bán một nửa: ' + fmt(half) + ' ' + h2.t,
      rows: [['Bao nhiêu', fmt(half) + ' cổ phiếu ≈ ' + moneyLong(half * p2 / 1e6)], [word + ' khi bán', moneyLong(Math.abs((p2 - h2.cost) * half / 1e6))], ['Sau đó', 'Còn ' + fmt(h2.qty - half) + ' ' + h2.t]], fit: { ok: true, text: 'Hợp khẩu vị (' + appetite + ')' } });
    res.options.push({ kind: 'choose', title: 'Giữ lại và hẹn ' + (issue.sol === 'cutloss' ? 'điểm cắt lỗ' : 'giá mục tiêu') + ' mới', rows: [['Làm gì', 'Ghi cam kết mới khi tạo sự kiện'], ['Lưu ý', 'Cam kết cũ được giữ trong lịch sử']], fit: issue.sol === 'cutloss' ? { ok: false, text: 'Cân nhắc: khách chịu lỗ tối đa ' + c.maxLoss + '%' } : { ok: true, text: 'Hợp khẩu vị (' + appetite + ')' } });
    if (issue.sol === 'cutloss') res.options.push({ kind: 'locked', title: 'Mua thêm để hạ giá vốn', lockReason: surveyBlocked ? 'Bị chặn: khảo sát khẩu vị quá hạn thì không được tư vấn mua (điều 7).' : 'Không gợi ý: trái với cam kết cắt lỗ ở mức này.' });
  } else if (issue.sol === 'sector') {
    var cut = issue.sectorValue - m.A * TH.sector / 100;
    res.can = ['Bán bớt ngành ' + issue.sector.toLowerCase(), 'Giữ và ghi lại khách chấp nhận rủi ro']; res.cannot = ['Gợi ý mã mới để mua thay'];
    res.options.push({ kind: 'choose', title: 'Bán bớt ngành ' + issue.sector.toLowerCase() + ' khoảng ' + moneyLong(Math.ceil(cut)), rows: [['Làm gì', 'Khách tự chọn mã trong ngành để bán'], ['Bao nhiêu', '≈ ' + moneyLong(Math.ceil(cut))], ['Sau đó', 'Ngành ' + issue.sector.toLowerCase() + ' về ' + TH.sector + '% danh mục']], fit: { ok: true, text: 'Hợp — giảm rủi ro' } });
    res.options.push({ kind: 'choose', title: 'Giữ nguyên, ghi lại khách chấp nhận rủi ro', rows: [['Làm gì', 'Ghi vào sự kiện rằng khách hiểu và chấp nhận'], ['Sau đó', 'Không nhắc lại trong [30] ngày']], fit: appetite === 'Thận trọng' ? { ok: false, text: 'Lệch khẩu vị (' + appetite + ')' } : { ok: true, text: 'Hợp khẩu vị (' + appetite + ')' } });
    res.options.push({ kind: 'locked', title: 'Gợi ý mã khác để mua thay', lockReason: 'Công cụ không gợi ý mã mới (điều 8).' });
  } else if (issue.sol === 'profile') {
    res.can = ['Hướng dẫn khách tự cập nhật']; res.cannot = issue.unblock === 'survey' ? ['Tư vấn mua cho tới khi làm lại khảo sát'] : ['Đặt lệnh cho tới khi cập nhật CCCD'];
    if (issue.unblock === 'id') res.options.push({ kind: 'action', title: 'Hẹn khách ra quầy cập nhật CCCD', rows: [['Làm gì', 'Tạo sự kiện Đã lên lịch']], fit: null });
  } else {
    res.can = ['Hỏi thăm, ghi lại cuộc gọi']; res.cannot = [];
  }
  res.options.push({ kind: 'nothing', title: 'Không làm gì', rows: [['Hậu quả', issue.then]] });
  return res;
}

function seedSpecials() {
  var L = [];
  function mk(o) {
    var d = {
      g: 'm', tier: 'Phổ thông', since: 2021, appetite: 'Cân bằng', goal: 'Tăng trưởng tài sản', horizon: '3–5 năm', maxLoss: 15,
      survey: '2026-02-10', idExpiry: '2031-05-20', authorized: [], labels: [], pref: '', job: '', cash: 20, margin: null,
      holdings: [], txns: [], commitments: [], events: [], tasks: [], unlogged: [], acct: [], derivatives: false,
      trades30: 4, tradesAvg: 4, idleDays: 0, special: true
    };
    for (var k in o) d[k] = o[k];
    L.push(d);
  }
  mk({ id: 'c001', name: 'Trần Văn Bình', tier: 'VIP', acc: '058C112233', since: 2019, phone: '0903214567', survey: '2026-03-12', idExpiry: '2026-11-29',
    goal: 'Tăng trưởng tài sản dài hạn', job: 'Chủ xưởng gỗ', labels: ['Thích nghe số cụ thể'], pref: 'Gọi điện, 8:00–9:30',
    authorized: [{ name: 'Nguyễn Thị Hồng', rel: 'Vợ', phone: '0912345678', scope: 'Chỉ được đặt lệnh' }],
    cash: 0, margin: { debt: 941, callDate: '2026-11-04' },
    holdings: [{ t: 'VPB', qty: 25000, cost: 23100 }, { t: 'GAS', qty: 5300, cost: 72000 }, { t: 'FPT', qty: 2600, cost: 118000 }, { t: 'HSG', qty: 14500, cost: 19000 }],
    txns: [{ id: 't1', date: '2026-10-30', type: 'Mua', t: 'VPB', qty: 5000, price: 20400, amt: 102, status: 'Khớp' }],
    events: [{ id: 'e1', at: '2026-10-28T09:10', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Báo VPB giảm mạnh. Anh Bình muốn giữ thêm 1 tuần, chưa muốn nộp tiền.', decision: 'Cần suy nghĩ' },
      { id: 'e0', at: '2026-10-10T17:20', channel: 'Zalo', broker: 'Chị Lan', purpose: 'Trả lời yêu cầu của khách', result: 'Hoàn thành', note: 'Gửi bảng lãi vay ký quỹ tháng 10.' }],
    acct: [{ at: '2026-11-04T07:30', text: 'Tài khoản bị call ký quỹ: tỷ lệ 32%' }] });
  mk({ id: 'c002', name: 'Lê Thu Hà', g: 'f', tier: 'Thân thiết', acc: '058C223344', since: 2020, phone: '0938776112', survey: '2026-05-02', idExpiry: '2032-01-15',
    labels: ['Ngắn gọn, đi thẳng vào việc'], pref: 'Zalo trước, gọi sau 11:30', job: 'Dược sĩ',
    authorized: [{ name: 'Lê Minh Quân', rel: 'Em trai', phone: '0987654321', scope: 'Chỉ được đặt lệnh' }],
    cash: 0, margin: { debt: 1240 },
    holdings: [{ t: 'VHM', qty: 18600, cost: 42000, loan: { from: 50, to: 40, date: '2026-11-07' } }, { t: 'FPT', qty: 4000, cost: 98000 }, { t: 'MWG', qty: 8000, cost: 58000 }, { t: 'GAS', qty: 4700, cost: 66000 }],
    events: [{ id: 'e1', at: '2026-10-20T11:40', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Chị Hà hài lòng với FPT, chưa có kế hoạch rút tiền.', decision: 'Đồng ý' }],
    acct: [{ at: '2026-11-03T16:00', text: 'Công ty thông báo hạ tỷ lệ cho vay VHM từ 50% xuống 40%, áp dụng từ 07/11' }] });
  mk({ id: 'c003', name: 'Trịnh Văn Sơn', acc: '058C334455', phone: '0977123890', cash: 0, margin: { debt: 543, callDate: '2026-11-02' },
    holdings: [{ t: 'SSI', qty: 11000, cost: 31000 }, { t: 'POW', qty: 19000, cost: 14000 }, { t: 'MSN', qty: 3200, cost: 80000 }], labels: ['Hay lo lắng, cần trấn an'],
    events: [{ id: 'e1', at: '2026-10-30T14:05', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Xử lý vấn đề', result: 'Hoàn thành', note: 'Báo tài khoản bị call. Anh Sơn hứa nộp tiền trước 04/11.', decision: 'Đồng ý' }],
    acct: [{ at: '2026-11-02T07:30', text: 'Tài khoản bị call ký quỹ' }, { at: '2026-11-04T07:30', text: 'Tỷ lệ ký quỹ xuống dưới 30%' }] });
  mk({ id: 'c004', name: 'Phạm Quốc Dũng', addr: 'ông', tier: 'Thân thiết', acc: '058C445566', since: 2016, phone: '0913556677', survey: '2025-08-20', idExpiry: '2033-03-01',
    appetite: 'Thận trọng', goal: 'Giữ tiền, có cổ tức đều', horizon: 'Trên 5 năm', maxLoss: 10, labels: ['Thích gặp trực tiếp', 'Đọc kỹ báo cáo'], pref: 'Gọi điện, 14:00–16:00', job: 'Giáo viên nghỉ hưu',
    cash: 60, holdings: [{ t: 'FPT', qty: 2400, cost: 121000 }, { t: 'VNM', qty: 2000, cost: 60000 }, { t: 'REE', qty: 2500, cost: 58000 }, { t: 'GMD', qty: 3000, cost: 50000 }],
    commitments: [{ id: 'cm1', type: 'cutloss', t: 'FPT', level: 108000, date: '2026-10-12', by: 'Chị Lan', status: 'active', note: 'Ông Dũng đồng ý bán hết FPT nếu giá xuống 108.000' },
      { id: 'cm2', type: 'review', t: '', cond: 'Xem lại tỷ trọng FPT sau khi có báo cáo quý 3', reviewDate: '2026-11-20', date: '2026-10-12', by: 'Chị Lan', status: 'active', note: '' }],
    tasks: [{ id: 'k1', title: 'Gửi báo cáo quý 3 của FPT', due: '2026-11-07T17:00', channel: 'Zalo', done: false }],
    events: [{ id: 'e1', at: '2026-10-12T14:30', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Ông Dũng đồng ý bán FPT nếu giá xuống 108.000; muốn nhận báo cáo quý 3.', decision: 'Đồng ý' },
      { id: 'e0', at: '2025-12-02T09:00', channel: 'Gặp trực tiếp', broker: 'Anh Phúc', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Rà danh mục cuối năm. Ông muốn giữ cổ tức đều.' }] });
  mk({ id: 'c005', name: 'Nguyễn Thị Mai', g: 'f', acc: '058C556677', phone: '0905667788', idExpiry: '2026-11-06', holdings: [{ t: 'VNM', qty: 3000, cost: 61000 }, { t: 'POW', qty: 10000, cost: 12500 }, { t: 'DGC', qty: 1000, cost: 95000 }, { t: 'GMD', qty: 2000, cost: 50000 }],
    events: [{ id: 'e1', at: '2026-10-15T10:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Hỏi thăm. Chị Mai chưa có nhu cầu mới.' }] });
  mk({ id: 'c006', name: 'Đỗ Văn Khoa', tier: 'VIP', acc: '058C667788', since: 2018, phone: '0918889900', labels: ['Quyết nhanh, không thích gọi dài'], pref: 'Gọi sau 17:00',
    cash: 300, holdings: [{ t: 'VCB', qty: 20000, cost: 58000 }, { t: 'FPT', qty: 10000, cost: 95000 }, { t: 'GAS', qty: 9000, cost: 70000 }, { t: 'DGC', qty: 7500, cost: 100000 }, { t: 'VJC', qty: 11450, cost: 101000 }],
    txns: [{ id: 't1', date: '2026-11-03', type: 'Rút tiền', amt: 900, status: 'Hoàn thành' }, { id: 't2', date: '2026-11-04', type: 'Mua', t: 'PNJ', qty: 1000, price: 87000, amt: 87, status: 'Chờ khớp' },
      { id: 't3', date: '2026-10-31', type: 'Bán', t: 'MWG', qty: 5000, price: 61500, amt: 307.5, status: 'Khớp' }],
    unlogged: [{ id: 'u1', at: '2026-11-03T16:40', dir: 'Khách gọi đến', dur: '3 phút 20 giây', rec: 'GA-20261103-1640' }],
    events: [{ id: 'e1', at: '2026-10-25T17:30', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Anh Khoa hỏi về trái phiếu ngân hàng.' }],
    acct: [{ at: '2026-11-03T15:10', text: 'Rút tiền lớn: 900 triệu đồng (15% tài sản)' }] });
  mk({ id: 'c007', name: 'Bùi Đức Long', tier: 'Thân thiết', acc: '058C778899', phone: '0934445566', holdings: [{ t: 'MBB', qty: 15000, cost: 21000 }, { t: 'MSN', qty: 3000, cost: 72000 }, { t: 'PVS', qty: 8000, cost: 32000 }, { t: 'GMD', qty: 3000, cost: 49000 }],
    tasks: [{ id: 'k1', title: 'Gọi lại tư vấn trái phiếu', due: '2026-11-01T10:00', channel: 'Gọi đi', done: false }],
    events: [{ id: 'e1', at: '2026-10-22T10:15', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Trả lời yêu cầu của khách', result: 'Hoàn thành', note: 'Anh Long hỏi trái phiếu; hẹn gọi lại sáng 01/11.', decision: 'Cần suy nghĩ' },
      { id: 'e0', at: '2026-10-22T10:16', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Trả lời yêu cầu của khách', result: 'Đã lên lịch', note: 'Gọi lại tư vấn trái phiếu lúc 10:00 ngày 01/11.' }] });
  mk({ id: 'c008', name: 'Hoàng Minh Tuấn', tier: 'VIP', acc: '058C889900', since: 2017, phone: '0909112233', cash: 250,
    holdings: [{ t: 'VCB', qty: 15000, cost: 59000 }, { t: 'FPT', qty: 8000, cost: 100000 }, { t: 'MSN', qty: 10000, cost: 70000 }, { t: 'REE', qty: 12000, cost: 60000 }, { t: 'GMD', qty: 12000, cost: 48000 }],
    events: [{ id: 'e1', at: '2026-10-13T16:00', channel: 'Gặp trực tiếp', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Cà phê, rà danh mục. Anh Tuấn muốn thêm cổ tức ổn định.' }] });
  mk({ id: 'c009', name: 'Vũ Thị Lan Anh', g: 'f', tier: 'Thân thiết', acc: '058C990011', phone: '0936778899',
    holdings: [{ t: 'VCB', qty: 4000, cost: 60000 }, { t: 'TCB', qty: 11000, cost: 22000 }, { t: 'MBB', qty: 10000, cost: 21500 }, { t: 'HPG', qty: 8000, cost: 25000 }, { t: 'FPT', qty: 1000, cost: 105000 }, { t: 'GAS', qty: 3000, cost: 66000 }],
    events: [{ id: 'e1', at: '2026-10-21T09:30', channel: 'Zalo', broker: 'Chị Lan', purpose: 'Gửi thông tin đã hứa', result: 'Hoàn thành', note: 'Gửi bản tin ngành ngân hàng.' }] });
  mk({ id: 'c010', name: 'Phan Thị Ngọc', g: 'f', acc: '058C101112', phone: '0947223344', holdings: [{ t: 'MWG', qty: 5000, cost: 50000 }, { t: 'VNM', qty: 2000, cost: 63000 }, { t: 'POW', qty: 10000, cost: 12000 }, { t: 'REE', qty: 2000, cost: 61000 }, { t: 'GMD', qty: 2500, cost: 50000 }],
    commitments: [{ id: 'cm1', type: 'target', t: 'MWG', level: 62000, date: '2026-09-18', by: 'Chị Lan', status: 'active', note: 'Chị Ngọc muốn cân nhắc bán MWG khi lên 62.000' }],
    events: [{ id: 'e1', at: '2026-10-25T15:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Hỏi thăm.' }] });
  mk({ id: 'c011', name: 'Đặng Thu Trang', g: 'f', tier: 'Thân thiết', acc: '058C121314', phone: '0916334455', cash: 0, margin: { debt: 300, dataMissing: true, lastData: '2026-11-03' },
    holdings: [{ t: 'TCB', qty: 15000, cost: 22500 }, { t: 'KDH', qty: 10000, cost: 30000 }, { t: 'POW', qty: 20000, cost: 12000 }],
    events: [{ id: 'e1', at: '2026-10-26T10:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Hỏi thăm.' }] });
  mk({ id: 'c012', name: 'Ngô Gia Huy', acc: '058C131415', phone: '0961556677', since: 2024, movedIn: '2026-10-30',
    authorized: [{ name: 'Lê Minh Quân', rel: 'Anh họ', phone: '0987654321', scope: 'Chỉ được nhận thông tin, không đặt lệnh' }],
    holdings: [{ t: 'FPT', qty: 1500, cost: 104000 }, { t: 'GAS', qty: 2000, cost: 67000 }, { t: 'VNM', qty: 2000, cost: 61000 }],
    acct: [{ at: '2026-10-30T09:00', text: 'Đổi broker phụ trách: từ anh Phúc sang chị Lan' }] });
  mk({ id: 'c013', name: 'Lý Hoàng Nam', acc: '058C141516', phone: '0971889900', holdings: [{ t: 'REE', qty: 2000, cost: 61000 }, { t: 'VJC', qty: 1300, cost: 97000 }, { t: 'TCB', qty: 4000, cost: 23000 }, { t: 'MSN', qty: 1000, cost: 73000 }],
    events: [{ id: 'e1', at: '2026-10-30T10:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Hỏi thăm, khách hài lòng.' }] });
  return L;
}

var SAMPLE_NOTES = {
  c001: 'Đang bị call (32%); CCCD còn 25 ngày; vợ được uỷ quyền đặt lệnh', c002: 'VHM bị hạ tỷ lệ cho vay từ 07/11 → sắp bị call; em trai được uỷ quyền',
  c003: 'Tỷ lệ dưới 30%, sắp bị bán giải chấp', c004: 'Khảo sát quá hạn; FPT còn 2,3% tới điểm cắt lỗ', c005: 'CCCD còn 2 ngày nữa hết hạn',
  c006: 'Vừa rút 900 triệu; có lệnh chờ khớp; cuộc gọi đến chưa ghi nhận', c007: 'Lịch hẹn gọi lại đã quá 3 ngày', c008: 'VIP, 22 ngày chưa liên hệ',
  c009: '58% tiền dồn vào ngân hàng; HPG chốt quyền 08/11', c010: 'MWG đã lên tới giá mục tiêu', c011: 'Có vay ký quỹ nhưng chưa có số liệu hôm nay',
  c012: 'Vừa chuyển từ broker khác, chưa có lần liên hệ nào', c013: 'Không có chuyện gì'
};

function generate(n) {
  var rnd = mulberry(20261104), L = [];
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  var HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Mai', 'Tạ', 'Lâm', 'Cao'];
  var DM = ['Văn', 'Minh', 'Quốc', 'Đức', 'Hữu', 'Thành', 'Gia', 'Hoàng', 'Anh', 'Công'], DF = ['Thị', 'Thu', 'Ngọc', 'Thanh', 'Mỹ', 'Bảo', 'Khánh', 'Phương', 'Hồng'];
  var TM = ['Hùng', 'Dũng', 'Tuấn', 'Nam', 'Phong', 'Long', 'Hải', 'Sơn', 'Thắng', 'Trung', 'Hiếu', 'Khang', 'Lộc', 'Phúc', 'Vinh', 'Quang', 'Tài', 'Đạt', 'Kiên', 'Toàn'];
  var TF = ['Hương', 'Linh', 'Trang', 'Thảo', 'Mai', 'Hạnh', 'Nhung', 'Yến', 'Vân', 'Hà', 'Ngân', 'Uyên', 'Chi', 'Loan', 'Diệp', 'Thuỷ'];
  var NOTES = ['Hỏi thăm, khách chưa có nhu cầu mới.', 'Gửi bản tin tuần, khách đọc và hỏi thêm về cổ tức.', 'Khách hỏi phí giao dịch, đã giải thích.', 'Rà danh mục, khách muốn giữ nguyên.', 'Khách hỏi lịch nghỉ lễ của sàn.'];
  var POOL = Object.keys(TK).filter(function (t) { return t !== 'HPG' && t !== 'VHM'; });
  var used = {};
  for (var i = 0; i < n; i++) {
    var g = rnd() < 0.55 ? 'm' : 'f';
    var name = pick(HO) + ' ' + (g === 'm' ? pick(DM) : pick(DF)) + ' ' + (g === 'm' ? pick(TM) : pick(TF));
    var tr = rnd(), tier = tr < 0.1 ? 'VIP' : tr < 0.4 ? 'Thân thiết' : 'Phổ thông';
    var nav = tier === 'VIP' ? ri(3000, 15000) : tier === 'Thân thiết' ? ri(1000, 3000) : ri(120, 950);
    var phone; do { phone = '09' + String(ri(10000000, 99999999)); } while (used[phone]); used[phone] = 1;
    var hasMargin = rnd() < 0.22;
    var A = hasMargin ? nav / (0.48 + rnd() * 0.37) : nav * (0.85 + rnd() * 0.1);
    var debt = hasMargin ? A - nav : 0, cash = hasMargin ? 0 : nav - A;
    var holdings, tries = 0;
    do {
      var k = ri(4, 6), secs = {}, ts = [];
      while (ts.length < k) { var t = pick(POOL), gk = CYCLE[TK[t].s] || TK[t].s; if (!secs[gk] && ts.indexOf(t) < 0) { secs[gk] = 1; ts.push(t); } }
      var w = ts.map(function () { return 0.6 + rnd(); }), sw = w.reduce(function (s, x) { return s + x; }, 0);
      holdings = ts.map(function (t, j) {
        var p = TK[t].p, q = Math.max(100, Math.round(A * w[j] / sw * 1e6 / p / 100) * 100);
        return { t: t, qty: q, cost: Math.round(p * (0.88 + rnd() * 0.24) / 100) * 100 };
      });
      var tot = holdings.reduce(function (s, h) { return s + val(h); }, 0), mx = Math.max.apply(null, holdings.map(function (h) { return val(h) / tot; }));
      tries++;
    } while (mx > 0.38 && tries < 20);
    var Areal = holdings.reduce(function (s, h) { return s + val(h); }, 0);
    if (hasMargin) debt = Math.min(debt, Areal * 0.5);
    var sv = rnd(), survey = sv < 0.03 ? addDays(TODAY, -ri(370, 520)) : sv < 0.055 ? addDays(TODAY, -ri(338, 362)) : addDays(TODAY, -ri(20, 320));
    var idExpiry = rnd() < 0.012 ? addDays(TODAY, ri(5, 28)) : addDays(TODAY, ri(60, 3200));
    var th = TH.contact[tier], cv = rnd();
    var lastGap = cv < 0.05 ? ri(th + 1, Math.round(th * 1.7)) : ri(1, th - 1);
    var events = [], ev2 = ri(0, 2);
    var noHist = rnd() < 0.012;
    if (!noHist) {
      events.push({ id: 'e1', at: addDays(TODAY, -lastGap) + 'T' + String(ri(8, 17)).padStart(2, '0') + ':' + pick(['05', '15', '30', '45']), channel: pick(['Gọi đi', 'Gọi đi', 'Zalo', 'Khách gọi đến']), broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: pick(NOTES) });
      for (var e = 0; e < ev2; e++) events.push({ id: 'e' + (e + 2), at: addDays(TODAY, -lastGap - ri(10, 80)) + 'T10:00', channel: pick(['Gọi đi', 'Zalo']), broker: rnd() < 0.8 ? 'Chị Lan' : 'Anh Phúc', purpose: 'Chăm sóc định kỳ', result: rnd() < 0.85 ? 'Hoàn thành' : 'Không liên lạc được', note: pick(NOTES), reason: 'Không nghe máy' });
    }
    var miss = hasMargin && rnd() < 0.08;
    L.push({
      id: 'g' + String(i + 1).padStart(3, '0'), name: name, g: g, tier: tier, acc: '058C' + String(200000 + i * 37 + ri(0, 30)), since: ri(2012, 2025), phone: phone,
      appetite: pick(['Thận trọng', 'Cân bằng', 'Cân bằng', 'Mạo hiểm']), goal: pick(['Tăng trưởng tài sản', 'Có cổ tức đều', 'Tích luỹ cho con']), horizon: pick(['1–3 năm', '3–5 năm', 'Trên 5 năm']), maxLoss: pick([10, 15, 20, 25]),
      survey: survey, idExpiry: idExpiry, authorized: [], labels: rnd() < 0.4 ? [pick(['Thích nghe số cụ thể', 'Ngắn gọn, đi thẳng vào việc', 'Thích gặp trực tiếp', 'Hay hỏi về cổ tức'])] : [],
      pref: rnd() < 0.5 ? pick(['Gọi điện, buổi sáng', 'Zalo trước', 'Gọi sau 17:00']) : '', job: rnd() < 0.5 ? pick(['Kinh doanh', 'Kỹ sư', 'Bác sĩ', 'Nhân viên văn phòng', 'Giáo viên']) : '',
      cash: Math.max(0, Math.round(cash)), margin: hasMargin ? { debt: Math.round(debt), dataMissing: miss, lastData: '2026-11-03' } : null,
      holdings: holdings, txns: [], commitments: [], events: events, tasks: [], unlogged: [], acct: [], derivatives: false, trades30: ri(2, 9), tradesAvg: 0, idleDays: 0,
      movedIn: noHist ? addDays(TODAY, -ri(2, 9)) : null
    });
  }
  return L;
}

function build() {
  var all = seedSpecials().concat(generate(237));
  return all;
}

root.SK = {
  CYCLE: CYCLE, TODAY: TODAY, TH: TH, LEVELS: LEVELS, CATS: CATS, TK: TK, CORP: CORP, SAMPLE_NOTES: SAMPLE_NOTES,
  build: build, evaluate: evaluate, solutions: solutions, metrics: metrics, lastContact: lastContact,
  util: { dayDiff: dayDiff, addDays: addDays, ddmm: ddmm, ddmmyyyy: ddmmyyyy, hhmm: hhmm, fmt: fmt, money: money, moneyLong: moneyLong, pct: pct, priceOf: priceOf, val: val, sectorOf: sectorOf, address: address, callName: callName, cap: cap }
};
})(typeof window !== 'undefined' ? window : globalThis);
