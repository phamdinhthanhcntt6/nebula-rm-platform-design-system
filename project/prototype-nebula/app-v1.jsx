/* Sổ khách — dựng lại bằng component thật của Nebula RM Platform Design System.
   Lớp nghiệp vụ (window.SK từ data.js) giữ nguyên; chỉ lớp render được viết lại bằng DS components. */
const DS = window.NebulaRMPlatformDesignSystem_5dfab2;
const {
  AppLayout, PageBody, PagePanel, PageHeader, ViewBar,
  NavigationDrawer, NavigationDrawerHeader, NavigationDrawerSection, NavigationDrawerSectionTitle, NavigationDrawerItem,
  RecordTable, Tabs, Button, IconButton, Chip, Tag, Pill, Avatar, Radio, RadioGroup, Checkbox, Select, TextInput,
  KpiTile, KVRow, BlockCard, Card, CardContent, EmptyState, InlineNotice, Icon,
  SidePanel, PanelFootRow,
} = DS;

const S = window.SK, U = S.util, TODAY = S.TODAY, TH = S.TH, LEVELS = S.LEVELS, CATS = S.CATS;
const DB = S.build();
const EV = {}, BY = {};
DB.forEach(function (c) { EV[c.id] = S.evaluate(c); BY[c.id] = c; });
function reval(c) { EV[c.id] = S.evaluate(c); }
function nowHM() { const t = new Date(); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); }

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
function Drawer() {
  return React.createElement(NavigationDrawer, { header: React.createElement(NavigationDrawerHeader, { workspaceName: 'Simplize', notifications: 3 }) },
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerItem, { label: 'Tìm kiếm', Icon: 'search', variant: 'tertiary' }),
      React.createElement(NavigationDrawerItem, { label: 'Hôm nay cần làm', Icon: 'inbox', count: 7 }),
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Quản lý khách' }),
      React.createElement(NavigationDrawerItem, { label: 'Sổ khách', Icon: 'address-book', iconTile: 'var(--t-object-tile-blue)', iconTileBorder: 'var(--t-object-tile-border-blue)', iconColor: 'var(--t-tag-text-blue)', active: true }),
      React.createElement(NavigationDrawerItem, { label: 'Cơ hội', Icon: 'target-arrow', iconTile: 'var(--t-object-tile-purple)', iconTileBorder: 'var(--t-object-tile-border-purple)', iconColor: 'var(--t-tag-text-purple)' }),
      React.createElement(NavigationDrawerItem, { label: 'Phân khúc', Icon: 'chart-pie', iconTile: 'var(--t-object-tile-pink)', iconTileBorder: 'var(--t-object-tile-border-pink)', iconColor: 'var(--t-tag-text-pink)' }),
    ),
    React.createElement(NavigationDrawerSection, null,
      React.createElement(NavigationDrawerSectionTitle, { label: 'Vận hành' }),
      React.createElement(NavigationDrawerItem, { label: 'Việc & nhắc hẹn', Icon: 'checklist', iconTile: 'var(--t-object-tile-green)', iconTileBorder: 'var(--t-object-tile-border-green)', iconColor: 'var(--t-tag-text-green)' }),
      React.createElement(NavigationDrawerItem, { label: 'Hộp thoại', Icon: 'messages', iconTile: 'var(--t-object-tile-turquoise)', iconTileBorder: 'var(--t-object-tile-border-turquoise)', iconColor: 'var(--t-tag-text-turquoise)' }),
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
  const [tpl, setTpl] = React.useState('{ten} ơi, {viec} (hạn {han}). Em là Lan bên Simplize, gọi để mình cùng xử lý sớm nhé.');
  const [excluded, setExcluded] = React.useState({});
  const included = all.filter(function (c) { return !excluded[c.id]; });

  // Nhóm theo mức để biết độ gấp
  const byLevel = {};
  all.forEach(function (c) { const s = EV[c.id].status; byLevel[s] = (byLevel[s] || 0) + 1; });
  const groupLabel = Object.keys(byLevel).sort().map(function (s) { return byLevel[s] + ' ' + LEVELS[s]; }).join(' · ');

  function send() {
    const dueAt = U.addDays(TODAY, 1) + 'T09:00';
    included.forEach(function (c) {
      const top = EV[c.id].top;
      c.events.push({ id: 'b' + Date.now() + c.id, at: TODAY + 'T' + nowHM(), channel: channel, broker: 'Chị Lan', purpose: 'Gửi thông tin đã hứa', result: 'Hoàn thành', note: 'Gửi gợi ý (hàng loạt): ' + fillTpl(tpl, c), issueTitle: top ? top.title : '' });
      c.tasks.push({ id: 'bt' + Date.now() + c.id, title: 'Gọi lại sau gợi ý' + (top ? ': ' + top.short : ''), due: dueAt, channel: 'Gọi đi', done: false });
      reval(c);
    });
    props.onSent(included.length);
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
        React.createElement(TextInput, { label: 'Mẫu tin (dùng {ten}, {viec}, {han}, {tyle} — hệ thống điền riêng từng khách)', multiline: true, rows: 2, fullWidth: true, value: tpl, onChange: setTpl }),
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
              const inc = !excluded[c.id];
              return React.createElement('tr', { key: c.id, style: { opacity: inc ? 1 : 0.4 } },
                React.createElement('td', { style: td }, React.createElement(Checkbox, { checked: inc, onChange: function () { setExcluded(function (x) { const n = Object.assign({}, x); if (inc) n[c.id] = true; else delete n[c.id]; return n; }); }, ariaLabel: 'Gửi' })),
                React.createElement('td', { style: td }, React.createElement('div', { style: { fontWeight: 500 } }, c.name), React.createElement('div', { style: Object.assign({ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }, mono) }, c.acc)),
                React.createElement('td', { style: td }, fillTpl(tpl, c)),
                React.createElement('td', { style: td }, levelTag(EV[c.id].status)));
            }))),
        ),
      ),
      // Footer
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-4)', borderTop: '1px solid var(--t-border-color-light)', flexShrink: 0 } },
        React.createElement('span', { style: { flex: 1, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Gửi ' + channel + ' cho ' + included.length + ' khách và tạo ' + included.length + ' việc “gọi lại” vào ngày mai.'),
        React.createElement(Button, { title: 'Đóng', variant: 'secondary', size: 'small', onClick: props.onClose }),
        React.createElement(Button, { title: 'Gửi nhắc cho ' + included.length + ' khách', accent: 'blue', size: 'small', Icon: 'send', disabled: included.length === 0, onClick: send }),
      ),
    ),
  );
}

/* =========================================================================
   MÀN 1 — DANH SÁCH (Sổ khách)
   ========================================================================= */
function ListScreen(props) {
  const [levelFilter, setLevelFilter] = React.useState(null);  // index 0..4 hoặc null
  const [tierFilter, setTierFilter] = React.useState(null);
  const [catFilter, setCatFilter] = React.useState(null);      // 1..5 Nhóm vấn đề
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

  const columns = [
    { id: 'name',    label: 'Khách',          type: 'text',     width: 210 },
    { id: 'acc',     label: 'Số tài khoản',   type: 'text',     width: 140 },
    { id: 'tier',    label: 'Hạng',           type: 'select',   width: 110 },
    { id: 'nav',     label: 'NAV',            type: 'currency', width: 120 },
    { id: 'ratio',   label: 'Tỷ lệ ký quỹ',   type: 'number',   width: 120 },
    { id: 'contact', label: 'Liên hệ gần nhất', type: 'date',   width: 160 },
    { id: 'status',  label: 'Trạng thái',     type: 'select',   width: 150 },
    { id: 'reason',  label: 'Nguyên nhân',    type: 'text',     width: 300 },
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
        const txt = e.top ? e.top.short
          : e.noData.length ? 'Thiếu số liệu: ' + e.noData[0].reason
          : 'Không có việc cần xử lý';
        return React.createElement('span', { style: { color: e.top ? 'var(--t-font-color-primary)' : 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }, title: txt }, txt);
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
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Nhóm vấn đề:'),
      [1, 2, 3, 4, 5].map(function (k) {
        return React.createElement(Tag, { key: k, text: k + '. ' + CATS[k].short, color: catFilter === k ? 'blue' : 'gray', onClick: function () { setCatFilter(catFilter === k ? null : k); setSelectedIds([]); }, style: { cursor: 'pointer', opacity: catFilter && catFilter !== k ? 0.5 : 1 } });
      }),
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Hạng:'),
      ['VIP', 'Thân thiết', 'Phổ thông'].map(function (t) {
        return React.createElement(Tag, { key: t, text: t, color: tierFilter === t ? TIER_COLOR[t] : 'gray', onClick: function () { setTierFilter(tierFilter === t ? null : t); }, style: { cursor: 'pointer', opacity: tierFilter && tierFilter !== t ? 0.5 : 1 } });
      }),
      React.createElement('span', { style: { flex: 1 } }),
      React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Sắp xếp:'),
      [['status', 'Trạng thái'], ['nav', 'NAV'], ['ratio', 'Tỷ lệ ký quỹ']].map(function (s) {
        return React.createElement(Button, { key: s[0], title: s[1], variant: 'secondary', size: 'small', accent: sortKey === s[0] ? 'blue' : 'default', onClick: function () { setSortKey(s[0]); } });
      }),
      (levelFilter != null || tierFilter != null || catFilter != null) ? React.createElement(Button, { title: 'Xoá lọc', variant: 'secondary', size: 'small', Icon: 'x', onClick: function () { setLevelFilter(null); setTierFilter(null); setCatFilter(null); } }) : null,
    ),
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
        React.createElement(Button, { title: 'Tạo sự kiện', accent: 'blue', Icon: 'plus', size: 'small' }),
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
      onSent: function (n) { setCampaign(false); setSelectedIds([]); props.onToast('Đã gửi gợi ý cho ' + n + ' khách và tạo ' + n + ' việc “gọi lại”. Phần đặt lệnh vẫn chốt riêng từng khách.'); },
    }) : null,
  );
}

/* =========================================================================
   MÀN 2 — CHI TIẾT KHÁCH (Customer 360)
   ========================================================================= */
function miniTable(head, rows) {
  const th = { textAlign: 'left', fontWeight: 500, color: 'var(--t-font-color-tertiary)', fontSize: 'var(--t-font-size-sm)', padding: '4px 8px', borderBottom: '1px solid var(--t-border-color-light)', whiteSpace: 'nowrap' };
  const td = { padding: '6px 8px', borderBottom: '1px solid var(--t-border-color-light)', verticalAlign: 'top' };
  return React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-font-size-md)' } },
      React.createElement('thead', null, React.createElement('tr', null, head.map(function (h, i) {
        return React.createElement('th', { key: i, style: Object.assign({}, th, h.r ? { textAlign: 'right' } : {}) }, h.label);
      }))),
      React.createElement('tbody', null, rows.map(function (r, ri) {
        return React.createElement('tr', { key: ri }, r.map(function (cell, ci) {
          return React.createElement('td', { key: ci, style: Object.assign({}, td, head[ci] && head[ci].r ? Object.assign({ textAlign: 'right' }, num) : {}) }, cell);
        }));
      })),
    ),
  );
}

function OverviewTab(c, e) {
  const m = e.m;
  const sExp = c.survey ? U.addDays(c.survey, TH.surveyDays) : null, sd = sExp ? U.dayDiff(TODAY, sExp) : -1;
  const idd = U.dayDiff(TODAY, c.idExpiry);
  const warnTag = function (txt, bad) { return React.createElement(Tag, { text: txt, color: bad ? 'red' : 'yellow', size: 'sm', preventShrink: true, style: { marginLeft: 6 } }); };

  // Danh mục
  const tot = m.A || 1, secs = {};
  c.holdings.forEach(function (x) { const s = U.sectorOf(x.t); secs[s] = (secs[s] || 0) + U.val(x); });
  const holdingRows = c.holdings.slice().sort(function (a, b) { return U.val(b) - U.val(a); }).map(function (x) {
    const p = U.priceOf(x), pl = (p - x.cost) / x.cost * 100;
    return [
      React.createElement('b', null, x.t),
      U.sectorOf(x.t),
      U.fmt(x.qty),
      U.pct(U.val(x) / tot * 100, 0),
      U.fmt(x.cost),
      U.fmt(p),
      React.createElement('span', { style: { color: pl >= 0 ? 'var(--t-color-green)' : 'var(--t-color-red)' } }, (pl >= 0 ? '+' : '') + U.pct(pl)),
    ];
  });

  // Giao dịch 7 ngày
  const recent = c.txns.filter(function (t) { return t.status !== 'Chờ khớp' && U.dayDiff(t.date, TODAY) <= 7; });

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    (e.status <= 1 && e.top) ? React.createElement(InlineNotice, { tone: 'warn', title: LEVELS[e.status] + ': ' + e.top.title }, 'Mở tab Vấn đề để xem cách xử lý.') : null,

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--t-spacing-3)' } },
      React.createElement(BlockCard, { title: '1. Hồ sơ khách', meta: 'Hồ sơ mở tài khoản' },
        React.createElement(KVRow, { label: 'Số tài khoản', Icon: 'hash', value: React.createElement('span', { style: mono }, c.acc) }),
        React.createElement(KVRow, { label: 'Hạng · khách từ', Icon: 'star', value: c.tier + ' · ' + c.since }),
        React.createElement(KVRow, { label: 'Nghề nghiệp', Icon: 'briefcase', value: c.job || '—' }),
        React.createElement(KVRow, { label: 'Khẩu vị rủi ro', Icon: 'scale', value: c.appetite }),
        React.createElement(KVRow, { label: 'Mục tiêu', Icon: 'target', value: c.goal }),
        React.createElement(KVRow, { label: 'Chịu lỗ tối đa', Icon: 'trending-down', value: c.maxLoss + '% danh mục' }),
        React.createElement(KVRow, { label: 'Ngày khảo sát', Icon: 'clipboard-check', value: React.createElement('span', null, c.survey ? U.ddmmyyyy(c.survey) : 'Chưa làm', sd < 0 ? warnTag('Quá hạn', true) : sd <= TH.surveySoon ? warnTag('Sắp hạn') : null) }),
        React.createElement(KVRow, { label: 'CCCD hết hạn', Icon: 'id', value: React.createElement('span', null, U.ddmmyyyy(c.idExpiry), idd < 0 ? warnTag('Đã hết hạn', true) : idd <= TH.idSoon ? warnTag('Còn ' + idd + ' ngày') : null) }),
      ),
      React.createElement(BlockCard, { title: '2. Về khách này', meta: 'Broker nhập' },
        React.createElement(KVRow, { label: 'Nhãn giao tiếp', Icon: 'tags', multiline: true, value: c.labels.length ? React.createElement('span', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, c.labels.map(function (l, i) { return React.createElement(Tag, { key: i, text: l, color: 'gray', size: 'sm' }); })) : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có') }),
        React.createElement(KVRow, { label: 'Ưu tiên liên hệ', Icon: 'clock', value: c.pref || '—' }),
        React.createElement(KVRow, { label: 'Người uỷ quyền', Icon: 'users', multiline: true, value: c.authorized.length ? c.authorized.map(function (a) { return a.name + ' (' + a.rel + ') — ' + a.scope; }).join('; ') : 'Không có' }),
      ),
    ),

    React.createElement(BlockCard, { title: '3. Chỉ số tài khoản', meta: 'Phần mềm giao dịch · 08:00 ' + U.ddmm(TODAY) },
      React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
        React.createElement(KpiTile, { label: 'NAV', value: U.money(m.nav) }),
        React.createElement(KpiTile, { label: 'Tiền mặt', value: U.money(c.cash) }),
        React.createElement(KpiTile, { label: 'Sức mua', value: U.money(m.buying) }),
        React.createElement(KpiTile, { label: 'Đang nợ', value: c.margin ? U.money(m.debt) : '—' }),
        React.createElement(KpiTile, { label: 'Tỷ lệ ký quỹ', value: React.createElement('span', { style: { color: ratioColor(m.ratio) } }, !c.margin ? '—' : c.margin.dataMissing ? 'chưa có' : U.pct(m.ratio, 0)), sub: ratioSub(c, m) }),
      ),
    ),

    React.createElement(BlockCard, { title: '4. Danh mục', meta: 'Giá cuối phiên' },
      miniTable(
        [{ label: 'Mã' }, { label: 'Ngành' }, { label: 'SL', r: true }, { label: 'Tỷ trọng', r: true }, { label: 'Giá mua', r: true }, { label: 'Giá nay', r: true }, { label: 'Lãi/lỗ', r: true }],
        holdingRows,
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'var(--t-spacing-2)' } },
        Object.keys(secs).sort(function (a, b) { return secs[b] - secs[a]; }).map(function (s) {
          const p = secs[s] / tot * 100, over = p > TH.sector;
          return React.createElement('div', { key: s, style: { display: 'grid', gridTemplateColumns: '120px 1fr 48px', gap: 'var(--t-spacing-2)', alignItems: 'center', fontSize: 'var(--t-font-size-sm)', color: over ? 'var(--t-tag-text-yellow)' : 'var(--t-font-color-secondary)', fontWeight: over ? 500 : 400 } },
            React.createElement('span', null, s, over ? ' ⚠' : ''),
            React.createElement('span', { style: { height: 8, background: 'var(--t-background-quaternary)', borderRadius: 4, overflow: 'hidden' } }, React.createElement('span', { style: { display: 'block', height: '100%', width: p + '%', background: over ? 'var(--t-tag-text-yellow)' : 'var(--t-color-blue)', opacity: over ? 1 : 0.75 } })),
            React.createElement('span', { style: Object.assign({ textAlign: 'right' }, num) }, U.pct(p, 0)),
          );
        }),
      ),
    ),

    React.createElement(BlockCard, { title: '5. Giao dịch gần đây', meta: '7 ngày qua' },
      recent.length
        ? miniTable([{ label: 'Ngày' }, { label: 'Loại' }, { label: 'Giá trị', r: true }], recent.map(function (t) {
            return [U.ddmm(t.date), t.type + (t.t ? ' ' + t.t + ' · ' + U.fmt(t.qty) + '×' + U.fmt(t.price) : ''), U.money(t.amt)];
          }))
        : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Không có giao dịch trong 7 ngày.'),
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
    React.createElement(Button, { title: 'Chốt phương án', accent: 'blue', size: 'small', disabled: pick == null, onClick: function () { props.onConfirm(picks[pick]); } }),
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
      return React.createElement(BlockCard, {
        key: i.id, highlight: first,
        title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }, first ? React.createElement(Tag, { text: 'Xử lý trước', color: 'blue', size: 'sm', preventShrink: true }) : null, i.title),
        right: React.createElement('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center' } }, levelTag(i.level), i.due ? React.createElement(Tag, { text: 'Hạn: ' + dueText(i.due), color: 'gray', size: 'sm' }) : null, React.createElement(Tag, { text: CATS[i.cat].short, color: 'gray', size: 'sm' })),
      },
        blocks.length ? React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, blocks.map(function (b, bi) { return React.createElement(Tag, { key: bi, text: BLOCK[b.state][0] + b.what, color: BLOCK[b.state][1], size: 'sm' }); })) : null,
        first && i.opener ? React.createElement('div', { style: { padding: 'var(--t-spacing-2) var(--t-spacing-3)', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', borderRadius: 'var(--t-border-radius-sm)', fontStyle: 'italic' } }, '“' + i.opener + '”') : null,
        React.createElement(KVRow, { label: 'Vì sao', multiline: true, value: i.why }),
        React.createElement(KVRow, { label: 'Nếu không xử lý', multiline: true, value: i.then }),
        React.createElement(KVRow, { label: 'Cách gỡ', multiline: true, value: i.fix }),
        i.evidence && i.evidence.length ? React.createElement(KVRow, { label: 'Bằng chứng', multiline: true, value: React.createElement('span', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, i.evidence.map(function (v, vi) { return React.createElement(Tag, { key: vi, text: v.label, color: 'blue', size: 'sm' }); })) }) : null,
        React.createElement('div', { style: { marginTop: 'var(--t-spacing-1)' } }, React.createElement(Button, { title: 'Xem giải pháp', accent: first ? 'blue' : 'default', variant: first ? 'primary' : 'secondary', size: 'small', Icon: 'bulb', onClick: function () { onSolution(i); } })),
      );
    }),
    okCats.length ? React.createElement(InlineNotice, { tone: 'empty', title: 'Đang ổn' }, okCats.map(function (k) { return CATS[k].ok; }).join(' · ')) : null,
    e.noData.map(function (n, ni) { return React.createElement(InlineNotice, { key: ni, tone: 'empty', title: 'Chưa đủ dữ liệu — ' + CATS[n.cat].short }, n.reason); }),
  );
}

function HistoryTab(c, e, onLogTask) {
  const lc = S.lastContact(c);
  const cms = c.commitments.slice().sort(function (a, b) { return a.status === b.status ? 0 : a.status === 'active' ? -1 : 1; });
  const tasks = c.tasks.filter(function (t) { return !t.done || (t.doneAt && U.dayDiff(t.doneAt, TODAY) <= 7); }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });

  const items = [];
  c.events.forEach(function (ev) { items.push({ at: ev.at, kind: 'ev', ev: ev }); });
  c.acct.forEach(function (a) { items.push({ at: a.at, kind: 'acct', a: a }); });
  (c.unlogged || []).forEach(function (u) { items.push({ at: u.at, kind: 'un', u: u }); });
  items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });

  const resColor = { 'Hoàn thành': 'green', 'Đã lên lịch': 'blue', 'Không liên lạc được': 'red', 'Dời lịch': 'yellow', 'Hủy': 'gray' };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' } },
    React.createElement('div', { style: { padding: 'var(--t-spacing-2) var(--t-spacing-3)', background: 'var(--t-accent-quaternary)', border: '1px solid var(--t-accent-tertiary)', borderRadius: 'var(--t-border-radius-sm)', fontSize: 'var(--t-font-size-md)' } },
      lc ? React.createElement('span', null, React.createElement('b', null, 'Lần trước (' + U.ddmm(lc.at) + ', ' + lc.channel.toLowerCase() + '): '), lc.note) : 'Chưa có lần liên hệ nào được ghi.'),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--t-spacing-3)' } },
      React.createElement(BlockCard, { title: 'Cam kết đang hiệu lực' },
        cms.length ? cms.map(function (cm) {
          const title = cm.type === 'review' ? 'Xem lại: ' + cm.cond : (cm.type === 'cutloss' ? 'Cắt lỗ ' : 'Giá mục tiêu ') + cm.t + ' @ ' + U.fmt(cm.level);
          return React.createElement('div', { key: cm.id, style: { opacity: cm.status === 'active' ? 1 : 0.5 } },
            React.createElement(KVRow, { label: title, strongLabel: true, value: cm.status === 'active' ? '' : React.createElement(Tag, { text: 'Đã thay', color: 'gray', size: 'sm' }) }),
            React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, 'Hẹn ' + U.ddmmyyyy(cm.date) + ' · ' + cm.by),
          );
        }) : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Chưa có cam kết nào.'),
      ),
      React.createElement(BlockCard, { title: 'Việc đang mở' },
        tasks.length ? tasks.map(function (t) {
          const over = !t.done && t.due.slice(0, 10) < TODAY;
          return React.createElement('div', { key: t.id, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--t-border-color-light)' } },
            React.createElement('span', { style: { flex: 1, minWidth: 0, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--t-font-color-light)' : 'var(--t-font-color-primary)' } }, t.title,
              React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: over ? 'var(--t-color-red)' : 'var(--t-font-color-light)' } }, (t.done ? 'Đã xong ' + U.ddmm(t.doneAt) : over ? 'Quá hạn · hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due) : 'Hẹn ' + U.hhmm(t.due) + ' ' + U.ddmm(t.due)) + ' · ' + t.channel)),
            t.done ? null : React.createElement(Button, { title: 'Ghi nhận', variant: 'secondary', size: 'small', onClick: function () { onLogTask && onLogTask(t); } }),
          );
        }) : React.createElement('span', { style: { color: 'var(--t-font-color-light)' } }, 'Không có việc nào đang mở.'),
      ),
    ),

    React.createElement(BlockCard, { title: 'Dòng thời gian', meta: items.length + ' mục' },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
        items.map(function (it, ii) {
          const when = U.ddmmyyyy(it.at) + ' · ' + U.hhmm(it.at);
          let body;
          if (it.kind === 'acct') body = React.createElement('div', { style: { fontSize: 'var(--t-font-size-md)' } }, React.createElement('b', null, 'Tài khoản: '), it.a.text);
          else if (it.kind === 'un') body = React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }, React.createElement(Tag, { text: it.u.dir, color: 'orange', size: 'sm' }), it.u.dur + ' · ghi âm ' + it.u.rec, React.createElement(Tag, { text: 'Chưa ghi nội dung', color: 'orange', size: 'sm' }));
          else {
            const ev = it.ev;
            body = React.createElement('div', null,
              React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
                React.createElement(Tag, { text: ev.channel, color: 'gray', size: 'sm' }),
                React.createElement('b', null, ev.broker),
                React.createElement('span', { style: { color: 'var(--t-font-color-tertiary)' } }, ev.purpose),
                React.createElement(Tag, { text: ev.result, color: resColor[ev.result] || 'gray', size: 'sm' })),
              ev.note ? React.createElement('div', { style: { marginTop: 2 } }, ev.note) : null,
              ev.decision ? React.createElement('div', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' } }, 'Kết quả: ' + ev.decision) : null,
            );
          }
          return React.createElement('div', { key: ii, style: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-2) 0', borderBottom: ii < items.length - 1 ? '1px solid var(--t-border-color-light)' : 'none' } },
            React.createElement('span', { style: { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' } }, when),
            body);
        }),
      ),
    ),
  );
}

/* Drawer phải: Tạo sự kiện / Ghi nhận (bản clean — field cốt lõi).
   prefill: { content, issueTitle, order, status, task } */
function EventPanel(props) {
  const c = props.customer, pf = props.prefill || {};
  const [content, setContent] = React.useState(pf.content || '');
  const [channel, setChannel] = React.useState(pf.channel || 'Gọi đi');
  const [status, setStatus] = React.useState(pf.status || (pf.content ? 'Hoàn thành' : 'Đã lên lịch'));
  const [result, setResult] = React.useState(pf.content ? 'Đồng ý' : '');
  const [date, setDate] = React.useState(TODAY);
  const [time, setTime] = React.useState(nowHM());
  const [order, setOrder] = React.useState(!!pf.order);
  const [rec, setRec] = React.useState('GA-' + TODAY.replace(/-/g, '') + '-' + nowHM().replace(':', ''));
  const [risk, setRisk] = React.useState(false);
  const [err, setErr] = React.useState('');

  const done = status === 'Hoàn thành';
  const CH = ['Gọi đi', 'Khách gọi đến', 'Zalo', 'Gặp trực tiếp'];
  const RES = ['Đồng ý', 'Cần suy nghĩ', 'Từ chối', 'Không liên lạc được'];

  function save() {
    if (!content.trim()) { setErr('Hãy nhập nội dung.'); return; }
    if (!date || !time) { setErr('Hãy chọn thời gian.'); return; }
    if (done && !result) { setErr('Hãy chọn kết quả.'); return; }
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
    c.events.push(evt);
    reval(c);
    const after = EV[c.id].status;
    props.onSaved(after !== before
      ? 'Đã lưu sự kiện. Trạng thái khách đổi từ "' + LEVELS[before] + '" sang "' + LEVELS[after] + '".'
      : 'Đã lưu sự kiện vào Lịch sử trao đổi. Trạng thái: ' + LEVELS[after] + '.');
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
        checkRow(risk, setRisk, 'Đã cảnh báo rủi ro', true)) : null,
    ),
  );
}

function DetailScreen(props) {
  const c = props.customer, e = EV[c.id], m = e.m;
  const [tab, setTab] = React.useState(props.initialTab || 'overview');
  const [revealed, setRevealed] = React.useState(false);
  const [solIssue, setSolIssue] = React.useState(props.initialSol && e.issues.length ? e.issues[0] : null);
  const [evtPrefill, setEvtPrefill] = React.useState(props.initialEvt ? {} : null); // object => EventPanel mở
  const [toast, setToast] = React.useState(null);
  const [, setTick] = React.useState(0); // buộc render lại sau khi engine tính lại
  React.useEffect(function () { if (!toast) return; const t = setTimeout(function () { setToast(null); }, 4200); return function () { clearTimeout(t); }; }, [toast]);
  function afterSave(msg) { setEvtPrefill(null); setSolIssue(null); setTab('history'); setToast(msg); setTick(function (x) { return x + 1; }); }

  const openTasks = c.tasks.filter(function (t) { return !t.done && t.due.slice(0, 10) < TODAY; }).length;
  const tabs = [
    { id: 'overview', label: 'Tổng quan', Icon: 'layout-dashboard' },
    { id: 'issues', label: 'Vấn đề', Icon: 'alert-triangle', pill: e.issues.length ? React.createElement(Pill, { label: '' + e.issues.length }) : null },
    { id: 'history', label: 'Lịch sử trao đổi', Icon: 'history', pill: openTasks ? React.createElement(Pill, { label: openTasks + ' quá hạn' }) : null },
  ];

  const header = React.createElement('div', { style: { padding: 'var(--t-spacing-3) var(--t-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', borderBottom: '1px solid var(--t-border-color-light)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-3)', flexWrap: 'wrap' } },
      React.createElement(Avatar, { placeholder: c.name, placeholderColorSeed: c.name, size: 'lg', type: 'rounded' }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
          React.createElement('span', { style: { fontSize: 'var(--t-font-size-lg)', fontWeight: 600 } }, c.name),
          tierTag(c.tier), levelTag(e.status, 'md')),
        React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-3)', flexWrap: 'wrap', marginTop: 4, fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-tertiary)' } },
          React.createElement('span', { style: mono }, c.acc),
          React.createElement('span', null, 'Khách từ ' + c.since),
          React.createElement('span', null, 'Phụ trách: Chị Lan'),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, 'ĐT: ', React.createElement('span', { style: mono }, revealed ? c.phone : mask(c.phone)),
            revealed ? null : React.createElement('button', { type: 'button', onClick: function () { setRevealed(true); }, style: { font: 'inherit', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--t-color-blue)', padding: 0 } }, 'Hiện')),
        ),
        c.labels.length ? React.createElement('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 } }, c.labels.map(function (l, i) { return React.createElement(Tag, { key: i, text: l, color: 'gray', size: 'sm' }); })) : null,
      ),
      React.createElement(Button, { title: 'Tạo sự kiện', accent: 'blue', Icon: 'plus', size: 'small', onClick: function () { setSolIssue(null); setEvtPrefill({}); } }),
    ),
    // KPI strip
    React.createElement('div', { style: { display: 'flex', gap: 'var(--t-spacing-2)', flexWrap: 'wrap' } },
      React.createElement(KpiTile, { label: 'NAV (tài sản ròng)', value: U.money(m.nav) }),
      React.createElement(KpiTile, { label: 'Tiền mặt', value: U.money(c.cash) }),
      React.createElement(KpiTile, { label: 'Sức mua', value: U.money(m.buying) }),
      React.createElement(KpiTile, { label: 'Đang nợ', value: c.margin ? U.money(m.debt) : '—' }),
      React.createElement(KpiTile, { label: 'Tỷ lệ ký quỹ', value: React.createElement('span', { style: { color: ratioColor(m.ratio) } }, !c.margin ? 'Không vay' : c.margin.dataMissing ? 'chưa có' : U.pct(m.ratio, 0)), sub: ratioSub(c, m) }),
    ),
  );

  const pagePanel = React.createElement(PagePanel, null,
    React.createElement(PageHeader, {
      title: 'Về sổ khách',
      icon: React.createElement(IconButton, { Icon: 'arrow-left', variant: 'light', accent: 'tertiary', size: 'small', ariaLabel: 'Về sổ khách', onClick: props.onBack }),
    }),
    React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'auto' } },
      header,
      React.createElement('div', { style: { position: 'sticky', top: 0, zIndex: 2, background: 'var(--t-background-primary)' } },
        React.createElement(Tabs, { tabs: tabs, activeId: tab, onChange: setTab })),
      React.createElement('div', { style: { padding: 'var(--t-spacing-4)' } },
        tab === 'overview' ? OverviewTab(c, e)
          : tab === 'issues' ? IssuesTab(c, e, function (issue) { setEvtPrefill(null); setSolIssue(issue); })
          : HistoryTab(c, e, function (task) { setSolIssue(null); setEvtPrefill({ task: task, content: task.title, channel: task.channel, status: 'Hoàn thành' }); })),
    ),
  );

  const toastEl = toast ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 100, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  return React.createElement(React.Fragment, null,
    pagePanel,
    solIssue ? React.createElement(SolutionPanel, {
      customer: c, issue: solIssue, onClose: function () { setSolIssue(null); },
      onConfirm: function (opt) { setSolIssue(null); setEvtPrefill({ issueTitle: solIssue.title, option: opt.title, content: 'Khách chọn: ' + opt.title, status: 'Hoàn thành', order: opt.kind === 'order' }); },
    }) : null,
    evtPrefill ? React.createElement(EventPanel, {
      customer: c, prefill: evtPrefill, onClose: function () { setEvtPrefill(null); }, onSaved: afterSave,
    }) : null,
    toastEl,
  );
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
  const parseHash = function () { const h = location.hash.slice(1); if (h.indexOf('khach-') !== 0) return { id: null }; const rest = h.slice(6).split('.'); return { id: rest[0], tab: rest[1] || null, sol: rest.indexOf('sol') >= 0, evt: rest.indexOf('evt') >= 0 }; };
  const [route, setRoute] = React.useState(parseHash());
  React.useEffect(function () {
    const onHash = function () { setRoute(parseHash()); const r = document.getElementById('root'); if (r) r.scrollTop = 0; };
    window.addEventListener('hashchange', onHash);
    return function () { window.removeEventListener('hashchange', onHash); };
  }, []);
  const open = function (id) { location.hash = 'khach-' + id; };
  const back = function () { location.hash = ''; };
  const customer = route.id ? DB.filter(function (c) { return c.id === route.id; })[0] : null;
  const [toast, setToast] = React.useState(null);
  React.useEffect(function () { if (!toast) return; const t = setTimeout(function () { setToast(null); }, 4600); return function () { clearTimeout(t); }; }, [toast]);
  const toastEl = toast ? React.createElement('div', { style: { position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 110, background: 'var(--t-background-inverted-primary)', color: 'var(--t-font-color-inverted)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', fontSize: 'var(--t-font-size-md)', boxShadow: 'var(--t-box-shadow-strong)', maxWidth: 560 } }, toast) : null;

  return React.createElement(AppLayout, { drawer: React.createElement(Drawer) },
    React.createElement(PageBody, null,
      React.createElement(ErrorBoundary, null,
        customer
          ? React.createElement(DetailScreen, { key: customer.id, customer: customer, initialTab: route.tab, initialSol: route.sol, initialEvt: route.evt, onBack: back })
          : React.createElement(ListScreen, { onOpen: open, onToast: setToast, initialBulk: location.hash === '#bulk' }),
      ),
    ),
    toastEl,
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
