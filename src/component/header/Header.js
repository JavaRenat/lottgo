import "./header.scss";

export default function Header() {
  return (
    <div onClick={() => window.scroll(0, 0)} className="header">
      BITCOIN's price will predict the winner
    </div>
  );
}
