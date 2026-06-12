import logoImg from "../../assets/logo.jpg";

const Logo = ({ className = "w-full h-full" }) => {
  return (
    <img 
      src={logoImg} 
      alt="Impeccable Unisex Salon" 
      className={`${className} object-contain rounded-xl`} 
      draggable="false"
    />
  );
};

export default Logo;