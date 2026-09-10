import type { Wedding } from "../../data/wedding";

export function Footer({ data }: { data: Wedding }) {
  return (
    <footer className="footer">
      <p>
        {data.couple.partnerOne} &amp; {data.couple.partnerTwo} · {data.date.display}
      </p>
    </footer>
  );
}
