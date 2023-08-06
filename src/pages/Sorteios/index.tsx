import logo from "../../assets/logo.svg";
import styles from './Sorteio.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import IRifa from "../../interfaces/IRifa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sorteios() {
    const [rifas, setRifas] = useState<IRifa[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://site-de-rifas-0c8b9c43956a.herokuapp.com/raffles`)
            .then(resposta => {
                setRifas(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        function voltaInicio() {
            navigate('/', { replace: true })
        }
        window.addEventListener('popstate', voltaInicio)
        return () => {
            window.removeEventListener('popstate', voltaInicio)
        }
    }, [])

    return (
        <>
            <div className={styles.cabecalho}>
                <img src={logo} alt="logo Paido sorteio" className={styles.logo} />
                <div>
                    <Link className={styles.link} to='/'>Inicio</Link>
                    <Link className={styles.link} to='/rifas'>Rifas</Link>
                    <Link className={styles.link} to='/sorteios'>Sorteios</Link>
                    <Link className={styles.link} to='/minhasrifas'>Minhas rifas</Link>
                </div>
            </div>

            <p className={styles.titulo}>Sorteios</p>
            <div className={styles.container}>
                {rifas.map((rifa) => (
                    <button key={rifa.id} className={styles.botao_rifa}>
                        <img src={rifa.imgUrl} alt="" className={styles.imagem_rifa} />
                        <div>
                            <p className={styles.status_rifa}>Rifa aberta</p>
                            <p className={styles.quantidade_rifa}>Quantidade de números: {rifa.quantity}</p>
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}