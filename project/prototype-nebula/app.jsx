/* Sổ khách — dựng lại bằng component thật của Nebula RM Platform Design System.
   Lớp nghiệp vụ (window.SK từ data.js) giữ nguyên; chỉ lớp render được viết lại bằng DS components. */
const DS = window.NebulaRMPlatformDesignSystem_5dfab2;
const {
  AppLayout, PageBody, PagePanel, PageHeader, ViewBar,
  NavigationDrawer, NavigationDrawerHeader, NavigationDrawerSection, NavigationDrawerSectionTitle, NavigationDrawerItem,
  RecordTable, Tabs, Button, IconButton, Chip, Tag, Pill, Avatar, Radio, RadioGroup, Checkbox, Select, TextInput,
  KpiTile, KVRow, BlockCard, Card, CardContent, EmptyState, InlineNotice, Icon,
  SidePanel, PanelFootRow, SuggestionCard, PanelSection, LightButton,
  DropdownMenu, MenuItem, MenuItemSeparator, StatusBanners, BlockState, AiMark, QuoteBox, PanelItemRow, PanelListRow, PanelIdentityHeader, SnackBar, Dialog,
} = DS;

const S = window.SK, U = S.util, TODAY = S.TODAY, TH = S.TH, LEVELS = S.LEVELS, CATS = S.CATS;
const DB = S.build();
(function crashDay() {
  const NAMES = [['Trần Quốc Bảo', 'm', 'Phổ thông'], ['Lê Thị Thanh Hương', 'f', 'Thân thiết'], ['Nguyễn Hữu Phước', 'm', 'Phổ thông'], ['Phạm Ngọc Diệp', 'f', 'Phổ thông'],
    ['Võ Minh Khôi', 'm', 'VIP'], ['Đặng Thị Yến', 'f', 'Phổ thông'], ['Hồ Văn Lực', 'm', 'Thân thiết'], ['Cao Thị Nga', 'f', 'Phổ thông'], ['Lâm Đức Thịnh', 'm', 'Phổ thông'], ['Mai Hoàng Yến', 'f', 'Thân thiết']];
  // tỷ lệ mục tiêu: một ít dưới 30% (bán hôm nay), nhiều 30–35% (đang call), vài người 35–40% (sát call)
  const RATIOS = [0.27, 0.31, 0.32, 0.33, 0.34, 0.34, 0.33, 0.36, 0.38, 0.32];
  const CALLD = ['2026-11-04', '2026-11-03', '2026-11-04', '2026-11-02', '2026-11-04', '2026-11-03', '2026-11-04', null, null, '2026-11-04'];
  NAMES.forEach(function (n, i) {
    const vnd = 30000 + i * 4000, other = 6000 + i * 500;
    const A = (vnd * 15600 + other * 26500) / 1e6, debt = Math.round(A * (1 - RATIOS[i]));
    DB.push({ id: 'd' + String(i + 1).padStart(3, '0'), name: n[0], g: n[1], tier: n[2], acc: '058C9' + String(10000 + i * 71), since: 2022, phone: '0920' + String(100000 + i * 3571).slice(0, 6),
      appetite: 'Mạo hiểm', goal: 'Tăng trưởng tài sản', horizon: '1–3 năm', maxLoss: 25, survey: '2026-04-10', idExpiry: '2032-01-01', authorized: [], labels: [], pref: '', job: '',
      cash: 0, margin: { debt: debt, callDate: CALLD[i] || undefined }, holdings: [{ t: 'VND', qty: vnd, cost: 21000 }, { t: 'HPG', qty: other, cost: 28000 }],
      txns: [], commitments: [], events: [{ id: 'e1', at: '2026-10-' + String(20 + i % 8).padStart(2, '0') + 'T10:00', channel: 'Gọi đi', broker: 'Chị Lan', purpose: 'Chăm sóc định kỳ', result: 'Hoàn thành', note: 'Hỏi thăm.' }],
      tasks: [], unlogged: [], acct: [{ at: '2026-11-04T07:30', text: 'VND giảm sàn phiên 03/11' }], derivatives: false, trades30: 6, tradesAvg: 6, idleDays: 0, crash: true });
  });
})();
const EV = {}, BY = {};
DB.forEach(function (c) { EV[c.id] = S.evaluate(c); BY[c.id] = c; });
// statusOverride: broker đổi trạng thái tay khi chốt phương án (demo) — giữ qua các lần tính lại
function reval(c) { EV[c.id] = S.evaluate(c); if (c.statusOverride != null) EV[c.id].status = c.statusOverride; }
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
// Uỷ quyền KHÁCH → BROKER: chỉ khi có giấy/hợp đồng uỷ quyền còn hiệu lực thì broker mới được nhận/đặt lệnh thay khách
DB.forEach(function (c) {
  const h = hashId(c.id + 'uq'), r = h % 100;
  c.brokerAuth = r < 60 ? { code: 'UQ-2026-' + String(1000 + h % 9000), broker: 'Chị Lan', scope: 'Nhận lệnh qua điện thoại và đặt lệnh thay khách', from: '2026-01-15', to: '2027-01-14' }
    : r < 72 ? { code: 'UQ-2025-' + String(1000 + h % 9000), broker: 'Chị Lan', scope: 'Nhận lệnh qua điện thoại và đặt lệnh thay khách', from: '2025-03-01', to: '2026-10-31' }
    : null;
});
if (BY.c001) BY.c001.brokerAuth = { code: 'UQ-2026-0001', broker: 'Chị Lan', scope: 'Nhận lệnh qua điện thoại và đặt lệnh thay khách', from: '2026-01-15', to: '2027-01-14' };
if (BY.c002) BY.c002.brokerAuth = { code: 'UQ-2025-0002', broker: 'Chị Lan', scope: 'Nhận lệnh qua điện thoại và đặt lệnh thay khách', from: '2025-03-01', to: '2026-10-31' };
if (BY.c003) BY.c003.brokerAuth = null;
// Bổ sung cho kịch bản demo:
//  - c004 có người được uỷ quyền nhưng KHÔNG được đặt lệnh (chỉ xem số dư) + uỷ quyền broker còn hiệu lực
//  - c005 không đồng ý nhận tin qua kênh nào (bị loại khi gửi hàng loạt)
if (BY.c004) {
  BY.c004.authorized = [{ name: 'Phạm Thu Hằng', rel: 'Con gái', phone: '0904556677', scope: 'Chỉ được xem số dư' }];
  BY.c004.brokerAuth = { code: 'UQ-2026-0004', broker: 'Chị Lan', scope: 'Nhận lệnh qua điện thoại và đặt lệnh thay khách', from: '2026-02-01', to: '2027-01-31' };
}
if (BY.c005) { BY.c005.consent.zalo = false; BY.c005.consent.sms = false; }
// Người được uỷ quyền: có ngày hết hạn + quyền rõ ràng (đặt lệnh / nghe số dư)
DB.forEach(function (c) { c.authorized.forEach(function (a) { if (!a.to) a.to = '2027-06-30'; }); });
if (BY.c001) BY.c001.authorized[0].to = '2027-03-31';
if (BY.c002) BY.c002.authorized[0].to = '2026-12-31';
// Lời khách hứa (để broker thấy lần trước khách hứa gì)
if (BY.c003) BY.c003.events[0].promise = { text: 'Nộp tiền bù ký quỹ', due: '2026-11-04' };
if (BY.c001) BY.c001.events[0].promise = { text: 'Quyết nộp tiền hay bán bớt sau 1 tuần', due: '2026-11-04' };
function authRights(a) {
  const sc = (a.scope || '').toLowerCase(), expired = a.to && a.to < TODAY;
  const order = /đặt lệnh/.test(sc) && !/không đặt lệnh/.test(sc);
  const balance = /số dư|nhận thông tin/.test(sc);
  return { order: order && !expired, balance: balance && !expired, expired: expired,
    text: expired ? 'Hết hạn ' + U.ddmmyyyy(a.to) : 'Được: ' + [order ? 'đặt lệnh' : null, balance ? 'nghe số dư' : null].filter(Boolean).join(', ') + ' · Không được: ' + [order ? null : 'đặt lệnh', balance ? null : 'nghe số dư'].filter(Boolean).join(', ') + ' · đến ' + U.ddmmyyyy(a.to) };
}
// Một số điện thoại được uỷ quyền ở nhiều tài khoản → cảnh báo
function phoneOwners(phone, exceptId) {
  const out = [];
  DB.forEach(function (c) {
    if (c.id === exceptId) return;
    if (c.phone === phone) out.push({ c: c, rel: 'Chủ tài khoản' });
    c.authorized.forEach(function (a) { if (a.phone === phone) out.push({ c: c, rel: a.rel + ' (' + a.name + ')' }); });
  });
  return out;
}
function brokerAuthState(c) {
  const a = c.brokerAuth;
  if (!a) return { key: 'none', text: 'Chưa uỷ quyền', color: 'red' };
  if (a.to < TODAY) return { key: 'expired', text: 'Hết hạn ' + U.ddmmyyyy(a.to), color: 'orange' };
  return { key: 'ok', text: 'Có · đến ' + U.ddmmyyyy(a.to), color: 'green' };
}

// Mẫu tin đã được Phòng Tuân thủ duyệt — chỉ nhắc/thông tin, không kêu gọi đặt lệnh (FINRA 2210 / SEC Marketing Rule)
const TEMPLATES = [
  { code: 'MT-2026-01', name: 'Nhắc tỷ lệ ký quỹ', cats: [1], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '15/10/2026', body: '{ten} ơi, em là Lan bên Simplize. Tài khoản của mình có thông tin cần trao đổi, em xin gọi lại trong hôm nay nhé.' },
  { code: 'MT-2026-02', name: 'Nhắc cập nhật hồ sơ', cats: [3], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '15/10/2026', body: '{ten} ơi, {viec}. Mình cập nhật trên ứng dụng hoặc nhắn em hỗ trợ nhé.' },
  { code: 'MT-2026-03', name: 'Rà soát danh mục', cats: [2], channels: ['Zalo'], status: 'Đã duyệt', approvedAt: '20/10/2026', body: '{ten} ơi, {viec}. Em xin hẹn một cuộc gọi ngắn để cùng rà soát theo mục tiêu của mình.' },
  { code: 'MT-2026-04', name: 'Hỏi thăm dòng tiền', cats: [4], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '20/10/2026', body: '{ten} ơi, em là Lan bên Simplize. Nếu mình có kế hoạch gì cần hỗ trợ về tài khoản, em luôn sẵn sàng.' },
  { code: 'MT-2026-05', name: 'Hẹn liên hệ lại', cats: [5], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: '22/10/2026', body: '{ten} ơi, {viec}. Em xin hẹn gọi lại vào giờ mình tiện nhé.' },
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
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Quản lý khách' }),
      item(Object.assign({ label: 'Sổ khách', Icon: 'address-book', active: sc === 'list' || sc === 'detail', onClick: go('so-khach') }, tile('blue'))),
      item(Object.assign({ label: 'Cơ hội', Icon: 'target-arrow', count: SIGNALS.filter(function (x) { return x.status === 'Chờ kiểm chứng'; }).length || undefined, active: sc === 'co-hoi', onClick: go('co-hoi') }, tile('purple'))),
      item(Object.assign({ label: 'Phân khúc', Icon: 'chart-pie', active: sc === 'phan-khuc', onClick: go('phan-khuc') }, tile('pink'))),
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Vận hành' }),
      item(Object.assign({ label: 'Chiến dịch', Icon: 'send', count: CAMPAIGNS.length, active: sc === 'campaigns' || sc === 'campaign', onClick: go('chien-dich') }, tile('orange'))),
      item(Object.assign({ label: 'Hộp thoại', Icon: 'messages', active: sc === 'hop-thoai', onClick: go('hop-thoai') }, tile('turquoise'))),
      item(Object.assign({ label: 'Nhật ký tuân thủ', Icon: 'shield-check', active: sc === 'audit', onClick: go('nhat-ky') }, tile('violet'))),
    ),
    // Mục "Bản mẫu → Kịch bản demo" đã bỏ theo yêu cầu user 2026-11-09 (SCENARIOS/DemoScreen còn trong code, không có đường vào)
  );
}

/* =========================================================================
   MẪU CHUẨN TWENTY / SIMPLIZE — chép từ ui_kits/full-scope/rm-wf-01.build.src.txt
   Page · MvpDashCard · MvpDashRow · SelectionActionBar · MvpToast · RecordSidePanel (khách)
   Chỉ ghép component + token của design system, không sửa design system.
   ========================================================================= */
// Page: PageHeader + nội dung; panel phải nằm cạnh, cùng trong PagePanel (như Page() của source)
function Page(props) {
  return React.createElement(PagePanel, null,
    React.createElement('div', { style: { display: 'flex', flex: 1, minHeight: 0 } },
      React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
        React.createElement(PageHeader, { title: props.title, Icon: props.Icon, icon: props.icon, iconColor: props.iconColor }, props.actions),
        props.children),
      props.rightPanel || null));
}
// Thẻ dashboard: header 40px (icon · tiêu đề · số đếm · "Xem tất cả"), thân là các dòng
function DashCard(props) {
  return React.createElement('div', { style: { gridColumn: props.col, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', overflow: 'hidden' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 40, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 } },
      props.icon,
      React.createElement('span', { style: { flex: 1, minWidth: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, props.title,
        props.count != null ? React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)', fontWeight: 400 } }, ' · ' + props.count) : null),
      props.onLink ? React.createElement(LightButton, { title: props.linkLabel || 'Xem tất cả', Icon: 'arrow-up-right', accent: 'tertiary', onClick: props.onLink }) : null),
    props.children);
}
// Khối trống thu thành 1 dòng 40px (Step 4 §4B.2 của source)
function DashEmpty(props) {
  return React.createElement('div', { style: { gridColumn: props.col, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 40, padding: '0 var(--t-spacing-3)', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, props.icon, props.text);
}
function DashRow(props) {
  const [h, setH] = React.useState(false);
  return React.createElement('div', { onClick: props.onClick, onMouseEnter: function () { setH(true); }, onMouseLeave: function () { setH(false); },
    style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-3)', minHeight: 44, padding: 'var(--t-spacing-2) var(--t-spacing-3)', boxSizing: 'border-box', borderBottom: '1px solid var(--t-border-color-light)', cursor: 'pointer', background: props.on ? 'var(--t-accent-quaternary)' : h ? 'var(--t-background-transparent-light)' : 'transparent', transition: 'background .1s' } },
    props.children);
}
function dashTile(icon, hue) {
  return React.createElement('span', { style: { width: 16, height: 16, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-object-tile-' + hue + ')', border: '1px solid var(--t-object-tile-border-' + hue + ')', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
    React.createElement(Icon, { name: icon, size: 12, color: 'var(--t-tag-text-' + hue + ')' }));
}
// Thanh chọn nhiều dòng nổi giữa đáy (SelectionActionBar của source)
function SelectionBar(props) {
  if (!props.count) return null;
  return React.createElement('div', { style: { position: 'absolute', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 40, padding: '0 var(--t-spacing-2)', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)' } },
    React.createElement('span', { style: { fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-secondary)', padding: '0 var(--t-spacing-2)', whiteSpace: 'nowrap' } }, props.count + ' đã chọn'),
    React.createElement('span', { style: { width: 1, height: 20, background: 'var(--t-border-color-light)' } }),
    props.children,
    React.createElement(IconButton, { Icon: 'x', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Bỏ chọn', onClick: props.onClear }));
}
// Thông báo: SnackBar compact của DS, giữa đáy màn hình (như MvpToast), có thể kèm 1 liên kết
const TOAST = { set: null, t: null };
function showToast(msg, link) {
  if (!TOAST.set) return;
  clearTimeout(TOAST.t);
  TOAST.set({ msg: msg, link: link || null });
  TOAST.t = setTimeout(function () { TOAST.set && TOAST.set(null); }, link ? 5000 : 3200);
}
function ToastHost() {
  const [t, setT] = React.useState(null);
  React.useEffect(function () { TOAST.set = setT; return function () { TOAST.set = null; }; }, []);
  if (!t) return null;
  return React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 120 } },
    React.createElement(SnackBar, { compact: true, title: React.createElement('span', null, t.msg,
      t.link ? React.createElement('span', { onClick: function () { const f = t.link.onClick; setT(null); f(); }, style: { marginLeft: 'var(--t-spacing-2)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 } }, t.link.label) : null) }));
}

/* Cảnh báo khi mở màn khách (RecordBanners của Customer 360 gốc — StatusBanners của DS, hiện 2 rồi "Còn N cảnh báo").
   Thứ tự: đỏ = sắp mất tiền / đang bị chặn · vàng = tuân thủ & việc trễ · xanh = lưu ý khi nói chuyện. */
function customerBanners(c, go) {
  const e = EV[c.id], out = [];
  // Bỏ vấn đề gấp nhất (e.top): đã có ở thẻ "Việc cần làm ngay" ngay bên dưới — tránh 1 việc báo 2 chỗ, 2 nút Xem giải pháp
  const sev = e.issues.filter(function (i) { return i.level <= 1 && i !== e.top; });
  sev.forEach(function (i) {
    out.push({ tone: 'block', text: i.title + (i.due ? ' — hạn ' + dueText(i.due).toLowerCase() : '') + '. ' + i.short, action: 'Xem giải pháp', onAction: function () { go('khach-' + c.id + '.issues.sol'); } });
  });
  const now = e.blocks.filter(function (b) { return b.state === 'now'; }).map(function (b) { return b.what; });
  if (now.length) out.push({ tone: 'block', text: 'Đang bị chặn: ' + now.join(', ') + '.' });
  if (!c.consent.record) out.push({ tone: 'warn', text: 'Khách chưa đồng ý ghi âm — phải hỏi trước khi tư vấn hoặc đặt lệnh.' });
  const bas = brokerAuthState(c);
  if (bas.key !== 'ok') out.push({ tone: 'warn', text: bas.key === 'none' ? 'Khách chưa uỷ quyền cho broker — không được nhận / đặt lệnh thay khách.' : 'Uỷ quyền cho broker đã hết hạn ngày ' + U.ddmmyyyy(c.brokerAuth.to) + ' — cần gia hạn trước khi đặt lệnh thay.' });
  (c.unlogged || []).forEach(function (u) {
    out.push({ tone: 'warn', text: u.dir + ' lúc ' + fmtAt(u.at) + ' chưa ghi nội dung.', action: 'Ghi nhận', onAction: function () { go('khach-' + c.id + '.issues.un-' + u.id); } });
  });
  const late = c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; });
  if (late.length) out.push({ tone: 'warn', text: late.length + ' hẹn đã quá hạn: ' + late[0].title + (late.length > 1 ? '…' : '') + '.', action: 'Ghi nhận', onAction: function () { go('khach-' + c.id + '.issues.task-' + late[0].id); } });
  if (c.margin && c.margin.dataMissing) out.push({ tone: 'info', text: 'Chưa nhận số liệu ký quỹ hôm nay — đừng báo tỷ lệ cho khách khi chưa có số mới.' });
  if (c.authorized.length) out.push({ tone: 'info', text: 'Có người được uỷ quyền: ' + c.authorized.map(function (a) { return a.name + ' (' + a.rel + ') — ' + authRights(a).text.toLowerCase(); }).join('; ') + '. Xác minh đúng người trước khi trao đổi.' });
  return out;
}

// Panel khách bên phải (RecordSidePanel của source): xem nhanh tại chỗ, "Xem chi tiết" mới vào trang đầy đủ
function CustomerPanel(props) {
  const c = BY[props.id];
  if (!c) return null;
  const e = EV[c.id], m = e.m, lc = S.lastContact(c), go = function (h) { return function () { location.hash = h; }; };
  const light = function (t) { return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, t); };
  const ratioVal = !c.margin ? light('Không vay') : c.margin.dataMissing ? light('Chưa có số liệu')
    : React.createElement('span', { style: Object.assign({ color: ratioColor(m.ratio), fontWeight: 500 }, num) }, U.pct(m.ratio, 0) + ((m.proj != null && m.proj < TH.call) ? ' → ' + U.pct(m.proj, 0) + ' từ ' + U.ddmm(m.projDate) : ''));
  const ctx = props.context;
  const [, setTick] = React.useState(0);
  // Panel con "Tạo việc": mở đè trong cùng khung panel, nút ← quay lại panel khách
  const [evt, setEvt] = React.useState(function () { return /\.p=\w+\.evt$/.test(location.hash) ? { status: 'Đã lên lịch' } : null; });
  const firstId = React.useRef(props.id);
  React.useEffect(function () { if (props.id !== firstId.current) { firstId.current = props.id; setEvt(null); } }, [props.id]);
  const others = e.issues.slice(1);
  if (evt) return React.createElement(EventPanel, {
    key: 'pevt-' + c.id, customer: c, prefill: evt, width: 400,
    onBack: function () { setEvt(null); },
    onClose: props.onClose,
    onSaved: function (msg) { setEvt(null); showToast(msg); if (props.onRefresh) props.onRefresh(); setTick(function (x) { return x + 1; }); },
  });
  return React.createElement(SidePanel, {
    width: 400,
    identity: React.createElement(React.Fragment, null,
      React.createElement(PanelIdentityHeader, { title: c.name,
        tags: [{ text: LEVELS[e.status], color: LEVEL_COLOR[e.status] }, { text: c.tier, color: TIER_COLOR[c.tier] || 'gray' }],
        meta: [{ Icon: 'hash', text: c.acc }, { Icon: 'phone', text: mask(c.phone) }],
        onClose: props.onClose, onDetail: go('khach-' + c.id), detailLabel: 'Xem chi tiết' }),
      React.createElement(StatusBanners, { items: customerBanners(c, function (h) { location.hash = h; }), style: { borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 } }),
      ctx ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', flexShrink: 0 } },
        React.createElement(Icon, { name: ctx.icon || 'checklist', size: 14, color: 'currentColor' }),
        React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, ctx.text),
        ctx.label ? React.createElement(LightButton, { title: ctx.label, accent: 'blue', onClick: go(ctx.go) }) : null) : null),
    foot: React.createElement(PanelFootRow, { note: '' },
      React.createElement(Button, { title: 'Tạo việc', variant: 'secondary', size: 'small', Icon: 'checkbox', onClick: function () { const ot = overdueTask(c); setEvt(ot ? { task: ot, content: ot.title, channel: ot.channel, status: 'Dời lịch' } : { status: 'Đã lên lịch' }); } }),
      React.createElement(Button, { title: 'Gọi khách', accent: 'blue', size: 'small', Icon: 'phone', onClick: function () {
        // Ghi cuộc gọi ngay trong panel (không rời danh sách) — giống "Tạo việc"
        const ot = overdueTask(c), it = e.top ? e.top.title : '';
        setEvt(ot ? { task: ot, content: ot.title, channel: 'Gọi đi', status: 'Hoàn thành', issueTitle: it } : { status: 'Hoàn thành', channel: 'Gọi đi', issueTitle: it });
      } })),
  },
    e.top
      ? React.createElement(SuggestionCard, { title: 'Việc cần làm ngay',
          summary: React.createElement('span', null, React.createElement('b', null, e.top.title), e.top.due ? ' · hạn ' + dueText(e.top.due).toLowerCase() : '', React.createElement('br'), e.top.short),
          hint: e.top.opener ? '“' + e.top.opener + '”' : null,
          actionLabel: 'Xem giải pháp', onAction: go('khach-' + c.id + '.issues.sol'),
          moreCount: others.length, moreLabel: 'vấn đề khác', onMore: go('khach-' + c.id + '.issues') })
      : React.createElement(SuggestionCard, { title: 'Việc cần làm ngay', empty: e.noData.length ? 'Chưa đủ dữ liệu: ' + e.noData[0].reason : 'Không có việc cần xử lý.' }),
    contactBlock(c, props.onRefresh || function () { setTick(function (x) { return x + 1; }); }),
    React.createElement(PanelSection, { title: 'Tài khoản', meta: '08:00 ' + U.ddmm(TODAY) },
      React.createElement(KVRow, { label: 'NAV', Icon: 'wallet', value: React.createElement('span', { style: num }, U.money(m.nav)) }),
      React.createElement(KVRow, { label: 'Tỷ lệ ký quỹ', Icon: 'percentage', value: ratioVal }),
      React.createElement(KVRow, { label: 'Đang nợ', Icon: 'credit-card', value: c.margin ? U.money(m.debt) : '—' }),
      React.createElement(KVRow, { label: 'Sức mua', Icon: 'shopping-cart', value: U.money(m.buying) })),
    customerOpportunities(c, function () { setTick(function (x) { return x + 1; }); }),
    React.createElement(PanelSection, { title: 'Liên hệ', last: !others.length },
      React.createElement(KVRow, { label: 'Liên hệ gần nhất', Icon: 'message-circle', value: lc ? daysAgo(lc.at) + ' · ' + lc.channel : light('Chưa có') }),
      React.createElement(KVRow, { label: 'Ưu tiên liên hệ', Icon: 'clock', value: c.pref || light('Chưa có') }),
      React.createElement(KVRow, { label: 'Đồng ý ghi âm', Icon: 'microphone', value: React.createElement(Tag, { text: c.consent.record ? 'Có' : 'Chưa có', color: c.consent.record ? 'green' : 'red', size: 'sm', preventShrink: true }) }),
      React.createElement(KVRow, { label: 'Uỷ quyền cho broker', Icon: 'file-certificate', value: (function () { const st = brokerAuthState(c); return React.createElement(Tag, { text: st.text, color: st.color, size: 'sm', preventShrink: true }); })() })),
    others.length ? React.createElement(PanelSection, { title: 'Vấn đề khác', meta: String(others.length), last: true },
      others.map(function (i) { return React.createElement(PanelListRow, { key: i.id, leading: levelTag(i.level), text: i.title, onClick: go('khach-' + c.id + '.issues') }); })) : null);
}

/* =========================================================================
   XỬ LÝ THEO NHÓM — gửi gợi ý hàng loạt (full-page overlay)
   1 mẫu tin → điền số liệu riêng từng khách → gửi NHẮC + tạo việc gọi lại.
   Đặt lệnh KHÔNG gửi hàng loạt (chốt riêng từng khách).
   ========================================================================= */
// Câu nói với khách theo đúng chuyện của mẫu — không dùng câu nội bộ của engine
function custPhrase(c, i) {
  if (!i) return '';
  const D = function (d) { return U.ddmm(d); };
  switch (i.code) {
    case 'V-31': return 'căn cước của mình đã hết hạn từ ' + D(c.idExpiry) + ' nên tài khoản đang tạm khoá giao dịch';
    case 'V-32': return 'căn cước của mình sẽ hết hạn ngày ' + D(c.idExpiry);
    case 'V-33': return 'phiếu khảo sát khẩu vị đầu tư của mình đã đến hạn làm lại';
    case 'V-34': return 'phiếu khảo sát khẩu vị đầu tư của mình sắp đến hạn làm lại (' + D(i.due.date) + ')';
    case 'V-51': return 'lâu rồi em chưa gọi hỏi thăm mình';
    case 'V-52': return 'em còn nợ mình một cuộc gọi đã hẹn, em xin lỗi vì chậm trễ';
    case 'V-53': return 'từ nay em là người phụ trách tài khoản của mình';
    default: return i.cat === 2 ? 'danh mục của mình có vài điểm em muốn cùng mình xem lại' : 'em có thông tin muốn trao đổi với mình';
  }
}
function tplIssue(c, T) {
  if (!T.cats || !T.cats.length) return EV[c.id].top || { code: '', cat: 0, title: '' };   // mẫu không gắn nhóm (tin AI đã kiểm chứng)
  return EV[c.id].issues.filter(function (i) { return T.cats.indexOf(i.cat) >= 0; })[0] || null;
}
// Tin đã gửi trong chiến dịch: lấy đúng nội dung đã lưu (không điền lại theo số liệu mới)
function cpMsg(cp, c) {
  const sent = c.events.filter(function (ev) { return ev.bulk && ev.campaignId === cp.id; })[0];
  if (sent) return sent.note;
  const T = TEMPLATES.filter(function (t) { return t.code === cp.templateCode; })[0] || { body: cp.body, cats: [] };
  return fillTpl(T, c);
}
function fillTpl(T, c) {
  const viec = custPhrase(c, tplIssue(c, T));
  return T.body.replace(/\{ten\}/g, U.callName(c)).replace(/\{viec\}/g, viec);
}
// Hẹn gọi lại phải TRƯỚC hạn của khách
function callbackDue(c, i) {
  const tomorrow = U.addDays(TODAY, 1) + 'T09:00';
  if (!i || !i.due) return tomorrow;
  const due = i.due.date + 'T' + (i.due.time || '17:00');
  return due > tomorrow ? tomorrow : TODAY + 'T16:00';
}
// Lý do không được gửi hàng loạt (null = gửi được)
function bulkBlock(c, T, channel) {
  if (EV[c.id].issues.some(function (i) { return i.cat === 1; }) || (c.margin && c.margin.dataMissing)) return 'Có chuyện ký quỹ — gọi riêng';
  if (!(channel === 'Zalo' ? c.consent.zalo : c.consent.sms)) return 'Chưa đồng ý nhận ' + channel;
  if (!tplIssue(c, T)) return 'Không có chuyện khớp mẫu này';
  return null;
}
function BulkCampaign(props) {
  const all = props.customers;
  const [channel, setChannel] = React.useState('Zalo');
  // Mẫu mặc định: mẫu đã duyệt hợp với nhóm vấn đề phổ biến nhất trong nhóm khách đã chọn
  const catCount = {};
  all.forEach(function (c) { const t = EV[c.id].top; if (t) catCount[t.cat] = (catCount[t.cat] || 0) + 1; });
  const topCat = +(Object.keys(catCount).sort(function (a, b) { return catCount[b] - catCount[a]; })[0] || 1);
  const TPL = props.extraTemplate ? [props.extraTemplate].concat(TEMPLATES) : TEMPLATES;   // mẫu tin cho tin AI đã kiểm chứng đứng đầu
  const defTpl = props.extraTemplate || TEMPLATES.filter(function (t) { return t.status === 'Đã duyệt' && t.cats.indexOf(topCat) >= 0; })[0] || TEMPLATES[0];
  const [tplCode, setTplCode] = React.useState(defTpl.code);
  const T = TPL.filter(function (t) { return t.code === tplCode; })[0];
  const tpl = T.body;
  const [excluded, setExcluded] = React.useState({});
  const noConsent = function (c) { return !!bulkBlock(c, T, channel); };
  const blockedIds = all.filter(noConsent).map(function (c) { return c.id; });
  const marginIds = all.filter(function (c) { return /ký quỹ/.test(bulkBlock(c, T, channel) || ''); }).map(function (c) { return c.id; });
  const included = all.filter(function (c) { return !excluded[c.id] && !noConsent(c); });
  const sendBlock = T.status !== 'Đã duyệt' ? 'Mẫu đang chờ Tuân thủ duyệt — chưa được gửi.'
    : T.channels.indexOf(channel) < 0 ? 'Mẫu này chỉ được duyệt cho kênh ' + T.channels.join(', ') + '.'
    : included.length === 0 ? 'Không còn khách nào để gửi.' : '';

  // Nhóm theo mức để biết độ gấp
  const byLevel = {};
  all.forEach(function (c) { const s = EV[c.id].status; byLevel[s] = (byLevel[s] || 0) + 1; });
  const groupLabel = Object.keys(byLevel).sort().map(function (s) { return byLevel[s] + ' ' + LEVELS[s]; }).join(' · ');

  function send() {
    const cpId = 'cp' + (CAMPAIGNS.length + 1);
    const snapshot = {}, topCodes = {};
    included.forEach(function (c) { snapshot[c.id] = EV[c.id].status; const t = EV[c.id].top; topCodes[c.id] = t ? t.code : null; });
    included.forEach(function (c) {
      const top = tplIssue(c, T);
      // Tin hàng loạt chỉ ghi "Đã gửi tin" — không tính là đã liên hệ (không làm mới nhịp chăm sóc)
      c.events.push({ id: 'b' + Date.now() + c.id, at: TODAY + 'T' + nowHM(), loggedAt: TODAY, bulk: true, campaignId: cpId, channel: channel, broker: 'Chị Lan', purpose: 'Tin nhắc hàng loạt', result: 'Đã gửi tin', note: fillTpl(T, c), issueTitle: top ? top.title : '' });
      c.tasks.push({ id: 'bt' + Date.now() + c.id, title: 'Gọi lại sau tin ' + T.name.toLowerCase(), due: callbackDue(c, top), channel: 'Gọi đi', done: false, campaignId: cpId });
      reval(c);
    });
    const cp = { id: cpId, at: TODAY + 'T' + nowHM(), by: 'Chị Lan', channel: channel, templateCode: T.code, templateName: T.name, body: T.body,
      customerIds: included.map(function (c) { return c.id; }), excludedIds: blockedIds, snapshot: snapshot, topCodes: topCodes, replied: {} };
    CAMPAIGNS.push(cp);
    audit('Gửi gợi ý hàng loạt', channel + ' · mẫu ' + T.code + ' · ' + included.length + ' khách' + (blockedIds.length ? ' · loại ' + blockedIds.length + ' khách' : ''), cp.customerIds, cp.id);
    props.onSent(included.length, cp.id);
  }

  // Dialog chuẩn của DS (header · thân cuộn · footer, 2 nút bên phải như Full Scope dialog 560)
  return React.createElement(Dialog, {
    title: 'Gửi gợi ý cho ' + all.length + ' khách', Icon: 'send', iconColor: 'var(--t-color-blue)', width: 560, footerAlign: 'end',
    onClose: props.onClose,
    secondary: { title: 'Đóng', onClick: props.onClose },
    primary: { title: 'Gửi cho ' + included.length + ' khách', disabled: !!sendBlock, onClick: send },
    footerLeft: React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: sendBlock ? 'var(--t-tag-text-red)' : 'var(--t-font-color-tertiary)' } }, sendBlock || ('Tạo ' + included.length + ' việc gọi lại trước hạn của từng khách · ghi nhật ký')),
  },
    React.createElement(InlineNotice, { tone: 'warn', title: 'Chỉ gửi nhắc / gợi ý — không phải lệnh' }, 'Đặt lệnh (bán, nộp bù, đổi cắt lỗ) phải chốt riêng từng khách kèm ghi âm và cảnh báo rủi ro.'),
    React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-3)', alignItems: 'flex-end' } },
      React.createElement(Select, { label: 'Kênh gửi', value: channel, onChange: setChannel, options: [{ value: 'Zalo', label: 'Zalo' }, { value: 'SMS', label: 'SMS' }], style: { width: 140 } }),
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', paddingBottom: 8 } }, 'Độ gấp: ' + groupLabel)),
    React.createElement(Select, { label: 'Mẫu tin đã duyệt', fullWidth: true, value: tplCode, onChange: setTplCode, options: TPL.map(function (t) { return { value: t.code, label: t.code + ' · ' + t.name + (t.status !== 'Đã duyệt' ? ' (chờ duyệt)' : '') + ' · ' + t.channels.join('/') }; }) }),
    React.createElement(QuoteBox, null, tpl),
    React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', alignItems: 'center', flexWrap: 'wrap', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } },
      React.createElement(Tag, { text: T.status, color: T.status === 'Đã duyệt' ? 'green' : 'orange', preventShrink: true }),
      React.createElement('span', null, (T.status === 'Đã duyệt' ? 'Phòng Tuân thủ duyệt ' + T.approvedAt : 'Đang chờ Phòng Tuân thủ') + ' · sửa nội dung phải duyệt lại')),
    marginIds.length ? React.createElement(InlineNotice, { tone: 'warn', title: marginIds.length + ' khách có chuyện ký quỹ bị khoá gửi hàng loạt' }, 'Nộp bù, bán giải chấp phải gọi riêng từng khách, theo thứ tự hạn gần nhất.') : null,
    blockedIds.length > marginIds.length ? React.createElement(InlineNotice, { tone: 'empty', title: (blockedIds.length - marginIds.length) + ' khách khác bị loại' }, 'Chưa đồng ý nhận ' + channel + ' (Luật Bảo vệ dữ liệu cá nhân) hoặc không có chuyện khớp mẫu đã chọn. Gọi riêng các khách này.') : null,
    React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Xem trước · ' + included.length + '/' + all.length + ' khách sẽ nhận'),
    // Danh sách xem trước: mỗi dòng = checkbox · khách + mức · tin đã điền số liệu riêng
    React.createElement('div', { style: { border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
      all.map(function (c, i) {
        const blocked = noConsent(c), inc = !excluded[c.id] && !blocked;
        return React.createElement('div', { key: c.id, style: { display: 'flex', gap: 'var(--t-spacing-2)', alignItems: 'flex-start', padding: 'var(--t-spacing-2)', borderTop: i ? '1px solid var(--t-border-color-light)' : 'none', opacity: inc ? 1 : 0.45 } },
          React.createElement('span', { style: { paddingTop: 2 } }, React.createElement(Checkbox, { checked: inc, disabled: blocked, ariaLabel: 'Gửi', onChange: function () { if (blocked) return; setExcluded(function (x) { const n = Object.assign({}, x); if (inc) n[c.id] = true; else delete n[c.id]; return n; }); } })),
          React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
            React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
              React.createElement('span', { style: { fontWeight: 500 } }, c.name), levelTag(EV[c.id].status),
              blocked ? React.createElement(Tag, { text: bulkBlock(c, T, channel), color: /ký quỹ/.test(bulkBlock(c, T, channel)) ? 'red' : 'gray', size: 'sm', preventShrink: true }) : null),
            blocked ? null : React.createElement('span', { style: { color: 'var(--t-font-color-secondary)', lineHeight: 1.4 } }, fillTpl(T, c)),
            blocked ? null : React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Gọi lại: ' + U.hhmm(callbackDue(c, tplIssue(c, T))) + ' ' + U.ddmm(callbackDue(c, tplIssue(c, T))))));
      })),
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
      c.authorized.forEach(function (a, ai) { if (a.phone === digits) hits.push({ c: c, rel: [React.createElement('b', { key: 'b' + ai }, 'Người được uỷ quyền: '), a.name + ' (' + a.rel + ') · ' + authRights(a).text] }); });
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
  location.hash = 'so-khach';
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
   CẢNH BÁO THEO NHÓM — nhiều khách cùng một nguyên nhân gốc (hiện ở Sổ khách)
   Mỗi nhóm: nguyên nhân chung · danh sách khách · cách giải quyết · hành động cho cả nhóm.
   ========================================================================= */
const ALERT_DEFS = [
  { id: 'ky-quy', tone: 'block', codes: ['V-11', 'V-12', 'V-13'], icon: 'percentage', title: 'Rủi ro ký quỹ', primary: 'call',
    cause: 'Tỷ lệ ký quỹ đã hoặc sắp xuống dưới mức call ' + TH.call + '% (bán giải chấp ' + TH.force + '%). Quá hạn bổ sung, công ty được bán chứng khoán ký quỹ của khách.',
    rule: 'QĐ 87/QĐ-UBCK về giao dịch ký quỹ · TT 73/2020: cuộc gọi đặt lệnh phải ghi âm',
    fix: ['Gọi từng khách theo thứ tự hạn gần nhất — không gửi tin hàng loạt cho việc nộp bù hay bán.', 'Đưa 2 phương án: nộp thêm tiền, hoặc bán bớt mã để tỷ lệ về trên 45%.', 'Có đặt lệnh thì phải ghi âm và cảnh báo rủi ro; khách chưa đồng ý ghi âm phải hỏi trước.', 'Ghi kết quả cuộc gọi để hệ thống tính lại trạng thái khách.'] },
  { id: 'cccd', tone: 'warn', codes: ['V-31', 'V-32'], icon: 'id', title: 'CCCD hết hạn hoặc sắp hết hạn', primary: 'bulk',
    cause: 'CCCD hết hạn thì tài khoản bị chặn mọi giao dịch cho tới khi khách cập nhật giấy tờ (yêu cầu định danh khách hàng).',
    rule: 'Yêu cầu KYC — cập nhật giấy tờ tuỳ thân còn hiệu lực',
    fix: ['Gửi nhắc cập nhật CCCD qua mẫu tin đã duyệt (gửi hàng loạt được vì chỉ là nhắc).', 'Hướng dẫn khách cập nhật trên ứng dụng hoặc tại quầy.', 'Theo dõi ở màn Chiến dịch; gọi khách chưa cập nhật trước hạn.'] },
  { id: 'khao-sat', tone: 'warn', codes: ['V-33', 'V-34'], icon: 'clipboard-check', title: 'Khảo sát khẩu vị quá hạn hoặc sắp quá hạn', primary: 'bulk',
    cause: 'Khảo sát khẩu vị hết hiệu lực sau ' + TH.surveyDays + ' ngày. Quá hạn thì broker không được tư vấn mua cho khách.',
    rule: 'Nguyên tắc phù hợp (suitability): khuyến nghị phải dựa trên hồ sơ khách còn hiệu lực',
    fix: ['Gửi nhắc làm lại khảo sát qua mẫu tin đã duyệt.', 'Trong lúc chờ: chỉ tư vấn giữ hoặc bán, không tư vấn mua.', 'Theo dõi tỷ lệ hoàn thành ở màn Chiến dịch.'] },
  { id: 'lien-he', tone: 'warn', codes: ['V-51', 'V-52'], icon: 'phone-off', title: 'Lâu chưa liên hệ hoặc lỡ hẹn', primary: 'bulk',
    cause: 'Khách đã quá 1,5 lần nhịp chăm sóc (VIP 14 · Thân thiết 30 · Phổ thông 60 ngày, hoặc nhịp khách chọn) hoặc broker đã hẹn mà chưa gọi. Tin nhắn hàng loạt không tính là đã liên hệ.',
    fix: ['Khách lỡ hẹn: gọi trực tiếp trước, xin lỗi vì liên hệ muộn.', 'Khách lâu chưa liên hệ: gửi tin hẹn gọi lại qua mẫu đã duyệt, rồi gọi theo giờ khách ưu tiên.'] },
  { id: 'dong-tien', tone: 'warn', codes: ['V-41', 'V-42', 'V-43'], icon: 'cash', title: 'Biến động dòng tiền', primary: 'call',
    cause: 'Khách rút khoản lớn, để tiền mặt nằm im lâu hoặc giao dịch thưa dần — dấu hiệu có thể chuyển tiền đi nơi khác.',
    fix: ['Gọi hỏi thăm nhu cầu từng khách — không gửi tin hàng loạt về chuyện tiền.', 'Ghi lại lý do để theo dõi lần sau.'] },
  { id: 'danh-muc', tone: 'info', codes: ['V-21', 'V-22', 'V-23', 'V-24', 'V-25'], icon: 'chart-pie', title: 'Danh mục cần rà soát', primary: 'call',
    cause: 'Giá chạm điểm cắt lỗ / giá mục tiêu đã hẹn, dồn tiền vào một ngành, hoặc sắp có sự kiện quyền.',
    fix: ['Gọi xác nhận lại với từng khách theo cam kết đã hẹn.', 'Mọi khuyến nghị mua/bán phải chốt riêng từng khách kèm ghi âm.'] },
  { id: 'ghi-am', tone: 'warn', icon: 'microphone-off', title: 'Khách cần gọi gấp nhưng chưa đồng ý ghi âm', primary: 'call',
    match: function (c) { return EV[c.id].status <= 1 && !c.consent.record; },
    cause: 'Các khách này đang ở mức Khẩn/Cao nên sắp phải gọi tư vấn, nhưng chưa có đồng ý ghi âm cuộc gọi.',
    rule: 'Luật Bảo vệ dữ liệu cá nhân (hiệu lực 1/1/2026) · TT 73/2020',
    fix: ['Hỏi đồng ý ghi âm ở đầu cuộc gọi, tick xác nhận trong form ghi sự kiện.', 'Khách từ chối: không tư vấn đặt lệnh qua điện thoại, hẹn gặp trực tiếp.'] },
];
// Thông báo cho khách theo nhóm cảnh báo: câu mở + giải pháp chung để broker tự chọn gửi kèm
const ALERT_NOTICE = {
  'ky-quy': { msg: 'Tài khoản ký quỹ của anh/chị đang ở dưới hoặc sát mức yêu cầu.', opts: ['Nộp thêm tiền vào tài khoản', 'Bán bớt một phần cổ phiếu để giảm dư nợ', 'Trả bớt nợ vay ký quỹ', 'Liên hệ broker để được tư vấn phương án phù hợp'] },
  'cccd': { msg: 'CCCD đăng ký với tài khoản của anh/chị đã hoặc sắp hết hạn.', opts: ['Cập nhật CCCD trên ứng dụng Simplize', 'Cập nhật tại quầy giao dịch', 'Liên hệ broker để được hướng dẫn'] },
  'khao-sat': { msg: 'Phiếu khảo sát khẩu vị đầu tư của anh/chị đã hoặc sắp hết hiệu lực.', opts: ['Làm lại khảo sát trên ứng dụng (khoảng 5 phút)', 'Đặt lịch để broker gọi hỗ trợ làm khảo sát', 'Liên hệ broker nếu cần giải thích'] },
  'lien-he': { msg: 'Đã khá lâu broker chưa trao đổi với anh/chị về tài khoản.', opts: ['Đặt lịch hẹn gọi với broker', 'Xem báo cáo danh mục trên ứng dụng', 'Trả lời tin nhắn này để broker gọi lại'] },
  'dong-tien': { msg: 'Broker muốn trao đổi với anh/chị về kế hoạch dòng tiền.', opts: ['Đặt lịch hẹn gọi với broker', 'Tìm hiểu sản phẩm sinh lời cho tiền nhàn rỗi', 'Trả lời tin nhắn này để broker gọi lại'] },
  'danh-muc': { msg: 'Danh mục của anh/chị có thay đổi cần rà soát lại.', opts: ['Xem lại điểm cắt lỗ / chốt lời đã đặt', 'Xem sự kiện quyền sắp tới trên ứng dụng', 'Đặt lịch hẹn gọi với broker để rà soát'] },
  'ghi-am': { msg: 'Broker cần trao đổi với anh/chị qua điện thoại về tài khoản.', opts: ['Xác nhận đồng ý ghi âm cuộc gọi trên ứng dụng', 'Đặt lịch hẹn gọi với broker', 'Hẹn gặp trực tiếp tại quầy'] },
};
function noticeText(c, d, opts) {
  const N = ALERT_NOTICE[d.id] || { msg: d.title + '.' };
  const cn = U.callName(c);
  return 'Chào ' + cn.charAt(0).toLowerCase() + cn.slice(1) + ', ' + N.msg.charAt(0).toLowerCase() + N.msg.slice(1)
    + (opts.length ? '\nAnh/chị có thể:\n' + opts.map(function (o) { return '• ' + o; }).join('\n') : '');
}
function alertGroups() {
  const out = [];
  ALERT_DEFS.forEach(function (d) {
    const members = [];
    DB.forEach(function (c) {
      const e = EV[c.id];
      if (d.match) { if (d.match(c)) members.push({ c: c, i: e.top }); return; }
      const hit = e.issues.filter(function (i) { return d.codes.indexOf(i.code) >= 0; })[0];
      if (hit) members.push({ c: c, i: hit });
    });
    if (!members.length) return;
    members.sort(function (a, b) {
      const la = a.i ? a.i.level : 9, lb = b.i ? b.i.level : 9;
      if (la !== lb) return la - lb;
      const da = a.i && a.i.due ? a.i.due.date + 'T' + (a.i.due.time || '23:59') : '9', db = b.i && b.i.due ? b.i.due.date + 'T' + (b.i.due.time || '23:59') : '9';
      return da < db ? -1 : da > db ? 1 : 0;
    });
    const minLv = Math.min.apply(null, members.map(function (m) { return m.i ? m.i.level : 9; }));
    const tone = minLv === 0 ? 'block' : d.tone;
    out.push({ def: d, members: members, tone: tone, ids: members.map(function (m) { return m.c.id; }) });
  });
  const rank = { block: 0, warn: 1, info: 2 };
  return out.sort(function (a, b) { return rank[a.tone] - rank[b.tone] || b.members.length - a.members.length; });
}
function alertBannerText(g) {
  const first = g.members[0], due = first.i && first.i.due ? timeLeft(first.i.due) : null;
  const urgent = g.members.filter(function (m) { return m.i && m.i.level <= 1; }).length;
  return g.members.length + ' khách · ' + g.def.title
    + (urgent && urgent < g.members.length ? ' (' + urgent + ' khẩn/cao)' : '')
    + ' — gấp nhất: ' + first.c.name + (due ? ' (' + due.text.toLowerCase() + ')' : '');
}

// Modal chi tiết: nguyên nhân · danh sách khách · cách giải quyết (DS Dialog)
function AlertDialog(props) {
  const g = props.group, d = g.def;
  const [picked, setPicked] = React.useState(function () { const o = {}; g.ids.forEach(function (id) { o[id] = true; }); return o; });
  const sel = g.ids.filter(function (id) { return picked[id]; });
  const label = function (t) { return React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', fontWeight: 500, color: 'var(--t-font-color-tertiary)' } }, t); };
  const urgent = g.members.filter(function (m) { return m.i && m.i.level <= 1; }).length;
  const firstDue = g.members[0].i && g.members[0].i.due ? timeLeft(g.members[0].i.due) : null;
  // Kênh thông báo: Email + App luôn gửi được; Chat (Zalo) / SMS cần khách đã đồng ý nhận tin
  const CHANNELS = [
    { id: 'Email', Icon: 'mail', ok: function () { return true; } },
    { id: 'Chat Zalo', Icon: 'message-circle', ok: function (c) { return c.consent.zalo; } },
    { id: 'SMS', Icon: 'message', ok: function (c) { return c.consent.sms; } },
    { id: 'App', Icon: 'bell', ok: function () { return true; } },
  ];
  const [chan, setChan] = React.useState('Email');
  const OPTS = (ALERT_NOTICE[d.id] || { opts: [] }).opts;
  const [optOn, setOptOn] = React.useState(function () { const o = {}; OPTS.slice(0, 2).forEach(function (x) { o[x] = true; }); return o; });
  const [otherOn, setOtherOn] = React.useState(false);
  const [otherText, setOtherText] = React.useState('');
  const optSel = OPTS.filter(function (x) { return optOn[x]; }).concat(otherOn && otherText.trim() ? [otherText.trim()] : []);
  const chosen = CHANNELS.filter(function (ch) { return ch.id === chan; });
  const reach = function (c) { return chosen.filter(function (ch) { return ch.ok(c); }).map(function (ch) { return ch.id; }); };
  const selC = sel.map(function (id) { return BY[id]; });
  const sendable = selC.filter(function (c) { return reach(c).length; });
  const send = function () {
    sendable.forEach(function (c) {
      const via = reach(c);
      // Tin thông báo chỉ ghi "Đã gửi tin" — không tính là đã liên hệ
      c.events.push({ id: 'n' + Date.now() + c.id, at: TODAY + 'T' + nowHM(), loggedAt: TODAY, bulk: true, channel: via.join(', '), broker: 'Chị Lan', purpose: 'Thông báo theo cảnh báo', result: 'Đã gửi tin', note: noticeText(c, d, optSel), issueTitle: d.title });
      reval(c);
    });
    audit('Gửi thông báo theo cảnh báo', d.title + ' · ' + chan + ' · ' + sendable.length + ' khách' + (optSel.length ? ' · giải pháp: ' + optSel.join('; ') : ''),sendable.map(function (c) { return c.id; }));
    props.onSent(sendable.length, selC.length - sendable.length);
  };
  const primary = { title: 'Gửi thông báo' + (sendable.length ? ' (' + sendable.length + ')' : ''), Icon: 'send', disabled: !sendable.length, onClick: send };
  return React.createElement(Dialog, {
    title: d.title + ' · ' + g.members.length + ' khách', Icon: 'alert-triangle', iconColor: g.tone === 'block' ? 'var(--t-tag-text-red)' : g.tone === 'warn' ? 'var(--t-tag-text-yellow)' : 'var(--t-tag-text-blue)',
    width: 560, footerAlign: 'end', onClose: props.onClose,
    secondary: { title: 'Đóng', onClick: props.onClose }, primary: primary,
    footerLeft: React.createElement(LightButton, { title: 'Lọc sổ khách theo cảnh báo này', Icon: 'filter', accent: 'tertiary', onClick: function () { props.onFilter(d.id); } }),
  },
    // Tóm tắt
    React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-1)', flexWrap: 'wrap' } },
      React.createElement(Tag, { text: g.members.length + ' khách', color: 'gray', preventShrink: true }),
      urgent ? React.createElement(Tag, { text: urgent + ' khẩn/cao', color: 'red', preventShrink: true }) : null,
      firstDue ? React.createElement(Tag, { text: 'Gấp nhất: ' + firstDue.text.toLowerCase(), color: firstDue.late ? 'red' : 'gray', Icon: 'clock', preventShrink: true }) : null),
    // 1. Nguyên nhân
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
      label('Nguyên nhân'),
      React.createElement('span', { style: { lineHeight: 1.5 } }, d.cause),
      d.rule ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Căn cứ: ' + d.rule) : null),
    // 2. Danh sách khách
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
      label('Danh sách khách · ' + g.members.length + ' · đã chọn ' + sel.length),
      React.createElement('div', { style: { border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)', maxHeight: 280, overflowY: 'auto' } },
        g.members.map(function (m, idx) {
          const tl = m.i && m.i.due ? timeLeft(m.i.due) : null;
          return React.createElement('div', { key: m.c.id, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 44, padding: 'var(--t-spacing-1) var(--t-spacing-2)', borderTop: idx ? '1px solid var(--t-border-color-light)' : 'none' } },
            true ? React.createElement(Checkbox, { checked: !!picked[m.c.id], ariaLabel: 'Chọn', onChange: function () { setPicked(function (o) { const n = Object.assign({}, o); n[m.c.id] = !n[m.c.id]; return n; }); } }) : null,
            React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
              React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
                React.createElement(Chip, { label: m.c.name, avatarType: 'rounded', onClick: function () { props.onOpenCustomer(m.c.id); } }),
                levelTag(EV[m.c.id].status)),
              React.createElement('span', { title: m.i ? m.i.short : '', style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, m.i ? m.i.short : '')),
            tl ? React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', fontWeight: 500, whiteSpace: 'nowrap', color: tl.late ? 'var(--t-tag-text-red)' : 'var(--t-font-color-secondary)' } }, tl.text) : null,
            React.createElement(LightButton, { title: 'Mở', Icon: 'arrow-up-right', accent: 'tertiary', onClick: function () { props.onOpenCustomer(m.c.id); } }));
        }))),
    // 3. Giải pháp gửi kèm (broker tự chọn) + xem trước tin
    OPTS.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
      label('Giải pháp gửi kèm · đã chọn ' + optSel.length),
      OPTS.map(function (x) {
        const toggle = function () { setOptOn(function (o) { const n = Object.assign({}, o); n[x] = !n[x]; return n; }); };
        return React.createElement('div', { key: x, onClick: toggle, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', cursor: 'pointer', lineHeight: 1.4 } },
          React.createElement('span', { onClick: function (ev) { ev.stopPropagation(); } }, React.createElement(Checkbox, { checked: !!optOn[x], ariaLabel: x, onChange: toggle })),
          React.createElement('span', null, x));
      }),
      // Khác: broker tự nhập giải pháp
      React.createElement('div', { onClick: function () { setOtherOn(!otherOn); }, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', cursor: 'pointer', lineHeight: 1.4 } },
        React.createElement('span', { onClick: function (ev) { ev.stopPropagation(); } }, React.createElement(Checkbox, { checked: otherOn, ariaLabel: 'Khác', onChange: function () { setOtherOn(!otherOn); } })),
        React.createElement('span', null, 'Khác')),
      otherOn ? React.createElement('div', { style: { paddingLeft: 26 } },
        React.createElement(TextInput, { fullWidth: true, value: otherText, onChange: setOtherText, placeholder: 'Nhập giải pháp muốn gửi kèm cho khách' })) : null) : null,
    selC.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
      label('Xem trước tin gửi'),
      React.createElement(QuoteBox, null, React.createElement('span', { style: { whiteSpace: 'pre-line' } }, noticeText(selC[0], d, optSel)))) : null,
    // 4. Kênh thông báo
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
      React.createElement(RadioGroup, { label: 'Gửi thông báo qua', row: true, value: chan, onChange: setChan,
        options: CHANNELS.map(function (ch) { return { value: ch.id, label: ch.id + ' (' + selC.filter(function (c) { return ch.ok(c); }).length + '/' + selC.length + ')' }; }) }),
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: sendable.length < selC.length ? 'var(--t-tag-text-orange)' : 'var(--t-font-color-tertiary)' } },
        sendable.length < selC.length ? (selC.length - sendable.length) + ' khách chưa đồng ý nhận tin qua ' + chan + ' — sẽ bị bỏ qua.'
          : 'Gửi cho ' + sendable.length + ' khách. Chat Zalo / SMS chỉ gửi cho khách đã đồng ý nhận tin.')));
}

/* ---- Cột ưu tiên cho broker: "mất gì nếu không xử lý" + "đã xử lý tới đâu" ---- */
// Hệ quả: lấy từ dữ liệu chặn của engine (will = sẽ bị xử lý · now = đang bị chặn · soon = sắp bị chặn)
function issueImpact(c) {
  const e = EV[c.id], i = e.top;
  if (!i) return null;
  const bl = e.blocks.filter(function (b) { return b.code === i.code && b.state !== 'grey'; });
  const pick = bl.filter(function (b) { return b.state === 'will'; })[0] || bl.filter(function (b) { return b.state === 'now'; })[0] || bl.filter(function (b) { return b.state === 'soon'; })[0];
  if (pick) return pick.state === 'will' ? { text: pick.what, color: 'red' }
    : pick.state === 'now' ? { text: 'Đang chặn: ' + pick.what, color: 'orange' }
    : { text: 'Sắp chặn: ' + pick.what, color: 'yellow' };
  const DEF = { 1: 'Rủi ro tài khoản', 2: 'Lệch cam kết danh mục', 3: 'Hồ sơ không hợp lệ', 4: 'Có thể mất khách', 5: 'Trễ chăm sóc' };
  return { text: DEF[i.cat], color: 'gray' };
}
// Tình trạng xử lý: tránh gọi trùng / bỏ sót (ưu tiên việc cần làm ngay trước)
function handlingState(c) {
  const e = EV[c.id];
  if ((c.unlogged || []).length) return { text: 'Cuộc gọi chưa ghi', color: 'orange' };
  const open = c.tasks.filter(function (t) { return !t.done; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
  const late = open.filter(function (t) { return t.due.slice(0, 10) < TODAY; })[0];
  if (late) return { text: 'Trễ hẹn ' + U.ddmm(late.due), color: 'red' };
  // Gọi hụt hôm nay → để lại dấu, tránh mai gọi lại như chưa từng gọi
  const lc0 = S.lastContact(c);
  const miss = c.events.filter(function (ev) { return ev.result === 'Không liên lạc được' && (ev.loggedAt === TODAY || ev.at.slice(0, 10) === TODAY) && (!lc0 || ev.at > lc0.at); }).sort(function (a, b) { return a.at < b.at ? 1 : -1; })[0];
  if (miss) return { text: 'Gọi hụt ' + U.hhmm(miss.at) + ' · gọi lại', color: 'orange' };
  let camp = null;
  CAMPAIGNS.forEach(function (cp) { if (cp.customerIds.indexOf(c.id) >= 0) { const r = campaignRow(cp, c.id); if (r.stage === 'Đã phản hồi' || r.stage === 'Đã gửi') camp = r.stage; } });
  if (camp === 'Đã phản hồi') return { text: 'Khách đã phản hồi', color: 'blue' };
  const next = open[0];
  if (next) return { text: 'Đã hẹn ' + U.hhmm(next.due) + ' ' + U.ddmm(next.due), color: 'blue' };
  if (camp === 'Đã gửi') return { text: 'Đã gửi nhắc, chờ khách', color: 'purple' };
  const lc = S.lastContact(c);
  if (lc && (lc.at.slice(0, 10) === TODAY || lc.loggedAt === TODAY)) return { text: 'Đã liên hệ hôm nay', color: 'green' };
  return e.top ? { text: 'Chưa xử lý', color: 'gray' } : null;
}
/* ---- Menu view bar kiểu Twenty (sao từ RmViewBar · ui_kits/full-scope) — chỉ token --t-*, không sửa DS ---- */
function DdSurface(props) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', width: props.width, boxSizing: 'border-box', background: 'var(--t-background-transparent-primary)', backdropFilter: 'var(--t-blur-medium)', WebkitBackdropFilter: 'var(--t-blur-medium)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)', overflow: 'hidden', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', fontWeight: 400 } }, props.children);
}
function DdScroll(props) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', maxHeight: 420, overflowY: 'auto', overflowX: 'hidden' } }, props.children);
}
function DdGroup(props) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', boxSizing: 'border-box', flexShrink: 0, width: '100%', padding: 'var(--t-spacing-1)' } }, props.children);
}
function DdItem(props) {
  const [hover, setHover] = React.useState(false);
  const color = props.disabled ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-secondary)';
  return React.createElement('div', { onClick: props.disabled ? undefined : props.onClick, onMouseEnter: function () { setHover(true); }, onMouseLeave: function () { setHover(false); },
    style: { boxSizing: 'content-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--t-spacing-2)', flexShrink: 0,
      height: 'calc(32px - 2 * var(--t-spacing-2))', width: 'calc(100% - 2 * var(--t-spacing-1))', padding: 'var(--t-spacing-2) var(--t-spacing-1)',
      borderRadius: 'calc(var(--t-border-radius-md) - var(--t-spacing-1))', fontSize: 'var(--t-font-size-sm)', color: color,
      background: (hover && !props.disabled) || (props.selected && !props.tickOnly) ? 'var(--t-background-transparent-light)' : 'transparent', transition: 'background 0.1s ease', cursor: props.disabled ? 'default' : 'pointer', userSelect: 'none' } },
    React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0, width: '100%' } },
      props.Icon ? React.createElement(Icon, { name: props.Icon, size: 16, color: 'currentColor' }) : null,
      React.createElement('span', { style: { display: 'flex', fontSize: 'var(--t-font-size-md)', fontWeight: 400, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } }, props.text),
      props.rightText ? React.createElement('span', { style: { marginLeft: 'auto', paddingLeft: 'var(--t-spacing-1)', color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' } }, props.rightText) : null),
    React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexShrink: 0 } },
      props.right || null,
      props.RightIcon ? React.createElement(Icon, { name: props.RightIcon, size: 16, color: 'currentColor' }) : null,
      props.selected ? React.createElement(Icon, { name: 'check', size: 16, color: 'currentColor' }) : null,
      props.hasSubMenu ? React.createElement(Icon, { name: 'chevron-right', size: 14, color: 'var(--t-font-color-light)' }) : null));
}
function DdLabel(props) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', flexShrink: 0, boxSizing: 'border-box', minHeight: 20, width: '100%', padding: '0 var(--t-spacing-2)', background: 'var(--t-background-transparent-lighter)', color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-xxs)', userSelect: 'none' } }, props.label);
}
function DdSep() {
  return React.createElement('div', { style: { minHeight: 1, flexShrink: 0, width: '100%', background: 'var(--t-border-color-light)' } });
}
function DdSearch(props) {
  const b = props.bordered;
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', flexShrink: 0, boxSizing: 'content-box', minHeight: b ? 19 : 20, padding: b ? 'var(--t-spacing-2)' : 'var(--t-spacing-2) 0', borderBottom: b ? '1px solid var(--t-border-color-light)' : 'none' } },
    React.createElement('input', { autoFocus: true, value: props.value, onChange: function (e) { props.onChange(e.target.value); }, placeholder: props.placeholder || 'Search fields',
      style: { border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: b ? 0 : '0 var(--t-spacing-2)', fontFamily: 'inherit', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-primary)' } }));
}
function DdHeader(props) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', flexShrink: 0, boxSizing: 'content-box', height: 24, padding: 'var(--t-spacing-1)', borderBottom: '1px solid var(--t-border-color-light)', color: 'var(--t-font-color-primary)', fontSize: 'var(--t-font-size-md)', fontWeight: 500, userSelect: 'none' } },
    React.createElement('span', { onClick: props.onClick, onMouseEnter: function () { setHover(true); }, onMouseLeave: function () { setHover(false); },
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 'var(--t-border-radius-sm)', color: 'var(--t-font-color-tertiary)', background: hover ? 'var(--t-background-transparent-light)' : 'transparent', cursor: 'pointer' } },
      React.createElement(Icon, { name: props.icon, size: 16, color: 'currentColor' })),
    React.createElement('span', { style: { overflow: 'hidden', padding: '0 var(--t-spacing-1)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, props.label));
}
function DdEye(props) {
  return React.createElement('span', { style: { display: 'flex', alignItems: 'center', color: 'var(--t-font-color-light)', cursor: 'pointer' } }, React.createElement(Icon, { name: props.name, size: 16, color: 'currentColor' }));
}
const TEXT_OPS = [['contains', 'Chứa'], ['notContains', 'Không chứa'], ['empty', 'Là trống'], ['notEmpty', 'Không trống']];
// Nhóm trạng thái xử lý (bỏ ngày giờ để lọc được)
const HANDLING_KINDS = ['Chưa xử lý', 'Trễ hẹn', 'Gọi hụt', 'Cuộc gọi chưa ghi', 'Đã hẹn', 'Đã gửi nhắc, chờ khách', 'Khách đã phản hồi', 'Đã liên hệ hôm nay', 'Không có việc'];
function handlingKind(c) {
  const h = handlingState(c);
  if (!h) return 'Không có việc';
  return /^Trễ hẹn/.test(h.text) ? 'Trễ hẹn' : /^Đã hẹn/.test(h.text) ? 'Đã hẹn' : /^Gọi hụt/.test(h.text) ? 'Gọi hụt' : h.text;
}
// Trường sắp xếp (asc = Khẩn trước / hạn gần trước / A→Z / nhỏ→lớn)
const TIER_RANK = { 'VIP': 0, 'Thân thiết': 1, 'Phổ thông': 2 };
const SORT_FIELDS = [
  { id: 'name', label: 'Khách', Icon: 'user', cmp: function (a, b) { return a.name.localeCompare(b.name, 'vi'); } },
  { id: 'status', label: 'Mức', Icon: 'flame', cmp: function (a, b) { return EV[a.id].status - EV[b.id].status || dueRank(a) - dueRank(b) || (dueKey(a) < dueKey(b) ? -1 : dueKey(a) > dueKey(b) ? 1 : 0); } },
  { id: 'left', label: 'Còn bao lâu', Icon: 'clock', cmp: function (a, b) { return dueKey(a) < dueKey(b) ? -1 : dueKey(a) > dueKey(b) ? 1 : 0; } },
  { id: 'need', label: 'Cần nộp tối thiểu', Icon: 'cash', cmp: function (a, b) { return atRisk(a) - atRisk(b); } },
  { id: 'nav', label: 'NAV', Icon: 'currency-dollar', cmp: function (a, b) { return EV[a.id].m.nav - EV[b.id].m.nav; } },
  { id: 'contact', label: 'Liên hệ gần nhất', Icon: 'phone', cmp: function (a, b) { const x = (S.lastContact(a) || {}).at || '', y = (S.lastContact(b) || {}).at || ''; return x < y ? -1 : x > y ? 1 : 0; } },
  { id: 'tier', label: 'Hạng', Icon: 'star', cmp: function (a, b) { return TIER_RANK[a.tier] - TIER_RANK[b.tier]; } },
  { id: 'ratio', label: 'Tỷ lệ ký quỹ', Icon: 'percentage', cmp: function (a, b) { const x = EV[a.id].m.ratio, y = EV[b.id].m.ratio; return (x == null ? 999 : x) - (y == null ? 999 : y); } },
];

function atRisk(c) { const t = EV[c.id].top; return t && t.need ? t.need[t.minNeed] : 0; }
// 0 = hạn sắp tới (hôm nay trở đi) · 1 = đã quá hạn · 2 = không có hạn
function dueRank(c) { const d = EV[c.id].top && EV[c.id].top.due; return !d ? 2 : d.date < TODAY ? 1 : 0; }
function dueKey(c) { const d = EV[c.id].top && EV[c.id].top.due; return d ? d.date + 'T' + (d.time || '23:59') : '9999'; }

/* =========================================================================
   MÀN 1 — DANH SÁCH (Sổ khách)
   ========================================================================= */
function ListScreen(props) {
  const [levelFilter, setLevelFilter] = React.useState(function () { const mm = /^#loc-lv=(\d)$/.exec(location.hash); return mm ? +mm[1] : null; });  // index 0..4 · deep link '#loc-lv=0'
  const [tierFilter, setTierFilter] = React.useState(null);
  const [catFilter, setCatFilter] = React.useState(function () { const mm = /^#loc-cat=(\d)$/.exec(location.hash); return mm ? +mm[1] : null; });      // 1..5 Nhóm vấn đề · deep link test '#loc-cat=1'
  const [sortSpec, setSortSpec] = React.useState(null);      // null = mặc định: Mức → Hạng (VIP đầu) → hạn gần → NAV; { id, dir: 'asc'|'desc' }
  const [nameQ, setNameQ] = React.useState('');
  const [nameOp, setNameOp] = React.useState('contains');
  const [handlingFilter, setHandlingFilter] = React.useState(null);
  const [hiddenCols, setHiddenCols] = React.useState([]);     // Options → Fields
  const [fldQ, setFldQ] = React.useState('');
  const [optQ, setOptQ] = React.useState('');
  const [sortQ, setSortQ] = React.useState('');
  const [fieldQ, setFieldQ] = React.useState('');
  const [opOpen, setOpOpen] = React.useState(false);
  const [dir, setDir] = React.useState('Ascending');
  const [dirOpen, setDirOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(props.initialBulk ? DB.filter(function (c) { return EV[c.id].top && EV[c.id].top.code === 'V-51'; }).slice(0, 8).map(function (c) { return c.id; }) : []);
  const [campaign, setCampaign] = React.useState(!!props.initialBulk);
  const scrollRef = React.useRef(null);
  React.useEffect(function () {   // test: '#so-khach.x=400' cuộn ngang sẵn để thấy cột Khách cố định
    const mm = /\.x=(\d+)$/.exec(location.hash);
    if (mm && scrollRef.current) scrollRef.current.scrollLeft = +mm[1];
  }, []);
  const [panelId, setPanelId] = React.useState(function () { const mm = /\.p=(\w+)(?:\.evt)?$/.exec(location.hash); return mm && BY[mm[1]] ? mm[1] : null; });  // test '#so-khach.p=c003' · '.p=c003.evt' mở sẵn panel con Tạo việc   // panel khách bên phải (chuẩn Twenty: xem nhanh trước, 'Xem chi tiết' mới vào trang)
  // menu view bar { kind: 'filter'|'sort'|'options', page } · test '#so-khach.m=filter' | '.m=filter-status' | '.m=sort' | '.m=options' | '.m=options-fields'
  const [menu, setMenu] = React.useState(function () { const mm = /\.m=(filter|sort|options)(?:-(\w+))?$/.exec(location.hash); return mm ? { kind: mm[1], page: mm[2] || null } : null; });
  const groups = alertGroups();                                       // cảnh báo theo nhóm (nhiều khách cùng nguyên nhân)
  const [alertOpen, setAlertOpen] = React.useState(function () { const mm = /^#canh-bao=([\w-]+)$/.exec(location.hash); return mm ? mm[1] : null; });   // test '#canh-bao=ky-quy'
  const [alertFilter, setAlertFilter] = React.useState(null);

  // Count theo lọc Hạng (bỏ qua lọc Mức) — giống passes(c, true) ở bản gốc
  const counts = [0, 0, 0, 0, 0];
  DB.forEach(function (c) { if (tierFilter == null || c.tier === tierFilter) counts[EV[c.id].status]++; });

  let rows = DB.filter(function (c) {
    const e = EV[c.id];
    if (levelFilter != null && e.status !== levelFilter && !(levelFilter === 3 && e.noData.some(function (n) { return n.cat === 1; }))) return false;
    if (tierFilter != null && c.tier !== tierFilter) return false;
    if (catFilter != null && !e.issues.some(function (i) { return i.cat === catFilter; })) return false;
    if (handlingFilter != null && handlingKind(c) !== handlingFilter) return false;
    if (nameOp === 'empty') return false;   // tên khách luôn có
    if (nameQ.trim()) { const q = nameQ.trim().toLowerCase(), hit = (c.name + ' ' + c.acc).toLowerCase().indexOf(q) >= 0; if (nameOp === 'notContains' ? hit : !hit) return false; }
    if (alertFilter) { const g = groups.filter(function (x) { return x.def.id === alertFilter; })[0]; if (!g || g.ids.indexOf(c.id) < 0) return false; }
    return true;
  });
  rows = rows.slice().sort(function (a, b) {
    const ea = EV[a.id], eb = EV[b.id];
    if (sortSpec) { const sf = SORT_FIELDS.filter(function (f) { return f.id === sortSpec.id; })[0]; const r = sf.cmp(a, b) * (sortSpec.dir === 'desc' ? -1 : 1); if (r) return r; }
    // Mặc định: mức → hạng (VIP → Thân thiết → Phổ thông) → hạn gần nhất → số tiền → NAV
    if (ea.status !== eb.status) return ea.status - eb.status;
    if (TIER_RANK[a.tier] !== TIER_RANK[b.tier]) return TIER_RANK[a.tier] - TIER_RANK[b.tier];
    if (dueRank(a) !== dueRank(b)) return dueRank(a) - dueRank(b);
    const ka = dueKey(a), kb = dueKey(b);
    if (ka !== kb) return ka < kb ? -1 : 1;
    return atRisk(b) - atRisk(a) || eb.m.nav - ea.m.nav;
  });

  // Bộ cột theo 6 câu broker cần trả lời: ai · gấp mức nào · chuyện gì · còn bao lâu · mất gì · đã xử lý chưa
  const ALL_COLUMNS = [
    // Độ rộng tính để 7 cột đầu vừa màn 1366px; "Liên hệ gần nhất" để cuối (xem thêm khi cuộn ngang)
    { id: 'name',     label: 'Khách',                  type: 'text',     width: 240 },
    { id: 'status',   label: 'Mức',                    type: 'select',   width: 90, Icon: 'flame' },
    { id: 'issue',    label: 'Vấn đề',                 type: 'text',     width: 230, Icon: 'alert-triangle' },
    { id: 'left',     label: 'Còn bao lâu',            type: 'date',     width: 120, Icon: 'clock' },
    { id: 'need',     label: 'Nộp tối thiểu',          type: 'currency', width: 120, Icon: 'cash' },
    { id: 'impact',   label: 'Hệ quả nếu không xử lý', type: 'select',   width: 200, Icon: 'shield-x' },
    { id: 'handling', label: 'Xử lý',                  type: 'select',   width: 150, Icon: 'progress-check' },
    { id: 'nav',      label: 'NAV',                    type: 'currency', width: 90 },
    { id: 'contact',  label: 'Liên hệ gần nhất',       type: 'date',     width: 150 },
  ];
  const columns = ALL_COLUMNS.filter(function (x) { return hiddenCols.indexOf(x.id) < 0; });

  function renderCell(c, col) {
    const e = EV[c.id], m = e.m;
    switch (col.id) {
      case 'name':
        return React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minWidth: 0 } },
          React.createElement(Chip, { label: c.name, avatarType: 'rounded', isBold: true, onClick: function (ev) { if (ev) ev.stopPropagation(); props.onOpen(c.id); } }),
          tierTag(c.tier));
      case 'acc':
        return React.createElement('span', { style: Object.assign({ color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)' }, mono) }, c.acc);
      case 'tier':
        return tierTag(c.tier);
      case 'nav':
        return React.createElement('span', { style: Object.assign({ width: '100%', textAlign: 'right' }, num) }, U.money(m.nav));
      case 'need': {
        const t = e.top;
        if (!t || !t.need) return React.createElement('span', { style: { width: '100%', textAlign: 'right', color: 'var(--t-font-color-light)' } }, '—');
        const n = t.need, red = t.level === 0, soft = t.minNeed === 'safe';   // sát call: chỉ là mức nên nộp để về an toàn, không bắt buộc
        return React.createElement('span', { title: 'Khỏi bị bán (≥' + TH.force + '%): ' + U.money(n.force) + ' · Hết call (≥' + TH.call + '%): ' + U.money(n.call) + ' · An toàn (' + TH.safe + '%): ' + U.money(n.safe),
          style: Object.assign({ width: '100%', textAlign: 'right', fontWeight: soft ? 400 : 500, color: red ? 'var(--t-tag-text-red)' : soft ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-primary)' }, num) }, (soft ? 'nên ' : '') + U.money(n[t.minNeed]));
      }
      case 'ratio':
        return React.createElement('span', { style: Object.assign({ width: '100%', textAlign: 'right', color: ratioColor(m.ratio), fontWeight: m.ratio != null && m.ratio < TH.safe ? 600 : 400 }, num) },
          !c.margin ? '—' : c.margin.dataMissing ? 'chưa có' : U.pct(m.ratio, 0));
      case 'contact': {
        const lc = S.lastContact(c);
        const miss = c.events.filter(function (ev) { return ev.result === 'Không liên lạc được' && (!lc || ev.at > lc.at); }).sort(function (a, b) { return a.at < b.at ? 1 : -1; })[0];
        const missEl = miss ? React.createElement('span', { style: { color: 'var(--t-tag-text-orange)', fontSize: 'var(--t-font-size-sm)' } }, ' · gọi hụt ' + daysAgo(miss.at).toLowerCase()) : null;
        return lc
          ? React.createElement('span', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, daysAgo(lc.at), React.createElement('span', { style: { color: 'var(--t-font-color-light)', fontSize: 'var(--t-font-size-sm)' } }, ' · ' + lc.channel), missEl)
          : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có', missEl);
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
      case 'issue': {
        // Tên vấn đề + con số chính (tỷ lệ ký quỹ khi là vấn đề tài khoản); câu đầy đủ ở tooltip
        const NOD = { 1: 'Thiếu số ký quỹ', 2: 'Thiếu giá cổ phiếu hôm nay', 5: 'Chưa có lần liên hệ nào' };
        if (!e.top) return React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }, title: e.noData.length ? e.noData[0].reason : '' }, e.noData.length ? NOD[e.noData[0].cat] || 'Chưa đủ dữ liệu' : 'Không có việc cần xử lý');
        const i = e.top, more = e.issues.length - 1;
        const missMargin = c.margin && c.margin.dataMissing;   // khách có vay mà thiếu số: luôn có dấu, kể cả khi có chuyện khác
        const figure = i.cat === 1 && c.margin && !c.margin.dataMissing
          ? U.pct(m.ratio, 0) + ((m.proj != null && m.proj < TH.call) ? ' → ' + U.pct(m.proj, 0) : '') : null;
        // Bấm vào giá trị → trang chi tiết khách, mở sẵn tab Vấn đề
        const goIssues = function (ev) { if (ev) ev.stopPropagation(); location.hash = 'khach-' + c.id + '.issues'; };
        return React.createElement('span', { onClick: goIssues, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0, width: '100%', cursor: 'pointer' }, title: 'Mở tab Vấn đề · Nhóm ' + i.cat + ' · ' + CATS[i.cat].short + ' — ' + i.short },
          React.createElement('span', { className: 'sk-link', style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' } }, i.title),
          figure ? React.createElement('span', { style: Object.assign({ flexShrink: 0, fontWeight: 600, color: ratioColor(m.ratio) }, num) }, figure) : null,
          missMargin ? React.createElement('span', { style: { flexShrink: 0, display: 'flex' }, title: e.noData.filter(function (n) { return n.cat === 1; }).map(function (n) { return n.reason; })[0] || '' }, React.createElement(Tag, { text: 'Thiếu số ký quỹ', color: 'orange', size: 'sm', preventShrink: true })) : null,
          more > 0 ? React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, '+' + more) : null);
      }
      case 'left': {
        // Một định dạng thống nhất; đỏ CHỈ khi mức Khẩn/Cao và hạn trong 1 ngày (đỏ = làm ngay)
        const due = e.top && e.top.due;
        if (!due) return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '—');
        // Đỏ = phải làm ngay: hạn SẮP TỚI trong 1 ngày ở mức Khẩn/Cao (việc đã trễ lâu không còn đỏ — nó đã quá hạn, không thêm tín hiệu)
        const d = U.dayDiff(TODAY, due.date);
        const text = d < 0 ? 'Trễ ' + (-d) + ' ngày' : d === 0 ? (due.time ? timeLeft(due).text.split(' · ')[0] : 'Hôm nay') : 'Còn ' + d + ' ngày';
        const red = e.top.level <= 1 && d >= 0 && d <= 1;
        const strong = red || (e.top.level === 0);
        return React.createElement('span', { title: 'Hạn ' + U.ddmm(due.date) + (due.time ? ' ' + due.time : ''), style: Object.assign({ color: red ? 'var(--t-tag-text-red)' : strong ? 'var(--t-font-color-primary)' : d < 0 ? 'var(--t-font-color-secondary)' : 'var(--t-font-color-tertiary)', fontWeight: strong ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, num) }, text);
      }
      case 'impact': {
        const im = issueImpact(c);
        if (!im) return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '—');
        return im.color === 'gray'
          ? React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' } }, im.text)
          : React.createElement('span', { style: { minWidth: 0, display: 'flex', overflow: 'hidden' }, title: im.text }, React.createElement(Tag, { text: im.text, color: im.color }));
      }
      case 'handling': {
        const h = handlingState(c);
        if (!h) return React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, '—');
        return h.color === 'gray'
          ? React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)' } }, h.text)
          : React.createElement(Tag, { text: h.text, color: h.color, preventShrink: true });
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

  /* ---- Chuẩn Twenty (RmViewBar của Full Scope): Filter · Sort · Options mở menu Dd*; lọc/sắp xếp đang bật hiện thành chip dưới view bar ---- */
  const visCols = columns;                                  // cột đang hiện (sau khi ẩn ở Options → Fields)
  const visIds = visCols.map(function (x) { return x.id; });
  const hitQ = function (q) { return function (f) { return !q.trim() || f.label.toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }; };
  const closeMenu = function () { setMenu(null); setFldQ(''); setOptQ(''); setSortQ(''); setFieldQ(''); setOpOpen(false); setDirOpen(false); };
  const openMenu = function (k) {
    if (menu && menu.kind === k) { closeMenu(); return; }
    setFldQ(''); setOptQ(''); setSortQ(''); setFieldQ(''); setOpOpen(false); setDirOpen(false); setDir('Ascending');
    setMenu({ kind: k, page: null });
  };
  const setPage = function (p) { setMenu(Object.assign({}, menu, { page: p })); setOptQ(''); setOpOpen(false); };

  // Trường lọc: cột chữ → toán tử + ô nhập; cột khác → danh sách giá trị. "Visible/Hidden" theo cột bảng đang hiện.
  const FIELDS = [
    { id: 'name', col: 'name', label: 'Khách', Icon: 'user', text: true, value: nameQ, set: setNameQ },
    { id: 'status', col: 'status', label: 'Mức', Icon: 'flame', value: levelFilter, set: setLevelFilter,
      options: [0, 1, 2, 3, 4].map(function (lv) { return [lv, LEVELS[lv]]; }) },
    { id: 'issue', col: 'issue', label: 'Nhóm vấn đề', Icon: 'alert-triangle', value: catFilter, set: setCatFilter,
      options: [1, 2, 3, 4, 5].map(function (k) { return [k, k + ' · ' + CATS[k].short]; }) },
    { id: 'handling', col: 'handling', label: 'Xử lý', Icon: 'progress-check', value: handlingFilter, set: setHandlingFilter,
      options: HANDLING_KINDS.map(function (k) { return [k, k]; }) },
    { id: 'tier', col: 'tier', label: 'Hạng', Icon: 'star', value: tierFilter, set: setTierFilter,
      options: ['VIP', 'Thân thiết', 'Phổ thông'].map(function (t) { return [t, t]; }) },
    { id: 'alert', col: 'alert', label: 'Cảnh báo nhóm', Icon: 'bell', value: alertFilter, set: setAlertFilter,
      options: ALERT_DEFS.map(function (d) { return [d.id, d.title]; }) },
  ];
  const fById = function (id) { return FIELDS.filter(function (f) { return f.id === id; })[0]; };
  const activeF = FIELDS.filter(function (f) { return f.text ? (f.value || nameOp === 'empty' || nameOp === 'notEmpty') : f.value != null; });
  const resetAll = function () { FIELDS.forEach(function (f) { f.set(f.text ? '' : null); }); setNameOp('contains'); setSortSpec(null); setSelectedIds([]); };

  const fieldItem = function (f, onClick, right) { return React.createElement(DdItem, { key: f.id, text: f.label, Icon: f.Icon, onClick: onClick, right: right }); };
  const pop = function (child, extra) { return React.createElement('div', { style: Object.assign({ position: 'absolute', top: 40, right: 'var(--t-spacing-2)', zIndex: 60 }, extra) }, child); };

  // ---- Filter ----
  const filterMenu = (function () {
    if (!menu || menu.kind !== 'filter') return null;
    const f = menu.page && fById(menu.page);
    if (f && f.text) {
      // Toán tử chữ của Twenty: Chứa / Không chứa / Là trống / Không trống — hai cái cuối không cần nhập giá trị
      const noVal = nameOp === 'empty' || nameOp === 'notEmpty';
      return React.createElement(DdSurface, { width: 260 },
        React.createElement(DdHeader, { icon: 'chevron-left', label: f.label, onClick: function () { setPage(null); } }),
        React.createElement('div', { onClick: function () { setOpOpen(!opOpen); }, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 32, padding: '0 var(--t-spacing-2)', margin: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', cursor: 'pointer', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)' } },
          React.createElement('span', { style: { flex: 1 } }, TEXT_OPS.filter(function (o) { return o[0] === nameOp; })[0][1]),
          React.createElement(Icon, { name: opOpen ? 'chevron-up' : 'chevron-down', size: 14, color: 'var(--t-font-color-tertiary)' })),
        opOpen ? React.createElement(React.Fragment, null, React.createElement(DdSep),
          React.createElement(DdGroup, null, TEXT_OPS.map(function (o) {
            return React.createElement(DdItem, { key: o[0], text: o[1], tickOnly: true, selected: nameOp === o[0], onClick: function () { setNameOp(o[0]); if (o[0] === 'empty' || o[0] === 'notEmpty') setNameQ(''); setOpOpen(false); setSelectedIds([]); } });
          }))) : null,
        noVal || opOpen ? null : React.createElement(DdSearch, { value: nameQ, onChange: function (v) { setNameQ(v); setSelectedIds([]); }, bordered: true, placeholder: 'Nhập tên hoặc số tài khoản…' }));
    }
    if (f) {
      const opts = f.options.filter(function (o) { return !optQ.trim() || String(o[1]).toLowerCase().indexOf(optQ.trim().toLowerCase()) >= 0; });
      return React.createElement(DdSurface, { width: 240 },
        React.createElement(DdHeader, { icon: 'chevron-left', label: f.label, onClick: function () { setPage(null); } }),
        React.createElement(DdSearch, { value: optQ, onChange: setOptQ, bordered: true, placeholder: 'Search' }),
        React.createElement(DdScroll, null, React.createElement(DdGroup, null,
          opts.length ? opts.map(function (o) {
            return React.createElement(DdItem, { key: o[0], text: o[1], tickOnly: true, selected: f.value === o[0], onClick: function () { f.set(f.value === o[0] ? null : o[0]); setSelectedIds([]); closeMenu(); } });
          }) : React.createElement(DdItem, { text: 'No results', disabled: true }))));
    }
    const visF = FIELDS.filter(function (x) { return hitQ(fldQ)(x) && visIds.indexOf(x.col) >= 0; });
    const hidF = FIELDS.filter(function (x) { return hitQ(fldQ)(x) && visIds.indexOf(x.col) < 0; });
    const item = function (x) { return fieldItem(x, function () { setPage(x.id); }); };
    return React.createElement(DdSurface, { width: 260 },
      React.createElement(DdHeader, { icon: 'x', label: 'Filter', onClick: closeMenu }),
      React.createElement(DdSearch, { value: fldQ, onChange: setFldQ, bordered: true, placeholder: 'Search fields' }),
      React.createElement(DdScroll, null,
        visF.length ? React.createElement(React.Fragment, null, React.createElement(DdLabel, { label: 'Visible fields' }), React.createElement(DdGroup, null, visF.map(item))) : null,
        visF.length && hidF.length ? React.createElement(DdSep) : null,
        hidF.length ? React.createElement(React.Fragment, null, React.createElement(DdLabel, { label: 'Hidden fields' }), React.createElement(DdGroup, null, hidF.map(item))) : null,
        !visF.length && !hidF.length ? React.createElement(DdGroup, null, React.createElement(DdItem, { text: 'No results', disabled: true })) : null));
  })();

  // ---- Sort ----
  const sortFields = SORT_FIELDS.filter(function (f) { return visIds.indexOf(f.id) >= 0; })
    .concat(SORT_FIELDS.filter(function (f) { return visIds.indexOf(f.id) < 0; }));
  const sortMenu = !menu || menu.kind !== 'sort' ? null : (function () {
    const sVis = sortFields.filter(function (f) { return hitQ(sortQ)(f) && visIds.indexOf(f.id) >= 0; });
    const sHid = sortFields.filter(function (f) { return hitQ(sortQ)(f) && visIds.indexOf(f.id) < 0; });
    const pick = function (f) { return function () { setSortSpec({ id: f.id, dir: dir === 'Ascending' ? 'asc' : 'desc' }); closeMenu(); }; };
    return React.createElement(DdSurface, { width: 320 },
      React.createElement(DdHeader, { icon: 'x', label: 'Sort', onClick: closeMenu }),
      React.createElement('div', { onClick: function () { setDirOpen(!dirOpen); }, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 28, flexShrink: 0, boxSizing: 'border-box', padding: '0 var(--t-spacing-2)', color: 'var(--t-font-color-secondary)', fontSize: 'var(--t-font-size-sm)', fontWeight: 500, cursor: 'pointer' } },
        React.createElement('span', null, dir), React.createElement(Icon, { name: 'chevron-down', size: 14, color: 'currentColor' })),
      dirOpen ? React.createElement(DdGroup, null, ['Ascending', 'Descending'].map(function (d) {
        return React.createElement(DdItem, { key: d, text: d, selected: d === dir, onClick: function () { setDir(d); setDirOpen(false); } });
      })) : null,
      React.createElement(DdSep),
      React.createElement(DdScroll, null,
        React.createElement(DdSearch, { value: sortQ, onChange: setSortQ }),
        sVis.length ? React.createElement(React.Fragment, null, React.createElement(DdLabel, { label: 'Visible fields' }), React.createElement(DdGroup, null, sVis.map(function (f) { return fieldItem(f, pick(f)); }))) : null,
        sVis.length && sHid.length ? React.createElement(DdSep) : null,
        sHid.length ? React.createElement(React.Fragment, null, React.createElement(DdLabel, { label: 'Hidden fields' }), React.createElement(DdGroup, null, sHid.map(function (f) { return fieldItem(f, pick(f)); }))) : null));
  })();

  // ---- Options ----
  const optionsMenu = !menu || menu.kind !== 'options' ? null : menu.page === 'fields'
    ? (function () {
        const shown = ALL_COLUMNS.filter(function (x) { return hiddenCols.indexOf(x.id) < 0 && hitQ(fieldQ)(x); });
        const hidden = ALL_COLUMNS.filter(function (x) { return hiddenCols.indexOf(x.id) >= 0 && hitQ(fieldQ)(x); });
        const toggle = function (id) { setHiddenCols(hiddenCols.indexOf(id) >= 0 ? hiddenCols.filter(function (x) { return x !== id; }) : hiddenCols.concat([id])); };
        const ic = function (x) { return Object.assign({}, x, { Icon: x.Icon || { name: 'user', nav: 'currency-dollar', contact: 'phone' }[x.id] || 'typography' }); };
        return React.createElement(DdSurface, { width: 220 },
          React.createElement(DdHeader, { icon: 'chevron-left', label: 'Fields', onClick: function () { setPage(null); } }),
          React.createElement(DdSearch, { value: fieldQ, onChange: setFieldQ }),
          React.createElement(DdSep),
          React.createElement(DdScroll, null,
            React.createElement(DdLabel, { label: 'Visible fields' }),
            React.createElement(DdGroup, null, shown.map(function (x) {
              const locked = x.id === 'name';   // cột Khách cố định, không ẩn được
              return fieldItem(ic(x), function () { if (!locked) toggle(x.id); }, React.createElement(DdEye, { name: locked ? 'lock' : 'eye-off' }));
            })),
            hidden.length ? React.createElement(React.Fragment, null, React.createElement(DdSep), React.createElement(DdLabel, { label: 'Hidden fields' }),
              React.createElement(DdGroup, null, hidden.map(function (x) { return fieldItem(ic(x), function () { toggle(x.id); }, React.createElement(DdEye, { name: 'eye' })); }))) : null));
      })()
    : React.createElement(DdSurface, { width: 200 },
        React.createElement(DdGroup, null, React.createElement(DdItem, { text: 'Default View', Icon: 'users', RightIcon: 'lock', disabled: true })),
        React.createElement(DdSep),
        React.createElement(DdGroup, null, React.createElement(DdItem, { text: 'Fields', Icon: 'list-details', rightText: visCols.length + ' shown', hasSubMenu: true, onClick: function () { setPage('fields'); setFieldQ(''); } })),
        React.createElement(DdSep),
        React.createElement(DdGroup, null,
          React.createElement(DdItem, { text: 'Copy link to view', Icon: 'copy', onClick: function () {
            try { navigator.clipboard.writeText(location.href); } catch (err) {}
            closeMenu(); showToast('Đã chép liên kết tới chế độ xem này');
          } }),
          React.createElement(DdItem, { text: 'Create custom view', Icon: 'layout', onClick: function () { closeMenu(); showToast('Bản mẫu: tạo chế độ xem riêng chưa nằm trong phạm vi'); } })));

  const menuEl = filterMenu ? pop(filterMenu) : sortMenu ? pop(sortMenu) : optionsMenu ? pop(optionsMenu) : null;

  // Đóng menu khi bấm ra ngoài
  const barRef = React.useRef(null);
  React.useEffect(function () {
    if (!menu) return;
    const h = function (ev) { if (barRef.current && !barRef.current.contains(ev.target)) closeMenu(); };
    document.addEventListener('mousedown', h);
    return function () { document.removeEventListener('mousedown', h); };
  }, [menu]);

  // ---- Chip bar (SortOrFilterChip của Twenty): sort chip bấm để đổi chiều · vạch · filter chip "Trường: giá trị" · Add filter · Reset ----
  const fchip = { display: 'inline-flex', alignItems: 'center', columnGap: 'var(--t-spacing-1)', height: 24, padding: '2px 2px 2px var(--t-spacing-1)', boxSizing: 'border-box', flexShrink: 0, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-accent-quaternary)', border: '1px solid var(--t-accent-tertiary)', color: 'var(--t-color-blue)', fontSize: 'var(--t-font-size-sm)', fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' };
  const chipX = function (label, onClick) {
    return React.createElement('span', { role: 'button', 'aria-label': label, onClick: function (ev) { ev.stopPropagation(); onClick(); }, style: { width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--t-border-radius-sm)', cursor: 'pointer' } },
      React.createElement(Icon, { name: 'x', size: 14, color: 'currentColor' }));
  };
  const vsep = React.createElement('span', { style: { alignSelf: 'stretch', display: 'flex', padding: 'var(--t-spacing-2) var(--t-spacing-1)' } }, React.createElement('span', { style: { width: 1, background: 'var(--t-background-quaternary)' } }));
  const sortF = sortSpec ? SORT_FIELDS.filter(function (f) { return f.id === sortSpec.id; })[0] : null;
  const chipsRow = activeF.length || sortF ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--t-spacing-2)', minHeight: 32, padding: 'var(--t-spacing-1) var(--t-spacing-2) var(--t-spacing-1) 0', boxSizing: 'border-box', borderTop: '1px solid var(--t-border-color-light)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minWidth: 0, overflowX: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
        sortF ? React.createElement('span', { style: fchip, title: 'Bấm để đổi chiều sắp xếp', onClick: function () { setSortSpec({ id: sortSpec.id, dir: sortSpec.dir === 'asc' ? 'desc' : 'asc' }); } },
          React.createElement(Icon, { name: sortSpec.dir === 'desc' ? 'arrow-down' : 'arrow-up', size: 14, color: 'currentColor' }),
          React.createElement('span', null, sortF.label),
          chipX('Bỏ sắp xếp', function () { setSortSpec(null); })) : null,
        sortF && activeF.length ? vsep : null,
        activeF.map(function (f) {
          const val = f.text
            ? (nameOp === 'empty' ? 'là trống' : nameOp === 'notEmpty' ? 'không trống' : (nameOp === 'notContains' ? 'không chứa ' : '') + f.value)
            : (f.options.filter(function (o) { return o[0] === f.value; })[0] || [0, ''])[1];
          return React.createElement('span', { key: f.id, style: fchip, onClick: function () { setFldQ(''); setOptQ(''); setMenu({ kind: 'filter', page: f.id }); } },
            React.createElement(Icon, { name: f.Icon, size: 14, color: 'currentColor' }),
            React.createElement('span', { style: { display: 'flex' } }, React.createElement('span', null, f.label + ': '), React.createElement('span', { style: { fontWeight: 400 } }, val)),
            chipX('Bỏ lọc ' + f.label, function () { f.set(f.text ? '' : null); if (f.text) setNameOp('contains'); setSelectedIds([]); }));
        })),
      React.createElement(LightButton, { title: 'Add filter', Icon: 'plus', accent: 'tertiary', onClick: function () { openMenu('filter'); } })),
    React.createElement(LightButton, { title: 'Reset', accent: 'tertiary', onClick: resetAll })) : null;

  const selectedCustomers = selectedIds.map(function (id) { return BY[id]; }).filter(Boolean);

  return React.createElement(Page, {
    title: 'Sổ khách', icon: dashTile('address-book', 'blue'),
    actions: null,   // nút "⋮" (không có chức năng) đã bỏ theo yêu cầu user
    rightPanel: panelId ? React.createElement(CustomerPanel, { key: panelId, id: panelId, onClose: function () { setPanelId(null); } }) : null,
  },
    React.createElement('div', { ref: barRef, style: { position: 'relative', flexShrink: 0 } },
      React.createElement(ViewBar, { viewName: 'Tất cả khách', viewIcon: 'users', count: rows.length,
        onAction: function (a) { openMenu(a === 'Filter' ? 'filter' : a === 'Sort' ? 'sort' : 'options'); },
        bottomComponent: chipsRow }),
      menuEl),
    // Cảnh báo nhóm: chỉ hiện 3 nhóm quan trọng nhất (đã xếp đỏ → vàng → xanh, đông khách trước); không mở rộng để bảng không bị đẩy xuống
    // Banner "AI dự báo" (aiAlert) đã bỏ theo yêu cầu user 2026-11-09 — dự báo vẫn xem ở tab Cần chú ý của từng khách
    alertFilter ? null : React.createElement(StatusBanners, { max: 3, style: { borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 },
      items: groups.slice(0, 3).map(function (g) { return { tone: g.tone, text: alertBannerText(g), action: 'Xem chi tiết', onAction: function () { setAlertOpen(g.def.id); } }; }) }),
    React.createElement('div', { style: { position: 'relative', flex: 1, minHeight: 0, display: 'flex' } },
      // className sk-fix-name: cố định cột checkbox + Khách khi cuộn ngang (CSS sticky ở index.html, không sửa RecordTable)
      React.createElement('div', { ref: scrollRef, className: 'sk-fix-name', style: { flex: 1, overflow: 'auto', paddingLeft: 'var(--t-spacing-3)' } },
        rows.length
          ? React.createElement(RecordTable, {
              columns: columns, rows: rows, renderCell: renderCell, hasAddColumn: false,
              selectedIds: selectedIds, onSelectionChange: setSelectedIds,
              onRowClick: function (r) { setPanelId(r.id); },
              addNewLabel: 'Thêm khách', aggregates: { name: rows.length + ' khách' },
            })
          : React.createElement('div', { style: { padding: '96px var(--t-spacing-4)' } }, React.createElement(EmptyState, { Icon: 'filter-off', title: 'Không có khách nào khớp bộ lọc.', subtitle: 'Thử bỏ bớt điều kiện lọc.', actionLabel: 'Xoá bộ lọc', onAction: resetAll }))),
      React.createElement(SelectionBar, { count: selectedIds.length, onClear: function () { setSelectedIds([]); } },
        React.createElement(Button, { title: 'Gửi gợi ý', Icon: 'send', variant: 'secondary', size: 'small', onClick: function () { setCampaign(true); } }))),
    (function () {
      const g = alertOpen && groups.filter(function (x) { return x.def.id === alertOpen; })[0];
      return g ? React.createElement(AlertDialog, { key: g.def.id, group: g,
        onClose: function () { setAlertOpen(null); },
        onOpenCustomer: function (id) { setAlertOpen(null); setPanelId(id); },
        onFilter: function (id) { setAlertOpen(null); setAlertFilter(id); setSelectedIds([]); },
        onBulk: function (ids) { setAlertOpen(null); setSelectedIds(ids); setCampaign(true); },
        onSent: function (n, skipped) { setAlertOpen(null); showToast('Đã gửi thông báo cho ' + n + ' khách' + (skipped ? ' · bỏ qua ' + skipped + ' khách chưa đồng ý nhận tin' : '')); } }) : null;
    })(),
    campaign ? React.createElement(BulkCampaign, {
      customers: selectedCustomers,
      onClose: function () { setCampaign(false); },
      onSent: function (n, cpId) { setCampaign(false); setSelectedIds([]); showToast('Đã gửi gợi ý cho ' + n + ' khách, tạo ' + n + ' việc gọi lại', { label: 'Xem chiến dịch', onClick: function () { location.hash = 'chien-dich-' + cpId; } }); },
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
function evidenceTab(row) { return /^(prof|acct|cm|task|ev)-/.test(row) ? 'left' : /^(h|sec|tx|cev)-/.test(row) ? 'portfolio' : null; } // [TẠM ẨN HOẠT ĐỘNG] trước đây: : 'history'
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

/* Liên hệ gần đây + lời hứa còn hiệu lực + nhịp liên hệ khách chọn — ngay trên trang khách (tab Hoạt động đang tạm ẩn) */
const RES_COLOR = { 'Hoàn thành': 'green', 'Đã lên lịch': 'blue', 'Không liên lạc được': 'red', 'Dời lịch': 'yellow', 'Hủy hẹn': 'gray', 'Hủy': 'gray', 'Đã gửi tin': 'gray' };
function ContactBlock(props) {
  const c = props.c;
  const [all, setAll] = React.useState(false);
  const evs = c.events.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  const shown = all ? evs : evs.slice(0, 3);
  const small = { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' };
  // Lời hứa: khách hứa (ghi trong cuộc gọi) · cam kết danh mục · lịch hẹn broker đã hứa
  const promises = [];
  c.events.forEach(function (ev) { if (ev.promise) promises.push({ key: 'ev-' + ev.id, who: 'Khách hứa', text: ev.promise.text, due: ev.promise.due, at: ev.at }); });
  c.commitments.filter(function (x) { return x.status === 'active'; }).forEach(function (cm) {
    promises.push({ key: 'cm-' + cm.id, who: 'Cam kết', text: cm.type === 'cutloss' ? 'Bán ' + cm.t + ' nếu giá xuống ' + U.fmt(cm.level) : cm.type === 'target' ? 'Cân nhắc bán ' + cm.t + ' khi lên ' + U.fmt(cm.level) : cm.cond, due: cm.reviewDate || null, at: cm.date });
  });
  c.tasks.filter(function (t) { return !t.done; }).forEach(function (t) { promises.push({ key: 'task-' + t.id, who: 'Lịch hẹn', text: t.title + (t.reschedules ? ' (đã dời ' + t.reschedules + ' lần)' : ''), due: t.due.slice(0, 10), time: U.hhmm(t.due), at: null }); });
  const cad = c.cadence || '';
  return React.createElement(PanelSection, { title: 'Liên hệ & lời hứa', meta: evs.length + ' lần' },
    promises.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      promises.map(function (pr) {
        const late = pr.due && pr.due < TODAY;
        return rowWrap(pr.key, React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)' } },
          React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, React.createElement(Tag, { text: pr.who, color: pr.who === 'Khách hứa' ? 'purple' : pr.who === 'Cam kết' ? 'blue' : 'gray', size: 'sm', preventShrink: true })),
          React.createElement('span', { style: { flex: 1, minWidth: 0, lineHeight: 1.4 } }, pr.text,
            pr.due ? React.createElement('span', { style: { color: late ? 'var(--t-tag-text-red)' : 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)' } }, ' · ' + (late ? 'quá hạn ' : 'hạn ') + (pr.time ? pr.time + ' ' : '') + U.ddmm(pr.due)) : null)), 0);
      })) : React.createElement('span', { style: small }, 'Không có lời hứa hay lịch hẹn đang mở.'),
    React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)', margin: '4px 0' } }),
    shown.length ? shown.map(function (ev) {
      return rowWrap('ev-' + ev.id, React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', flexWrap: 'wrap' } },
          React.createElement('span', { style: Object.assign({ fontWeight: 500 }, num) }, U.ddmm(ev.at) + ' ' + U.hhmm(ev.at)),
          React.createElement('span', { style: small }, ev.channel + (ev.broker && ev.broker !== 'Chị Lan' ? ' · ' + ev.broker : '')),
          React.createElement(Tag, { text: ev.result, color: RES_COLOR[ev.result] || 'gray', size: 'sm', preventShrink: true }),
          ev.decision ? React.createElement(Tag, { text: ev.decision, color: 'gray', size: 'sm', preventShrink: true }) : null),
        React.createElement('span', { style: { lineHeight: 1.4, color: 'var(--t-font-color-secondary)' } }, ev.note),
        ev.rec ? React.createElement('span', { style: small }, 'Ghi âm ' + ev.rec) : null), 0);
    }) : React.createElement('span', { style: small }, 'Chưa có lần liên hệ nào.'),
    evs.length > 3 ? React.createElement(LightButton, { title: all ? 'Thu gọn' : 'Xem tất cả ' + evs.length + ' lần', accent: 'tertiary', onClick: function () { setAll(!all); } }) : null,
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', marginTop: 4 } },
      React.createElement('span', { style: Object.assign({ flex: 1 }, small) }, 'Nhịp liên hệ'),
      React.createElement(Select, { sizeVariant: 'sm', value: String(cad), style: { width: 190 }, onChange: function (v) { c.cadence = v ? +v : null; audit('Cập nhật nhịp liên hệ', v ? 'Khách chọn ' + v + ' ngày/lần' : 'Theo hạng ' + c.tier, [c.id]); reval(c); props.onRefresh && props.onRefresh(); },
        options: [{ value: '', label: 'Theo hạng (' + TH.contact[c.tier] + ' ngày)' }].concat([14, 30, 60, 90].map(function (d) { return { value: String(d), label: 'Khách chọn: ' + (d === 90 ? '3 tháng' : d + ' ngày') + '/lần' }; })) })));
}
function contactBlock(c, onRefresh) { return React.createElement(ContactBlock, { key: 'cb-' + c.id, c: c, onRefresh: onRefresh }); }

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
    contactBlock(c, props.onRefresh || function () { setTick(function (x) { return x + 1; }); }),
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
      React.createElement(KVRow, { label: 'Người uỷ quyền', Icon: 'users', multiline: !!c.authorized.length, value: c.authorized.length ? c.authorized.map(function (a) { const d = phoneOwners(a.phone, c.id); return a.name + ' (' + a.rel + ') — ' + authRights(a).text + (d.length ? ' · ⚠ số này còn ở ' + d.length + ' tài khoản khác' : ''); }).join('; ') : light('Không có') }),
      React.createElement(KVRow, { label: 'Đồng ý nhận tin', Icon: 'message-check', value: React.createElement('span', { style: { display: 'inline-flex', gap: 4 } },
        React.createElement(Tag, { text: c.consent.zalo ? 'Zalo' : 'Chưa: Zalo', color: c.consent.zalo ? 'green' : 'gray', size: 'sm', preventShrink: true }),
        React.createElement(Tag, { text: c.consent.sms ? 'SMS' : 'Chưa: SMS', color: c.consent.sms ? 'green' : 'gray', size: 'sm', preventShrink: true })) }),
      React.createElement(KVRow, { label: 'Đồng ý ghi âm', Icon: 'microphone', value: c.consent.record ? React.createElement(Tag, { text: 'Có', color: 'green', size: 'sm', preventShrink: true }) : React.createElement(Tag, { text: 'Chưa có', color: 'red', size: 'sm', preventShrink: true }) }),
      React.createElement(KVRow, { label: 'Uỷ quyền cho broker', Icon: 'file-certificate', value: (function () { const st = brokerAuthState(c); return React.createElement(Tag, { text: st.text, color: st.color, size: 'sm', preventShrink: true }); })() }),
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
    c.holdings.length ? React.createElement(BlockCard, { title: 'Cổ phiếu đang giữ', meta: c.holdings.length + ' mã · giá lúc ' + NOW_HM + ' ' + U.ddmm(TODAY) },
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
  const res = issue.preset || S.solutions(c, issue, e);   // preset: giải pháp cho dự báo AI (aiIssue)
  const picks = res.options.filter(function (o) { return o.kind === 'choose' || o.kind === 'order' || o.kind === 'action'; }).slice(0, 3);
  const [pick, setPick] = React.useState(function () { const mm = /\.pick-(\d)/.exec(location.hash); return mm ? +mm[1] : null; });   // test '#khach-c003.issues.sol.pick-0'
  const [note, setNote] = React.useState('');   // kết quả trao đổi — bắt buộc khi không có phương án để chọn
  const noPicks = picks.length === 0;
  const LETTERS = ['A', 'B', 'C', 'D'];

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

  // Sau khi chọn phương án: sửa uỷ quyền broker + đổi trạng thái khách (áp dụng khi Chốt)
  const newStatus = 4;   // chốt phương án → khách luôn về "Ổn" (user yêu cầu, demo)
  const [authEdit, setAuthEdit] = React.useState(false);
  const [authCode, setAuthCode] = React.useState(c.brokerAuth ? c.brokerAuth.code : 'UQ-' + TODAY.slice(0, 4) + '-');
  const [authScope, setAuthScope] = React.useState(c.brokerAuth ? c.brokerAuth.scope : 'Nhận lệnh qua điện thoại và đặt lệnh thay khách');
  const [authTo, setAuthTo] = React.useState(c.brokerAuth && c.brokerAuth.to >= TODAY ? c.brokerAuth.to : U.addDays(TODAY, 365));
  const [authErr, setAuthErr] = React.useState('');
  const [, setAuthTick] = React.useState(0);
  const saveAuth = function () {
    if (!/^UQ-\d{4}-\d{4}$/.test(authCode.trim())) { setAuthErr('Mã uỷ quyền dạng UQ-yyyy-nnnn'); return; }
    if (!authTo || authTo < TODAY) { setAuthErr('Ngày hết hiệu lực phải từ hôm nay trở đi'); return; }
    const before = brokerAuthState(c).text;
    c.brokerAuth = { code: authCode.trim(), broker: 'Chị Lan', scope: authScope, from: c.brokerAuth && c.brokerAuth.from <= TODAY ? c.brokerAuth.from : TODAY, to: authTo };
    audit('Cập nhật uỷ quyền broker', before + ' → ' + authCode.trim() + ' đến ' + U.ddmmyyyy(authTo), [c.id]);
    setAuthErr(''); setAuthEdit(false); setAuthTick(function (x) { return x + 1; }); if (props.onChanged) props.onChanged();
    showToast('Đã cập nhật uỷ quyền ' + authCode.trim() + ' cho ' + c.name);
  };
  const revokeAuth = function () {
    audit('Thu hồi uỷ quyền broker', (c.brokerAuth ? c.brokerAuth.code : '') + ' · ' + c.name, [c.id]);
    c.brokerAuth = null; setAuthEdit(false); setAuthTick(function (x) { return x + 1; }); if (props.onChanged) props.onChanged();
    showToast('Đã thu hồi uỷ quyền của ' + c.name);
  };
  const applyStatus = function () {
    if (newStatus === e.status) return;
    const old = e.status;
    c.statusOverride = newStatus; reval(c);
    audit('Đổi trạng thái khách', LEVELS[old] + ' → ' + LEVELS[newStatus] + ' · ' + issue.title, [c.id]);
  };
  const custom = noPicks || pick === 'other';
  const ready = custom ? !!note.trim() : pick != null;
  const foot = React.createElement(PanelFootRow, { note: ready ? '' : noPicks ? 'Ghi kết quả trao đổi để chốt' : pick === 'other' ? 'Nhập phương án khác' : 'Chọn một phương án' },
    React.createElement(Button, { title: 'Đóng', variant: 'secondary', size: 'small', onClick: props.onClose }),
    React.createElement(Button, { title: 'Chốt phương án', accent: 'blue', size: 'small', disabled: !ready, onClick: function () {
      // Nhật ký "Chốt phương án" chỉ ghi khi lưu sự kiện thành công (không ghi khi bấm rồi huỷ)
      const opt = custom ? { title: note.trim(), kind: 'note' } : picks[pick];
      const from = e.status;
      applyStatus();
      props.onConfirm(Object.assign({}, opt, { statusFrom: from })); } }),
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
        res.cannot.length ? React.createElement('span', { style: { color: 'var(--t-tag-text-red)', fontWeight: 500 } }, 'Bị chặn') : null,
        res.cannot.length ? React.createElement('span', null, res.cannot.join(' · ')) : null,
        res.soon && res.soon.length ? React.createElement('span', { style: { color: 'var(--t-tag-text-orange)', fontWeight: 500 } }, 'Sắp bị chặn') : null,
        res.soon && res.soon.length ? React.createElement('span', null, res.soon.join(' · ')) : null),
      // Câu nên hỏi
      (res.ask && res.ask.length) ? React.createElement('div', { style: { padding: 'var(--t-spacing-2) var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
        React.createElement('div', { style: { fontWeight: 500, marginBottom: 4 } }, 'Câu nên hỏi khách'),
        React.createElement('ol', { style: { margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 } }, res.ask.map(function (q, qi) { return React.createElement('li', { key: qi }, q); }))) : null,
      // Phương án chọn
      noPicks ? null : React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-secondary)', fontWeight: 500 } }, 'Phương án khách chọn'),
      picks.map(optionCard),
      noPicks ? React.createElement(TextInput, { label: 'Kết quả trao đổi với khách *', multiline: true, rows: 3, fullWidth: true, value: note, onChange: setNote,
        placeholder: 'vd Khách rút tiền để mua nhà, chưa có ý định chuyển tài khoản; hẹn gọi lại sau 2 tuần',
        hint: 'Không có phương án để chọn — ghi lại khách nói gì để chốt.' }) : null,
      // Khác: broker tự nhập phương án (như ô "Other" khi chọn đáp án)
      noPicks ? null : React.createElement('div', {
        onClick: function () { setPick('other'); },
        style: { cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', border: '1px solid ' + (pick === 'other' ? 'var(--t-color-blue)' : 'var(--t-border-color-medium)'), boxShadow: pick === 'other' ? '0 0 0 1px var(--t-color-blue)' : 'none', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-primary)' },
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
          React.createElement('span', { style: { display: 'inline-grid', placeItems: 'center', width: 20, height: 20, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-accent-tertiary)', color: 'var(--t-accent-accent11)', fontWeight: 600, fontSize: 'var(--t-font-size-sm)' } }, LETTERS[picks.length] || '…'),
          React.createElement(Radio, { checked: pick === 'other' }),
          React.createElement('span', { style: { flex: 1, minWidth: 0, fontWeight: 500 } }, 'Khác')),
        pick === 'other' ? React.createElement('div', { onClick: function (ev) { ev.stopPropagation(); } },
          React.createElement(TextInput, { multiline: true, rows: 3, fullWidth: true, value: note, onChange: setNote,
            placeholder: 'Nhập phương án khác đã thống nhất với khách' })) : null),
      // Sau khi chọn phương án: uỷ quyền + trạng thái
      (pick != null || noPicks) ? (function () {
        const st = brokerAuthState(c), a = c.brokerAuth;
        const lab = function (t) { return React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-secondary)', fontWeight: 500 } }, t); };
        const box = { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-md)' };
        const dateStyle = { height: 32, boxSizing: 'border-box', padding: '0 8px', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-lighter, transparent)', color: 'var(--t-font-color-primary)', fontFamily: 'inherit', fontSize: 'var(--t-font-size-md)' };
        return React.createElement(React.Fragment, null,
          React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)', margin: 'var(--t-spacing-1) 0' } }),
          // Uỷ quyền cho broker
          lab('Uỷ quyền cho broker'),
          React.createElement('div', { style: box },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
              React.createElement(Tag, { text: st.text, color: st.color, size: 'sm', preventShrink: true }),
              a ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, a.code) : null,
              React.createElement('span', { style: { flex: 1 } }),
              authEdit ? null : React.createElement(LightButton, { title: a ? 'Sửa' : 'Thêm uỷ quyền', Icon: a ? 'pencil' : 'plus', accent: 'blue', onClick: function () { setAuthEdit(true); } })),
            a && !authEdit ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, a.scope + ' · ' + U.ddmmyyyy(a.from) + ' – ' + U.ddmmyyyy(a.to)) : null,
            authEdit ? React.createElement(React.Fragment, null,
              React.createElement(TextInput, { label: 'Mã uỷ quyền *', fullWidth: true, value: authCode, onChange: function (v) { setAuthCode(v); setAuthErr(''); }, placeholder: 'UQ-2026-0003' }),
              React.createElement(Select, { label: 'Phạm vi', fullWidth: true, value: authScope, onChange: setAuthScope,
                options: ['Nhận lệnh qua điện thoại và đặt lệnh thay khách', 'Chỉ tư vấn, không đặt lệnh'].map(function (v) { return { value: v, label: v }; }) }),
              React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
                React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Hiệu lực đến *'),
                React.createElement('input', { type: 'date', value: authTo, onChange: function (ev) { setAuthTo(ev.target.value); setAuthErr(''); }, style: dateStyle })),
              authErr ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-tag-text-red)' } }, authErr) : null,
              React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', alignItems: 'center' } },
                a ? React.createElement(LightButton, { title: 'Thu hồi', Icon: 'trash', accent: 'tertiary', onClick: revokeAuth }) : null,
                React.createElement('span', { style: { flex: 1 } }),
                React.createElement(Button, { title: 'Huỷ', variant: 'secondary', size: 'small', onClick: function () { setAuthEdit(false); setAuthErr(''); } }),
                React.createElement(Button, { title: 'Lưu uỷ quyền', accent: 'blue', size: 'small', onClick: saveAuth }))) : null));
      })() : null,
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
  const tradeMode = !!(pf.order || pf.lockOrder);   // form "Xác nhận đặt lệnh" (có ô khuyến nghị/đặt lệnh); Tạo sự kiện thường thì không
  const [order, setOrder] = React.useState(!!pf.order);          // nhận lệnh / đặt lệnh thay khách (phương án là lệnh → khoá bật)
  const [buy, setBuy] = React.useState(false);                   // khuyến nghị mua — tách riêng để chặn khi khách bị chặn tư vấn mua
  const buyBlock = EV[c.id].blocks.filter(function (b) { return b.state === 'now' && /Tư vấn mua|Mua thêm|Mọi giao dịch/.test(b.what); })[0] || null;
  const [linkSent, setLinkSent] = React.useState(false);
  // Mã ghi âm KHÔNG điền sẵn: phải lấy đúng mã cuộc ghi âm từ tổng đài (trừ khi ghi nhận cuộc gọi đã có ghi âm)
  const [rec, setRec] = React.useState(pf.un && pf.un.rec ? pf.un.rec : '');
  const [risk, setRisk] = React.useState(false);
  const [recConsent, setRecConsent] = React.useState(false);   // đồng ý ghi âm ngay trong cuộc gọi
  const needConsent = (order || buy) && !c.consent.record;
  const [cancelWhy, setCancelWhy] = React.useState('');
  const [selfPlace, setSelfPlace] = React.useState(false);   // khách tự đặt lệnh trên ứng dụng (broker không đặt thay)
  const needAuth = order || !!pf.needAuth;                    // chốt phương án (kể cả không phải lệnh) → bắt buộc uỷ quyền + khách xác nhận
  const [err, setErr] = React.useState('');
  // Xác minh uỷ quyền: hệ thống gửi mã tới số ĐÃ ĐĂNG KÝ của người xác nhận, khách đọc mã cho broker nhập.
  // Chứng minh chính khách (hoặc người được uỷ quyền đúng phạm vi) cho phép broker thao tác lần này.
  const people = [{ id: 'owner', name: c.name, rel: 'Chủ tài khoản', phone: c.phone, canOrder: true }].concat(c.authorized.map(function (a, i) {
    const r = authRights(a);
    return { id: 'a' + i, name: a.name, rel: a.rel, phone: a.phone, scope: r.text, canOrder: r.order, dup: phoneOwners(a.phone, c.id) };
  }));
  // Bước 1 — khách đã uỷ quyền cho broker chưa: broker nhập mã uỷ quyền (in trên giấy/hợp đồng uỷ quyền), hệ thống đối chiếu
  const ba = c.brokerAuth, baState = brokerAuthState(c);
  const [authIn, setAuthIn] = React.useState('');
  const [authOk, setAuthOk] = React.useState(null);
  const checkAuth = function () {
    const code = authIn.trim().toUpperCase().replace(/\s+/g, '');
    if (!code) { setErr('Nhập mã uỷ quyền.'); return; }
    if (!ba || baState.key !== 'ok' || code !== ba.code) {
      audit('Kiểm tra uỷ quyền broker thất bại', 'Mã ' + code + (ba ? '' : ' · khách chưa có uỷ quyền'), [c.id]);
      setErr(!ba ? 'Khách chưa uỷ quyền cho broker.' : baState.key !== 'ok' ? 'Uỷ quyền đã hết hạn.' : 'Mã uỷ quyền không khớp với hồ sơ của khách.'); return;
    }
    setAuthOk({ at: nowHM() }); setErr('');
    audit('Kiểm tra uỷ quyền broker', 'Mã ' + ba.code + ' hợp lệ · ' + ba.scope.toLowerCase() + ' · đến ' + U.ddmmyyyy(ba.to), [c.id]);
  };
  const [who, setWho] = React.useState('owner');
  const person = people.filter(function (x) { return x.id === who; })[0];
  const [otp, setOtp] = React.useState(null);        // { code, sentAt, tries }
  const [otpIn, setOtpIn] = React.useState('');
  const [verified, setVerified] = React.useState(null); // { name, rel, at }
  const sendOtp = function () {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setOtp({ code: code, sentAt: nowHM(), tries: 0 }); setOtpIn(''); setVerified(null); setErr('');
    audit('Gửi mã xác minh uỷ quyền', 'Gửi tới ' + person.rel.toLowerCase() + ' ' + person.name + ' · ' + mask(person.phone), [c.id]);
    showToast('Bản mẫu: mã gửi tới ' + mask(person.phone) + ' là ' + code);
  };
  const checkOtp = function () {
    if (!otp) { setErr('Hãy gửi mã cho khách trước.'); return; }
    if (otp.tries >= 3) { setErr('Sai quá 3 lần — mã đã bị khoá, hãy gửi mã mới.'); return; }
    if (otpIn.trim() !== otp.code) {
      const t = otp.tries + 1; setOtp(Object.assign({}, otp, { tries: t }));
      audit('Xác minh uỷ quyền thất bại', 'Sai mã lần ' + t + ' · ' + person.name, [c.id]);
      setErr(t >= 3 ? 'Sai 3 lần — mã đã bị khoá. Không thực hiện thao tác thay khách.' : 'Mã không đúng (còn ' + (3 - t) + ' lần).'); return;
    }
    const v = { name: person.name, rel: person.rel, at: nowHM() };
    setVerified(v); setErr('');
    audit('Xác minh uỷ quyền thành công', person.rel + ' ' + person.name + ' xác nhận bằng mã lúc ' + v.at, [c.id]);
  };

  const done = status === 'Hoàn thành';
  const CH = ['Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp'];
  const RES = ['Đồng ý', 'Cần suy nghĩ', 'Từ chối', 'Không liên lạc được'];

  function save() {
    if (!content.trim()) { setErr('Hãy nhập nội dung.'); return; }
    if (!date || !time) { setErr('Hãy chọn thời gian.'); return; }
    if (done && !result) { setErr('Hãy chọn kết quả.'); return; }
    if (needAuth && !selfPlace && baState.key !== 'ok') { setErr(baState.key === 'none' ? 'Khách chưa uỷ quyền cho broker — không được thao tác thay khách.' : 'Uỷ quyền đã hết hạn — không được thao tác thay khách.'); return; }
    if (needAuth && !selfPlace && !authOk) { setErr('Chưa kiểm tra mã uỷ quyền của khách cho broker.'); return; }
    if (order && !selfPlace && !person.canOrder) { setErr(person.name + ' — ' + person.scope + '.'); return; }
    if (needAuth && !selfPlace && !verified) { setErr('Chưa xác minh uỷ quyền: gửi mã cho khách và nhập mã khách đọc.'); return; }
    if (buy && buyBlock) { setErr('Khách đang bị chặn: ' + buyBlock.what.toLowerCase() + ' — không ghi được khuyến nghị mua.'); return; }
    if (status === 'Hủy hẹn' && !cancelWhy) { setErr('Chọn lý do huỷ hẹn.'); return; }
    if (status === 'Dời lịch' && date + 'T' + time <= TODAY + 'T' + nowHM()) { setErr('Ngày giờ hẹn mới phải sau bây giờ.'); return; }
    if (needConsent && !recConsent) { setErr('Khách chưa đồng ý ghi âm: phải hỏi và tick đồng ý trước khi tư vấn.'); return; }
    if ((order || buy) && !/^GA-\d{8}-\d{4}$/.test(rec.trim())) { setErr('Nhập mã cuộc ghi âm từ tổng đài (dạng GA-20261104-0930).'); return; }
    if ((order || buy) && !risk) { setErr('Tick đã cảnh báo rủi ro cho khách.'); return; }
    const before = EV[c.id].status, id = 'n' + Date.now();
    const at = (status === 'Đã lên lịch' || status === 'Dời lịch') ? TODAY + 'T' + nowHM() : date + 'T' + time;
    const evt = {
      id: id, at: at, loggedAt: TODAY, channel: channel, broker: 'Chị Lan',
      purpose: pf.issueTitle ? 'Xử lý vấn đề' : 'Chăm sóc định kỳ',
      result: done && result === 'Không liên lạc được' ? 'Không liên lạc được' : status,
      note: content.trim(), issueTitle: pf.issueTitle || '', option: pf.option || '',
    };
    if (done && result !== 'Không liên lạc được') evt.decision = result;
    if (needAuth && !selfPlace) { evt.verify = verified; evt.brokerAuth = ba.code; }
    if (needAuth && selfPlace) evt.selfPlaced = true;
    if (pf.followUp) c.tasks.push({ id: 'tf' + id, title: pf.followUp.title, due: pf.followUp.due, channel: 'Gọi đi', done: false });
    if (order || buy) { evt.rec = rec.trim(); evt.risk = true; }
    if (buy) evt.buyAdvice = true;
    if (status === 'Đã lên lịch') { evt.note += ' — hẹn ' + U.hhmm(date + 'T' + time) + ' ' + U.ddmm(date + 'T' + time); c.tasks.push({ id: 't' + id, title: content.trim(), due: date + 'T' + time, channel: channel, done: false }); }
    if (pf.task && done && result !== 'Không liên lạc được') { pf.task.done = true; pf.task.doneAt = TODAY; }
    // Dời lịch: đóng hẹn cũ, tạo hẹn mới đúng ngày giờ, đếm số lần dời
    if (status === 'Dời lịch' && pf.task) {
      const n = (pf.task.reschedules || 0) + 1;
      pf.task.done = true; pf.task.doneAt = TODAY; pf.task.closedAs = 'Dời lịch';
      c.tasks.push({ id: 't' + id, title: pf.task.title, due: date + 'T' + time, channel: pf.task.channel, done: false, reschedules: n, movedFrom: pf.task.due, campaignId: pf.task.campaignId });
      evt.note += ' — dời từ ' + U.hhmm(pf.task.due) + ' ' + U.ddmm(pf.task.due) + ' sang ' + time + ' ' + U.ddmm(date) + ' (lần dời thứ ' + n + ')';
    }
    // Huỷ hẹn: bắt buộc lý do, vẫn để lại việc báo khách
    if (status === 'Hủy hẹn' && pf.task) {
      pf.task.done = true; pf.task.doneAt = TODAY; pf.task.closedAs = 'Hủy';
      evt.note += ' — lý do huỷ: ' + cancelWhy.toLowerCase();
      c.tasks.push({ id: 'tc' + id, kind: 'notify', title: 'Báo khách đã huỷ hẹn: ' + pf.task.title.toLowerCase(), due: TODAY + 'T17:00', channel: 'Gọi đi', done: false });
    }
    if (pf.un) c.unlogged = c.unlogged.filter(function (u) { return u.id !== pf.un.id; });
    if (needConsent && recConsent) { c.consent.record = true; audit('Ghi nhận đồng ý ghi âm', 'Khách đồng ý ghi âm trong cuộc gọi', [c.id]); }
    c.events.push(evt);
    if (pf.optionAudit) audit('Chốt phương án', pf.optionAudit + (order || buy ? ' · mã ghi âm ' + evt.rec : ''), [c.id]);   // chỉ ghi khi lưu thành công
    audit('Ghi sự kiện', channel + ' · ' + evt.result + (evt.decision ? ' · ' + evt.decision : '') + (order && selfPlace ? ' · khách tự đặt lệnh trên ứng dụng, ghi âm ' + evt.rec : order ? ' · có đặt lệnh, xác minh bởi ' + verified.rel.toLowerCase() + ' ' + verified.name + ', ghi âm ' + evt.rec : buy ? ' · khuyến nghị mua, ghi âm ' + evt.rec : pf.needAuth ? (selfPlace ? ' · khách tự thực hiện' : ' · uỷ quyền ' + ba.code + ', xác nhận bởi ' + verified.rel.toLowerCase() + ' ' + verified.name) : ''), [c.id]);
    reval(c);
    const after = EV[c.id].status;
    if (pf.followUp) { props.onSaved('Đã chốt: ' + pf.option + ' · nhắc theo dõi ' + U.hhmm(pf.followUp.due) + ' ' + U.ddmm(pf.followUp.due) + (after !== before ? ' · trạng thái ' + LEVELS[before] + ' → ' + LEVELS[after] : '')); return; }
    props.onSaved(after !== before
      ? 'Đã lưu sự kiện. Trạng thái khách đổi từ "' + LEVELS[before] + '" sang "' + LEVELS[after] + '".'
      : 'Đã lưu sự kiện. Trạng thái: ' + LEVELS[after] + '.');
  }

  const foot = React.createElement(PanelFootRow, { note: err ? React.createElement('span', { style: { color: 'var(--t-color-red)' } }, err) : '' },
    React.createElement(Button, { title: props.onBack ? 'Huỷ' : 'Đóng', variant: 'secondary', size: 'small', onClick: props.onBack || props.onClose }),   // panel con: Huỷ = quay lại panel khách
    React.createElement(Button, { title: 'Lưu', accent: 'blue', size: 'small', onClick: save }),
  );

  const dateInput = { height: 32, boxSizing: 'border-box', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-primary)', padding: '0 var(--t-spacing-2)', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', width: '100%' };
  const checkRow = function (checked, set, label, req, disabled) {
    return React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', cursor: disabled ? 'default' : 'pointer', fontSize: 'var(--t-font-size-md)', opacity: disabled && !checked ? 0.5 : 1 } },
      React.createElement(Checkbox, { checked: checked, disabled: disabled, onChange: function () { if (!disabled) set(!checked); }, ariaLabel: label }),
      React.createElement('span', null, label, req ? React.createElement('span', { style: { color: 'var(--t-color-red)' } }, ' *') : null));
  };

  return React.createElement(SidePanel, {
    width: 440, Icon: 'calendar-plus', iconColor: 'var(--t-color-blue)',
    title: pf.task ? 'Ghi nhận việc' : tradeMode ? 'Xác nhận đặt lệnh' : pf.needAuth ? 'Xác nhận phương án' : 'Tạo sự kiện', onClose: props.onClose, onBack: props.onBack, foot: foot,
    width: props.width || 440,
  },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } },
      React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, c.name + (pf.issueTitle ? ' · ' + pf.issueTitle : '')),
      pf.task && pf.task.due.slice(0, 10) < TODAY ? React.createElement(InlineNotice, { tone: 'warn', title: 'Đang gắn với hẹn trễ ' + U.hhmm(pf.task.due) + ' ' + U.ddmm(pf.task.due) }, pf.task.title + ' — ghi kết quả, dời lịch hoặc huỷ (có lý do) để đóng hẹn này.') : null,
      React.createElement(TextInput, { label: 'Nội dung *', multiline: true, rows: 3, fullWidth: true, value: content, onChange: setContent, placeholder: 'vd Gọi báo tài khoản bị call, khách chọn nộp thêm tiền' }),
      React.createElement(Select, { label: 'Kênh', fullWidth: true, value: channel, onChange: setChannel, options: CH.map(function (v) { return { value: v, label: v }; }) }),
      // Có hẹn đang mở → Hoàn thành / Dời lịch / Huỷ hẹn; không có hẹn → Hoàn thành / Đã lên lịch
      React.createElement(RadioGroup, { label: 'Trạng thái', row: true, value: status, onChange: function (v) { setStatus(v); setErr(''); if (v === 'Dời lịch') { setDate(U.addDays(TODAY, 1)); setTime('09:00'); } }, options: (pf.task ? ['Hoàn thành', 'Dời lịch', 'Hủy hẹn'] : ['Hoàn thành', 'Đã lên lịch']).map(function (v) { return { value: v, label: v }; }) }),
      pf.task && pf.task.reschedules ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-tag-text-orange)' } }, 'Hẹn này đã dời ' + pf.task.reschedules + ' lần.') : null,
      status === 'Hủy hẹn' ? React.createElement(Select, { label: 'Lý do huỷ hẹn *', fullWidth: true, value: cancelWhy, onChange: setCancelWhy, placeholder: 'Chọn lý do',
        options: ['Khách chủ động xin huỷ', 'Khách đã tự xử lý xong', 'Broker không sắp xếp được', 'Hẹn trùng, đã gộp với hẹn khác'].map(function (v) { return { value: v, label: v }; }) }) : null,
      status === 'Hủy hẹn' ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Hệ thống tạo việc "Báo khách đã huỷ hẹn" hạn 17:00 hôm nay.') : null,
      done ? React.createElement(Select, { label: 'Kết quả *', fullWidth: true, value: result, onChange: setResult, placeholder: 'Chọn kết quả', options: RES.map(function (v) { return { value: v, label: v }; }) }) : null,
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--t-spacing-2)' } },
        React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, status === 'Dời lịch' ? 'Ngày hẹn mới *' : status === 'Đã lên lịch' ? 'Ngày hẹn *' : 'Ngày *'),
          React.createElement('input', { type: 'date', value: date, onChange: function (ev) { setDate(ev.target.value); }, style: dateInput })),
        React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Giờ *'),
          React.createElement('input', { type: 'time', value: time, onChange: function (ev) { setTime(ev.target.value); }, style: dateInput }))),
      // Khuyến nghị mua / đặt lệnh: chỉ ở bước "Xác nhận đặt lệnh" (pf.order/lockOrder) — form Tạo sự kiện không hiện (user 2026-11-09)
      tradeMode ? React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)' } }) : null,
      // Tách 2 ô: khuyến nghị mua (chặn khi khách bị chặn tư vấn mua) · nhận lệnh (phương án là lệnh thì khoá bật)
      tradeMode ? checkRow(buy, setBuy, 'Có khuyến nghị mua', false, !!buyBlock) : null,
      tradeMode && buyBlock ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', paddingLeft: 24, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-tag-text-red)' } },
        React.createElement('span', { style: { flex: 1 } }, 'Đang chặn: ' + buyBlock.what.toLowerCase()),
        buyBlock.code === 'V-33' ? React.createElement(LightButton, { title: linkSent ? 'Đã gửi link' : 'Gửi link làm lại phiếu', Icon: linkSent ? 'check' : 'send', accent: 'blue', disabled: linkSent, onClick: function () {
          setLinkSent(true); audit('Gửi link làm lại khảo sát', 'Gửi qua ' + (c.consent.zalo ? 'Zalo' : 'SMS'), [c.id]); showToast('Đã gửi link làm lại phiếu khảo sát cho ' + U.callName(c)); } }) : null) : null,
      tradeMode ? checkRow(order, setOrder, 'Nhận lệnh / đặt lệnh thay khách', false, !!pf.lockOrder) : null,
      pf.lockOrder ? React.createElement('span', { style: { paddingLeft: 24, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Phương án khách chọn là lệnh — bắt buộc đủ bước xác minh, ghi âm, cảnh báo rủi ro.') : null,
      (needAuth || buy) ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)' } },
        pf.needAuth ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Chốt phương án thay khách — cần uỷ quyền còn hiệu lực và khách xác nhận bằng mã.') : null,
        needAuth && baState.key !== 'ok' ? checkRow(selfPlace, function (v) { setSelfPlace(v); setErr(''); }, order ? 'Khách tự đặt lệnh trên ứng dụng (broker không đặt thay)' : 'Khách tự thực hiện (broker không thao tác thay)') : null,
        needAuth && !selfPlace ? React.createElement(React.Fragment, null,
        // 1) Khách đã uỷ quyền cho broker chưa (giấy/hợp đồng uỷ quyền) — nhập mã uỷ quyền để đối chiếu
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
          React.createElement(Icon, { name: 'file-certificate', size: 16, color: authOk ? 'var(--t-tag-text-green)' : 'var(--t-font-color-tertiary)' }),
          React.createElement('span', { style: { flex: 1, fontWeight: 500 } }, '1. Khách uỷ quyền cho broker *'),
          React.createElement(Tag, { text: authOk ? 'Hợp lệ · ' + authOk.at : baState.key === 'ok' ? 'Chưa kiểm tra' : baState.text, color: authOk ? 'green' : baState.key === 'ok' ? 'orange' : baState.color, Icon: authOk ? 'check' : undefined, preventShrink: true })),
        baState.key === 'none' ? React.createElement(InlineNotice, { tone: 'warn', title: 'Khách chưa uỷ quyền cho broker' }, 'Không được nhận lệnh hay đặt lệnh thay khách. Hướng dẫn khách tự đặt lệnh trên ứng dụng, hoặc ký giấy uỷ quyền tại quầy.')
        : baState.key === 'expired' ? React.createElement(InlineNotice, { tone: 'warn', title: 'Uỷ quyền đã hết hạn ngày ' + U.ddmmyyyy(ba.to) }, 'Mã ' + ba.code + ' không còn hiệu lực. Khách cần gia hạn uỷ quyền trước khi broker đặt lệnh thay.')
        : authOk ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', lineHeight: 1.4 } }, 'Uỷ quyền ' + ba.code + ' cho ' + ba.broker + ' · ' + ba.scope.toLowerCase() + ' · hiệu lực ' + U.ddmmyyyy(ba.from) + ' – ' + U.ddmmyyyy(ba.to) + '.')
        : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 'var(--t-spacing-2)' } },
              React.createElement(TextInput, { label: 'Mã uỷ quyền (trên giấy uỷ quyền của khách)', fullWidth: true, value: authIn, placeholder: 'vd UQ-2026-0001', LeftIcon: 'file-certificate',
                onChange: function (v) { setAuthIn(v.toUpperCase()); setErr(''); }, style: { flex: 1 } }),
              React.createElement(Button, { title: 'Kiểm tra', variant: 'secondary', size: 'small', disabled: !authIn.trim(), onClick: checkAuth })),
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Bản mẫu: mã của khách này là ' + ba.code + '.')),
        React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)' } }),
        // 2) Khách xác nhận lệnh lần này bằng mã OTP
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', opacity: authOk ? 1 : 0.5 } },
          React.createElement(Icon, { name: 'shield-lock', size: 16, color: verified ? 'var(--t-tag-text-green)' : 'var(--t-font-color-tertiary)' }),
          React.createElement('span', { style: { flex: 1, fontWeight: 500 } }, order ? '2. Khách xác nhận lệnh này *' : '2. Khách xác nhận phương án này *'),
          verified ? React.createElement(Tag, { text: 'Đã xác minh · ' + verified.at, color: 'green', Icon: 'check', preventShrink: true }) : React.createElement(Tag, { text: 'Chưa xác minh', color: 'orange', preventShrink: true })),
        authOk && people.length > 1 ? React.createElement(Select, { label: 'Người xác nhận', fullWidth: true, value: who, disabled: !!verified,
          onChange: function (v) { setWho(v); setOtp(null); setOtpIn(''); setErr(''); },
          options: people.map(function (x) { return { value: x.id, label: x.rel + ' · ' + x.name + (x.scope ? ' — ' + x.scope.toLowerCase() : '') }; }) }) : null,
        !person.canOrder ? React.createElement(InlineNotice, { tone: 'warn', title: 'Người này không được đặt lệnh' }, person.name + ' — ' + person.scope + '. Cần chủ tài khoản xác nhận.') : null,
        authOk && person.canOrder && !verified ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
            React.createElement('span', { style: { flex: 1, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } },
              otp ? 'Đã gửi mã tới ' + mask(person.phone) + ' lúc ' + otp.sentAt + ' · hiệu lực 5 phút' : 'Mã gửi tới số đã đăng ký ' + mask(person.phone) + ' (SMS / ứng dụng)'),
            React.createElement(Button, { title: otp ? 'Gửi lại mã' : 'Gửi mã xác minh', variant: 'secondary', size: 'small', Icon: 'send', onClick: sendOtp })),
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 'var(--t-spacing-2)' } },
            React.createElement(TextInput, { label: 'Mã khách đọc cho broker', fullWidth: true, value: otpIn, disabled: !otp || otp.tries >= 3, placeholder: '6 chữ số', LeftIcon: 'key',
              onChange: function (v) { setOtpIn(v.replace(/\D/g, '').slice(0, 6)); setErr(''); }, style: { flex: 1 } }),
            React.createElement(Button, { title: 'Xác minh', accent: 'blue', size: 'small', disabled: !otp || otpIn.length !== 6 || otp.tries >= 3, onClick: checkOtp })),
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Không đọc mã cho khách, không nhận mã qua tin nhắn khác. Sai 3 lần sẽ khoá mã.')) : null,
        verified ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, verified.rel + ' ' + verified.name + ' đã xác nhận bằng mã lúc ' + verified.at + ' — lưu vào nhật ký tuân thủ.') : null,
        authOk && person.dup && person.dup.length ? React.createElement(InlineNotice, { tone: 'warn', title: 'Số ' + mask(person.phone) + ' còn được uỷ quyền ở ' + person.dup.length + ' tài khoản khác' },
          person.dup.map(function (d) { return d.c.name + ' (' + d.rel + ')'; }).join('; ') + '. Hỏi lại người gọi đang thao tác cho tài khoản nào; nghi ngờ thì báo Tuân thủ.') : null,
        (order || buy) ? React.createElement('div', { style: { height: 1, background: 'var(--t-border-color-light)' } }) : null) : null,
        // Ghi âm + cảnh báo rủi ro (bắt buộc cho cả khuyến nghị mua và nhận lệnh)
        (order || buy) ? React.createElement(TextInput, { label: 'Mã cuộc ghi âm *', fullWidth: true, value: rec, onChange: function (v) { setRec(v.toUpperCase()); setErr(''); }, placeholder: 'GA-' + TODAY.replace(/-/g, '') + '-hhmm', hint: 'Lấy từ tổng đài sau khi kết thúc cuộc gọi — không tự đặt mã.' }) : null,
        needConsent ? React.createElement(InlineNotice, { tone: 'warn', title: 'Khách chưa đồng ý ghi âm' }, 'Theo Luật Bảo vệ dữ liệu cá nhân, phải có đồng ý trước khi ghi âm. Hỏi khách ở đầu cuộc gọi.') : null,
        needConsent ? checkRow(recConsent, setRecConsent, 'Khách đã đồng ý ghi âm trong cuộc gọi này', true) : null,
        (order || buy) ? checkRow(risk, setRisk, 'Đã cảnh báo rủi ro', true) : null) : null,
    ),
  );
}

/* =========================================================================
   Tab TỔNG QUAN — theo tài liệu C360 "Tổng quan" (RM-CUSTOMER-02 v4), dựng bằng component DS có sẵn.
   Khối xếp flex-wrap; bề rộng theo span (≥8 cả dòng · 5–7 nửa dòng · ≤4 khối hẹp).
   Bỏ qua phần prototype chưa có dữ liệu: banner duyệt / case / vai trò.
   Chi tiết danh mục cũ nằm cuối tab (id pf-detail) để chip bằng chứng vẫn nhảy tới đúng dòng.
   ========================================================================= */
function spanFlex(n) { return n >= 8 ? '1 1 100%' : n >= 5 ? '1 1 460px' : '1 1 300px'; }
function goPortfolioDetail() { flashEl(document.getElementById('pf-detail')); }
function OverviewTab(props) {
  const c = props.customer, e = props.e, m = e.m;
  const [horizon, setHorizon] = React.useState(c.horizon || '');
  const blk = function (span, p, kids) { return React.createElement(BlockCard, Object.assign({ style: { flex: spanFlex(span) } }, p), kids); };
  const link = function (title, fn) { return React.createElement(LightButton, { title: title, Icon: 'arrow-up-right', accent: 'blue', onClick: fn }); };
  const empty = function (note) { return React.createElement(BlockState, { state: 'empty', note: note }); };
  const sm = function (t, color) { return React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: color || 'var(--t-font-color-tertiary)', lineHeight: 1.4 } }, t); };
  const openTasks = c.tasks.filter(function (t) { return !t.done; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });

  // 1. Hôm nay nên làm gì — lấy vấn đề ưu tiên nhất
  const top = e.top;
  const o1 = top
    ? blk(8, { highlight: true, title: 'Hôm nay nên làm gì', meta: CATS[top.cat].short + ' · ' + top.title, right: levelTag(top.level) },
        React.createElement(React.Fragment, null,
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--t-spacing-4)' } },
            React.createElement('div', { style: { flex: '1 1 220px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 4 } },
              React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Vì sao lúc này'),
              React.createElement('span', { style: { lineHeight: 1.5 } }, top.why),
              top.evidence && top.evidence.length ? sm('Dựa trên: ' + top.evidence.map(function (v) { return v.label; }).join(' · ')) : null),
            React.createElement('div', { style: { flex: '1 1 220px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 'var(--t-spacing-4)', borderLeft: '1px solid var(--t-border-color-light)' } },
              React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Đề xuất'),
              React.createElement('span', { style: { fontWeight: 'var(--t-font-weight-semi-bold)', lineHeight: 1.5 } }, top.fix),
              sm('Gợi ý từ hệ thống — bạn quyết định.'))),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--t-spacing-2)', flexWrap: 'wrap', paddingTop: 'var(--t-spacing-2)', borderTop: '1px solid var(--t-accent-tertiary)' } },
            React.createElement(Button, { title: 'Tạo việc', variant: 'secondary', size: 'small', Icon: 'checkbox', onClick: props.onNewTask }),
            React.createElement(Button, { title: 'Xem giải pháp', accent: 'blue', size: 'small', Icon: 'bulb', onClick: function () { props.onSolution(top); } }))))
    : blk(8, { title: 'Hôm nay nên làm gì' }, sm('Không có việc cần làm cho khách này hôm nay.', 'var(--t-font-color-secondary)'));

  // 2. Attention & theo dõi — vấn đề đang mở + tóm tắt dự báo AI
  const preds = c.holdings.length ? aiPredictions(c) : [];
  const nUp = preds.filter(function (p) { return p.dir === 'up'; }).length, nDown = preds.filter(function (p) { return p.dir === 'down'; }).length;
  const attention = blk(11, { title: 'Attention & theo dõi', meta: e.issues.length + ' mở' + (preds.length ? ' · ' + preds.length + ' mã AI theo dõi' : ''), right: link('Xem tất cả', function () { props.onTab('issues'); }) },
    React.createElement(React.Fragment, null,
      e.issues.length
        ? miniTable([{ label: 'Attention' }, { label: 'Giá trị' }, { label: 'Mức' }, { label: 'Hạn' }, { label: 'Nhóm' }],
            e.issues.map(function (i) {
              return [React.createElement('span', { style: { fontWeight: 500, cursor: 'pointer' }, onClick: function () { CTX.onIssue && CTX.onIssue(i.id); } }, i.title),
                React.createElement('span', { style: { color: 'var(--t-font-color-secondary)' } }, i.short || '—'),
                levelTag(i.level), i.due ? dueText(i.due) : '—', CATS[i.cat].short];
            }))
        : sm('Không có Attention đang mở. Hiện không có mục nào từ các tín hiệu đang theo dõi.', 'var(--t-font-color-secondary)'),
      preds.length ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        React.createElement(AiMark), sm('Dự báo ngắn hạn: '),
        nUp ? React.createElement(Tag, { text: nUp + ' mã có thể tăng', color: 'green', size: 'sm', preventShrink: true }) : null,
        nDown ? React.createElement(Tag, { text: nDown + ' mã có thể giảm', color: 'red', size: 'sm', preventShrink: true }) : null,
        link('Xem Cần chú ý', function () { props.onTab('attention'); })) : null));

  // 3. Hàng KPI danh mục — bấm ô nào cũng xuống phần danh mục chi tiết
  const cost = c.holdings.reduce(function (a, x) { return a + x.qty * x.cost / 1e6; }, 0);
  const unreal = m.A - cost;
  const tx30 = c.txns.filter(function (t) { return U.dayDiff(t.date, TODAY) <= 30 && t.status !== 'Chờ khớp'; });
  const sumT = function (type) { return tx30.filter(function (t) { return t.type === type; }).reduce(function (a, t) { return a + t.amt; }, 0); };
  const dIn = sumT('Nạp tiền'), dOut = sumT('Rút tiền');
  const eod = 'Giá lúc ' + NOW_HM + ' · ' + U.ddmm(TODAY);
  const kpis = [
    { label: 'NAV', value: U.money(m.nav), sub: eod },
    { label: 'Tiền mặt', value: U.money(c.cash), sub: m.nav > 0 ? U.pct(c.cash / m.nav * 100, 0) + ' NAV' : '—' },
    c.holdings.length ? { label: 'Lãi/lỗ chưa thực hiện', value: React.createElement('span', { style: { color: unreal >= 0 ? 'var(--t-tag-text-green)' : 'var(--t-tag-text-red)' } }, (unreal >= 0 ? '+' : '') + U.money(unreal)), sub: (unreal >= 0 ? '+' : '') + U.pct(unreal / (cost || 1) * 100) + ' so với giá vốn' }
      : { label: 'Lãi/lỗ chưa thực hiện', value: 'Chưa có', sub: 'Chưa có dữ liệu danh mục' },
    { label: 'Hiệu suất (TWR)', value: 'Chưa có', sub: 'Chưa có dữ liệu hiệu suất' },
    c.margin ? { label: 'Margin', value: m.ratio != null ? 'Tỷ lệ ' + U.pct(m.ratio, 0) : 'Chưa có', sub: 'Nợ ' + U.money(m.debt) + ' · Sức mua ' + U.money(m.buying) }
      : { label: 'Margin', value: 'Không dùng', sub: 'Chưa mở margin' },
    tx30.length ? { label: 'Dòng tiền ròng 30 ngày', value: (dIn - dOut >= 0 ? '+' : '') + U.money(dIn - dOut), sub: 'Nạp ' + U.money(dIn) + ' · Rút ' + U.money(dOut) }
      : { label: 'Dòng tiền ròng 30 ngày', value: 'Chưa có', sub: 'Chưa có dữ liệu tiền 30 ngày' },
  ];
  const kpiRow = React.createElement('div', { style: { flex: '1 1 100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--t-spacing-2)' } },
    kpis.map(function (k) { return React.createElement(KpiTile, { key: k.label, label: k.label, value: k.value, sub: k.sub, onClick: goPortfolioDetail }); }));

  // 4. Lifecycle — suy ra từ dữ liệu tài khoản (prototype chưa có dữ liệu case)
  const STEPS = ['Prospect', 'Opening', 'Opened', 'Funded', 'Activated', 'Active Investor'];
  const cur = c.trades30 > 0 ? 5 : c.holdings.length ? 4 : c.cash > 0 ? 3 : 2;
  const dormant = c.trades30 === 0 && (c.idleDays || 0) >= TH.idleDays;
  const lifecycle = blk(8, { title: 'Lifecycle & Case đang mở', meta: '0 case', right: dormant ? React.createElement(Tag, { text: 'Dormant', color: 'gray', size: 'sm', preventShrink: true }) : null },
    React.createElement(React.Fragment, null,
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 4 } },
        STEPS.map(function (s, i) {
          return React.createElement('div', { key: s, style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } },
            React.createElement('span', { style: { height: 4, borderRadius: 2, background: i < cur ? 'var(--t-font-color-tertiary)' : i === cur ? 'var(--t-color-blue)' : 'var(--t-background-transparent-medium)' } }),
            React.createElement('span', { title: s, style: { fontSize: 'var(--t-font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: i === cur ? 'var(--t-color-blue)' : 'var(--t-font-color-tertiary)', fontWeight: i === cur ? 500 : 400 } }, s));
        })),
      sm('Không có case đang mở cho khách này.', 'var(--t-font-color-secondary)')));

  // 5. Việc cần làm
  const tasksBlk = blk(3, { title: 'Việc cần làm', meta: String(openTasks.length) },
    React.createElement(React.Fragment, null,
      openTasks.length ? openTasks.map(function (t) {
        const over = t.due.slice(0, 10) < TODAY;
        return React.createElement('div', { key: t.id, style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)' } },
          React.createElement(Checkbox, { checked: false, ariaLabel: 'Hoàn thành ' + t.title, onChange: function () { props.onLogTask(t); } }),
          React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              React.createElement('span', { title: t.title, style: { flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, t.title),
              over ? React.createElement(Tag, { text: 'Quá hạn', color: 'red', size: 'sm', preventShrink: true }) : null),
            sm('Hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due) + ' · ' + t.channel)));
      }) : sm('Không có việc đang mở.', 'var(--t-font-color-secondary)'),
      openTasks.length ? sm('Đánh dấu hoàn thành để ghi lại kết quả cuộc trao đổi.', 'var(--t-font-color-light)') : null,
      React.createElement('div', null, React.createElement(Button, { title: 'Việc mới', variant: 'secondary', size: 'small', Icon: 'plus', onClick: props.onNewTask }))));

  // 6. Danh mục tóm tắt — 3 mã lớn nhất
  const top3 = c.holdings.slice().sort(function (a, b) { return U.val(b) - U.val(a); }).slice(0, 3);
  const top3pct = top3.reduce(function (a, x) { return a + U.val(x); }, 0) / (m.A || 1) * 100;
  const pfBlk = blk(4, { title: 'Danh mục tóm tắt', right: c.holdings.length ? link('Xem đầy đủ', goPortfolioDetail) : null },
    top3.length ? React.createElement(React.Fragment, null,
      top3.map(function (x) {
        const pl = (U.priceOf(x) - x.cost) / x.cost * 100;
        return React.createElement(KVRow, { key: x.t, label: x.t, Icon: 'chart-pie', value: React.createElement('span', null, U.money(U.val(x)) + ' · ' + U.pct(U.val(x) / (m.A || 1) * 100, 0) + ' · ',
          React.createElement('span', { style: { color: pl >= 0 ? 'var(--t-tag-text-green)' : 'var(--t-tag-text-red)' } }, (pl >= 0 ? '+' : '') + U.pct(pl))) });
      }),
      sm(top3.length + ' mã lớn nhất · ' + U.pct(top3pct, 0) + ' danh mục cổ phiếu', 'var(--t-font-color-light)'))
      : empty('Chưa có dữ liệu danh mục. Lý do: tài khoản đang giữ toàn tiền mặt.'));

  // 7. Tương tác gần đây
  const evs = c.events.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  const done = evs.filter(function (ev) { return ev.result === 'Hoàn thành'; })[0];
  const chCount = {}; evs.forEach(function (ev) { chCount[ev.channel] = (chCount[ev.channel] || 0) + 1; });
  const mainCh = Object.keys(chCount).sort(function (a, b) { return chCount[b] - chCount[a]; })[0];
  const CH_COLOR = { 'Zalo': 'purple', 'Gọi đi': 'green', 'Khách gọi đến': 'green', 'Gặp trực tiếp': 'blue', 'Email': 'blue' };
  const stat = function (label, value) { return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } }, sm(label), React.createElement('span', { style: { fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, value)); };
  const interBlk = blk(8, { title: 'Tương tác gần đây', right: link('Xem tất cả', function () { props.onTab('timeline'); }) },
    React.createElement(React.Fragment, null,
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--t-spacing-2)', paddingBottom: 'var(--t-spacing-2)', borderBottom: '1px solid var(--t-border-color-light)' } },
        stat('Có ý nghĩa gần nhất', done ? U.ddmm(done.at) + ' · ' + U.dayDiff(done.at, TODAY) + ' ngày trước' : 'Chưa có'),
        stat('Loại tương tác', mainCh || 'Chưa có'),
        stat('Nhịp giao dịch thường', c.trades30 + ' lệnh / 30 ngày'),
        stat('Việc đang mở', String(openTasks.length))),
      evs.length
        ? miniTable([{ label: 'Kênh' }, { label: 'Ai' }, { label: 'Tóm tắt' }, { label: 'Kết quả' }, { label: 'Khi', r: true }],
            evs.slice(0, 5).map(function (ev) {
              return [React.createElement(Tag, { text: ev.channel, color: CH_COLOR[ev.channel] || 'gray', size: 'sm', preventShrink: true }),
                ev.broker || '—',
                React.createElement('span', { title: [ev.purpose, ev.note].filter(Boolean).join(' — ') }, [ev.purpose, ev.note].filter(Boolean).join(' — ')),
                ev.result, U.ddmm(ev.at)];
            }))
        : sm('Chưa có tương tác nào.', 'var(--t-font-color-secondary)')));

  // 8. Nhu cầu & hồ sơ còn thiếu
  const missing = [];
  if (!horizon) missing.push('Thiếu thời hạn đầu tư');
  if (c.survey && U.dayDiff(c.survey, TODAY) > TH.surveyDays) missing.push('Khảo sát khẩu vị quá hạn từ ' + U.ddmm(U.addDays(c.survey, TH.surveyDays)));
  if (c.idExpiry && U.dayDiff(TODAY, c.idExpiry) <= TH.idSoon) missing.push(U.dayDiff(TODAY, c.idExpiry) < 0 ? 'CCCD đã hết hạn' : 'CCCD sắp hết hạn ' + U.ddmmyyyy(c.idExpiry));
  const needBlk = blk(4, { title: 'Nhu cầu & hồ sơ còn thiếu' },
    React.createElement(React.Fragment, null,
      React.createElement(KVRow, { label: 'Mục tiêu', Icon: 'target', value: c.goal ? React.createElement(Tag, { text: c.goal, color: 'blue', size: 'sm' }) : '—' }),
      React.createElement(KVRow, { label: 'Khẩu vị (khai báo)', Icon: 'gauge', value: c.appetite ? React.createElement(Tag, { text: c.appetite, color: 'gray', size: 'sm' }) : '—' }),
      React.createElement(KVRow, { label: 'Chịu lỗ tối đa', Icon: 'trending-down', value: c.maxLoss != null ? c.maxLoss + '% danh mục' : '—' }),
      React.createElement(KVRow, { label: 'Thời hạn đầu tư', Icon: 'calendar', value: React.createElement(Select, { sizeVariant: 'sm', value: horizon, onChange: setHorizon, placeholder: 'Chưa xác định',
        options: [{ value: '', label: 'Chưa xác định' }, { value: 'Dưới 1 năm', label: 'Dưới 1 năm' }, { value: '1–3 năm', label: '1–3 năm' }, { value: '3–5 năm', label: '3–5 năm' }, { value: 'Trên 5 năm', label: 'Trên 5 năm' }], style: { width: 160 } }) }),
      missing.length ? React.createElement('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, missing.map(function (t) { return React.createElement(Tag, { key: t, text: t, color: 'yellow', size: 'sm' }); }))
        : sm('Hồ sơ đầy đủ.', 'var(--t-font-color-light)')));

  // 9. Tóm tắt quan hệ (AI) — sinh từ dữ liệu khách (mock)
  const secs = {}; c.holdings.forEach(function (x) { const s = U.sectorOf(x.t); secs[s] = (secs[s] || 0) + U.val(x); });
  const topSec = Object.keys(secs).sort(function (a, b) { return secs[b] - secs[a]; })[0];
  const b = function (t) { return React.createElement('span', { style: { fontWeight: 'var(--t-font-weight-medium)' } }, t); };
  const aiBlk = blk(4, { title: 'Tóm tắt quan hệ', right: React.createElement(AiMark) },
    (evs.length || c.holdings.length) ? React.createElement(React.Fragment, null,
      React.createElement('span', { style: { lineHeight: 1.6 } },
        'Khách ', b(c.tier), ' từ ', c.since, ', khẩu vị ', b((c.appetite || '—').toLowerCase()), '. ',
        done ? ['Lần trao đổi có ý nghĩa gần nhất ', b(U.ddmm(done.at)), ' qua ', done.channel.toLowerCase(), '. '] : 'Chưa có lần trao đổi nào được ghi nhận. ',
        topSec ? ['Danh mục ', b(c.holdings.length + ' mã'), ', tập trung ', b(topSec + ' ' + U.pct(secs[topSec] / (m.A || 1) * 100, 0)), '. '] : 'Đang giữ toàn tiền mặt. ',
        e.issues.length ? ['Đang có ', b(e.issues.length + ' vấn đề'), ', ưu tiên: ', top.title.toLowerCase(), '.'] : 'Hiện không có vấn đề cần xử lý.'),
      e.issues.length && top.level <= 1 ? React.createElement('span', { style: { display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-tag-text-yellow)' } },
        React.createElement(Icon, { name: 'alert-triangle', size: 14, color: 'var(--t-tag-text-yellow)' }), 'Kiểm chứng số liệu trước khi trao đổi — tóm tắt do AI tạo.') : null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        sm('Cập nhật ' + NOW_HM + ' hôm nay', 'var(--t-font-color-light)'), React.createElement('span', { style: { flex: 1 } }),
        React.createElement(Button, { title: 'Chuẩn bị cuộc gọi', variant: 'secondary', size: 'small', Icon: 'phone', onClick: function () { props.onTab('issues'); } })))
      : empty('Chưa đủ dữ liệu để tóm tắt quan hệ — khách chưa có giao dịch.'));

  // 10. Data health (mock) — 9 domain; "Hành vi số" quá hạn ở một số khách
  const lag = aiSeed(c.id) % 4 === 0;
  const DOM = [['Khách, broker, team', '07:00', '1 ngày'], ['Tài khoản & eKYC', '07:00', '1 ngày'], ['Tiền', NOW_HM, '15 phút'], ['Giao dịch', NOW_HM, '15 phút'], ['Danh mục', NOW_HM, '15 phút'],
    ['Sản phẩm', '06:00', '1 ngày'], ['Chuyển tài sản', '06:00', '1 ngày'], ['Hành vi số', lag ? U.ddmm(U.addDays(TODAY, -3)) : '06:30', '1 ngày'], ['Tương tác ngoài hệ thống', '07:30', '1 ngày']];
  const nLate = lag ? 1 : 0;
  const healthBlk = blk(8, { title: 'Data health', right: nLate ? React.createElement(Tag, { text: nLate + ' quá hạn', color: 'yellow', size: 'sm', preventShrink: true }) : React.createElement(Tag, { text: 'Tất cả đạt', color: 'green', size: 'sm', preventShrink: true }) },
    React.createElement(React.Fragment, null,
      miniTable([{ label: 'Domain' }, { label: 'Cập nhật' }, { label: 'SLA' }, { label: 'Trạng thái' }],
        DOM.map(function (d) { const late = lag && d[0] === 'Hành vi số'; return [d[0], d[1], d[2], React.createElement(Tag, { text: late ? 'Quá hạn' : 'Đạt', color: late ? 'yellow' : 'green', size: 'sm', preventShrink: true })]; }),
        null, DOM.map(function (d) { return lag && d[0] === 'Hành vi số' ? 'var(--t-tag-background-yellow)' : null; })),
      missing.length ? React.createElement(KVRow, { label: 'Dữ liệu còn thiếu', Icon: 'file-alert', value: 'Hồ sơ · ' + missing.join(' · ') }) : null));

  // Danh mục chi tiết (giữ nội dung tab Danh mục cũ)
  const detail = React.createElement('div', { id: 'pf-detail', style: { flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', borderRadius: 'var(--t-border-radius-md)' } },
    React.createElement('div', { style: { fontWeight: 500, paddingTop: 'var(--t-spacing-2)' } }, 'Danh mục chi tiết'),
    PortfolioTab(c, e));

  return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 'var(--t-spacing-3)' } },
    o1, attention, kpiRow, lifecycle, tasksBlk, pfBlk, interBlk, needBlk, aiBlk, healthBlk, detail);
}

/* Tab Timeline (mock): gộp sự kiện liên hệ · thông báo tài khoản · giao dịch · cuộc gọi chưa ghi, mới nhất trước */
function TimelineTab(c) {
  const items = [];
  (c.events || []).forEach(function (ev) {
    items.push({ at: ev.at, icon: ev.channel === 'Zalo' ? 'message-dots' : ev.channel === 'Gặp trực tiếp' ? 'users' : ev.channel === 'Khách gọi đến' ? 'phone-incoming' : 'phone',
      color: 'var(--t-font-color-tertiary)', title: ev.channel + (ev.purpose ? ' · ' + ev.purpose : ''), body: [ev.note, ev.decision ? 'Kết quả: ' + ev.decision : null].filter(Boolean).join(' — '),
      tag: ev.result ? [ev.result, { 'Hoàn thành': 'green', 'Đã lên lịch': 'blue', 'Không liên lạc được': 'red', 'Dời lịch': 'yellow', 'Hủy': 'gray' }[ev.result] || 'gray'] : null });
  });
  (c.acct || []).forEach(function (a) { items.push({ at: a.at, icon: 'building-bank', color: 'var(--t-tag-text-red)', title: 'Thông báo tài khoản', body: a.text }); });
  (c.txns || []).forEach(function (t) {
    const order = t.type === 'Mua' || t.type === 'Bán';
    items.push({ at: t.date, icon: order ? (t.type === 'Mua' ? 'arrow-down-left' : 'arrow-up-right') : 'cash', color: t.type === 'Bán' || t.type === 'Rút tiền' ? 'var(--t-tag-text-orange)' : 'var(--t-color-blue)',
      title: t.type + (t.t ? ' ' + t.t : ''), body: (t.t ? U.fmt(t.qty) + ' × ' + U.fmt(t.price) + ' · ' : '') + U.money(t.amt),
      tag: t.status === 'Chờ khớp' ? ['Chờ khớp', 'blue'] : null });
  });
  (c.unlogged || []).forEach(function (u) { items.push({ at: u.at, icon: 'phone-incoming', color: 'var(--t-tag-text-orange)', title: u.dir + ' · ' + u.dur, body: 'Ghi âm ' + u.rec, tag: ['Chưa ghi nội dung', 'orange'] }); });
  items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  if (!items.length) return React.createElement(EmptyState, { Icon: 'timeline', title: 'Chưa có hoạt động', subtitle: 'Khách chưa có liên hệ hay giao dịch nào.' });
  const hasTime = function (s) { return String(s).length > 10; };
  return React.createElement(BlockCard, { title: 'Dòng thời gian', meta: items.length + ' mục · dữ liệu minh hoạ' },
    items.map(function (it, ii) {
      const last = ii === items.length - 1;
      return React.createElement('div', { key: ii, style: { display: 'flex', gap: 'var(--t-spacing-3)' } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 } },
          React.createElement('span', { style: { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', boxSizing: 'border-box', flexShrink: 0 } }, React.createElement(Icon, { name: it.icon, size: 13, color: it.color })),
          last ? null : React.createElement('span', { style: { flex: 1, width: 1, background: 'var(--t-border-color-light)', minHeight: 12 } })),
        React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: last ? 0 : 'var(--t-spacing-3)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minHeight: 24, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontWeight: 500 } }, it.title),
            it.tag ? React.createElement(Tag, { text: it.tag[0], color: it.tag[1], size: 'sm', preventShrink: true }) : null,
            React.createElement('span', { style: { flex: 1 } }),
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' } }, U.ddmm(it.at) + (hasTime(it.at) ? ' · ' + U.hhmm(it.at) : ''))),
          it.body ? React.createElement('span', { style: { color: 'var(--t-font-color-secondary)', lineHeight: 1.4 } }, it.body) : null));
    }));
}

/* Tab Cần chú ý (mock AI): dự báo ngắn hạn cho từng mã khách đang giữ — tăng / giảm / đi ngang.
   Sinh tất định từ mã + lãi/lỗ để mỗi lần mở đều giống nhau. Chỉ minh hoạ, không phải khuyến nghị. */
function aiSeed(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function aiPredictions(c) {
  const UP = ['Dòng tiền khối ngoại mua ròng 5 phiên liên tiếp', 'KQKD quý gần nhất vượt kỳ vọng thị trường', 'Giá vượt đường trung bình 20 phiên với khối lượng tăng', 'Ngành đang được hưởng lợi từ chính sách mới', 'Sắp chốt quyền cổ tức tiền mặt'];
  const DOWN = ['Khối ngoại bán ròng mạnh trong tuần', 'Giá thủng hỗ trợ ngắn hạn, khối lượng bán tăng', 'Biên lợi nhuận dự kiến giảm do giá nguyên liệu tăng', 'Tin đồn tiêu cực về kế hoạch phát hành thêm', 'Ngành bị hạ tỷ lệ cho vay ký quỹ'];
  const FLAT = ['Biên độ dao động hẹp, thiếu thông tin hỗ trợ', 'Thanh khoản thấp, chờ tín hiệu rõ hơn'];
  return c.holdings.map(function (x) {
    const h = aiSeed(x.t + c.id), p = U.priceOf(x), pl = (p - x.cost) / x.cost * 100;
    const dir = h % 5 === 0 ? 'flat' : (h % 2 === 0 ? 'up' : 'down');
    const pool = dir === 'up' ? UP : dir === 'down' ? DOWN : FLAT;
    const move = dir === 'flat' ? 0 : 2 + (h % 7);
    const conf = 55 + (h >>> 3) % 31;   // >>> : h là số không dấu, >> cho số âm → độ tin cậy/căn cứ sai
    const why = [pool[h % pool.length], pool[(h >>> 4) % pool.length]].filter(function (v, i, a) { return a.indexOf(v) === i; });
    const act = dir === 'up' ? (pl < 0 ? 'Gợi ý trao đổi: giữ vị thế, chưa cắt lỗ vội.' : 'Gợi ý trao đổi: cân nhắc giữ hoặc đặt giá mục tiêu chốt lời.')
      : dir === 'down' ? (U.val(x) / (EV[c.id].m.A || 1) > 0.2 ? 'Gợi ý trao đổi: tỷ trọng lớn — cân nhắc giảm bớt hoặc đặt điểm cắt lỗ.' : 'Gợi ý trao đổi: theo dõi, cân nhắc đặt điểm cắt lỗ.')
      : 'Gợi ý trao đổi: chưa cần hành động, theo dõi thêm.';
    return { x: x, p: p, dir: dir, move: move, conf: conf, why: why, act: act, horizon: h % 3 === 0 ? '2 tuần tới' : '5 phiên tới' };
  }).sort(function (a, b) { return (a.dir === 'flat') - (b.dir === 'flat') || b.conf - a.conf; });
}
// Banner Sổ khách: khách giữ mã AI dự báo có thể giảm mạnh (tin cậy ≥ 82%, giảm ≥ 7%) — mạnh nhất lên trước
function aiAlert() {
  const hits = [];
  DB.forEach(function (c) {
    if (!c.holdings.length) return;
    aiPredictions(c).forEach(function (r) { if (r.dir === 'down' && r.conf >= 82 && r.move >= 7) hits.push({ c: c, r: r }); });   // chỉ tín hiệu mạnh
  });
  if (!hits.length) return null;
  const seen = {}, custs = hits.filter(function (h) { if (seen[h.c.id]) return false; seen[h.c.id] = 1; return true; });
  hits.sort(function (a, b) { return b.r.move - a.r.move || b.r.conf - a.r.conf || U.val(b.r.x) - U.val(a.r.x); });
  const top = hits[0];
  return { n: custs.length, top: top,
    text: 'AI dự báo · ' + custs.length + ' khách giữ mã có thể giảm — mạnh nhất: ' + top.c.name + ' (' + top.r.x.t + ' giảm ' + top.r.move + '–' + (top.r.move + 3) + '% · ' + top.r.horizon + ' · tin cậy ' + top.r.conf + '%)' };
}
// Giải pháp cho một dự báo AI — cùng định dạng S.solutions để dùng chung SolutionPanel
function aiIssue(c, r) {
  const t = r.x.t, p = r.p, q30 = Math.max(100, Math.round(r.x.qty * 0.3 / 100) * 100), val = U.val(r.x), A = EV[c.id].m.A || 1;
  const w = val / A * 100, w2 = (val - q30 * p / 1e6) / A * 100;
  const pl = (p - r.x.cost) / r.x.cost * 100;
  const opts = r.dir === 'down' ? [
    { kind: 'choose', title: 'Đặt điểm cắt lỗ ' + t + ' tại ' + U.fmt(Math.round(p * 0.95 / 100) * 100), fit: { text: 'Giữ vị thế', ok: true },
      rows: [['Làm gì', 'Khách tự đặt lệnh dừng lỗ trên ứng dụng'], ['Mất tối đa', '≈ ' + U.money(val * 0.05) + ' (5%)']] },
    { kind: 'order', title: 'Bán bớt ' + U.fmt(q30) + ' cổ phiếu ' + t, fit: { text: 'Giảm rủi ro', ok: true },
      rows: [['Bao nhiêu', U.fmt(q30) + ' cp × ' + U.fmt(p) + ' ≈ ' + U.money(q30 * p / 1e6)], ['Sau đó', 'Tỷ trọng ' + t + ' từ ' + U.pct(w, 0) + ' còn ' + U.pct(w2, 0)], ['Lãi/lỗ khi bán', (pl >= 0 ? 'Lãi ' : 'Lỗ ') + U.pct(Math.abs(pl), 0)]] },
    { kind: 'choose', title: 'Giữ nguyên, rà soát lại sau ' + r.horizon, fit: { text: 'Chờ thêm tín hiệu', ok: false },
      rows: [['Làm gì', 'Theo dõi tin, gọi lại khách nếu giá giảm thêm 5%']] },
  ] : r.dir === 'up' ? [
    { kind: 'choose', title: 'Giữ, đặt giá chốt lời ' + t + ' tại ' + U.fmt(Math.round(p * (1 + r.move / 100) / 100) * 100), fit: { text: 'Giữ vị thế', ok: true },
      rows: [['Làm gì', 'Khách tự đặt lệnh chốt lời trên ứng dụng'], ['Kỳ vọng', '+' + r.move + '–' + (r.move + 3) + '% · ' + r.horizon]] },
    pl > 0 ? { kind: 'order', title: 'Chốt lời ' + U.fmt(q30) + ' cổ phiếu ' + t, fit: { text: 'Khoá lãi', ok: true },
      rows: [['Bao nhiêu', U.fmt(q30) + ' cp × ' + U.fmt(p) + ' ≈ ' + U.money(q30 * p / 1e6)], ['Lãi khi bán', U.pct(pl, 0)]] }
      : { kind: 'choose', title: 'Giữ, chưa cắt lỗ vội', fit: { text: 'Chờ hồi', ok: true }, rows: [['Đang lỗ', U.pct(Math.abs(pl), 0)]] },
  ] : [
    { kind: 'choose', title: 'Giữ nguyên, theo dõi thêm', rows: [['Làm gì', 'Chưa cần hành động']] },
    { kind: 'choose', title: 'Đặt cảnh báo giá ' + t + ' ±5%', rows: [['Làm gì', 'Nhận thông báo khi giá vượt ' + U.fmt(Math.round(p * 1.05 / 100) * 100) + ' hoặc dưới ' + U.fmt(Math.round(p * 0.95 / 100) * 100)]] },
  ];
  const lbl = r.dir === 'down' ? 'có thể giảm' : r.dir === 'up' ? 'có thể tăng' : 'đi ngang';
  return { id: 'ai-' + t, title: 'AI: ' + t + ' ' + lbl + (r.move ? ' ' + r.move + '–' + (r.move + 3) + '%' : ''),
    preset: { can: ['Trao đổi thông tin', 'Nhận lệnh theo yêu cầu khách'], cannot: [], soon: [], options: opts,
      ask: ['Anh/chị đã biết tin "' + r.why[0].toLowerCase() + '" chưa?', 'Anh/chị dự định giữ ' + t + ' trong bao lâu?'] } };
}
function AttentionTab(c, onSolution) {
  if (!c.holdings.length) return React.createElement(EmptyState, { Icon: 'sparkles', title: 'Chưa có gì cần chú ý', subtitle: 'Khách không giữ cổ phiếu nào để AI theo dõi.' });
  const preds = aiPredictions(c);
  const META = { up: ['Có thể tăng', 'green', 'trending-up', 'var(--t-tag-text-green)'], down: ['Có thể giảm', 'red', 'trending-down', 'var(--t-tag-text-red)'], flat: ['Đi ngang', 'gray', 'arrows-horizontal', 'var(--t-font-color-tertiary)'] };
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    React.createElement(InlineNotice, { tone: 'info', title: 'Dự báo do AI tạo — chỉ để tham khảo' }, 'Dựa trên giá, dòng tiền và tin tức đến ' + NOW_HM + ' ' + U.ddmm(TODAY) + '. Không phải khuyến nghị đầu tư; broker kiểm chứng trước khi trao đổi với khách.'),
    preds.map(function (r) {
      const mt = META[r.dir];
      return React.createElement(BlockCard, { key: r.x.t,
        title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          React.createElement(Icon, { name: mt[2], size: 16, color: mt[3] }),
          React.createElement('b', null, r.x.t),
          React.createElement('span', { style: { fontWeight: 400 } }, mt[0] + (r.move ? ' ' + r.move + '–' + (r.move + 3) + '%' : '') + ' · ' + r.horizon),
          React.createElement(AiMark)),
        right: React.createElement('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center' } },
          React.createElement(Tag, { text: mt[0], color: mt[1], size: 'sm', preventShrink: true }),
          React.createElement(Tag, { text: 'Độ tin cậy ' + r.conf + '%', color: r.conf >= 75 ? 'blue' : 'gray', size: 'sm', preventShrink: true })) },
        React.createElement(KVRow, { label: 'Giá nay', value: U.fmt(r.p) + ' · ' + U.fmt(r.x.qty) + ' cp · ' + U.sectorOf(r.x.t) }),
        React.createElement(KVRow, { label: 'Căn cứ', multiline: true, value: React.createElement('ul', { style: { margin: 0, paddingLeft: 18 } }, r.why.map(function (w, wi) { return React.createElement('li', { key: wi }, w); })) }),
        React.createElement(KVRow, { label: 'Gợi ý', multiline: true, value: r.act }),
        // Giải pháp: tóm tắt phương án + mở panel Giải pháp (dùng chung với tab Vấn đề)
        (function () {
          const iss = aiIssue(c, r), L = ['A', 'B', 'C'];
          return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', paddingTop: 'var(--t-spacing-2)', borderTop: '1px solid var(--t-border-color-light)' } },
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Giải pháp'),
            iss.preset.options.map(function (o, oi) {
              return React.createElement('div', { key: oi, style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' } },
                React.createElement('span', { style: { display: 'inline-grid', placeItems: 'center', width: 18, height: 18, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-accent-tertiary)', color: 'var(--t-accent-accent11)', fontWeight: 600, fontSize: 'var(--t-font-size-sm)', flexShrink: 0 } }, L[oi]),
                React.createElement('span', { style: { flex: 1, minWidth: 0 } }, o.title),
                o.kind === 'order' ? React.createElement(Tag, { text: 'Có đặt lệnh', color: 'orange', size: 'sm', preventShrink: true }) : null);
            }),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end' } },
              React.createElement(Button, { title: 'Xem giải pháp', accent: 'blue', size: 'small', Icon: 'bulb', onClick: function () { if (onSolution) onSolution(iss); } })));
        })());
    }));
}

function overdueTask(c) { return c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; })[0] || null; }
function DetailScreen(props) {
  const c = props.customer, e = EV[c.id], m = e.m;
  const TAB_ALIAS = { overview: 'portfolio', portfolio: 'portfolio', issues: 'issues', history: 'timeline', timeline: 'timeline', attention: 'attention' }; // [TẠM ẨN HOẠT ĐỘNG] trước đây: history: 'history'
  const [tab, setTab] = React.useState(TAB_ALIAS[props.initialTab] || 'portfolio'); // [TẠM ẨN HOẠT ĐỘNG] trước đây: : 'history'
  const [evtKey, setEvtKey] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [solIssue, setSolIssue] = React.useState(function () {
    const ai = /\.aisol-(\d)/.exec(location.hash);   // test '#khach-c003.attention.aisol-0' → mở giải pháp cho dự báo AI thứ n
    if (ai && c.holdings.length) { const r = aiPredictions(c)[+ai[1]]; if (r) return aiIssue(c, r); }
    return props.initialSol && e.issues.length ? e.issues[0] : null;
  });
  const [evtPrefill, setEvtPrefill] = React.useState(function () {   // object => EventPanel mở
    const tk = props.initialTask && c.tasks.filter(function (t) { return t.id === props.initialTask && !t.done; })[0];   // hẹn đã đóng (dời/huỷ) thì không mở lại
    if (tk) return { task: tk, content: tk.title, channel: tk.channel, status: 'Hoàn thành' };
    const un = props.initialUn && c.unlogged.filter(function (u) { return u.id === props.initialUn; })[0];
    if (un) return unPrefill(un);
    const ot = overdueTask(c);
    if (props.initialCall) return ot ? { task: ot, content: ot.title, channel: 'Gọi đi', status: 'Hoàn thành', issueTitle: e.top ? e.top.title : '' } : { status: 'Hoàn thành', channel: 'Gọi đi', issueTitle: e.top ? e.top.title : '' };
    if (props.initialEvt || props.initialOrder) return props.initialOrder ? { order: true, status: 'Hoàn thành', channel: 'Gọi đi' } : {};
    return null;
  });
  const setToast = function (m) { showToast(m); }, toast = null;   // thông báo dùng ToastHost (SnackBar của DS)
  const [, setTick] = React.useState(0); // buộc render lại sau khi engine tính lại
  React.useEffect(function () { if (!toast) return; const t = setTimeout(function () { setToast(null); }, 4200); return function () { clearTimeout(t); }; }, [toast]);
  function afterSave(msg) { setEvtPrefill(null); setSolIssue(null); /* [TẠM ẨN HOẠT ĐỘNG] setTab('history'); */ setToast(msg); setTick(function (x) { return x + 1; }); }

  const openTasks = c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; }).length;
  // Tabs theo mẫu C360: label + " · n", không icon
  const tabs = [
    { id: 'portfolio', label: 'Tổng quan' },
    { id: 'issues', label: 'Vấn đề' + (e.issues.length ? ' · ' + e.issues.length : '') },
    { id: 'timeline', label: 'Timeline' },
    { id: 'attention', label: 'Cần chú ý' },
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
    React.createElement(Button, { title: 'Tạo việc', variant: 'secondary', size: 'small', Icon: 'checkbox', onClick: function () { const ot = overdueTask(c); openEvent(ot ? { task: ot, content: ot.title, channel: ot.channel, status: 'Dời lịch' } : { status: 'Đã lên lịch' }); } }),
  );

  const tabBody = tab === 'portfolio' ? React.createElement(OverviewTab, { customer: c, e: e, onTab: setTab, onSolution: openSolution,
        onLogTask: function (t) { openEvent({ task: t, content: t.title, channel: t.channel, status: 'Hoàn thành' }); },
        onNewTask: function () { openEvent({ status: 'Đã lên lịch' }); } })
    : tab === 'issues' ? IssuesTab(c, e, openSolution)
    : tab === 'timeline' ? TimelineTab(c)
    : tab === 'attention' ? AttentionTab(c, openSolution)
    : null; // [TẠM ẨN HOẠT ĐỘNG] trước đây: : HistoryTab(c, e, function (task) { openEvent({ task: task, content: task.title, channel: task.channel, status: 'Hoàn thành' }); });

  const main = React.createElement('div', { style: { flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' } },
    header,
    // Cảnh báo khi vào màn khách — bấm hành động trong banner mở đúng panel ngay tại trang này
    React.createElement(StatusBanners, { items: customerBanners(c, function (h) {
      const m2 = /\.(sol|un-\w+|task-\w+)$/.exec(h) || [];
      if (m2[1] === 'sol') { setTab('issues'); openSolution(e.top); return; }
      if (m2[1] && m2[1].indexOf('un-') === 0) { const u = c.unlogged.filter(function (x) { return 'un-' + x.id === m2[1]; })[0]; if (u) openEvent(unPrefill(u)); return; }
      if (m2[1] && m2[1].indexOf('task-') === 0) { const t = c.tasks.filter(function (x) { return 'task-' + x.id === m2[1]; })[0]; if (t) openEvent({ task: t, content: t.title, channel: t.channel, status: 'Hoàn thành' }); return; }
      location.hash = h;
    }), style: { borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 } }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, display: 'flex', minWidth: 0, width: '100%', overflow: 'hidden' } },
      React.createElement(LeftColumn, { onRefresh: function () { setTick(function (x) { return x + 1; }); }, customer: c, revealed: revealed, onReveal: function () { setRevealed(true); audit('Xem số điện thoại', 'Xem số của ' + c.name, [c.id]); }, onSolution: openSolution, onTab: setTab }),
      React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { flexShrink: 0, minWidth: 0, overflowX: 'auto', overflowY: 'hidden' } },
          React.createElement(Tabs, { tabs: tabs, activeId: tab, onChange: setTab, style: { padding: '0 var(--t-spacing-3)', width: 'max-content', minWidth: '100%' } })),
        React.createElement('div', { style: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' } },
          React.createElement('div', { style: { padding: 'var(--t-spacing-3)' } }, tabBody)),
      ),
    ),
  );

  const toastEl = null ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 100, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  return React.createElement(PagePanel, null,
    React.createElement('div', { style: { display: 'flex', flex: 1, minHeight: 0 } },
      main,
      solIssue ? React.createElement(SolutionPanel, {
        key: 'sol-' + solIssue.id, customer: c, issue: solIssue, onClose: function () { setSolIssue(null); },
        onChanged: function () { setTick(function (x) { return x + 1; }); },
        onConfirm: function (opt) {
          // Có đặt lệnh → bước "Xác nhận đặt lệnh" (uỷ quyền, OTP, ghi âm, cảnh báo rủi ro — bắt buộc theo luật)
          if (opt.kind === 'order') { openEvent({ issueTitle: solIssue.title, option: opt.title, optionAudit: opt.title + ' · ' + solIssue.title, content: 'Khách chọn: ' + opt.title, status: 'Hoàn thành', order: true, lockOrder: true }); return; }
          // Không đặt lệnh → vẫn qua bước uỷ quyền (mã uỷ quyền + khách xác nhận OTP) rồi mới chốt; lưu xong tự tạo việc theo dõi trước hạn
          const i = solIssue;
          openEvent({ issueTitle: i.title, option: opt.title, optionAudit: opt.title + ' · ' + i.title, content: opt.kind === 'note' ? opt.title : 'Khách chọn: ' + opt.title,
            status: 'Hoàn thành', channel: 'Gọi đi', needAuth: true, followUp: { title: 'Theo dõi: ' + opt.title, due: callbackDue(c, i) } });
        },
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
      c.events.push({ id: 'sb' + id + i, at: at, loggedAt: at.slice(0, 10), bulk: true, campaignId: id, channel: 'Zalo', broker: 'Chị Lan', purpose: 'Tin nhắc hàng loạt', result: 'Đã gửi tin', note: fillTpl(T, c) });
      const done = (hashId(c.id) % 100) < doneRate * 100;
      const doneAt = U.addDays(at.slice(0, 10), 1), code = EV[c.id].top.code;
      c.tasks.push({ id: 'st' + id + i, title: 'Gọi lại sau tin ' + T.name.toLowerCase(), due: U.addDays(at.slice(0, 10), 2) + 'T09:00', channel: 'Gọi đi', done: done, doneAt: done ? doneAt : null, campaignId: id });
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
      React.createElement(Button, { title: 'Gửi gợi ý mới', accent: 'blue', size: 'small', Icon: 'plus', onClick: function () { location.hash = 'so-khach'; props.onToast('Chọn khách ở Sổ khách (lọc Nhóm vấn đề → chọn dòng) rồi bấm “Gửi gợi ý”.'); } })),
    React.createElement(ViewBar, { viewName: 'Tất cả chiến dịch', viewIcon: 'send', count: list.length, actions: [] /* ẩn Filter · Sort · Options (chưa dùng) */ }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--t-spacing-3) var(--t-spacing-4) var(--t-spacing-6)' } },
      list.length ? React.createElement(RecordTable, {
        columns: columns, rows: list, hasAddColumn: false, addNewLabel: 'Gửi gợi ý mới', onAddNew: function () { location.hash = 'so-khach'; },
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
          if (col.id === 'msg') return React.createElement('span', { title: cpMsg(cp, r.c), style: { overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--t-font-color-secondary)' } }, cpMsg(cp, r.c));
          return null;
        },
      })),
  );
}

function AuditScreen() {
  const [act, setAct] = React.useState('');
  const actions = []; AUDIT.forEach(function (a) { if (actions.indexOf(a.action) < 0) actions.push(a.action); });
  const rows = AUDIT.filter(function (a) { return !act || a.action === act; }).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  const ACT_COLOR = { 'Xem số điện thoại': 'gray', 'Ghi sự kiện': 'blue', 'Gửi gợi ý hàng loạt': 'orange', 'Chốt phương án': 'purple', 'Ghi nhận đồng ý ghi âm': 'green', 'Kiểm chứng tin AI': 'green', 'Bác bỏ tin AI': 'red', 'Ghi phản hồi của khách': 'blue', 'Gửi mã xác minh uỷ quyền': 'gray', 'Xác minh uỷ quyền thành công': 'green', 'Xác minh uỷ quyền thất bại': 'red', 'Kiểm tra uỷ quyền broker': 'green', 'Kiểm tra uỷ quyền broker thất bại': 'red' };
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
    if (e.top && (e.status === 0 || (e.status === 1 && (!e.top.due || U.dayDiff(TODAY, e.top.due.date) <= 2)))) urgent.push({ c: c, e: e, issue: e.top });
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
    { key: 'urgent', title: 'Xử lý ngay', meta: 'Mọi khách Khẩn · khách Cao hạn trong 2 ngày', items: T.urgent, tag: 'Khẩn & cao', color: 'red' },
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
            React.createElement('span', { style: Object.assign({ fontSize: 'var(--t-font-size-lg)', fontWeight: 600, color: 'var(--t-tag-text-' + g.color + ')' }, num) }, g.items.length),
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, g.tag));
        })),
      groups.filter(function (g) { return !filter || filter === g.key; }).map(function (g) {
        return React.createElement(BlockCard, { key: g.key, title: g.title + ' · ' + g.items.length, meta: g.meta },
          g.items.length ? g.items.map(function (it, i) { return row(g, it, i); })
            : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Không có mục nào.'));
      })),
  );
}

/* =========================================================================
   BÀN LÀM VIỆC — theo khung Dashboard chuẩn (MvpDashboardScreen của source)
   Lưới 3 cột · thẻ 40px header · dòng 44px (Tag mức + Chip khách + lý do) · bấm dòng → panel khách tại chỗ.
   Thứ tự vẫn theo góc nhìn broker: ① có thể mất tiền hôm nay ② việc đã hứa ③ sổ khách.
   ========================================================================= */
const NOW_HM = '08:00';  // số liệu lúc 08:00 — mốc tính "còn bao lâu"
function timeLeft(due) {
  if (!due) return null;
  const d = U.dayDiff(TODAY, due.date);
  if (d < 0) return { text: 'Trễ ' + (-d) + ' ngày', late: true };
  if (d === 0) {
    if (!due.time) return { text: 'Hôm nay', late: true };
    const mins = (+due.time.slice(0, 2) * 60 + +due.time.slice(3, 5)) - (+NOW_HM.slice(0, 2) * 60 + +NOW_HM.slice(3, 5));
    if (mins <= 0) return { text: 'Đã tới hạn ' + due.time, late: true };
    const h = Math.floor(mins / 60), mm = mins % 60;
    return { text: 'Còn ' + (h ? h + 'g' : '') + (mm ? (h ? ' ' : '') + mm + 'p' : '') + ' · ' + due.time, late: true };
  }
  return { text: 'Còn ' + d + ' ngày · ' + U.ddmm(due.date), late: d <= 1 };
}
function morningCount() {
  const T = todayItems();
  return DB.filter(function (c) { return EV[c.id].status === 0 && EV[c.id].top; }).length + T.tasks.length + T.calls.length + T.follow.length;
}

function MorningScreen() {
  const [panel, setPanel] = React.useState(function () { const mm = /\.p=(\w+)$/.exec(location.hash); return mm && BY[mm[1]] ? { id: mm[1], context: null } : null; });   // { id, context } · test '#ban-lam-viec.p=c003'
  // Lưới 3 cột; khung hẹp (< 860px) xếp 1 cột — như source
  const [wide, setWide] = React.useState(true);
  const roRef = React.useRef(null);
  const gridRef = React.useCallback(function (el) {
    if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
    if (!el) return;
    setWide(el.clientWidth >= 860);
    if (window.ResizeObserver) { const ro = new ResizeObserver(function () { setWide(el.clientWidth >= 860); }); ro.observe(el); roRef.current = ro; }
  }, []);
  const span = function (n) { return wide ? 'span ' + n : '1 / -1'; };
  const open = function (id, context) { setPanel({ id: id, context: context || null }); };
  const isOn = function (id) { return panel && panel.id === id; };
  const T = todayItems();

  // ① khách có thể mất tiền hôm nay
  const atRisk = DB.filter(function (c) { return EV[c.id].status === 0 && EV[c.id].top; }).sort(function (a, b) {
    const da = EV[a.id].top.due, db = EV[b.id].top.due;
    const ka = da ? da.date + (da.time || '23:59') : '9', kb = db ? db.date + (db.time || '23:59') : '9';
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  // ② việc đã hứa — gộp 3 nguồn, trễ nhất lên đầu
  const promised = []
    .concat(T.tasks.map(function (it) { const over = it.task.due.slice(0, 10) < TODAY; return { c: it.c, kind: 'Hẹn', tag: 'gray', why: it.task.title, sub: it.task.channel + ' · hẹn ' + U.hhmm(it.task.due) + ' ' + U.ddmm(it.task.due), right: over ? 'Trễ ' + U.dayDiff(it.task.due, TODAY) + ' ngày' : 'Hôm nay', late: over, key: it.task.due, ctx: { icon: 'calendar-due', text: 'Hẹn: ' + it.task.title, label: 'Ghi nhận', go: 'khach-' + it.c.id + '.issues.task-' + it.task.id } }; }))
    .concat(T.calls.map(function (it) { return { c: it.c, kind: 'Cuộc gọi đến', tag: 'orange', why: 'Chưa ghi nội dung · ghi âm ' + it.un.rec, sub: it.un.dur + ' · ' + fmtAt(it.un.at), right: fmtAt(it.un.at), late: false, key: it.un.at, ctx: { icon: 'phone-incoming', text: 'Cuộc gọi đến ' + fmtAt(it.un.at) + ' chưa ghi nội dung', label: 'Ghi nhận', go: 'khach-' + it.c.id + '.issues.un-' + it.un.id } }; }))
    .concat(T.follow.map(function (it) { return { c: it.c, kind: 'Đã phản hồi', tag: 'blue', why: 'Phản hồi tin “' + it.cp.templateName + '”', sub: 'Chiến dịch gửi ' + U.ddmm(it.cp.at) + ' · cần gọi lại', right: 'Gọi lại', late: false, key: it.cp.at, ctx: { icon: 'message-reply', text: 'Khách phản hồi tin “' + it.cp.templateName + '”', label: 'Gọi lại', go: 'khach-' + it.c.id + '.issues.call' } }; }));
  promised.sort(function (a, b) { return (b.late ? 1 : 0) - (a.late ? 1 : 0) || (a.key < b.key ? -1 : 1); });
  // ③ sổ khách
  const counts = [0, 0, 0, 0, 0];
  DB.forEach(function (c) { counts[EV[c.id].status]++; });
  const cats = [1, 2, 3, 4, 5].map(function (k) {
    const mix = [0, 0, 0, 0, 0];
    DB.forEach(function (c) { const e = EV[c.id]; if (e.issues.some(function (i) { return i.cat === k; })) mix[e.status]++; });
    return { k: k, mix: mix, total: mix.reduce(function (a, b) { return a + b; }, 0) };
  });

  const TOP = 6;
  const row2 = function (key, on, onClick, title, tag, sub, right, late) {
    return React.createElement(DashRow, { key: key, on: on, onClick: onClick },
      React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0 } },
          React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, title),
          tag ? React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, tag) : null),
        sub ? React.createElement('span', { style: { display: 'flex', minWidth: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, sub) : null),
      right ? React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', fontWeight: 500, whiteSpace: 'nowrap', color: late ? 'var(--t-tag-text-red)' : 'var(--t-font-color-secondary)' } }, right) : null);
  };

  const riskCard = atRisk.length ? React.createElement(DashCard, { col: span(2), icon: dashTile('alert-triangle', 'red'), title: 'Có thể mất tiền hôm nay', count: atRisk.length, linkLabel: 'Xem tất cả', onLink: function () { location.hash = 'loc-lv=0'; } },
    atRisk.slice(0, TOP).map(function (c) {
      const e = EV[c.id], i = e.top, tl = timeLeft(i.due);
      return React.createElement(DashRow, { key: c.id, on: isOn(c.id), onClick: function () { open(c.id); } },
        React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, levelTag(e.status)),
        React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' } },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0 } },
            React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, React.createElement(Chip, { label: c.name, avatarType: 'rounded', variant: 'highlighted' })),
            React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' } }, c.acc + ' · ' + i.cat + ' · ' + CATS[i.cat].short),
            !c.consent.record ? React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, React.createElement(Tag, { text: 'Chưa đồng ý ghi âm', color: 'orange', preventShrink: true })) : null),
          React.createElement('span', { title: i.short, style: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, i.title + ' — ' + i.short),
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
            (c.pref ? 'Nên gọi: ' + c.pref + ' · ' : '') + 'Nếu không xử lý: ' + i.then)),
        tl ? React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', fontWeight: 500, whiteSpace: 'nowrap', color: tl.late ? 'var(--t-tag-text-red)' : 'var(--t-font-color-secondary)' } }, tl.text) : null);
    }))
    : React.createElement(DashEmpty, { col: span(2), icon: React.createElement(Icon, { name: 'circle-check', size: 14, color: 'var(--t-tag-text-green)' }), text: 'Không có khách nào có thể mất tiền hôm nay.' });

  const promisedCard = promised.length ? React.createElement(DashCard, { col: span(1), icon: dashTile('checklist', 'orange'), title: 'Việc đã hứa', count: promised.length, linkLabel: 'Xem tất cả', onLink: function () { location.hash = 'hom-nay'; } },
    promised.slice(0, TOP).map(function (p, idx) {
      return row2('p' + idx, isOn(p.c.id) && panel.context && panel.context.go === p.ctx.go, function () { open(p.c.id, p.ctx); },
        p.c.name, React.createElement(Tag, { text: p.kind, color: p.tag, preventShrink: true }), p.why, p.right, p.late);
    }),
    promised.length > TOP ? React.createElement('div', { style: { padding: 'var(--t-spacing-2) var(--t-spacing-3)', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Hiện ' + TOP + '/' + promised.length + ' việc trễ nhất') : null)
    : React.createElement(DashEmpty, { col: span(1), icon: React.createElement(Icon, { name: 'circle-check', size: 14, color: 'var(--t-tag-text-green)' }), text: 'Đã làm hết các việc đã hứa.' });

  const bookCard = React.createElement(DashCard, { col: span(2), icon: dashTile('address-book', 'blue'), title: 'Sổ khách', count: DB.length, linkLabel: 'Mở sổ khách', onLink: function () { location.hash = 'so-khach'; } },
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: wide ? 'repeat(5, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } },
      [0, 1, 2, 3, 4].map(function (lv) {
        return React.createElement('div', { key: lv, onClick: function () { location.hash = 'loc-lv=' + lv; },
          style: { cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', padding: 'var(--t-spacing-3)', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, LEVELS[lv]),
          React.createElement('span', { style: Object.assign({ fontSize: 'var(--t-font-size-xl)', fontWeight: 600, color: lv <= 1 && counts[lv] ? 'var(--t-tag-text-red)' : 'var(--t-font-color-primary)' }, num) }, counts[lv]),
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, U.pct(counts[lv] / DB.length * 100, 0) + ' sổ khách'));
      })));

  const aiRows = SIGNALS.slice().sort(function (a, b) { return (a.status === 'Chờ kiểm chứng' ? 0 : 1) - (b.status === 'Chờ kiểm chứng' ? 0 : 1); });
  const aiPending = SIGNALS.filter(function (x) { return x.status === 'Chờ kiểm chứng'; }).length;
  const aiCard = React.createElement(DashCard, { col: span(3), icon: dashTile('sparkles', 'purple'), title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, 'Cơ hội từ tin AI', React.createElement(AiMark)), count: aiPending + ' chờ kiểm chứng', linkLabel: 'Mở Cơ hội', onLink: function () { location.hash = 'co-hoi'; } },
    aiRows.map(function (sg) {
      return React.createElement(DashRow, { key: sg.id, onClick: function () { location.hash = 'co-hoi.s=' + sg.id; } },
        React.createElement('span', { style: { flexShrink: 0, display: 'flex' } }, React.createElement(Tag, { text: sg.status, color: SIG_COLOR[sg.status], preventShrink: true })),
        React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
          React.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, sg.title),
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, sg.type + ' · ' + sg.sources.length + ' nguồn · độ tin cậy ' + Math.round(sg.confidence * 100) + '% · ' + (sg.status === 'Bị bác bỏ' ? 'không dùng' : signalMatches(sg).fits.length + ' khách phù hợp'))),
        React.createElement('span', { style: { flexShrink: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' } }, fmtAt(sg.at)));
    }));
  const groupCard = React.createElement(DashCard, { col: span(1), icon: dashTile('category', 'purple'), title: 'Nhóm vấn đề', count: 5 },
    cats.map(function (g) {
      const hot = g.mix[0] + g.mix[1];
      const sub = g.total ? [0, 1, 2, 3].filter(function (lv) { return g.mix[lv]; }).map(function (lv) { return g.mix[lv] + ' ' + LEVELS[lv].toLowerCase(); }).join(' · ') : CATS[g.k].ok;
      return row2('g' + g.k, false, function () { location.hash = 'loc-cat=' + g.k; },
        g.k + ' · ' + CATS[g.k].short, hot ? React.createElement(Tag, { text: hot + ' khẩn/cao', color: 'red', preventShrink: true }) : null, sub, g.total + ' khách', false);
    }));

  return React.createElement(Page, {
    title: 'Bàn làm việc', Icon: 'layout-dashboard', iconColor: 'var(--t-tag-text-blue)',
    actions: React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' } }, 'Dữ liệu tính đến 04/11 ' + NOW_HM + ' · phiên mở 09:00'),
    rightPanel: panel ? React.createElement(CustomerPanel, { key: panel.id + (panel.context ? panel.context.go : ''), id: panel.id, context: panel.context, onClose: function () { setPanel(null); } }) : null,
  },
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--t-background-secondary)' } },
      React.createElement('div', { ref: gridRef, style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)', alignItems: 'start' } },
        riskCard, promisedCard, bookCard, groupCard, aiCard)));
}

/* =========================================================================
   CƠ HỘI TỪ TIN AI — luồng TÍCH CỰC, tách khỏi cảnh báo
   Nguyên tắc: AI chỉ thu thập + gợi ý. Broker phải KIỂM CHỨNG (nguồn, số liệu, còn hiệu lực) trước khi dùng với khách;
   tin chưa xác minh bị khoá. Sau khi trao đổi, broker ghi PHẢN HỒI CỦA KHÁCH để AI học lại.
   ========================================================================= */
const SIGNALS = [
  { id: 'ai1', type: 'Kết quả kinh doanh', title: 'FPT báo lãi 10 tháng tăng 21% so với cùng kỳ', tickers: ['FPT'], sectors: [], at: '2026-11-04T06:40', confidence: 0.91,
    summary: 'FPT công bố lợi nhuận trước thuế 10 tháng đạt khoảng 9.400 tỷ đồng, tăng 21% so với cùng kỳ; mảng công nghệ nước ngoài tăng 28%.',
    suggestion: 'Cập nhật cho khách đang giữ FPT. Với khách khẩu vị Cân bằng / Tăng trưởng: thông tin hỗ trợ việc tiếp tục giữ, chưa phải tín hiệu mua thêm.',
    sources: [{ name: 'Công bố thông tin FPT trên HOSE', at: '03/11 17:05', official: true }, { name: 'Vietstock', at: '03/11 18:20', official: false }],
    status: 'Chờ kiểm chứng' },
  { id: 'ai2', type: 'Tin đồn thị trường', title: 'VCB có thể chia cổ tức cổ phiếu tỷ lệ cao', tickers: ['VCB'], sectors: [], at: '2026-11-04T07:10', confidence: 0.58,
    summary: 'Một số diễn đàn cho rằng VCB sắp trình phương án chia cổ tức cổ phiếu khoảng 49,5%. Chưa thấy nghị quyết hay công bố chính thức.',
    suggestion: 'Chưa nên chia sẻ với khách cho tới khi có công bố chính thức từ VCB.',
    sources: [{ name: 'Diễn đàn F319', at: '03/11 21:40', official: false }, { name: 'Bài tổng hợp trên báo điện tử', at: '04/11 06:55', official: false }],
    status: 'Chờ kiểm chứng' },
  { id: 'ai3', type: 'Chính sách vĩ mô', title: 'NHNN hạ lãi suất điều hành 0,5 điểm %', tickers: [], sectors: ['Ngân hàng'], at: '2026-11-03T16:30', confidence: 0.86,
    summary: 'NHNN giảm lãi suất tái cấp vốn và tái chiết khấu 0,5 điểm % từ 05/11, kỳ vọng hỗ trợ tăng trưởng tín dụng.',
    suggestion: 'Cập nhật cho khách đang giữ cổ phiếu ngân hàng; nhắc rủi ro biên lãi thu hẹp, không khuyến nghị mua đuổi.',
    sources: [{ name: 'Thông cáo Ngân hàng Nhà nước', at: '03/11 16:00', official: true }, { name: 'VnExpress', at: '03/11 16:45', official: false }],
    status: 'Đã xác minh', review: { by: 'Chị Lan', at: '03/11 17:30', rating: 'Chính xác', note: 'Đã đối chiếu thông cáo NHNN, số liệu khớp.' } },
  { id: 'ai4', type: 'Giá hàng hoá', title: 'Giá thép HRC tăng 8% trong tháng', tickers: ['HPG', 'HSG'], sectors: [], at: '2026-11-02T09:00', confidence: 0.64,
    summary: 'Một bài viết cho rằng giá thép HRC nội địa tăng 8% trong tháng 10, có lợi cho nhóm thép.',
    suggestion: 'Cập nhật cho khách đang giữ HPG, HSG.',
    sources: [{ name: 'Blog phân tích cá nhân', at: '01/11 20:10', official: false }],
    status: 'Bị bác bỏ', review: { by: 'Chị Lan', at: '02/11 10:15', rating: 'Sai', note: 'Số liệu Hiệp hội Thép chỉ tăng 2,5%; nguồn không chính thống.' } },
];
const SIGNAL_FEEDBACK = {};   // { signalId: { customerId: 'Khách quan tâm' | 'Không quan tâm' } }
const SIG_COLOR = { 'Chờ kiểm chứng': 'orange', 'Đã xác minh': 'green', 'Bị bác bỏ': 'gray' };
function signalMatches(sg) {
  const fits = [], out = [];
  DB.forEach(function (c) {
    const held = c.holdings.filter(function (x) { return sg.tickers.indexOf(x.t) >= 0 || sg.sectors.indexOf(U.sectorOf(x.t)) >= 0; });
    if (!held.length) return;
    const e = EV[c.id];
    const why = 'Đang giữ ' + held.map(function (x) { return x.t; }).join(', ') + ' · khẩu vị ' + c.appetite.toLowerCase();
    // Bộ lọc phù hợp: rủi ro xử lý trước · hồ sơ phải còn hiệu lực · phải đồng ý nhận tin
    const reason = e.status === 0 ? 'Đang có cảnh báo khẩn — xử lý rủi ro trước'
      : e.issues.some(function (i) { return i.code === 'V-33' || i.code === 'V-31'; }) ? 'Hồ sơ hết hiệu lực — không được tư vấn'
      : !c.consent.zalo && !c.consent.sms ? 'Chưa đồng ý nhận tin'
      : null;
    (reason ? out : fits).push({ c: c, why: why, reason: reason });
  });
  return { fits: fits, out: out };
}

function SignalPanel(props) {
  const sg = SIGNALS.filter(function (x) { return x.id === props.id; })[0];
  const [checks, setChecks] = React.useState({});
  const [rating, setRating] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');
  if (!sg) return null;
  const mt = signalMatches(sg), pending = sg.status === 'Chờ kiểm chứng';
  const CHECKS = [['src', 'Đã mở và đọc nguồn gốc tin'], ['official', 'Có ít nhất 1 nguồn chính thống (công bố DN, sở GDCK, cơ quan nhà nước)'], ['numbers', 'Số liệu trong tóm tắt khớp với nguồn'], ['fresh', 'Tin còn hiệu lực, chưa bị đính chính']];
  const allChecked = CHECKS.every(function (k) { return checks[k[0]]; });
  const decide = function (ok) {
    if (ok && !sg.sources.some(function (x) { return x.official; })) { setErr('Không có nguồn chính thống — chưa thể xác minh. Chờ công bố chính thức hoặc bác bỏ.'); return; }
    if (ok && !allChecked) { setErr('Cần tick đủ 4 bước kiểm chứng.'); return; }
    if (!rating) { setErr('Hãy chọn đánh giá.'); return; }
    if (ok && rating === 'Sai') { setErr('Tin bị đánh giá Sai thì phải bác bỏ.'); return; }
    if (!ok && !note.trim()) { setErr('Ghi lý do bác bỏ để AI học lại.'); return; }
    sg.status = ok ? 'Đã xác minh' : 'Bị bác bỏ';
    sg.review = { by: 'Chị Lan', at: U.ddmm(TODAY) + ' ' + nowHM(), rating: rating, note: note.trim() };
    audit(ok ? 'Kiểm chứng tin AI' : 'Bác bỏ tin AI', sg.title + ' · ' + rating + (note.trim() ? ' · ' + note.trim() : ''), []);
    showToast(ok ? 'Đã xác minh tin. Có thể dùng với ' + mt.fits.length + ' khách phù hợp.' : 'Đã bác bỏ tin, lý do được gửi lại cho AI.');
    props.onChanged();
  };
  const check = function (k, label) {
    return React.createElement('label', { key: k, style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)', cursor: 'pointer', lineHeight: 1.4 } },
      React.createElement('span', { style: { paddingTop: 2 } }, React.createElement(Checkbox, { checked: !!checks[k], ariaLabel: label, onChange: function () { setErr(''); setChecks(function (o) { const n = Object.assign({}, o); n[k] = !n[k]; return n; }); } })),
      React.createElement('span', null, label));
  };
  const foot = pending
    ? React.createElement(PanelFootRow, { note: err ? React.createElement('span', { style: { color: 'var(--t-tag-text-red)' } }, err) : '' },
        React.createElement(Button, { title: 'Bác bỏ', variant: 'secondary', size: 'small', onClick: function () { decide(false); } }),
        React.createElement(Button, { title: 'Xác nhận đã kiểm chứng', accent: 'blue', size: 'small', Icon: 'shield-check', onClick: function () { decide(true); } }))
    : sg.status === 'Đã xác minh'
      ? React.createElement(PanelFootRow, { note: 'Chỉ gửi thông tin, không gửi khuyến nghị mua/bán' },
          React.createElement(Button, { title: 'Gửi thông tin cho ' + mt.fits.length + ' khách', accent: 'blue', size: 'small', Icon: 'send', disabled: !mt.fits.length, onClick: function () { props.onSend(sg, mt.fits.map(function (f) { return f.c; })); } }))
      : null;

  return React.createElement(SidePanel, { width: 440, Icon: 'sparkles', iconColor: 'var(--t-tag-text-purple)', title: sg.title, onClose: props.onClose, foot: foot },
    React.createElement(StatusBanners, { items: [pending
      ? { tone: 'warn', text: 'Tin do AI thu thập, chưa được kiểm chứng — chưa được dùng với khách.' }
      : sg.status === 'Đã xác minh' ? { tone: 'info', text: 'Đã kiểm chứng bởi ' + sg.review.by + ' lúc ' + sg.review.at + ' · đánh giá: ' + sg.review.rating + '.' }
      : { tone: 'block', text: 'Đã bác bỏ bởi ' + sg.review.by + ' lúc ' + sg.review.at + ': ' + sg.review.note }] }),
    React.createElement(PanelSection, { title: 'Thông tin AI thu thập', meta: sg.type },
      React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-1)', alignItems: 'center' } },
        React.createElement(AiMark, { title: 'Nội dung do AI tóm tắt từ các nguồn bên dưới' }),
        React.createElement(Tag, { text: 'Độ tin cậy ' + Math.round(sg.confidence * 100) + '%', color: sg.confidence >= 0.8 ? 'green' : sg.confidence >= 0.65 ? 'yellow' : 'orange', preventShrink: true }),
        sg.confidence < 0.65 ? React.createElement(Tag, { text: 'Cần kiểm tra kỹ', color: 'orange', preventShrink: true }) : null),
      React.createElement(QuoteBox, null, sg.summary),
      React.createElement(KVRow, { label: 'Thu thập lúc', Icon: 'clock', value: fmtAt(sg.at) }),
      React.createElement(KVRow, { label: 'Mã / ngành', Icon: 'chart-candle', value: sg.tickers.concat(sg.sectors).join(', ') })),
    React.createElement(PanelSection, { title: 'Nguồn', meta: sg.sources.length + ' nguồn' },
      sg.sources.map(function (s, i) {
        return React.createElement(PanelListRow, { key: i, Icon: 'link', text: s.name + ' · ' + s.at, title: 'Mở nguồn (bản mẫu)',
          trailing: React.createElement(Tag, { text: s.official ? 'Chính thống' : 'Chưa xác thực', color: s.official ? 'green' : 'gray', preventShrink: true }),
          onClick: function () { setChecks(function (o) { return Object.assign({}, o, { src: true }); }); showToast('Bản mẫu: mở nguồn "' + s.name + '"'); } });
      }),
      !sg.sources.some(function (s) { return s.official; }) ? React.createElement(InlineNotice, { tone: 'warn', title: 'Không có nguồn chính thống' }, 'Không đủ điều kiện xác minh cho tới khi có công bố chính thức.') : null),
    React.createElement(PanelSection, { title: 'Gợi ý của AI' },
      React.createElement('span', { style: { lineHeight: 1.5 } }, sg.suggestion),
      React.createElement(InlineNotice, { tone: 'empty', title: 'Chỉ để broker tham khảo' }, 'Không gửi nguyên văn cho khách. Khuyến nghị mua/bán phải chốt riêng từng khách, có ghi âm.')),
    pending ? React.createElement(PanelSection, { title: 'Kiểm chứng của broker' },
      CHECKS.map(function (k) { return check(k[0], k[1]); }),
      React.createElement(RadioGroup, { label: 'Đánh giá độ chính xác', row: true, value: rating, onChange: function (v) { setErr(''); setRating(v); },
        options: [{ value: 'Chính xác', label: 'Chính xác' }, { value: 'Chính xác một phần', label: 'Một phần' }, { value: 'Sai', label: 'Sai' }] }),
      React.createElement(TextInput, { label: 'Ghi chú (bắt buộc khi bác bỏ)', multiline: true, rows: 2, fullWidth: true, value: note, onChange: setNote, placeholder: 'vd Đã đối chiếu công bố thông tin, số liệu khớp' })) : null,
    React.createElement(PanelSection, { title: 'Khách phù hợp', meta: mt.fits.length + ' phù hợp · ' + mt.out.length + ' bị loại', last: true },
      mt.fits.length ? mt.fits.map(function (f) {
        const fb = (SIGNAL_FEEDBACK[sg.id] || {})[f.c.id];
        return React.createElement(PanelItemRow, { key: f.c.id, title: f.c.name, sub: f.why, onClick: function () { location.hash = 'khach-' + f.c.id; },
          right: fb ? React.createElement(Tag, { text: fb, color: fb === 'Khách quan tâm' ? 'green' : 'gray', preventShrink: true }) : levelTag(EV[f.c.id].status) });
      }) : React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)' } }, 'Không có khách phù hợp.'),
      mt.out.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, opacity: 0.7 } },
        React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', marginTop: 'var(--t-spacing-1)' } }, 'Bị loại khỏi gợi ý'),
        mt.out.map(function (f) { return React.createElement(PanelItemRow, { key: f.c.id, title: f.c.name, sub: f.reason }); })) : null));
}

function OpportunitiesScreen() {
  const [, setTick] = React.useState(0);
  const [panelId, setPanelId] = React.useState(function () { const mm = /\.s=(\w+)$/.exec(location.hash); return mm ? mm[1] : null; });   // test '#co-hoi.s=ai1'
  const [send, setSend] = React.useState(null);   // { sg, customers }
  const pending = SIGNALS.filter(function (s) { return s.status === 'Chờ kiểm chứng'; }).length;
  const columns = [
    { id: 'title', label: 'Tin AI thu thập', type: 'text', width: 330, Icon: 'sparkles' },
    { id: 'status', label: 'Kiểm chứng', type: 'select', width: 140, Icon: 'shield-check' },
    { id: 'conf', label: 'Độ tin cậy', type: 'number', width: 110 },
    { id: 'src', label: 'Nguồn', type: 'link', width: 150 },
    { id: 'fit', label: 'Khách phù hợp', type: 'count', width: 130 },
    { id: 'fb', label: 'Phản hồi của khách', type: 'select', width: 160, Icon: 'message-circle' },
    { id: 'at', label: 'Thu thập lúc', type: 'date', width: 120 },
  ];
  const rows = SIGNALS.slice().sort(function (a, b) { const r = { 'Chờ kiểm chứng': 0, 'Đã xác minh': 1, 'Bị bác bỏ': 2 }; return r[a.status] - r[b.status] || (a.at < b.at ? 1 : -1); });
  return React.createElement(Page, { title: 'Cơ hội', icon: dashTile('target-arrow', 'purple'),
    actions: React.createElement(AiMark, { title: 'Tin do AI thu thập — phải kiểm chứng trước khi dùng' }),
    rightPanel: panelId ? React.createElement(SignalPanel, { key: panelId + SIGNALS.filter(function (s) { return s.id === panelId; })[0].status, id: panelId, onClose: function () { setPanelId(null); },
      onChanged: function () { setTick(function (x) { return x + 1; }); },
      onSend: function (sg, cs) { setSend({ sg: sg, customers: cs }); } }) : null },
    React.createElement(ViewBar, { viewName: 'Tin AI thu thập', viewIcon: 'sparkles', count: rows.length, actions: [] }),
    React.createElement(StatusBanners, { style: { borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 }, items: [
      pending ? { tone: 'warn', text: pending + ' tin AI chờ kiểm chứng — chỉ tin đã xác minh mới được dùng với khách.' } : { tone: 'info', text: 'Đã kiểm chứng hết tin AI hôm nay.' }] }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', paddingLeft: 'var(--t-spacing-3)' } },
      React.createElement(RecordTable, { columns: columns, rows: rows, hasAddColumn: false, addNewLabel: '—', aggregates: { title: rows.length + ' tin' },
        onRowClick: function (r) { setPanelId(r.id); },
        renderCell: function (sg, col) {
          const mt = col.id === 'fit' || col.id === 'fb' ? signalMatches(sg) : null;
          if (col.id === 'title') return React.createElement('span', { onClick: function () { setPanelId(sg.id); }, title: sg.title, style: { cursor: 'pointer', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' } }, sg.title);
          if (col.id === 'status') return React.createElement(Tag, { text: sg.status, color: SIG_COLOR[sg.status], preventShrink: true });
          if (col.id === 'conf') return React.createElement('span', { style: Object.assign({ color: sg.confidence < 0.65 ? 'var(--t-tag-text-orange)' : 'var(--t-font-color-primary)' }, num) }, Math.round(sg.confidence * 100) + '%');
          if (col.id === 'src') { const off = sg.sources.filter(function (s) { return s.official; }).length; return React.createElement('span', { style: { color: off ? 'var(--t-font-color-primary)' : 'var(--t-tag-text-orange)' } }, sg.sources.length + ' nguồn · ' + (off ? off + ' chính thống' : 'chưa chính thống')); }
          if (col.id === 'fit') return React.createElement('span', { style: num }, sg.status === 'Bị bác bỏ' ? '—' : mt.fits.length + ' khách');
          if (col.id === 'fb') { const f = SIGNAL_FEEDBACK[sg.id] || {}, n = Object.keys(f).length, yes = Object.keys(f).filter(function (k) { return f[k] === 'Khách quan tâm'; }).length; return n ? React.createElement('span', null, yes + '/' + n + ' quan tâm') : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có'); }
          if (col.id === 'at') return fmtAt(sg.at);
          return null;
        } })),
    send ? React.createElement(BulkCampaign, { customers: send.customers,
      extraTemplate: { code: 'MT-AI-' + send.sg.id.toUpperCase(), name: 'Thông tin đã kiểm chứng: ' + send.sg.title, cats: [], channels: ['Zalo', 'SMS'], status: 'Đã duyệt', approvedAt: U.ddmm(TODAY),
        body: '{ten} ơi, có thông tin mới liên quan mã mình đang giữ: ' + send.sg.title.toLowerCase() + '. Em gửi để mình tham khảo, cần trao đổi thêm em gọi nhé.' },
      onClose: function () { setSend(null); },
      onSent: function (n, cpId) { setSend(null); showToast('Đã gửi thông tin cho ' + n + ' khách', { label: 'Xem chiến dịch', onClick: function () { location.hash = 'chien-dich-' + cpId; } }); } }) : null);
}

// Khối "Cơ hội phù hợp" trong panel khách: CHỈ tin đã xác minh + khách vượt qua bộ lọc phù hợp; broker ghi phản hồi của khách
function customerOpportunities(c, rerender) {
  const list = SIGNALS.filter(function (sg) { return sg.status === 'Đã xác minh' && signalMatches(sg).fits.some(function (f) { return f.c.id === c.id; }); });
  const pendingN = SIGNALS.filter(function (sg) { return sg.status === 'Chờ kiểm chứng' && signalMatches(sg).fits.some(function (f) { return f.c.id === c.id; }); }).length;
  if (!list.length && !pendingN) return null;
  return React.createElement(PanelSection, { title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, 'Cơ hội phù hợp', React.createElement(AiMark)), meta: list.length + ' đã xác minh' },
    list.map(function (sg) {
      const fb = (SIGNAL_FEEDBACK[sg.id] || {})[c.id];
      const set = function (v) { return function () { SIGNAL_FEEDBACK[sg.id] = SIGNAL_FEEDBACK[sg.id] || {}; SIGNAL_FEEDBACK[sg.id][c.id] = v; audit('Ghi phản hồi của khách', sg.title + ' · ' + v, [c.id]); showToast('Đã ghi phản hồi: ' + v); rerender(); }; };
      return React.createElement('div', { key: sg.id, style: { display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 'var(--t-spacing-2)', borderBottom: '1px solid var(--t-border-color-light)' } },
        React.createElement('span', { style: { fontWeight: 500 } }, sg.title),
        React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Đã kiểm chứng ' + sg.review.at + ' · ' + sg.sources.filter(function (s) { return s.official; })[0].name),
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', flexWrap: 'wrap' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Phản hồi của khách:'),
          fb ? React.createElement(Tag, { text: fb, color: fb === 'Khách quan tâm' ? 'green' : 'gray', preventShrink: true }) : null,
          React.createElement(LightButton, { title: 'Quan tâm', accent: fb === 'Khách quan tâm' ? 'blue' : 'tertiary', onClick: set('Khách quan tâm') }),
          React.createElement(LightButton, { title: 'Không quan tâm', accent: fb === 'Không quan tâm' ? 'blue' : 'tertiary', onClick: set('Không quan tâm') })));
    }),
    pendingN ? React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, pendingN + ' tin AI liên quan khách này đang chờ kiểm chứng — chưa hiện.') : null);
}

/* =========================================================================
   KỊCH BẢN DEMO — mỗi case: khách mẫu · link mở thẳng · các bước bấm · kết quả cần thấy
   Dữ liệu là bản mẫu trong trình duyệt: tải lại trang (F5) là về dữ liệu gốc.
   ========================================================================= */
const SCENARIOS = [
  { g: 'B. Sổ khách', items: [
    { t: 'Cảnh báo nhóm — gọi riêng từng khách', who: '11 khách ký quỹ', link: 'canh-bao=ky-quy', steps: 'Ở Sổ khách bấm "Xem chi tiết" dòng "Rủi ro ký quỹ".', expect: 'Modal: Nguyên nhân + căn cứ QĐ 87, danh sách khách (có tick chọn) xếp theo hạn có "còn bao lâu", radio chọn 1 kênh Email / Chat Zalo / SMS / Thông báo app, nút "Gửi thông báo (N)". Gửi xong: toast, khách chưa đồng ý nhận tin qua kênh đã chọn bị bỏ qua.' },
    { t: 'Cảnh báo nhóm — gửi nhắc hàng loạt', who: 'Nhóm khảo sát quá hạn', link: 'canh-bao=khao-sat', steps: 'Bỏ tick 1 khách → "Gửi nhắc cho N khách".', expect: 'Mở form gửi với mẫu tin đã duyệt; số khách giảm theo khách đã bỏ tick.' },
    { t: 'Lọc / sắp xếp chuẩn Twenty', who: '—', link: 'so-khach', steps: 'Bấm Filter → Nhóm vấn đề → 3 · Hồ sơ. Bấm Sort → NAV.', expect: 'Chip "Nhóm vấn đề: 3 · Hồ sơ" và chip sắp xếp dưới thanh view; "Đặt lại" xoá hết.' },
    { t: 'Cột Khách cố định khi cuộn ngang', who: '—', link: 'so-khach.x=400', steps: 'Cuộn ngang bảng.', expect: 'Checkbox + cột Khách đứng yên, các cột khác trượt qua.' },
    { t: 'Bấm cột Vấn đề', who: 'Trần Văn Bình', link: 'so-khach', steps: 'Bấm "Đang bị call ký quỹ 32%" ở cột Vấn đề.', expect: 'Mở trang chi tiết Trần Văn Bình, tab Vấn đề.' },
    { t: 'Gửi hàng loạt — khoá khách ký quỹ, tin xưng hô đúng', who: 'Đinh Đức Tài', link: 'bulk', steps: 'Xem danh sách xem trước, đổi kênh Zalo ↔ SMS, đổi mẫu.', expect: 'Không chọn sẵn khách Khẩn. Đinh Đức Tài (có vay, thiếu số) bị khoá "Có chuyện ký quỹ — gọi riêng". Tin xưng "Chị Hà ơi…", không họ tên đầy đủ, không số tài khoản / tỷ lệ; mỗi khách có dòng "Gọi lại: …" trước hạn. Mẫu không khớp chuyện của khách → khách bị loại. Mẫu "(chờ duyệt)" → nút gửi khoá.' },
  ] },
  { g: 'C. Tìm kiếm & xác minh người gọi', items: [
    { t: 'Người được uỷ quyền gọi đến', who: 'Trần Văn Bình', link: 'tim=0912345678', steps: 'Gõ đủ 10 số điện thoại.', expect: 'Ra Trần Văn Bình, dòng "Người được uỷ quyền: Nguyễn Thị Hồng (Vợ) · Chỉ được đặt lệnh"; luôn có cảnh báo "Chưa xác minh người gọi".' },
    { t: 'Số lạ gọi đến', who: '—', link: 'tim=0911111678', steps: 'Gõ số không có trong sổ.', expect: 'Cảnh báo "Số lạ" với số đã che 091••••678, không ra khách nào.' },
    { t: 'Tìm tên không dấu', who: '—', link: 'tim=tran%20van', steps: 'Gõ "tran van".', expect: 'Ra các khách "Trần Văn…", khách gấp nhất lên đầu.' },
  ] },
  { g: 'D. Trang khách — các tình huống', items: [
    { t: 'Dự báo AI → tab Cần chú ý → giải pháp', who: 'Trịnh Văn Sơn', link: 'khach-c003.attention', steps: 'Mở tab Cần chú ý → mỗi mã có mục Giải pháp → "Xem giải pháp" → chọn A/B/C/Khác → Chốt. Mở thẳng panel: #khach-c003.attention.aisol-0.', expect: 'Panel Giải pháp cùng mẫu tab Vấn đề: câu nên hỏi, A đặt cắt lỗ · B bán bớt (có đặt lệnh) · C giữ nguyên · D Khác. Chốt A/C → lưu luôn + việc theo dõi; B → Xác nhận đặt lệnh.' },
    { t: 'Chốt phương án + thêm uỷ quyền → khách về Ổn', who: 'Trịnh Văn Sơn', link: 'khach-c003.issues.sol.pick-0', steps: 'Phương án A đã chọn → "Thêm uỷ quyền" nhập UQ-2026-0003 → Lưu uỷ quyền → Chốt phương án.', expect: 'Lưu uỷ quyền: cảnh báo vàng "Chưa uỷ quyền" biến mất, cột trái hiện "Có · đến …". Chốt: panel đóng ngay (không mở form), toast "Đã chốt … · nhắc theo dõi …", khách tự về "Ổn" ở trang khách và Sổ khách; Nhật ký tuân thủ có "Cập nhật uỷ quyền broker" và "Đổi trạng thái khách".' },
    { t: 'Sắp bị bán giải chấp hôm nay', who: 'Trịnh Văn Sơn', link: 'khach-c003', steps: 'Mở khách.', expect: 'Cảnh báo đỏ "Đang bị chặn", vàng "Chưa uỷ quyền cho broker"; thẻ Việc cần làm ngay "hạn hôm nay 14:30" (không lặp ở cảnh báo).' },
    { t: 'Bị call — chọn phương án A/B/C', who: 'Trần Văn Bình', link: 'khach-c001.issues.sol', steps: 'Chọn A "Nộp thêm tiền: tối thiểu …" → Chốt phương án.', expect: 'Phương án A ghi các mốc: Hết call (35%) · Về an toàn (45%); khách dưới 30% có thêm "Khỏi bị bán". Chọn A (nộp tiền) → Chốt: chốt luôn, tạo việc "Theo dõi: …" trước hạn. Chọn B/C (bán, có đặt lệnh) → Chốt mở "Xác nhận đặt lệnh" (uỷ quyền, OTP, ghi âm, cảnh báo rủi ro).' },
    { t: 'Không có phương án — phải ghi kết quả', who: 'Đỗ Văn Khoa', link: 'khach-c006.issues.sol', steps: 'Để trống ô "Kết quả trao đổi", rồi nhập nội dung.', expect: 'Không có dòng "Bị chặn". Ô trống → Chốt bị khoá; nhập xong → Chốt lưu luôn đúng nội dung vừa ghi + việc theo dõi.' },
    { t: 'Sắp bị call do hạ tỷ lệ cho vay', who: 'Lê Thu Hà', link: 'khach-c002.portfolio', steps: 'Mở tab Danh mục.', expect: 'VHM có tag "Tỷ lệ cho vay 50% → 40% từ 07/11"; cột trái tỷ lệ "38% → 33% từ 07/11".' },
    { t: 'Bằng chứng nhảy tới dòng số liệu', who: 'Lê Thu Hà', link: 'khach-c002.issues.jump-0', steps: 'Bấm chip bằng chứng có mũi tên ở tab Vấn đề.', expect: 'Chuyển tab/cuộn tới đúng dòng, nháy vàng 1,6 giây; tại đó có chip "Liên quan: …" để quay lại.' },
    { t: 'Danh mục: lệnh chờ khớp, rút tiền lớn, cổ tức', who: 'Đỗ Văn Khoa', link: 'khach-c006.portfolio', steps: 'Mở tab Danh mục.', expect: 'Dòng rút 900 tr tô cam "(15% tài sản)", "Mua PNJ · Chờ khớp", "FPT 15/11 chốt quyền cổ tức".' },
    { t: 'Cuộc gọi đến chưa ghi', who: 'Đỗ Văn Khoa', link: 'khach-c006.issues.un-u1', steps: 'Điền kết quả → Lưu.', expect: 'Form đã điền kênh "Khách gọi đến", thời gian 03/11 16:40. Lưu xong: cảnh báo "chưa ghi" biến mất, vấn đề "Vừa rút một khoản lớn" được gỡ (đã hỏi khách), Sổ khách ghi "Đã liên hệ hôm nay".' },
    { t: 'Hẹn đã trễ', who: 'Bùi Đức Long', link: 'khach-c007.issues.task-k1', steps: 'Chọn kết quả → Lưu.', expect: 'Form "Ghi nhận việc" điền sẵn "Gọi lại tư vấn trái phiếu"; lưu xong khách đổi mức (toast báo trạng thái mới).' },
    { t: 'Thiếu số liệu ký quỹ', who: 'Đặng Thu Trang', link: 'khach-c011', steps: 'Mở khách.', expect: 'Mức "Chưa đủ dữ liệu", tỷ lệ "Chưa có số liệu", cảnh báo xanh "đừng báo tỷ lệ cho khách khi chưa có số mới".' },
    { t: 'Khách ổn', who: 'Lý Hoàng Nam', link: 'khach-c013', steps: 'Mở khách.', expect: 'Không có cảnh báo; mở sẵn tab Danh mục; thẻ "Không có việc cần xử lý".' },
  ] },
  { g: 'E. Đặt lệnh thay khách — tuân thủ', items: [
    { t: 'Đủ điều kiện — đi hết các bước', who: 'Trần Văn Bình', link: 'khach-c001.issues.evt.order', steps: 'Nhập mã uỷ quyền UQ-2026-0001 → Kiểm tra → Gửi mã xác minh → nhập mã 6 số hiện ở thông báo cuối màn hình → Xác minh → nhập mã cuộc ghi âm GA-20261104-0930 → tick "đồng ý ghi âm" và "đã cảnh báo rủi ro" → chọn Kết quả → Lưu.', expect: 'Mỗi bước có tag xác nhận; thiếu bước nào thì Lưu báo lỗi đúng bước đó. Nhật ký có Kiểm tra uỷ quyền, Gửi mã, Xác minh thành công, Ghi sự kiện.' },
    { t: 'Uỷ quyền cho broker đã hết hạn', who: 'Lê Thu Hà', link: 'khach-c002.issues.evt.order', steps: 'Nhập mã UQ-2025-0002 → Kiểm tra, rồi bấm Lưu.', expect: 'Kiểm tra báo "Uỷ quyền đã hết hạn"; cột trái hiện "Hết hạn 31/10/2026"; Lưu bị chặn "không được đặt lệnh thay khách".' },
    { t: 'Khách chưa uỷ quyền cho broker', who: 'Trịnh Văn Sơn', link: 'khach-c003.issues.evt.order', steps: 'Bấm Lưu.', expect: 'Thông báo "Khách chưa uỷ quyền cho broker" + hướng dẫn khách tự đặt trên ứng dụng hoặc ký giấy uỷ quyền.' },
    { t: 'Người được uỷ quyền không được đặt lệnh', who: 'Phạm Quốc Dũng', link: 'khach-c004.issues.evt.order', steps: 'Nhập mã UQ-2026-0004 → Kiểm tra → ở bước 2 "Người xác nhận" chọn Phạm Thu Hằng (Con gái).', expect: 'Cảnh báo "Người này không được đặt lệnh" kèm "Được: nghe số dư · Không được: đặt lệnh · đến 30/06/2027"; không gửi được mã, Lưu bị chặn.' },
    { t: 'Nhập sai mã xác minh 3 lần', who: 'Trần Văn Bình', link: 'khach-c001.issues.evt.order', steps: 'Gửi mã xác minh → nhập sai 3 lần.', expect: 'Lần 1–2 báo "còn N lần"; lần 3 khoá mã, phải gửi mã mới. Nhật ký ghi "Xác minh uỷ quyền thất bại".' },
  ] },
  { g: 'F. Cơ hội từ tin AI — kiểm chứng', items: [
    { t: 'Kiểm chứng tin có nguồn chính thống', who: 'Tin FPT', link: 'co-hoi.s=ai1', steps: 'Tick 4 bước → chọn "Chính xác" → Xác nhận đã kiểm chứng.', expect: 'Trạng thái đổi sang "Đã xác minh"; nút "Gửi thông tin cho N khách" bật.' },
    { t: 'Tin đồn — không xác minh được', who: 'Tin VCB', link: 'co-hoi.s=ai2', steps: 'Tick đủ 4 bước → chọn "Chính xác" → Xác nhận.', expect: 'Bị chặn: "Không có nguồn chính thống — chưa thể xác minh". Chỉ có thể Bác bỏ (bắt buộc ghi lý do).' },
    { t: 'Tin đã xác minh → gửi khách', who: 'Tin NHNN', link: 'co-hoi.s=ai3', steps: 'Bấm "Gửi thông tin cho N khách".', expect: 'Form gửi dùng mẫu "Thông tin đã kiểm chứng: …", chỉ là thông tin, không khuyến nghị mua/bán.' },
    { t: 'Khách thấy cơ hội & phản hồi', who: 'Vũ Thị Lan Anh', link: 'so-khach.p=c009', steps: 'Trong panel, khối "Cơ hội phù hợp ✦ AI" bấm "Quan tâm".', expect: 'Chỉ hiện tin đã xác minh; ghi "2 tin đang chờ kiểm chứng — chưa hiện". Phản hồi hiện thành tag và vào cột "Phản hồi của khách" ở màn Cơ hội.' },
  ] },
  { g: 'H. Sửa theo UAT 06/11', items: [
    { t: 'Phương án bán là lệnh → khoá ô nhận lệnh', who: 'Trịnh Văn Sơn', link: 'khach-c003.issues.sol', steps: 'Chọn B "Bán 11.000 SSI" → Chốt → Lưu ngay (bị chặn). Tick "Khách tự đặt lệnh trên ứng dụng" → nhập mã ghi âm GA-20261104-0930 → tick cảnh báo rủi ro → chọn Kết quả → Lưu. Lần khác bấm Đóng rồi xem Nhật ký.', expect: 'Ô "Nhận lệnh / đặt lệnh thay khách" khoá bật; khách chưa uỷ quyền nên broker không đặt thay được, chỉ lưu được khi khách tự đặt + đủ ghi âm và cảnh báo rủi ro. Nhật ký có "Chốt phương án … mã ghi âm …"; bấm Đóng thì KHÔNG có dòng này.' },
    { t: 'Khuyến nghị mua khi đang bị chặn', who: 'Phạm Văn Dũng', link: 'khach-g089.issues.call', steps: 'Xem 2 ô tick trong form.', expect: 'Ô "Có khuyến nghị mua" bị khoá, ghi "Đang chặn: tư vấn mua" và nút "Gửi link làm lại phiếu" (ghi nhật ký).' },
    { t: 'Dời lịch', who: 'Bùi Đức Long', link: 'khach-c007.issues.task-k1', steps: 'Chọn "Dời lịch" → 05/11 10:00 → Lưu.', expect: 'Hẹn cũ đóng, hết "Lỡ hẹn"; khối "Liên hệ & lời hứa" có "Lịch hẹn … (đã dời 1 lần) · hạn 10:00 05/11".' },
    { t: 'Huỷ hẹn phải có lý do', who: 'Bùi Đức Long', link: 'khach-c007.issues.task-k1', steps: 'Chọn "Hủy hẹn" → Lưu khi chưa chọn lý do, rồi chọn lý do → Lưu.', expect: 'Chưa có lý do thì báo lỗi. Lưu xong tạo việc "Báo khách đã huỷ hẹn" hạn 17:00 hôm nay.' },
    { t: 'Gọi hụt để lại dấu', who: 'Hoàng Minh Tuấn', link: 'khach-c008.issues.call', steps: 'Kết quả "Không liên lạc được" → Lưu → về Sổ khách.', expect: 'Cột Xử lý "Gọi hụt hh:mm · gọi lại"; cột Liên hệ gần nhất thêm "· gọi hụt hôm nay".' },
    { t: 'Lịch sử & lời hứa trên trang khách', who: 'Trịnh Văn Sơn', link: 'khach-c003', steps: 'Xem khối "Liên hệ & lời hứa" ở cột trái.', expect: '"Khách hứa: Nộp tiền bù ký quỹ · hạn 04/11" và các lần liên hệ gần nhất kèm nội dung. Chip "Cam kết" / "Lịch hẹn" ở tab Vấn đề bấm nhảy tới đúng dòng.' },
    { t: 'Nhịp liên hệ khách chọn', who: 'Hoàng Minh Tuấn', link: 'khach-c008', steps: 'Ở "Nhịp liên hệ" chọn "Khách chọn: 3 tháng/lần".', expect: 'Vấn đề "… ngày chưa liên hệ" biến mất; nhật ký ghi "Cập nhật nhịp liên hệ".' },
    { t: 'Thiếu số ký quỹ không bị che', who: 'Đinh Đức Tài', link: 'loc-lv=3', steps: 'Lọc Mức = Chưa đủ dữ liệu.', expect: 'Đinh Đức Tài có mặt (dù đang có chuyện liên hệ), dòng có tag "Thiếu số ký quỹ". Khách không vay không còn nhãn này.' },
    { t: 'Khách mới chuyển về', who: 'Ngô Gia Huy', link: 'khach-c012', steps: 'Mở khách.', expect: 'Vấn đề "Gọi làm quen khách mới chuyển về", mức Cần chú ý, hạn 06/11 — không còn "Chưa đủ dữ liệu".' },
    { t: 'Ngày sập — nhiều khách bị call cùng mã', who: '10 khách giữ VND', link: 'so-khach', steps: 'Xem đầu Sổ khách và cột "Nộp tối thiểu".', expect: 'Khẩn chỉ khi còn ≤ 1 ngày; khách cùng mức xếp theo hạn → số tiền cần nộp → hạng. Rê chuột vào số tiền thấy 3 mốc.' },
    { t: 'Trùng số người được uỷ quyền', who: 'Lê Thu Hà / Ngô Gia Huy', link: 'khach-c002', steps: 'Xem dòng "Người uỷ quyền" ở cột trái.', expect: 'Ghi rõ quyền + ngày hết hạn và "⚠ số này còn ở 1 tài khoản khác".' },
    { t: 'Tên ghép', who: 'Vũ Thị Lan Anh', link: 'khach-c009.issues', steps: 'Đọc câu mở đầu.', expect: 'Gọi "Chị Lan Anh", không phải "Chị Anh".' },
  ] },
  { g: 'G. Theo dõi & nhật ký', items: [
    { t: 'Theo dõi chiến dịch', who: '8 khách', link: 'chien-dich-cp1', steps: 'Mở chiến dịch đã gửi 28/10.', expect: 'KPI Đã gửi / Đã phản hồi / Đã gọi lại / Đã xử lý; bảng khách với mức lúc gửi và mức hiện tại.' },
    { t: 'Nhật ký tuân thủ', who: '—', link: 'nhat-ky', steps: 'Làm vài case ở trên rồi mở Nhật ký, lọc theo Hành động.', expect: 'Mỗi thao tác (xem số điện thoại, gửi mã, xác minh, kiểm chứng tin AI, gửi hàng loạt, ghi sự kiện) có 1 dòng, mới nhất ở trên.' },
  ] },
];

function DemoScreen() {
  let n = 0;
  const total = SCENARIOS.reduce(function (a, g) { return a + g.items.length; }, 0);
  return React.createElement(Page, { title: 'Kịch bản demo', icon: dashTile('player-play', 'green'),
    actions: React.createElement(Button, { title: 'Về dữ liệu gốc (tải lại)', variant: 'secondary', size: 'small', Icon: 'refresh', onClick: function () { location.hash = ''; location.reload(); } }) },
    React.createElement(StatusBanners, { style: { borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 }, items: [
      { tone: 'info', text: total + ' case · dữ liệu giả, hôm nay coi là Thứ Tư 04/11/2026 08:00. Thao tác lưu trong trình duyệt — tải lại trang là về dữ liệu gốc. Mã xác minh (OTP) hiện ở thông báo cuối màn hình.' }] }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--t-background-secondary)' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } },
        SCENARIOS.map(function (grp) {
          return React.createElement(DashCard, { key: grp.g, title: grp.g, count: grp.items.length },
            grp.items.map(function (it) {
              n++;
              return React.createElement('div', { key: n, style: { display: 'grid', gridTemplateColumns: '28px minmax(180px, 1.1fr) minmax(200px, 1.4fr) minmax(220px, 1.6fr) 96px', gap: 'var(--t-spacing-3)', alignItems: 'start', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', fontSize: 'var(--t-font-size-md)', lineHeight: 1.45 } },
                React.createElement('span', { style: Object.assign({ color: 'var(--t-font-color-light)', paddingTop: 2 }, num) }, n),
                React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
                  React.createElement('span', { style: { fontWeight: 500 } }, it.t),
                  React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, it.who + (it.link ? ' · #' + it.link : ''))),
                React.createElement('span', { style: { color: 'var(--t-font-color-secondary)' } }, React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', display: 'block' } }, 'Thao tác'), it.steps),
                React.createElement('span', null, React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', display: 'block' } }, 'Kết quả cần thấy'), it.expect),
                React.createElement('span', { style: { display: 'flex', justifyContent: 'flex-end' } },
                  React.createElement(Button, { title: 'Mở', variant: 'secondary', size: 'small', Icon: 'arrow-up-right', onClick: function () { location.hash = it.link; } })));
            }));
        }))));
}

function PlaceholderScreen(props) {
  return React.createElement(PagePanel, null,
    React.createElement(PageHeader, { title: props.title, Icon: props.icon }),
    React.createElement('div', { style: { padding: 'var(--t-spacing-8)' } },
      React.createElement(EmptyState, { Icon: props.icon, title: 'Ngoài phạm vi bản mẫu', subtitle: 'Bản mẫu này tập trung vào Sổ khách, Chiến dịch và Nhật ký tuân thủ.', actionLabel: 'Về Sổ khách', onAction: function () { location.hash = 'so-khach'; } })));
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

function useNarrow() {
  const q = function () { return window.innerWidth < 760; };
  const [n, setN] = React.useState(q());
  React.useEffect(function () { const h = function () { setN(q()); }; window.addEventListener('resize', h); return function () { window.removeEventListener('resize', h); }; }, []);
  return n;
}
function App() {
  const parseHash = function () {
    const h = location.hash.slice(1);
    // '#tim=<query>' / '#tim-evt=<query>': danh sách + ô tìm đã điền sẵn, dropdown mở (deep link để test)
    const tm = /^tim(-evt)?=(.*)$/.exec(h);
    if (tm) { let qq = tm[2]; try { qq = decodeURIComponent(qq); } catch (er) { /* giữ nguyên */ } return { id: null, search: { q: qq, pick: !!tm[1] } }; }
    // Bàn làm việc đã bỏ: link trống / '#ban-lam-viec' cũ → Sổ khách (giữ '.p=<id>' nếu có)
    if (h === '' || h.indexOf('ban-lam-viec') === 0) {
      const nh = 'so-khach' + h.slice('ban-lam-viec'.length);
      try { history.replaceState(null, '', '#' + (h === '' ? 'so-khach' : nh)); } catch (er) { /* frame chặn thì bỏ qua */ }
      return { id: null, screen: 'list' };
    }
    if (h === 'hom-nay') return { id: null, screen: 'today' };
    if (h === 'chien-dich') return { id: null, screen: 'campaigns' };
    if (h.indexOf('chien-dich-') === 0) return { id: null, screen: 'campaign', cp: h.slice(11) };
    if (h === 'nhat-ky') return { id: null, screen: 'audit' };
    if (h === 'kich-ban') { try { history.replaceState(null, '', '#so-khach'); } catch (er) { /* bỏ qua */ } return { id: null, screen: 'list' }; }   // Kịch bản demo đã bỏ
    if (h.indexOf('co-hoi') === 0) return { id: null, screen: 'co-hoi' };   // '#co-hoi.s=<id>' mở sẵn panel kiểm chứng
    if (h === 'phan-khuc' || h === 'hop-thoai') return { id: null, screen: h };
    if (h.indexOf('khach-') !== 0) return { id: null, screen: 'list' };
    // '#khach-<id>[.issues|.portfolio|.history][.sol][.evt][.order][.task-<id>][.un-<id>][.jump-<n>]'
    const rest = h.slice(6).split('.');
    const pick = function (pre) { const x = rest.filter(function (p) { return p.indexOf(pre) === 0; })[0]; return x ? x.slice(pre.length) : null; };
    return { id: rest[0], screen: 'detail', tab: rest[1] || null, sol: rest.indexOf('sol') >= 0, evt: rest.indexOf('evt') >= 0, order: rest.indexOf('order') >= 0, call: rest.indexOf('call') >= 0,
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
  const back = function () { location.hash = 'so-khach'; };
  const customer = route.id ? DB.filter(function (c) { return c.id === route.id; })[0] : null;
  const setToast = function (m) { showToast(m); };
  const toastEl = React.createElement(ToastHost);
  const _oldToast = null ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 110, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  const sc = customer ? 'detail' : (route.screen || 'list');
  const PH = { 'co-hoi': ['Cơ hội', 'target-arrow'], 'phan-khuc': ['Phân khúc', 'chart-pie'], 'hop-thoai': ['Hộp thoại', 'messages'] };
  const body = customer
    ? React.createElement(DetailScreen, { key: location.hash, customer: customer, initialTab: route.tab, initialSol: route.sol, initialEvt: route.evt, initialOrder: route.order, initialCall: route.call, initialTask: route.task, initialUn: route.un, initialJump: route.jump, onBack: back })
    : sc === 'home' ? React.createElement(MorningScreen)
    : sc === 'today' ? React.createElement(TodayScreen)
    : sc === 'campaigns' ? React.createElement(CampaignsScreen, { onToast: setToast })
    : sc === 'campaign' ? React.createElement(CampaignDetailScreen, { id: route.cp })
    : sc === 'audit' ? React.createElement(AuditScreen)
    : sc === 'co-hoi' ? React.createElement(OpportunitiesScreen)
    : sc === 'demo' ? React.createElement(DemoScreen)
    : PH[sc] ? React.createElement(PlaceholderScreen, { title: PH[sc][0], icon: PH[sc][1] })
    : React.createElement(ListScreen, { onOpen: open, onToast: setToast, initialBulk: location.hash === '#bulk', initialSearch: route.search || null });

  const narrow = useNarrow();
  const [navOpen, setNavOpen] = React.useState(false);
  React.useEffect(function () { setNavOpen(false); }, [location.hash]);
  return React.createElement(AppLayout, { drawer: narrow ? null : React.createElement(Drawer, { screen: sc }) },
    React.createElement(PageBody, null, React.createElement(ErrorBoundary, { key: sc }, body)),
    narrow ? React.createElement('div', { style: { position: 'fixed', left: 12, bottom: 12, zIndex: 80 } },
      React.createElement(IconButton, { Icon: navOpen ? 'x' : 'menu-2', variant: 'secondary', size: 'medium', ariaLabel: 'Menu', onClick: function () { setNavOpen(!navOpen); } })) : null,
    narrow && navOpen ? React.createElement('div', { onClick: function () { setNavOpen(false); }, style: { position: 'fixed', inset: 0, zIndex: 70, background: 'var(--t-background-overlay-secondary, rgba(0,0,0,0.3))' } },
      React.createElement('div', { onClick: function (ev) { ev.stopPropagation(); }, style: { height: '100%', width: 'fit-content', maxWidth: '85vw', overflowY: 'auto' } }, React.createElement(Drawer, { screen: sc }))) : null,
    toastEl,
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
