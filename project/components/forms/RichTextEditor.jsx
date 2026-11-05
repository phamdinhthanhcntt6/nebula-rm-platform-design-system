import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { DropdownMenu, MenuItem, MenuItemSeparator } from '../surfaces/DropdownMenu.jsx';
// Customers page RichTextArea (Twenty AdvancedTextEditor pattern) — long-form, block-based content field.
// Borderless: 13px / 1.6 text indented 20px (--t-spacing-5) to leave room for the per-block grip handle;
// italic --t-font-color-extra-light placeholder (per-block: "Heading 1" / "List" on empty blocks).
// Hover a block → grip (small light IconButton) opens Add Block / Change Color / Delete.
// Select text → bubble toolbar (primary bg, md radius, 2px padding/gap): block-type picker, B / I / U / S / bullet / numbered,
// "…" (align, indent, colors), link.
function RichTextEditorArea({ placeholder, minHeight = 120, initialHtml, fill, readOnly, onChange }) {
  const ref = React.useRef(null);
  const [empty, setEmpty] = React.useState(!!initialHtml === false);
  React.useEffect(() => {
    if (initialHtml && ref.current && !ref.current.textContent.trim()) {
      ref.current.innerHTML = initialHtml;
      setEmpty(false);
    }
  }, [initialHtml]);
  const [bubble, setBubble] = React.useState(null);
  const [handle, setHandle] = React.useState(false);
  const [hTop, setHTop] = React.useState(0);
  const [hH, setHH] = React.useState(null);
  const [phTop, setPhTop] = React.useState(null);
  const [phText, setPhText] = React.useState('');
  const [phStyle, setPhStyle] = React.useState({});
  const blockRef = React.useRef(null);
  const bubbleRef = React.useRef(null);
  const [menu, setMenu] = React.useState(false);
  const [sub, setSub] = React.useState(null);
  const [turn, setTurn] = React.useState(false);
  const [turnLabel, setTurnLabel] = React.useState('Paragraph');
  const [pal, setPal] = React.useState(false);
  React.useEffect(() => { try { document.execCommand('defaultParagraphSeparator', false, 'div'); } catch (e) {} }, []);
  // bám mọi thay đổi selection (kể cả kéo chuột ngoài editor) để bubble luôn đúng
  const dragRef = React.useRef(false);
  React.useEffect(() => {
    const onSel = () => { if (ref.current && !dragRef.current) syncRef.current(); };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);
  // 2. bấm ra ngoài thì đóng dropdown của thanh format
  React.useEffect(() => {
    if (!turn && !pal) return;
    const onDown = (e) => { if (!bubbleRef.current || !bubbleRef.current.contains(e.target)) { setTurn(false); setPal(false); } };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [turn, pal]);
  const syncRef = React.useRef(() => {});
  const [marks, setMarks] = React.useState({});
  // mọi dòng phải là block riêng: text node trần ở gốc được bọc vào <div>
  // (nếu không, dòng đầu không có handle, Delete/căn lề/indent không áp được)
  const normalize = () => {
    const el = ref.current;
    if (!el) return;
    // heading/paragraph trong editor không mang margin mặc định của browser,
    // nếu không đổi sang heading sẽ trông như chèn thêm một dòng trống
    Array.from(el.children).forEach((c) => {
      if (/^(H1|H2|H3|P|UL|OL|DIV)$/.test(c.tagName)) { c.style.margin = '0'; c.style.padding = c.tagName === 'UL' || c.tagName === 'OL' ? '0 0 0 1.2em' : '0'; }
    });
    const strays = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!strays.length) return;
    const sel = window.getSelection();
    const off = sel && sel.anchorNode && el.contains(sel.anchorNode) ? sel.anchorOffset : null;
    const anchor = sel ? sel.anchorNode : null;
    strays.forEach((n) => {
      const d = document.createElement('div');
      n.parentNode.insertBefore(d, n);
      d.appendChild(n);
      if (anchor === n && off !== null) {
        const r = document.createRange();
        r.setStart(n, Math.min(off, n.textContent.length));
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    });
  };
  const sync = () => {
    normalize();
    const el = ref.current;
    if (el) setEmpty(!el.textContent.trim());
    if (el && onChange) onChange(el.innerHTML, el.textContent || '');
    if (el) {
      const sel0 = window.getSelection();
      let top = null;
      if (sel0 && sel0.anchorNode && el.contains(sel0.anchorNode) && sel0.isCollapsed) {
        let blk = sel0.anchorNode;
        while (blk && blk !== el && blk.parentNode !== el) blk = blk.parentNode;
        if (blk && blk !== el && blk.nodeType === 1 && !blk.textContent.trim()) {
          const host = (el.offsetParent || el).getBoundingClientRect();
          const br = blk.getBoundingClientRect();
          top = br.top - host.top;
          const tag = blk.tagName;
          const ph = tag === 'H1' ? 'Heading 1' : tag === 'H2' ? 'Heading 2' : tag === 'H3' ? 'Heading 3'
            : tag === 'UL' || tag === 'OL' ? 'List' : placeholder;
          setPhText(ph);
          setPhStyle({
            fontSize: tag === 'H1' ? '2em' : tag === 'H2' ? '1.5em' : tag === 'H3' ? '1.17em' : 'var(--t-font-size-md)',
            fontWeight: /^H[123]$/.test(tag) ? 'var(--t-font-weight-semi-bold)' : 'var(--t-font-weight-regular)',
            paddingLeft: tag === 'UL' || tag === 'OL' ? '1.2em' : 0,
          });
        }
      }
      setPhTop(top);
    }
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !el || !sel.anchorNode || !el.contains(sel.anchorNode)) { setBubble(null); return; }
    const r = sel.getRangeAt(0).getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const bw = bubbleRef.current ? bubbleRef.current.offsetWidth : 460;
    const maxLeft = Math.max(0, box.width - bw - 4);
    setBubble({ top: r.top - box.top - 34, left: Math.min(Math.max(0, r.left - box.left), maxLeft) });
    setMarks({
      bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'), strike: document.queryCommandState('strikeThrough'),
      ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList'),
    });
  };
  // mỗi block (dòng sau khi Enter) có handle riêng, bám theo block đang hover
  const trackBlock = (e) => {
    if (menu) return;
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    // chỉ nhận khi con trỏ nằm trong đúng chiều cao của một dòng/block
    if (e.clientX < box.left - 24 || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) { setHandle(false); return; }
    const kids = Array.from(el.children);
    const host = (el.offsetParent || el).getBoundingClientRect();
    if (!kids.length) {
      const lineH = parseFloat(getComputedStyle(el).lineHeight) || 21;
      if (e.clientY > box.top + lineH) { setHandle(false); return; }
      blockRef.current = null;
      setHTop(box.top - host.top);
      setHH(lineH);
      setHandle(true);
      return;
    }
    const hit = kids.find((k) => { const r = k.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom; });
    if (!hit) {
      // dòng đầu có thể là text node thuần (không phải element) → nhận theo dải dòng đầu
      const firstTop = kids[0].getBoundingClientRect().top;
      if (e.clientY >= box.top && e.clientY < firstTop) {
        blockRef.current = null;
        setHTop(box.top - host.top);
        setHH(parseFloat(getComputedStyle(el).lineHeight) || 21);
        setHandle(true);
        return;
      }
      setHandle(false);
      return;
    }
    blockRef.current = hit;
    const hr = hit.getBoundingClientRect();
    setHTop(hr.top - host.top);
    setHH(parseFloat(getComputedStyle(hit).lineHeight) || hr.height);
    setHandle(true);
  };

  const blocks = [
    { id: 'paragraph', text: 'Paragraph', icon: 'pilcrow', tag: 'div', cmd: () => document.execCommand('formatBlock', false, 'p') },
    { id: 'h1', text: 'Heading 1', icon: 'h-1', tag: 'h1', cmd: () => document.execCommand('formatBlock', false, 'h1') },
    { id: 'h2', text: 'Heading 2', icon: 'h-2', tag: 'h2', cmd: () => document.execCommand('formatBlock', false, 'h2') },
    { id: 'h3', text: 'Heading 3', icon: 'h-3', tag: 'h3', cmd: () => document.execCommand('formatBlock', false, 'h3') },
    { id: 'ul', text: 'Bullet List', icon: 'list', tag: 'ul', cmd: () => document.execCommand('insertUnorderedList') },
    { id: 'ol', text: 'Ordered List', icon: 'list-numbers', tag: 'ol', cmd: () => document.execCommand('insertOrderedList') },
  ];
  const colors = [
    { id: 'default', text: 'Default', value: 'var(--t-font-color-primary)', hex: '#141414' },
    { id: 'gray', text: 'Gray', value: 'var(--t-font-color-tertiary)', hex: '#818181' },
    { id: 'blue', text: 'Blue', value: 'var(--t-color-blue)', hex: '#3b82f6' },
    { id: 'green', text: 'Green', value: 'var(--t-tag-text-green)', hex: '#199a5d' },
    { id: 'yellow', text: 'Yellow', value: 'var(--t-tag-text-yellow)', hex: '#b78108' },
    { id: 'red', text: 'Red', value: 'var(--t-font-color-danger)', hex: '#e13e3b' },
  ];
  const apply = (fn) => { if (ref.current) ref.current.focus(); fn(); setMenu(false); setSub(null); sync(); };
  // Add Block ≠ bôi đen sửa: tạo hẳn một dòng mới bên dưới với format đã chọn
  const addBlock = (tag) => {
    const el = ref.current;
    if (!el) return;
    const node = document.createElement(tag === 'ul' || tag === 'ol' ? tag : tag);
    if (tag === 'ul' || tag === 'ol') node.appendChild(document.createElement('li'));
    else node.appendChild(document.createElement('br'));
    node.style.margin = '0';
    const after = blockRef.current && blockRef.current.parentNode === el ? blockRef.current : el.lastElementChild;
    if (after) after.insertAdjacentElement('afterend', node);
    else el.appendChild(node);
    const target = node.firstElementChild && node.tagName !== 'UL' && node.tagName !== 'OL' ? node : (node.firstElementChild || node);
    const r = document.createRange();
    r.setStart(target, 0);
    r.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    el.focus();
    setMenu(false);
    setSub(null);
    sync();
  };
  syncRef.current = sync;
  const run = (cmd) => { if (ref.current) ref.current.focus(); document.execCommand(cmd, false); sync(); };
  const actions = [
    { id: 'bold', icon: 'bold', cmd: 'bold' }, { id: 'italic', icon: 'italic', cmd: 'italic' },
    { id: 'underline', icon: 'underline', cmd: 'underline' }, { id: 'strike', icon: 'strikethrough', cmd: 'strikeThrough' },
    { id: 'ul', icon: 'list', cmd: 'insertUnorderedList' }, { id: 'ol', icon: 'list-numbers', cmd: 'insertOrderedList' },
  ];
  return (
    <div style={fill ? { position: 'relative', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' } : { position: 'relative' }} onMouseMove={readOnly ? undefined : trackBlock} onMouseLeave={() => { if (!menu) setHandle(false); }}>
      {handle || menu ? (
        <span style={{ position: 'absolute', top: hTop, left: -8, height: hH || 'calc(1.6 * var(--t-font-size-md))', zIndex: 15, display: 'inline-flex', alignItems: 'center' }}>
          <IconButton icon={<Icon name="grip-vertical" size={14} />} variant="light" accent="tertiary" size="small" ariaLabel="Tùy chọn block" onClick={() => { setSub(null); setMenu((m) => !m); }} />
          {menu ? (
            <React.Fragment>
              <span onClick={() => { setMenu(false); setSub(null); }} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
              <span onMouseMove={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 24, left: 16, zIndex: 16 }}>
                <DropdownMenu width={210}>
                  {sub === 'block' ? (
                    <React.Fragment>
                      <MenuItem text="Add Block" LeftIcon="chevron-left" onClick={() => setSub(null)} />
                      <MenuItemSeparator />
                      {blocks.map((b) => <MenuItem key={b.id} text={b.text} LeftIcon={b.icon} onClick={() => addBlock(b.tag)} />)}
                    </React.Fragment>
                  ) : sub === 'color' ? (
                    <React.Fragment>
                      <MenuItem text="Change Color" LeftIcon="chevron-left" onClick={() => setSub(null)} />
                      <MenuItemSeparator />
                      {colors.map((c) => (
                        <MenuItem key={c.id} text={c.text} onClick={() => apply(() => document.execCommand('foreColor', false, c.hex))}
                          LeftComponent={<span style={{ width: 14, height: 14, borderRadius: 'var(--t-border-radius-xs)', background: c.value, border: '1px solid var(--t-border-color-medium)' }} />} />
                      ))}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <MenuItem text="Add Block" LeftIcon="plus" hasSubMenu onClick={() => setSub('block')} />
                      <MenuItem text="Change Color" LeftIcon="color-swatch" hasSubMenu onClick={() => setSub('color')} />
                      <MenuItemSeparator />
                      <MenuItem text="Delete" LeftIcon="trash" iconColor="var(--t-font-color-danger)" accent="danger" onClick={() => { const b = blockRef.current; if (b && b.parentNode === ref.current) b.remove(); else if (ref.current) ref.current.innerHTML = ''; if (ref.current) setEmpty(!ref.current.textContent.trim()); setMenu(false); setSub(null); }} />
                    </React.Fragment>
                  )}
                </DropdownMenu>
              </span>
            </React.Fragment>
          ) : null}
        </span>
      ) : null}
      {bubble ? (
        <span ref={bubbleRef} style={{ position: 'absolute', top: bubble.top, left: bubble.left, maxWidth: '100%', zIndex: 20, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 2, padding: 2, backdropFilter: 'blur(20px)', background: 'var(--t-background-primary)', borderRadius: 'var(--t-border-radius-md)', boxShadow: '0 2px 4px 0 var(--t-background-transparent-light), 0 0 4px 0 var(--t-background-transparent-medium)' }}
          onMouseDown={(e) => e.preventDefault()} onMouseMove={(e) => e.stopPropagation()}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <span onClick={() => { setPal(false); setTurn((t) => !t); }} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: 4, height: 24, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', cursor: 'pointer', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>
              <Icon name="pilcrow" size={14} color="var(--t-font-color-tertiary)" style={{ flexShrink: 0 }} /><span style={{ whiteSpace: 'nowrap' }}>{turnLabel}</span><Icon name="chevron-down" size={12} color="var(--t-font-color-tertiary)" style={{ flexShrink: 0 }} />
            </span>
            {turn ? (
              <span style={{ position: 'absolute', top: 26, left: 0, zIndex: 21 }}>
                <DropdownMenu width={180}>
                  {blocks.map((bl) => <MenuItem key={bl.id} text={bl.text} LeftIcon={bl.icon} onClick={() => { setTurnLabel(bl.text); setTurn(false); apply(bl.cmd); }} />)}
                </DropdownMenu>
              </span>
            ) : null}
          </span>
          {actions.map((x) => (
            <IconButton key={x.id} icon={<Icon name={x.icon} size={14} />} variant="light" accent="tertiary" size="small" active={!!marks[x.id]} ariaLabel={x.id} onClick={() => run(x.cmd)} />
          ))}
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <IconButton icon={<Icon name="dots" size={14} />} variant="light" accent="tertiary" size="small" ariaLabel="Thêm" onClick={() => { setTurn(false); setPal((p) => !p); }} />
            {pal ? (
              <span onMouseMove={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 26, right: 0, zIndex: 21 }}>
                <DropdownMenu width={190}>
                  <MenuItem text="Căn trái" LeftIcon="align-left" onClick={() => { setPal(false); run('justifyLeft'); }} />
                  <MenuItem text="Căn giữa" LeftIcon="align-center" onClick={() => { setPal(false); run('justifyCenter'); }} />
                  <MenuItem text="Căn phải" LeftIcon="align-right" onClick={() => { setPal(false); run('justifyRight'); }} />
                  <MenuItemSeparator />
                  <MenuItem text="Giảm thụt lề" LeftIcon="indent-decrease" onClick={() => { setPal(false); run('outdent'); }} />
                  <MenuItem text="Tăng thụt lề" LeftIcon="indent-increase" onClick={() => { setPal(false); run('indent'); }} />
                  <MenuItemSeparator />
                  {colors.map((c) => (
                    <MenuItem key={c.id} text={c.text} onClick={() => { setPal(false); apply(() => document.execCommand('foreColor', false, c.hex)); }}
                      LeftComponent={<span style={{ width: 14, height: 14, borderRadius: 'var(--t-border-radius-xs)', background: c.value, border: '1px solid var(--t-border-color-medium)' }} />} />
                  ))}
                </DropdownMenu>
              </span>
            ) : null}
          </span>
          <IconButton icon={<Icon name="link" size={14} />} variant="light" accent="tertiary" size="small" ariaLabel="link"
            onClick={() => { const u = window.prompt('Liên kết'); if (u) document.execCommand('createLink', false, u); sync(); }} />
        </span>
      ) : null}
      <div ref={ref} contentEditable={!readOnly} suppressContentEditableWarning onInput={sync} onKeyUp={sync}
        onMouseDown={() => { dragRef.current = true; setBubble(null); }}
        onMouseUp={() => { dragRef.current = false; setTimeout(() => syncRef.current(), 0); }} onBlur={() => setBubble(null)}
        style={{ minHeight, ...(fill ? { flex: '1 1 auto' } : null), padding: '0 0 0 var(--t-spacing-5)', display: 'flow-root', outline: 'none', fontSize: 'var(--t-font-size-md)', lineHeight: 1.6, color: 'var(--t-font-color-primary)' }} />
      {!empty && phTop !== null ? <span style={{ position: 'absolute', top: phTop, left: 'var(--t-spacing-5)', fontStyle: 'italic', color: 'var(--t-font-color-extra-light)', lineHeight: 1.6, pointerEvents: 'none', ...phStyle }}>{phText || placeholder}</span> : null}
      {empty ? <span style={{ position: 'absolute', top: 0, left: 'var(--t-spacing-5)', fontStyle: 'italic', color: 'var(--t-font-color-extra-light)', fontSize: 'var(--t-font-size-md)', lineHeight: 1.6, pointerEvents: 'none' }}>{placeholder}</span> : null}
    </div>
  );
}

// Section wrapper as used on the page: 1px light top rule, 12px top padding, header = 13px/500 label + 12px light meta.
export function RichTextEditor({ label, meta, placeholder = 'Nhập nội dung…', initialHtml, minHeight = 120, fill = false, readOnly = false, onChange, style }) {
  const editor = <RichTextEditorArea placeholder={placeholder} initialHtml={initialHtml} minHeight={minHeight} fill={fill} readOnly={readOnly} onChange={onChange} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', fontFamily: 'var(--t-font-family)', color: 'var(--t-font-color-primary)', ...(label || meta ? { borderTop: '1px solid var(--t-border-color-light)', paddingTop: 'var(--t-spacing-3)' } : null), ...(fill ? { flex: '1 1 auto', minHeight: 0 } : null), ...style }}>
      {label || meta ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', flexShrink: 0 }}>
          <span style={{ flex: 1, fontSize: 'var(--t-font-size-md)', fontWeight: 500 }}>{label}</span>
          {meta ? (typeof meta === 'string' ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }}>{meta}</span> : meta) : null}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', ...(fill ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' } : null), opacity: readOnly ? 0.7 : 1 }}>{editor}</div>
    </div>
  );
}
