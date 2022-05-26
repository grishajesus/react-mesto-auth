import logoPath from "../images/logonorm.svg";

const Header = () => {
  return (
    <header className="header">
      <img src={logoPath} alt="mesto logo" className="header__logo" />
    </header>
  );
};

export default Header;
