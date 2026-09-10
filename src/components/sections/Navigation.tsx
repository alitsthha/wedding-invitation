import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Wedding } from "../../data/wedding";

export function Navigation({ data, visible }: { data: Wedding; visible: boolean }) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="nav" data-visible={visible} aria-hidden={!visible}>
      <a href="#home" className="nav__mark" onClick={handleNavClick("home")}>
        {data.couple.monogram}
      </a>
      <ul className="nav__links">
        {data.nav.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={handleNavClick(item.id)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="nav__menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div id="mobile-nav-panel" className="nav__mobile-panel" role="menu">
          {data.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={handleNavClick(item.id)} role="menuitem">
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
