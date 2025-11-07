import logo from '../../assets/react.svg';
import { useNavigate } from "react-router-dom"; // Укажи правильный путь к твоему PNG-файлу

export default function Logo() {
    const navigate = useNavigate();

    return (
        <img
            src={logo}
            alt="InTech Logo"
            style={{ height: 29, width: 140, marginRight: 20 }}
            onClick={() => navigate('/')}
        />
    );
}