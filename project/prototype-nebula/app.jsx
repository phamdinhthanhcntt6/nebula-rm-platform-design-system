/* Sổ khách — dựng lại bằng component thật của Nebula RM Platform Design System.
   Lớp nghiệp vụ (window.SK từ data.js) giữ nguyên; chỉ lớp render được viết lại bằng DS components. */
const DS = window.NebulaRMPlatformDesignSystem_5dfab2;
const {
  AppLayout, PageBody, PagePanel, PageHeader, ViewBar,
  NavigationDrawer, NavigationDrawerHeader, NavigationDrawerSection, NavigationDrawerSectionTitle, NavigationDrawerItem,
  RecordTable, Tabs, Button, IconButton, Chip, Tag, Pill, Avatar, Radio, RadioGroup, Checkbox, Select, TextInput,
  KpiTile, KVRow, BlockCard, Card, CardContent, EmptyState, InlineNotice, Icon,
  SidePanel, PanelFootRow, SuggestionCard, PanelSection, LightButton,
  DropdownMenu, MenuItem, QuoteBox,
} = DS;

const S = window.SK, U = S.util, TODAY = S.TODAY, TH = S.TH, LEVELS = S.LEVELS, CATS = S.CATS;
const DB = S.build();
const EV = {}, BY = {};
DB.forEach(function (c) { EV[c.id] = S.evaluate(c); BY[c.id] = c; });
function reval(c) { EV[c.id] = S.evaluate(c); }
function unPrefill(u) { return { un: u, channel: u.dir === 'Khách gọi đến' ? 'Khách gọi đến' : 'Gọi đi', content: u.dir + ' (' + u.dur + ')', at: u.at, status: 'Hoàn thành' }; }
function nowHM() { const t = new Date(); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); }

/* ---- Lớp tuân thủ: đồng ý · mẫu tin đã duyệt · nhật ký · chiến dịch ---- */
function hashId(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
DB.forEach(function (c) {
  const h = hashId(c.id);
  c.consent = { zalo: h % 100 < 80, sms: (h >> 3) % 100 < 60, record: (h >> 6) % 100 < 70 };
});
['c001', 'c002', 'c003'].forEach(function (id) { if (BY[id]) BY[id].consent.zalo = true; });
if (BY.c001) BY.c001.consent.record = false;
if (BY.c003) BY.c003.consent.sms = false;

// Mẫu tin đã được Phòng Tuân thủ duyệt — chỉ nhắc/thông tin, không kêu gọi đặt lệnh (FINRA 2210 / SEC Marketing Rule)
const TEMPLATES = [
  { code: 'MT-2026-01', name: 'Nhắc tỷ lệ ký quỹ', cats: [1], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '15/10/2026', body: '{ten} ơi, {viec} (hạn {han}). Em là Lan bên Simplize, em gọi để mình cùng xem các cách xử lý nhé.' },
  { code: 'MT-2026-02', name: 'Nhắc cập nhật hồ sơ', cats: [3], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '15/10/2026', body: '{ten} ơi, hồ sơ của mình cần cập nhật: {viec} (hạn {han}). Mình cập nhật trên ứng dụng hoặc nhắn em hỗ trợ nhé.' },
  { code: 'MT-2026-03', name: 'Rà soát danh mục', cats: [2], channels: ['Zalo'], status: 'Đã duyệt', approvedAt: '20/10/2026', body: '{ten} ơi, em thấy {viec}. Em xin hẹn một cuộc gọi ngắn để cùng rà soát danh mục theo mục tiêu của mình.' },
  { code: 'MT-2026-04', name: 'Hỏi thăm dòng tiền', cats: [4], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '20/10/2026', body: '{ten} ơi, em ghi nhận {viec}. Nếu mình cần hỗ trợ gì về tài khoản, em luôn sẵn sàng.' },
  { code: 'MT-2026-05', name: 'Hẹn liên hệ lại', cats: [5], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '22/10/2026', body: '{ten} ơi, lâu rồi em chưa cập nhật cho mình ({viec}). Em xin hẹn gọi lại vào giờ mình tiện nhé.' },
  { code: 'MT-2026-06', name: 'Cơ hội đầu tư mới (nháp)', cats: [2], channels: ['Zalo'], status: 'Chờ duyệt', approvedAt: '', body: '{ten} ơi, em có một số mã đáng chú ý tuần này, mình xem qua nhé.' },
];

// Nhật ký tuân thủ — hệ thống tự lưu (Zalo không lưu nội dung tin nhắn)
const AUDIT = [
  { id: 'a1', at: '2026-11-02T08:15', by: 'Chị Lan', action: 'Xem số điện thoại', detail: 'Xem số của Trịnh Văn Sơn', customerIds: ['c003'] },
  { id: 'a2', at: '2026-11-02T14:05', by: 'Chị Lan', action: 'Ghi sự kiện', detail: 'Gọi đi · Hoàn thành · Đồng ý', customerIds: ['c003'] },
  { id: 'a3', at: '2026-11-03T09:40', by: 'Chị Lan', action: 'Ghi nhận đồng ý ghi âm', detail: 'Khách đồng ý ghi âm trong cuộc gọi', customerIds: ['c002'] },
  { id: 'a4', at: '2026-11-03T16:20', by: 'Chị Lan', action: 'Chốt phương án', detail: 'Bán 5.000 cổ phiếu MWG · mã ghi âm GA-20261103-1620', customerIds: ['c010'] },
];
function audit(action, detail, customerIds, ref) {
  AUDIT.push({ id: 'a' + (AUDIT.length + 1) + '-' + Date.now(), at: TODAY + 'T' + nowHM(), by: 'Chị Lan', action: action, detail: detail, customerIds: customerIds || [], ref: ref || null });
}
const CAMPAIGNS = [];

/* ---- helpers ---- */
const LEVEL_COLOR = ['red', 'orange', 'yellow', 'gray', 'green'];           // Khẩn/Cao/Chú ý/Thiếu dữ liệu/Ổn
const LEVEL_ICON  = ['flame', 'alert-triangle', 'eye', 'help-circle', 'circle-check'];
const TIER_COLOR  = { 'VIP': 'blue', 'Thân thiết': 'turquoise', 'Phổ thông': 'gray' };
function levelTag(lv, size) { return React.createElement(Tag, { text: LEVELS[lv], color: LEVEL_COLOR[lv], size: size || 'sm', preventShrink: true }); }
function tierTag(t) { return React.createElement(Tag, { text: t, color: TIER_COLOR[t] || 'gray', size: 'sm', preventShrink: true }); }
function ratioColor(r) { return r == null ? 'var(--t-font-color-tertiary)' : r < TH.call ? 'var(--t-tag-text-red)' : r < TH.warn1 ? 'var(--t-tag-text-orange)' : r < TH.safe ? 'var(--t-tag-text-yellow)' : 'var(--t-font-color-primary)'; }
// dòng phụ cho ô Tỷ lệ ký quỹ: ngưỡng + dự kiến tụt (m.proj) nếu có
function ratioSub(c, m) {
  if (!c.margin || c.margin.dataMissing) return c.margin ? 'Chưa có số liệu hôm nay' : 'Không vay ký quỹ';
  var s = 'Call ' + TH.call + '% · bán ' + TH.force + '%';
  if (m.proj != null && m.proj < TH.call) s = '→ ' + U.pct(m.proj, 0) + ' từ ' + U.ddmm(m.projDate) + ' · ' + s;
  return s;
}
function daysAgo(at) { const d = U.dayDiff(at, TODAY); return d === 0 ? 'Hôm nay' : d === 1 ? 'Hôm qua' : d + ' ngày trước'; }
function mask(p) { return p ? p.slice(0, 3) + '••••' + p.slice(-3) : '—'; }
function dueText(due) {
  if (!due) return '';
  const d = U.dayDiff(TODAY, due.date);
  if (d < 0) return 'Quá hạn ' + (-d) + ' ngày';
  if (d === 0) return 'Hôm nay' + (due.time ? ' ' + due.time : '');
  if (d === 1) return 'Ngày mai';
  return U.ddmm(due.date);
}
const mono = { fontFamily: 'ui-monospace, "DM Mono", monospace', fontVariantNumeric: 'tabular-nums' };
const num = { fontVariantNumeric: 'tabular-nums' };

/* =========================================================================
   NAVIGATION DRAWER (giống shell Twenty của design system)
   ========================================================================= */
function Drawer(props) {
  const sc = props.screen, go = function (h) { return function () { location.hash = h; }; };
  const tile = function (hue) { return { iconTile: 'var(--t-object-tile-' + hue + ')', iconTileBorder: 'var(--t-object-tile-border-' + hue + ')', iconColor: 'var(--t-tag-text-' + hue + ')' }; };
  const item = function (o) { return React.createElement(NavigationDrawerItem, o); };
  return React.createElement(NavigationDrawer, { header: React.createElement(NavigationDrawerHeader, { workspaceName: 'Simplize', notifications: 3 }) },
    React.createElement(NavigationDrawerSection, null,
      item({ label: 'Tìm kiếm', Icon: 'search', variant: 'tertiary', onClick: function () { focusSearch(); } }),
      item({ label: 'Hôm nay cần làm', Icon: 'inbox', count: todayItems().total, active: sc === 'today', onClick: go('hom-nay') }),
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Quản lý khách' }),
      item(Object.assign({ label: 'Sổ khách', Icon: 'address-book', active: sc === 'list' || sc === 'detail', onClick: go('') }, tile('blue'))),
      item(Object.assign({ label: 'Cơ hội', Icon: 'target-arrow', active: sc === 'co-hoi', onClick: go('co-hoi') }, tile('purple'))),
      item(Object.assign({ label: 'Phân khúc', Icon: 'chart-pie', active: sc === 'phan-khuc', onClick: go('phan-khuc') }, tile('pink'))),
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Vận hành' }),
      item(Object.assign({ label: 'Chiến dịch', Icon: 'send', count: CAMPAIGNS.length, active: sc === 'campaigns' || sc === 'campaign', onClick: go('chien-dich') }, tile('orange'))),
      item(Object.assign({ label: 'Hộp thoại', Icon: 'messages', active: sc === 'hop-thoai', onClick: go('hop-thoai') }, tile('turquoise'))),
      item(Object.assign({ label: 'Nhật ký tuân thủ', Icon: 'shield-check', active: sc === 'audit', onClick: go('nhat-ky') }, tile('violet'))),
    ),
  );
}

/* =========================================================================
   XỬ LÝ THEO NHÓM — gửi gợi ý hàng loạt (full-page overlay)
   1 mẫu tin → điền số liệu riêng từng khách → gửi NHẮC + tạo việc gọi lại.
   Đặt lệnh KHÔNG gửi hàng loạt (chốt riêng từng khách).
   ========================================================================= */
function fillTpl(tpl, c) {
  const top = EV[c.id].top, m = EV[c.id].m;
  const viec = top ? top.short.charAt(0).toLowerCase() + top.short.slice(1) : 'cần rà soát lại hồ sơ';
  const han = top && top.due ? dueText(top.due).toLowerCase() : 'sớm';
  const tyle = m.ratio != null ? U.pct(m.ratio, 0) : '—';
  return tpl.replace(/\{ten\}/g, c.name).replace(/\{viec\}/g, viec).replace(/\{han\}/g, han).replace(/\{tyle\}/g, tyle);
}
function BulkCampaign(props) {
  const all = props.customers;
  const [channel, setChannel] = React.useState('Zalo');
  // Mẫu mặc định: mẫu đã duyệt hợp với nhóm vấn đề phổ biến nhất trong nhóm khách đã chọn
  const catCount = {};
  all.forEach(function (c) { const t = EV[c.id].top; if (t) catCount[t.cat] = (catCount[t.cat] || 0) + 1; });
  const topCat = +(Object.keys(catCount).sort(function (a, b) { return catCount[b] - catCount[a]; })[0] || 1);
  const defTpl = TEMPLATES.filter(function (t) { return t.status === 'Đã duyệt' && t.cats.indexOf(topCat) >= 0; })[0] || TEMPLATES[0];
  const [tplCode, setTplCode] = React.useState(defTpl.code);
  const T = TEMPLATES.filter(function (t) { return t.code === tplCode; })[0];
  const tpl = T.body;
  const [excluded, setExcluded] = React.useState({});
  const noConsent = function (c) { return !(channel === 'Zalo' ? c.consent.zalo : c.consent.sms); };
  const blockedIds = all.filter(noConsent).map(function (c) { return c.id; });
  const included = all.filter(function (c) { return !excluded[c.id] && !noConsent(c); });
  const sendBlock = T.status !== 'Đã duyệt' ? 'Mẫu đang chờ Tuân thủ duyệt — chưa được gửi.'
    : T.channels.indexOf(channel) < 0 ? 'Mẫu này chỉ được duyệt cho kênh ' + T.channels.join(', ') + '.'
    : included.length === 0 ? 'Không còn khách nào để gửi.' : '';

  // Nhóm theo mức để biết độ gấp
  const byLevel = {};
  all.forEach(function (c) { const s = EV[c.id].status; byLevel[s] = (byLevel[s] || 0) + 1; });
  const groupLabel = Object.keys(byLevel).sort().map(function (s) { return byLevel[s] + ' ' + LEVELS[s]; }).join(' · ');

  function send() {
    const dueAt = U.addDays(TODAY, 1) + 'T09:00';
    const cpId = 'cp' + (CAMPAIGNS.length + 1);
    const snapshot = {}, topCodes = {};
    included.forEach(function (c) { snapshot[c.id] = EV[c.id].status; const t = EV[c.id].top; topCodes[c.id] = t ? t.code : null; });
    included.forEach(function (c) {
      const top = EV[c.id].top;
      c.events.push({ id: 'b' + Date.now() + c.id, at: TODAY + 'T' + nowHM(), channel: channel, broker: 'Chị Lan', purpose: 'Gửi thông tin đã hứa', result: 'Hoàn thành', note: 'Gửi gợi ý (hàng loạt): ' + fillTpl(tpl, c), issueTitle: top ? top.title : '' });
      c.tasks.push({ id: 'bt' + Date.now() + c.id, title: 'Gọi lại sau gợi ý' + (top ? ': ' + top.short : ''), due: dueAt, channel: 'Gọi đi', done: false, campaignId: cpId });
      reval(c);
    });
    const cp = { id: cpId, at: TODAY + 'T' + nowHM(), by: 'Chị Lan', channel: channel, templateCode: T.code, templateName: T.name, body: T.body,
      customerIds: included.map(function (c) { return c.id; }), excludedIds: blockedIds, snapshot: snapshot, topCodes: topCodes, replied: {} };
    CAMPAIGNS.push(cp);
    audit('Gửi gợi ý hàng loạt', channel + ' · mẫu ' + T.code + ' · ' + included.length + ' khách' + (blockedIds.length ? ' · loại ' + blockedIds.length + ' khách chưa đồng ý' : ''), cp.customerIds, cp.id);
    props.onSent(included.length, cp.id);
  }

  const th = { textAlign: 'left', fontWeight: 500, color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)', padding: '6px 8px', borderBottom: '1px solid var(--t-border-color-light)', whiteSpace: 'nowrap' };
  const td = { padding: '8px', borderBottom: '1px solid var(--t-border-color-light)', verticalAlign: 'top' };

  return React.createElement('div', {
    style: { position: 'fixed', inset: 0, zIndex: 90, background: 'var(--t-background-overlay-primary)', display: 'flex', padding: 'var(--t-spacing-6)', boxSizing: 'border-box' },
    onClick: function (ev) { if (ev.target === ev.currentTarget) props.onClose(); },
  },
    React.createElement('div', { style: { margin: 'auto', width: 'min(920px, 100%)', maxHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--t-background-primary)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)', overflow: 'hidden', fontFamily: 'var(--t-font-family)' } },
      // Header
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 48, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-4)', borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 } },
        React.createElement(Icon, { name: 'send', size: 16, color: 'var(--t-color-blue)' }),
        React.createElement('span', { style: { flex: 1, fontWeight: 500 } }, 'Xử lý theo nhóm — gửi gợi ý cho ' + all.length + ' khách'),
        React.createElement(IconButton, { Icon: 'x', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Đóng', onClick: props.onClose }),
      ),
      // Body
      React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
        React.createElement(InlineNotice, { tone: 'warn', title: 'Chỉ gửi NHẮC / gợi ý — không phải lệnh' }, 'Mỗi khách nhận tin đã điền số liệu riêng. Việc đặt lệnh (bán, nộp bù, đổi cắt lỗ) phải chốt riêng từng khách kèm ghi âm và cảnh báo rủi ro — không gửi hàng loạt.'),
        React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-3)', flexWrap: 'wrap', alignItems: 'flex-end' } },
          React.createElement(Select, { label: 'Kênh gửi', value: channel, onChange: setChannel, options: [{ value: 'Zalo', label: 'Zalo' }, { value: 'SMS', label: 'SMS' }], style: { width: 160 } }),
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', paddingBottom: 8 } }, 'Độ gấp: ' + groupLabel)),
        React.createElement(Select, { label: 'Mẫu tin đã duyệt', fullWidth: true, value: tplCode, onChange: setTplCode, options: TEMPLATES.map(function (t) { return { value: t.code, label: t.code + ' · ' + t.name + (t.status !== 'Đã duyệt' ? ' (chờ duyệt)' : '') + ' · ' + t.channels.join('/') }; }) }),
        React.createElement(QuoteBox, null, tpl),
        React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', alignItems: 'center', flexWrap: 'wrap', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } },
          T.status === 'Đã duyệt' ? React.createElement(Tag, { text: 'Đã duyệt', color: 'green', size: 'sm', preventShrink: true }) : React.createElement(Tag, { text: 'Chờ duyệt', color: 'orange', size: 'sm', preventShrink: true }),
          React.createElement('span', null, (T.status === 'Đã duyệt' ? 'Duyệt bởi Phòng Tuân thủ · ' + T.approvedAt + ' · ' : 'Đang chờ Phòng Tuân thủ · ') + 'mã ' + T.code + '. Muốn sửa nội dung phải gửi Tuân thủ duyệt lại.')),
        blockedIds.length ? React.createElement(InlineNotice, { tone: 'empty', title: blockedIds.length + ' khách bị loại vì chưa đồng ý nhận ' + channel }, 'Theo Luật Bảo vệ dữ liệu cá nhân, chỉ gửi qua kênh khách đã đồng ý. Gọi điện riêng cho các khách này.') : null,
        // Preview table
        React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-secondary)', fontWeight: 500 } }, 'Xem trước nội dung cá nhân hoá (' + included.length + '/' + all.length + ' sẽ gửi)'),
        React.createElement('div', { style: { border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)', overflow: 'auto' } },
          React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-font-size-md)' } },
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', { style: Object.assign({ width: 36 }, th) }, ''),
              React.createElement('th', { style: Object.assign({ width: 150 }, th) }, 'Khách'),
              React.createElement('th', { style: th }, 'Tin sẽ gửi'),
              React.createElement('th', { style: Object.assign({ width: 110 }, th) }, 'Mức'))),
            React.createElement('tbody', null, all.map(function (c) {
              const blocked = noConsent(c);
              const inc = !excluded[c.id] && !blocked;
              return React.createElement('tr', { key: c.id, style: { opacity: inc ? 1 : 0.45 } },
                React.createElement('td', { style: td }, React.createElement(Checkbox, { checked: inc, disabled: blocked, onChange: function () { if (blocked) return; setExcluded(function (x) { const n = Object.assign({}, x); if (inc) n[c.id] = true; else delete n[c.id]; return n; }); }, ariaLabel: 'Gửi' })),
                React.createElement('td', { style: td }, React.createElement('div', { style: { fontWeight: 500 } }, c.name), React.createElement('div', { style: Object.assign({ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }, mono) }, c.acc)),
                React.createElement('td', { style: td }, blocked ? React.createElement(Tag, { text: 'Chưa đồng ý nhận ' + channel, color: 'gray', size: 'sm', preventShrink: true }) : fillTpl(tpl, c)),
                React.createElement('td', { style: td }, levelTag(EV[c.id].status)));
            }))),
        ),
      ),
      // Footer
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-4)', borderTop: '1px solid var(--t-border-color-light)', flexShrink: 0 } },
        React.createElement('span', { style: { flex: 1, fontSize: 'var(--t-font-size-sm)', color: sendBlock ? 'var(--t-tag-text-red)' : 'var(--t-font-color-tertiary)' } }, sendBlock || ('Gửi ' + channel + ' cho ' + included.length + ' khách, tạo ' + included.length + ' việc “gọi lại” vào ngày mai và ghi vào nhật ký.')),
        React.createElement(Button, { title: 'Đóng', variant: 'secondary', size: 'small', onClick: props.onClose }),
        React.createElement(Button, { title: 'Gửi nhắc cho ' + included.length + ' khách', accent: 'blue', size: 'small', Icon: 'send', disabled: !!sendBlock, onClick: send }),
      ),
    ),
  );
}

/* =========================================================================
   Ô TÌM KIẾM KHÁCH (port searchRun() của bản gốc)
   - ≥3 ký tự. Đủ 10 số → tìm số điện thoại chủ TK + người được uỷ quyền; không có → "Số lạ".
   - Số nhưng chưa đủ 10 → tìm theo số tài khoản. Chữ → tên (bỏ dấu) hoặc số tài khoản.
   - Luôn nhắc xác minh người gọi.
   focusSearch(opts) gọi được từ mọi nơi (menu trái, phím "/", nút Tạo sự kiện):
   nếu ô tìm đang hiển thị thì focus ngay, nếu không thì về danh sách rồi focus (one-shot).
   ========================================================================= */
function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
function searchRun(q) {
  q = (q || '').trim();
  if (q.length < 3) return { short: true, hits: [], total: 0, note: null };
  const digits = q.replace(/[\s.\-]/g, ''), isDigits = /^\d+$/.test(digits), hits = [];
  let note = null;
  if (isDigits && digits.length === 10) {
    DB.forEach(function (c) {
      if (c.phone === digits) hits.push({ c: c, rel: [React.createElement('b', { key: 'b' }, 'Chủ tài khoản')] });
      c.authorized.forEach(function (a, ai) { if (a.phone === digits) hits.push({ c: c, rel: [React.createElement('b', { key: 'b' + ai }, 'Người được uỷ quyền: '), a.name + ' (' + a.rel + ') · ' + a.scope] }); });
    });
    if (!hits.length) note = { tone: 'warn', title: 'Số lạ', text: 'Số ' + mask(digits) + ' không thuộc khách nào trong sổ của bạn. Không trao đổi thông tin tài khoản.' };
  } else if (isDigits) {
    note = { tone: 'info', text: 'Gõ đủ 10 số để tìm theo số điện thoại. Đang tìm theo số tài khoản.' };
    DB.forEach(function (c) { if (c.acc.indexOf(digits) >= 0) hits.push({ c: c }); });
    hits.sort(function (a, b) { return EV[a.c.id].status - EV[b.c.id].status; });
  } else {
    const nq = norm(q), lq = q.toLowerCase();
    DB.forEach(function (c) { if (norm(c.name).indexOf(nq) >= 0 || c.acc.toLowerCase().indexOf(lq) >= 0) hits.push({ c: c }); });
    hits.sort(function (a, b) { return EV[a.c.id].status - EV[b.c.id].status; });
  }
  if (!hits.length && !note) note = { tone: 'info', text: 'Không có khách nào khớp.' };
  return { short: false, hits: hits.slice(0, 8), total: hits.length, note: note };
}

const SEARCH = { api: null, pending: null };
function focusSearch(opts) {
  opts = opts || {};
  if (SEARCH.api) { SEARCH.api(opts); return; }
  SEARCH.pending = opts;          // ListScreen chưa hiển thị → về danh sách, SearchBox nhận khi mount
  location.hash = '';
}

function SearchBox(props) {
  const init = props.initial || null;    // { q, pick } từ deep link #tim= / #tim-evt=
  const [q, setQ] = React.useState(init ? init.q : '');
  const [open, setOpen] = React.useState(!!init);
  const [pick, setPick] = React.useState(!!(init && init.pick));  // chế độ "Chọn khách để tạo sự kiện"
  const [active, setActive] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const wrapRef = React.useRef(null);

  const focusInput = function () { setTimeout(function () { const el = wrapRef.current && wrapRef.current.querySelector('input'); if (el) el.focus(); }, 0); };
  const close = function () { setOpen(false); setPick(false); };

  // Đăng ký API để menu trái / phím "/" / nút Tạo sự kiện gọi được
  React.useEffect(function () {
    SEARCH.api = function (opts) { setPick(!!opts.pick); setOpen(true); setActive(0); focusInput(); };
    if (SEARCH.pending) { const p = SEARCH.pending; SEARCH.pending = null; SEARCH.api(p); }
    else if (init) focusInput();
    return function () { SEARCH.api = null; };
  }, []);
  // Deep link đổi trong khi đang ở danh sách (#tim=a → #tim=b)
  React.useEffect(function () {
    if (!init) return;
    setQ(init.q); setPick(!!init.pick); setOpen(true); setActive(0); focusInput();
  }, [init ? init.q + '|' + init.pick : '']);
  // Đóng khi bấm ra ngoài
  React.useEffect(function () {
    if (!open) return;
    const onDown = function (ev) { if (wrapRef.current && !wrapRef.current.contains(ev.target)) close(); };
    document.addEventListener('mousedown', onDown);
    return function () { document.removeEventListener('mousedown', onDown); };
  }, [open]);

  const res = searchRun(q);
  const visible = open && (!res.short || pick);

  function choose(id) {
    const toEvt = pick;
    setQ(''); close();
    const el = wrapRef.current && wrapRef.current.querySelector('input'); if (el) el.blur();
    location.hash = 'khach-' + id + (toEvt ? '.evt' : '');
  }
  function onKeyDown(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); close(); ev.target.blur(); return; }
    if (!visible || !res.hits.length) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const n = res.hits.length;
      setActive(function (a) { return ((Math.min(a, n - 1) + (ev.key === 'ArrowDown' ? 1 : -1)) + n) % n; });
    }
    if (ev.key === 'Enter') { ev.preventDefault(); choose(res.hits[Math.min(active, res.hits.length - 1)].c.id); }
  }

  const noteText = { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', padding: 'var(--t-spacing-1) var(--t-spacing-1)', lineHeight: 1.4 };
  const kbd = { fontFamily: 'inherit', fontSize: 'var(--t-font-size-xs)', color: 'var(--t-font-color-light)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-sm)', padding: '0 4px', height: 16, display: 'inline-flex', alignItems: 'center', background: 'var(--t-background-primary)' };

  const body = [];
  if (res.short) body.push(React.createElement('div', { key: 'short', style: noteText }, 'Gõ ít nhất 3 ký tự: tên, số tài khoản hoặc đủ 10 số điện thoại.'));
  if (res.note) body.push(res.note.tone === 'warn'
    ? React.createElement(InlineNotice, { key: 'note', tone: 'warn', title: res.note.title }, res.note.text)
    : React.createElement('div', { key: 'note', style: noteText }, res.note.text));
  res.hits.forEach(function (x, i) {
    const c = x.c, isActive = i === Math.min(active, res.hits.length - 1);
    body.push(React.createElement('div', {
      key: c.id + '-' + i, onMouseEnter: function () { setActive(i); }, onClick: function () { choose(c.id); },
      style: { display: 'flex', flexDirection: 'column', borderRadius: 'calc(var(--t-border-radius-md) - var(--t-spacing-1))', background: x.rel && isActive ? 'var(--t-background-transparent-light)' : 'transparent', cursor: 'pointer' },
    },
      React.createElement(MenuItem, {
        focused: isActive,
        LeftComponent: React.createElement(Avatar, { placeholder: c.name, size: 'sm', type: 'rounded' }),
        text: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'baseline', gap: 'var(--t-spacing-2)', minWidth: 0 } },
          React.createElement('span', { style: { fontWeight: 500, color: 'var(--t-font-color-primary)', overflow: 'hidden', textOverflow: 'ellipsis' } }, c.name),
          React.createElement('span', { style: Object.assign({ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }, mono) }, c.acc)),
        RightComponent: React.createElement('span', { style: { display: 'inline-flex', gap: 4, flexShrink: 0 } }, tierTag(c.tier), levelTag(EV[c.id].status)),
        style: x.rel ? { background: 'transparent' } : null,
      }),
      x.rel ? React.createElement('div', { style: { padding: '0 var(--t-spacing-1) var(--t-spacing-1) 32px', marginTop: -4, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-secondary)', lineHeight: 1.4 } }, x.rel) : null,
    ));
  });
  if (res.total > 8) body.push(React.createElement('div', { key: 'more', style: noteText }, 'Còn ' + (res.total - 8) + ' khách khác, gõ thêm để thu hẹp.'));

  const dropdown = visible ? React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60 } },
    React.createElement(DropdownMenu, {
      width: 460,
      header: pick ? React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--t-spacing-1)' } }, React.createElement(Icon, { name: 'calendar-plus', size: 14, color: 'var(--t-color-blue)' }), 'Chọn khách để tạo sự kiện') : null,
      footer: React.createElement(InlineNotice, { tone: 'warn', title: 'Chưa xác minh người gọi. Hãy hỏi 2 thông tin cá nhân trước khi nói về tài khoản.' }),
    }, body),
  ) : null;

  return React.createElement('div', {
    ref: wrapRef,
    onFocus: function () { setFocused(true); setOpen(true); },
    onBlur: function () { setFocused(false); },
    style: { position: 'relative', width: 364, flexShrink: 1, minWidth: 200, zIndex: 50 },
  },
    React.createElement(TextInput, {
      LeftIcon: 'search', fullWidth: true, value: q,
      placeholder: pick ? 'Tìm khách để tạo sự kiện' : 'Tìm tên, số tài khoản, hoặc gõ đủ 10 số điện thoại',
      onChange: function (v) { setQ(v); setOpen(true); setActive(0); },
      onKeyDown: onKeyDown,
      inputStyle: { paddingRight: q || focused ? 0 : 20 },
    }),
    (!q && !focused) ? React.createElement('span', { 'aria-hidden': true, style: Object.assign({ position: 'absolute', right: 8, top: 8, pointerEvents: 'none' }, kbd) }, '/') : null,
    dropdown,
  );
}

/* =========================================================================
   MÀN 1 — DANH SÁCH (Sổ khách)
   ========================================================================= */
function ListScreen(props) {
  const [levelFilter, setLevelFilter] = React.useState(null);  // index 0..4 hoặc null
  const [tierFilter, setTierFilter] = React.useState(null);
  const [catFilter, setCatFilter] = React.useState(function () { const mm = /^#loc-cat=(\d)$/.exec(location.hash); return mm ? +mm[1] : null; });      // 1..5 Nhóm vấn đề · deep link test '#loc-cat=1'
  const [sortKey, setSortKey] = React.useState('status');
  const [selectedIds, setSelectedIds] = React.useState(props.initialBulk ? DB.filter(function (c) { return EV[c.id].status <= 1; }).slice(0, 8).map(function (c) { return c.id; }) : []);
  const [campaign, setCampaign] = React.useState(!!props.initialBulk);

  // Count theo lọc Hạng (bỏ qua lọc Mức) — giống passes(c, true) ở bản gốc
  const counts = [0, 0, 0, 0, 0];
  DB.forEach(function (c) { if (tierFilter == null || c.tier === tierFilter) counts[EV[c.id].status]++; });

  let rows = DB.filter(function (c) {
    const e = EV[c.id];
    if (levelFilter != null && e.status !== levelFilter) return false;
    if (tierFilter != null && c.tier !== tierFilter) return false;
    if (catFilter != null && !e.issues.some(function (i) { return i.cat === catFilter; })) return false;
    return true;
  });
  rows = rows.slice().sort(function (a, b) {
    const ea = EV[a.id], eb = EV[b.id];
    if (sortKey === 'nav') return eb.m.nav - ea.m.nav;
    if (sortKey === 'ratio') { const ra = ea.m.ratio == null ? 999 : ea.m.ratio, rb = eb.m.ratio == null ? 999 : eb.m.ratio; return ra - rb; }
    return ea.status - eb.status || eb.m.nav - ea.m.nav;
  });

  // Thứ tự cột theo mức ưu tiên đọc: ai · gấp mức nào · vì sao · hạn · số liệu · hồ sơ
  const columns = [
    { id: 'name',    label: 'Khách',          type: 'text',     width: 200 },
    { id: 'status',  label: 'Trạng thái',     type: 'select',   width: 130 },
    { id: 'reason',  label: 'Nguyên nhân',    type: 'text',     width: 400 },
    { id: 'due',     label: 'Hạn',            type: 'date',     width: 120 },
    { id: 'nav',     label: 'NAV',            type: 'currency', width: 110 },
    { id: 'ratio',   label: 'Tỷ lệ ký quỹ',   type: 'number',   width: 120 },
    { id: 'contact', label: 'Liên hệ gần nhất', type: 'date',   width: 160 },
    { id: 'tier',    label: 'Hạng',           type: 'select',   width: 110 },
    { id: 'acc',     label: 'Số tài khoản',   type: 'text',     width: 130 },
  ];

  function renderCell(c, col) {
    const e = EV[c.id], m = e.m;
    switch (col.id) {
      case 'name':
        return React.createElement(Chip, { label: c.name, avatarType: 'rounded', isBold: true, onClick: function () { props.onOpen(c.id); } });
      case 'acc':
        return React.createElement('span', { style: Object.assign({ color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)' }, mono) }, c.acc);
      case 'tier':
        return tierTag(c.tier);
      case 'nav':
        return React.createElement('span', { style: Object.assign({ width: '100%', textAlign: 'right' }, num) }, U.money(m.nav));
      case 'ratio':
        return React.createElement('span', { style: Object.assign({ width: '100%', textAlign: 'right', color: ratioColor(m.ratio), fontWeight: m.ratio != null && m.ratio < TH.safe ? 600 : 400 }, num) },
          !c.margin ? '—' : c.margin.dataMissing ? 'chưa có' : U.pct(m.ratio, 0));
      case 'contact': {
        const lc = S.lastContact(c);
        return lc
          ? React.createElement('span', null, daysAgo(lc.at), React.createElement('span', { style: { color: 'var(--t-font-color-light)', fontSize: 'var(--t-font-size-sm)' } }, ' · ' + lc.channel))
          : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có');
      }
      case 'status':
        return levelTag(e.status);
      case 'reason': {
        // Nhãn nhóm nguyên nhân (1 · Tài khoản …) + câu ngắn + số việc khác (như bản gốc: "Nhóm k · …", "còn N việc khác")
        const txt = e.top ? e.top.short
          : e.noData.length ? 'Thiếu số liệu: ' + e.noData[0].reason
          : 'Không có việc cần xử lý';
        const cat = e.top ? e.top.cat : e.noData.length ? e.noData[0].cat : null;
        const more = e.issues.length - 1;
        return React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0, width: '100%' }, title: (cat ? 'Nhóm ' + cat + ' · ' + CATS[cat].short + ' — ' : '') + txt },
          cat ? React.createElement(Tag, { text: cat + ' · ' + CATS[cat].short, color: e.top ? 'gray' : 'gray', size: 'sm', preventShrink: true }) : null,
          React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', color: e.top ? 'var(--t-font-color-primary)' : 'var(--t-font-color-tertiary)' } }, txt),
          more > 0 ? React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, '+' + more + ' việc') : null);
      }
      case 'due': {
        const due = e.top && e.top.due;
        if (!due) return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '—');
        const red = U.dayDiff(TODAY, due.date) <= 0;
        return React.createElement('span', { style: Object.assign({ color: red ? 'var(--t-tag-text-red)' : 'var(--t-font-color-secondary)', fontWeight: red ? 500 : 400 }, num) }, dueText(due));
      }
      default: return null;
    }
  }

  const CountTile = function (lv) {
    const active = levelFilter === lv;
    return React.createElement('button', {
      key: lv, type: 'button', onClick: function () { setLevelFilter(active ? null : lv); },
      style: {
        flex: 1, minWidth: 120, textAlign: 'left', cursor: 'pointer', font: 'inherit',
        display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--t-spacing-2) var(--t-spacing-3)',
        border: '1px solid ' + (active ? 'var(--t-color-blue)' : 'var(--t-border-color-medium)'),
        boxShadow: active ? 'inset 0 0 0 1px var(--t-color-blue)' : 'none',
        borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-primary)',
      },
    },
      React.createElement('span', { style: Object.assign({ fontSize: 'var(--t-font-size-lg)', fontWeight: 700, color: 'var(--t-tag-text-' + LEVEL_COLOR[lv] + ')' }, num) }, counts[lv]),
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, LEVELS[lv]),
    );
  };

  const toolbar = React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3) var(--t-spacing-4) 0' },
  },
    React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } }, [0, 1, 2, 3, 4].map(CountTile)),
    // Thanh lọc liền mạch: [Nhóm vấn đề] │ [Hạng] │ Xoá lọc ……… Sắp xếp ▾
    (function () {
      const nOn = [levelFilter, tierFilter, catFilter].filter(function (x) { return x != null; }).length;
      const lbl = function (t) { return React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' } }, t); };
      const divider = function (k) { return React.createElement('span', { key: k, style: { width: 1, height: 16, background: 'var(--t-border-color-medium)', flexShrink: 0 } }); };
      const chip = function (key, text, on, color, onClick) {
        return React.createElement(Tag, { key: key, text: text, color: on ? color : 'gray', onClick: onClick, Icon: on ? 'check' : undefined, style: { cursor: 'pointer' } });
      };
      // Luôn 1 hàng: nhóm chip lọc co lại + cuộn ngang khi màn hẹp, ô Sắp xếp cố định bên phải
      return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 40, padding: '4px var(--t-spacing-2) 4px var(--t-spacing-3)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-secondary)' } },
       React.createElement('div', { className: 'sk-hscroll', style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', overflowX: 'auto', whiteSpace: 'nowrap' } },
        React.createElement(Icon, { name: 'filter', size: 16, color: 'var(--t-font-color-tertiary)', style: { flexShrink: 0 } }),
        lbl('Nhóm vấn đề'),
        [1, 2, 3, 4, 5].map(function (k) { return chip('c' + k, k + '. ' + CATS[k].short, catFilter === k, 'blue', function () { setCatFilter(catFilter === k ? null : k); setSelectedIds([]); }); }),
        divider('d1'),
        lbl('Hạng'),
        ['VIP', 'Thân thiết', 'Phổ thông'].map(function (t) { return chip('t' + t, t, tierFilter === t, TIER_COLOR[t] === 'gray' ? 'blue' : TIER_COLOR[t], function () { setTierFilter(tierFilter === t ? null : t); }); }),
       ),
        // Xoá lọc: nằm ngay trong thanh lọc, viền + chữ xanh, đếm số bộ lọc đang bật
        nOn ? React.createElement(Button, { title: 'Xoá lọc (' + nOn + ')', variant: 'secondary', accent: 'blue', size: 'small', Icon: 'filter-off', style: { flexShrink: 0 },
          onClick: function () { setLevelFilter(null); setTierFilter(null); setCatFilter(null); setSelectedIds([]); } }) : null,
        // Sắp xếp gói gọn trong 1 ô chọn (không có nhãn rời) để thanh lọc không xuống dòng khi hiện "Xoá lọc"
        React.createElement(Select, { sizeVariant: 'sm', value: sortKey, onChange: setSortKey, style: { width: 170, flexShrink: 0 },
          options: [{ value: 'status', label: 'Sắp xếp: Mức độ gấp', Icon: 'arrows-sort' }, { value: 'nav', label: 'Sắp xếp: NAV', Icon: 'arrows-sort' }, { value: 'ratio', label: 'Sắp xếp: Tỷ lệ ký quỹ', Icon: 'arrows-sort' }] }));
    })(),
  );

  // Thanh hành động hàng loạt (SelectionActionBar — mẫu Twenty) khi có dòng được chọn
  const selectedCustomers = selectedIds.map(function (id) { return BY[id]; }).filter(Boolean);
  const actionBar = selectedIds.length ? React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: '0 var(--t-spacing-4)', height: 44, flexShrink: 0, background: 'var(--t-accent-quaternary)', borderBottom: '1px solid var(--t-accent-tertiary)' },
  },
    React.createElement(IconButton, { Icon: 'x', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Bỏ chọn', onClick: function () { setSelectedIds([]); } }),
    React.createElement('span', { style: { fontWeight: 500 } }, 'Đã chọn ' + selectedIds.length + ' khách'),
    React.createElement('span', { style: { flex: 1 } }),
    React.createElement(Button, { title: 'Gửi gợi ý cho ' + selectedIds.length + ' khách', accent: 'blue', size: 'small', Icon: 'send', onClick: function () { setCampaign(true); } }),
  ) : null;

  // Gợi ý chọn cả nhóm khi đang lọc Nhóm vấn đề
  const groupHint = (catFilter != null && rows.length && selectedIds.length !== rows.length) ? React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', margin: '0 var(--t-spacing-4) var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)', fontSize: 'var(--t-font-size-md)' },
  },
    React.createElement(Icon, { name: 'users-group', size: 16, color: 'var(--t-color-blue)' }),
    React.createElement('span', { style: { flex: 1 } }, rows.length + ' khách cùng nhóm “' + CATS[catFilter].short + '”. Có thể xử lý hàng loạt.'),
    React.createElement(Button, { title: 'Chọn tất cả ' + rows.length + ' khách', variant: 'secondary', size: 'small', onClick: function () { setSelectedIds(rows.map(function (r) { return r.id; })); } }),
  ) : null;

  return React.createElement(React.Fragment, null,
    React.createElement(PagePanel, null,
      React.createElement(PageHeader, { title: 'Sổ khách', Icon: 'address-book', iconColor: 'var(--t-color-blue)' },
        React.createElement(SearchBox, { initial: props.initialSearch }),
        React.createElement(Button, { title: 'Tạo sự kiện', accent: 'blue', Icon: 'plus', size: 'small', onClick: function () { focusSearch({ pick: true }); } }),
        React.createElement(IconButton, { Icon: 'dots-vertical', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Thêm' }),
      ),
      actionBar || React.createElement(ViewBar, { viewName: 'Tất cả khách', viewIcon: 'users', count: rows.length }),
      toolbar,
      groupHint,
      React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)' } },
        rows.length
          ? React.createElement(RecordTable, {
              columns: columns, rows: rows, renderCell: renderCell, hasAddColumn: false,
              selectedIds: selectedIds, onSelectionChange: setSelectedIds,
              onRowClick: function (r) { props.onOpen(r.id); },
              addNewLabel: 'Thêm khách', aggregates: { name: rows.length + ' khách' },
            })
          : React.createElement('div', { style: { padding: 'var(--t-spacing-8)' } }, React.createElement(EmptyState, { Icon: 'filter-off', title: 'Không có khách khớp bộ lọc', subtitle: 'Thử bỏ bớt điều kiện lọc.', actionLabel: 'Xoá lọc', onAction: function () { setLevelFilter(null); setTierFilter(null); setCatFilter(null); } })),
      ),
    ),
    campaign ? React.createElement(BulkCampaign, {
      customers: selectedCustomers,
      onClose: function () { setCampaign(false); },
      onSent: function (n, cpId) { setCampaign(false); setSelectedIds([]); props.onToast(React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }, 'Đã gửi gợi ý cho ' + n + ' khách và tạo ' + n + ' việc “gọi lại”. Đặt lệnh vẫn chốt riêng từng khách.', React.createElement(LightButton, { title: 'Xem chiến dịch', accent: 'blue', onClick: function () { location.hash = 'chien-dich-' + cpId; } }))); },
    }) : null,
  );
}

/* =========================================================================
   MÀN 2 — CHI TIẾT KHÁCH (Customer 360)
   ========================================================================= */
function miniTable(head, rows, ids, bgs) {
  const th = { textAlign: 'left', fontWeight: 500, color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)', padding: '4px 8px', borderBottom: '1px solid var(--t-border-color-light)', whiteSpace: 'nowrap' };
  const td = { padding: '6px 8px', borderBottom: '1px solid var(--t-border-color-light)', verticalAlign: 'top' };
  return React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-font-size-md)' } },
      React.createElement('thead', null, React.createElement('tr', null, head.map(function (h, i) {
        return React.createElement('th', { key: i, style: Object.assign({}, th, h.r ? { textAlign: 'right' } : {}) }, h.label);
      }))),
      React.createElement('tbody', null, rows.map(function (r, ri) {
        return React.createElement('tr', { key: ri, id: ids && ids[ri] ? 'r-' + ids[ri] : undefined, style: bgs && bgs[ri] ? { background: bgs[ri] } : undefined }, r.map(function (cell, ci) {
          return React.createElement('td', { key: ci, style: Object.assign({}, td, head[ci] && head[ci].r ? Object.assign({ textAlign: 'right' }, num) : {}) }, cell);
        }));
      })),
    ),
  );
}

/* ---- Bằng chứng ↔ dòng dữ liệu (port relMap/relTags/jump của bản gốc) ----
   DetailScreen đặt CTX mỗi lần render: rm (dòng → vấn đề liên quan), onIssue, onJump, tl (bộ lọc dòng thời gian), onLogUn, onCopy */
const CTX = { rm: {}, onIssue: null, onJump: null, tl: { ch: '', res: '' }, setTl: null, onLogUn: null, onCopy: null };
function relMap(e) {
  const m = {};
  e.issues.forEach(function (i) { (i.evidence || []).forEach(function (v) { m[v.row] = m[v.row] || []; if (m[v.row].indexOf(i) < 0) m[v.row].push(i); }); });
  return m;
}
function relChips(key) {
  const list = CTX.rm[key];
  if (!list || !list.length) return null;
  return React.createElement('span', { style: { display: 'inline-flex', gap: 4, flexWrap: 'wrap' } }, list.map(function (i) {
    return React.createElement(Tag, { key: i.id, text: 'Liên quan: ' + i.title, color: LEVEL_COLOR[i.level], size: 'sm', preventShrink: true, Icon: 'arrow-back-up',
      onClick: function () { CTX.onIssue && CTX.onIssue(i.id); }, style: { cursor: 'pointer' } });
  }));
}
// Bọc một dòng bằng id 'r-<key>' + chip "Liên quan" bên dưới (nếu dòng là bằng chứng của vấn đề nào)
function rowWrap(key, child, indent) {
  const chips = relChips(key);
  return React.createElement('div', { key: key, id: 'r-' + key, style: { borderRadius: 'var(--t-border-radius-sm)' } }, child,
    chips ? React.createElement('div', { style: { paddingLeft: indent == null ? 24 : indent, margin: '2px 0 4px' } }, chips) : null);
}
function evidenceTab(row) { return /^(prof|acct)-/.test(row) ? 'left' : /^(h|sec|tx|cev)-/.test(row) ? 'portfolio' : null; } // [TẠM ẨN HOẠT ĐỘNG] trước đây: : 'history'
function flashEl(el) {
  if (!el) return false;
  el.scrollIntoView({ block: 'center' });
  el.classList.remove('sk-flash'); void el.offsetWidth; el.classList.add('sk-flash');
  return true;
}
// Hồ sơ còn thiếu (3 mức, như bản gốc)
function readiness(c) {
  const sExp = c.survey ? U.addDays(c.survey, TH.surveyDays) : null, sd = sExp ? U.dayDiff(TODAY, sExp) : -1, idd = U.dayDiff(TODAY, c.idExpiry);
  return [
    { name: 'Bắt buộc', items: [['CCCD còn hạn', idd >= 0], ['Khảo sát còn hạn', sd >= 0], ['Số điện thoại', !!c.phone]] },
    { name: 'Cần có', items: [['Mục tiêu đầu tư', !!c.goal], ['Mức lỗ tối đa', !!c.maxLoss], ['Giờ nên liên hệ', !!c.pref]] },
    { name: 'Bổ sung', items: [['Nhãn giao tiếp', c.labels.length > 0], ['Nghề nghiệp', !!c.job]] },
  ];
}
function meter(pct) {
  return React.createElement('span', { style: { display: 'block', height: 6, borderRadius: 3, background: 'var(--t-background-quaternary)', overflow: 'hidden' } },
    React.createElement('span', { style: { display: 'block', height: '100%', width: Math.round(pct) + '%', background: 'var(--t-color-blue)' } }));
}

/* Cột trái 348px (C360 left column): identity · việc cần làm · tài khoản · liên hệ · hồ sơ */
function LeftColumn(props) {
  const c = props.customer, e = EV[c.id], m = e.m;
  const sExp = c.survey ? U.addDays(c.survey, TH.surveyDays) : null, sd = sExp ? U.dayDiff(TODAY, sExp) : -1;
  const idd = U.dayDiff(TODAY, c.idExpiry);
  const flag = function (txt, bad) { return React.createElement(Tag, { text: txt, color: bad ? 'red' : 'yellow', size: 'sm', preventShrink: true, style: { marginLeft: 6 } }); };
  const light = function (t) { return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, t); };
  const ratioVal = !c.margin ? light('Không vay')
    : c.margin.dataMissing ? light('Chưa có số liệu')
    : React.createElement('span', { style: Object.assign({ color: ratioColor(m.ratio), fontWeight: 600 }, num) }, U.pct(m.ratio, 0),
        (m.proj != null && m.proj < TH.call) ? React.createElement('span', { style: { fontWeight: 400, fontSize: 'var(--t-font-size-sm)' } }, ' → ' + U.pct(m.proj, 0) + ' từ ' + U.ddmm(m.projDate)) : null);

  return React.createElement('div', { style: { width: 348, minWidth: 348, flexShrink: 0, boxSizing: 'border-box', background: 'var(--t-background-secondary)', borderRight: '1px solid var(--t-border-color-medium)', overflowY: 'auto' } },
    // Identity
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-4) var(--t-spacing-3) var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
        React.createElement(Avatar, { placeholder: c.name, size: 'xl', type: 'rounded' }),
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--t-font-size-lg)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.name),
          React.createElement('div', { style: Object.assign({ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }, mono) }, c.acc))),
      React.createElement('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, levelTag(e.status, 'md'), tierTag(c.tier),
        c.labels.map(function (l, i) { return React.createElement(Tag, { key: i, text: l, color: 'gray', size: 'sm' }); })),
    ),
    // Việc cần làm ngay — 1 dòng, chi tiết nằm ở tab Vấn đề
    e.top
      ? React.createElement(SuggestionCard, {
          title: 'Việc cần làm ngay',
          summary: React.createElement('span', null, React.createElement('b', null, e.top.title), e.top.due ? ' · hạn ' + dueText(e.top.due).toLowerCase() : ''),
          actionLabel: 'Xem giải pháp', onAction: function () { props.onSolution(e.top); },
          moreCount: e.issues.length - 1, moreLabel: 'vấn đề khác', onMore: function () { props.onTab('issues'); },
        })
      : React.createElement(SuggestionCard, { title: 'Việc cần làm ngay', empty: e.noData.length ? 'Chưa đủ dữ liệu: ' + e.noData[0].reason : 'Không có việc cần xử lý.' }),
    React.createElement(PanelSection, { title: 'Tài khoản', meta: '08:00 ' + U.ddmm(TODAY) },
      React.createElement(KVRow, { label: 'NAV', Icon: 'wallet', value: React.createElement('span', { style: num }, U.money(m.nav)) }),
      rowWrap('acct-ratio', React.createElement(React.Fragment, null,
        React.createElement(KVRow, { label: 'Tỷ lệ ký quỹ', Icon: 'percentage', value: ratioVal }),
        c.margin && !c.margin.dataMissing ? React.createElement('div', { style: { paddingLeft: 24, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Call ' + TH.call + '% · bán giải chấp ' + TH.force + '%') : null)),
      rowWrap('acct-debt', React.createElement(KVRow, { label: 'Đang nợ', Icon: 'credit-card', value: c.margin ? U.money(m.debt) : '—' })),
      React.createElement(KVRow, { label: 'Sức mua', Icon: 'shopping-cart', value: U.money(m.buying) }),
      rowWrap('acct-cash', React.createElement(KVRow, { label: 'Tiền mặt', Icon: 'cash', value: U.money(c.cash) })),
    ),
    React.createElement(PanelSection, { title: 'Liên hệ' },
      React.createElement(KVRow, { label: 'Điện thoại', Icon: 'phone', value: React.createElement('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center' } },
        React.createElement('span', { style: mono }, props.revealed ? c.phone : mask(c.phone)),
        props.revealed ? null : React.createElement(LightButton, { title: 'Hiện', accent: 'blue', onClick: props.onReveal })) }),
      React.createElement(KVRow, { label: 'Ưu tiên liên hệ', Icon: 'clock', value: c.pref || light('Chưa có') }),
      React.createElement(KVRow, { label: 'Người uỷ quyền', Icon: 'users', multiline: !!c.authorized.length, value: c.authorized.length ? c.authorized.map(function (a) { return a.name + ' (' + a.rel + ') — ' + a.scope; }).join('; ') : light('Không có') }),
      React.createElement(KVRow, { label: 'Đồng ý nhận tin', Icon: 'message-check', value: React.createElement('span', { style: { display: 'inline-flex', gap: 4 } },
        React.createElement(Tag, { text: c.consent.zalo ? 'Zalo' : 'Chưa: Zalo', color: c.consent.zalo ? 'green' : 'gray', size: 'sm', preventShrink: true }),
        React.createElement(Tag, { text: c.consent.sms ? 'SMS' : 'Chưa: SMS', color: c.consent.sms ? 'green' : 'gray', size: 'sm', preventShrink: true })) }),
      React.createElement(KVRow, { label: 'Đồng ý ghi âm', Icon: 'microphone', value: c.consent.record ? React.createElement(Tag, { text: 'Có', color: 'green', size: 'sm', preventShrink: true }) : React.createElement(Tag, { text: 'Chưa có', color: 'red', size: 'sm', preventShrink: true }) }),
      React.createElement(KVRow, { label: 'Phụ trách', Icon: 'user-circle', value: 'Chị Lan' }),
    ),
    React.createElement(PanelSection, { title: 'Hồ sơ' },
      React.createElement(KVRow, { label: 'Khách từ', Icon: 'calendar', value: String(c.since) }),
      React.createElement(KVRow, { label: 'Nghề nghiệp', Icon: 'briefcase', value: c.job || light('Chưa có') }),
      React.createElement(KVRow, { label: 'Khẩu vị rủi ro', Icon: 'scale', value: c.appetite }),
      React.createElement(KVRow, { label: 'Mục tiêu', Icon: 'target', multiline: true, value: c.goal + ' · ' + c.horizon }),
      React.createElement(KVRow, { label: 'Chịu lỗ tối đa', Icon: 'trending-down', value: c.maxLoss + '% danh mục' }),
      rowWrap('prof-survey', React.createElement(KVRow, { label: 'Khảo sát', Icon: 'clipboard-check', value: React.createElement('span', null, c.survey ? U.ddmmyyyy(c.survey) : 'Chưa làm', sd < 0 ? flag('Quá hạn', true) : sd <= TH.surveySoon ? flag('Sắp hạn') : null) })),
      rowWrap('prof-id', React.createElement(KVRow, { label: 'CCCD hết hạn', Icon: 'id', value: React.createElement('span', null, U.ddmmyyyy(c.idExpiry), idd < 0 ? flag('Đã hết hạn', true) : idd <= TH.idSoon ? flag('Còn ' + idd + ' ngày') : null) })),
    ),
    (function () {
      const lv = readiness(c), missAll = lv.reduce(function (n, l) { return n + l.items.filter(function (x) { return !x[1]; }).length; }, 0);
      const mustMiss = lv[0].items.some(function (x) { return !x[1]; });
      return React.createElement(PanelSection, { key: 'miss-' + c.id, title: 'Hồ sơ còn thiếu', meta: missAll ? 'thiếu ' + missAll + ' mục' : 'đủ', defaultOpen: mustMiss, last: true },
        lv.map(function (l) {
          const ok = l.items.filter(function (x) { return x[1]; }).length, miss = l.items.filter(function (x) { return !x[1]; });
          return React.createElement('div', { key: l.name, style: { display: 'flex', flexDirection: 'column', gap: 4 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-font-size-sm)' } },
              React.createElement('span', { style: { fontWeight: 500 } }, l.name), React.createElement('span', { style: Object.assign({ color: ok === l.items.length ? 'var(--t-tag-text-green)' : 'var(--t-font-color-tertiary)' }, num) }, ok + '/' + l.items.length)),
            meter(ok / l.items.length * 100),
            miss.length ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: l.name === 'Bắt buộc' ? 'var(--t-tag-text-red)' : 'var(--t-font-color-tertiary)' } }, 'Thiếu: ' + miss.map(function (x) { return x[0]; }).join(', ')) : null);
        }));
    })(),
  );
}

/* Tab Danh mục: cổ phiếu · ngành · giao dịch · lệnh chờ khớp · sự kiện doanh nghiệp
   (không lặp chỉ số tài khoản — đã ở cột trái) */
function PortfolioTab(c, e) {
  const m = e.m;
  if (!c.holdings.length && !c.txns.length) return React.createElement(EmptyState, { Icon: 'chart-pie', title: 'Chưa có cổ phiếu', subtitle: 'Tài khoản đang giữ toàn tiền mặt.' });
  const tot = m.A || 1, secs = {};
  c.holdings.forEach(function (x) { const s = U.sectorOf(x.t); secs[s] = (secs[s] || 0) + U.val(x); });
  const hs = c.holdings.slice().sort(function (a, b) { return U.val(b) - U.val(a); });
  const holdingRows = hs.map(function (x) {
    const p = U.priceOf(x), pl = (p - x.cost) / x.cost * 100;
    return [
      React.createElement('div', null, React.createElement('b', null, x.t),
        x.loan ? React.createElement('div', { style: { marginTop: 2 } }, React.createElement(Tag, { text: 'Tỷ lệ cho vay ' + x.loan.from + '% → ' + x.loan.to + '% từ ' + U.ddmm(x.loan.date), color: 'yellow', size: 'sm', preventShrink: true })) : null,
        relChips('h-' + x.t) ? React.createElement('div', { style: { marginTop: 2 } }, relChips('h-' + x.t)) : null),
      U.sectorOf(x.t), U.fmt(x.qty), U.pct(U.val(x) / tot * 100, 0), U.fmt(x.cost), U.fmt(p),
      React.createElement('span', { style: { color: pl >= 0 ? 'var(--t-tag-text-green)' : 'var(--t-tag-text-red)' } }, (pl >= 0 ? '+' : '') + U.pct(pl)),
    ];
  });
  const navBefore = function (t) { return m.nav + t.amt; };
  const recent = c.txns.filter(function (t) { return t.status !== 'Chờ khớp' && U.dayDiff(t.date, TODAY) <= 7; });
  const pend = c.txns.filter(function (t) { return t.status === 'Chờ khớp'; });
  const sum = function (type) { return recent.filter(function (t) { return t.type === type; }).reduce(function (a, t) { return a + t.amt; }, 0); };
  const nOrd = recent.filter(function (t) { return t.type === 'Mua' || t.type === 'Bán'; }).length;
  const cev = c.holdings.filter(function (x) { const ev = S.CORP[x.t]; return ev && U.dayDiff(TODAY, ev.date) >= 0 && U.dayDiff(TODAY, ev.date) <= 30; });
  const isBig = function (t) { return (t.type === 'Rút tiền' || t.type === 'Nạp tiền') && t.amt / navBefore(t) * 100 >= TH.bigMove; };
  const sub = function (t) { return React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', fontWeight: 500, color: 'var(--t-font-color-tertiary)', marginTop: 'var(--t-spacing-2)' } }, t); };
  const lightLine = function (t) { return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, t); };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    c.holdings.length ? React.createElement(BlockCard, { title: 'Cổ phiếu đang giữ', meta: c.holdings.length + ' mã · giá cuối phiên' },
      miniTable([{ label: 'Mã' }, { label: 'Ngành' }, { label: 'SL', r: true }, { label: 'Tỷ trọng', r: true }, { label: 'Giá mua', r: true }, { label: 'Giá nay', r: true }, { label: 'Lãi/lỗ', r: true }],
        holdingRows, hs.map(function (x) { return 'h-' + x.t; })),
      sub('Theo ngành'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        Object.keys(secs).sort(function (a, b) { return secs[b] - secs[a]; }).map(function (s) {
          const p = secs[s] / tot * 100, over = p > TH.sector;
          return rowWrap('sec-' + s, React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '160px 1fr 48px', gap: 'var(--t-spacing-2)', alignItems: 'center', fontSize: 'var(--t-font-size-sm)', color: over ? 'var(--t-tag-text-yellow)' : 'var(--t-font-color-secondary)', fontWeight: over ? 500 : 400 } },
            React.createElement('span', null, s, over ? ' · vượt ' + TH.sector + '%' : ''),
            React.createElement('span', { style: { height: 8, background: 'var(--t-background-quaternary)', borderRadius: 4, overflow: 'hidden' } }, React.createElement('span', { style: { display: 'block', height: '100%', width: p + '%', background: over ? 'var(--t-tag-text-yellow)' : 'var(--t-color-blue)', opacity: over ? 1 : 0.75 } })),
            React.createElement('span', { style: Object.assign({ textAlign: 'right' }, num) }, U.pct(p, 0))), 0);
        })),
    ) : null,
    React.createElement(BlockCard, { title: 'Giao dịch gần đây', meta: '7 ngày qua' },
      rowWrap('tx-summary', React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-4)', flexWrap: 'wrap', fontSize: 'var(--t-font-size-md)' } },
        React.createElement('span', null, 'Lệnh đã khớp: ', React.createElement('b', null, nOrd)),
        React.createElement('span', null, 'Nạp: ', React.createElement('b', null, U.money(sum('Nạp tiền')))),
        React.createElement('span', null, 'Rút: ', React.createElement('b', null, U.money(sum('Rút tiền')))),
        React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)' } }, '30 ngày: ' + c.trades30 + ' lệnh')), 0),
      recent.length
        ? miniTable([{ label: 'Ngày' }, { label: 'Loại' }, { label: 'Giá trị', r: true }], recent.map(function (t) {
            const big = isBig(t);
            return [U.ddmm(t.date),
              React.createElement('span', null, t.type + (t.t ? ' ' + t.t + ' · ' + U.fmt(t.qty) + ' × ' + U.fmt(t.price) : ''), relChips('tx-' + t.id) ? React.createElement('span', { style: { marginLeft: 6 } }, relChips('tx-' + t.id)) : null),
              React.createElement('span', null, U.money(t.amt), big ? React.createElement('b', null, ' (' + U.pct(t.amt / navBefore(t) * 100, 0) + ' tài sản)') : null)];
          }), recent.map(function (t) { return 'tx-' + t.id; }), recent.map(function (t) { return isBig(t) ? 'var(--t-tag-background-orange)' : null; }))
        : lightLine('Không có giao dịch trong 7 ngày.'),
      sub('Lệnh đang chờ khớp'),
      pend.length ? pend.map(function (t) {
        return rowWrap('tx-' + t.id, React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
          React.createElement('span', null, t.type + ' ' + t.t + ' · ' + U.fmt(t.qty) + ' × ' + U.fmt(t.price) + ' · đặt ' + U.ddmm(t.date)),
          React.createElement(Tag, { text: 'Chờ khớp', color: 'blue', size: 'sm', preventShrink: true })), 0);
      }) : lightLine('Không có'),
      sub('Sự kiện sắp tới của mã đang giữ'),
      cev.length ? cev.map(function (x) {
        const ev = S.CORP[x.t];
        return rowWrap('cev-' + x.t, React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
          React.createElement('b', null, x.t), React.createElement(Tag, { text: U.ddmm(ev.date), color: 'purple', size: 'sm', preventShrink: true }), React.createElement('span', null, ev.text)), 0);
      }) : lightLine('Không có trong 30 ngày tới'),
    ),
  );
}

/* Drawer phải: Xem giải pháp cho MỘT vấn đề của MỘT khách (S.solutions) */
function SolutionPanel(props) {
  const c = props.customer, issue = props.issue, e = EV[c.id];
  const res = S.solutions(c, issue, e);
  const picks = res.options.filter(function (o) { return o.kind === 'choose' || o.kind === 'order' || o.kind === 'action'; }).slice(0, 3);
  const locked = res.options.filter(function (o) { return o.kind === 'locked'; });
  const nothing = res.options.filter(function (o) { return o.kind === 'nothing'; })[0];
  const [pick, setPick] = React.useState(null);
  const LETTERS = ['A', 'B', 'C'];

  const optionCard = function (o, i) {
    const sel = pick === i;
    return React.createElement('div', {
      key: i, onClick: function () { setPick(i); },
      style: { cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, padding: 'var(--t-spacing-3)', border: '1px solid ' + (sel ? 'var(--t-color-blue)' : o.unblock ? 'var(--t-color-orange)' : 'var(--t-border-color-medium)'), boxShadow: sel ? '0 0 0 1px var(--t-color-blue)' : 'none', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-primary)' },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        React.createElement('span', { style: { display: 'inline-grid', placeItems: 'center', width: 20, height: 20, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-accent-tertiary)', color: 'var(--t-accent-accent11)', fontWeight: 600, fontSize: 'var(--t-font-size-sm)' } }, LETTERS[i]),
        React.createElement(Radio, { checked: sel }),
        o.unblock ? React.createElement(Tag, { text: 'Gỡ chặn trước', color: 'orange', size: 'sm', preventShrink: true }) : null,
        React.createElement('span', { style: { flex: 1, minWidth: 0, fontWeight: 500 } }, o.title),
        o.fit ? React.createElement(Tag, { text: o.fit.text, color: o.fit.ok ? 'green' : 'orange', size: 'sm', preventShrink: true }) : null),
      (o.rows && o.rows.length) ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '110px 1fr', gap: '4px 8px', fontSize: 'var(--t-font-size-md)' } },
        o.rows.reduce(function (acc, r) { acc.push(React.createElement('span', { key: acc.length, style: { color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)' } }, r[0])); acc.push(React.createElement('span', { key: acc.length }, r[1])); return acc; }, [])) : null,
      o.kind === 'order' ? React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Có đặt lệnh: cần mã ghi âm và cảnh báo rủi ro khi chốt.') : null,
    );
  };

  const foot = React.createElement(PanelFootRow, { note: pick == null ? 'Chọn một phương án' : '' },
    React.createElement(Button, { title: 'Đóng', variant: 'secondary', size: 'small', onClick: props.onClose }),
    React.createElement(Button, { title: 'Chốt phương án', accent: 'blue', size: 'small', disabled: pick == null, onClick: function () { audit('Chốt phương án', picks[pick].title + ' · ' + issue.title, [c.id]); props.onConfirm(picks[pick]); } }),
  );

  return React.createElement(SidePanel, {
    width: 440, Icon: 'bulb', iconColor: 'var(--t-color-blue)', title: 'Giải pháp', onClose: props.onClose, foot: foot,
  },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } },
      React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, c.name + ' · ' + issue.title),
      // Được làm / Bị chặn
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', fontSize: 'var(--t-font-size-md)' } },
        React.createElement('span', { style: { color: 'var(--t-tag-text-green)', fontWeight: 500 } }, 'Được làm'),
        React.createElement('span', null, res.can.join(' · ') || '—'),
        React.createElement('span', { style: { color: 'var(--t-tag-text-red)', fontWeight: 500 } }, 'Bị chặn'),
        React.createElement('span', null, res.cannot.join(' · ') || 'Không có')),
      // Câu nên hỏi
      (res.ask && res.ask.length) ? React.createElement('div', { style: { padding: 'var(--t-spacing-2) var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
        React.createElement('div', { style: { fontWeight: 500, marginBottom: 4 } }, 'Câu nên hỏi khách'),
        React.createElement('ol', { style: { margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 } }, res.ask.map(function (q, qi) { return React.createElement('li', { key: qi }, q); }))) : null,
      // Phương án chọn
      React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-secondary)', fontWeight: 500 } }, 'Phương án khách chọn'),
      picks.map(optionCard),
      // Bị chặn
      locked.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Bị chặn (không chọn được)'),
        locked.map(function (o, i) { return React.createElement('div', { key: i, style: { padding: 'var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-secondary)', opacity: 0.8 } },
          React.createElement('div', { style: { fontWeight: 500, color: 'var(--t-font-color-secondary)' } }, o.title),
          React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-tag-text-red)' } }, o.lockReason)); })) : null,
      nothing ? React.createElement('div', { style: { padding: 'var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-secondary)' } },
        React.createElement('div', { style: { fontWeight: 500 } }, nothing.title)) : null,
      React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Con số ước tính theo giá 08:00 ' + U.ddmm(TODAY) + ', chỉ để minh hoạ. Broker quyết định và chịu trách nhiệm; khách tự chọn.'),
    ),
  );
}

function IssuesTab(c, e, onSolution) {
  if (!e.issues.length && !e.noData.length) {
    return React.createElement(EmptyState, { Icon: 'circle-check', title: 'Không có vấn đề cần xử lý', subtitle: 'Khách đang ở trạng thái ổn.' });
  }
  const okCats = [1, 2, 3, 4, 5].filter(function (k) { return !e.issues.some(function (i) { return i.cat === k; }) && !e.noData.some(function (n) { return n.cat === k; }); });
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    e.issues.map(function (i, idx) {
      const first = idx === 0;
      const BLOCK = { now: ['Đang bị chặn: ', 'orange'], soon: ['Sắp bị chặn: ', 'yellow'], will: ['Sẽ bị xử lý: ', 'red'] };
      const blocks = e.blocks.filter(function (b) { return b.code === i.code && b.state !== 'grey'; });
      return React.createElement('div', { key: i.id, id: 'is-' + i.id, style: { borderRadius: 'var(--t-border-radius-md)' } }, React.createElement(BlockCard, {
        highlight: first,
        title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }, first ? React.createElement(Tag, { text: 'Xử lý trước', color: 'blue', size: 'sm', preventShrink: true }) : null, i.title),
        right: React.createElement('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center' } }, levelTag(i.level), i.due ? React.createElement(Tag, { text: 'Hạn: ' + dueText(i.due), color: 'gray', size: 'sm' }) : null, React.createElement(Tag, { text: CATS[i.cat].short, color: 'gray', size: 'sm' })),
      },
        blocks.length ? React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, blocks.map(function (b, bi) { return React.createElement(Tag, { key: bi, text: BLOCK[b.state][0] + b.what, color: BLOCK[b.state][1], size: 'sm' }); })) : null,
        first && i.opener ? React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
          React.createElement('span', { style: { flex: 1, fontStyle: 'italic' } }, React.createElement('span', { style: { display: 'block', fontStyle: 'normal', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Câu mở đầu gợi ý'), '“' + i.opener + '”'),
          React.createElement(LightButton, { title: 'Chép', Icon: 'copy', accent: 'blue', onClick: function () { CTX.onCopy && CTX.onCopy(i.opener); } })) : null,
        React.createElement(KVRow, { label: 'Vì sao', multiline: true, value: i.why }),
        React.createElement(KVRow, { label: 'Nếu không xử lý', multiline: true, value: i.then }),
        React.createElement(KVRow, { label: 'Cách gỡ', multiline: true, value: i.fix }),
        i.evidence && i.evidence.length ? React.createElement(KVRow, { label: 'Bằng chứng', multiline: true, value: React.createElement('span', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, i.evidence.map(function (v, vi) { const can = !!evidenceTab(v.row); /* [TẠM ẨN HOẠT ĐỘNG] bằng chứng ở tab Hoạt động: hiện chip nhưng không bấm */ return React.createElement(Tag, { key: vi, text: v.label, color: can ? 'blue' : 'gray', size: 'sm', Icon: can ? 'arrow-up-right' : undefined, onClick: can ? function () { CTX.onJump && CTX.onJump(v); } : undefined, style: { cursor: can ? 'pointer' : 'default' } }); })) }) : null,
        React.createElement('div', { style: { marginTop: 'var(--t-spacing-1)' } }, React.createElement(Button, { title: 'Xem giải pháp', accent: first ? 'blue' : 'default', variant: first ? 'primary' : 'secondary', size: 'small', Icon: 'bulb', onClick: function () { onSolution(i); } })),
      ));
    }),
    okCats.length ? React.createElement(InlineNotice, { tone: 'empty', title: 'Đang ổn' }, okCats.map(function (k) { return CATS[k].ok; }).join(' · ')) : null,
    e.noData.map(function (n, ni) { return React.createElement(InlineNotice, { key: ni, tone: 'empty', title: 'Chưa đủ dữ liệu — ' + CATS[n.cat].short }, n.reason); }),
  );
}

/* [TẠM ẨN — ngoài phạm vi hiện tại] Tab "Hoạt động" (lịch sử hoạt động): cam kết, việc đang mở, dòng thời gian.
   Bỏ comment khối này + các dòng đánh dấu "[TẠM ẨN HOẠT ĐỘNG]" trong DetailScreen / TodayScreen / evidenceTab để bật lại.
function cmTrack(c, cm) {
  // Thanh tiến độ cam kết: cắt lỗ [mức cắt … giá nay … giá mua] · mục tiêu [giá mua … giá nay … mục tiêu]
  const x = c.holdings.filter(function (y) { return y.t === cm.t; })[0];
  if (!x || cm.status !== 'active') return null;
  const p = U.priceOf(x);
  let lo, hi, d, line;
  if (cm.type === 'cutloss') { lo = cm.level; hi = Math.max(x.cost, p * 1.05); d = (p - cm.level) / p * 100; line = d <= 0 ? 'Đã chạm mức cắt lỗ' : 'Còn ' + U.pct(d) + ' tới mức cắt lỗ'; }
  else { lo = x.cost; hi = Math.max(cm.level, p); d = (cm.level - p) / p * 100; line = d <= 0 ? 'Đã chạm giá mục tiêu' : 'Còn ' + U.pct(d) + ' tới giá mục tiêu'; }
  const near = d <= TH.cutNear, pos = Math.max(0, Math.min(100, (p - lo) / (hi - lo) * 100));
  const lbl = function (t, style) { return React.createElement('span', { style: Object.assign({ position: 'absolute', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' }, style) }, t); };
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 } },
    React.createElement('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 'var(--t-font-size-md)', color: near ? 'var(--t-tag-text-yellow)' : 'var(--t-font-color-secondary)' } }, line, near ? React.createElement(Tag, { text: 'Sắp chạm', color: 'yellow', size: 'sm', preventShrink: true }) : null),
    React.createElement('div', { style: { position: 'relative', height: 8, background: 'var(--t-background-quaternary)', borderRadius: 4, margin: '20px 0 22px' } },
      React.createElement('span', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: pos + '%', background: cm.type === 'cutloss' ? 'var(--t-tag-text-red)' : 'var(--t-tag-text-green)', opacity: 0.35, borderRadius: 4 } }),
      React.createElement('span', { style: { position: 'absolute', top: -4, left: pos + '%', width: 4, height: 16, marginLeft: -2, borderRadius: 2, background: 'var(--t-font-color-primary)' } }),
      lbl((cm.type === 'cutloss' ? 'Cắt lỗ ' : 'Giá mua ') + U.fmt(lo), { left: 0, top: 12 }),
      lbl('Giá nay ' + U.fmt(p), { left: Math.min(pos, 70) + '%', top: -20, transform: 'translateX(-30%)' }),
      lbl((cm.type === 'cutloss' ? 'Giá mua ' + U.fmt(x.cost) : 'Mục tiêu ' + U.fmt(cm.level)), { right: 0, top: 12 })));
}

function HistoryTab(c, e, onLogTask) {
  const cms = c.commitments.slice().sort(function (a, b) { return a.status === b.status ? 0 : a.status === 'active' ? -1 : 1; });
  const tasks = c.tasks.filter(function (t) { return !t.done || (t.doneAt && U.dayDiff(t.doneAt, TODAY) <= 7); }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
  const f = CTX.tl || { ch: '', res: '' };

  const items = [];
  c.events.forEach(function (ev) { items.push({ at: ev.at, kind: 'ev', ev: ev }); });
  c.acct.forEach(function (a) { items.push({ at: a.at, kind: 'acct', a: a }); });
  (c.unlogged || []).forEach(function (u) { items.push({ at: u.at, kind: 'un', u: u }); });
  items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  // Lọc như bản gốc: mục tài khoản chỉ hiện khi không lọc; cuộc gọi chưa ghi theo hướng gọi; sự kiện theo kênh + trạng thái
  const shown = items.filter(function (it) {
    if (it.kind === 'acct') return !f.ch && !f.res;
    if (it.kind === 'un') return (!f.ch || f.ch === it.u.dir) && !f.res;
    return (!f.ch || it.ev.channel === f.ch) && (!f.res || it.ev.result === f.res);
  });
  const n90 = c.events.filter(function (ev) { return U.dayDiff(ev.at, TODAY) <= 90 && ev.result !== 'Đã lên lịch'; }).length;
  const resColor = { 'Hoàn thành': 'green', 'Đã lên lịch': 'blue', 'Không liên lạc được': 'red', 'Dời lịch': 'yellow', 'Hủy': 'gray' };
  const setF = function (k) { return function (v) { const n = Object.assign({}, f); n[k] = v; CTX.setTl && CTX.setTl(n); }; };
  const opts = function (arr) { return arr.map(function (v) { return { value: v, label: v || 'Tất cả' }; }); };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--t-spacing-3)' } },
      React.createElement(BlockCard, { title: 'Cam kết đang hiệu lực' },
        cms.length ? cms.map(function (cm) {
          const title = cm.type === 'review' ? 'Điều kiện xem lại: ' + cm.cond : (cm.type === 'cutloss' ? 'Điểm cắt lỗ ' : 'Giá mục tiêu ') + cm.t + ': ' + U.fmt(cm.level);
          const rd = cm.type === 'review' ? U.dayDiff(TODAY, cm.reviewDate) : null;
          return rowWrap('cm-' + cm.id, React.createElement('div', { style: { opacity: cm.status === 'active' ? 1 : 0.5, padding: '4px 0', borderBottom: '1px solid var(--t-border-color-light)' } },
            React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', fontWeight: 500 } }, title, cm.status !== 'active' ? React.createElement(Tag, { text: 'Đã thay bằng cam kết mới', color: 'gray', size: 'sm', preventShrink: true }) : null),
            React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Hẹn ngày ' + U.ddmmyyyy(cm.date) + ' · ' + cm.by + (cm.note ? ' · ' + cm.note : '')),
            cm.type === 'review'
              ? React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center', fontSize: 'var(--t-font-size-md)', marginTop: 2 } }, rd < 0 ? 'Đã quá hẹn ' + (-rd) + ' ngày' : 'Xem lại ngày ' + U.ddmm(cm.reviewDate) + ' (còn ' + rd + ' ngày)', rd >= 0 && rd <= TH.cutNear ? React.createElement(Tag, { text: 'Sắp chạm', color: 'yellow', size: 'sm' }) : null)
              : cmTrack(c, cm)), 0);
        }) : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có cam kết nào (điểm cắt lỗ, giá mục tiêu, điều kiện xem lại).'),
      ),
      React.createElement(BlockCard, { title: 'Việc đang mở' },
        tasks.length ? tasks.map(function (t) {
          const over = !t.done && t.due.slice(0, 10) < TODAY;
          return rowWrap('task-' + t.id, React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--t-border-color-light)' } },
            React.createElement('span', { style: { flex: 1, minWidth: 0, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--t-font-color-light)' : 'var(--t-font-color-primary)' } }, t.title,
              React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: over ? 'var(--t-tag-text-red)' : 'var(--t-font-color-light)' } }, (t.done ? 'Đã xong ' + U.ddmm(t.doneAt) : over ? 'Quá hạn ' + U.dayDiff(t.due, TODAY) + ' ngày · hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due) : 'Hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due)) + ' · ' + t.channel)),
            t.done ? null : React.createElement(Button, { title: 'Ghi nhận', variant: 'secondary', size: 'small', onClick: function () { onLogTask && onLogTask(t); } })), 0);
        }) : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Không có việc nào đang mở.'),
      ),
    ),

    // Timeline theo mẫu C360 "Hoạt động": icon tròn 24px + đường nối, tiêu đề 500, ngày bên phải
    React.createElement(BlockCard, { title: 'Hoạt động', meta: '90 ngày qua: ' + n90 + ' lần liên hệ',
      right: React.createElement('span', { style: { display: 'inline-flex', gap: 'var(--t-spacing-2)' } },
        React.createElement(Select, { sizeVariant: 'sm', value: f.ch, onChange: setF('ch'), placeholder: 'Kênh', options: opts(['', 'Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp']), style: { width: 150 } }),
        React.createElement(Select, { sizeVariant: 'sm', value: f.res, onChange: setF('res'), placeholder: 'Trạng thái', options: opts(['', 'Đã lên lịch', 'Hoàn thành', 'Không liên lạc được', 'Dời lịch', 'Hủy']), style: { width: 170 } })) },
      shown.length ? shown.map(function (it, ii) {
        const when = U.ddmm(it.at) + ' · ' + U.hhmm(it.at);
        let icon, iconColor = 'var(--t-font-color-tertiary)', title, body, extra = null, action = null, key = 'x' + ii;
        if (it.kind === 'acct') { icon = 'building-bank'; iconColor = 'var(--t-tag-text-red)'; title = 'Thông báo tài khoản'; body = it.a.text; }
        else if (it.kind === 'un') {
          icon = 'phone-incoming'; iconColor = 'var(--t-tag-text-orange)'; title = it.u.dir + ' · ' + it.u.dur; body = 'Ghi âm ' + it.u.rec;
          extra = React.createElement(Tag, { text: 'Chưa ghi nội dung', color: 'orange', size: 'sm', preventShrink: true });
          action = React.createElement(Button, { title: 'Ghi nhận', variant: 'secondary', size: 'small', onClick: function () { CTX.onLogUn && CTX.onLogUn(it.u); } });
        } else {
          const ev = it.ev; key = 'ev-' + ev.id;
          icon = ev.channel === 'Zalo' ? 'message-dots' : ev.channel === 'Gặp trực tiếp' ? 'users' : ev.channel === 'Khách gọi đến' ? 'phone-incoming' : 'phone';
          iconColor = ev.channel === 'Zalo' ? 'var(--t-color-blue)' : 'var(--t-font-color-tertiary)';
          title = ev.channel + ' · ' + ev.purpose;
          body = [ev.note, ev.decision ? 'Kết quả: ' + ev.decision : null, ev.reason ? 'Lí do: ' + ev.reason : null, ev.rec ? 'Mã ghi âm ' + ev.rec + (ev.risk ? ' · đã cảnh báo rủi ro' : '') : null].filter(Boolean).join(' — ');
          extra = React.createElement(Tag, { text: ev.result, color: resColor[ev.result] || 'gray', size: 'sm', preventShrink: true });
        }
        const lastRow = ii === shown.length - 1;
        return rowWrap(key, React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-3)' } },
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 } },
            React.createElement('span', { style: { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', boxSizing: 'border-box', flexShrink: 0 } }, React.createElement(Icon, { name: icon, size: 13, color: iconColor })),
            lastRow ? null : React.createElement('span', { style: { flex: 1, width: 1, background: 'var(--t-border-color-light)', minHeight: 12 } })),
          React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: lastRow ? 0 : 'var(--t-spacing-3)' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minHeight: 24, flexWrap: 'wrap' } },
              React.createElement('span', { style: { fontWeight: 500 } }, title), extra,
              React.createElement('span', { style: { flex: 1 } }),
              React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' } }, when), action),
            body ? React.createElement('span', { style: { color: 'var(--t-font-color-secondary)', lineHeight: 1.4 } }, body) : null)), 36);
      }) : React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)' } }, (f.ch || f.res) ? 'Không có mục nào khớp bộ lọc.' : 'Chưa có hoạt động nào.'),
    ),
  );
}
*/

/* Drawer phải: Tạo sự kiện / Ghi nhận (bản clean — field cốt lõi).
   prefill: { content, issueTitle, order, status, task } */
function EventPanel(props) {
  const c = props.customer, pf = props.prefill || {};
  const [content, setContent] = React.useState(pf.content || '');
  const [channel, setChannel] = React.useState(pf.channel || 'Gọi đi');
  const [status, setStatus] = React.useState(pf.status || (pf.content ? 'Hoàn thành' : 'Đã lên lịch'));
  const [result, setResult] = React.useState(pf.content ? 'Đồng ý' : '');
  const [date, setDate] = React.useState(pf.at ? pf.at.slice(0, 10) : TODAY);
  const [time, setTime] = React.useState(pf.at ? pf.at.slice(11, 16) : nowHM());
  const [order, setOrder] = React.useState(!!pf.order);
  const [rec, setRec] = React.useState('GA-' + TODAY.replace(/-/g, '') + '-' + nowHM().replace(':', ''));
  const [risk, setRisk] = React.useState(false);
  const [recConsent, setRecConsent] = React.useState(false);   // đồng ý ghi âm ngay trong cuộc gọi
  const needConsent = order && !c.consent.record;
  const [err, setErr] = React.useState('');

  const done = status === 'Hoàn thành';
  const CH = ['Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp'];
  const RES = ['Đồng ý', 'Cần suy nghĩ', 'Từ chối', 'Không liên lạc được'];

  function save() {
    if (!content.trim()) { setErr('Hãy nhập nội dung.'); return; }
    if (!date || !time) { setErr('Hãy chọn thời gian.'); return; }
    if (done && !result) { setErr('Hãy chọn kết quả.'); return; }
    if (needConsent && !recConsent) { setErr('Khách chưa đồng ý ghi âm: phải hỏi và tick đồng ý trước khi tư vấn đặt lệnh.'); return; }
    if (order && (!rec.trim() || !risk)) { setErr('Có đặt lệnh: cần mã ghi âm và tick đã cảnh báo rủi ro.'); return; }
    const before = EV[c.id].status, id = 'n' + Date.now();
    const at = (status === 'Đã lên lịch' || status === 'Dời lịch') ? TODAY + 'T' + nowHM() : date + 'T' + time;
    const evt = {
      id: id, at: at, channel: channel, broker: 'Chị Lan',
      purpose: pf.issueTitle ? 'Xử lý vấn đề' : 'Chăm sóc định kỳ',
      result: done && result === 'Không liên lạc được' ? 'Không liên lạc được' : status,
      note: content.trim(), issueTitle: pf.issueTitle || '', option: pf.option || '',
    };
    if (done && result !== 'Không liên lạc được') evt.decision = result;
    if (order) { evt.rec = rec.trim(); evt.risk = true; }
    if (status === 'Đã lên lịch') { evt.note += ' — hẹn ' + U.hhmm(date + 'T' + time) + ' ' + U.ddmm(date + 'T' + time); c.tasks.push({ id: 't' + id, title: content.trim(), due: date + 'T' + time, channel: channel, done: false }); }
    if (pf.task && (status === 'Hủy' || (done && result !== 'Không liên lạc được'))) { pf.task.done = true; pf.task.doneAt = TODAY; }
    if (pf.un) c.unlogged = c.unlogged.filter(function (u) { return u.id !== pf.un.id; });
    if (needConsent && recConsent) { c.consent.record = true; audit('Ghi nhận đồng ý ghi âm', 'Khách đồng ý ghi âm trong cuộc gọi', [c.id]); }
    c.events.push(evt);
    audit('Ghi sự kiện', channel + ' · ' + evt.result + (evt.decision ? ' · ' + evt.decision : '') + (order ? ' · có đặt lệnh, ghi âm ' + evt.rec : ''), [c.id]);
    reval(c);
    const after = EV[c.id].status;
    props.onSaved(after !== before
      ? 'Đã lưu sự kiện. Trạng thái khách đổi từ "' + LEVELS[before] + '" sang "' + LEVELS[after] + '".'
      : 'Đã lưu sự kiện. Trạng thái: ' + LEVELS[after] + '.');
  }

  const foot = React.createElement(PanelFootRow, { note: err ? React.createElement('span', { style: { color: 'var(--t-color-red)' } }, err) : '' },
    React.createElement(Button, { title: 'Hủy', variant: 'secondary', size: 'small', onClick: props.onClose }),
    React.createElement(Button, { title: 'Lưu', accent: 'blue', size: 'small', onClick: save }),
  );

  const dateInput = { height: 32, boxSizing: 'border-box', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-primary)', padding: '0 var(--t-spacing-2)', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', width: '100%' };
  const checkRow = function (checked, set, label, req) {
    return React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', cursor: 'pointer', fontSize: 'var(--t-font-size-md)' } },
      React.createElement(Checkbox, { checked: checked, onChange: function () { set(!checked); }, ariaLabel: label }),
      React.createElement('span', null, label, req ? React.createElement('span', { style: { color: 'var(--t-color-red)' } }, ' *') : null));
  };

  return React.createElement(SidePanel, {
    width: 440, Icon: 'calendar-plus', iconColor: 'var(--t-color-blue)',
    title: pf.task ? 'Ghi nhận việc' : 'Tạo sự kiện', onClose: props.onClose, foot: foot,
  },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } },
      React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, c.name + (pf.issueTitle ? ' · ' + pf.issueTitle : '')),
      React.createElement(TextInput, { label: 'Nội dung *', multiline: true, rows: 3, fullWidth: true, value: content, onChange: setContent, placeholder: 'vd Gọi báo tài khoản bị call, khách chọn nộp thêm tiền' }),
      React.createElement(Select, { label: 'Kênh', fullWidth: true, value: channel, onChange: setChannel, options: CH.map(function (v) { return { value: v, label: v }; }) }),
      React.createElement(RadioGroup, { label: 'Trạng thái', row: true, value: status, onChange: setStatus, options: ['Đã lên lịch', 'Hoàn thành', 'Dời lịch', 'Hủy'].map(function (v) { return { value: v, label: v }; }) }),
      done ? React.createElement(Select, { label: 'Kết quả *', fullWidth: true, value: result, onChange: setResult, placeholder: 'Chọn kết quả', options: RES.map(function (v) { return { value: v, label: v }; }) }) : null,
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--t-spacing-2)' } },
        React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, (status === 'Đã lên lịch' || status === 'Dời lịch') ? 'Ngày hẹn *' : 'Ngày *'),
          React.createElement('input', { type: 'date', value: date, onChange: function (ev) { setDate(ev.target.value); }, style: dateInput })),
        React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Giờ *'),
          React.createElement('input', { type: 'time', value: time, onChange: function (ev) { setTime(ev.target.value); }, style: dateInput }))),
      React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)' } }),
      checkRow(order, setOrder, 'Có khuyến nghị / đặt lệnh'),
      order ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
        React.createElement(TextInput, { label: 'Mã ghi âm / tin nhắn xác nhận *', fullWidth: true, value: rec, onChange: setRec }),
        needConsent ? React.createElement(InlineNotice, { tone: 'warn', title: 'Khách chưa đồng ý ghi âm' }, 'Theo Luật Bảo vệ dữ liệu cá nhân, phải có đồng ý trước khi ghi âm. Hỏi khách ở đầu cuộc gọi.') : null,
        needConsent ? checkRow(recConsent, setRecConsent, 'Khách đã đồng ý ghi âm trong cuộc gọi này', true) : null,
        checkRow(risk, setRisk, 'Đã cảnh báo rủi ro', true)) : null,
    ),
  );
}

function DetailScreen(props) {
  const c = props.customer, e = EV[c.id], m = e.m;
  const TAB_ALIAS = { overview: 'portfolio', portfolio: 'portfolio', issues: 'issues', history: 'issues' }; // [TẠM ẨN HOẠT ĐỘNG] trước đây: history: 'history'
  const [tab, setTab] = React.useState(TAB_ALIAS[props.initialTab] || (e.issues.length ? 'issues' : 'portfolio')); // [TẠM ẨN HOẠT ĐỘNG] trước đây: : 'history'
  const [evtKey, setEvtKey] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [solIssue, setSolIssue] = React.useState(props.initialSol && e.issues.length ? e.issues[0] : null);
  const [evtPrefill, setEvtPrefill] = React.useState(function () {   // object => EventPanel mở
    const tk = props.initialTask && c.tasks.filter(function (t) { return t.id === props.initialTask; })[0];
    if (tk) return { task: tk, content: tk.title, channel: tk.channel, status: 'Hoàn thành' };
    const un = props.initialUn && c.unlogged.filter(function (u) { return u.id === props.initialUn; })[0];
    if (un) return unPrefill(un);
    if (props.initialEvt || props.initialOrder) return props.initialOrder ? { order: true, status: 'Hoàn thành', channel: 'Gọi đi' } : {};
    return null;
  });
  const [toast, setToast] = React.useState(null);
  const [, setTick] = React.useState(0); // buộc render lại sau khi engine tính lại
  React.useEffect(function () { if (!toast) return; const t = setTimeout(function () { setToast(null); }, 4200); return function () { clearTimeout(t); }; }, [toast]);
  function afterSave(msg) { setEvtPrefill(null); setSolIssue(null); /* [TẠM ẨN HOẠT ĐỘNG] setTab('history'); */ setToast(msg); setTick(function (x) { return x + 1; }); }

  const openTasks = c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; }).length;
  // Tabs theo mẫu C360: label + " · n", không icon
  const tabs = [
    { id: 'issues', label: 'Vấn đề' + (e.issues.length ? ' · ' + e.issues.length : '') },
    { id: 'portfolio', label: 'Danh mục' },
    // [TẠM ẨN HOẠT ĐỘNG] { id: 'history', label: 'Hoạt động' + (openTasks ? ' · ' + openTasks + ' quá hạn' : '') },
  ];
  const ordered = DB.slice().sort(function (a, b) { return EV[a.id].status - EV[b.id].status || EV[b.id].m.nav - EV[a.id].m.nav; });
  const pos = ordered.indexOf(c) + 1;
  const openSolution = function (issue) { setEvtPrefill(null); setSolIssue(issue); };
  const openEvent = function (pf) { setSolIssue(null); setEvtPrefill(pf); setEvtKey(function (k) { return k + 1; }); };

  // Bộ lọc dòng thời gian + nhảy tới bằng chứng / quay lại vấn đề (flash 1.6s)
  const [tl, setTl] = React.useState({ ch: '', res: '' });
  const [jumpTo, setJumpTo] = React.useState(function () {
    const n = props.initialJump != null ? +props.initialJump : null;
    const v = n != null && e.top && e.top.evidence ? e.top.evidence[n] : null;
    return v ? { id: 'r-' + v.row, n: 1 } : null;
  });
  React.useEffect(function () {
    if (props.initialJump == null || !jumpTo) return;
    const v = e.top.evidence[+props.initialJump], t = evidenceTab(v.row);
    if (t && t !== 'left') setTab(t);
  }, []);
  React.useEffect(function () {
    if (!jumpTo) return;
    const run = function () { flashEl(document.getElementById(jumpTo.id)); };
    const t = setTimeout(run, 60);
    return function () { clearTimeout(t); };
  }, [jumpTo, tab]);
  CTX.rm = relMap(e);
  CTX.tl = tl; CTX.setTl = setTl;
  CTX.onJump = function (v) { const t = evidenceTab(v.row); if (!t) return; /* [TẠM ẨN HOẠT ĐỘNG] dòng nằm ở tab Hoạt động */ if (t !== 'left') setTab(t); setJumpTo({ id: 'r-' + v.row, n: Date.now() }); };
  CTX.onIssue = function (id) { setTab('issues'); setJumpTo({ id: 'is-' + id, n: Date.now() }); };
  CTX.onLogUn = function (u) { openEvent(unPrefill(u)); };
  CTX.onCopy = function (txt) {
    const done = function () { setToast('Đã chép câu mở đầu.'); };
    try { navigator.clipboard.writeText(txt).then(done, function () { setToast('Không chép được, hãy chọn và bấm Ctrl + C.'); }); }
    catch (er) { setToast('Không chép được, hãy chọn và bấm Ctrl + C.'); }
  };
  // Panel mở thì cột phải co lại (không khoá độ rộng như C360 gốc) để nội dung không bị cắt và
  // hành vi giống nhau dù mở bằng click hay deep-link.

  // Header dạng breadcrumb như C360 gốc: ← Sổ khách / Tên (vị trí/tổng) · hành động bên phải
  const crumb = React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minWidth: 0, overflow: 'hidden' } },
    React.createElement('span', { onClick: props.onBack, style: { color: 'var(--t-font-color-tertiary)', cursor: 'pointer', whiteSpace: 'nowrap' } }, 'Sổ khách'),
    React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '/'),
    React.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.name),
    React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', fontWeight: 400, color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' } }, '(' + pos + '/' + DB.length + ')'));

  const header = React.createElement(PageHeader, {
    title: crumb,
    icon: React.createElement(IconButton, { Icon: 'arrow-left', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Về sổ khách', onClick: props.onBack }),
  },
    React.createElement(Button, { title: 'Tạo việc', variant: 'secondary', size: 'small', Icon: 'checkbox', onClick: function () { openEvent({ status: 'Đã lên lịch' }); } }),
    React.createElement(Button, { title: 'Ghi cuộc gọi', accent: 'blue', size: 'small', Icon: 'phone', onClick: function () { openEvent({ status: 'Hoàn thành', channel: 'Gọi đi' }); } }),
  );

  const tabBody = tab === 'portfolio' ? PortfolioTab(c, e)
    : tab === 'issues' ? IssuesTab(c, e, openSolution)
    : null; // [TẠM ẨN HOẠT ĐỘNG] trước đây: : HistoryTab(c, e, function (task) { openEvent({ task: task, content: task.title, channel: task.channel, status: 'Hoàn thành' }); });

  const main = React.createElement('div', { style: { flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' } },
    header,
    React.createElement('div', { style: { flex: 1, minHeight: 0, display: 'flex', minWidth: 0, width: '100%', overflow: 'hidden' } },
      React.createElement(LeftColumn, { customer: c, revealed: revealed, onReveal: function () { setRevealed(true); audit('Xem số điện thoại', 'Xem số của ' + c.name, [c.id]); }, onSolution: openSolution, onTab: setTab }),
      React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { flexShrink: 0, minWidth: 0, overflowX: 'auto', overflowY: 'hidden' } },
          React.createElement(Tabs, { tabs: tabs, activeId: tab, onChange: setTab, style: { padding: '0 var(--t-spacing-3)', width: 'max-content', minWidth: '100%' } })),
        React.createElement('div', { style: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' } },
          React.createElement('div', { style: { padding: 'var(--t-spacing-3)' } }, tabBody)),
      ),
    ),
  );

  const toastEl = toast ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 100, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  return React.createElement(PagePanel, null,
    React.createElement('div', { style: { display: 'flex', flex: 1, minHeight: 0 } },
      main,
      solIssue ? React.createElement(SolutionPanel, {
        key: 'sol-' + solIssue.id, customer: c, issue: solIssue, onClose: function () { setSolIssue(null); },
        onConfirm: function (opt) { openEvent({ issueTitle: solIssue.title, option: opt.title, content: 'Khách chọn: ' + opt.title, status: 'Hoàn thành', order: opt.kind === 'order' }); },
      }) : null,
      evtPrefill ? React.createElement(EventPanel, {
        key: 'evt-' + evtKey, customer: c, prefill: evtPrefill, onClose: function () { setEvtPrefill(null); }, onSaved: afterSave,
      }) : null,
    ),
    toastEl,
  );
}

/* =========================================================================
   CHIẾN DỊCH — theo dõi sau khi gửi gợi ý hàng loạt
   Đã gửi → Đã phản hồi → Đã gọi lại → Đã xử lý (tính trực tiếp từ dữ liệu khách)
   ========================================================================= */
const STAGES = ['Đã gửi', 'Đã phản hồi', 'Đã gọi lại', 'Đã xử lý'];
const STAGE_COLOR = { 'Đã gửi': 'gray', 'Đã phản hồi': 'blue', 'Đã gọi lại': 'purple', 'Đã xử lý': 'green' };
function campaignRow(cp, id) {
  const c = BY[id], e = EV[id];
  const task = c.tasks.filter(function (t) { return t.campaignId === cp.id; })[0] || null;
  const after = function (ev) { return ev.at > cp.at; };
  const called = (task && task.done) || c.events.some(function (ev) { return after(ev) && ev.channel === 'Gọi đi' && ev.result === 'Hoàn thành'; });
  const replied = called || hashId(id + cp.id) % 10 < 4 || c.events.some(function (ev) { return after(ev) && ev.channel === 'Khách gọi đến'; });
  const code = cp.topCodes[id];
  const resolved = e.status > cp.snapshot[id] || (code && !e.issues.some(function (i) { return i.code === code; }));
  const stage = resolved ? 'Đã xử lý' : called ? 'Đã gọi lại' : replied ? 'Đã phản hồi' : 'Đã gửi';
  return { id: id, c: c, e: e, task: task, stage: stage, before: cp.snapshot[id] };
}
function campaignStats(cp) {
  const rows = cp.customerIds.map(function (id) { return campaignRow(cp, id); });
  const reach = function (s) { return rows.filter(function (r) { return STAGES.indexOf(r.stage) >= STAGES.indexOf(s); }).length; };
  return { rows: rows, sent: rows.length, replied: reach('Đã phản hồi'), called: reach('Đã gọi lại'), resolved: reach('Đã xử lý') };
}
// Seed 2 chiến dịch cũ từ khách thật để màn hình không trống
(function seedCampaigns() {
  function seed(id, at, tplCode, cat, n, doneRate) {
    const T = TEMPLATES.filter(function (t) { return t.code === tplCode; })[0];
    const picks = DB.filter(function (c) { const t = EV[c.id].top; return t && t.cat === cat && c.consent.zalo && !CAMPAIGNS.some(function (x) { return x.customerIds.indexOf(c.id) >= 0; }); }).slice(0, n);
    const cp = { id: id, at: at, by: 'Chị Lan', channel: 'Zalo', templateCode: T.code, templateName: T.name, body: T.body, customerIds: [], excludedIds: [], snapshot: {}, topCodes: {}, replied: {} };
    picks.forEach(function (c, i) {
      cp.customerIds.push(c.id); cp.snapshot[c.id] = EV[c.id].status; cp.topCodes[c.id] = EV[c.id].top.code;
      const done = (hashId(c.id) % 100) < doneRate * 100;
      const doneAt = U.addDays(at.slice(0, 10), 1), code = EV[c.id].top.code;
      c.tasks.push({ id: 'st' + id + i, title: 'Gọi lại sau gợi ý: ' + EV[c.id].top.short, due: U.addDays(at.slice(0, 10), 2) + 'T09:00', channel: 'Gọi đi', done: done, doneAt: done ? doneAt : null, campaignId: id });
      if (done) {
        // Cuộc gọi lại đã diễn ra → ghi vào lịch sử; một số khách đã tự cập nhật hồ sơ sau khi được nhắc
        c.events.push({ id: 'se' + id + i, at: doneAt + 'T10:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', decision: 'Đồng ý', note: 'Gọi lại sau tin gợi ý ' + T.code + '.' });
        if ((code === 'V-33' || code === 'V-34') && i % 2 === 0) c.survey = doneAt;
        if (code === 'V-32' && i % 2 === 0) c.idExpiry = '2036-11-01';
      }
    });
    cp.excludedIds = DB.filter(function (c) { const t = EV[c.id].top; return t && t.cat === cat && !c.consent.zalo; }).slice(0, 2).map(function (c) { return c.id; });
    CAMPAIGNS.push(cp);
    AUDIT.push({ id: 'a-' + id, at: at, by: 'Chị Lan', action: 'Gửi gợi ý hàng loạt', detail: 'Zalo · mẫu ' + T.code + ' · ' + cp.customerIds.length + ' khách', customerIds: cp.customerIds, ref: id });
  }
  seed('cp1', '2026-10-28T09:30', 'MT-2026-05', 5, 8, 0.6);
  seed('cp2', '2026-11-01T10:15', 'MT-2026-02', 3, 8, 0.3);
  CAMPAIGNS.forEach(function (cp) { cp.customerIds.forEach(function (id) { reval(BY[id]); }); });
})();

function bar(pct, color) {
  return React.createElement('span', { style: { display: 'inline-block', width: 80, height: 6, borderRadius: 3, background: 'var(--t-background-quaternary)', overflow: 'hidden', verticalAlign: 'middle' } },
    React.createElement('span', { style: { display: 'block', height: '100%', width: Math.round(pct) + '%', background: color || 'var(--t-color-blue)' } }));
}
function fmtAt(at) { return U.ddmm(at) + ' · ' + U.hhmm(at); }
function linkSpan(text, onClick) { return React.createElement('span', { onClick: onClick, style: { cursor: 'pointer', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' } }, text); }

function CampaignsScreen(props) {
  const list = CAMPAIGNS.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  const columns = [
    { id: 'name', label: 'Mẫu tin', type: 'text', width: 260 },
    { id: 'channel', label: 'Kênh', type: 'select', width: 90 },
    { id: 'at', label: 'Gửi lúc', type: 'date', width: 130 },
    { id: 'sent', label: 'Đã gửi', type: 'number', width: 90 },
    { id: 'replied', label: 'Đã phản hồi', type: 'number', width: 120 },
    { id: 'called', label: 'Đã gọi lại', type: 'number', width: 110 },
    { id: 'resolved', label: 'Đã xử lý', type: 'number', width: 170 },
  ];
  const st = {}; list.forEach(function (cp) { st[cp.id] = campaignStats(cp); });
  const pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: 'Chiến dịch', Icon: 'send', iconColor: 'var(--t-tag-text-orange)' },
      React.createElement(Button, { title: 'Gửi gợi ý mới', accent: 'blue', size: 'small', Icon: 'plus', onClick: function () { location.hash = ''; props.onToast('Chọn khách ở Sổ khách (lọc Nhóm vấn đề → chọn dòng) rồi bấm “Gửi gợi ý”.'); } })),
    React.createElement(ViewBar, { viewName: 'Tất cả chiến dịch', viewIcon: 'send', count: list.length }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)' } },
      list.length ? React.createElement(RecordTable, {
        columns: columns, rows: list, hasAddColumn: false, addNewLabel: 'Gửi gợi ý mới', onAddNew: function () { location.hash = ''; },
        onRowClick: function (r) { location.hash = 'chien-dich-' + r.id; },
        renderCell: function (cp, col) {
          const s = st[cp.id];
          if (col.id === 'name') return linkSpan(cp.templateCode + ' · ' + cp.templateName, function () { location.hash = 'chien-dich-' + cp.id; });
          if (col.id === 'channel') return React.createElement(Tag, { text: cp.channel, color: 'turquoise', size: 'sm' });
          if (col.id === 'at') return fmtAt(cp.at);
          if (col.id === 'sent') return React.createElement('span', { style: num }, s.sent + (cp.excludedIds.length ? ' (+' + cp.excludedIds.length + ' loại)' : ''));
          if (col.id === 'replied') return React.createElement('span', { style: num }, s.replied + ' · ' + pct(s.replied, s.sent) + '%');
          if (col.id === 'called') return React.createElement('span', { style: num }, s.called);
          if (col.id === 'resolved') return React.createElement('span', { style: Object.assign({ display: 'inline-flex', alignItems: 'center', gap: 6 }, num) }, s.resolved, bar(pct(s.resolved, s.sent), 'var(--t-tag-text-green)'), pct(s.resolved, s.sent) + '%');
          return null;
        },
      }) : React.createElement(EmptyState, { Icon: 'send', title: 'Chưa có chiến dịch', subtitle: 'Chọn nhiều khách cùng vấn đề ở Sổ khách rồi bấm Gửi gợi ý.' })),
  );
}

function CampaignDetailScreen(props) {
  const cp = CAMPAIGNS.filter(function (x) { return x.id === props.id; })[0];
  if (!cp) return React.createElement(PagePanel, null, React.createElement(PageHeader, { title: 'Chiến dịch' }), React.createElement(EmptyState, { Icon: 'send', title: 'Không tìm thấy chiến dịch', actionLabel: 'Về danh sách chiến dịch', onAction: function () { location.hash = 'chien-dich'; } }));
  const s = campaignStats(cp);
  const crumb = React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)' } },
    React.createElement('span', { onClick: function () { location.hash = 'chien-dich'; }, style: { color: 'var(--t-font-color-tertiary)', cursor: 'pointer' } }, 'Chiến dịch'),
    React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '/'),
    React.createElement('span', null, cp.templateCode + ' · ' + cp.templateName));
  const columns = [
    { id: 'name', label: 'Khách', type: 'text', width: 210 },
    { id: 'before', label: 'Mức lúc gửi', type: 'select', width: 130 },
    { id: 'now', label: 'Mức hiện tại', type: 'select', width: 130 },
    { id: 'stage', label: 'Trạng thái chiến dịch', type: 'select', width: 170 },
    { id: 'task', label: 'Việc gọi lại', type: 'date', width: 210 },
    { id: 'msg', label: 'Tin đã gửi', type: 'text', width: 380 },
  ];
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: crumb, icon: React.createElement(IconButton, { Icon: 'arrow-left', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Về chiến dịch', onClick: function () { location.hash = 'chien-dich'; } }) }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
      React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        React.createElement(KpiTile, { label: 'Đã gửi', value: s.sent, sub: cp.channel + ' · ' + fmtAt(cp.at) }),
        React.createElement(KpiTile, { label: 'Đã phản hồi', value: s.replied, sub: Math.round(s.replied / s.sent * 100) + '%' }),
        React.createElement(KpiTile, { label: 'Đã gọi lại', value: s.called }),
        React.createElement(KpiTile, { label: 'Đã xử lý', value: React.createElement('span', { style: { color: 'var(--t-tag-text-green)' } }, s.resolved), sub: Math.round(s.resolved / s.sent * 100) + '% vấn đề đã gỡ' }),
        React.createElement(KpiTile, { label: 'Bị loại vì chưa đồng ý', value: cp.excludedIds.length, sub: 'Cần gọi điện riêng' })),
      React.createElement(BlockCard, { title: 'Nội dung đã gửi', meta: 'Mẫu ' + cp.templateCode + ' · đã duyệt bởi Phòng Tuân thủ' }, React.createElement(QuoteBox, null, cp.body)),
      React.createElement(InlineNotice, { tone: 'warn', title: 'Chốt lệnh vẫn phải làm riêng từng khách' }, 'Tin hàng loạt chỉ để nhắc. Khi khách đồng ý xử lý, mở trang khách để chốt phương án kèm ghi âm và cảnh báo rủi ro.'),
      React.createElement(RecordTable, {
        columns: columns, rows: s.rows, hasAddColumn: false, addNewLabel: '—', aggregates: { name: s.rows.length + ' khách' },
        onRowClick: function (r) { location.hash = 'khach-' + r.id; },
        renderCell: function (r, col) {
          if (col.id === 'name') return React.createElement(Chip, { label: r.c.name, avatarType: 'rounded', isBold: true, onClick: function () { location.hash = 'khach-' + r.id; } });
          if (col.id === 'before') return levelTag(r.before);
          if (col.id === 'now') return levelTag(r.e.status);
          if (col.id === 'stage') return React.createElement(Tag, { text: r.stage, color: STAGE_COLOR[r.stage], size: 'sm', preventShrink: true });
          if (col.id === 'task') return r.task ? React.createElement('span', { style: { color: r.task.done ? 'var(--t-tag-text-green)' : r.task.due.slice(0, 10) < TODAY ? 'var(--t-tag-text-red)' : 'var(--t-font-color-secondary)' } }, r.task.done ? 'Đã gọi ' + U.ddmm(r.task.doneAt) : (r.task.due.slice(0, 10) < TODAY ? 'Quá hạn · ' : 'Hẹn ') + U.hhmm(r.task.due) + ' ' + U.ddmm(r.task.due)) : '—';
          if (col.id === 'msg') return React.createElement('span', { title: fillTpl(cp.body, r.c), style: { overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--t-font-color-secondary)' } }, fillTpl(cp.body, r.c));
          return null;
        },
      })),
  );
}

function AuditScreen() {
  const [act, setAct] = React.useState('');
  const actions = []; AUDIT.forEach(function (a) { if (actions.indexOf(a.action) < 0) actions.push(a.action); });
  const rows = AUDIT.filter(function (a) { return !act || a.action === act; }).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  const ACT_COLOR = { 'Xem số điện thoại': 'gray', 'Ghi sự kiện': 'blue', 'Gửi gợi ý hàng loạt': 'orange', 'Chốt phương án': 'purple', 'Ghi nhận đồng ý ghi âm': 'green' };
  const columns = [
    { id: 'at', label: 'Thời gian', type: 'date', width: 130 },
    { id: 'by', label: 'Người làm', type: 'user', width: 120 },
    { id: 'action', label: 'Hành động', type: 'select', width: 200 },
    { id: 'detail', label: 'Chi tiết', type: 'text', width: 420 },
    { id: 'who', label: 'Khách', type: 'relation', width: 200 },
  ];
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: 'Nhật ký tuân thủ', Icon: 'shield-check', iconColor: 'var(--t-tag-text-purple)' }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3) var(--t-spacing-4) 0', flexWrap: 'wrap' } },
      React.createElement(Select, { label: 'Hành động', value: act, onChange: setAct, options: [{ value: '', label: 'Tất cả' }].concat(actions.map(function (a) { return { value: a, label: a }; })), style: { width: 220 } }),
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', paddingBottom: 8 } }, 'Hệ thống tự lưu mọi thao tác — Zalo không lưu nội dung tin nhắn, nên đây là bản lưu chính thức.')),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)' } },
      React.createElement(RecordTable, {
        columns: columns, rows: rows, hasAddColumn: false, addNewLabel: rows.length + ' mục', aggregates: { at: rows.length + ' mục' },
        renderCell: function (a, col) {
          if (col.id === 'at') return fmtAt(a.at);
          if (col.id === 'by') return a.by;
          if (col.id === 'action') return React.createElement(Tag, { text: a.action, color: ACT_COLOR[a.action] || 'gray', size: 'sm', preventShrink: true });
          if (col.id === 'detail') return React.createElement('span', { title: a.detail, style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, a.detail);
          if (col.id === 'who') {
            if (a.customerIds.length === 1 && BY[a.customerIds[0]]) return React.createElement(Chip, { label: BY[a.customerIds[0]].name, avatarType: 'rounded', onClick: function () { location.hash = 'khach-' + a.customerIds[0]; } });
            return a.ref ? linkSpan(a.customerIds.length + ' khách · xem chiến dịch', function () { location.hash = 'chien-dich-' + a.ref; }) : a.customerIds.length + ' khách';
          }
          return null;
        },
      })),
  );
}

/* =========================================================================
   HÔM NAY CẦN LÀM — hàng việc "next best action" trên toàn bộ sổ khách
   ========================================================================= */
function todayItems() {
  const urgent = [], tasks = [], calls = [], follow = [];
  DB.forEach(function (c) {
    const e = EV[c.id];
    if (e.status <= 1 && e.top && (!e.top.due || U.dayDiff(TODAY, e.top.due.date) <= 2)) urgent.push({ c: c, e: e, issue: e.top });
    c.tasks.forEach(function (t) { if (!t.done && t.due.slice(0, 10) <= TODAY) tasks.push({ c: c, e: e, task: t }); });
    (c.unlogged || []).forEach(function (u) { calls.push({ c: c, e: e, un: u }); });
  });
  CAMPAIGNS.forEach(function (cp) { campaignStats(cp).rows.forEach(function (r) { if (r.stage === 'Đã phản hồi') follow.push({ c: r.c, e: r.e, cp: cp }); }); });
  urgent.sort(function (a, b) {
    if (a.e.status !== b.e.status) return a.e.status - b.e.status;
    const da = a.issue.due ? a.issue.due.date : '9', db = b.issue.due ? b.issue.due.date : '9';
    return da < db ? -1 : da > db ? 1 : 0;
  });
  tasks.sort(function (a, b) { return a.task.due < b.task.due ? -1 : 1; });
  return { urgent: urgent, tasks: tasks, calls: calls, follow: follow, total: urgent.length + tasks.length + calls.length + follow.length };
}

function TodayScreen() {
  const T = todayItems();
  const [filter, setFilter] = React.useState(null);
  const groups = [
    { key: 'urgent', title: 'Xử lý ngay', meta: 'Khẩn / Cao, hạn trong 2 ngày', items: T.urgent, tag: 'Khẩn & cao', color: 'red' },
    { key: 'tasks', title: 'Việc quá hạn / hôm nay', meta: 'Hẹn khách, việc đã hứa', items: T.tasks, tag: 'Việc đến hạn', color: 'orange' },
    { key: 'calls', title: 'Cuộc gọi chưa ghi nhận', meta: 'Khách gọi đến, chưa ghi nội dung', items: T.calls, tag: 'Cuộc gọi chưa ghi', color: 'yellow' },
    { key: 'follow', title: 'Theo dõi chiến dịch', meta: 'Khách đã phản hồi tin, chưa gọi lại', items: T.follow, tag: 'Theo dõi chiến dịch', color: 'blue' },
  ];
  function row(g, it, i) {
    const c = it.c;
    let reason, due = null, dueRed = false, action, go;
    if (g.key === 'urgent') { reason = it.issue.title; if (it.issue.due) { due = dueText(it.issue.due); dueRed = U.dayDiff(TODAY, it.issue.due.date) <= 0; } action = 'Xem giải pháp'; go = 'khach-' + c.id + '.issues.sol'; }
    else if (g.key === 'tasks') { reason = it.task.title + ' · ' + it.task.channel; const od = U.dayDiff(it.task.due, TODAY); due = it.task.due.slice(0, 10) < TODAY ? 'Quá hạn ' + od + ' ngày' : 'Hôm nay ' + U.hhmm(it.task.due); dueRed = it.task.due.slice(0, 10) < TODAY; action = 'Ghi nhận'; go = 'khach-' + c.id + '.issues.task-' + it.task.id; /* [TẠM ẨN HOẠT ĐỘNG] trước đây: .history */ }
    else if (g.key === 'calls') { reason = it.un.dir + ' · ' + it.un.dur + ' · ghi âm ' + it.un.rec; due = fmtAt(it.un.at); action = 'Ghi nhận cuộc gọi'; go = 'khach-' + c.id + '.issues.un-' + it.un.id; /* [TẠM ẨN HOẠT ĐỘNG] trước đây: .history */ }
    else { reason = 'Phản hồi tin “' + it.cp.templateName + '” gửi ' + U.ddmm(it.cp.at); action = 'Gọi lại'; go = 'khach-' + c.id + '.issues.evt'; /* [TẠM ẨN HOẠT ĐỘNG] trước đây: .history */ }
    return React.createElement('div', { key: g.key + i, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 36, padding: '2px 0', borderBottom: '1px solid var(--t-border-color-light)' } },
      React.createElement('span', { style: { width: 92, flexShrink: 0 } }, levelTag(it.e.status)),
      React.createElement('span', { style: { width: 170, flexShrink: 0, minWidth: 0 } }, linkSpan(c.name, function () { location.hash = 'khach-' + c.id; })),
      React.createElement('span', { title: reason, style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--t-font-color-secondary)' } }, reason),
      React.createElement('span', { style: { width: 130, flexShrink: 0, textAlign: 'right', fontSize: 'var(--t-font-size-sm)', color: dueRed ? 'var(--t-tag-text-red)' : 'var(--t-font-color-light)', fontWeight: dueRed ? 500 : 400 } }, due || ''),
      React.createElement(Button, { title: action, size: 'small', variant: g.key === 'urgent' && i === 0 ? 'primary' : 'secondary', accent: g.key === 'urgent' && i === 0 ? 'blue' : 'default', onClick: function () { location.hash = go; } }));
  }
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: React.createElement('span', null, 'Hôm nay cần làm', React.createElement('span', { style: { fontWeight: 400, color: 'var(--t-font-color-light)', marginLeft: 8, fontSize: 'var(--t-font-size-sm)' } }, 'Thứ Tư, 04/11/2026 · ' + T.total + ' việc')), Icon: 'inbox', iconColor: 'var(--t-color-blue)' }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
      React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        groups.map(function (g) {
          const on = filter === g.key;
          return React.createElement('button', { key: g.key, type: 'button', onClick: function () { setFilter(on ? null : g.key); },
            style: { flex: 1, minWidth: 150, textAlign: 'left', cursor: 'pointer', font: 'inherit', display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--t-spacing-2) var(--t-spacing-3)', border: '1px solid ' + (on ? 'var(--t-color-blue)' : 'var(--t-border-color-medium)'), boxShadow: on ? 'inset 0 0 0 1px var(--t-color-blue)' : 'none', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-primary)' } },
            React.createElement('span', { style: Object.assign({ fontSize: 'var(--t-font-size-lg)', fontWeight: 700, color: 'var(--t-tag-text-' + g.color + ')' }, num) }, g.items.length),
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, g.tag));
        })),
      groups.filter(function (g) { return !filter || filter === g.key; }).map(function (g) {
        return React.createElement(BlockCard, { key: g.key, title: g.title + ' · ' + g.items.length, meta: g.meta },
          g.items.length ? g.items.map(function (it, i) { return row(g, it, i); })
            : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Không có mục nào.'));
      })),
  );
}

function PlaceholderScreen(props) {
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: props.title, Icon: props.icon }),
    React.createElement('div', { style: { padding: 'var(--t-spacing-8)' } },
      React.createElement(EmptyState, { Icon: props.icon, title: 'Ngoài phạm vi bản mẫu', subtitle: 'Bản mẫu này tập trung vào Sổ khách, Hôm nay cần làm, Chiến dịch và Nhật ký tuân thủ.', actionLabel: 'Về Sổ khách', onAction: function () { location.hash = ''; } })));
}

/* =========================================================================
   APP + ROUTER
   ========================================================================= */
class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err: err }; }
  render() {
    if (this.state.err) return React.createElement('pre', { style: { whiteSpace: 'pre-wrap', color: '#b42318', padding: 16, fontFamily: 'monospace' } }, 'Lỗi render: ' + this.state.err.message + '\n' + this.state.err.stack);
    return this.props.children;
  }
}

function App() {
  const parseHash = function () {
    const h = location.hash.slice(1);
    // '#tim=<query>' / '#tim-evt=<query>': danh sách + ô tìm đã điền sẵn, dropdown mở (deep link để test)
    const tm = /^tim(-evt)?=(.*)$/.exec(h);
    if (tm) { let qq = tm[2]; try { qq = decodeURIComponent(qq); } catch (er) { /* giữ nguyên */ } return { id: null, search: { q: qq, pick: !!tm[1] } }; }
    if (h === 'hom-nay') return { id: null, screen: 'today' };
    if (h === 'chien-dich') return { id: null, screen: 'campaigns' };
    if (h.indexOf('chien-dich-') === 0) return { id: null, screen: 'campaign', cp: h.slice(11) };
    if (h === 'nhat-ky') return { id: null, screen: 'audit' };
    if (h === 'co-hoi' || h === 'phan-khuc' || h === 'hop-thoai') return { id: null, screen: h };
    if (h.indexOf('khach-') !== 0) return { id: null, screen: 'list' };
    // '#khach-<id>[.issues|.portfolio|.history][.sol][.evt][.order][.task-<id>][.un-<id>][.jump-<n>]'
    const rest = h.slice(6).split('.');
    const pick = function (pre) { const x = rest.filter(function (p) { return p.indexOf(pre) === 0; })[0]; return x ? x.slice(pre.length) : null; };
    return { id: rest[0], screen: 'detail', tab: rest[1] || null, sol: rest.indexOf('sol') >= 0, evt: rest.indexOf('evt') >= 0, order: rest.indexOf('order') >= 0,
      task: pick('task-'), un: pick('un-'), jump: pick('jump-') };
  };
  const [route, setRoute] = React.useState(parseHash());
  React.useEffect(function () {
    const onHash = function () { setRoute(parseHash()); const r = document.getElementById('root'); if (r) r.scrollTop = 0; };
    window.addEventListener('hashchange', onHash);
    // Phím "/" ở bất kỳ đâu (trừ khi đang gõ) → focus ô tìm khách
    const onKey = function (ev) {
      if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target, tag = (t && t.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (t && t.isContentEditable)) return;
      ev.preventDefault(); focusSearch();
    };
    document.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('hashchange', onHash); document.removeEventListener('keydown', onKey); };
  }, []);
  const open = function (id) { location.hash = 'khach-' + id; };
  const back = function () { location.hash = ''; };
  const customer = route.id ? DB.filter(function (c) { return c.id === route.id; })[0] : null;
  const [toast, setToast] = React.useState(null);
  React.useEffect(function () { if (!toast) return; const t = setTimeout(function () { setToast(null); }, 4600); return function () { clearTimeout(t); }; }, [toast]);
  const toastEl = toast ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 110, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  const sc = customer ? 'detail' : (route.screen || 'list');
  const PH = { 'co-hoi': ['Cơ hội', 'target-arrow'], 'phan-khuc': ['Phân khúc', 'chart-pie'], 'hop-thoai': ['Hộp thoại', 'messages'] };
  const body = customer
    ? React.createElement(DetailScreen, { key: location.hash, customer: customer, initialTab: route.tab, initialSol: route.sol, initialEvt: route.evt, initialOrder: route.order, initialTask: route.task, initialUn: route.un, initialJump: route.jump, onBack: back })
    : sc === 'today' ? React.createElement(TodayScreen)
    : sc === 'campaigns' ? React.createElement(CampaignsScreen, { onToast: setToast })
    : sc === 'campaign' ? React.createElement(CampaignDetailScreen, { id: route.cp })
    : sc === 'audit' ? React.createElement(AuditScreen)
    : PH[sc] ? React.createElement(PlaceholderScreen, { title: PH[sc][0], icon: PH[sc][1] })
    : React.createElement(ListScreen, { onOpen: open, onToast: setToast, initialBulk: location.hash === '#bulk', initialSearch: route.search || null });

  return React.createElement(AppLayout, { drawer: React.createElement(Drawer, { screen: sc }) },
    React.createElement(PageBody, null, React.createElement(ErrorBoundary, { key: sc }, body)),
    toastEl,
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
