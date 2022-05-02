import logo from "../../img/Logo.svg";
function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      {/* <!-- <div className="header__line"></div> -->
<!-- todo может когда-нибунь допилю)
<div className="header__switcher">
<a href="./index.html" className="header__switcher-op header__switcher-op_selected buttonEffect">stswm</a>
<a href="./indexOr.html" className="header__switcher-op buttonEffect">origin</a>
</div> --> */}
    </header>
  );
}
export default Header;
